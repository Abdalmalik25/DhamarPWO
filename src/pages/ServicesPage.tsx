// ============================================================
// ServicesPage.tsx - منصة الخدمات الهندسية والإدارية (Enterprise Version)
// ============================================================
import { useState, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  ClipboardCheck,
  AlertCircle,
  Award,
  Clock,
  CheckCircle2,
  Users,
  HardHat,
  Phone,
  BookOpen,
  Shield,
  ChevronDown,
  Eye,
  MessageCircle,
  Home,
  Search,
  Grid,
  List,
  Building2,
  Route,
  PenTool,
  Layers,
  Scale,
  Landmark,
  ExternalLink,
  Printer,
  Download,
  Mail,
  Globe,
  FolderOpen,
  BadgeCheck,
} from 'lucide-react';
import ScrollReveal from '../shared/components/ScrollReveal';
import AnimatedCounter from '../shared/components/AnimatedCounter';

type Page =
  'home' | 'services' | 'forms' | 'about' | 'contact' | 'track' | 'documents' | 'guidelines';

interface ServicesPageProps {
  readonly onNavigate: (page: Page) => void;
}

// ============================================================
// 1. النموذج البياني المتقدم للخدمات (Enterprise Data Model)
// ============================================================
interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: 'بناء' | 'طرق' | 'تصاريح' | 'إفادات' | 'شكاوى' | 'مقاولين' | 'أرشفة' | 'أخرى';
  icon: LucideIcon;
  color: string;
  // الإجراءات
  process: {
    steps: string[];
    timeframe: string;
    fee: {
      min: number;
      max: number;
      currency: 'ريال' | 'دولار';
      description: string;
    };
  };
  // المستندات المطلوبة
  documents: {
    required: string[];
    optional: string[];
    tips: string[];
  };
  // الأحكام القانونية
  regulations: {
    law: string;
    article: string;
    summary: string;
  }[];
  // مقاييس الأداء
  metrics: {
    averageTime: number;
    dailyCapacity: number;
    satisfactionRate: number;
  };
  // أقسام متصلة
  related: string[];
  formRef?: string;
  isActive: boolean;
  lastUpdated: string;
}

