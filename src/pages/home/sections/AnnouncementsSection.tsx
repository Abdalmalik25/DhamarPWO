// ============================================================
// AnnouncementsSection.tsx - نظام الإعلانات الهندسية المتقدم (v2.0)
// مصمم خصيصًا لمكتب الأشغال العامة والطرق
// ============================================================

import { memo, useState, useMemo, useCallback } from 'react';
import {
  Bell,
  Calendar,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Eye,
  Info,
  Award,
  HardHat,
  Route,
  FileText,
  AlertCircle,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import type { Page } from '../../../types/page';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'high' | 'normal' | 'low';
  category?: 'إدارية' | 'هندسية' | 'طرق' | 'بناء' | 'عامة';
  isPinned?: boolean;
  views?: number;
  attachments?: { name: string; url: string }[];
}

export interface AnnouncementsSectionProps {
  /** مصفوفة الإعلانات (إذا لم تُمرر، سيتم استخدام البيانات الافتراضية) */
  announcements?: Announcement[];
  /** دالة التنقل */
  onNavigate: (page: Page) => void;
  /** حالة التحميل (للعرض من API) */
  isLoading?: boolean;
  /** حالة الخطأ */
  error?: string | null;
  /** نوع التصميم */
  theme?: 'light' | 'dark';
  /** العنوان الرئيسي */
  title?: string;
  /** النص الفرعي */
  subtitle?: string;
  /** هل تريد إظهار زر "عرض الكل"؟ */
  showViewAll?: boolean;
  /** هل تريد تشغيل التمرير التلقائي؟ */
  autoSlide?: boolean;
  /** الفاصل الزمني للتمرير التلقائي (بالمللي ثانية) */
  slideInterval?: number;
  /** عدد العناصر في الصفحة الواحدة */
  itemsPerPage?: number;
  /** هل تريد إخفاء الإحصائيات؟ */
  hideStats?: boolean;
  /** فئات CSS إضافية */
  className?: string;
}

// ============================================================
// 2. البيانات الافتراضية (Mock Data - للمكتب)
// ============================================================

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'بدء أعمال صيانة طريق ذمار - صنعاء',
    description:
      'تبدأ أعمال الصيانة الجذرية للطريق الرابط بين محافظة ذمار والعاصمة صنعاء اعتبارًا من يوم السبت المقبل، مع توجيه حركة المرور إلى الطرق البديلة.',
    date: '2026-07-01',
    priority: 'high',
    category: 'طرق',
    isPinned: true,
    views: 1250,
  },
  {
    id: '2',
    title: 'إصدار الدليل الإرشادي للخدمات (نسخة 2026)',
    description:
      'تم إصدار الدليل الإرشادي المحدث للخدمات الهندسية والإدارية، ويشمل شرحًا مفصلاً لـ 68 خدمة مع الوثائق المطلوبة والرسوم.',
    date: '2026-06-25',
    priority: 'normal',
    category: 'إدارية',
    views: 850,
  },
  {
    id: '3',
    title: 'تعميم: مواعيد استقبال المراجعين',
    description:
      'نذكر جميع المراجعين بأن أوقات استقبال المعاملات هي من السبت إلى الأربعاء، من الساعة 8:00 صباحًا إلى 3:00 مساءً.',
    date: '2026-06-20',
    priority: 'normal',
    category: 'إدارية',
    isPinned: true,
    views: 320,
  },
  {
    id: '4',
    title: 'إعلان مناقصة: مشروع توسعة شارع الثلاثين',
    description:
      'تعلن إدارة الطرق عن مناقصة عامة لتوسعة وتأهيل شارع الثلاثين بمدينة ذمار، المواصفات متاحة في إدارة المشتريات.',
    date: '2026-06-15',
    priority: 'low',
    category: 'طرق',
    views: 560,
  },
  {
    id: '5',
    title: 'إطلاق منصة تتبع المعاملات الإلكترونية',
    description:
      'تم إطلاق المنصة الإلكترونية الجديدة لتتبع حالة المعاملات. يمكن للمواطنين الآن متابعة طلباتهم عبر الإنترنت.',
    date: '2026-06-10',
    priority: 'high',
    category: 'إدارية',
    isPinned: true,
    views: 2100,
  },
  {
    id: '6',
    title: 'دورة تدريبية: مهارات السلامة في مواقع البناء',
    description:
      'ينظم مكتب الأشغال دورة تدريبية مجانية للمقاولين والعمال حول إجراءات السلامة المهنية في مواقع البناء.',
    date: '2026-06-05',
    priority: 'low',
    category: 'بناء',
    views: 180,
  },
];

// ============================================================
// 3. المكونات الفرعية (Sub-components)
// ============================================================

