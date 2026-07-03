// ============================================================
// AnimatedCounter.tsx - عداد متحرك ذكي (Pro Version)
// متوافق مع: React 19 | Tailwind CSS | A11y
// ============================================================

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export type CounterFormat = 'number' | 'currency' | 'percentage';
export type CounterDirection = 'up' | 'down';

export interface AnimatedCounterProps {
  /** القيمة النهائية (الرقم الذي سيتوقف عنده) */
  end: number;
  /** القيمة الابتدائية (الافتراضي: 0) */
  start?: number;
  /** لاحقة النص (مثل: '٪' أو ' ريال') */
  suffix?: string;
  /** بادئة النص (مثل: '$' أو 'ريال ') */
  prefix?: string;
  /** مدة الرسوم المتحركة بالمللي ثانية (الافتراضي: 1500) */
  duration?: number;
  /** عدد المنازل العشرية (الافتراضي: 0) */
  decimals?: number;
  /** نوع التنسيق (number, currency, percentage) */
  format?: CounterFormat;
  /** اتجاه العد (up: تصاعدي، down: تنازلي) */
  direction?: CounterDirection;
  /** هل يتوقف العداد عند فقدان التركيز (يفيد في تحسين الأداء) */
  pauseOnBlur?: boolean;
  /** استئناف العد إذا عاد العنصر إلى الشاشة (بعد التمرير بعيداً) */
  resumeOnVisible?: boolean;
  /** فئة CSS إضافية */
  className?: string;
  /** دالة تُستدعى عند اكتمال العد */
  onComplete?: () => void;
}

// ============================================================
// 2. دالة التنسيق الذكي للأرقام
// ============================================================

function formatNumber(
  value: number,
  format: CounterFormat = 'number',
  decimals: number = 0,
  prefix: string = '',
  suffix: string = '',
): string {
  // التعامل مع الأرقام العشرية
  const formatted = value.toFixed(decimals);
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // تنسيق الجزء الصحيح (إضافة فواصل الألوف)
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // إضافة الأجزاء العشرية
  let result = formattedInteger;
  if (decimalPart) {
    result += '.' + decimalPart;
  }

  // تطبيق التنسيق حسب النوع
  if (format === 'currency') {
    // تنسيق العملة (حسب اللغة، ريال يمني افتراضياً)
    result = `${prefix || 'ريال '}${result}`;
  } else if (format === 'percentage') {
    result = `${result}%`;
  }

  // إضافة البادئة واللاحقة إذا لم تكن محددة بالتنسيق
  if (format === 'number') {
    result = `${prefix}${result}${suffix}`;
  }

  return result;
}

// ============================================================
// 3. هوك `useInView` المخصص (لتحسين الأداء)
// ============================================================

function useInView(
  ref: React.RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit,
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px', ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

// ============================================================
// 4. المكون الرئيسي (Main Component)
// ============================================================

const AnimatedCounter = memo(function AnimatedCounter({
  end,
  start = 0,
  suffix = '',
  prefix = '',
  duration = 1500,
  decimals = 0,
  format = 'number',
  direction = 'up',
  pauseOnBlur = true,
  resumeOnVisible = true,
  className = '',
  onComplete,
}: AnimatedCounterProps) {
  // ============================================================
  // 4.1. الحالات الداخلية (Internal State)
  // ============================================================

  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const pausedRef = useRef(false);
  const lastProgressRef = useRef(0);

  const isInView = useInView(ref, { threshold: 0.3 });
  const isVisible = useMemo(() => document.visibilityState === 'visible', []);

  // ============================================================
  // 4.2. دالة الرسوم المتحركة (Animation Loop)
  // ============================================================

  const animate = useCallback(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const elapsed = Date.now() - startTimeRef.current;
    const totalDuration = pauseOnBlur && !isVisible ? duration * 2 : duration;
    let progress = Math.min(elapsed / totalDuration, 1);

    // إذا كان العداد متوقفاً مؤقتاً، نستخدم آخر تقدم معروف
    if (pausedRef.current) {
      progress = lastProgressRef.current;
    } else {
      lastProgressRef.current = progress;
    }

    // Easing function (ease-out cubic)
    const eased = 1 - Math.pow(1 - progress, 3);

    // حساب القيمة الحالية
    const range = Math.abs(end - start);
    const currentValue =
      direction === 'up'
        ? Math.floor(start + eased * range * 10) / 10
        : Math.floor(start - eased * range * 10) / 10;

    // التقريب حسب عدد المنازل العشرية
    const roundedValue = parseFloat(currentValue.toFixed(decimals));
    setCount(roundedValue);

    // إذا انتهى العداد
    if (progress >= 1) {
      setCount(end);
      completedRef.current = true;
      onComplete?.();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // استمرار الحلقة
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [end, start, duration, direction, decimals, pauseOnBlur, isVisible, onComplete]);

  // ============================================================
  // 4.3. إدارة دورة حياة العداد (Lifecycle Management)
  // ============================================================

  useEffect(() => {
    // إذا كان العنصر في الشاشة ولم يبدأ بعد
    if (isInView && !startedRef.current) {
      startedRef.current = true;
      startTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // إذا كان العنصر خارج الشاشة وتريد استئنافه
    if (!isInView && resumeOnVisible && startedRef.current) {
      // إيقاف العداد مؤقتاً
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      pausedRef.current = true;
    }

    // تنظيف عند إزالة المكون
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView, resumeOnVisible, animate]);

  // ============================================================
  // 4.4. استئناف العداد عند عودة التبويبة (Tab Focus)
  // ============================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && startedRef.current) {
        // استئناف العداد إذا كان متوقفاً
        if (pausedRef.current && !completedRef.current) {
          pausedRef.current = false;
          startTimeRef.current = Date.now() - lastProgressRef.current * duration;
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [duration, animate]);

  // ============================================================
  // 4.5. تنسيق الرقم المعروض
  // ============================================================

  const displayValue = useMemo(() => {
    return formatNumber(count, format, decimals, prefix, suffix);
  }, [count, format, decimals, prefix, suffix]);

  // ============================================================
  // 4.6. التصيير (Rendering)
  // ============================================================

  return (
    <span
      ref={ref}
      className={`counter-container ${className}`}
      aria-label={`العدد: ${displayValue}`}
    >
      <span className="counter-value">{displayValue}</span>
    </span>
  );
});

// ============================================================
// 5. تصدير الكل (Exports)
// ============================================================

AnimatedCounter.displayName = 'AnimatedCounter';
export default AnimatedCounter;
