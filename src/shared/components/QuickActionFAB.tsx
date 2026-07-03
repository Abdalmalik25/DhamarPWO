// ============================================================
// QuickActionFAB.tsx - زر الإجراءات السريعة العائم (Enterprise v1.0)
// متوافق مع: React 19 | Tailwind CSS | RTL
// ============================================================

import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Plus, Phone, Search, Printer, MessageCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export type FABAction = {
  /** معرف فريد للإجراء */
  id: string;
  /** تسمية الإجراء */
  label: string;
  /** أيقونة الإجراء */
  icon: React.ReactNode;
  /** دالة التنفيذ عند النقر */
  onClick: () => void;
  /** لون الأيقونة (اختياري) */
  color?: string;
  /** هل هذا الإجراء محدد كإجراء رئيسي؟ */
  primary?: boolean;
};

export interface QuickActionFABProps {
  /** قائمة الإجراءات السريعة */
  actions?: FABAction[];
  /** موضع الزر العائم */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** لون الزر الرئيسي */
  color?: string;
  /** أيقونة الزر الرئيسي */
  icon?: React.ElementType;
  /** هل تريد إخفاء التسميات؟ */
  hideLabels?: boolean;
  /** هل تريد تعطيل الزر؟ */
  disabled?: boolean;
  /** فئات CSS إضافية */
  className?: string;
  /** ما إذا كان الزر مفتوحًا افتراضيًا */
  defaultOpen?: boolean;
  /** دالة تُستدعى عند فتح/إغلاق القائمة */
  onToggle?: (isOpen: boolean) => void;
}

// ============================================================
// 2. الإجراءات الافتراضية (Default Actions)
// ============================================================

const DEFAULT_ACTIONS: FABAction[] = [
  {
    id: 'track',
    label: 'تتبع معاملة',
    icon: <Search size={20} />,
    onClick: () => console.log('تتبع معاملة'),
    color: 'bg-blue-500',
  },
  {
    id: 'print',
    label: 'طباعة نموذج',
    icon: <Printer size={20} />,
    onClick: () => console.log('طباعة نموذج'),
    color: 'bg-amber-500',
  },
  {
    id: 'contact',
    label: 'اتصل بنا',
    icon: <Phone size={20} />,
    onClick: () => console.log('اتصل بنا'),
    color: 'bg-emerald-500',
  },
  {
    id: 'whatsapp',
    label: 'واتساب',
    icon: <MessageCircle size={20} />,
    onClick: () => console.log('واتساب'),
    color: 'bg-green-500',
  },
];

// ============================================================
// 3. المكون الرئيسي (Main Component)
// ============================================================

const QuickActionFAB = memo(function QuickActionFAB({
  actions = DEFAULT_ACTIONS,
  position = 'bottom-right',
  color = 'bg-gradient-to-r from-gov-600 to-gov-700',
  icon: MainIcon = Plus,
  hideLabels = false,
  disabled = false,
  className = '',
  defaultOpen = false,
  onToggle,
}: QuickActionFABProps) {
  // ============================================================
  // 3.1. الحالات الداخلية (Internal State)
  // ============================================================

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const fabRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // 3.2. معالجات الأحداث (Event Handlers)
  // ============================================================

  const toggleFab = useCallback(() => {
    if (disabled) return;
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  }, [isOpen, disabled, onToggle]);

  const handleActionClick = useCallback(
    (action: FABAction) => {
      action.onClick();
      // إغلاق القائمة بعد النقر
      setIsOpen(false);
      onToggle?.(false);
    },
    [onToggle],
  );

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onToggle?.(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // ============================================================
  // 3.3. موضع الزر (Positioning)
  // ============================================================

  const positionClasses: Record<string, string> = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  // ============================================================
  // 3.4. التصيير (Rendering)
  // ============================================================

  const fabContent = (
    <div
      ref={fabRef}
      className={`fixed z-[100] flex flex-col-reverse items-center gap-3 ${positionClasses[position]} ${className}`}
      dir="rtl"
    >
      {/* ===== الإجراءات الفرعية ===== */}
      <div
        className={`flex flex-col-reverse items-center gap-3 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {actions.map((action, index) => {
          return (
            <div
              key={action.id}
              className="flex items-center gap-3 group"
              style={{ transitionDelay: `${isOpen ? index * 50 : 0}ms` }}
            >
              {/* تسمية الإجراء */}
              {!hideLabels && (
                <div className="bg-gray-800/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  {action.label}
                </div>
              )}

              {/* زر الإجراء */}
              <button
                onClick={() => handleActionClick(action)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white transition-all duration-300 hover:scale-110 active:scale-95 ${
                  action.color || 'bg-gov-500'
                }`}
                aria-label={action.label}
                title={action.label}
              >
                {action.icon}
              </button>
            </div>
          );
        })}
      </div>

      {/* ===== الزر الرئيسي ===== */}
      <button
        onClick={toggleFab}
        disabled={disabled}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          disabled ? 'opacity-50 cursor-not-allowed' : color
        } ${isOpen ? 'shadow-gov-500/50 ring-4 ring-gov-500/20' : 'shadow-xl'}`}
        aria-label={isOpen ? 'إغلاق الإجراءات' : 'فتح الإجراءات'}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          <MainIcon
            size={24}
            className="text-white"
          />
        </div>

        {/* نبض للإشارة إلى وجود إجراءات جديدة */}
        {!isOpen && !disabled && actions.length > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </button>
    </div>
  );

  return typeof globalThis !== 'undefined' && 'document' in globalThis
    ? createPortal(fabContent, document.body)
    : null;
});

// ============================================================
// 4. تصدير الكل (Exports)
// ============================================================

export default QuickActionFAB;
