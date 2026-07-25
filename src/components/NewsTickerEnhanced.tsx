// ============================================================
// NewsTickerEnhanced.tsx - الشريط الإخباري المحسن مع Sanity
// Government Digital Experience Level - ذكي وديناميكي
// مكتب الأشغال العامة والطرق - محافظة ذمار
// ============================================================

import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { Bell, Zap, Clock, ArrowLeft, Megaphone, Sparkles, Pause, Play } from 'lucide-react';
import { getAnnouncements } from '../lib/sanity';

interface NewsItem {
  id: string;
  content: string;
  category: 'urgent' | 'new' | 'announcement';
  date: string;
  priority?: 'high' | 'normal' | 'low';
}

interface NewsTickerEnhancedProps {
  news?: NewsItem[];
  speed?: number;
  autoPlay?: boolean;
}

// أخبار افتراضية كاحتياطي
const DEFAULT_NEWS: NewsItem[] = [
  {
    id: '1',
    content: 'تفعيل نظام التتبع الإلكتروني للمعاملات - يمكنكم متابعة طلباتكم عبر الموقع الرسمي',
    category: 'urgent',
    date: '2026-06-25',
    priority: 'high',
  },
  {
    id: '2',
    content: 'مشاريع رصف وبنية تحتية في مديرية مغرب عنس - طول 12 كم ضمن خطة التنموذج 2026',
    category: 'new',
    date: '2026-06-20',
    priority: 'high',
  },
  {
    id: '3',
    content: 'حملة توعوية حول مخالفات البناء - نحو سلامة عمرانية محسنة',
    category: 'announcement',
    date: '2026-06-15',
    priority: 'high',
  },
  {
    id: '4',
    content: 'تحديث الدليل الإرشادي للخدمات - النسخة الإلكترونية متاحة الآن',
    category: 'new',
    date: '2026-06-10',
    priority: 'normal',
  },
  {
    id: '5',
    content: 'توسعة مركز خدمة الجمهور - شباك خدمة جديدة لتسريع الإنجاز',
    category: 'announcement',
    date: '2026-06-05',
    priority: 'normal',
  },
  {
    id: '6',
    content: 'ورشة عمل حول السلامة المهنية - يوم 15 يوليو 2026 للمقاولين',
    category: 'new',
    date: '2026-06-01',
    priority: 'normal',
  },
];

// تصنيف الأخبار - ألوان مميزة
const getCategoryStyles = (category: NewsItem['category']) => {
  switch (category) {
    case 'urgent':
      return {
        bg: 'bg-gradient-to-r from-red-600 to-red-500',
        text: 'text-white',
        label: 'عاجل',
        iconColor: 'text-red-100',
        pulse: true,
      };
    case 'new':
      return {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-500',
        text: 'text-white',
        label: 'جديد',
        iconColor: 'text-blue-100',
        pulse: false,
      };
    case 'announcement':
      return {
        bg: 'bg-gradient-to-r from-amber-600 to-amber-500',
        text: 'text-white',
        label: 'إعلان',
        iconColor: 'text-amber-100',
        pulse: false,
      };
  }
};

const getCategoryIcon = (category: NewsItem['category']) => {
  switch (category) {
    case 'urgent':
      return Zap;
    case 'new':
      return Sparkles;
    case 'announcement':
      return Megaphone;
  }
};

