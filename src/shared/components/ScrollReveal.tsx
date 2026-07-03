// ============================================================
// ScrollReveal.tsx - مكون الظهور التدريجي عند التمرير
// ============================================================
import { useEffect, useRef, useState, memo } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

const ScrollReveal = memo(function ScrollReveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={`scroll-fade-in ${className} ${visible ? 'visible' : ''}`}
    >
      {children}
    </div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';
export default ScrollReveal;
