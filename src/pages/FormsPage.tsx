import { useState, useCallback, useMemo, lazy, Suspense, useEffect, memo } from 'react';
import {
  FileText,
  AlertCircle,
  Phone,
  CheckCircle2,
  Shield,
  Hammer,
  Award,
  ClipboardCheck,
  Search,
  FolderOpen,
  Home,
  Grid,
  Star,
  BadgeCheck,
  Moon,
  Sun,
  LayoutGrid,
  Table,
  Mail,
} from 'lucide-react';
import PageHeader from '../shared/components/PageHeader';
import OfficialFormWrapper from '../components/OfficialFormWrapper';

const FormN01 = lazy(() => import('./forms/FormN01'));
const FormN02 = lazy(() => import('./forms/FormN02'));
const FormN03 = lazy(() => import('./forms/FormN03'));
const FormN04 = lazy(() => import('./forms/FormN04'));
const FormN05 = lazy(() => import('./forms/FormN05'));
const FormN06 = lazy(() => import('./forms/FormN06'));
const FormN07 = lazy(() => import('./forms/FormN07'));
const FormN08 = lazy(() => import('./forms/FormN08'));

interface FormData {
  ref: string;
  number: string;
  title: string;
  desc: string;
  category: string;
  categoryEn: string;
  accentColor: string;
  bgLight: string;
  icon: React.ElementType;
  component: React.LazyExoticComponent<() => JSX.Element>;
  colorClass: string;
  instructions: string;
  requirements: string[];
  processSteps: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isUrgent?: boolean;
  estimatedTime?: string;
  lastUpdated?: string;
}

