// ============================================================
// ScrollToTop.tsx - زر العودة للأعلى
// ============================================================

import { useEffect, useState, memo } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = globalThis.scrollY;
      const docHeight = document.documentElement.scrollHeight - globalThis.innerHeight;
      const calculatedProgress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      setIsVisible(scrollY > 500);
      setProgress(Math.min(calculatedProgress, 100));
    };

    handleScroll();

    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      globalThis.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    globalThis.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 left-8 z-50 group"
      aria-label="العودة إلى أعلى الصفحة"
    >
      <div className="relative">
        {/* حلقة التقدم */}
        <svg
          className="w-14 h-14 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${progress * 1.5} 150`}
            className="text-gov-600 transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>

        {/* الزر الداخلي */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-gov-700 to-gov-800 hover:from-gov-800 hover:to-gov-900 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center">
            <ChevronUp
              size={20}
              className="group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* مؤشر التنبيه */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-ping" />
      </div>
    </button>
  );
});

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;
