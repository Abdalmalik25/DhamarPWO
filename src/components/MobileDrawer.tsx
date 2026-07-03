// ============================================================
// MobileDrawer - القائمة الجانبية المنزلقة للموبايل (مع الشعار الرسمي)
// ============================================================

import { memo, useEffect, useRef, useCallback } from 'react';
import type { Page } from '../types/page';
import {
  X,
  Home,
  HardHat,
  FileText,
  BookOpen,
  Info,
  PhoneCall,
  Truck,
  Printer,
  MapPin,
  Clock,
} from 'lucide-react';
// ملاحظة: إذا كنت تستخدم Next.js أو React، أعد تسمية OptimizedImage إلى Image حسب ما تستخدم

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onTrack: () => void;
}

const drawerItems = [
  { id: 'home' as Page, label: 'الرئيسية', icon: Home },
  { id: 'services' as Page, label: 'الخدمات', icon: HardHat },
  { id: 'forms' as Page, label: 'النماذج الرسمية', icon: FileText },
  { id: 'guidelines' as Page, label: 'الدليل الإرشادي', icon: BookOpen },
  { id: 'track' as Page, label: 'تتبع المعاملة', icon: Truck, highlight: true },
  { id: 'documents' as Page, label: 'الوثائق والدلائل', icon: FileText },
  { id: 'about' as Page, label: 'عن المكتب', icon: Info },
  { id: 'contact' as Page, label: 'تواصل معنا', icon: PhoneCall },
];

const MobileDrawer = memo(function MobileDrawer({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  onTrack,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // حبس التركيز داخل القائمة عند الفتح
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        const firstButton = drawerRef.current?.querySelector('button');
        firstButton?.focus();
      }, 100);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // منع التمرير في الخلفية عند فتح القائمة
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // إغلاق القائمة بالضغط على Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavigate = useCallback(
    (page: Page) => {
      onNavigate(page);
      onClose();
    },
    [onNavigate, onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden no-print">
      {/* الخلفية الداكنة */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* القائمة الجانبية */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="القائمة الرئيسية"
      >
        {/* رأس القائمة (مُحسن مع الشعار الرسمي) */}
        <div className="bg-gov-800 p-5 flex items-center justify-between relative overflow-hidden">
          {/* زخرفة ذهبية خلفية */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex items-center gap-3 z-10">
            {/* شعار المباني - رمز الأشغال */}
            <div className="w-12 h-12 bg-white/90 rounded-xl p-1.5 flex items-center justify-center shadow-sm shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-full h-full"
                fill="none"
                stroke="#b8962e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
                <path d="M9 9h.01" />
                <path d="M9 12h.01" />
                <path d="M9 15h.01" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="text-white font-bold text-base leading-tight">مكتب الأشغال</div>
              <div className="text-gold-400 text-[11px] font-semibold tracking-wider">
                محافظة ذمار
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>
        </div>

        {/* قائمة العناصر */}
        <nav
          className="flex-1 overflow-y-auto p-3 space-y-1"
          aria-label="روابط التصفح"
        >
          {drawerItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full text-right flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gov-600 text-white shadow-md'
                    : item.highlight
                      ? 'bg-gradient-to-l from-gold-500 to-gold-600 text-white shadow-sm hover:shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gov-600'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  size={18}
                  className={isActive || item.highlight ? '' : 'text-gray-400'}
                />
                <span>{item.label}</span>
                {isActive && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-gold-400" />}
              </button>
            );
          })}
        </nav>

        {/* معلومات الاتصال السريع */}
        <div className="border-t border-gray-100 p-3 space-y-2">
          <button
            onClick={() => {
              onTrack();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors"
          >
            <Truck size={18} />
            تتبع معاملة
          </button>

          <div className="flex items-center gap-2 px-4 py-2 text-[10px] text-gray-400">
            <MapPin size={10} />
            <span> ذمار</span>
            <span className="mx-1">|</span>
            <Clock size={10} />
            <span>السبت - الأربعاء 8ص-3م</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MobileDrawer;
