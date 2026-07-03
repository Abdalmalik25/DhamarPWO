// ============================================================
// ExitWarning.tsx - نظام حماية البيانات الذكي (Enterprise v1.0)
// متوافق مع: React 19 | Tailwind CSS | RTL
// ============================================================

import { useEffect, useCallback, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { AlertTriangle, X, Shield } from 'lucide-react';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export interface ExitWarningProps {
  /** الرسالة المخصصة للتحذير */
  message?: string;
  /** عنوان التحذير */
  title?: string;
  /** تفعيل التحذير فقط إذا كان هناك تغييرات غير محفوظة */
  enabled?: boolean;
  /** تجاهل بعض الصفحات (مثل: الصفحات التي لا تحتوي على نماذج) */
  excludePaths?: string[];
  /** دالة تُستدعى عند تأكيد المغادرة */
  onConfirm?: () => void;
  /** دالة تُستدعى عند إلغاء المغادرة */
  onCancel?: () => void;
}

export interface ExitWarningHandle {
  /** تفعيل التحذير يدوياً */
  enable: () => void;
  /** تعطيل التحذير يدوياً */
  disable: () => void;
  /** التحقق مما إذا كان التحذير مفعلاً */
  isEnabled: () => boolean;
}

// ============================================================
// 2. المكون الرئيسي (Main Component)
// ============================================================

const ExitWarning = forwardRef<ExitWarningHandle, ExitWarningProps>(function ExitWarning(
  {
    message = 'لديك تغييرات غير محفوظة. هل أنت متأكد من المغادرة؟ سيتم فقدان البيانات إذا واصلت.',
    title = 'تحذير الخروج',
    enabled = true,
    excludePaths = [],
    onConfirm,
    onCancel,
  },
  ref,
) {
  // ============================================================
  // 2.1. الحالات الداخلية (Internal State)
  // ============================================================

  const [isEnabled, setIsEnabled] = useState(enabled);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    type: 'beforeunload' | 'navigation';
    url?: string;
  } | null>(null);
  const navigationHandlerRef = useRef<(() => void) | null>(null);

  // ============================================================
  // 2.2. تصدير الدوال للاستخدام الخارجي (Imperative Handle)
  // ============================================================

  useImperativeHandle(ref, () => ({
    enable: () => setIsEnabled(true),
    disable: () => setIsEnabled(false),
    isEnabled: () => isEnabled,
  }));

  // ============================================================
  // 2.3. معالج مغادرة الصفحة (BeforeUnload Handler)
  // ============================================================

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (isEnabled) {
        // منع المغادرة وعرض رسالة تحذيرية (حسب المتصفح)
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    },
    [isEnabled, message],
  );

  // ============================================================
  // 2.4. معالج التنقل الداخلي (Internal Navigation Handler)
  // ============================================================

  const handleNavigation = useCallback(
    (event: Event) => {
      if (isEnabled) {
        // منع التنقل وعرض نافذة التحذير المخصصة
        event.preventDefault();

        // تخزين وجهة التنقل
        const target = (event as CustomEvent).detail?.url || window.location.href;
        setPendingNavigation({ type: 'navigation', url: target });
        setShowDialog(true);
      }
    },
    [isEnabled],
  );

  // ============================================================
  // 2.5. تسجيل وإلغاء الأحداث (Event Registration)
  // ============================================================

  useEffect(() => {
    // تسجيل أحداث مغادرة الصفحة
    window.addEventListener('beforeunload', handleBeforeUnload);

    // تسجيل أحداث التنقل الداخلي
    window.addEventListener('app-navigate', handleNavigation);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('app-navigate', handleNavigation);
    };
  }, [handleBeforeUnload, handleNavigation]);

  // ============================================================
  // 2.6. دوال معالجة النافذة (Dialog Handlers)
  // ============================================================

  const handleConfirm = useCallback(() => {
    setShowDialog(false);
    onConfirm?.();

    if (pendingNavigation) {
      // تنفيذ التنقل المعلق
      if (pendingNavigation.type === 'navigation' && pendingNavigation.url) {
        window.location.href = pendingNavigation.url;
      }
      setPendingNavigation(null);
    } else {
      // إذا لم يكن هناك تنقل معلق، فهذا يعني أن المستخدم أكد المغادرة
      // ولكن لا يوجد وجهة، لذا نعيد التوجيه إلى الصفحة الرئيسية
      window.location.href = '/';
    }
  }, [pendingNavigation, onConfirm]);

  const handleCancel = useCallback(() => {
    setShowDialog(false);
    setPendingNavigation(null);
    onCancel?.();
  }, [onCancel]);

  // ============================================================
  // 2.7. تجاوز حماية مغادرة الصفحة (Override)
  // ============================================================

  /**
   * تعطيل الحماية مؤقتاً للسماح بالمغادرة الآمنة
   * (مفيدة بعد حفظ البيانات بنجاح)
   */
  const disableProtection = useCallback(() => {
    setIsEnabled(false);
    // إزالة المعالج مؤقتاً
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);

  /**
   * إعادة تفعيل الحماية
   */
  const enableProtection = useCallback(() => {
    setIsEnabled(true);
    window.addEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);

  // ============================================================
  // 2.8. التصيير (Rendering)
  // ============================================================

  return (
    <>
      {showDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            {/* الرأس */}
            <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <AlertTriangle
                    size={20}
                    className="text-white"
                  />
                </div>
                <h3 className="font-black text-red-800 text-lg">{title}</h3>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-500"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            {/* المحتوى */}
            <div className="px-6 py-8">
              <div className="flex items-start gap-3 mb-6">
                <Shield
                  size={20}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-gray-700 text-base leading-relaxed">{message}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    يمكنك حفظ بياناتك قبل المغادرة لتجنب فقدانها.
                  </p>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  نعم، غادر الصفحة
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold text-sm transition-all"
                >
                  البقاء في الصفحة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// ============================================================
// 3. هوك مساعد للاستخدام السهل (useExitWarning)
// ============================================================

/**
 * هوك للتحكم في تحذير الخروج بسهولة.
 *
 * @example
 * const { enable, disable, isEnabled } = useExitWarning();
 *
 * // تفعيل التحذير عندما يبدأ المستخدم في كتابة نموذج
 * enable();
 *
 * // تعطيل التحذير عند حفظ البيانات بنجاح
 * disable();
 */
export function useExitWarning() {
  const ref = useRef<ExitWarningHandle>(null);

  const enable = useCallback(() => {
    ref.current?.enable();
  }, []);

  const disable = useCallback(() => {
    ref.current?.disable();
  }, []);

  const isEnabled = useCallback(() => {
    return ref.current?.isEnabled() || false;
  }, []);

  return {
    ref,
    enable,
    disable,
    isEnabled,
  };
}

// ============================================================
// 4. تصدير الكل (Exports)
// ============================================================

export default ExitWarning;
