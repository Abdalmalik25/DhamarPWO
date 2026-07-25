// ============================================================
// GuidelinesPage.tsx - الدليل الإرشادي الرسمي للهندسة والبناء
// مكتب الأشغال العامة والطرق - محافظة ذمار
// ============================================================

import { memo, useMemo, useState } from 'react';
import {
  BookOpen,
  Home,
  Store,
  Factory,
  Trees,
  School,
  Heart,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Phone,
  Eye,
  Star,
  Layers,
} from 'lucide-react';
import type { Page } from '../types/page';

// ============================================================
// 1. تعريفات الأنواع
// ============================================================

interface GuidelineCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  count?: number;
}

interface Guideline {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime?: string;
  views?: number;
  downloads?: number;
  isActive?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  requirements?: string[];
  steps?: string[];
  fees?: { min: number; max: number; currency: string };
  relatedForms?: string[];
}

// ============================================================
// 2. البيانات الرسمية
// ============================================================

const GUIDELINE_CATEGORIES: GuidelineCategory[] = [
  {
    id: 'residential',
    title: 'المنشآت السكنية',
    description: 'إرشادات تراخيص البناء للمنازل السكنية والارتدادات',
    icon: Home,
    color: 'from-blue-500 to-blue-600',
    count: 12,
  },
  {
    id: 'commercial',
    title: 'المنشآت التجارية',
    description: 'اشتراطات تراخيص المحلات التجارية والأسواق',
    icon: Store,
    color: 'from-amber-500 to-amber-600',
    count: 8,
  },
  {
    id: 'industrial',
    title: 'المنشآت الصناعية',
    description: 'معايير تراخيص المصانع والمنشآت الصناعية',
    icon: Factory,
    color: 'from-purple-500 to-purple-600',
    count: 6,
  },
  {
    id: 'agricultural',
    title: 'المنشآت الزراعية',
    description: 'إرشادات تراخيص المنشآت الزراعية والصوبات',
    icon: Trees,
    color: 'from-green-500 to-green-600',
    count: 4,
  },
  {
    id: 'educational',
    title: 'المنشآت التعليمية',
    description: 'اشتراطات تراخيص المدارس والجامعات',
    icon: School,
    color: 'from-teal-500 to-teal-600',
    count: 5,
  },
  {
    id: 'health',
    title: 'المنشآت الصحية',
    description: 'معايير تراخيص المستشفيات والمراكز الصحية',
    icon: Heart,
    color: 'from-rose-500 to-rose-600',
    count: 3,
  },
];

const GUIDELINES_DATA: Guideline[] = [
  {
    id: '1',
    title: 'إرشادات الترخيص السكني - الطابق الأرضي',
    description:
      'إرشادات مُفصّلة للحصول على ترخيص بناء للمنازل السكنية ذات الطابق الأرضي، وشاملة جميع الاشتراطات الإنشائية والمساحية.',
    category: 'residential',
    estimatedTime: '3 أيام عمل',
    views: 450,
    downloads: 120,
    isPopular: true,
    requirements: ['صورة من الهوية', 'سند ملكية', 'مخططات هندسية', 'إفادة جيران'],
    steps: [
      'تقديم الطلب عبر النموذج الإلكتروني (ن-1)',
      'مراجعة المستندات واستكمال الناقص',
      'دفع الرسوم المطلوبة',
      'إرسال للمعاينة الميدانية',
      'الاعتماد النهائي وإصدار الرخصة',
    ],
    fees: { min: 50000, max: 150000, currency: 'ريال' },
    relatedForms: ['ن-1', 'ن-3'],
  },
  {
    id: '2',
    title: 'إرشادات الترخيص التجاري - المحلات الصغيرة',
    description:
      'إرشادات لتراخيص المحلات التجارية ذات المساحة الصغيرة (أقل من 50 متر مربع) بما يشمل الاشتراطات البلدية والنظافة.',
    category: 'commercial',
    estimatedTime: '2 يوم عمل',
    views: 380,
    downloads: 95,
    isPopular: true,
    requirements: ['صورة هوية', 'عقد إيجار', 'مخطط داخلي', 'شهادة صحية'],
    steps: [
      'تقديم طلب ترخيص تجاري (ن-5)',
      'التحقق من الوثائق',
      'دفع الرسوم',
      'المعاينة الصحية',
      'إصدار الترخيص',
    ],
    fees: { min: 30000, max: 100000, currency: 'ريال' },
    relatedForms: ['ن-5', 'ن-7'],
  },
  {
    id: '3',
    title: 'إرشادات المختبرات الهندسية',
    description: 'إرشادات لإجراء الفحوصات الهندسية للمواد الإنشائية وعينات التربة والخرسانة.',
    category: 'industrial',
    estimatedTime: '5 أيام عمل',
    views: 210,
    downloads: 45,
    isNew: true,
    requirements: ['عينة الخرسانة', 'تصريح الحفر', 'نموذج طلب الفحص'],
    steps: [
      'إحضار العينة إلى المختبر',
      'دفع الرسوم المختبرية',
      'إجراء الفحص الفني',
      'إصدار تقرير المختبر',
    ],
    fees: { min: 15000, max: 45000, currency: 'ريال' },
    relatedForms: ['ن-4'],
  },
  {
    id: '4',
    title: 'إرشادات السلامة المهنية',
    description: 'إرشادات أمان مواقع البناء وفق المعايير العالمية OSHA والكود اليمني للبناء.',
    category: 'residential',
    estimatedTime: 'مراجعة دورية',
    views: 580,
    downloads: 180,
    isPopular: true,
    requirements: ['خطة السلامة', 'معدات الوقاية', 'شهادات العمال'],
    steps: ['إعداد خطة السلامة', 'توفير معدات الوقاية', 'تدريب العمالة', 'المعاينة الدورية'],
    relatedForms: ['ن-7'],
  },
];

