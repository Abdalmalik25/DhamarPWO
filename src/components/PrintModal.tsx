import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  X,
  Printer,
  Search,
  FileText,
  Eye,
  ClipboardCheck,
  Hammer,
  Shield,
  Award,
  AlertCircle,
  Gavel,
  CheckCircle2,
  Building2,
  FileCheck,
  FileSearch,
  Star,
  Sparkles,
  Download,
} from 'lucide-react';

// ============================================================
// تعريف النماذج مع أيقونات هندسية مخصصة
// ============================================================
interface FormItem {
  ref: string;
  number: string;
  title: string;
  icon: React.ElementType;
  color: string;
  category: string;
  description: string;
  categoryIcon: React.ElementType;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isUrgent?: boolean;
  estimatedTime?: string;
}

const FORMS: FormItem[] = [
  {
    ref: 'N-01',
    number: 'ن-1',
    title: 'طلب خدمة هندسية موحد (تراخيص)',
    icon: FileText,
    color: '#2563eb',
    category: 'التراخيص الهندسية',
    description: 'طلب تراخيص البناء والتجديد والتعديل والهدم والتسوير',
    categoryIcon: Building2,
    tags: ['تراخيص', 'بناء', 'هندسي'],
    isPopular: true,
    estimatedTime: '5-10 دقائق',
  },
  {
    ref: 'N-02',
    number: 'ن-2',
    title: 'مراجعة واعتماد المخططات الهندسية',
    icon: ClipboardCheck,
    color: '#059669',
    category: 'المخططات الهندسية',
    description: 'تقديم المخططات المعمارية والإنشائية للمراجعة والاعتماد',
    categoryIcon: Layers,
    tags: ['مخططات', 'اعتماد', 'هندسي'],
    isPopular: true,
    isNew: true,
    estimatedTime: '10-15 دقائق',
  },
  {
    ref: 'N-03',
    number: 'ن-3',
    title: 'تكليف لجنة معاينة فنية وميدانية',
    icon: Hammer,
    color: '#d97706',
    category: 'المعاينة الميدانية',
    description: 'طلب النزول الميداني للكشف والاستلام الهندسي',
    categoryIcon: MapPin,
    tags: ['معاينة', 'ميدانية', 'فنية'],
    isUrgent: true,
    estimatedTime: '5-8 دقائق',
  },
  {
    ref: 'N-04',
    number: 'ن-4',
    title: 'تصريح أعمال طرق وحفريات',
    icon: Construction,
    color: '#ea580c',
    category: 'الطرق والبنية التحتية',
    description: 'استئذان الحفر وتمديد شبكات البنية التحتية',
    categoryIcon: Construction,
    tags: ['طرق', 'حفريات', 'بنية تحتية'],
    estimatedTime: '8-12 دقائق',
  },
  {
    ref: 'N-05',
    number: 'ن-5',
    title: 'إصدار إفادة فنية أو شهادة',
    icon: Award,
    color: '#7c3aed',
    category: 'الإفادات والشهادات',
    description: 'استخراج الإفادات التنظيمية والشهادات الهندسية',
    categoryIcon: FileCheck,
    tags: ['إفادات', 'شهادات', 'رسمي'],
    isPopular: true,
    estimatedTime: '5-7 دقائق',
  },
  {
    ref: 'N-06',
    number: 'ن-6',
    title: 'تقديم شكوى أو بلاغ هندسي',
    icon: AlertCircle,
    color: '#e11d48',
    category: 'الشكاوى والبلاغات',
    description: 'الإبلاغ عن المخالفات الإنشائية والتعديات',
    categoryIcon: Shield,
    tags: ['شكاوى', 'بلاغات', 'مخالفات'],
    isUrgent: true,
    estimatedTime: '8-10 دقائق',
  },
  {
    ref: 'N-07',
    number: 'ن-7',
    title: 'تظلم وإعادة نظر في قرار',
    icon: Gavel,
    color: '#dc2626',
    category: 'التظلمات',
    description: 'الاعتراض على القرارات الإدارية والفنية',
    categoryIcon: Scale,
    tags: ['تظلمات', 'اعتراض', 'قانوني'],
    estimatedTime: '10-15 دقائق',
  },
  {
    ref: 'N-08',
    number: 'ن-8',
    title: 'الإقرارات والتعهدات القانونية',
    icon: CheckCircle2,
    color: '#475569',
    category: 'الإقرارات والتعهدات',
    description: 'الإقرار بالالتزام بالمخططات والضوابط',
    categoryIcon: Shield,
    tags: ['إقرارات', 'تعهدات', 'قانوني'],
    estimatedTime: '6-8 دقائق',
  },
];

