// ============================================================
// useSwipeNavigation - تنقل بالسحب على الشاشات اللمسية
// ============================================================

import { useEffect, useCallback, RefObject } from 'react';

interface SwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

interface SwipeNavigationExclude {
  excludeSelectors?: string[];
  elementsToIgnore?: HTMLElement[];
}

export function useSwipeNavigation(
  ref: RefObject<HTMLElement | null>,
  options: SwipeNavigationOptions = {},
  exclude: SwipeNavigationExclude = {},
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmoveEvent = false,
  } = options;

  const { excludeSelectors = [], elementsToIgnore = [] } = exclude;

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);

      if (!element) return;

      // Check if the touched element is in the ignore list
      for (const selector of excludeSelectors) {
        if (element.closest(selector)) {
          return;
        }
      }

      for (const el of elementsToIgnore) {
        if (el.contains(element)) {
          return;
        }
      }

      const touchStartX = touch.clientX;
      const touchStartY = touch.clientY;

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const endTouch = endEvent.changedTouches[0];

        if (!endTouch) {
          document.removeEventListener('touchend', handleTouchEnd);
          return;
        }

        const deltaX = endTouch.clientX - touchStartX;
        const deltaY = endTouch.clientY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Only trigger if horizontal swipe is dominant
        if (absDeltaX > absDeltaY && absDeltaX > threshold) {
          if (deltaX < 0) {
            // Swipe Left
            onSwipeLeft?.();
          } else {
            // Swipe Right
            onSwipeRight?.();
          }
        } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
          if (deltaY < 0) {
            // Swipe Up
            onSwipeUp?.();
          } else {
            // Swipe Down
            onSwipeDown?.();
          }
        }

        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchend', handleTouchEnd, { once: true });
    },
    [
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      threshold,
      excludeSelectors,
      elementsToIgnore,
    ],
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
    };
  }, [ref, handleTouchStart, preventDefaultTouchmoveEvent]);

  return {
    isEnabled: true,
    disable: () => {
      // Implementation for disabling swipe
    },
    enable: () => {
      // Implementation for enabling swipe
    },
  };
}

// Helper function to get adjacent pages for navigation
export function getAdjacentPages(currentPage: string): {
  next: string | null;
  prev: string | null;
} {
  const pages = [
    'home',
    'services',
    'forms',
    'about',
    'contact',
    'track',
    'documents',
    'guidelines',
  ];
  const currentIndex = pages.indexOf(currentPage);

  return {
    prev: currentIndex > 0 ? pages[currentIndex - 1] : null,
    next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null,
  };
}

export default useSwipeNavigation;