// ============================================================
// 3. المكونات الفرعية
// ============================================================

const GuidelineCard = memo(function GuidelineCard({
  guideline,
  onNavigate,
  theme,
}: {
  guideline: Guideline;
  onNavigate: (page: Page) => void;
  theme?: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50';
  const textClass = isDark ? 'text-gray-100' : 'text-gray-800';
  const categoryColors: Record<string, string> = {
    residential: 'from-blue-500 to-blue-700',
    commercial: 'from-amber-500 to-amber-700',
    industrial: 'from-purple-500 to-purple-700',
    agricultural: 'from-green-500 to-green-700',
    educational: 'from-teal-500 to-teal-700',
    health: 'from-rose-500 to-rose-700',
  };

  return (
    <div
      className={`group ${bgClass} backdrop-blur-sm rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border cursor-pointer overflow-hidden`}
      aria-label={`دليل: ${guideline.title}`}
      onClick={() => onNavigate('forms')}
      role="button"
      tabIndex={0}
    >
      {/* خلفية متدرجة عند التمرير */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${categoryColors[guideline.category] || 'from-gov-600 to-gov-800'} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700`}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 bg-gradient-to-br ${categoryColors[guideline.category] || 'from-gov-600 to-gov-800'} rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
        >
          <BookOpen
            size={26}
            className="text-white"
          />
        </div>
        <div className="flex flex-col items-end gap-1">
          {guideline.isPopular && (
            <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star
                size={12}
                className="fill-amber-500"
              />
              شائع
            </span>
          )}
          {guideline.isNew && (
            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
              جديد
            </span>
          )}
        </div>
      </div>

      <h3
        className={`relative font-bold text-lg ${textClass} mb-2 group-hover:text-gov-700 transition-colors`}
      >
        {guideline.title}
      </h3>
      <p className="relative text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
        {guideline.description}
      </p>

      {/* الخطوات المختصرة */}
      {guideline.steps && guideline.steps.length > 0 && (
        <div className="relative space-y-1.5 mb-4">
          <div className="flex items-center gap-1 text-xs font-bold text-gov-700 mb-1">
            <CheckCircle size={12} />
            خطوات الإجراء:
          </div>
          {guideline.steps.slice(0, 3).map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs text-gray-600"
            >
              <div className="w-4 h-4 rounded-full bg-gov-100 text-gov-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                {idx + 1}
              </div>
              <span className="line-clamp-1">{step}</span>
            </div>
          ))}
          {guideline.steps.length > 3 && (
            <div className="text-xs text-gov-600 font-medium pr-5">
              +{guideline.steps.length - 3} خطوات أخرى
            </div>
          )}
        </div>
      )}

      {/* الرسوم والفئة */}
      <div className="relative flex items-center justify-between pt-4 border-t border-gray-100/50">
        <div className="flex items-center gap-2 flex-wrap">
          {guideline.fees && guideline.fees.min > 0 && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              {guideline.fees.min.toLocaleString()}+ ريال
            </span>
          )}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gov-50 text-gov-700`}>
            {guideline.category === 'residential'
              ? 'سكني'
              : guideline.category === 'commercial'
                ? 'تجاري'
                : guideline.category === 'industrial'
                  ? 'صناعي'
                  : guideline.category === 'agricultural'
                    ? 'زراعي'
                    : guideline.category === 'educational'
                      ? 'تعليمي'
                      : 'صحي'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {guideline.views?.toLocaleString() || 0}
          </span>
          <span className="flex items-center gap-1">
            <Download size={14} />
            {guideline.downloads || 0}
          </span>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// 4. المكون الرئيسي
// ============================================================

interface GuidelinesPageProps {
  onNavigate: (page: Page) => void;
  theme?: 'light' | 'dark';
}

export default memo(function GuidelinesPage({ onNavigate, theme = 'light' }: GuidelinesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredGuidelines = useMemo(() => {
    let filtered = [...GUIDELINES_DATA];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((g) => g.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (g) => g.title.toLowerCase().includes(query) || g.description.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

  return (
    <main
      className={`min-h-screen ${bgClass} py-16 transition-colors duration-300`}
      dir="rtl"
    >
      {/* الشريط العلوي */}
      <div className="bg-gov-900 text-white py-4 px-4 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen
              size={24}
              className="text-gold-400"
            />
            <div>
              <h1 className="text-xl font-bold">الدليل الإرشادي الرسمي</h1>
              <p className="text-xs text-white/60">مكتب الأشغال العامة والطرق - محافظة ذمار</p>
            </div>
          </div>
          <div className="text-xs text-white/60">{filteredGuidelines.length} دليل متاح</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* البحث والتصفية */}
        <div className="my-10">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* مربع البحث */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="ابحث في الأدلة الإرشادية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pr-12 pl-4 py-3 rounded-2xl border focus:ring-2 focus:ring-gov-500 focus:border-transparent outline-none text-sm ${cardBgClass}`}
              />
            </div>

            {/* أزرار التصفية */}
            <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gov-200 bg-gov-50 text-gov-700 font-bold text-sm hover:bg-gov-100 transition-colors">
              <Filter size={16} />
              تصفية متقدمة
            </button>
          </div>
        </div>

        {/* الفئات */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-4 rounded-2xl text-center transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gov-600 text-white shadow-lg scale-105'
                : `${cardBgClass} text-gray-600 hover:shadow-md`
            }`}
          >
            <Layers
              size={24}
              className="mx-auto mb-2"
            />
            <span className="text-xs font-bold">جميع الأنواع</span>
          </button>

          {GUIDELINE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-2xl text-center transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gov-600 text-white shadow-lg scale-105'
                    : `${cardBgClass} text-gray-600 hover:shadow-md`
                }`}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-2`}
                >
                  <Icon
                    size={20}
                    className="text-white"
                  />
                </div>
                <span className="text-xs font-bold">{category.title}</span>
                {category.count && (
                  <span className="block text-[10px] mt-1 opacity-70">{category.count} دليل</span>
                )}
              </button>
            );
          })}
        </div>

        {/* الدليل */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuidelines.map((guideline) => (
            <GuidelineCard
              key={guideline.id}
              guideline={guideline}
              onNavigate={onNavigate}
              theme={theme}
            />
          ))}
        </div>

        {/* لا توجد نتائج */}
        {filteredGuidelines.length === 0 && (
          <div className="text-center py-20">
            <AlertCircle
              size={64}
              className="mx-auto text-gray-300 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد أدلة مطابقة للبحث</h3>
            <p className="text-gray-500">حاول تعديل مصطلحات البحث أو إعادة المحاولة</p>
          </div>
        )}

        {/* التواصل */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 bg-gov-50 border border-gov-200 px-8 py-6 rounded-2xl">
            <Phone
              size={24}
              className="text-gov-600"
            />
            <div className="text-right">
              <h4 className="font-bold text-gov-800">هل تحتاج مساعدة في الدليل الإرشادي؟</h4>
              <p className="text-sm text-gray-600">
                اتصل بنا على 777-888-198 أو تواصل عبر البريد الإلكتروني
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});

// تصدير البيانات للاستخدام في HomePage
export { GUIDELINE_CATEGORIES, GUIDELINES_DATA };
export type { Guideline, GuidelineCategory };