const NewsTickerEnhanced = memo(function NewsTickerEnhanced({
  news,
  speed = 25,
  autoPlay = true,
}: NewsTickerEnhancedProps) {
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // جلب الأخبار الديناميكية من Sanity
  useEffect(() => {
    async function fetchNews() {
      try {
        const announcements = await getAnnouncements();
        if (announcements && announcements.length > 0) {
          const newsItems = announcements.map((a: any) => ({
            id: a._id,
            content: typeof a.description === 'string' ? a.description : a.title,
            category:
              a.priority === 'high'
                ? 'urgent'
                : a.category === 'مبادرة' || a.category === 'توعوي'
                  ? 'new'
                  : 'announcement',
            date: a.date || new Date().toISOString(),
            priority: a.priority,
          }));
          setDynamicNews(newsItems);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

  // دمج الأخبار مع الأخبار الديناميكية كوقت احتياطي
  const newsItems = useMemo(() => {
    const combined = news || (dynamicNews.length > 0 ? dynamicNews : DEFAULT_NEWS);
    return [...combined, ...combined];
  }, [news, dynamicNews]);

  // التحكم بالشريط
  const togglePause = useCallback(() => setIsPaused((prev) => !prev), []);

  // حفظ/استرجاع من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('newsTickerPaused');
    if (saved !== null) {
      setIsPaused(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('newsTickerPaused', JSON.stringify(isPaused));
  }, [isPaused]);

  if (isLoading) {
    return (
      <div className="bg-gov-950/95 backdrop-blur-md border-b border-gold-400/20 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <span className="mr-2 text-gold-300 text-xs">جاري تحميل الأخبار...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gov-950/95 backdrop-blur-md border-b border-gold-400/20 py-2 px-4 overflow-hidden transition-all duration-300 hover:bg-gov-900/95 group"
      aria-label="الشريط الإخباري المتحرك"
      onMouseEnter={() => autoPlay && setIsPaused(true)}
      onMouseLeave={() => autoPlay && setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center">
        {/* المُسَمّاة الثابتة - مُنظّمة */}
        <div className="flex-shrink-0 flex items-center gap-2.5 bg-gradient-to-r from-gold-500/20 to-gold-600/15 px-4 py-2 rounded-full border border-gold-400/30 shadow-lg shadow-gold-500/10 hover:shadow-gold-400/20 transition-shadow">
          <Bell
            size={16}
            className="text-gold-400 animate-pulse"
          />
          <span className="text-xs font-bold text-gold-300 tracking-wide">الأخبار الرسمية</span>
        </div>

        {/* أزرار التحكم */}
        <div className="flex-shrink-0 flex items-center gap-1 mr-3">
          <button
            onClick={togglePause}
            className="p-1.5 rounded-full bg-gov-900/50 hover:bg-gold-500/20 text-gold-400 transition-all duration-300"
            aria-label={isPaused ? 'استمرار تشغيل الشريط' : 'إيقاف الشريط مؤقتاً'}
            title={isPaused ? 'استمرار' : 'إيقاف مؤقت'}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        </div>

        {/* الشريط المتحرك - مع تأثيرات بصرية محسّنة */}
        <div className="flex-1 overflow-hidden relative mr-4">
          <div
            className="flex items-center whitespace-nowrap will-change-transform"
            style={{
              animation: isPaused ? 'none' : `marquee ${speed}s linear infinite`,
              transform: 'translateZ(0)',
            }}
          >
            {newsItems.map((item, index) => {
              const styles = getCategoryStyles(item.category);
              const Icon = getCategoryIcon(item.category);
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="inline-flex items-center mx-8 last:mx-0"
                >
                  {/* مؤشر التصنيف البصري */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mr-3 ${styles.bg} ${styles.text} shadow-lg shadow-black/20 ${styles.pulse ? 'animate-pulse' : ''}`}
                  >
                    <Icon
                      size={12}
                      className={styles.iconColor}
                    />
                    {styles.label}
                  </span>

                  {/* محتوى الخبر */}
                  <span className="text-white/90 text-xs lg:text-sm font-medium hover:text-white transition-colors cursor-default">
                    {item.content}
                  </span>

                  {/* التاريخ */}
                  <span className="text-gold-400/70 text-[10px] mr-3 flex items-center gap-1.5 bg-gov-900/50 px-2 py-0.5 rounded-full">
                    <Clock
                      size={12}
                      className="text-gold-400/80"
                    />
                    {new Date(item.date).toLocaleDateString('ar-YE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  {/* فاصل بصري */}
                  <span
                    className="mx-4 w-1 h-3 bg-gold-400/20 rounded-full"
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* زر العرض */}
        <a
          href="#/announcements"
          className="flex-shrink-0 flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-xs font-medium transition-all duration-300 hover:gap-2.5 bg-gov-900/50 px-3 py-1.5 rounded-full hover:bg-gold-500/10"
          aria-label="عرض جميع الأخبار"
        >
          <span>المزيد من الأخبار</span>
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
});

NewsTickerEnhanced.displayName = 'NewsTickerEnhanced';
export default NewsTickerEnhanced;
export type { NewsItem };