// ============================================================
// الفئات مع أيقونات مخصصة
// ============================================================
const CATEGORIES = [
  { id: 'all', label: 'جميع النماذج', icon: FolderOpen, color: '#6366f1' },
  { id: 'engineering-permits', label: 'التراخيص الهندسية', icon: Building2, color: '#2563eb' },
  { id: 'engineering-plans', label: 'المخططات الهندسية', icon: Layers, color: '#059669' },
  { id: 'field-inspection', label: 'المعاينة الميدانية', icon: MapPin, color: '#d97706' },
  {
    id: 'roads-infrastructure',
    label: 'الطرق والبنية التحتية',
    icon: Construction,
    color: '#ea580c',
  },
  { id: 'certificates', label: 'الإفادات والشهادات', icon: FileCheck, color: '#7c3aed' },
  { id: 'complaints', label: 'الشكاوى والبلاغات', icon: Shield, color: '#e11d48' },
  { id: 'appeals', label: 'التظلمات', icon: Gavel, color: '#dc2626' },
  { id: 'declarations', label: 'الإقرارات والتعهدات', icon: CheckCircle2, color: '#475569' },
];

// ============================================================
// واجهة الخصائص
// ============================================================
interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintForm?: (formRef: string) => void;
  theme?: 'light' | 'dark';
}