const FORMS: FormData[] = [
  {
    ref: 'N-01',
    number: 'ن-1',
    title: 'نموذج طلب خدمة هندسية موحد (تراخيص)',
    desc: 'لطلب تراخيص البناء الجديدة، التجديد، التعديل، الترميم، الهدم، التسوير، وإنشاء الملاحق.',
    category: 'التراخيص الهندسية',
    categoryEn: 'engineering-permits',
    accentColor: '#2563eb',
    bgLight: '#eff6ff',
    icon: FileText,
    component: FormN01,
    colorClass: 'blue',
    instructions: 'يُستخدم هذا النموذج لتقديم طلب الحصول على ترخيص بناء جديد أو تجديد ترخيص قائم.',
    requirements: [
      'صورة البطاقة الشخصية سارية المفعول',
      'سند ملكية الأرض أو عقد البيع المشروط',
      'المخططات الهندسية المعتمدة',
    ],
    processSteps: [
      'تعبئة النموذج إلكترونياً',
      'طباعته وتوقيعه',
      'تسليمه إلى مركز الخدمة',
    ],
    isPopular: true,
    isNew: false,
    isUrgent: false,
    estimatedTime: '5-10 دقائق',
    lastUpdated: '2026-01-01',
  },
  {
    ref: 'N-02',
    number: 'ن-2',
    title: 'نموذج طلب مراجعة واعتماد المخططات الهندسية',
    desc: 'لتقديم المخططات للمراجعة والاعتماد الرسمي.',
    category: 'المخططات الهندسية',
    categoryEn: 'engineering-plans',
    accentColor: '#059669',
    bgLight: '#ecfdf5',
    icon: ClipboardCheck,
    component: FormN02,
    colorClass: 'emerald',
    instructions: 'لتقديم المخططات للمراجعة والاعتماد.',
    requirements: [
      'المخططات المعمارية كاملة',
      'المخططات الإنشائية',
      'تقرير التربة للمشاريع الكبرى',
    ],
    processSteps: [
      'تقديم المخططات',
      'مراجعة فنية',
      'إبداء الملاحظات',
      'الاعتماد النهائي',
    ],
    isPopular: true,
    isNew: false,
    isUrgent: false,
    estimatedTime: '10-15 دقيقة',
    lastUpdated: '2026-01-15',
  },
  {
    ref: 'N-03',
    number: 'ن-3',
    title: 'نموذج طلب تكليف لجنة معاينة فنية',
    desc: 'لطلب النزول الميداني للكشف والاستلام الهندسي.',
    category: 'المعاينة الميدانية',
    categoryEn: 'field-inspection',
    accentColor: '#d97706',
    bgLight: '#fffbeb',
    icon: Hammer,
    component: FormN03,
    colorClass: 'amber',
    instructions: 'لتكليف لجنة فنية للنزول الميداني.',
    requirements: [
      'بيان موقع المشروع',
      'المخططات المعتمدة',
      'جدول زمني للمشروع',
    ],
    processSteps: [
      'تقديم الطلب',
      'جدولة المعاينة',
      'النزول الميداني',
      'إصدار تقرير',
    ],
    isPopular: false,
    isNew: false,
    isUrgent: true,
    estimatedTime: '5-8 دقائق',
    lastUpdated: '2026-02-01',
  },
  {
    ref: 'N-04',
    number: 'ن-4',
    title: 'نموذج تصريح أعمال طرق وحفريات',
    desc: 'لاستئذان الحفر وتمديد شبكات البنية التحتية.',
    category: 'الطرق والبنية التحتية',
    categoryEn: 'roads-infrastructure',
    accentColor: '#ea580c',
    bgLight: '#fff7ed',
    icon: FileText,
    component: FormN04,
    colorClass: 'orange',
    instructions: 'لاستئذان الحفر وأعمال البنية التحتية.',
    requirements: [
      'مخطط مسار الحفر',
      'تصريح من الجهة المختصة',
      'خطة السلامة المرورية',
    ],
    processSteps: [
      'تقديم الطلب',
      'مراجعة المخططات',
      'إصدار التصريح',
      'الإشراف على التنفيذ',
    ],
    isPopular: false,
    isNew: true,
    isUrgent: false,
    estimatedTime: '8-12 دقيقة',
    lastUpdated: '2026-02-15',
  },
  {
    ref: 'N-05',
    number: 'ن-5',
    title: 'نموذج طلب إصدار إفادة فنية',
    desc: 'لاستخراج الإفادات والشهادات الهندسية.',
    category: 'الإفادات والشهادات',
    categoryEn: 'certificates',
    accentColor: '#7c3aed',
    bgLight: '#f5f3ff',
    icon: Award,
    component: FormN05,
    colorClass: 'purple',
    instructions: 'لطلب إفادات فنية أو شهادات هندسية.',
    requirements: [
      'صورة البطاقة الشخصية',
      'رقم المعاملة السابقة',
      'الغرض من الإفادة',
    ],
    processSteps: [
      'تقديم الطلب',
      'التحقق من البيانات',
      'إصدار الإفادة',
      'استلام الإفادة',
    ],
    isPopular: true,
    isNew: false,
    isUrgent: false,
    estimatedTime: '5-7 دقائق',
    lastUpdated: '2026-03-01',
  },
  {
    ref: 'N-06',
    number: 'ن-6',
    title: 'نموذج تقديم شكوى أو بلاغ',
    desc: 'للإبلاغ عن المخالفات الإنشائية.',
    category: 'الشكاوى والبلاغات',
    categoryEn: 'complaints',
    accentColor: '#e11d48',
    bgLight: '#fff1f2',
    icon: AlertCircle,
    component: FormN06,
    colorClass: 'rose',
    instructions: 'للإبلاغ عن مخالفات هندسية.',
    requirements: [
      'وصف المخالفة',
      'موقع المخالفة',
      'صور فوتوغرافية',
    ],
    processSteps: [
      'تقديم البلاغ',
      'معاينة الموقع',
      'اتخاذ الإجراء',
      'متابعة النتيجة',
    ],
    isPopular: false,
    isNew: false,
    isUrgent: true,
    estimatedTime: '8-10 دقائق',
    lastUpdated: '2026-03-15',
  },
  {
    ref: 'N-07',
    number: 'ن-7',
    title: 'نموذج طلب تظلم',
    desc: 'للاعتراض على قرارات إدارية.',
    category: 'التظلمات',
    categoryEn: 'appeals',
    accentColor: '#dc2626',
    bgLight: '#fef2f2',
    icon: Shield,
    component: FormN07,
    colorClass: 'red',
    instructions: 'للاعتراض على القرارات الإدارية.',
    requirements: [
      'القرار المعترض عليه',
      'مذكرة التظلم',
      'المستندات الداعمة',
    ],
    processSteps: [
      'تقديم التظلم',
      'دراسة القرار',
      'البت في التظلم',
      'إشعار المتظلم',
    ],
    isPopular: false,
    isNew: false,
    isUrgent: false,
    estimatedTime: '10-15 دقيقة',
    lastUpdated: '2026-04-01',
  },
  {
    ref: 'N-08',
    number: 'ن-8',
    title: 'نموذج الإقرارات والتعهدات',
    desc: 'للإقرار بالالتزام بالضوابط.',
    category: 'الإقرارات والتعهدات',
    categoryEn: 'declarations',
    accentColor: '#475569',
    bgLight: '#f8fafc',
    icon: CheckCircle2,
    component: FormN08,
    colorClass: 'slate',
    instructions: 'للإقرار والتعهد بالالتزام بالضوابط.',
    requirements: [
      'البيانات الشخصية',
      'بيان المشروع',
      'التعهدات المطلوبة',
    ],
    processSteps: [
      'قراءة الإقرارات',
      'التوقيع',
      'التوثيق',
      'الحفظ في الأرشيف',
    ],
    isPopular: false,
    isNew: true,
    isUrgent: false,
    estimatedTime: '6-8 دقائق',
    lastUpdated: '2026-04-15',
  },
];

