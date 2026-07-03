// ============================================================
// usePageLoading.ts - هوك تتبع تحميل الصفحات (Real-Time Tracking)
// ============================================================
// هذا الهوك يربط أحداث تحميل الصفحة الحقيقية بتقدم الشريط
// بدلاً من المحاكاة الوهمية

import { useState, useCallback, useRef, useEffect } from 'react';

interface UsePageLoadingOptions {
  /** المدة المتوقعة للتحميل بالميلي ثانية (الافتراضي: 800ms) */
  expectedLoadTime?: number;
  /** الحد الأدنى لعرض شريط التقدم (للاكتفاء البصري) */
  minimumDisplayTime?: number;
  /** هل نستخدم شريط تقدم ثابت بدلاً من متحرك */
  useDeterminateProgress?: boolean;
}

export function usePageLoading(options: UsePageLoadingOptions = {}) {
  const { expectedLoadTime = 800, useDeterminateProgress = true } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const progressDuringLoadRef = useRef(0);

  const startLoading = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    progressDuringLoadRef.current = 0;
    setProgress(0);
    startTimeRef.current = performance.now();

    if (useDeterminateProgress) {
      const animate = () => {
        if (!startTimeRef.current) return;

        const elapsed = performance.now() - startTimeRef.current;
        const rawProgress = Math.min((elapsed / expectedLoadTime) * 100, 90);
        const eased = 1 - Math.pow(1 - rawProgress / 100, 2);
        const displayProgress = Math.min(eased * 90, 90);

        progressDuringLoadRef.current = displayProgress;
        setProgress(displayProgress);

        if (rawProgress < 90) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isLoading, expectedLoadTime, useDeterminateProgress]);

  const setProgressValue = useCallback((value: number) => {
    const clamped = Math.min(Math.max(value, 0), 100);
    progressDuringLoadRef.current = clamped;
    setProgress(clamped);
  }, []);

  const stopLoading = useCallback((success = true) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (!success) {
      setProgress(0);
      setIsLoading(false);
      startTimeRef.current = null;
      return;
    }

    // Use ref value to avoid stale closure on progress state
    const currentProgress = progressDuringLoadRef.current;
    const increment = Math.max(2, (100 - currentProgress) / 10);

    const finishInterval = setInterval(() => {
      progressDuringLoadRef.current = Math.min(progressDuringLoadRef.current + increment, 100);
      const val = progressDuringLoadRef.current;
      setProgress(val);
      if (val >= 100) {
        clearInterval(finishInterval);
        setTimeout(() => {
          setIsLoading(false);
          progressDuringLoadRef.current = 0;
          setProgress(0);
          startTimeRef.current = null;
        }, 300);
      }
    }, 50);
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    progress: Math.round(progress),
    startLoading,
    stopLoading,
    setProgressValue,
  };
}