// أيقونة الأولوية
// أيقونة التصنيف
const CategoryIcon = memo(({ category }: { category?: string }) => {
  switch (category) {
    case 'طرق':
      return (
        <Route
          size={12}
          className="text-blue-500"
        />
      );
    case 'بناء':
      return (
        <HardHat
          size={12}
          className="text-amber-500"
        />
      );
    case 'إدارية':
      return (
        <FileText
          size={12}
          className="text-emerald-500"
        />
      );
    default:
      return (
        <Award
          size={12}
          className="text-gold-500"
        />
      );
  }
});

// شريط التقدم التلقائي
// حالة التحميل (Skeleton)
const AnnouncementSkeleton = memo(({ count = 3 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse"
      >
        <div className="bg-gray-200 rounded-2xl p-5 h-48">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-16 h-4 bg-gray-300 rounded-full" />
            <div className="w-12 h-4 bg-gray-300 rounded-full" />
          </div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-300 rounded w-full mb-2" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
        </div>
      </div>
    ))}
  </>
));

// ============================================================
// 4. المكون الرئيسي (Main Component)
// ============================================================

const AnnouncementsSection = memo(function AnnouncementsSection({
  announcements: externalAnnouncements,
  onNavigate,
  isLoading = false,
  error = null,
  theme = 'light',
  title = 'آخر الإعلانات والمستجدات',
  subtitle = 'أهم الأخبار والإعلانات الرسمية لمكتب الأشغال',
  showViewAll = true,
  itemsPerPage = 3,
  hideStats = false,
  className = '',
}: AnnouncementsSectionProps) {
  // ============================================================
  // 4.1. الحالات الداخلية (Internal State)
  // ============================================================

  const [currentPage, setCurrentPage] = useState(0);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'normal' | 'low'>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // ============================================================
  // 4.2. دمج البيانات (Data Merging)
  // ============================================================

  const announcements = useMemo(() => {
    return externalAnnouncements || DEFAULT_ANNOUNCEMENTS;
  }, [externalAnnouncements]);

  // ============================================================
  // 4.3. التصفية والترتيب (Filtering & Sorting)
  // ============================================================

  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements];

    // تصفية حسب الأولوية
    if (filterPriority !== 'all') {
      filtered = filtered.filter((item) => item.priority === filterPriority);
    }

    // الترتيب: المثبتة أولاً، ثم الأحدث
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [announcements, filterPriority]);

  const featuredAnnouncement = useMemo(() => {
    if (filteredAnnouncements.length === 0) return null;
    return filteredAnnouncements.find((item) => item.isPinned) ?? filteredAnnouncements[0];
  }, [filteredAnnouncements]);

  const paginatedAnnouncements = useMemo(() => {
    const pageItems = filteredAnnouncements.filter((item) => item.id !== featuredAnnouncement?.id);
    const start = currentPage * itemsPerPage;
    return pageItems.slice(start, start + itemsPerPage);
  }, [filteredAnnouncements, currentPage, itemsPerPage, featuredAnnouncement]);

  const totalPages = useMemo(() => {
    const paginationBase = filteredAnnouncements.length - (featuredAnnouncement ? 1 : 0);
    return Math.max(1, Math.ceil(paginationBase / itemsPerPage));
  }, [filteredAnnouncements.length, featuredAnnouncement, itemsPerPage]);

  const hasAnnouncements = filteredAnnouncements.length > 0;

  // ============================================================
  // 4.5. إحصائيات سريعة (Stats)
  // ============================================================

  const stats = useMemo(() => {
    return {
      total: announcements.length,
      high: announcements.filter((a) => a.priority === 'high').length,
      pinned: announcements.filter((a) => a.isPinned).length,
    };
  }, [announcements]);

  // ============================================================
  // 4.7. معالجات الأحداث (Event Handlers)
  // ============================================================

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(0, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  }, [totalPages]);

  const handleFilterChange = useCallback((priority: 'all' | 'high' | 'normal' | 'low') => {
    setFilterPriority(priority);
    setCurrentPage(0);
  }, []);

  // ============================================================
  // 4.8. ألوان الثيم (Theming)
  // ============================================================

  const themeClasses = useMemo(() => {
    if (theme === 'dark') {
      return {
        section: 'bg-gray-900 border-gray-800',
        text: 'text-white',
        card: 'bg-gray-800 border-gray-700 hover:border-gray-600',
        muted: 'text-gray-400',
        stats: 'bg-gray-800/50 border-gray-700',
      };
    }
    return {
      section: 'bg-white border-gray-100',
      text: 'text-gray-800',
      card: 'bg-white border-gray-100 hover:border-gray-200',
      muted: 'text-gray-500',
      stats: 'bg-gray-50 border-gray-200',
    };
  }, [theme]);

  // ============================================================
  // 4.9. التصيير (Rendering)
  // ============================================================

  return (
    <section
      className={`py-16 ${themeClasses.section} border-b relative overflow-hidden ${className}`}
      aria-label="آخر الإعلانات والمستجدات"
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== الهيدر ===== */}
        <ScrollReveal>
          <div className="text-center mb-12">
            {/* شعار صغير */}
            <div className="inline-flex items-center justify-center mb-5">
              <div
                className="relative w-16 h-16 rounded-2xl bg-gold-50 ring-2 ring-gold-200/70 shadow-inner"
                aria-hidden="true"
              />
            </div>

            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500/10 to-gold-600/5 backdrop-blur-md border border-gold-400/20 text-gold-600 px-5 py-2 rounded-full text-sm font-bold mb-5 hover:shadow-lg hover:shadow-gold-500/10 transition-all duration-300">
              <Newspaper
                size={16}
                className="text-gold-500"
              />
              {title}
              <Bell
                size={14}
                className="text-gold-500 animate-pulse"
              />
            </div>

            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${themeClasses.text}`}>{title}</h2>
            <p className={`${themeClasses.muted} max-w-2xl mx-auto`}>{subtitle}</p>
          </div>
        </ScrollReveal>

        {/* ===== الإحصائيات ===== */}
        {!hideStats && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${themeClasses.stats}`}
            >
              <span className="text-2xl font-bold text-gov-600">{stats.total}</span>
              <span className={`text-sm ${themeClasses.muted}`}>إجمالي الإعلانات</span>
            </div>
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${themeClasses.stats}`}
            >
              <span className="text-2xl font-bold text-red-500">{stats.high}</span>
              <span className={`text-sm ${themeClasses.muted}`}>إعلانات عاجلة</span>
            </div>
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${themeClasses.stats}`}
            >
              <span className="text-2xl font-bold text-amber-500">{stats.pinned}</span>
              <span className={`text-sm ${themeClasses.muted}`}>إعلانات مثبتة</span>
            </div>
          </div>
        )}

        {/* ===== أزرار التصفية ===== */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {['all', 'high', 'normal', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => handleFilterChange(p as typeof filterPriority)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                filterPriority === p
                  ? 'bg-gov-600 text-white shadow-md'
                  : `${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} hover:bg-gov-50 hover:text-gov-600`
              }`}
            >
              {p === 'all' && 'الكل'}
              {p === 'high' && 'عاجل'}
              {p === 'normal' && 'عادي'}
              {p === 'low' && 'منخفض'}
            </button>
          ))}
        </div>

        {/* ===== حالة التحميل ===== */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnnouncementSkeleton count={itemsPerPage} />
          </div>
        )}

        {/* ===== حالة الخطأ ===== */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle
              size={48}
              className="mx-auto text-red-500 mb-4 opacity-50"
            />
            <h3 className="text-xl font-bold text-gray-700 mb-2">عذرًا، حدث خطأ</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {/* ===== شبكة الإعلانات ===== */}
        {!isLoading && !error && (
          <div
            className="grid gap-8 xl:grid-cols-[1.45fr_0.95fr]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ScrollReveal>
              <div
                className="relative rounded-[2rem] border border-gov-200 bg-gradient-to-br from-white via-gov-50 to-gov-100 p-8 shadow-xl shadow-gov-500/10 overflow-hidden"
                role="region"
                aria-labelledby="announcements-featured-heading"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,230,165,0.35),_transparent_38%)] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-gov-50 px-4 py-2 text-sm font-semibold text-gov-700 ring-1 ring-gov-200">
                      <Newspaper size={16} />
                      أعلى الأخبار الرسمية
                    </div>
                    <div className="text-sm text-gray-500">
                      {hasAnnouncements
                        ? `${filteredAnnouncements.length} إعلان`
                        : 'لا توجد إعلانات في الوقت الحالي'}
                    </div>
                  </div>

                  {hasAnnouncements ? (
                    <>
                      <div className="space-y-5">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gov-700/80">
                            إعلان مميز
                          </p>
                          <h3
                            id="announcements-featured-heading"
                            className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl"
                          >
                            {featuredAnnouncement?.title}
                          </h3>
                          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600">
                            {featuredAnnouncement?.description}
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-200">
                            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                              التاريخ
                            </p>
                            <p className="mt-3 text-sm font-semibold text-gray-900">
                              {new Date(featuredAnnouncement?.date ?? '').toLocaleDateString(
                                'ar-SA',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                },
                              )}
                            </p>
                          </div>
                          <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-200">
                            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                              أولوية
                            </p>
                            <p className="mt-3 text-sm font-semibold text-gray-900 capitalize">
                              {featuredAnnouncement?.priority === 'high'
                                ? 'عاجل'
                                : featuredAnnouncement?.priority === 'low'
                                  ? 'منخفض'
                                  : 'عادي'}
                            </p>
                          </div>
                          <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-200">
                            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                              التصنيف
                            </p>
                            <p className="mt-3 text-sm font-semibold text-gray-900">
                              {featuredAnnouncement?.category ?? 'عام'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-4">
                          <button
                            onClick={() => onNavigate('services')}
                            className="inline-flex items-center gap-2 rounded-full bg-gov-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gov-700/20 transition hover:bg-gov-800"
                          >
                            <Eye size={16} />
                            عرض تفاصيل الإعلان
                          </button>
                          <button
                            onClick={() => setFilterPriority('all')}
                            className="inline-flex items-center gap-2 rounded-full border border-gov-200 bg-white px-6 py-3 text-sm font-semibold text-gov-700 transition hover:border-gov-300 hover:bg-gov-50"
                          >
                            <Info size={16} />
                            العودة إلى جميع الإعلانات
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-gray-300 bg-white/80 p-8 text-center text-sm text-gray-500">
                      لا توجد إعلانات بعد. سيتم عرض أحدث الأخبار الرسمية فور توفرها.
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              {paginatedAnnouncements.length === 0 ? (
                <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm">
                  <Bell
                    size={36}
                    className="mx-auto mb-4 text-gov-500"
                  />
                  <p className="font-semibold">لا توجد إعلانات إضافية</p>
                  <p className="mt-2 text-sm text-gray-500">
                    حاول تغيير مرشح الأولوية أو قم بالتحقق لاحقاً.
                  </p>
                </div>
              ) : (
                paginatedAnnouncements.map((item, i) => (
                  <ScrollReveal
                    key={item.id}
                    delay={i * 80}
                  >
                    <article
                      className={`${themeClasses.card} rounded-3xl border p-5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-gov-500/10 relative overflow-hidden`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                              <Calendar
                                size={12}
                                className="text-gov-600"
                              />
                              {new Date(item.date).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {item.category && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gov-50 px-2.5 py-1 text-xs font-semibold text-gov-700">
                                <CategoryIcon category={item.category} />
                                {item.category}
                              </span>
                            )}
                          </div>
                          <h4 className={`text-lg font-bold ${themeClasses.text} line-clamp-2`}>
                            {item.title}
                          </h4>
                          <p
                            className={`${themeClasses.muted} text-sm leading-relaxed line-clamp-3`}
                          >
                            {item.description}
                          </p>
                        </div>

                        {item.priority === 'high' && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-red-600">
                            عاجل
                          </span>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <Eye size={14} />
                          {item.views !== undefined
                            ? `${item.views.toLocaleString()} مشاهدة`
                            : 'غير متوفر'}
                        </span>
                        <button
                          onClick={() => onNavigate('services')}
                          className="inline-flex items-center gap-2 rounded-full bg-gov-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gov-700"
                        >
                          <ArrowLeft size={12} />
                          عرض المزيد
                        </button>
                      </div>
                    </article>
                  </ScrollReveal>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===== الترقيم (Pagination) ===== */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-xl border ${theme === 'dark' ? 'border-gray-700 hover:border-gray-600 bg-gray-800' : 'border-gray-200 hover:border-gov-300 bg-white'} hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gov-50 group`}
              aria-label="السابق"
            >
              <ChevronRight
                size={16}
                className="text-gov-600 group-hover:-translate-x-0.5 transition-transform"
              />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentPage(idx);
                    setSlideProgress(0);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentPage
                      ? 'bg-gov-600 w-8 h-2.5 shadow-md shadow-gov-600/30'
                      : `${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} w-2.5 h-2.5`
                  }`}
                  aria-label={`الصفحة ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-xl border ${theme === 'dark' ? 'border-gray-700 hover:border-gray-600 bg-gray-800' : 'border-gray-200 hover:border-gov-300 bg-white'} hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gov-50 group`}
              aria-label="التالي"
            >
              <ChevronLeft
                size={16}
                className="text-gov-600 group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        )}

        {/* ===== عرض الكل ===== */}
        {showViewAll && (
          <ScrollReveal delay={200}>
            <div className="text-center mt-8">
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gov-50 to-gov-100 hover:from-gov-100 hover:to-gov-200 text-gov-700 rounded-xl font-bold text-sm transition-all duration-300 border border-gov-200 hover:border-gov-400 hover:shadow-lg hover:shadow-gov-500/10 group"
              >
                <Bell
                  size={16}
                  className="group-hover:animate-pulse"
                />
                عرض جميع الإعلانات
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
});

AnnouncementsSection.displayName = 'AnnouncementsSection';

export default AnnouncementsSection;
