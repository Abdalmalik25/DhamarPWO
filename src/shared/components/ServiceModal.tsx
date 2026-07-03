// ============================================================
// ServiceModal.tsx - نظام الحوار المؤسسي الذكي (Smart Enterprise v5.0)
// متوافق مع: React 19 | TypeScript 5.8+ | A11y | Portal
// ============================================================

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  useId,
  ReactNode,
  SyntheticEvent,
} from 'react';
import type { Page } from '../../types/page';
import { createPortal } from 'react-dom';
import {
  X,
  Printer,
  FileText,
  Download,
  Maximize2,
  Minimize2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Info,
} from 'lucide-react';
import Skeleton, { CardSkeleton } from './Skeleton';
import { OptimizedImage } from '../hooks/useImageOptimization.tsx';

// ============================================================
// 1. أنواع البيانات المتقدمة (Advanced Types)
// ============================================================

export type ModalVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface ServiceModalProps {
  /** هل النافذة مفتوحة؟ */
  isOpen: boolean;
  /** دالة الإغلاق (تُستدعى عند طلب الإغلاق من النظام) */
  onClose: () => void;
  /** دالة الإرسال (تُستدعى عند الضغط على زر التأكيد).
   *  يجب أن تُرجع `Promise` إذا كنت تريد التحكم في التدفق. */
  onSubmit?: () => Promise<void> | void;
  /** معرف الخدمة (اختياري) */
  serviceId?: string;
  /** اسم الخدمة المعروضة */
  serviceName?: string;
  /** محتوى النافذة - يمكن أن يكون `ReactNode` أو دالة `render` */
  children?: ReactNode | ((props: { close: () => void; isLoading: boolean }) => ReactNode);
  /** نوع النافذة (للتحكم في الألوان) */
  variant?: ModalVariant;
  /** تسمية الزر الرئيسي */
  confirmLabel?: string;
  /** تسمية زر الإلغاء */
  cancelLabel?: string;
  /** هل تريد إخفاء شريط الأدوات (التحميل والطباعة)؟ */
  hideToolbar?: boolean;
  /** إظهار شريط التحميل (Skeleton) أثناء تحميل المحتوى */
  isLoading?: boolean;
  /** رسالة خطأ لعرضها داخل النافذة */
  error?: string | null;
  /** استدعاء عند بدء التحميل */
  onDownload?: () => void;
  /** استدعاء عند بدء الطباعة */
  onPrint?: () => void;
  /** فئة CSS إضافية للحاوية */
  className?: string;
  /** دالة تنقل إضافية (للمكونات الأب) */
  onNavigate?: (page: Page) => void;
}

// ============================================================
// 2. تكوينات التصميم (Design Configurations)
// ============================================================

const VARIANT_CONFIG: Record<ModalVariant, { header: string; button: string; icon: ReactNode }> = {
  default: {
    header: 'from-gov-600 to-gov-700',
    button: 'bg-gold-500 hover:bg-gold-600',
    icon: (
      <FileText
        size={20}
        className="text-white"
      />
    ),
  },
  success: {
    header: 'from-emerald-600 to-emerald-700',
    button: 'bg-emerald-500 hover:bg-emerald-600',
    icon: (
      <CheckCircle2
        size={20}
        className="text-white"
      />
    ),
  },
  warning: {
    header: 'from-amber-600 to-amber-700',
    button: 'bg-amber-500 hover:bg-amber-600',
    icon: (
      <AlertCircle
        size={20}
        className="text-white"
      />
    ),
  },
  error: {
    header: 'from-red-600 to-red-700',
    button: 'bg-red-500 hover:bg-red-600',
    icon: (
      <AlertCircle
        size={20}
        className="text-white"
      />
    ),
  },
  info: {
    header: 'from-blue-600 to-blue-700',
    button: 'bg-blue-500 hover:bg-blue-600',
    icon: (
      <Info
        size={20}
        className="text-white"
      />
    ),
  },
};

// ============================================================
// 3. المكون الرئيسي (Main Component)
// ============================================================

