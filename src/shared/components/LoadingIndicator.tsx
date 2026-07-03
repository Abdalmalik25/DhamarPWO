// ============================================================
// LoadingIndicator - مؤشر التقدم (Standard Edition)
// ============================================================

import { memo, useEffect, useState, useCallback, useRef } from 'react';

interface LoadingIndicatorProps {
  message?: string;
  version?: string;
  /** هل يعمل بشكل مؤقت حتى اكتمال التحميل */
  persistent?: boolean;
}

const LoadingIndicator = memo(function LoadingIndicator({
  message = 'جاري تحميل البوابة الإلكترونية...',
  version = '5.0.0',
  persistent = false,
}: LoadingIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('تهيئة النظام...');
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const minTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const complete = useCallback(() => {
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
    }

    setProgress(100);
    setStatus('تم التحميل بنجاح ✓');

    if (!persistent) {
      completeTimerRef.current = setTimeout(() => {
        // في المكون الأب يمكن إخفاء الشاشة
      }, 300);
    }
  }, [persistent]);

  useEffect(() => {
    if (!persistent) {
      // وضع المحاكاة المحدود لحالات معينة
      const phases = [
        { at: 15, text: 'تحميل الموارد الأساسية...' },
        { at: 30, text: 'تحميل الخدمات...' },
        { at: 45, text: 'تهيئة واجهة المستخدم...' },
        { at: 60, text: 'التحقق من الاتصال الآمن...' },
        { at: 75, text: 'تجهيز النماذج الهندسية...' },
        { at: 90, text: 'الانتهاء من التحميل...' },
      ];

      const target = 4000;

      const animate = () => {
        if (!startTimeRef.current) return;

        const elapsed = performance.now() - startTimeRef.current;
        const raw = Math.min((elapsed / target) * 100, 94);
        const eased = 1 - Math.pow(1 - raw / 100, 2);
        const display = Math.min(eased * 94, 94);

        setProgress(display);

        if (raw < 94) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          complete();
        }
      };

      startTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(animate);

      minTimerRef.current = setTimeout(() => {
        complete();
      }, target);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (minTimerRef.current) clearTimeout(minTimerRef.current);
        if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
      };
    }
  }, [persistent, complete]);

  useEffect(() => {
    if (persistent && progress < 100) {
      const phases = [
        { at: 15, text: 'تحميل الموارد الأساسية...' },
        { at: 30, text: 'تحميل الخدمات...' },
        { at: 45, text: 'تهيئة واجهة المستخدم...' },
        { at: 60, text: 'التحقق من الاتصال الآمن...' },
        { at: 75, text: 'تجهيز النماذج الهندسية...' },
        { at: 90, text: 'الانتهاء من التحميل...' },
      ];

      const current = phases
        .slice()
        .reverse()
        .find((p) => progress >= p.at);
      if (current) {
        setStatus(current.text);
      }
    }
  }, [progress, persistent]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-gov-950 via-gov-900 to-gov-950"
      role="status"
      aria-live="polite"
    >
      {/* الخلفية الزخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 border border-gold-500/5 rounded-full animate-spin-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 border border-gold-500/5 rounded-full animate-spin-reverse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-gold-500/5 rounded-full animate-breathe" />

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              top: `${15 + i * 14}%`,
              left: `${10 + (i % 3) * 35}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        {/* أيقونة التحميل */}
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-white/10 border-t-gold-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="w-full mb-4">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #d4af37, #fbbf24, #d4af37)',
                backgroundSize: '200% 100%',
                animation: 'progress-shimmer 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* النسبة المئوية */}
        <div className="text-gold-400 text-sm font-mono font-bold mb-2 tabular-nums tracking-wider">
          {Math.round(progress)}%
        </div>

        {/* رسالة الحالة */}
        <p className="text-white/60 text-sm text-center">{status}</p>

        {/* النص الثابت السفلي */}
        <div className="mt-8 text-center">
          <p className="text-white/90 font-bold text-base tracking-widest">
            مكتب الأشغال العامة والطرق
          </p>
          <p className="text-gold-400/80 text-xs">محافظة ذمار - الجمهورية اليمنية</p>
          <p className="text-white/30 text-[10px] mt-2 font-mono">v{version}</p>
        </div>
      </div>

      {/* شريط سفلي أمني */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] text-white/20">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          اتصال آمن | بوابة حكومية رسمية
        </div>
      </div>
    </div>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';
export default LoadingIndicator;
