// ============================================================
// NavigationHistory.tsx - نظام التوجيه المؤسسي المتقدم (v2.0)
// متوافق مع: React 19 | TypeScript 5.8+ | SessionStorage
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  useMemo,
} from 'react';
import type { Page } from '../types/page';
import * as PageTypes from '../types/page';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export interface NavigationHistoryContextType {
  /** سجل الصفحات الكامل */
  history: Page[];
  /** الفهرس الحالي في السجل */
  currentIndex: number;
  /** الصفحة الحالية */
  currentPage: Page;
  /** الصفحة التي أتى منها المستخدم (لتتبع المصدر) */
  sourcePage: Page | null;
  /** سجل الصفحات كسلسلة نصية (للمراقبة والتصدير) */
  pageHistory: string;
  /** العودة للصفحة السابقة */
  goBack: () => void;
  /** التقدم للصفحة التالية */
  goForward: () => void;
  /** هل يمكن العودة للخلف؟ */
  canGoBack: boolean;
  /** هل يمكن التقدم للأمام؟ */
  canGoForward: boolean;
  /** التنقل إلى صفحة جديدة */
  navigate: (page: Page, options?: { replace?: boolean; scroll?: boolean }) => void;
  /** إعادة تعيين السجل بالكامل */
  resetHistory: (page?: Page) => void;
  /** التحقق مما إذا كان يمكن التنقل إلى صفحة معينة (لأغراض أمنية) */
  canNavigate: (page: Page) => boolean;
}

// Create the context instance
export const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(
  undefined,
);

// ============================================================
// 2. التكوينات الأساسية (Constants)
// ============================================================

const MAX_HISTORY_LENGTH = 50;
const DEFAULT_PAGE: Page = 'home';

// ============================================================
// 3. مزود الحالة (NavigationProvider)
// ============================================================

