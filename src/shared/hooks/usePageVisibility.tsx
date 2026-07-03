// ============================================================
// usePageVisibility.tsx - هوك حالة ظهور الصفحة (Visibility Hook)
// ============================================================

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from 'react';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export type VisibilityState = 'visible' | 'hidden' | 'prerender' | 'unloaded';

export interface PageVisibilityStatus {
  /** هل الصفحة مرئية حالياً للمستخدم؟ */
  isVisible: boolean;
  /** حالة الرؤية الكاملة */
  visibilityState: VisibilityState;
  /** هل كانت الصفحة مخفية سابقاً (للإشعارات) */
  wasHidden: boolean;
  /** عدد مرات إخفاء الصفحة */
  hiddenCount: number;
  /** وقت آخر إخفاء للصفحة */
  lastHiddenAt?: Date;
  /** وقت آخر ظهور للصفحة */
  lastVisibleAt?: Date;
  /** إجمالي الوقت المخفي (بالثواني) */
  totalHiddenTime: number;
}

export interface PageVisibilityOptions {
  /** هل تريد تتبع عدد المرات المخفي؟ */
  trackHiddenCount?: boolean;
  /** هل تريد حساب الوقت الإجمالي المخفي؟ */
  trackHiddenTime?: boolean;
  /** هل تريد استدعاء دالة عند تغيير الحالة؟ */
  onChange?: (isVisible: boolean) => void;
}

// ============================================================
// 2. مزود الحالة (PageVisibilityProvider)
// ============================================================

interface PageVisibilityContextType {
  status: PageVisibilityStatus;
  setVisible: () => void;
  setHidden: () => void;
}

const PageVisibilityContext = createContext<PageVisibilityContextType | null>(null);

export function PageVisibilityProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PageVisibilityStatus>(() => ({
    isVisible: typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
    visibilityState:
      typeof document !== 'undefined' ? (document.visibilityState as VisibilityState) : 'visible',
    wasHidden: false,
    hiddenCount: 0,
    totalHiddenTime: 0,
  }));

  const setVisible = useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      isVisible: true,
      visibilityState: 'visible',
      wasHidden: prev.wasHidden,
      lastVisibleAt: new Date(),
    }));
  }, []);

  const setHidden = useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      isVisible: false,
      visibilityState: 'hidden',
      wasHidden: true,
      hiddenCount: prev.hiddenCount + 1,
      lastHiddenAt: new Date(),
    }));
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setVisible();
      } else {
        setHidden();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setVisible, setHidden]);

  return (
    <PageVisibilityContext.Provider value={{ status, setVisible, setHidden }}>
      {children}
    </PageVisibilityContext.Provider>
  );
}

export function usePageVisibilityContext() {
  const context = useContext(PageVisibilityContext);
  if (!context) {
    // Return default values if not in provider
    return {
      status: {
        isVisible: true,
        visibilityState: 'visible' as VisibilityState,
        wasHidden: false,
        hiddenCount: 0,
        totalHiddenTime: 0,
      },
      setVisible: () => {},
      setHidden: () => {},
    };
  }
  return context;
}

// ============================================================
// 3. الهوك الرئيسي (Main Hook)
// ============================================================

export function usePageVisibility(options: PageVisibilityOptions = {}): PageVisibilityStatus {
  const { trackHiddenCount = true, trackHiddenTime = true, onChange } = options;

  const [isVisible, setIsVisible] = useState<boolean>(
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
  );
  const [visibilityState, setVisibilityState] = useState<VisibilityState>(
    typeof document !== 'undefined' ? (document.visibilityState as VisibilityState) : 'visible',
  );
  const [wasHidden, setWasHidden] = useState(false);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [lastHiddenAt, setLastHiddenAt] = useState<Date | undefined>(undefined);
  const [lastVisibleAt, setLastVisibleAt] = useState<Date | undefined>(undefined);
  const [totalHiddenTime, setTotalHiddenTime] = useState(0);

  const hiddenStartTimeRef = useRef<number | null>(null);

  // ============================================================
  // 3.1. تحديث حالة الرؤية (Visibility Update)
  // ============================================================

  const updateVisibility = useCallback(
    (visible: boolean) => {
      setIsVisible(visible);
      setVisibilityState(visible ? 'visible' : 'hidden');
      setWasHidden(!visible);

      if (visible) {
        setLastVisibleAt(new Date());

        // حساب الوقت المخفي
        if (trackHiddenTime && hiddenStartTimeRef.current) {
          const hiddenDuration = (Date.now() - hiddenStartTimeRef.current) / 1000;
          setTotalHiddenTime((prev) => prev + hiddenDuration);
          hiddenStartTimeRef.current = null;
        }
      } else {
        setLastHiddenAt(new Date());

        // بدء حساب الوقت
        if (trackHiddenTime) {
          hiddenStartTimeRef.current = Date.now();
        }

        // زيادة العداد
        if (trackHiddenCount) {
          setHiddenCount((prev) => prev + 1);
        }
      }

      // استدعاء دالة التغيير
      if (onChange) {
        onChange(visible);
      }
    },
    [trackHiddenTime, trackHiddenCount, onChange],
  );

  // ============================================================
  // 3.2. مراقبة Page Visibility API
  // ============================================================

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      updateVisibility(document.visibilityState === 'visible');
    };

    // الاستماع لتغييرات حالة الرؤية
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateVisibility]);

  // ============================================================
  // 3.3. واجهة الهوك (Return Value)
  // ============================================================

  return {
    isVisible,
    visibilityState,
    wasHidden,
    hiddenCount,
    lastHiddenAt,
    lastVisibleAt,
    totalHiddenTime,
  };
}

// ============================================================
// 4. دوال مساعدة (Utility Functions)
// ============================================================

export function useIsPageVisible(): boolean {
  const { isVisible } = usePageVisibility({ trackHiddenCount: false, trackHiddenTime: false });
  return isVisible;
}

export function useVisibilityListener(onVisible?: () => void, onHidden?: () => void): void {
  const { isVisible } = usePageVisibility({ trackHiddenCount: false, trackHiddenTime: false });

  useEffect(() => {
    if (isVisible) {
      onVisible?.();
    } else {
      onHidden?.();
    }
  }, [isVisible, onVisible, onHidden]);
}

// ============================================================
// 5. تحميل كسول (Lazy Loading Hook)
// ============================================================

export function useWhenPageVisible(callback: () => void, deps: React.DependencyList = []): void {
  const { isVisible } = usePageVisibility();

  useEffect(() => {
    if (isVisible) {
      callback();
    }
  }, [isVisible, callback, ...deps]);
}
