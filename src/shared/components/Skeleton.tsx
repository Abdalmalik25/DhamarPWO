// ============================================================
// Skeleton.tsx - محرك التحميل الهيكلي الذكي (Ultimate Engine v4.0)
// متوافق مع: React 19 | Tailwind CSS v4 | نظام الألوان التلقائي
// ============================================================

import { memo, forwardRef, useMemo } from 'react';

// ============================================================
// 1. أنواع البيانات المتقدمة (Advanced Types)
// ============================================================

export type SkeletonShape =
  | 'rectangle'
  | 'circle'
  | 'pill'
  | 'text' // محاكاة سطر نصي (ارتفاع ثابت، عرض متغير)
  | 'thumbnail' // محاكاة صورة مصغرة (نسبة 4:3)
  | 'avatar'; // محاكاة صورة شخصية (دائرة متوسطة)

export type SkeletonRounded =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full'
  | 't-xl'
  | 'b-xl'
  | 'l-xl'
  | 'r-xl'
  | 't-2xl'
  | 'b-2xl';

export type SkeletonAnimation = 'none' | 'pulse' | 'wave' | 'shimmer' | 'auto'; // يقرأ إعدادات نظام المستخدم

export interface SkeletonProps {
  /** الفئة الأساسية للتحكم في الحجم */
  className?: string;

  /** شكل العنصر */
  shape?: SkeletonShape;

  /** نسبة العرض إلى الارتفاع (لنمط الـ thumbnail) */
  aspectRatio?: number;

  /** نوع التدوير */
  rounded?: SkeletonRounded;

  /** نوع الرسوم المتحركة */
  animation?: SkeletonAnimation;

  /** تمكين الوضع المظلم يدوياً */
  darkMode?: boolean;

  /** هل العنصر حاسم؟ (لتعطيل الرسوم المتحركة لتحسين الأداء) */
  critical?: boolean;

  /** تأخير الرسوم المتحركة (بالمللي ثانية) */
  delay?: number;

  /** تفعيل تأثير الوهم الزجاجي (Glass effect) */
  glass?: boolean;

  /** لون مخصص للهيكل (للتجاوز) */
  color?: 'gray' | 'blue' | 'gold' | 'gov' | 'custom';

  /** كود لون مخصص (إذا كان color = custom) */
  customColor?: string;
}

// ============================================================
// 2. تكوينات التصميم (Design System Configuration)
// ============================================================

const ROUNDED_MAP: Record<SkeletonRounded, string> = {
  'none': 'rounded-none',
  'sm': 'rounded-sm',
  'md': 'rounded-md',
  'lg': 'rounded-lg',
  'xl': 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  'full': 'rounded-full',
  't-xl': 'rounded-t-xl',
  'b-xl': 'rounded-b-xl',
  'l-xl': 'rounded-l-xl',
  'r-xl': 'rounded-r-xl',
  't-2xl': 'rounded-t-2xl',
  'b-2xl': 'rounded-b-2xl',
};

const ANIMATION_MAP: Record<SkeletonAnimation, string> = {
  none: '',
  pulse: 'animate-skeleton-pulse',
  wave: 'animate-skeleton-wave',
  shimmer: 'animate-skeleton-shimmer',
  auto: 'motion-reduce:animate-none motion-safe:animate-skeleton-wave',
};

const SHAPE_CLASSES: Record<SkeletonShape, string> = {
  rectangle: 'w-full h-full',
  circle: 'w-full h-full rounded-full',
  pill: 'w-full h-full rounded-full',
  text: 'h-4 w-full',
  thumbnail: 'aspect-[4/3] w-full',
  avatar: 'w-12 h-12 rounded-full shrink-0',
};

const COLOR_MAP: Record<string, string> = {
  gray: 'bg-gray-200 dark:bg-gray-700',
  blue: 'bg-blue-200 dark:bg-blue-800',
  gold: 'bg-gold-200 dark:bg-gold-900/30',
  gov: 'bg-gov-200 dark:bg-gov-800',
  custom: '',
};

// ============================================================
// 3. المكون الرئيسي (Main Component)
// ============================================================

