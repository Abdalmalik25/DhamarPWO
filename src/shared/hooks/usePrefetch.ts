// ============================================================
// usePrefetch.ts - نظام التحميل المسبق الذكي
// ============================================================

import { useCallback, useEffect, useRef, useState, type RefCallback } from 'react';

export interface PrefetchOptions {
  /** Delay (ms) before executing prefetch when using fallback timer */
  delay?: number;
  /** IntersectionObserver threshold for viewport prefetch */
  threshold?: number;
  /** Enable viewport-based prefetching */
  enableViewportPrefetch?: boolean;
  /** Trigger prefetch on component mount */
  prefetchOnMount?: boolean;
}

export interface PrefetchReturn {
  eventHandlers: {
    onMouseEnter: () => void;
    onFocus: () => void;
    onTouchStart?: () => void;
  };
  ref: RefCallback<HTMLElement | null>;
  isLoading: boolean;
  resetPrefetch: () => void;
  forcePrefetch: () => void;
}

export function usePrefetch(
  prefetchFn: () => Promise<unknown> | void,
  options: PrefetchOptions = {},
): PrefetchReturn {
  const {
    delay = 200,
    threshold = 0.1,
    enableViewportPrefetch = true,
    prefetchOnMount = false,
  } = options;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCallbackRef = useRef<number | null>(null);
  const hasPrefetched = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef(true);
  const prefetchFnRef = useRef(prefetchFn);
  const [isLoading, setIsLoading] = useState(false);

  // Keep prefetchFn reference up to date without triggering re‑executions
  prefetchFnRef.current = prefetchFn;

  // Core execution logic (safe against sync/async errors)
  const executePrefetchSafely = useCallback(() => {
    if (!isMounted.current || hasPrefetched.current) return;

    try {
      const result = prefetchFnRef.current();
      if (result instanceof Promise) {
        result.catch((error: unknown) => {
          console.error('[usePrefetch] prefetch promise rejected:', error);
        });
      }
      hasPrefetched.current = true;
      setIsLoading(false);
    } catch (error: unknown) {
      console.error('[usePrefetch] prefetch execution failed:', error);
      setIsLoading(false);
    }
  }, []);

  // Schedule the prefetch using idle callback or fallback timer
  const schedulePrefetch = useCallback(() => {
    if ('requestIdleCallback' in globalThis) {
      idleCallbackRef.current = globalThis.requestIdleCallback(executePrefetchSafely, {
        timeout: 2000,
      });
    } else {
      timeoutRef.current = setTimeout(executePrefetchSafely, delay);
    }
  }, [delay, executePrefetchSafely]);

  const performPrefetch = useCallback(() => {
    if (hasPrefetched.current || !isMounted.current) return;

    setIsLoading(true);
    try {
      schedulePrefetch();
    } catch (error: unknown) {
      // Should never happen – schedulePrefetch is synchronous and safe
      console.error('[usePrefetch] schedulePrefetch failed:', error);
      setIsLoading(false);
    }
  }, [schedulePrefetch]);

  const resetPrefetch = useCallback(() => {
    hasPrefetched.current = false;
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (idleCallbackRef.current) {
      globalThis.cancelIdleCallback(idleCallbackRef.current);
      idleCallbackRef.current = null;
    }
  }, []);

  const forcePrefetch = useCallback(() => {
    resetPrefetch();
    performPrefetch();
  }, [resetPrefetch, performPrefetch]);

  // Immediate prefetch triggered by hover/focus
  const prefetch = useCallback(() => {
    if (hasPrefetched.current) return;
    performPrefetch();
  }, [performPrefetch]);

  // Touch event prefetch with slight delay to distinguish from scroll
  const prefetchTouch = useCallback(() => {
    if (hasPrefetched.current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      prefetch();
    }, 100);
  }, [prefetch]);

  // IntersectionObserver for viewport prefetching
  const setupIntersectionObserver = useCallback(
    (node: HTMLElement | null) => {
      if (!enableViewportPrefetch || !node) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasPrefetched.current) {
              prefetch();
              observerRef.current?.disconnect();
            }
          });
        },
        { threshold },
      );

      observerRef.current.observe(node);
    },
    [enableViewportPrefetch, threshold, prefetch],
  );

  const ref = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;
      setupIntersectionObserver(node);
    },
    [setupIntersectionObserver],
  );

  // Mount / unmount lifecycle
  useEffect(() => {
    if (prefetchOnMount && !hasPrefetched.current) {
      forcePrefetch();
    }

    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (idleCallbackRef.current) {
        globalThis.cancelIdleCallback(idleCallbackRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [prefetchOnMount, forcePrefetch]);

  return {
    eventHandlers: {
      onMouseEnter: prefetch,
      onFocus: prefetch,
      onTouchStart: prefetchTouch,
    },
    ref,
    isLoading,
    resetPrefetch,
    forcePrefetch,
  };
}

export default usePrefetch;
