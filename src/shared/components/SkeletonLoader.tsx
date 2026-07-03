// ============================================================
// src/shared/components/SkeletonLoader.tsx - نظام الهيكل العظمي المؤسسي
// متوافق مع: React 19 | Tailwind CSS v4 | RTL/LTR
// ============================================================

import { memo, forwardRef } from 'react';

// ============================================================
// 1. مكونات Skeleton الأساسية (Core Skeleton)
// ============================================================

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 't-xl' | 'b-xl';
  animation?: 'none' | 'pulse' | 'wave' | 'shimmer';
  /** هل العنصر في وضع مظلم؟ (إن لم يتم تحديده، سيتم اكتشافه تلقائياً) */
  darkMode?: boolean;
}

const Skeleton = memo(
  forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
    { className = '', width, height, rounded = 'md', animation = 'wave', darkMode },
    ref,
  ) {
    // فئات التدوير (مع دعم الأطراف)
    const roundedClasses = {
      'none': '',
      'sm': 'rounded-sm',
      'md': 'rounded-md',
      'lg': 'rounded-lg',
      'xl': 'rounded-xl',
      '2xl': 'rounded-2xl',
      'full': 'rounded-full',
      't-xl': 'rounded-t-xl',
      'b-xl': 'rounded-b-xl',
    };

    // أنماط الرسوم المتحركة
    const animationClasses = {
      none: '',
      pulse: 'animate-pulse',
      wave: 'animate-shimmer',
      shimmer: 'animate-shimmer-slow',
    };

    // ألوان الخلفية (مع دعم الوضع المظلم)
    const bgDark = darkMode
      ? 'dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700'
      : '';

    return (
      <div
        ref={ref}
        className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${roundedClasses[rounded]} ${animationClasses[animation]} ${bgDark} ${className}`}
        style={{ width, height }}
        aria-hidden="true"
      />
    );
  }),
);

// ============================================================
// 2. Skeleton للإحصائيات (Stats Skeleton)
// ============================================================

interface StatsSkeletonProps {
  count?: number;
  cols?: 2 | 3 | 4 | 6;
  darkMode?: boolean;
}

export const StatsSkeleton = memo(function StatsSkeleton({
  count = 6,
  cols = 3,
  darkMode,
}: StatsSkeletonProps) {
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  };

  return (
    <div className={`grid ${gridClasses[cols]} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center animate-pulse
            ${darkMode ? 'dark:bg-gray-800/30 dark:border-gray-700' : ''}
          `}
        >
          <Skeleton
            className="w-8 h-8 mx-auto mb-2"
            rounded="md"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-8 w-20 mx-auto mb-1"
            rounded="md"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-3 w-24 mx-auto"
            rounded="md"
            darkMode={darkMode}
          />
        </div>
      ))}
    </div>
  );
});

// ============================================================
// 3. Skeleton لبطاقات الخدمة (Service Cards)
// ============================================================

interface ServiceCardSkeletonProps {
  count?: number;
  cols?: 1 | 2 | 3 | 4;
  darkMode?: boolean;
}

export const ServiceCardSkeleton = memo(function ServiceCardSkeleton({
  count = 6,
  cols = 3,
  darkMode,
}: ServiceCardSkeletonProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[cols]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            ${darkMode ? 'dark:bg-gray-800' : 'bg-gray-50'} 
            rounded-xl border ${darkMode ? 'dark:border-gray-700' : 'border-gray-100'} p-6 animate-pulse
          `}
        >
          <div className="flex items-start gap-4">
            <Skeleton
              className="w-14 h-14 shrink-0"
              rounded="xl"
              darkMode={darkMode}
            />
            <div className="flex-1 space-y-3">
              <Skeleton
                className="h-5 w-3/4"
                rounded="md"
                darkMode={darkMode}
              />
              <Skeleton
                className="h-4 w-full"
                rounded="md"
                darkMode={darkMode}
              />
              <Skeleton
                className="h-4 w-2/3"
                rounded="md"
                darkMode={darkMode}
              />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t ${darkMode ? 'dark:border-gray-700' : 'border-gray-100'}">
            <Skeleton
              className="h-4 w-24"
              rounded="md"
              darkMode={darkMode}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

// ============================================================
// 4. Skeleton للإعلانات (Announcement Cards)
// ============================================================

interface AnnouncementCardSkeletonProps {
  count?: number;
  darkMode?: boolean;
}

export const AnnouncementCardSkeleton = memo(function AnnouncementCardSkeleton({
  count = 3,
  darkMode,
}: AnnouncementCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            ${darkMode ? 'dark:bg-gov-900/30' : 'bg-gov-50'} 
            border ${darkMode ? 'dark:border-gov-800' : 'border-gov-100'} rounded-xl p-4 animate-pulse
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <Skeleton
              className="h-3 w-20"
              rounded="full"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-3 w-16"
              rounded="full"
              darkMode={darkMode}
            />
          </div>
          <Skeleton
            className="h-5 w-full mb-2"
            rounded="md"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-4 w-4/5"
            rounded="md"
            darkMode={darkMode}
          />
        </div>
      ))}
    </>
  );
});