const ServiceModal = memo(function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  serviceId,
  serviceName = 'الخدمة المطلوبة',
  children,
  variant = 'default',
  confirmLabel = 'تأكيد وإرسال',
  cancelLabel = 'إلغاء',
  hideToolbar = false,
  isLoading: externalLoading = false,
  error: externalError = null,
  onDownload,
  onPrint,
  className = '',
}: ServiceModalProps) {
  // ============================================================
  // 3.1. الحالات الداخلية (Internal State)
  // ============================================================

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const labelId = useId();
  const descriptionId = useId();

  // تحديد ما إذا كان التحميل يتم التحكم فيه خارجياً أم داخلياً
  const isLoading = useMemo(
    () => (externalLoading !== undefined ? externalLoading : internalLoading),
    [externalLoading, internalLoading],
  );

  const error = useMemo(
    () => (externalError !== null ? externalError : internalError),
    [externalError, internalError],
  );

  // الحصول على تكوين النوع الحالي
  const variantConfig = useMemo(() => VARIANT_CONFIG[variant] || VARIANT_CONFIG.default, [variant]);

  // ============================================================
  // 3.2. إدارة دورة الحياة (Lifecycle Management)
  // ============================================================

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // إدارة التركيز عند فتح/إغلاق النافذة
  useEffect(() => {
    if (isOpen) {
      // حفظ التركيز السابق
      previousFocusRef.current = document.activeElement as HTMLElement;

      // منع التمرير في الخلفية
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';

      // التركيز على النافذة (للمساعدة في الوصولية)
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 50);
    } else {
      // استعادة التمرير والتركيز
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }

      // إعادة تعيين الحالات الداخلية عند الإغلاق
      setInternalLoading(false);
      setInternalError(null);
    }
  }, [isOpen]);

  // ============================================================
  // 3.3. معالجة لوحة المفاتيح (Keyboard Handling)
  // ============================================================

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ============================================================
  // 3.4. معالجات الأحداث (Event Handlers)
  // ============================================================

  const handleDownload = useCallback(() => {
    if (onDownload) onDownload();
  }, [onDownload]);

  const handlePrint = useCallback(() => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  }, [onPrint]);

  const handleSubmit = useCallback(async () => {
    if (isLoading) return;

    setInternalError(null);
    setInternalLoading(true);

    try {
      if (onSubmit) {
        await onSubmit();
      }
      // إذا لم تكن `onSubmit` تُرجع Promise، نغلق النافذة
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال البيانات.';
      setInternalError(message);
    } finally {
      if (isMounted) {
        setInternalLoading(false);
      }
    }
  }, [onSubmit, onClose, isLoading, isMounted]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // ============================================================
  // 3.5. التصيير (Rendering)
  // ============================================================

  if (!isOpen || !isMounted) return null;

  // تحضير المحتوى (إذا كان `children` دالة، نستدعيها)
  const renderedChildren =
    typeof children === 'function' ? children({ close: onClose, isLoading }) : children;

  // نافذة الحوار
  const modalContent = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`
          bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isFullscreen ? 'w-full h-full max-w-full max-h-full rounded-none' : 'w-full max-w-5xl max-h-[95vh]'}
          animate-in zoom-in-95 duration-300
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        {/* ===== الرأس (Header) ===== */}
        <div
          className={`bg-gradient-to-l ${variantConfig.header} px-6 py-4 flex items-center justify-between shrink-0`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              {variantConfig.icon}
            </div>
            <div>
              <h3
                id={labelId}
                className="font-black text-white text-lg"
              >
                {serviceName}
              </h3>
              {serviceId && (
                <p className="text-white/70 text-xs font-medium">رقم المرجع: {serviceId}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors text-white"
              aria-label={isFullscreen ? 'تصغير' : 'تكبير'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors text-white"
              aria-label="إغلاق النافذة"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ===== شريط الأدوات (Toolbar) ===== */}
        {!hideToolbar && (
          <div className="bg-gov-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-sm font-semibold transition-all shadow-sm"
              >
                <Download size={16} />
                تحميل
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-sm font-semibold transition-all shadow-sm"
              >
                <Printer size={16} />
                طباعة
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-2 py-0.5 bg-gov-100 text-gov-600 rounded-full text-[10px] font-bold">
                نموذج رسمي
              </span>
              <span>معتمد</span>
            </div>
          </div>
        )}

        {/* ===== المحتوى (Content) ===== */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white relative">
          {/* عرض حالة التحميل (Skeleton) */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <CardSkeleton className="max-w-md mx-auto" />
            </div>
          )}

          {/* عرض الخطأ */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg text-sm text-red-700 flex items-start gap-3">
              <AlertCircle
                size={18}
                className="shrink-0 mt-0.5"
              />
              <div>
                <p className="font-bold">حدث خطأ</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* عرض المحتوى الفعلي */}
          <div id={descriptionId}>{renderedChildren}</div>
        </div>

        {/* ===== التذييل (Footer) ===== */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-red-500">*</span>
            <span>الحقول الإلزامية</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLabel}
            </button>
            {onSubmit && (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`
                  px-6 py-2.5 ${variantConfig.button} text-white rounded-xl font-bold transition-all shadow-md
                  disabled:opacity-70 disabled:cursor-not-allowed
                  flex items-center gap-2
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {confirmLabel}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // استخدام `createPortal` لتصيير النافذة خارج التسلسل الهرمي للـ DOM
  return isMounted ? createPortal(modalContent, document.body) : null;
});

// ============================================================
// 4. تصدير الكل (Exports)
// ============================================================

export default ServiceModal;