export function NavigationProvider({ children }: { children: ReactNode }) {
  // ============================================================
  // 3.1. الحالات الداخلية (Internal State)
  // ============================================================

  const [history, setHistory] = useState<Page[]>(() => {
    // Validate stored history before using it
    try {
      const saved = sessionStorage.getItem('pwo_nav_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.history) && typeof parsed.currentIndex === 'number') {
          const validPage = parsed.history[parsed.currentIndex];
          // Only restore if the page is valid
          if (
            validPage &&
            [
              'home',
              'services',
              'forms',
              'about',
              'contact',
              'track',
              'documents',
              'guidelines',
              'privacy',
              'terms',
            ].includes(validPage)
          ) {
            return parsed.history;
          }
        }
      }
    } catch {
      // تجاهل الأخطاء واستخدام القيمة الافتراضية
    }
    return [DEFAULT_PAGE];
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('pwo_nav_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentIndex === 'number' && parsed.currentIndex >= 0) {
          return parsed.currentIndex;
        }
      }
    } catch {
      // تجاهل الأخطاء
    }
    return 0;
  });

  // حفظ الصفحة السابقة لتتبع المصدر
  const [sourcePage, setSourcePage] = useState<Page | null>(null);

  // Use refs to avoid stale closures in navigate
  const historyRef = useRef(history);
  const currentIndexRef = useRef(currentIndex);

  // Keep refs in sync with state
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // ============================================================
  // 3.2. حساب القيم المشتقة (Derived Values)
  // ============================================================

  const currentPage = useMemo(() => {
    return history[currentIndex] || DEFAULT_PAGE;
  }, [history, currentIndex]);

  const pageHistory = useMemo(() => {
    return history.join(' → ');
  }, [history]);

  const canGoBack = useMemo(() => currentIndex > 0, [currentIndex]);
  const canGoForward = useMemo(
    () => currentIndex < history.length - 1,
    [currentIndex, history.length],
  );

  // ============================================================
  // 3.3. دوال التنقل الأساسية (Navigation Functions)
  // ============================================================

  const navigate = useCallback(
    (page: Page, options?: { replace?: boolean; scroll?: boolean }) => {
      const { replace = false, scroll = true } = options || {};

      // Use refs to get latest values and avoid stale closures
      const currentHistory = historyRef.current;
      const currentIdx = currentIndexRef.current;

      // إذا كانت الصفحة هي نفسها، لا تفعل شيئًا
      if (currentHistory[currentIdx] === page) return false;

      // حفظ الصفحة الحالية كمصدر للصفحة الجديدة
      setSourcePage(currentHistory[currentIdx]);

      setHistory((prevHistory) => {
        // إنشاء سجل جديد عن طريق اقتطاع السجل الحالي عند المؤشر الحالي
        const baseHistory = prevHistory.slice(0, currentIdx + 1);

        let newHistory: Page[];
        let newIndex: number;

        if (replace) {
          // استبدال الصفحة الحالية (مفيد عند إعادة التوجيه)
          const updated = [...baseHistory];
          updated[updated.length - 1] = page;
          newHistory = updated;
          newIndex = updated.length - 1;
        } else {
          // إضافة صفحة جديدة إلى السجل
          newHistory = [...baseHistory, page];
          // التأكد من أن السجل لا يتجاوز الحد الأقصى
          if (newHistory.length > MAX_HISTORY_LENGTH) {
            newHistory = newHistory.slice(-MAX_HISTORY_LENGTH);
          }
          newIndex = newHistory.length - 1;
        }

        setCurrentIndex(newIndex);

        // التمرير إلى أعلى الصفحة
        if (scroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        return newHistory;
      });

      return true;
    },
    [], // No dependencies needed - using refs for latest values
  );

  const goBack = useCallback(() => {
    if (canGoBack) {
      const nextIndex = currentIndex - 1;
      setCurrentIndex(nextIndex);
      // تحديث المصدر عند الرجوع
      setSourcePage(history[nextIndex] || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [canGoBack, currentIndex, history]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSourcePage(history[nextIndex] || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [canGoForward, currentIndex, history]);

  const resetHistory = useCallback((page: Page = DEFAULT_PAGE) => {
    const pageToReset = PageTypes.App.resolvePage(page);
    setHistory([pageToReset]);
    setCurrentIndex(0);
    setSourcePage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ============================================================
  // 3.4. التحقق من الصلاحية (Validation)
  // ============================================================

  const canNavigate = useCallback((page: Page): boolean => {
    // يمكنك إضافة منطق أمان هنا (مثل: التحقق من صلاحيات المستخدم)
    return true;
  }, []);

  // ============================================================
  // 3.5. حفظ السجل في SessionStorage (Persist State)
  // ============================================================

  useEffect(() => {
    try {
      const data = JSON.stringify({ history, currentIndex });
      sessionStorage.setItem('pwo_nav_history', data);
    } catch {
      // تجاهل الأخطاء
    }
  }, [history, currentIndex]);

  // ============================================================
  // 3.6. تحديث عنوان الصفحة (Document Title)
  // ============================================================

  useEffect(() => {
    const titles: Partial<Record<Page, string>> = {
      home: 'مكتب الأشغال العامة والطرق - محافظة ذمار',
      services: 'دليل الخدمات الإلكترونية - مكتب الأشغال العامة والطرق',
      forms: 'النماذج الرسمية - مكتب الأشغال العامة والطرق',
      about: 'عن المكتب - مكتب الأشغال العامة والطرق',
      contact: 'تواصل معنا - مكتب الأشغال العامة والطرق',
      track: 'تتبع المعاملة - مكتب الأشغال العامة والطرق',
      documents: 'الوثائق والدلائل الرسمية - مكتب الأشغال العامة والطرق',
      guidelines: 'الدليل الإرشادي - مكتب الأشغال العامة والطرق',
      news: 'الأخبار - مكتب الأشغال العامة والطرق',
      gallery: 'المعرض - مكتب الأشغال العامة والطرق',
      privacy: 'سياسة الخصوصية - مكتب الأشغال العامة والطرق',
      terms: 'شروط الاستخدام - مكتب الأشغال العامة والطرق',
    };

    const title = titles[currentPage];
    if (title) {
      // استخدام setTimeout لضمان أن المتصفح لديه الوقت لتحديث العنوان
      const timeoutId = setTimeout(() => {
        document.title = title;
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [currentPage]);

  // ============================================================
  // 3.7. تصدير القيم (Provider Value)
  // ============================================================

  return (
    <NavigationHistoryContext.Provider
      value={{
        history,
        currentIndex,
        currentPage,
        sourcePage,
        pageHistory,
        goBack,
        goForward,
        canGoBack,
        canGoForward,
        navigate,
        resetHistory,
        canNavigate,
      }}
    >
      {children}
    </NavigationHistoryContext.Provider>
  );
}

// ============================================================
// 4. هوك الاستخدام (useNavigation)
// ============================================================

export function useNavigation() {
  const context = useContext(NavigationHistoryContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// ============================================================
// 5. دوال مساعدة للاستخدام السريع (Utilities)
// ============================================================

/**
 * هوك للعودة إلى الصفحة السابقة مع إمكانية التمرير للخلف.
 */
export function useGoBack() {
  const { goBack, canGoBack } = useNavigation();
  return useCallback(() => {
    if (canGoBack) {
      goBack();
    } else {
      // إذا لم يكن هناك صفحة سابقة، اذهب إلى الصفحة الرئيسية
      window.location.href = '/';
    }
  }, [canGoBack, goBack]);
}

/**
 * هوك للحصول على عنوان الصفحة الحالية.
 */
export function usePageTitle() {
  const { currentPage } = useNavigation();
  const titles: Partial<Record<Page, string>> = {
    home: 'مكتب الأشغال العامة والطرق - محافظة ذمار',
    services: 'دليل الخدمات',
    forms: 'النماذج الرسمية',
    about: 'عن المكتب',
    contact: 'تواصل معنا',
    track: 'تتبع المعاملة',
    documents: 'الوثائق والدلائل',
    guidelines: 'الدليل الإرشادي',
    news: 'الأخبار',
    gallery: 'المعرض',
  };
  return titles[currentPage] || 'مكتب الأشغال العامة والطرق';
}