// ============================================================
// 2. قاعدة بيانات الخدمات (Data Catalog) - شاملة ومسؤولة
// ============================================================
const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'SVC-001',
    title: 'تراخيص البناء والإنشاء',
    description:
      'منح التراخيص اللازمة لبناء أو ترميم أو هدم المباني السكنية والتجارية وفق أحكام القانون اليمني.',
    category: 'بناء',
    icon: Building2,
    color: '#1e3a8a',
    process: {
      steps: [
        'التقديم في مركز الخدمة مع النموذج (ن-1) المكتمل.',
        'مراجعة المخططات الهندسية من قبل اللجنة الفنية.',
        'معاينة الموقع للتأكد من مطابقة المواصفات.',
        'اعتماد الترخيص وإصدار الوثيقة الرسمية.',
      ],
      timeframe: '5-15 يوم عمل (حسب تعقيد المشروع)',
      fee: {
        min: 2000,
        max: 50000,
        currency: 'ريال',
        description: 'يُحدد حسب مساحة البناء والنوع (سكني/تجاري).',
      },
    },
    documents: {
      required: [
        'نموذج (ن-1) مُكتمل البيانات',
        'صورة الهوية الوطنية (سارية)',
        'وثيقة ملكية العقار أو عقد إيجار موثق',
      ],
      optional: ['مخططات معمارية معتمدة', 'تقرير تربة للمشاريع الكبرى'],
      tips: [
        'يجب أن تكون المخططات مختومة من مكتب استشاري مرخص.',
        'يرجى التأكد من عدم وجود نزاعات ملكية في الموقع.',
      ],
    },
    regulations: [
      {
        law: 'قانون البناء اليمني',
        article: 'المادة (25)',
        summary: 'إلزامية الحصول على ترخيص قبل بدء أي بناء.',
      },
      {
        law: 'نظام ضوابط البناء',
        article: 'اللائحة (3)',
        summary: 'المسافات البينية وارتفاعات المباني.',
      },
    ],
    metrics: { averageTime: 7, dailyCapacity: 15, satisfactionRate: 92 },
    related: ['SVC-002', 'SVC-004'],
    formRef: 'N-01',
    isActive: true,
    lastUpdated: '2026-03-15',
  },
    {
    id: 'SVC-002',
    title: 'اعتماد المخططات الهندسية',
    description:
      'تدقيق واعتماد المخططات المعمارية والإنشائية والخدمات للمشاريع الكبرى لضمان السلامة العامة.',
    category: 'بناء',
    icon: PenTool,
    color: '#059669',
    process: {
      steps: [
        'استلام النموذج (ن-2) والمخططات.',
        'مراجعة فنية متخصصة (معماري، إنشائي، خدمات).',
        'توجيه الملاحظات (إن وجدت).',
        'اعتماد المخططات بالختم الرسمي.',
      ],
      timeframe: '7-10 أيام عمل',
      fee: {
        min: 5000,
        max: 25000,
        currency: 'ريال',
        description: 'يُحتسب حسب الحجم ونوع التصميم.',
      },
    },
    documents: {
      required: [
        'نموذج (ن-2) مكتمل',
        'المخططات الهندسية الأصلية (3 نسخ)',
        'ترخيص مزاولة المهنة للمكتب الهندسي',
      ],
      optional: ['الحسابات الإنشائية مفصلة', 'تقرير التربة'],
      tips: [
        'يجب أن تكون المخططات موقعة ومختومة من المهندس المصمم.',
        'أي خطأ في المخططات قد يؤدي إلى رفض الطلب.',
      ],
    },
    regulations: [
      {
        law: 'قانون الممارسة الهندسية',
        article: 'المادة (12)',
        summary: 'إلزامية اعتماد المخططات من قبل مكتب الأشغال.',
      },
    ],
    metrics: { averageTime: 5, dailyCapacity: 10, satisfactionRate: 88 },
    related: ['SVC-001', 'SVC-005'],
    formRef: 'N-02',
    isActive: true,
    lastUpdated: '2026-03-12',
  },
  {
    id: 'SVC-003',
    title: 'المعاينة والتفتيش الميداني',
    description:
      'الكشف الميداني على المواقع للمشاريع الجديدة والقائمة لضمان تطابق التنفيذ مع التراخيص والمعايير.',
    category: 'بناء',
    icon: ClipboardCheck,
    color: '#d97706',
    process: {
      steps: [
        'تقديم طلب المعاينة (ن-3).',
        'جدولة الزيارة الميدانية.',
        'تقييم الحالة وتحرير محضر المعاينة.',
        'رفع التقرير للجنة الفنية.',
      ],
      timeframe: '3-5 أيام عمل (بعد التقديم)',
      fee: {
        min: 0,
        max: 3000,
        currency: 'ريال',
        description: 'مجاني للمشاريع المرخصة، 3,000 ريال للكشف الخارجي.',
      },
    },
    documents: {
      required: ['نموذج (ن-3) مكتمل', 'نسخة من الترخيص أو المخططات المعتمدة'],
      optional: ['صور فوتوغرافية للحالة الراهنة (إن وجد)'],
      tips: [
        'يجب حضور صاحب الموقع أو من ينوب عنه أثناء المعاينة.',
        'الطلب يتم في الموقع، وليس في المكتب.',
      ],
    },
    regulations: [
      {
        law: 'أنظمة التفتيش البلدية',
        article: 'المادة (33)',
        summary: 'حق التفتيش الميداني للمشاريع.',
      },
    ],
    metrics: { averageTime: 2, dailyCapacity: 8, satisfactionRate: 95 },
    related: ['SVC-001', 'SVC-005'],
    formRef: 'N-03',
    isActive: true,
    lastUpdated: '2026-03-10',
  },
  {
    id: 'SVC-004',
    title: 'تصاريح الطرق والبنية التحتية',
    description: 'تنظيم أعمال الحفر والتمديدات داخل حرم الطرق والشوارع للحفاظ على البنية التحتية.',
    category: 'طرق',
    icon: Route,
    color: '#c2410c',
    process: {
      steps: [
        'تقديم النموذج (ن-4) والمخطط.',
        'مراجعة مسار الحفر مع إدارة الطرق.',
        'تحديد الشروط والإجراءات التعويضية.',
        'إصدار التصريح.',
      ],
      timeframe: '3-7 أيام عمل',
      fee: {
        min: 5000,
        max: 50000,
        currency: 'ريال',
        description: 'يُحتسب حسب الطول الطولي للحفر وقطر المواسير.',
      },
    },
    documents: {
      required: [
        'نموذج (ن-4) مكتمل',
        'مخطط توضيحي للمسار (مقياس 1:500)',
        'تعهد بإعادة الحالة الأصلية للرصف',
      ],
      optional: ['جدول زمني للمشروع', 'صور للموقع الحالي'],
      tips: [
        'أي حفر بدون تصريح يعرض صاحبه للمساءلة القانونية والغرامة.',
        'الحفر في الشوارع الرئيسية يتطلب تنسيقاً أمنياً.',
      ],
    },
    regulations: [
      { law: 'قانون الطرق العامة', article: 'المادة (18)', summary: 'منع إشغال الطرق دون ترخيص.' },
      { law: 'قانون المرور', article: 'المادة (40)', summary: 'ضوابط الحفر بجوار الطرق الرئيسية.' },
    ],
    metrics: { averageTime: 4, dailyCapacity: 5, satisfactionRate: 75 },
    related: ['SVC-003', 'SVC-008'],
    formRef: 'N-04',
    isActive: true,
    lastUpdated: '2026-03-08',
  },
  {
    id: 'SVC-005',
    title: 'الإفادات والشهادات الهندسية',
    description:
      'إصدار مستندات رسمية تثبت حالة المباني، خطوط التنظيم، ومدى التزامها بالاشتراطات القانونية.',
    category: 'إفادات',
    icon: Award,
    color: '#9333ea',
    process: {
      steps: [
        'تقديم النموذج (ن-5).',
        'سداد الرسوم المقررة.',
        'مراجعة السجلات الهندسية للمكتب.',
        'إصدار الإفادة المطلوبة.',
      ],
      timeframe: '3-5 أيام عمل',
      fee: {
        min: 1500,
        max: 5000,
        currency: 'ريال',
        description: 'رسوم رمزية تختلف حسب نوع الإفادة.',
      },
    },
    documents: {
      required: ['نموذج (ن-5) مكتمل', 'وثيقة ملكية العقار', 'رقم الترخيص الأصلي (إن وجد)'],
      optional: ['تفويض رسمي من صاحب العلاقة'],
      tips: ['الإفادات تسلم شخصياً للمستفيد أو الوكيل.', 'لا توجد خدمة إفادات إلكترونية حالياً.'],
    },
    regulations: [
      {
        law: 'قانون التوثيق المدني',
        article: 'المادة (15)',
        summary: 'مشروعية الإفادات الرسمية الصادرة عن الدولة.',
      },
    ],
    metrics: { averageTime: 2, dailyCapacity: 20, satisfactionRate: 90 },
    related: ['SVC-001', 'SVC-003'],
    formRef: 'N-05',
    isActive: true,
    lastUpdated: '2026-03-05',
  },
  {
    id: 'SVC-006',
    title: 'الشكاوى والبلاغات',
    description: 'قناة رسمية لاستقبال الشكاوى المتعلقة بالمخالفات العمرانية وأداء مكتب الأشغال.',
    category: 'شكاوى',
    icon: AlertCircle,
    color: '#be123c',
    process: {
      steps: [
        'تقديم البلاغ (ن-6).',
        'تسجيل الشكوى في سجل البلاغات.',
        'التحقيق الميداني (إن لزم).',
        'الرد على مقدم الشكوى.',
      ],
      timeframe: 'فوري - يُحال للتحقيق خلال 24 ساعة',
      fee: { min: 0, max: 0, currency: 'ريال', description: 'مجاني' },
    },
    documents: {
      required: ['نموذج (ن-6) مكتمل', 'وصف دقيق للموقع والزمان'],
      optional: ['صور أو فيديوهات توثيقية', 'أسماء شهود إن وجدوا'],
      tips: ['يُمكن التبليغ بشكل مجهول الهوية.', 'البلاغات الكيدية ستُحال للجهات القضائية.'],
    },
    regulations: [
      {
        law: 'قانون الإجراءات المدنية',
        article: 'المادة (110)',
        summary: 'حق المواطن في التظلم والشكوى.',
      },
    ],
    metrics: { averageTime: 1, dailyCapacity: 10, satisfactionRate: 65 },
    related: [],
    formRef: 'N-06',
    isActive: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'SVC-007',
    title: 'تسجيل وتصنيف المقاولين',
    description:
      'تسجيل المقاولين والمصنفات في سجل الموردين المعتمدين للمشاركة في مشاريع ومناقصات الدولة.',
    category: 'مقاولين',
    icon: HardHat,
    color: '#0d9488',
    process: {
      steps: [
        'تقديم النموذج (ن-7) مع الوثائق.',
        'مراجعة الخبرات والكادر الفني.',
        'تصنيف المقاول حسب الفئة.',
        'إصدار شهادة التصنيف.',
      ],
      timeframe: '10-15 يوم عمل',
      fee: { min: 5000, max: 20000, currency: 'ريال', description: 'يُحدد حسب الفئة (أ، ب، ج).' },
    },
    documents: {
      required: ['نموذج (ن-7) مكتمل', 'السجل التجاري ساري المفعول', 'شهادات الخبرة للكادر الفني'],
      optional: ['قائمة بالمشاريع السابقة', 'شهادات معتمدة من جهات حكومية'],
      tips: ['التصنيف إلزامي للمشاركة في أي مناقصة.', 'يجب تجديد التصنيف سنوياً.'],
    },
    regulations: [
      {
        law: 'قانون المناقصات والمزايدات',
        article: 'المادة (22)',
        summary: 'اشتراطات التأهيل المسبق للمقاولين.',
      },
    ],
    metrics: { averageTime: 10, dailyCapacity: 5, satisfactionRate: 80 },
    related: ['SVC-001'],
    formRef: 'N-07',
    isActive: true,
    lastUpdated: '2026-02-20',
  },
  {
    id: 'SVC-008',
    title: 'الأرشفة والاستعلام عن المعاملات',
    description:
      'خدمة أرشفة تاريخية لاستخراج صورة طبق الأصل من المعاملات السابقة لأغراض قانونية أو إدارية.',
    category: 'أرشفة',
    icon: Layers,
    color: '#4f46e5',
    process: {
      steps: [
        'تقديم النموذج (ن-8) مع الوثائق.',
        'البحث في السجل الأرشيفي.',
        'تصديق النسخة المستخرجة.',
        'تسليم الصورة.',
      ],
      timeframe: '1-3 أيام عمل',
      fee: { min: 1000, max: 1000, currency: 'ريال', description: 'رسوم ثابتة للصورة الواحدة.' },
    },
    documents: {
      required: ['نموذج (ن-8) مكتمل', 'صورة الهوية أو تفويض رسمي'],
      optional: ['رقم التتبع الأصلي للمعاملة'],
      tips: ['يتطلب إحضار ما يثبت العلاقة بالمعاملة الأصلية (وصلة قرابة أو وكالة).'],
    },
    regulations: [
      {
        law: 'قانون الوثائق والأرشيف',
        article: 'المادة (10)',
        summary: 'حق الأفراد في استخراج الوثائق المؤرشفة.',
      },
    ],
    metrics: { averageTime: 1, dailyCapacity: 30, satisfactionRate: 98 },
    related: ['SVC-005'],
    formRef: 'N-08',
    isActive: true,
    lastUpdated: '2026-02-15',
  },
];

