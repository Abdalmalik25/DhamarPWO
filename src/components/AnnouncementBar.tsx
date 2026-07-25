// ============================================================
// AnnouncementBar.tsx - شريط أخباري متحرك احترافي متكامل مع Sanity
// تصميم مؤسسي هندسي مع تحسينات الأداء والتكامل المباشر مع CMS
// ============================================================

import { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Bell,
  Megaphone,
  Star,
  Play,
  Pause,
  AlertTriangle,
  Info,
  Award,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getAnnouncements } from '../../lib/sanity';
import type { SanityAnnouncement } from '../../lib/sanity/types';

// ============================================================
// الأنواع والواجهات
// ============================================================

export interface Announcement {
  id: string;
  icon?: React.ReactNode;
  text: string;
  tag?: string;
  tagColor?: string;
  link?: string;
  target?: '_blank' | '_self';
  type?: 'urgent' | 'info' | 'achievement' | 'warning' | 'general';
  expiresAt?: string;
  priority?: number; // للترتيب
}

interface AnnouncementBarProps {
  className?: string;
  speed?: number; // بكسل في الثانية
  autoPlay?: boolean;
  onAnnouncementClick?: (announcement: Announcement) => void;
  showControls?: boolean;
  showTag?: boolean;
  maxWidth?: string;
  revalidateInterval?: number; // ثواني (0 = لا إعادة تحميل)
  limit?: number; // عدد الإعلانات القصوى
  fallbackAnnouncements?: Announcement[]; // في حال فشل الجلب
}

// ============================================================
// دالة تحويل بيانات Sanity إلى واجهة المكون
// ============================================================

const mapSanityToAnnouncement = (item: SanityAnnouncement): Announcement => {
  // تحديد الأيقونة الافتراضية حسب النوع
  const typeIconMap: Record<string, React.ReactNode> = {
    urgent: <Megaphone size={14} />,
    info: <Bell size={14} />,
    achievement: <Award size={14} />,
    warning: <AlertTriangle size={14} />,
    general: <Info size={14} />,
  };

  // تحديد لون الوسم (tag) حسب النوع
  const tagColorMap: Record<string, string> = {
    urgent: 'bg-red-500',
    info: 'bg-blue-500',
    achievement: 'bg-emerald-500',
    warning: 'bg-amber-500',
    general: 'bg-gray-500',
  };

  return {
    id: item._id,
    text: item.title || item.text || 'إعلان',
    type: item.type || 'general',
    icon: item.icon || typeIconMap[item.type || 'general'],
    tag: item.tag || item.typeLabel,
    tagColor: item.tagColor || tagColorMap[item.type || 'general'],
    link: item.link?.url || item.link || undefined,
    target: item.link?.target || '_self',
    expiresAt: item.expiresAt,
    priority: item.priority || 0,
  };
};

// ============================================================
// المكون الرئيسي - مع دعم Sanity عبر useQuery
// ============================================================

