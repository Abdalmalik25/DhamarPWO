// ============================================================
// Breadcrumb.tsx - مكون مسار التنقل
// ============================================================

import { memo } from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import type { Page } from '../../types/page';

interface BreadcrumbItem {
  label: string;
  page?: Page;
}

interface BreadcrumbProps {
  currentPage: Page;
  items: BreadcrumbItem[];
  onNavigate: (page: Page) => void;
}

const pageNames: Record<Page, string> = {
  home: 'الرئيسية',
  services: 'الخدمات',
  forms: 'النماذج',
  about: 'عن المكتب',
  contact: 'تواصل معنا',
  track: 'تتبع المعاملة',
  documents: 'الوثائق',
  guidelines: 'الدليل الإرشادي',
  news: 'الأخبار',
  gallery: 'المعرض',
  privacy: 'سياسة الخصوصية',
  terms: 'شروط الاستخدام',
};

const Breadcrumb = memo(({ currentPage, items, onNavigate }: BreadcrumbProps) => {
  const currentPageName = pageNames[currentPage] || currentPage;

  return (
    <nav
      className="flex items-center gap-2 text-sm"
      aria-label="مسار التنقل"
    >
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-1 text-gray-500 hover:text-gov-600 transition-colors"
        aria-label="الرئيسية"
      >
        <Home size={14} />
        <span className="hidden sm:inline">الرئيسية</span>
      </button>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
        >
          <ChevronLeft
            size={14}
            className="text-gray-400"
          />
          {item.page ? (
            <button
              onClick={() => onNavigate(item.page as Page)}
              className="text-gray-500 hover:text-gov-600 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
        </div>
      ))}

      {items.length === 0 && (
        <>
          <ChevronLeft
            size={14}
            className="text-gray-400"
          />
          <span className="text-gray-800 font-medium">{currentPageName}</span>
        </>
      )}
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