// ============================================================
// المكون الرئيسي
// ============================================================
export default function PrintModal({
  isOpen,
  onClose,
  onPrintForm,
  theme = 'light',
}: PrintModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentForms, setRecentForms] = useState<string[]>([]);
  const isDarkMode = theme === 'dark';
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // تصفية النماذج حسب الفئة والبحث
  const filteredForms = useMemo(() => {
    let result = FORMS;

    // فلترة حسب الفئة
    if (selectedCategory !== 'all') {
      const categoryMap: Record<string, string> = {
        'engineering-permits': 'التراخيص الهندسية',
        'engineering-plans': 'المخططات الهندسية',
        'field-inspection': 'المعاينة الميدانية',
        'roads-infrastructure': 'الطرق والبنية التحتية',
        'certificates': 'الإفادات والشهادات',
        'complaints': 'الشكاوى والبلاغات',
        'appeals': 'التظلمات',
        'declarations': 'الإقرارات والتعهدات',
      };
      result = result.filter((f) => f.category === categoryMap[selectedCategory]);
    }

    // فلترة حسب البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(query) ||
          f.ref.toLowerCase().includes(query) ||
          f.number.includes(query) ||
          f.category.toLowerCase().includes(query) ||
          f.tags.some((tag) => tag.includes(query)),
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  // النماذج المميزة
  const popularForms = useMemo(() => {
    return FORMS.filter((f) => f.isPopular);
  }, []);

  // إعادة تعيين عند الإغلاق
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // التركيز على حقل البحث عند الفتح
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // معالجة الأزرار
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  // منع التمرير خلف المودال
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // حفظ النماذج التي تم عرضها مؤخراً
  const handlePrintClick = useCallback(
    (formRef: string) => {
      setRecentForms((prev) => {
        const filtered = prev.filter((f) => f !== formRef);
        return [formRef, ...filtered].slice(0, 5);
      });

      // إعلام المستمع بالطباعة قبل استدعاء نافذة الطباعة
      if (onPrintForm) {
        onPrintForm(formRef);
      }

      const selectedForm = FORMS.find((f) => f.ref === formRef);
      if (selectedForm) {
        window.print();
      }

      onClose();
    },
    [onClose, onPrintForm],
  );

  // تنظيف النص للبحث
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // الحصول على لون الفئة
  // تحديد الثيم
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const inputBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const inputTextClass = isDarkMode
    ? 'text-white placeholder-gray-400'
    : 'text-gray-700 placeholder-gray-400';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[5vh] md:pt-[10vh] print:block">
      {/* خلفية المودال */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* المودال */}
      <div
        ref={modalRef}
        className={`relative ${bgClass} rounded-2xl shadow-3xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col animate-modal-slide-up border ${borderClass}`}
        role="dialog"
        aria-modal="true"
        aria-label="طباعة نموذج رسمي"
      >
        {/* ===== Header ===== */}
        <div className={`flex items-center justify-between p-4 border-b ${borderClass}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 bg-gov-100 dark:bg-gov-800 rounded-xl flex items-center justify-center`}
            >
              <Printer
                size={22}
                className="text-gov-600 dark:text-gov-300"
              />
            </div>
            <div>
              <h2 className={`font-bold ${textClass} text-lg`}>طباعة نموذج رسمي</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                اختر النموذج الذي تريد طباعته
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${hoverClass} rounded-xl transition-colors`}
            aria-label="إغلاق"
          >
            <X
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>

        {/* ===== شريط التصنيفات ===== */}
        <div className="px-4 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white shadow-lg scale-105'
                      : `text-gray-600 dark:text-gray-300 ${hoverClass}`
                  }`}
                  style={{
                    background: isActive ? cat.color : 'transparent',
                    boxShadow: isActive ? `0 4px 15px ${cat.color}40` : 'none',
                  }}
                >
                  <Icon size={12} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Search ===== */}
        <div className="px-4 pt-3">
          <div
            className={`relative ${inputBgClass} rounded-xl border border-gray-200 dark:border-gray-600 transition-all focus-within:ring-2 focus-within:ring-gov-500`}
          >
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن نموذج بالرقم، العنوان، أو التصنيف..."
              className={`w-full pr-9 pl-10 py-3 ${inputBgClass} ${inputTextClass} border-0 rounded-xl text-sm focus:outline-none focus:ring-0`}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="مسح البحث"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ===== النماذج المميزة ===== */}
        {!searchQuery && selectedCategory === 'all' && popularForms.length > 0 && (
          <div className="px-4 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Star
                size={14}
                className="text-amber-500 fill-amber-500"
              />
              <span className={`text-xs font-bold ${textClass}`}>النماذج الأكثر استخداماً</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularForms.map((form) => (
                <button
                  key={form.ref}
                  onClick={() => handlePrintClick(form.ref)}
                  className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-colors flex items-center gap-1.5"
                >
                  <form.icon size={12} />
                  {form.number}
                </button>
              ))}
            </div>
          </div>
        )}

        {recentForms.length > 0 && !searchQuery && selectedCategory === 'all' && (
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Star
                  size={14}
                  className="text-gov-600"
                />
                <span className={`text-xs font-bold ${textClass}`}>آخر النماذج المطبوعة</span>
              </div>
              <button
                type="button"
                onClick={() => setRecentForms([])}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                مسح
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentForms.map((formRef) => {
                const recentForm = FORMS.find((form) => form.ref === formRef);
                if (!recentForm) return null;
                return (
                  <button
                    key={formRef}
                    onClick={() => handlePrintClick(formRef)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {recentForm.number} • {recentForm.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== قائمة النماذج ===== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileSearch
                size={48}
                className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
              />
              <p className="text-gray-400 dark:text-gray-500 text-sm">لا توجد نتائج للبحث</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-gov-500 dark:text-gov-400 text-xs hover:underline"
              >
                عرض جميع النماذج
              </button>
            </div>
          ) : (
            filteredForms.map((form) => {
              const Icon = form.icon;
              const CategoryIcon = form.categoryIcon;
              const isPopular = form.isPopular;
              const isNew = form.isNew;
              const isUrgent = form.isUrgent;

              return (
                <button
                  key={form.ref}
                  onClick={() => handlePrintClick(form.ref)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl ${hoverClass} transition-all group text-right border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}
                >
                  {/* أيقونة النموذج */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform"
                    style={{ background: form.color }}
                  >
                    <Icon size={20} />
                  </div>

                  {/* معلومات النموذج */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: form.color,
                          background: `${form.color}15`,
                          border: `1px solid ${form.color}30`,
                        }}
                      >
                        {form.number}
                      </span>
                      {isPopular && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                          <Star
                            size={10}
                            className="fill-amber-500"
                          />
                          شائع
                        </span>
                      )}
                      {isNew && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Sparkles size={10} />
                          جديد
                        </span>
                      )}
                      {isUrgent && (
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full animate-pulse flex items-center gap-0.5">
                          <AlertCircle size={10} />
                          عاجل
                        </span>
                      )}
                    </div>
                    <h4 className={`font-bold ${textClass} text-sm mt-0.5 truncate`}>
                      {form.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <CategoryIcon size={10} />
                        {form.category}
                      </span>
                      {form.estimatedTime && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock size={10} />
                            {form.estimatedTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* أيقونات الإجراءات */}
                  <div className="flex items-center gap-1">
                    <Eye
                      size={16}
                      className="text-gray-300 dark:text-gray-600 group-hover:text-gov-600 dark:group-hover:text-gov-400 transition-colors shrink-0"
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* ===== Footer ===== */}
        <div
          className={`p-3 border-t ${borderClass} flex flex-col sm:flex-row items-center justify-between gap-2`}
        >
          <div className="text-[10px] text-gray-400 dark:text-gray-500">
            <span className="font-bold">{FORMS.length}</span> نموذج رسمي معتمد - مكتب الأشغال العامة
            والطرق - محافظة ذمار
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Printer size={10} />
              طباعة فورية
            </span>
            <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
            <span className="flex items-center gap-1">
              <FileText size={10} />
              تعبئة إلكترونية
            </span>
            <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
            <span className="flex items-center gap-1">
              <Download size={10} />
              تحميل PDF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
