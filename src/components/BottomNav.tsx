// ============================================================
// BottomNav - شريط التنقل السفلي للموبايل (محسّن)
// ============================================================

import { memo, useCallback } from 'react';
import type { Page } from '../types/page';
import {
  Home,
  FileText,
  Info,
  PhoneCall,
  HardHat,
  Truck,
  BookOpen,
  ScrollText,
} from 'lucide-react';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOffline?: boolean;
}

// قائمة التنقل الرئيسية للموبايل - 5 عناصر أساسية فقط للوضوح
const navItems = [
  { id: 'home' as Page, label: 'الرئيسية', icon: Home },
  { id: 'services' as Page, label: 'الخدمات', icon: HardHat },
  { id: 'track' as Page, label: 'تتبع', icon: Truck },
  { id: 'forms' as Page, label: 'النماذج', icon: FileText },
  { id: 'contact' as Page, label: 'اتصل', icon: PhoneCall },
];

// روابط إضافية تظهر عند توسعة القائمة
const expandedItems = [
  { id: 'guidelines' as Page, label: 'الدليل الإرشادي', icon: BookOpen },
  { id: 'documents' as Page, label: 'الوثائق', icon: ScrollText },
  { id: 'about' as Page, label: 'عن المكتب', icon: Info },
];

const accentColor = 'text-gov-600';

const BottomNav = memo(function BottomNav({ currentPage, onNavigate, isOffline }: BottomNavProps) {
  // معالج النقر الميمرايز
  const handleNavigate = useCallback(
    (page: Page) => {
      onNavigate(page);
    },
    [onNavigate],
  );

  // تحديد العنصر النشط أو الأب القريب
  const isActive = useCallback(
    (pageId: Page) => {
      if (currentPage === pageId) return true;
      // للصفحات التي ليس لها زر مباشر، نحدد أقرب زر
      if (currentPage === 'guidelines' && pageId === 'services') return false;
      if (currentPage === 'documents' && pageId === 'forms') return false;
      return false;
    },
    [currentPage],
  );

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom no-print"
      role="navigation"
      aria-label="التنقل السفلي"
    >
      {/* شريط حالة الإنترنت عند قطع الاتصال */}
      {isOffline && (
        <div
          className="absolute -top-6 left-0 right-0 bg-red-500 text-white text-[10px] text-center py-0.5 font-semibold"
          role="status"
          aria-live="polite"
        >
          ⚠️ غير متصل بالإنترنت - بعض الخدمات قد لا تعمل
        </div>
      )}

      <div className="flex items-center justify-around h-14 px-1">
        {navItems.map((item) => {
          const active = isActive(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200 group rounded-lg mx-0.5 ${
                active
                  ? `${accentColor} bg-gov-50`
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              tabIndex={0}
            >
              {/* مؤشر النقطة للصفحة النشطة */}
              {active && (
                <span
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gov-600 rounded-full"
                  aria-hidden="true"
                />
              )}

              <Icon
                size={active ? 20 : 18}
                className={`transition-all duration-200 ${
                  active ? 'scale-110' : 'group-hover:scale-110'
                }`}
                aria-hidden="true"
              />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* روابط إضافية مصغرة للصفحات الثانوية */}
      <div className="flex items-center justify-around px-4 py-1 bg-gray-50 border-t border-gray-100">
        {expandedItems.map((item) => {
          const active = currentPage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-medium transition-all ${
                active
                  ? 'bg-gov-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gov-600 hover:bg-white'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon
                size={10}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* حماية الـ safe area لأجهزة iOS */}
      <div
        className="h-safe-bottom bg-white"
        aria-hidden="true"
      />
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;
