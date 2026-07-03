// ============================================================
// ProgressBar.tsx - شريط التقدم الذكي للملاحة (Enterprise v1.0)
// ============================================================

import { memo, useEffect, useState, useRef, useCallback } from 'react';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export interface ProgressBarProps {
  /** هل شريط التقدم يتحرك حاليًا؟ */
  isAnimating?: boolean;
  /** النسبة المئوية للتقدم (0-100) - إذا تم تحديدها، سيتم تجاوز الحركة التلقائية */
  progress?: number;
  /** مدة الحركة بالمللي ثانية (الافتراضي: 400) */
  duration?: number;
  /** لون شريط التقدم (يمكن أن يكون لون Tailwind أو كود HEX) */
  color?: string;
  /** نص الحالة الظاهر بجانب الشريط */
  label?: string;
  /** ارتفاع شريط التقدم (الافتراضي: 4px) */
  height?: number;
  /** هل تريد إخفاء شريط التقدم عندما يكون غير نشط؟ */
  hideWhenInactive?: boolean;
  /** فئات CSS إضافية */
  className?: string;
}

// ============================================================
// 2. المكون الرئيسي (Main Component)
// ============================================================

const ProgressBar = memo(function ProgressBar({
  isAnimating = false,
  progress: externalProgress,
  duration = 400,
  color = 'bg-gradient-to-r from-gov-500 to-gold-500',
  label = 'جارٍ التحميل',
  height = 4,
  hideWhenInactive = true,
  className = '',
}: ProgressBarProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const progress = externalProgress ?? internalProgress;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const isActive = isVisible || clampedProgress > 0;

  const animateProgress = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progressValue = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      const currentProgress = Math.min(eased * 100, 100);

      setInternalProgress(currentProgress);

      if (progressValue < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setInternalProgress(100);
        startTimeRef.current = null;
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [duration]);

  useEffect(() => {
    if (isAnimating) {
      setIsVisible(true);
      setInternalProgress(0);
      startTimeRef.current = null;

      const timeoutId = setTimeout(() => {
        animateProgress();
      }, 50);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    }

    if (internalProgress < 100) {
      setInternalProgress(100);
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    }

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [isAnimating, animateProgress, internalProgress]);

  useEffect(() => {
    if (externalProgress !== undefined) {
      setIsVisible(true);
      setInternalProgress(externalProgress);

      if (externalProgress >= 100) {
        const timeoutId = setTimeout(() => {
          setIsVisible(false);
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }
    return undefined;
  }, [externalProgress]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  if (hideWhenInactive && !isActive && clampedProgress === 0) return null;

  const getProgressColor = () => {
    if (clampedProgress < 30) return 'from-blue-500 to-cyan-500';
    if (clampedProgress < 70) return 'from-gov-500 to-gold-500';
    return 'from-emerald-500 to-green-500';
  };

  const dynamicColor = externalProgress == null ? `bg-gradient-to-r ${getProgressColor()}` : color;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[9999] pointer-events-none ${className}`}
      aria-live="polite"
    >
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between gap-3 text-[11px] text-slate-700 dark:text-slate-200">
          <span className="font-semibold">{label}</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>

        <div
          className="relative mt-2 rounded-full overflow-hidden bg-slate-200/90 shadow-inner ring-1 ring-slate-100/70 dark:bg-slate-700/90 dark:ring-slate-800/80"
          style={{ height: `${height}px` }}
        >
          <progress
            className="sr-only"
            max={100}
            value={clampedProgress}
            aria-label={label}
          />

          <div
            className={`absolute inset-y-0 left-0 ${dynamicColor} transition-all duration-300 ease-out`}
            style={{ width: `${clampedProgress}%` }}
          >
            {isAnimating && clampedProgress < 100 && (
              <div className="absolute right-0 top-0 bottom-0 w-5 bg-white/30 blur-sm" />
            )}
          </div>

          {isAnimating && clampedProgress > 0 && clampedProgress < 100 && (
            <div
              className="absolute inset-y-0"
              style={{
                left: `${Math.max(clampedProgress - 2, 0)}%`,
                width: '8px',
                background: 'rgba(255,255,255,0.45)',
                filter: 'blur(6px)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default ProgressBar;