const categories = [
  { id: 'all', label: 'جميع النماذج', icon: FolderOpen, count: FORMS.length, color: '#6366f1' },
  {
    id: 'engineering-permits',
    label: 'التراخيص الهندسية',
    icon: FileText,
    count: FORMS.filter((f) => f.categoryEn === 'engineering-permits').length,
    color: '#2563eb',
  },
  {
    id: 'engineering-plans',
    label: 'المخططات الهندسية',
    icon: ClipboardCheck,
    count: FORMS.filter((f) => f.categoryEn === 'engineering-plans').length,
    color: '#059669',
  },
  {
    id: 'field-inspection',
    label: 'المعاينة الميدانية',
    icon: Hammer,
    count: FORMS.filter((f) => f.categoryEn === 'field-inspection').length,
    color: '#d97706',
  },
  {
    id: 'roads-infrastructure',
    label: 'الطرق والبنية التحتية',
    icon: Award,
    count: FORMS.filter((f) => f.categoryEn === 'roads-infrastructure').length,
    color: '#ea580c',
  },
  {
    id: 'certificates',
    label: 'الإفادات والشهادات',
    icon: Award,
    count: FORMS.filter((f) => f.categoryEn === 'certificates').length,
    color: '#7c3aed',
  },
  {
    id: 'complaints',
    label: 'الشكاوى والبلاغات',
    icon: AlertCircle,
    count: FORMS.filter((f) => f.categoryEn === 'complaints').length,
    color: '#e11d48',
  },
  {
    id: 'appeals',
    label: 'التظلمات',
    icon: Shield,
    count: FORMS.filter((f) => f.categoryEn === 'appeals').length,
    color: '#dc2626',
  },
  {
    id: 'declarations',
    label: 'الإقرارات والتعهدات',
    icon: CheckCircle2,
    count: FORMS.filter((f) => f.categoryEn === 'declarations').length,
    color: '#475569',
  },
];

const FormLoader = memo(() => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gov-200 border-t-gov-600 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <FileText
          size={20}
          className="text-gov-600 animate-pulse"
        />
      </div>
    </div>
    <p className="mt-4 text-gray-500 text-sm font-medium animate-pulse">جاري تحميل النموذج...</p>
  </div>
));
FormLoader.displayName = 'FormLoader';

