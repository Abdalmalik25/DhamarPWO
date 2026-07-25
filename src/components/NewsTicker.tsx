// ============================================================
// NewsTicker.tsx - الشريط الإخباري المتحرك الاحترافي
// Government Digital Experience Level - تصنيف الأخبار البصري
// مكتب الأشغال العامة والطرق - محافظة ذمار
// ============================================================

import { memo, useMemo, useState } from 'react';
import { Bell, Zap, Clock, ArrowLeft, Megaphone, Sparkles } from 'lucide-react';

interface NewsItem {
  id: string;
  content: string;
  category: 'urgent' | 'new' | 'announcement';
  date: string;
}

interface NewsTickerProps {
  news?: NewsItem[];
  speed?: number;
}

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: '1',
    content: 'تفعيل نظام التتبع الإلكتروني للمعاملات - يمكنكم متابعة طلباتكم عبر الموقع الرسمي',
    category: 'urgent',
    date: '2026-06-25',
  },
  {
    id: '2',
    content: 'مشاريع رصف وبنية تحتية في مديرية مغرب عنس - طول 12 كم ضمن خطة التنموذج 2026',
    category: 'new',
    date: '2026-06-20',
  },
  {
    id: '3',
    content: 'حملة توعوية حول مخالفات البناء - نحو سلامة عمرانية محسنة',
    category: 'announcement',
    date: '2026-06-15',
  },
  {
    id: '4',
    content: 'تحديث الدليل الإرشادي للخدمات - النسخة الإلكترونية متاحة الآن',
    category: 'new',
    date: '2026-06-10',
  },
  {
    id: '5',
    content: 'توسعة مركز خدمة الجمهور - شباك خدمة جديدة لتسريع الإنجاز',
    category: 'announcement',
    date: '2026-06-05',
  },
  {
    id: '6',
    content: 'ورشة عمل حول السلامة المهنية - يوم 15 يوليو 2026 للمقاولين',
    category: 'new',
    date: '2026-06-01',
  },
];

// تصنيف الأخبار - ألوان مميزة
const getCategoryStyles = (category: NewsItem['category']) => {
  switch (category) {
    case 'urgent':
      return {
        bg: 'bg-red-500',
        text: 'text-white',
        label: 'عاجل',
        iconColor: 'text-red-100',
      };
    case 'new':
      return {
        bg: 'bg-blue-500',
        text: 'text-white',
        label: 'جديد',
        iconColor: 'text-blue-100',
      };
    case 'announcement':
      return {
        bg: 'bg-amber-500',
        text: 'text-white',
        label: 'إعلان',
        iconColor: 'text-amber-100',
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

const NewsTicker = memo(function NewsTicker({ news, speed = 20 }: NewsTickerProps) {
  const newsItems = useMemo(() => [...(news || DEFAULT_NEWS), ...(news || DEFAULT_NEWS)], [news]);
  const [isPaused, setIsPaused] = useState(false);

  // إيقاف/استمرار الحركة عند التمرير
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="bg-gov-950/95 backdrop-blur-md border-b border-gold-400/20 py-2 px-4 overflow-hidden transition-all duration-300 hover:bg-gov-900/95"
      aria-label="الشريط الإخباري المتحرك"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto flex items-center">
        {/* المُسَمّاة الثابتة - مُنظّمة */}
        <div className="flex-shrink-0 flex items-center gap-2.5 bg-gradient-to-r from-gold-500/20 to-gold-600/15 px-4 py-2 rounded-full border border-gold-400/30 shadow-lg shadow-gold-500/10">
          <Bell
            size={16}
            className="text-gold-400 animate-pulse"
          />
          <span className="text-xs font-bold text-gold-300 tracking-wide">الأخبار الرسمية</span>
        </div>

        {/* الشريط المتحرك - مع تأثيرات بصرية محسّنة */}
        <div className="flex-1 overflow-hidden relative mr-4">
          <div
            className="flex items-center whitespace-nowrap"
            style={{
              animation: isPaused ? 'none' : `marquee ${speed}s linear infinite`,
            }}
          >
            {newsItems.map((item, index) => {
              const styles = getCategoryStyles(item.category);
              const Icon = getCategoryIcon(item.category);
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="inline-flex items-center mx-6 last:mr-0"
                >
                  {/* مؤشر التصنيف البصري */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mr-3 ${styles.bg} ${styles.text} shadow-lg shadow-black/20`}
                  >
                    <Icon
                      size={12}
                      className={styles.iconColor}
                    />
                    {styles.label}
                  </span>

                  {/* محتوى الخبر */}
                  <span className="text-white/90 text-xs lg:text-sm font-medium hover:text-white transition-colors">
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
            className="transition-transform"
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

NewsTicker.displayName = 'NewsTicker';
export default NewsTicker;
export type { NewsItem };