// ============================================================
// 5. Skeleton للأخبار (News Cards)
// ============================================================

interface NewsCardSkeletonProps {
  count?: number;
  cols?: 1 | 2 | 3;
  darkMode?: boolean;
}

export const NewsCardSkeleton = memo(function NewsCardSkeleton({
  count = 3,
  cols = 3,
  darkMode,
}: NewsCardSkeletonProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };

  return (
    <div className={`grid ${gridClasses[cols]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            ${darkMode ? 'dark:bg-gray-800' : 'bg-white'} 
            rounded-xl border ${darkMode ? 'dark:border-gray-700' : 'border-gray-100'} overflow-hidden animate-pulse
          `}
        >
          <Skeleton
            className="h-48 w-full"
            rounded="none"
            darkMode={darkMode}
          />
          <div className="p-4 space-y-3">
            <Skeleton
              className="h-4 w-20"
              rounded="md"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-5 w-full"
              rounded="md"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-4 w-full"
              rounded="md"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-4 w-3/4"
              rounded="md"
              darkMode={darkMode}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

// ============================================================
// 6. Skeleton للرؤية والرسالة (Vision & Mission)
// ============================================================

interface VisionMissionSkeletonProps {
  darkMode?: boolean;
}

export const VisionMissionSkeleton = memo(function VisionMissionSkeleton({
  darkMode,
}: VisionMissionSkeletonProps) {
  const bgClass = darkMode ? 'dark:bg-gov-900/20 dark:border-gov-800' : 'bg-gov-50 border-gov-100';

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className={`${bgClass} rounded-2xl p-8 border animate-pulse`}
        >
          <Skeleton
            className="w-14 h-14 rounded-xl mb-4"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-6 w-24 mb-3"
            rounded="md"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-4 w-full mb-2"
            rounded="md"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-4 w-full mb-2"
            rounded="md"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-4 w-3/4 mb-4"
            rounded="md"
            darkMode={darkMode}
          />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={j}
                className="flex items-center gap-2"
              >
                <Skeleton
                  className="w-4 h-4 rounded-full"
                  darkMode={darkMode}
                />
                <Skeleton
                  className="h-4 flex-1"
                  rounded="md"
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

// ============================================================
// 7. Skeleton للأسئلة الشائعة (FAQ)
// ============================================================

interface FAQSkeletonProps {
  count?: number;
  darkMode?: boolean;
}

export const FAQSkeleton = memo(function FAQSkeleton({ count = 5, darkMode }: FAQSkeletonProps) {
  const borderClass = darkMode ? 'dark:border-gray-700' : 'border-gray-100';

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`border ${borderClass} rounded-xl overflow-hidden shadow-sm animate-pulse`}
        >
          <div
            className={`flex items-center justify-between p-4 ${darkMode ? 'dark:bg-gray-800' : 'bg-white'}`}
          >
            <Skeleton
              className="h-5 w-3/4"
              rounded="md"
              darkMode={darkMode}
            />
            <Skeleton
              className="w-5 h-5"
              rounded="full"
              darkMode={darkMode}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

// ============================================================
// 8. Skeleton للفريق (Team)
// ============================================================

interface TeamSkeletonProps {
  count?: number;
  cols?: 2 | 3 | 4;
  darkMode?: boolean;
}

export const TeamSkeleton = memo(function TeamSkeleton({
  count = 4,
  cols = 4,
  darkMode,
}: TeamSkeletonProps) {
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };
  const bgClass = darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-100';

  return (
    <div className={`grid ${gridClasses[cols]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${bgClass} rounded-xl border p-6 text-center animate-pulse`}
        >
          <Skeleton
            className="w-20 h-20 rounded-full mx-auto mb-4"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-5 w-28 mx-auto mb-2"
            rounded="md"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-4 w-24 mx-auto mb-3"
            rounded="md"
            darkMode={darkMode}
          />
          <div className="space-y-2">
            <Skeleton
              className="h-3 w-full"
              rounded="md"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-3 w-4/5 mx-auto"
              rounded="md"
              darkMode={darkMode}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

// ============================================================
// 9. Skeleton للجدول (Table - للبيانات الكثيفة)
// ============================================================

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  darkMode?: boolean;
}

export const TableSkeleton = memo(function TableSkeleton({
  rows = 5,
  cols = 4,
  darkMode,
}: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border ${darkMode ? 'dark:border-gray-700' : 'border-gray-200'}">
      <table className="w-full">
        <thead className={`${darkMode ? 'dark:bg-gray-800' : 'bg-gray-50'}`}>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th
                key={i}
                className="p-4"
              >
                <Skeleton
                  className="h-4 w-24 mx-auto"
                  rounded="md"
                  darkMode={darkMode}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y ${darkMode ? 'dark:divide-gray-700' : 'divide-gray-200'}">
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className={`${darkMode ? 'dark:bg-gray-900' : 'bg-white'} animate-pulse`}
            >
              {Array.from({ length: cols }).map((_, j) => (
                <td
                  key={j}
                  className="p-4"
                >
                  <Skeleton
                    className="h-4 w-full"
                    rounded="md"
                    darkMode={darkMode}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// ============================================================
// 10. Skeleton للترقيم (Pagination)
// ============================================================

interface PaginationSkeletonProps {
  count?: number;
  darkMode?: boolean;
}

export const PaginationSkeleton = memo(function PaginationSkeleton({
  count = 5,
  darkMode,
}: PaginationSkeletonProps) {
  const bgClass = darkMode ? 'dark:bg-gray-800' : 'bg-white';

  return (
    <div
      className={`flex items-center justify-center gap-2 p-4 rounded-xl border ${darkMode ? 'dark:border-gray-700' : 'border-gray-200'} ${bgClass}`}
    >
      <Skeleton
        className="w-8 h-8"
        rounded="md"
        darkMode={darkMode}
      />
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-8 h-8"
          rounded="md"
          darkMode={darkMode}
        />
      ))}
      <Skeleton
        className="w-8 h-8"
        rounded="md"
        darkMode={darkMode}
      />
    </div>
  );
});

// ============================================================
// 11. Skeleton للصفحة الرئيسية الكاملة (Home Page)
// ============================================================

interface HomePageSkeletonProps {
  darkMode?: boolean;
}

export const HomePageSkeleton = memo(function HomePageSkeleton({
  darkMode,
}: HomePageSkeletonProps) {
  const heroBg = darkMode ? 'dark:bg-gov-900' : 'bg-gov-800';
  const sectionBg = darkMode ? 'dark:bg-gray-900' : 'bg-white';
  const borderClass = darkMode ? 'dark:border-gray-800' : 'border-gray-100';

  return (
    <div className={`min-h-screen ${darkMode ? 'dark:bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className={`relative min-h-[95vh] flex items-center ${heroBg} animate-pulse`}>
        <div className="max-w-7xl mx-auto px-4 py-28 w-full">
          <div className="max-w-4xl space-y-6">
            <Skeleton
              className="h-6 w-64"
              rounded="full"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-14 w-full"
              rounded="xl"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-14 w-3/4"
              rounded="xl"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-8 w-full"
              rounded="xl"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-5 w-full"
              rounded="md"
              darkMode={darkMode}
            />
            <Skeleton
              className="h-5 w-4/5"
              rounded="md"
              darkMode={darkMode}
            />
            <div className="flex flex-wrap gap-4 mt-8">
              <Skeleton
                className="h-12 w-40"
                rounded="xl"
                darkMode={darkMode}
              />
              <Skeleton
                className="h-12 w-32"
                rounded="xl"
                darkMode={darkMode}
              />
              <Skeleton
                className="h-12 w-32"
                rounded="xl"
                darkMode={darkMode}
              />
            </div>
            <div className="mt-16">
              <StatsSkeleton
                count={6}
                cols={6}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className={`py-12 ${sectionBg} border-b ${borderClass}`}>
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton
            className="h-6 w-48 mb-6"
            rounded="lg"
            darkMode={darkMode}
          />
          <AnnouncementCardSkeleton
            count={3}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* Vision Mission Section */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton
            className="h-8 w-64 mx-auto mb-3"
            rounded="lg"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-5 w-96 mx-auto mb-14"
            rounded="lg"
            darkMode={darkMode}
          />
          <VisionMissionSkeleton darkMode={darkMode} />
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-20 ${darkMode ? 'dark:bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton
            className="h-8 w-64 mx-auto mb-3"
            rounded="lg"
            darkMode={darkMode}
          />
          <Skeleton
            className="h-5 w-96 mx-auto mb-10"
            rounded="lg"
            darkMode={darkMode}
          />
          <ServiceCardSkeleton
            count={6}
            cols={3}
            darkMode={darkMode}
          />
        </div>
      </section>
    </div>
  );
});

// ============================================================
// 12. إعدادات الرسوم المتحركة (Animation Keyframes)
// ============================================================

/*
أضف هذا إلى ملف `index.css` أو `globals.css`:

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes shimmer-slow {
  0% { background-position: -300% 0; }
  100% { background-position: 300% 0; }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

.animate-shimmer-slow {
  animation: shimmer-slow 2.5s infinite;
}
*/

// ============================================================
// 13. تصدير الكل (Exports)
// ============================================================

export default {
  Skeleton,
  StatsSkeleton,
  ServiceCardSkeleton,
  AnnouncementCardSkeleton,
  NewsCardSkeleton,
  VisionMissionSkeleton,
  FAQSkeleton,
  TeamSkeleton,
  TableSkeleton,
  PaginationSkeleton,
  HomePageSkeleton,
};