// ============================================================
// 3. تكوينات التصميم (Design Configurations)
// ============================================================
// ============================================================
// 4. مكونات تفاعلية (Components)
// ============================================================

// 4.1. Data Table View للخدمات (للعرض الموسع)
const ServiceTableRow = ({
  service,
  isExpanded,
  toggleExpand,
  onNavigate,
}: {
  service: ServiceItem;
  isExpanded: boolean;
  toggleExpand: () => void;
  onNavigate: (page: Page) => void;
}) => {
  const Icon = service.icon;

  return (
    <div
      className={`border-b border-gray-200 last:border-0 transition-colors hover:bg-gray-50/50 ${isExpanded ? 'bg-gray-50' : ''}`}
    >
      <button
        type="button"
        className="w-full text-left flex flex-col md:flex-row md:items-center p-4 gap-4"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${service.color}-100 text-${service.color}-600`}
          >
            <Icon size={20} />
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">{service.title}</div>
            <div className="text-xs text-gray-400">{service.id}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs w-full md:w-auto md:justify-end">
          <span className={`px-2 py-1 rounded bg-gray-100 font-medium text-gray-600`}>
            {service.process.timeframe}
          </span>
          <span className="text-gray-500 font-mono">
            {service.process.fee.min.toLocaleString()} - {service.process.fee.max.toLocaleString()}{' '}
            {service.process.fee.currency}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-6 pt-2 bg-white border-t border-gray-100 grid md:grid-cols-3 gap-6 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <CheckCircle2 size={14} /> خطوات العمل
            </h4>
            <ul className="space-y-1 text-gray-500 list-disc list-inside marker:text-gov-400">
              {service.process.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={14} /> المستندات المطلوبة
            </h4>
            <ul className="space-y-1 text-gray-500 list-disc list-inside marker:text-amber-400">
              {service.documents.required.map((doc) => (
                <li key={doc}>
                  <span className="font-medium text-gray-700">إلزامي:</span> {doc}
                </li>
              ))}
              {service.documents.optional.map((doc) => (
                <li key={doc}>
                  <span className="font-medium text-gray-500">اختياري:</span> {doc}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-400">الرسوم المقدرة</div>
              <div className="font-bold text-gray-800 font-mono text-lg">
                {service.process.fee.min.toLocaleString()} -{' '}
                {service.process.fee.max.toLocaleString()}{' '}
                <span className="text-xs font-normal text-gray-500">
                  {service.process.fee.currency}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (service.formRef) {
                    sessionStorage.setItem('selectedForm', service.formRef);
                  }
                  onNavigate('forms');
                }}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50 transition flex items-center gap-1"
              >
                <Printer size={12} /> طباعة النموذج
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (service.formRef) {
                    sessionStorage.setItem('selectedForm', service.formRef);
                  }
                  onNavigate('forms');
                }}
                className="px-3 py-1.5 bg-gov-600 text-white rounded text-xs hover:bg-gov-700 transition flex items-center gap-1"
              >
                <ExternalLink size={12} /> ابدأ الخدمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// 5. الصفحة الرئيسية (ServicesPage)
// ============================================================
export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  const toggleExpand = (id: string) => {
    setExpandedService((prev) => (prev === id ? null : id));
  };

  // فلترة الخدمات (Search & Filter)
  const filteredServices = useMemo(() => {
    return SERVICES_CATALOG.filter((service) => {
      const matchesSearch =
        service.title.includes(searchTerm) ||
        service.description.includes(searchTerm) ||
        service.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || service.category === selectedCategory;
      return matchesSearch && matchesCategory && service.isActive;
    });
  }, [searchTerm, selectedCategory]);

  // إحصائيات الصفحة الفورية
  const categories = ['الكل', ...Array.from(new Set(SERVICES_CATALOG.map((s) => s.category)))];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
      dir="rtl"
    >
      {/* 1. رأس الصفحة المتقدم (PageHeader Enterprise) */}
      <div className="relative bg-gov-800 overflow-hidden">
        {/* زخارف هندسية خلفية */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-500 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-white/80 mb-6 ring-1 ring-white/20">
            <Landmark
              size={14}
              className="text-gold-300"
            />
            <span>منصة الخدمات الحكومية - الإصدار 2.0</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            دليل الخدمات الهندسية والإدارية
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            مكتب الأشغال العامة والطرق بمحافظة ذمار يقدم{' '}
            <span className="text-gold-300 font-semibold">(68)</span> خدمة هندسية وإدارية موزعة على{' '}
            <span className="text-gold-300 font-semibold">{categories.length - 1}</span> قطاعات
            رئيسية.
          </p>
          <div className="max-w-4xl mx-auto grid gap-3 sm:grid-cols-3 mb-8 text-white/80 text-sm">
            <div className="rounded-3xl bg-white/10 border border-white/10 p-4">
              <div className="font-semibold text-white mb-1">مرجع موثوق</div>
              <div>دليل خدمات رسمي موثّق يدعم كل إجراء.</div>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/10 p-4">
              <div className="font-semibold text-white mb-1">إجراءات واضحة</div>
              <div>خطوات تقديم الخدمة، المستندات، والمتابعة.</div>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/10 p-4">
              <div className="font-semibold text-white mb-1">روابط سريعة</div>
              <div>الوصول المباشر إلى النماذج والمستندات ذات العلاقة.</div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto bg-white/10 border border-white/15 rounded-3xl p-5 md:p-6 mb-10 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-3xl bg-gold-500/15 flex items-center justify-center text-gold-300">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">الدليل الإرشادي للخدمات 2026</h2>
                  <p className="text-white/70 text-sm leading-relaxed mt-1">
                    الوثيقة المرجعية الرسمية التي تغطي الخدمات، الشروط، المستندات، والرسوم.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/docs/الدليل_الإرشادي_للخدمات_2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white text-gov-800 px-4 py-3 text-sm font-semibold shadow-lg shadow-black/10 hover:bg-gray-100 transition"
                >
                  <Download size={16} /> تحميل الدليل
                </a>
                <a
                  href="/docs/الفصل_الثاني_مع_الملخص.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gov-100 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-black/10 hover:bg-gov-200 transition"
                >
                  <Eye size={16} /> عرض الملخص
                </a>
              </div>
            </div>
          </div>

          {/* إحصائيات فورية في الهيدر */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={68} />
              </div>
              <div className="text-xs text-white/60 mt-1">إجمالي الخدمات</div>
            </div>
            <div className="w-px h-10 bg-white/20 self-center" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter
                  end={12}
                  suffix="%"
                />
              </div>
              <div className="text-xs text-white/60 mt-1">نمو سنوي</div>
            </div>
            <div className="w-px h-10 bg-white/20 self-center" />
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-300">
                <AnimatedCounter
                  end={92}
                  suffix="%"
                />
              </div>
              <div className="text-xs text-white/60 mt-1">رضا المستفيدين</div>
            </div>
          </div>
        </div>

        {/* شريط البحث والتصفية المدمج في الهيدر */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 pb-8 -mb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row gap-3 border border-gray-100">
            <div className="relative flex-1">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="ابحث عن خدمة، رقم نموذج، أو كلمة مفتاحية..."
                className="w-full pr-12 pl-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-gov-500 focus:border-transparent outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-gov-500 outline-none transition min-w-[140px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-500"
                title="تبديل عرض القائمة/البطاقات"
              >
                {viewMode === 'card' ? <List size={18} /> : <Grid size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. شريط التنقل السياقي (Contextual Navigation) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gov-600 hover:bg-gov-50 transition-colors shrink-0"
          >
            <Home size={14} /> الرئيسية
          </button>
          <span className="text-gray-300 shrink-0">/</span>
          <span className="text-xs font-bold text-gov-600 shrink-0">دليل الخدمات</span>
          <div className="flex-1" />
          <span className="text-[10px] text-gray-400 shrink-0 bg-gray-100 px-2 py-1 rounded">
            {filteredServices.length} من {SERVICES_CATALOG.length} خدمة
          </span>
        </div>
      </div>

      {/* 3. مساحة المحتوى الأساسي */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* قسم: جدول الخدمات (Enterprise List View) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen
                size={18}
                className="text-gov-500"
              />
              <span className="font-semibold text-gray-700">دليل الخدمات التفصيلي</span>
            </div>
            <div className="text-xs text-gray-400">
              آخر تحديث: {new Date().toLocaleDateString('ar-YE')}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ScrollReveal
                  key={service.id}
                  threshold={0.1}
                >
                  <ServiceTableRow
                    service={service}
                    isExpanded={expandedService === service.id}
                    toggleExpand={() => toggleExpand(service.id)}
                    onNavigate={onNavigate}
                  />
                </ScrollReveal>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search
                    size={24}
                    className="text-gray-400"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-700">لا توجد نتائج مطابقة</h3>
                <p className="text-gray-500 text-sm mt-1">جرب البحث بكلمة أخرى أو تغيير الفئة.</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. ملحق: معلومات الخدمة الشاملة (Service Catalog Deep Dive) */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Scale size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">الرسوم والتعرفة</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                جميع الرسوم محددة وفقاً للائحة التعرفة المعتمدة من وزارة الأشغال. يرجى مراجعة بطاقة
                الخدمة للحصول على السعر الدقيق.
              </p>
              <div className="text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-600 font-mono">
                <div className="flex justify-between">
                  <span>حد أدنى:</span> <span className="font-bold text-gov-600">2,000 ريال</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>حد أقصى:</span> <span className="font-bold text-gov-600">50,000 ريال</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">الأحكام والضوابط</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                تخضع جميع خدمات المكتب للقوانين واللوائح النافذة في الجمهورية اليمنية. عدم الالتزام
                بالضوابط يعرض صاحبه للمساءلة القانونية.
              </p>
              <ul className="text-xs space-y-1 text-gray-600">
                <li className="flex items-start gap-2">
                  <BadgeCheck
                    size={14}
                    className="text-emerald-500 mt-0.5"
                  />{' '}
                  قانون البناء اليمني
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck
                    size={14}
                    className="text-emerald-500 mt-0.5"
                  />{' '}
                  نظام ضوابط البناء
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck
                    size={14}
                    className="text-emerald-500 mt-0.5"
                  />{' '}
                  قانون المناقصات والمزايدات
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">دليل ملء النماذج</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                لتسريع إجراءات معاملتك، ننصحك بقراءة التعليمات المرفقة مع كل نموذج قبل التقديم. أي
                نقص في البيانات يؤدي إلى تأخير المعاملة.
              </p>
              <button className="w-full py-2.5 bg-gov-50 text-gov-600 rounded-xl text-sm font-medium hover:bg-gov-100 transition flex items-center justify-center gap-2">
                <Download size={16} /> تحميل دليل النماذج (PDF)
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* 5. الشريط السفلي الشامل (Unified Footer Contact Banner) */}
        <div className="mt-16">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-gov-700 via-gov-800 to-gov-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* خلفية زخرفية */}
              <div className="geo-pattern absolute inset-0 opacity-10" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gov-900/50 to-transparent" />

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold-500/25">
                  <MessageCircle
                    size={28}
                    className="text-white"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">هل تحتاج مساعدة إضافية؟</h2>
                <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed">
                  فريق مركز خدمة الجمهور جاهز للرد على استفساراتكم وتقديم التوجيه اللازم لجميع خدمات
                  مكتب الأشغال العامة والطرق بمحافظة ذمار.
                </p>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">اتصل مباشرة</div>
                    <a
                      href="tel:+967777888198"
                      className="text-xl font-bold tracking-wider hover:text-gold-300 transition flex items-center gap-2"
                    >
                      <Phone size={20} /> 777-888-198
                    </a>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">بريد إلكتروني</div>
                    <a
                      href="mailto:info@thamar-ashgal.gov.ye"
                      className="text-xl font-bold tracking-wider hover:text-gold-300 transition flex items-center gap-2"
                    >
                      <Mail size={20} /> info@thamar-ashgal.gov.ye
                    </a>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">ساعات العمل</div>
                    <div className="text-lg font-bold flex items-center gap-2">
                      <Clock size={18} /> السبت - الأربعاء 8ص - 3م
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-white/40">
                  <span className="flex items-center gap-1">
                    <HardHat size={12} /> إشراف: م. هايل البحري
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} /> معتمد من وزارة الأشغال
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Globe size={12} /> الإصدار 2.0
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
