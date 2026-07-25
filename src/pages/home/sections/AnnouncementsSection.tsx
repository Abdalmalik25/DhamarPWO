// ============================================================
// AnnouncementsSection.tsx v6.0 - Platinum Live Updates
// الإعلانات - تحديثات مباشرة مع auto-slide وتأثيرات 3D
// ============================================================

import { memo, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { Megaphone, Calendar, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  isImportant?: boolean;
  isNew?: boolean;
  image?: string;
  link?: string;
}

export interface AnnouncementsSectionProps {
  announcements?: Announcement[];
  onNavigate?: (page: string) => void;
  theme?: 'light' | 'dark';
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  autoSlide?: boolean;
  slideInterval?: number;
  className?: string;
}

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'تحديث نظام إصدار التراخيص الإلكترونية',
    excerpt: 'تم تحديث المنصة الإلكترونية لإصدار تراخيص البناء بمميزات جديدة لتسهيل الإجراءات للمواطنين.',
    date: '2026-01-15',
    category: 'تقنية',
    isImportant: true,
    isNew: true,
  },
  {
    id: '2',
    title: 'إطلاق دليل المخططات الحضرية الجديد',
    excerpt: 'تم إطلاق الدليل الجديد للمخططات الحضرية لمدينة ذمار مع التحديثات الأخيرة.',
    date: '2026-01-10',
    category: 'مخططات',
    isNew: true,
  },
  {
    id: '3',
    title: 'تنظيم ورشة عمل حول السلامة المهنية',
    excerpt: 'تنظيم ورشة عمل شاملة حول معايير السلامة المهنية في مواقع البناء والتشييد.',
    date: '2026-01-05',
    category: 'تكوين',
  },
  {
    id: '4',
    title: 'تحديث قائمة الوثائق المطلوبة',
    excerpt: 'تم تحديث قائمة الوثائق المطلوبة لإصدار التراخيص العمرانية حسب اللوائح الجديدة.',
    date: '2025-12-28',
    category: 'خدمات',
  },
];

const CategoryBadge = memo(function CategoryBadge({ category, isImportant }: { category: string; isImportant?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gov-100 text-gov-700">
        {category}
      </span>
      {isImportant && (
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
          <Megaphone size={10} />
          مهم
        </span>
      )}
    </div>
  );
});

const AnnouncementCard3D = memo(function AnnouncementCard3D({
  announcement,
  onNavigate,
  theme,
}: {
  announcement: Announcement;
  onNavigate: (page: string) => void;
  theme?: 'light' | 'dark';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`group relative card-3d cursor-pointer ${
        isDark ? 'text-gray-100' : 'text-gray-800'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onNavigate(announcement.link || 'announcements')}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="card-3d-inner relative h-full"
        style={{
          transform: isHovered
            ? `rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 3}deg) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* الخلفية */}
        <div className={`absolute inset-0 rounded-3xl border transition-all duration-500 ${
          isDark
            ? 'bg-gray-800/90 border-gray-700/50'
            : 'bg-white/90 border-gray-100/50'
        } ${isHovered ? 'shadow-2xl' : 'shadow-lg'}`} />

        {/* تأثير اللمعان */}
        <div
          className="card-3d-shine"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
              : 'none',
          }}
        />

        <div className="relative p-6">
          {/* التاريخ والشارة */}
          <div className="flex items-center justify-between mb-4">
            <CategoryBadge category={announcement.category} isImportant={announcement.isImportant} />
            {announcement.isNew && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                جديد
              </span>
            )}
          </div>

          {/* العنوان */}
          <h3 className={`text-base font-bold mb-2 line-clamp-2 transition-colors duration-300 ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {announcement.title}
          </h3>

          {/* المقتطف */}
          <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {announcement.excerpt}
          </p>

          {/* التاريخ والرابط */}
          <div className={`flex items-center justify-between text-xs border-t pt-3 ${
            isDark ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'
          }`}>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{announcement.date}</span>
            </div>
            <div className="flex items-center gap-1 text-gov-600 font-medium">
              <span>قراءة المزيد</span>
              <ArrowLeft size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const AnnouncementsSection = memo(function AnnouncementsSection({
  announcements: externalAnnouncements,
  onNavigate,
  theme = 'light',
  title = 'آخر الإعلانات والمستجدات',
  subtitle = 'تابع أحدث الأخبار والإعلانات الرسمية من المكتب',
  showViewAll = false,
  autoSlide = false,
  slideInterval = 5000,
  className = '',
}: AnnouncementsSectionProps) {
  const announcements = useMemo(() => externalAnnouncements || DEFAULT_ANNOUNCEMENTS, [externalAnnouncements]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!autoSlide || announcements.length <= 1) return;

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }
    }, slideInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSlide, slideInterval, isPaused, announcements.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  }, [announcements.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  }, [announcements.length]);

  return (
    <section className={`py-16 lg:py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-hidden ${className}`}>
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* الهيدر */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gov-50 border border-gov-100 px-4 py-2 rounded-full mb-4">
              <Megaphone size={18} className="text-gov-600" />
              <span className="text-sm font-bold text-gov-700">آخر المستجدات</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* شبكة الإعلانات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement, idx) => (
            <ScrollReveal key={announcement.id} delay={idx * 80}>
              <AnnouncementCard3D
                announcement={announcement}
                onNavigate={onNavigate || (() => {})}
                theme={theme}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* أزرار التنقل */}
        {autoSlide && announcements.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="w-12 h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
              aria-label="السابق"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
            
            <div className="flex items-center gap-2">
              {announcements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-gold-500 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`الإعلان ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="w-12 h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
              aria-label="التالي"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
          </div>
        )}

        {/* زر عرض المزيد */}
        {showViewAll && (
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate?.('announcements')}
              className="px-8 py-3 bg-gradient-to-r from-gov-600 to-gov-700 hover:from-gov-700 hover:to-gov-800 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
            >
              <ExternalLink size={18} />
              عرض جميع الإعلانات
            </button>
          </div>
        )}
      </div>
    </section>
  );
});

AnnouncementsSection.displayName = 'AnnouncementsSection';
export default AnnouncementsSection;