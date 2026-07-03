import { useState, useEffect, useRef, useCallback } from 'react';

interface PageTransitionProps {
  readonly children: React.ReactNode;
  /** نوع الحركة: fade | slide | scale | flip */
  readonly variant?: 'fade' | 'slide' | 'scale' | 'flip';
  /** اتجاه الحركة (لـ slide) */
  readonly direction?: 'forward' | 'backward';
  /** مدة الحركة بالميلي ثانية */
  readonly duration?: number;
  /** تعطيل الحركات (مثلاً لأغراض الوصول) */
  readonly disable?: boolean;
  /** مفتاح فريد لفرض إعادة الحركة */
  readonly pageKey?: string;
  /** فئات CSS إضافية للعنصر المحيط */
  readonly className?: string;
}

export default function PageTransition({
  children,
  variant = 'fade',
  direction = 'forward',
  duration = 300,
  disable = false,
  pageKey,
  className = '',
}: PageTransitionProps) {
  // الاحتفاظ بالمحتوى القديم مؤقتًا لإظهار حركة الخروج
  const [currentChildren, setCurrentChildren] = useState(children);
  const [prevChildren, setPrevChildren] = useState<React.ReactNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // تنظيف المؤقت عند إلغاء المكون
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // لا تفعل شيئًا في أول تحميل
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (disable) {
      setCurrentChildren(children);
      setPrevChildren(null);
      return;
    }

    // إذا كان المحتوى قد تغير
    if (children !== currentChildren) {
      // بدء مرحلة الخروج للمحتوى القديم
      setPrevChildren(currentChildren);
      setCurrentChildren(children);

      // بعد انتهاء المدة، إزالة المحتوى القديم وتثبيت الجديد
      timerRef.current = setTimeout(() => {
        setPrevChildren(null);
        timerRef.current = null;
      }, duration);
    }

    return clearTimer;
  }, [children, currentChildren, disable, duration, clearTimer]);

  // إذا تم تعطيل الحركات نعرض المحتوى مباشرة
  if (disable) {
    return <>{children}</>;
  }

  // توليد أسماء فئات CSS حسب النوع والاتجاه
  const slideClass = direction === 'forward' ? 'animate-slide-forward' : 'animate-slide-backward';
  const variantClass = {
    fade: 'animate-fade',
    slide: slideClass,
    scale: 'animate-scale',
    flip: 'animate-flip',
  }[variant];

  // Advanced transition variants
  const getAdvancedVariant = () => {
    if (disable) return '';

    switch (variant) {
      case 'slide':
        return direction === 'forward'
          ? 'animate-slide-forward-enter animate-slide-backward-exit'
          : 'animate-slide-backward-enter animate-slide-forward-exit';
      case 'scale':
        return 'animate-scale-enter animate-scale-exit';
      case 'flip':
        return 'animate-flip-enter animate-flip-exit';
      default:
        return 'animate-fade-enter animate-fade-exit';
    }
  };

  return (
    <div
      className={`page-transition-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* المحتوى القديم (في مرحلة الخروج) */}
      {prevChildren && (
        <div
          className={`page-transition-item page-exit ${variantClass}-exit`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            animationDuration: `${duration}ms`,
            animationFillMode: 'forwards',
            pointerEvents: 'none',
            zIndex: 1,
            transformOrigin: 'center center',
          }}
        >
          {prevChildren}
        </div>
      )}

      {/* المحتوى الجديد (في مرحلة الدخول) */}
      <div
        className={`page-transition-item page-enter ${variantClass === 'animate-fade' ? getAdvancedVariant() : variantClass}`}
        style={{
          animationDuration: `${duration}ms`,
          animationFillMode: 'forwards',
          zIndex: 0,
          opacity: prevChildren ? 0 : 1, // يبدأ شفافًا إذا كان هناك محتوى قديم
          transformOrigin: 'center center',
          backfaceVisibility: 'hidden',
        }}
        key={pageKey}
      >
        {currentChildren}
      </div>
    </div>
  );
}