const AnnouncementBar = memo(function AnnouncementBar({
  className = '',
  speed = 40,
  autoPlay = true,
  onAnnouncementClick,
  showControls = true,
  showTag = true,
  maxWidth = 'max-w-7xl',
  revalidateInterval = 60, // إعادة تحميل كل دقيقة
  limit = 10,
  fallbackAnnouncements,
}: AnnouncementBarProps) {
  // ============================================================
  // جلب البيانات من Sanity باستخدام React Query (أو fetch مباشر)
  // ============================================================

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    try {
      if (revalidateInterval > 0 && announcements.length > 0) {
        setIsRefetching(true);
      }
      const data = await getAnnouncements({ limit });
      const mapped = (data || [])
        .map(mapSanityToAnnouncement)
        .filter((item) => {
          if (!item.expiresAt) return true;
          return new Date(item.expiresAt) > new Date();
        })
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));
      setAnnouncements(mapped);
      setError(null);
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error('Failed to load announcements');
      setError(errObj);
      if (fallbackAnnouncements && fallbackAnnouncements.length > 0) {
        setAnnouncements(fallbackAnnouncements);
      }
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [limit, revalidateInterval, fallbackAnnouncements]);

  useEffect(() => {
    loadAnnouncements();
    if (revalidateInterval > 0) {
      const interval = setInterval(loadAnnouncements, revalidateInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [loadAnnouncements, revalidateInterval]);

  // ============================================================
  // حالات المكون
  // ============================================================
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasError, setHasError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const lastTimestamp = useRef<number>(0);

  // ============================================================
  // تأثير الظهور الأولي
  // ============================================================
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // ============================================================
  // معالجة الأخطاء
  // ============================================================
  useEffect(() => {
    if (error) {
      setHasError(true);
      console.warn('AnnouncementBar: Failed to load announcements from Sanity', error);
    } else {
      setHasError(false);
    }
  }, [error]);

  // ============================================================
  // حساب القائمة المكررة
  // ============================================================
  const activeItems = useMemo(() => {
    if (announcements.length === 0) return [];
    // إذا كان هناك إعلان واحد فقط، نكرره 3 مرات لتجنب التوقف
    if (announcements.length === 1) {
      return [...announcements, ...announcements, ...announcements];
    }
    return [...announcements, ...announcements];
  }, [announcements]);

  // ============================================================
  // معالج النقر على الإعلان
  // ============================================================
  const handleAnnouncementClick = useCallback(
    (item: Announcement) => {
      if (onAnnouncementClick) {
        onAnnouncementClick(item);
        return;
      }
      if (item.link) {
        window.open(item.link, item.target || '_self');
      }
    },
    [onAnnouncementClick],
  );

  // ============================================================
  // الحصول على الأيقونة حسب النوع
  // ============================================================
  const getIconByType = useCallback((type?: string) => {
    switch (type) {
      case 'urgent':
        return <Megaphone size={14} />;
      case 'info':
        return <Bell size={14} />;
      case 'achievement':
        return <Award size={14} />;
      case 'warning':
        return <AlertTriangle size={14} />;
      default:
        return <Info size={14} />;
    }
  }, []);

  // ============================================================
  // تأثير التحريك باستخدام requestAnimationFrame (مع تحسين الأداء)
  // ============================================================
  useEffect(() => {
    if (!trackRef.current || !containerRef.current || activeItems.length === 0) return;

    const track = trackRef.current;

    let trackWidth = 0;
    let progress = 0;

    // قياس عرض المسار
    const measureTrack = () => {
      // نأخذ نصف العرض لأننا ضاعفنا المحتوى
      const items = track.children;
      if (items.length === 0) return 0;
      const total = Array.from(items).reduce(
        (acc, child) => acc + (child as HTMLElement).offsetWidth,
        0,
      );
      return total / 2;
    };

    trackWidth = measureTrack();

    // وظيفة الرسم المحسّنة
    const animate = (timestamp: number) => {
      if (isPaused) {
        animationId.current = requestAnimationFrame(animate);
        return;
      }

      if (startTime.current === null) {
        startTime.current = timestamp;
        lastTimestamp.current = timestamp;
        animationId.current = requestAnimationFrame(animate);
        return;
      }

      const delta = (timestamp - lastTimestamp.current) / 1000;
      lastTimestamp.current = timestamp;

      // تقدم سلس
      progress += speed * delta;

      // إعادة الضبط
      if (progress >= trackWidth) {
        progress = 0;
      }

      track.style.transform = `translateX(${-progress}px)`;

      animationId.current = requestAnimationFrame(animate);
    };

    // بدء الحلقة
    animationId.current = requestAnimationFrame(animate);

    // إعادة القياس عند تغيير الحجم
    const handleResize = () => {
      trackWidth = measureTrack();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isPaused, speed, activeItems.length]);

  // ============================================================
  // إيقاف التحريك عند عدم ظهور الصفحة
  // ============================================================
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else if (!isHovering && autoPlay) {
        setIsPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoPlay, isHovering]);

  // ============================================================
  // معالجات الإيقاف المؤقت
  // ============================================================
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (autoPlay) {
      setIsPaused(false);
    }
  }, [autoPlay]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // ============================================================
  // إعادة التحميل يدوياً
  // ============================================================
  const handleRefresh = useCallback(() => {
    setIsRefetching(true);
    loadAnnouncements();
  }, [loadAnnouncements]);

  // ============================================================
  // عرض حالات التحميل والأخطاء
  // ============================================================
  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full h-12 flex items-center justify-center bg-gov-950/80 border-b border-gold-500/20',
          className,
        )}
      >
        <Loader2
          size={18}
          className="text-gold-400 animate-spin"
        />
        <span className="mr-2 text-xs text-white/50">جاري تحميل الإعلانات...</span>
      </div>
    );
  }

  if (hasError && (!fallbackAnnouncements || fallbackAnnouncements.length === 0)) {
    // عرض رسالة خطأ بسيطة مع زر إعادة المحاولة
    return (
      <div
        className={cn(
          'w-full h-12 flex items-center justify-center gap-3 bg-red-950/30 border-b border-red-500/20',
          className,
        )}
      >
        <AlertTriangle
          size={16}
          className="text-red-400"
        />
        <span className="text-xs text-red-300/70">تعذر تحميل الإعلانات</span>
        <button
          onClick={handleRefresh}
          className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
        >
          <RefreshCw
            size={12}
            className={isRefetching ? 'animate-spin' : ''}
          />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (activeItems.length === 0) {
    return null; // لا شيء للعرض
  }

  // ============================================================
  // العرض الرئيسي
  // ============================================================
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 max-h-14' : 'opacity-0 max-h-0',
        className,
      )}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        height: isVisible ? '52px' : '0',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="marquee"
      aria-label="شريط الإعلانات الرسمية - مكتب الأشغال العامة والطرق"
      dir="ltr"
    >
      {/* خلفية زخرفية دقيقة */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 50%, #d4af37 1px, transparent 1px), ' +
            'radial-gradient(circle at 90% 50%, #d4af37 1px, transparent 1px)',
          backgroundSize: '60px 60px, 40px 40px',
        }}
      />

      {/* خط ذهبي متحرك في الأسفل */}
      <div
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent animate-pulse"
        style={{ width: '100%' }}
      />

      <div
        ref={containerRef}
        className={cn('mx-auto px-3 h-full flex items-center', maxWidth)}
      >
        {/* أيقونة ثابتة مع مؤشر التحديث */}
        <div className="shrink-0 flex items-center gap-2 ml-3 mr-1 text-gold-400">
          <Megaphone
            size={16}
            className="hidden sm:block"
          />
          <span className="text-[10px] font-bold tracking-wider text-gold-400/70 hidden sm:inline">
            أخبار
          </span>

          {/* مؤشر التحديث */}
          {isRefetching && (
            <Loader2
              size={12}
              className="text-gold-400 animate-spin ml-1"
            />
          )}
        </div>

        {/* المسار المتحرك */}
        <div className="flex-1 overflow-hidden h-full relative">
          <div
            ref={trackRef}
            className="flex items-center gap-6 h-full whitespace-nowrap will-change-transform"
            style={{ display: 'inline-flex' }}
          >
            {activeItems.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                className={cn(
                  'flex items-center gap-2 shrink-0 h-full group transition-colors',
                  'hover:text-gold-300 text-white/90',
                  item.link && 'cursor-pointer',
                )}
                onClick={() => handleAnnouncementClick(item)}
                aria-label={`إعلان: ${item.text}`}
                type="button"
              >
                <span className="text-gold-400/80 group-hover:text-gold-300 transition-colors">
                  {item.icon || getIconByType(item.type)}
                </span>
                <span className="text-[11px] sm:text-xs font-medium truncate max-w-[180px] sm:max-w-[280px] md:max-w-[400px] lg:max-w-[600px]">
                  {item.text}
                </span>

                {showTag && item.tag && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm',
                      item.tagColor || 'bg-gov-600',
                    )}
                  >
                    {item.tag}
                  </span>
                )}

                {item.link && (
                  <ExternalLink
                    size={12}
                    className="text-gold-400/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}

                <span
                  className="w-px h-4 bg-gold-400/20 last:hidden"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="shrink-0 flex items-center gap-1 mr-2">
          {showControls && (
            <>
              <button
                onClick={togglePause}
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                  'bg-white/5 hover:bg-white/10 border border-white/10',
                  'focus:outline-none focus:ring-2 focus:ring-gold-400/40',
                )}
                aria-label={isPaused ? 'استئناف الشريط' : 'إيقاف الشريط مؤقتاً'}
                title={isPaused ? 'استئناف' : 'إيقاف مؤقت'}
              >
                {isPaused ? (
                  <Play
                    size={12}
                    className="text-gold-400"
                  />
                ) : (
                  <Pause
                    size={12}
                    className="text-gold-400"
                  />
                )}
              </button>

              {/* زر التحديث اليدوي - يظهر عند وجود خطأ أو عند التحميل */}
              {hasError && (
                <button
                  onClick={handleRefresh}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10"
                  aria-label="إعادة تحميل الإعلانات"
                  title="تحديث"
                >
                  <RefreshCw
                    size={12}
                    className={cn('text-gold-400', isRefetching && 'animate-spin')}
                  />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

AnnouncementBar.displayName = 'AnnouncementBar';
export default AnnouncementBar;