export default function FormsPage() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('formFavorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('formFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // قراءة النموذج المحدد من sessionStorage (عند القدوم من دليل الخدمات)
  useEffect(() => {
    const selectedFormRef = sessionStorage.getItem('selectedForm');
    if (selectedFormRef) {
      setSelectedForm(selectedFormRef);
      sessionStorage.removeItem('selectedForm');
    }
  }, []);

  const toggleFavorite = useCallback((ref: string) => {
    setFavorites((prev) => (prev.includes(ref) ? prev.filter((f) => f !== ref) : [...prev, ref]));
  }, []);

  useEffect(() => {
    if (selectedForm) {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((f) => f !== selectedForm);
        return [selectedForm, ...filtered].slice(0, 5);
      });
    }
  }, [selectedForm]);

  const filteredForms = useMemo(() => {
    let result = FORMS;
    if (activeCategory !== 'all') {
      result = result.filter((f) => f.categoryEn === activeCategory);
    }
    if (showFavorites) {
      result = result.filter((f) => favorites.includes(f.ref));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(query) ||
          f.desc.toLowerCase().includes(query) ||
          f.ref.toLowerCase().includes(query) ||
          f.number.includes(query) ||
          f.category.toLowerCase().includes(query),
      );
    }
    return result;
  }, [activeCategory, searchQuery, showFavorites, favorites]);

  const selectedFormData = useMemo(() => {
    return FORMS.find((f) => f.ref === selectedForm);
  }, [selectedForm]);

  const handleSelectForm = useCallback((ref: string) => {
    setSelectedForm(ref);
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedForm(null);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveCategory('all');
    setSearchQuery('');
    setShowFavorites(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  const resultCount = filteredForms.length;
  const totalForms = FORMS.length;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : ''} transition-colors duration-300`}
      style={{ background: isDarkMode ? undefined : 'var(--bg-page)', color: 'var(--text-primary)' }}
      dir="rtl"
    >
      <PageHeader
        title="النماذج الرسمية المعتمدة"
        subtitle={`${resultCount} نموذج حكومي جاهز تعبئة وتحميل طباعة مع مجموعة دقيقة من الإجراءات والمستندات.`}
        badge="نماذج رسمية"
        badgeIcon={FileText}
      >
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3 flex-1">
            <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-xs text-white/80">
              <div>إجمالي النماذج</div>
              <div className="mt-2 text-white text-xl font-semibold">{totalForms}</div>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-xs text-white/80">
              <div>نماذج ظاهرة</div>
              <div className="mt-2 text-white text-xl font-semibold">{resultCount}</div>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-xs text-white/80">
              <div>الوضع الحالي</div>
              <div className="mt-2 text-white text-xl font-semibold">
                {isDarkMode ? 'ليلي' : 'نهاري'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => (globalThis.location.href = '/')}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
              title="الرئيسية"
            >
              <Home size={18} />
            </button>
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 relative z-10">
        <div
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border p-4 mb-6`}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="ابحث عن نموذج بالرقم، العنوان، أو التصنيف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pr-11 pl-4 py-3 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} border rounded-xl text-sm`}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl ${viewMode === 'grid' ? 'bg-gov-100 text-gov-600' : 'text-gray-400'}`}
                title="عرض شبكي"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2.5 rounded-xl ${viewMode === 'compact' ? 'bg-gov-100 text-gov-600' : 'text-gray-400'}`}
                title="عرض مدمج"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl ${viewMode === 'list' ? 'bg-gov-100 text-gov-600' : 'text-gray-400'}`}
                title="عرض قائمة"
              >
                <Table size={18} />
              </button>
              <button
                onClick={() => setShowFavorites((prev) => !prev)}
                className={`p-2.5 rounded-xl ${showFavorites ? 'bg-gov-100 text-gov-600' : 'text-gray-400'}`}
                title={showFavorites ? 'إظهار كل النماذج' : 'إظهار المفضلات'}
              >
                <Star size={18} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-gov-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
          {recentlyViewed.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {recentlyViewed.map((formRef) => {
                const recentForm = FORMS.find((form) => form.ref === formRef);
                if (!recentForm) return null;
                return (
                  <button
                    key={formRef}
                    type="button"
                    onClick={() => handleSelectForm(formRef)}
                    className="px-3 py-2 rounded-2xl bg-gov-50 text-gov-700 text-xs font-semibold hover:bg-gov-100 transition"
                  >
                    {recentForm.number} • {recentForm.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedFormData ? (
          <div
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border overflow-hidden`}
          >
            <div className="p-4 bg-gray-50 overflow-auto">
              <OfficialFormWrapper
                formRef={selectedFormData.ref}
                title={selectedFormData.title}
                onBack={handleBack}
              >
                <Suspense fallback={<FormLoader />}>
                  <selectedFormData.component />
                </Suspense>
              </OfficialFormWrapper>
            </div>
          </div>
        ) : (
          <div
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border overflow-hidden`}
          >
            {filteredForms.length === 0 ? (
              <div className="text-center py-20">
                <FolderOpen
                  size={48}
                  className="text-gray-400 mx-auto mb-4"
                />
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-700'} font-bold text-lg`}>
                  لا توجد نماذج مطابقة
                </h3>
                <p className="text-gray-400 text-sm mt-2">حاول تعديل معايير البحث أو الفلتر</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-gov-600 text-white rounded-xl text-sm font-bold hover:bg-gov-700 transition"
                >
                  عرض جميع النماذج
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredForms.map((form) => (
                  <article
                    key={form.ref}
                    onClick={() => handleSelectForm(form.ref)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleSelectForm(form.ref);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`group relative ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'} rounded-xl p-4 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:border-gov-300 hover:shadow-xl transition-all cursor-pointer`}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(form.ref);
                      }}
                      className="absolute top-4 left-4 rounded-full p-2 text-gray-400 hover:text-gov-600 transition-colors"
                      aria-label={
                        favorites.includes(form.ref) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'
                      }
                    >
                      <Star
                        size={16}
                        className={favorites.includes(form.ref) ? 'text-gov-600' : 'text-gray-300'}
                      />
                    </button>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: form.bgLight }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: form.accentColor }}
                        >
                          <form.icon
                            size={16}
                            className="text-white"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ background: form.accentColor }}
                        >
                          {form.ref}
                        </span>
                        <h4
                          className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm mt-1 line-clamp-2`}
                        >
                          {form.title}
                        </h4>
                        <p
                          className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} text-xs mt-1 line-clamp-2`}
                        >
                          {form.desc}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : viewMode === 'compact' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
                {filteredForms.map((form) => (
                  <article
                    key={form.ref}
                    onClick={() => handleSelectForm(form.ref)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleSelectForm(form.ref);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`group relative p-4 rounded-xl border transition-all ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gov-500'
                        : 'bg-white border-gray-200 hover:bg-gov-50 hover:border-gov-300 hover:shadow-lg'
                    } text-center`}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(form.ref);
                      }}
                      className="absolute top-3 left-3 rounded-full p-2 text-gray-400 hover:text-gov-600 transition-colors"
                      aria-label={
                        favorites.includes(form.ref) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'
                      }
                    >
                      <Star
                        size={16}
                        className={favorites.includes(form.ref) ? 'text-gov-600' : 'text-gray-300'}
                      />
                    </button>
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: form.bgLight }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: form.accentColor }}
                      >
                        <form.icon
                          size={20}
                          className="text-white"
                        />
                      </div>
                    </div>
                    <span
                      className="inline-block text-[10px] font-bold text-white px-2 py-0.5 rounded mb-2"
                      style={{ background: form.accentColor }}
                    >
                      {form.number}
                    </span>
                    <p
                      className={`text-xs font-semibold leading-tight line-clamp-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                      {form.title}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredForms.map((form) => (
                  <article
                    key={form.ref}
                    onClick={() => handleSelectForm(form.ref)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleSelectForm(form.ref);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`w-full relative flex items-center gap-4 p-4 text-right transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(form.ref);
                      }}
                      className="absolute top-4 left-4 rounded-full p-2 text-gray-400 hover:text-gov-600 transition-colors"
                      aria-label={
                        favorites.includes(form.ref) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'
                      }
                    >
                      <Star
                        size={16}
                        className={favorites.includes(form.ref) ? 'text-gov-600' : 'text-gray-300'}
                      />
                    </button>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: form.bgLight }}
                    >
                      <form.icon
                        size={20}
                        style={{ color: form.accentColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-gray-500">{form.ref}</span>
                      <h4
                        className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm`}
                      >
                        {form.title}
                      </h4>
                    </div>
                    <span className="px-3 py-1.5 bg-gov-50 text-gov-600 rounded-lg text-xs font-bold">
                      معاينة
                    </span>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 bg-gradient-to-r from-gov-50 via-white to-gov-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-5 border border-gov-100 dark:border-gray-700 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gov-600 to-gov-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <Phone
                size={20}
                color="#fff"
              />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <BadgeCheck
                  size={16}
                  className="text-gold-500"
                />
                هل تحتاج مساعدة في التعبئة أو التقديم؟
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed flex flex-wrap items-center gap-2">
                <span>📍 تفضل بزيارة مركز خدمة الجمهور في محافظة ذمار</span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span>🕐 السبت – الأربعاء 8:00 ص – 3:00 م</span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <a
                  href="tel:+967777888198"
                  className="font-mono font-bold hover:underline text-gov-700 dark:text-gov-300"
                  dir="ltr"
                >
                  📞 777-888-198
                </a>
              </div>
            </div>
            <button
              onClick={() => globalThis.open('mailto:dpw.dhamar@yemen.gov.ye')}
              className="px-4 py-2 bg-gov-600 hover:bg-gov-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-gov-500/30 hover:scale-105"
            >
              <Mail
                size={14}
                className="inline ml-1"
              />
              راسلنا
            </button>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-l from-gov-800 to-gov-900 rounded-2xl p-6 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield
                  size={20}
                  className="text-gold-400"
                />
              </div>
              <div>
                <div className="font-bold text-sm">مكتب الأشغال العامة والطرق - محافظة ذمار</div>
                <div className="text-xs text-gray-400">
                  جميع الحقوق محفوظة © {new Date().getFullYear()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>الإصدار 5.0.0</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>آخر تحديث: 2026</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>مندرج تحت الرخصة الرسمية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}