const Skeleton = memo(
  forwardRef<HTMLDivElement, SkeletonProps>(function SkeletonInner(
    {
      className = '',
      shape = 'rectangle',
      aspectRatio,
      rounded = 'md',
      animation = 'auto',
      darkMode = false,
      critical = false,
      delay = 0,
      glass = false,
      color = 'gray',
      customColor,
    },
    ref,
  ) {
    // ============================================================
    // 3.1. تحسين الأداء باستخدام useMemo
    // ============================================================

    const computedClasses = useMemo(() => {
      // 1. الشكل الأساسي
      let baseClasses = SHAPE_CLASSES[shape] || SHAPE_CLASSES.rectangle;

      // 2. التعديل حسب النسبة (Aspect Ratio)
      if (aspectRatio && shape === 'thumbnail') {
        baseClasses = `aspect-[${aspectRatio}] w-full`;
      }

      // 3. اللون
      const colorClass =
        color === 'custom' ? customColor || 'bg-gray-200' : COLOR_MAP[color] || COLOR_MAP.gray;

      // 4. التدوير
      const roundedClass = ROUNDED_MAP[rounded] || ROUNDED_MAP.md;

      // 5. الرسوم المتحركة (مع تحسين الأداء)
      let animationClass = '';
      if (!critical) {
        animationClass = ANIMATION_MAP[animation] || ANIMATION_MAP.auto;
        if (delay > 0) {
          animationClass += ` animation-delay-${delay}`;
        }
      }

      // 6. تأثير الزجاج
      const glassClass = glass ? 'bg-opacity-20 backdrop-blur-sm ring-1 ring-white/10' : '';

      // 7. الحالة النهائية
      return `
      ${baseClasses}
      ${colorClass}
      ${roundedClass}
      ${animationClass}
      ${glassClass}
      ${className}
    `;
    }, [
      shape,
      aspectRatio,
      rounded,
      animation,
      critical,
      delay,
      glass,
      color,
      customColor,
      className,
    ]);

    // ============================================================
    // 3.2. التصيير (Rendering)
    // ============================================================

    return (
      <div
        ref={ref}
        className={computedClasses}
        style={{
          willChange: animation !== 'none' ? 'transform, opacity' : undefined,
        }}
        aria-hidden="true"
        data-skeleton="true"
        role="presentation"
      />
    );
  }),
);

// ============================================================
// 4. مكونات البناء (Builder Components)
// ============================================================

/**
 * سلسلة من الهياكل العظمية للنصوص (محاكاة فقرات)
 */
export const TextSkeleton = memo(function TextSkeleton({
  lines = 3,
  className = '',
  ...props
}: Omit<SkeletonProps, 'shape'> & { lines?: number }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          shape="text"
          rounded="lg"
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
          {...props}
        />
      ))}
    </div>
  );
});

/**
 * هيكل عظمي لصورة (مع نسبة عرض إلى ارتفاع مثالية)
 */
export const ImageSkeleton = memo(function ImageSkeleton({
  className = '',
  aspectRatio = 16 / 9,
  ...props
}: Omit<SkeletonProps, 'shape'> & { aspectRatio?: number }) {
  return (
    <Skeleton
      shape="thumbnail"
      aspectRatio={aspectRatio}
      rounded="xl"
      className={className}
      {...props}
    />
  );
});

/**
 * هيكل عظمي لدائرة (مثل الصورة الشخصية)
 */
export const AvatarSkeleton = memo(function AvatarSkeleton({
  size = 48,
  className = '',
  ...props
}: Omit<SkeletonProps, 'shape'> & { size?: number }) {
  return (
    <Skeleton
      shape="avatar"
      rounded="full"
      className={`w-${size} h-${size} ${className}`}
      {...props}
    />
  );
});

/**
 * هيكل عظمي لبطاقة كاملة (مع صورة، عنوان، ونص)
 */
export const CardSkeleton = memo(function CardSkeleton({
  className = '',
  ...props
}: SkeletonProps) {
  return (
    <div className={`border rounded-2xl p-4 space-y-4 ${className}`}>
      <ImageSkeleton
        className="w-full h-48"
        {...props}
      />
      <div className="space-y-2">
        <Skeleton
          className="h-5 w-3/4"
          rounded="lg"
          {...props}
        />
        <Skeleton
          className="h-4 w-full"
          rounded="md"
          {...props}
        />
        <Skeleton
          className="h-4 w-2/3"
          rounded="md"
          {...props}
        />
      </div>
    </div>
  );
});

// ============================================================
// 5. إعدادات CSS (Animation Keyframes - يجب إضافتها إلى globals.css)
// ============================================================

/*
@layer utilities {
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  
  @keyframes skeleton-wave {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes skeleton-shimmer {
    0% { background-position: -300% 0; }
    100% { background-position: 300% 0; }
  }
  
  .animate-skeleton-pulse {
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }
  
  .animate-skeleton-wave {
    animation: skeleton-wave 1.8s linear infinite;
    background-image: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%);
    background-size: 300% 100%;
  }
  
  .animate-skeleton-shimmer {
    animation: skeleton-shimmer 2.5s linear infinite;
    background-image: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
    background-size: 400% 100%;
  }
  
  .animation-delay-100 { animation-delay: 100ms; }
  .animation-delay-200 { animation-delay: 200ms; }
  .animation-delay-300 { animation-delay: 300ms; }
  .animation-delay-400 { animation-delay: 400ms; }
  .animation-delay-500 { animation-delay: 500ms; }
}
*/

// ============================================================
// 6. تصدير الكل (Exports)
// ============================================================

export default Skeleton;
