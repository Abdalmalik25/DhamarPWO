// ============================================================
// src/shared/components/ScrollReveal.tsx
// ============================================================

import { useEffect, useRef, useState, memo, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  className?: string;
  rootMargin?: string;
  triggerOnMount?: boolean;
}

const ScrollReveal = memo(function ScrollReveal({
  children,
  delay = 0,
  duration = 700,
  threshold = 0.1,
  direction = 'up',
  distance = 50,
  once = true,
  className = '',
  rootMargin = '0px',
  triggerOnMount = false,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // تحديد اتجاه الحركة
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      case 'none':
        return 'translate(0, 0)';
      default:
        return `translateY(${distance}px)`;
    }
  };

  useEffect(() => {
    // إذا كان التفعيل عند التحميل
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    const element = elementRef.current;
    if (!element) return;

    // تنظيف الـ Observer السابق
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // إنشاء الـ Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasBeenVisible(true);

            // إذا كان مرة واحدة فقط، افصل الـ Observer
            if (once && observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
          } else if (!once) {
            // إذا كان متكرراً، أخفِ العنصر عند الخروج من المشاهدة
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, once, direction, distance, delay, rootMargin, triggerOnMount]);

  // عندما يتغير triggerOnMount
  useEffect(() => {
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [triggerOnMount, delay]);

  const isVisibleState = once ? hasBeenVisible : isVisible;

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${className}`}
      style={{
        opacity: isVisibleState ? 1 : 0,
        transform: isVisibleState ? 'translate(0, 0)' : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';

export default ScrollReveal;
