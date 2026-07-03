// ============================================================
// SplashScreen - شاشة التحميل الأولية عند فتح التطبيق
// ============================================================

import { memo, useEffect, useState, useCallback, useRef } from 'react';

interface SplashScreenProps {
  minimumDuration?: number;
  onFinish?: () => void;
}

const SplashScreen = memo(function SplashScreen({
  minimumDuration = 1500,
  onFinish,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('تهيئة التطبيق...');
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const minTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const complete = useCallback(() => {
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
    }

    setProgress((prev) => Math.max(prev, 100));
    setStatus('تم التحميل بنجاح ✓');

    finishTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
      document.body.classList.remove('initial-loader-active');
    }, 400);
  }, [onFinish]);

  useEffect(() => {
    startTimeRef.current = performance.now();

    const target = Math.max(minimumDuration, 2200);

    // Generate particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    const animate = () => {
      if (!startTimeRef.current) return;

      const elapsed = performance.now() - startTimeRef.current;
      const raw = Math.min((elapsed / target) * 100, 94);
      const eased = 1 - Math.pow(1 - raw / 100, 4);
      const display = Math.min(eased * 94, 94);

      setProgress(display);

      if (raw < 94) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    minTimerRef.current = setTimeout(() => {
      complete();
    }, target);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (minTimerRef.current) {
        clearTimeout(minTimerRef.current);
      }
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
      }
    };
  }, [minimumDuration, complete]);

  useEffect(() => {
    if (progress >= 15 && progress < 35) setStatus('تحميل الموارد الأساسية...');
    else if (progress >= 35 && progress < 60) setStatus('تهيئة المكونات...');
    else if (progress >= 60 && progress < 85) setStatus('التحقق من الاتصال...');
    else if (progress >= 85 && progress < 100) setStatus('الانتهاء من التحميل...');
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-gradient-to-bl from-gov-900 via-gov-800 to-gov-900 flex flex-col items-center justify-center transition-opacity duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-gold-500/30 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>

      {/* Main logo container with glow effect */}
      <div className="relative mb-10">
        {/* Outer rotating ring */}
        <div className="absolute -inset-8 rounded-full border-2 border-gold-500/20 animate-spin-slow" />
        <div className="absolute -inset-12 rounded-full border border-gold-500/10 animate-spin-slower" />

        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-br from-gold-500/20 to-transparent rounded-full blur-2xl animate-pulse" />

        {/* Logo card */}
        <div className="relative w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl backdrop-blur-sm">
          <div className="relative">
            {/* Inner shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-shimmer" />

            {/* Logo SVG */}
            <svg
              className="w-16 h-16 text-gold-400"
              viewBox="0 0 100 100"
              fill="none"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
              <path
                d="M50 10 L61 39 H92 L67 58 L76 88 L50 70 L24 88 L33 58 L8 39 H39 Z"
                fill="currentColor"
                opacity="0.8"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full p-2 shadow-xl animate-bounce">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
          </svg>
        </div>
      </div>

      {/* Title with animation */}
      <div className="text-center mb-8 space-y-3">
        <h1
          className="text-white font-black text-3xl md:text-4xl mb-2 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          مكتب الأشغال العامة والطرق
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/50" />
          <p
            className="text-gold-400 font-bold text-lg md:text-xl animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            محافظة ذمار
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/50" />
        </div>
        <p
          className="text-white/60 text-sm animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          الجمهورية اليمنية
        </p>
      </div>

      {/* Enhanced progress bar */}
      <div className="w-64 md:w-80 space-y-3">
        {/* Progress bar with gradient and glow */}
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          {/* Glow effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-gold-500/50 to-gold-400/50 blur-xl"
            style={{ width: `${progress}%` }}
          />
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-l from-gold-500 via-gold-400 to-gold-500 rounded-full relative transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Status and percentage */}
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-xs font-medium animate-pulse">{status}</p>
          <div className="flex items-center gap-2">
            <span className="text-gold-400 text-sm font-mono font-bold tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-gold-500/60 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default SplashScreen;
