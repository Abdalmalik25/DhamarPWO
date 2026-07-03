// ============================================================
// ServicesSection.tsx - بوابة الخدمات الهندسية الذكية
// الإصدار المؤسسي المتكامل v5.0 - أعلى معايير الجودة الحكومية
// ============================================================

import {
  memo,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import AnimatedCounter from '../../../shared/components/AnimatedCounter';
import ServiceModal from '../../../shared/components/ServiceModal';
import {
  HardHat,
  ArrowLeft,
  Building2,
  X,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Filter,
  Grid,
  List,
  Shield,
  MapPin,
  Phone,
  ChevronDown,
  Star,
  Sparkles,
  Award,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  Share2,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  DollarSign,
  LayoutGrid,
} from 'lucide-react';

// ============================================================
// 1. نظام التصميم المتكامل (Advanced Design System)
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DESIGN_TOKENS = {
  colors: {
    primary: {
      50: '#fefce8',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
  },
  shadows: {
    'xs': '0 1px 2px 0 rgba(0,0,0,0.05)',
    'sm': '0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
    'md': '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
    'lg': '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',
    'xl': '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)',
    '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
    '3xl': '0 35px 60px -15px rgba(0,0,0,0.30)',
    'inner': 'inset 0 2px 4px 0 rgba(0,0,0,0.05)',
    'glow': '0 0 40px rgba(245,158,11,0.15)',
    'glow-strong': '0 0 60px rgba(245,158,11,0.25)',
  },
  borderRadius: {
    'sm': '0.125rem',
    'base': '0.25rem',
    'md': '0.375rem',
    'lg': '0.5rem',
    'xl': '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    '4xl': '2rem',
    'full': '9999px',
  },
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
};

// ============================================================
// 2. أنواع البيانات المتقدمة (Advanced Types)
// ============================================================

/** حالة تحميل الخدمات */
export type ServiceLoadState = 'idle' | 'loading' | 'success' | 'error' | 'refreshing';

/** طريقة عرض الخدمات */
export type ServiceViewMode = 'grid' | 'list' | 'table' | 'compact';

/** خيارات الفرز */
export type ServiceSortBy =
  | 'popularity'
  | 'newest'
  | 'oldest'
  | 'alphabetical'
  | 'alphabetical-desc'
  | 'estimated-time'
  | 'fee-low'
  | 'fee-high';

/** خيارات التصفية المتقدمة */
export interface ServiceFilters {
  /** الفئات المختارة */
  categories: string[];
  /** الحالات المختارة */
  statuses: ('active' | 'inactive' | 'new' | 'popular')[];
  /** نطاق الرسوم الأدنى */
  feeMin?: number;
  /** نطاق الرسوم الأعلى */
  feeMax?: number;
  /** الوقت التقديري الأقصى (بالدقائق) */
  maxTime?: number;
  /** يحتوي على نموذج */
  hasForm?: boolean;
  /** الكلمات المفتاحية */
  keywords?: string[];
}

/** بيانات الخدمة الموسعة */
export interface ExtendedService {
  /** معرف الخدمة الفريد */
  id: string;
  /** عنوان الخدمة */
  title: string;
  /** وصف الخدمة */
  description: string;
  /** أيقونة الخدمة */
  icon: React.ElementType;
  /** لون الخدمة (تدرج) */
  color: string;
  /** الفئة */
  category: string;
  /** معرف النموذج المرتبط */
  formId?: string;
  /** حالة الخدمة */
  isActive?: boolean;
  /** خدمة شائعة */
  isPopular?: boolean;
  /** خدمة جديدة */
  isNew?: boolean;
  /** العلامات */
  tags?: string[];
  /** الوقت التقديري */
  estimatedTime?: string;
  /** نطاق الرسوم */
  feeRange?: {
    min: number;
    max: number;
    currency: string;
  };
  /** القسم المختص */
  department?: string;
  /** تاريخ الإضافة */
  createdAt?: Date;
  /** آخر تحديث */
  updatedAt?: Date;
  /** عدد المشاهدات */
  views?: number;
  /** عدد الطلبات */
  requests?: number;
  /** التقييم (5 نجوم) */
  rating?: number;
  /** عدد المراجعات */
  reviews?: number;
  /** الرابط المباشر */
  permalink?: string;
  /** المستندات المطلوبة */
  requiredDocuments?: string[];
  /** الشروط والأحكام */
  terms?: string;
  /** الفوائد */
  benefits?: string[];
  /** الأسئلة الشائعة */
  faqs?: { question: string; answer: string }[];
}

/** بيانات الإحصائيات */
export interface ServiceStatistics {
  /** إجمالي الخدمات */
  total: number;
  /** الخدمات النشطة */
  active: number;
  /** الخدمات غير النشطة */
  inactive: number;
  /** الخدمات الجديدة */
  new: number;
  /** الخدمات الشائعة */
  popular: number;
  /** إجمالي المشاهدات */
  totalViews: number;
  /** إجمالي الطلبات */
  totalRequests: number;
  /** متوسط التقييم */
  averageRating: number;
  /** توزيع الفئات */
  categoryDistribution: Record<string, number>;
}

/** بيانات تفاعل المستخدم مع الخدمة */
export interface ServiceInteraction {
  /** معرف الخدمة */
  serviceId: string;
  /** نوع التفاعل */
  type: 'view' | 'click' | 'request' | 'bookmark' | 'share' | 'print' | 'download';
  /** الوقت */
  timestamp: Date;
  /** المستخدم (إن وجد) */
  userId?: string;
  /** معلومات إضافية */
  metadata?: Record<string, unknown>;
}

/** خصائص المكون */
export interface ServicesSectionProps {
  /** الخدمات الخارجية */
  services: ExtendedService[];
  /** حالة التحميل */
  isLoading?: boolean;
  /** الخطأ */
  error?: string | null;
  /** دالة التنقل */
  onNavigate?: (page: string) => void;
  /** دالة البحث */
  onSearch?: (query: string) => void;
  /** الثيم */
  theme?: 'light' | 'dark';
  /** عنوان القسم */
  title?: string;
  /** عنوان فرعي */
  subtitle?: string;
  /** فئات إضافية */
  className?: string;
}

/** واجهة مرجع المكون للتحكم الخارجي */
export interface ServicesSectionRef {
  /** إعادة تحميل الخدمات */
  refresh: () => Promise<void>;
  /** التبديل إلى وضع العرض */
  setViewMode: (mode: ServiceViewMode) => void;
  /** تطبيق الفلتر */
  applyFilters: (filters: ServiceFilters) => void;
  /** إعادة ضبط جميع الفلاتر */
  resetFilters: () => void;
  /** البحث عن خدمة */
  search: (query: string) => void;
  /** الحصول على الخدمة المختارة حالياً */
  getSelectedService: () => ExtendedService | null;
  /** الحصول على الإحصائيات */
  getStatistics: () => ServiceStatistics;
  /** تصدير الخدمات كـ CSV */
  exportCSV: () => void;
  /** تصدير الخدمات كـ JSON */
  exportJSON: () => void;
  /** تسجيل تفاعل */
  trackInteraction: (interaction: ServiceInteraction) => void;
}

// ============================================================
// 3. البيانات الافتراضية الموسعة (Extended Default Data)
// ============================================================

const DEFAULT_SERVICES: ExtendedService[] = [
  {
    id: 'svc-001',
    title: 'ترخيص بناء سكني',
    description: 'إصدار ترخيص بناء للوحدات السكنية وفق المخططات المعتمدة والاشتراطات البلدية',
    icon: HardHat,
    color: 'from-orange-500 to-orange-700',
    category: 'تراخيص',
    formId: 'F-001',
    isActive: true,
    isPopular: true,
    isNew: false,
    tags: ['بناء', 'سكني', 'ترخيص'],
    estimatedTime: '3 أيام عمل',
    feeRange: { min: 50000, max: 200000, currency: 'ريال' },
    department: 'إدارة التراخيص',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
    views: 1250,
    requests: 320,
    rating: 4.7,
    reviews: 85,
    permalink: '/services/trkhys-bna-skn',
    requiredDocuments: ['صورة من الهوية', 'مخطط الموقع', 'مخططات هندسية', 'إفادة من الجيران'],
    benefits: ['إجراءات سريعة وشفافة', 'استشارة هندسية مجانية', 'متابعة ميدانية'],
    faqs: [
      { question: 'ما هي مدة صلاحية الترخيص؟', answer: 'سنة واحدة قابلة للتجديد' },
      { question: 'هل يمكن تعديل المخططات بعد الترخيص؟', answer: 'نعم بموافقة الإدارة' },
    ],
  },
  {
    id: 'svc-002',
    title: 'رخصة مهنة',
    description: 'إصدار وتجديد رخص المهن الحرفية والتجارية وفق الأنظمة المعمول بها',
    icon: Building2,
    color: 'from-blue-500 to-blue-700',
    category: 'تراخيص',
    formId: 'F-002',
    isActive: true,
    isPopular: true,
    isNew: false,
    tags: ['مهنة', 'تجاري', 'رخصة'],
    estimatedTime: 'يومان',
    feeRange: { min: 30000, max: 150000, currency: 'ريال' },
    department: 'إدارة التراخيص التجارية',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-10'),
    views: 980,
    requests: 410,
    rating: 4.5,
    reviews: 62,
    requiredDocuments: ['صورة من الهوية', 'عقد إيجار', 'شهادة مهنية'],
  },
  {
    id: 'svc-003',
    title: 'اعتماد مخططات هندسية',
    description: 'اعتماد المخططات الهندسية للمشاريع الإنشائية وفق المواصفات الفنية المعتمدة',
    icon: Shield,
    color: 'from-emerald-500 to-emerald-700',
    category: 'اعتماد',
    formId: 'F-003',
    isActive: true,
    isPopular: false,
    isNew: true,
    tags: ['هندسي', 'اعتماد', 'مخططات'],
    estimatedTime: '5 أيام عمل',
    feeRange: { min: 100000, max: 500000, currency: 'ريال' },
    department: 'الهندسة الفنية',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-08-15'),
    views: 340,
    requests: 85,
    rating: 4.8,
    reviews: 23,
  },
  {
    id: 'svc-004',
    title: 'معاينة فنية للمباني',
    description: 'إجراء معاينات فنية للمباني القائمة والجديدة للتحقق من مطابقتها للاشتراطات',
    icon: Eye,
    color: 'from-purple-500 to-purple-700',
    category: 'معاينات',
    formId: 'F-004',
    isActive: true,
    isPopular: true,
    isNew: false,
    tags: ['معاينة', 'فني', 'مباني'],
    estimatedTime: '48 ساعة',
    feeRange: { min: 25000, max: 100000, currency: 'ريال' },
    department: 'إدارة المعاينات',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-07-25'),
    views: 760,
    requests: 210,
    rating: 4.3,
    reviews: 41,
  },
  {
    id: 'svc-005',
    title: 'تصريح حفر',
    description: 'إصدار تصاريح الحفر للطرق والشوارع والمشاريع الخدمية',
    icon: MapPin,
    color: 'from-amber-500 to-amber-700',
    category: 'تصاريح',
    formId: 'F-005',
    isActive: true,
    isPopular: false,
    isNew: false,
    tags: ['حفر', 'طرق', 'تصريح'],
    estimatedTime: '3 أيام',
    feeRange: { min: 40000, max: 200000, currency: 'ريال' },
    department: 'إدارة المشاريع',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-08-01'),
    views: 430,
    requests: 95,
    rating: 4.2,
    reviews: 18,
  },
  {
    id: 'svc-006',
    title: 'إفادة ملكية',
    description: 'إصدار إفادات ملكية العقارات والأراضي للأغراض الرسمية',
    icon: FileText,
    color: 'from-cyan-500 to-cyan-700',
    category: 'إفادات',
    formId: 'F-006',
    isActive: true,
    isPopular: false,
    isNew: true,
    tags: ['ملكية', 'إفادة', 'عقار'],
    estimatedTime: 'يوم واحد',
    feeRange: { min: 10000, max: 50000, currency: 'ريال' },
    department: 'إدارة الملكية',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-08-20'),
    views: 580,
    requests: 150,
    rating: 4.6,
    reviews: 32,
  },
  {
    id: 'svc-007',
    title: 'شهادة صحة بيئية',
    description: 'إصدار شهادات الصحة البيئية للمنشآت الغذائية والخدمية',
    icon: Shield,
    color: 'from-green-500 to-green-700',
    category: 'صحة',
    formId: 'F-007',
    isActive: true,
    isPopular: false,
    isNew: false,
    tags: ['صحة', 'بيئي', 'غذائي'],
    estimatedTime: '48 ساعة',
    feeRange: { min: 15000, max: 75000, currency: 'ريال' },
    department: 'إدارة الصحة البيئية',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-07-15'),
    views: 620,
    requests: 170,
    rating: 4.4,
    reviews: 28,
  },
  {
    id: 'svc-008',
    title: 'ترخيص إعلان تجاري',
    description: 'ترخيص اللوحات الإعلانية والتسويقية التجارية وفق الاشتراطات',
    icon: HardHat,
    color: 'from-rose-500 to-rose-700',
    category: 'تنظيم',
    formId: 'F-008',
    isActive: true,
    isPopular: false,
    isNew: false,
    tags: ['إعلان', 'تجاري', 'ترخيص'],
    estimatedTime: 'يومان',
    feeRange: { min: 20000, max: 120000, currency: 'ريال' },
    department: 'إدارة التنظيم',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-08-10'),
    views: 290,
    requests: 65,
    rating: 4.0,
    reviews: 15,
  },
  {
    id: 'svc-009',
    title: 'تقييم هندسي للمنشآت',
    description: 'تقييم الحالة الفنية للمنشآت القائمة وإصدار تقارير فنية معتمدة',
    icon: Shield,
    color: 'from-indigo-500 to-indigo-700',
    category: 'هندسي',
    formId: 'F-009',
    isActive: true,
    isPopular: true,
    isNew: true,
    tags: ['تقييم', 'هندسي', 'منشآت'],
    estimatedTime: '7 أيام',
    feeRange: { min: 150000, max: 600000, currency: 'ريال' },
    department: 'الهندسة الفنية',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-08-25'),
    views: 210,
    requests: 45,
    rating: 4.9,
    reviews: 19,
  },
  {
    id: 'svc-010',
    title: 'ترخيص محل تجاري',
    description: 'إصدار تراخيص فتح وتشغيل المحلات التجارية في المحافظة',
    icon: Building2,
    color: 'from-yellow-500 to-yellow-700',
    category: 'تراخيص',
    formId: 'F-010',
    isActive: true,
    isPopular: true,
    isNew: false,
    tags: ['محل', 'تجاري', 'ترخيص'],
    estimatedTime: '3 أيام',
    feeRange: { min: 40000, max: 180000, currency: 'ريال' },
    department: 'إدارة التراخيص التجارية',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-07-30'),
    views: 850,
    requests: 280,
    rating: 4.5,
    reviews: 54,
  },
  {
    id: 'svc-011',
    title: 'معاينة مختبرية',
    description: 'إجراء فحوصات مختبرية لعينات المواد الإنشائية والتربة والمياه',
    icon: HardHat,
    color: 'from-teal-500 to-teal-700',
    category: 'مختبرات',
    formId: 'F-011',
    isActive: true,
    isPopular: false,
    isNew: true,
    tags: ['مختبر', 'فحص', 'مواد'],
    estimatedTime: '5 أيام',
    feeRange: { min: 80000, max: 350000, currency: 'ريال' },
    department: 'المختبر المركزي',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-08-18'),
    views: 180,
    requests: 38,
    rating: 4.7,
    reviews: 14,
  },
  {
    id: 'svc-012',
    title: 'خدمة الشكاوى الهندسية',
    description: 'استقبال ومعالجة الشكاوى المتعلقة بالمخالفات الهندسية والبناء العشوائي',
    icon: Shield,
    color: 'from-red-500 to-red-700',
    category: 'شكاوى',
    formId: 'F-012',
    isActive: true,
    isPopular: false,
    isNew: false,
    tags: ['شكوى', 'هندسي', 'رقابة'],
    estimatedTime: '48 ساعة',
    feeRange: { min: 0, max: 0, currency: 'ريال' },
    department: 'إدارة الرقابة',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-06-28'),
    views: 920,
    requests: 310,
    rating: 4.1,
    reviews: 67,
  },
];

// ============================================================
// 4. المكونات الفرعية المتخصصة (Specialized Sub-components)
// ============================================================

// 4.1. خلفية متحركة للقسم
const AnimatedSectionBackground = memo(function AnimatedSectionBackground({
  theme,
}: {
  theme?: 'light' | 'dark';
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>
      <div className="absolute -top-1/2 -left-1/2 w-full h-full">
        <div
          className="absolute top-[15%] left-[25%] w-96 h-96 bg-gradient-to-br from-amber-200/15 via-yellow-300/10 to-gold-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDuration: '25s' }}
        />
        <div
          className="absolute bottom-[15%] right-[20%] w-[30rem] h-[30rem] bg-gradient-to-tl from-blue-200/10 via-indigo-300/8 to-purple-400/8 rounded-full blur-3xl animate-float-delayed"
          style={{ animationDuration: '30s', animationDelay: '-7s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-gradient-to-r from-emerald-200/8 via-teal-300/8 to-cyan-400/8 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDuration: '20s' }}
        />
      </div>
    </div>
  );
});

// 4.2. شارة الخدمة المميزة
const ServiceBadge = memo(function ServiceBadge({
  type,
  label,
}: {
  type: 'popular' | 'new' | 'active' | 'inactive' | 'rating';
  label?: string;
}) {
  const config = {
    popular: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Star, label: 'الأكثر طلباً' },
    new: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Sparkles, label: 'جديد' },
    active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'نشط' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-500', icon: X, label: 'غير نشط' },
    rating: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Award, label: 'مميز' },
  };

  const c = config[type] || config.active;
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}
    >
      <Icon size={12} />
      {label || c.label}
    </span>
  );
});

// 4.3. بطاقة خدمة متطورة ثلاثية الأبعاد
const PremiumServiceCard = memo(function PremiumServiceCard({
  service,
  onOpenModal,
  onQuickView,
  onBookmark,
  onShare,
  theme,
  index,
  isBookmarked,
}: {
  service: ExtendedService;
  onOpenModal: (service: ExtendedService) => void;
  onQuickView?: (service: ExtendedService) => void;
  onBookmark?: (service: ExtendedService) => void;
  onShare?: (service: ExtendedService) => void;
  theme?: 'light' | 'dark';
  index: number;
  isBookmarked?: boolean;
}) {
  const Icon = service.icon;
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-100/50';
  const textClass = isDark ? 'text-gray-100' : 'text-gray-800';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-500';

  const [, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative ${cardBg} backdrop-blur-sm rounded-3xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenModal(service)}
      aria-label={`خدمة: ${service.title}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* خلفية متدرجة عند التمرير */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700`}
      />

      {/* أيقونة الخدمة مع تأثير ثلاثي الأبعاد */}
      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}
          >
            <Icon
              size={28}
              className="text-white"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* أزرار الإجراءات السريعة */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            {onBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(service);
                }}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-amber-600'
                }`}
                aria-label={isBookmarked ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              >
                {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
            )}
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(service);
                }}
                className="p-2 bg-white/80 hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-500 hover:text-blue-600"
                aria-label="مشاركة الخدمة"
              >
                <Share2 size={16} />
              </button>
            )}
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(service);
                }}
                className="p-2 bg-white/80 hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-500 hover:text-gray-700"
                aria-label="معاينة سريعة"
              >
                <Eye size={16} />
              </button>
            )}
          </div>
        </div>

        {/* المحتوى */}
        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className={`font-bold text-base ${textClass} line-clamp-2 flex-1`}>
              {service.title}
            </h3>
            {service.isPopular && <ServiceBadge type="popular" />}
            {service.isNew && <ServiceBadge type="new" />}
          </div>

          <p className={`${mutedClass} text-sm leading-relaxed line-clamp-2 mb-3`}>
            {service.description}
          </p>

          {/* علامات وبيانات إضافية */}
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span className="text-[10px] font-bold text-gov-600 bg-gov-50 px-2.5 py-1 rounded-full">
              {service.category}
            </span>
            {service.estimatedTime && (
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock size={10} />
                {service.estimatedTime}
              </span>
            )}
            {service.feeRange && service.feeRange.min > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <DollarSign size={10} />
                {service.feeRange.min.toLocaleString()}+
              </span>
            )}
            {service.rating && (
              <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star
                  size={10}
                  className="fill-yellow-500"
                />
                {service.rating.toFixed(1)} ({service.reviews || 0})
              </span>
            )}
          </div>

          {/* شريط التقدم أو الإحصائيات */}
          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100/50 pt-3 mt-1">
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {service.views?.toLocaleString() || 0}
            </span>
            <span className="flex items-center gap-1">
              <FileText size={12} />
              {service.requests?.toLocaleString() || 0} طلب
            </span>
            {service.department && (
              <span className="flex items-center gap-1">
                <Building2 size={12} />
                {service.department}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// 4.4. بطاقة خدمة في وضع القائمة (List View)
const ServiceListItem = memo(function ServiceListItem({
  service,
  onOpenModal,
  onQuickView,
  theme,
  index,
}: {
  service: ExtendedService;
  onOpenModal: (service: ExtendedService) => void;
  onQuickView?: (service: ExtendedService) => void;
  theme?: 'light' | 'dark';
  index: number;
}) {
  const Icon = service.icon;
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/90 border-gray-100/50';

  return (
    <div
      className={`group ${bg} backdrop-blur-sm rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer flex items-center gap-4`}
      onClick={() => onOpenModal(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenModal(service)}
      aria-label={`خدمة: ${service.title}`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <div
        className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon
          size={24}
          className="text-white"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`font-bold text-sm ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            {service.title}
          </h3>
          {service.isPopular && <ServiceBadge type="popular" />}
          {service.isNew && <ServiceBadge type="new" />}
        </div>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs line-clamp-1`}>
          {service.description}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[9px] font-bold text-gov-600 bg-gov-50 px-2 py-0.5 rounded-full">
            {service.category}
          </span>
          {service.estimatedTime && (
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Clock size={9} />
              {service.estimatedTime}
            </span>
          )}
          {service.rating && (
            <span className="text-[9px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Star
                size={9}
                className="fill-yellow-500"
              />
              {service.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(service);
            }}
            className="p-2 bg-white/80 hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-400 hover:text-gray-700"
            aria-label="معاينة سريعة"
          >
            <Eye size={16} />
          </button>
        )}
        <span className="text-gov-600 font-bold group-hover:translate-x-1 transition-transform">
          <ArrowLeft size={18} />
        </span>
      </div>
    </div>
  );
});

// 4.5. لوحة التصفية المتقدمة (Advanced Filter Panel)
const AdvancedFilterPanel = memo(function AdvancedFilterPanel({
  filters,
  onFiltersChange,
  categories,
  onClose,
  theme,
}: {
  filters: ServiceFilters;
  onFiltersChange: (filters: ServiceFilters) => void;
  categories: string[];
  onClose: () => void;
  theme?: 'light' | 'dark';
}) {
  const [localFilters, setLocalFilters] = useState<ServiceFilters>(filters);
  const isDark = theme === 'dark';

  const bg = isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200';
  const textClass = isDark ? 'text-gray-200' : 'text-gray-700';

  const handleChange = (key: keyof ServiceFilters, value: unknown) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: ServiceFilters = { categories: [], statuses: [] };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in`}
      onClick={onClose}
    >
      <div
        className={`${bg} backdrop-blur-xl rounded-3xl border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className={`text-lg font-bold ${textClass} flex items-center gap-2`}>
            <SlidersHorizontal
              size={20}
              className="text-gov-600"
            />
            تصفية متقدمة
          </h4>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X
              size={20}
              className="text-gray-500"
            />
          </button>
        </div>

        {/* الفئات */}
        <div className="mb-4">
          <label className={`text-sm font-bold ${textClass} block mb-2`}>الفئات</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const current = localFilters.categories || [];
                  const updated = current.includes(cat)
                    ? current.filter((c) => c !== cat)
                    : [...current, cat];
                  handleChange('categories', updated);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  (localFilters.categories || []).includes(cat)
                    ? 'bg-gov-600 text-white shadow-md'
                    : `bg-gray-100 ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:bg-gray-200`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* الحالات */}
        <div className="mb-4">
          <label className={`text-sm font-bold ${textClass} block mb-2`}>الحالة</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'active', label: 'نشط', icon: CheckCircle2 },
              { value: 'popular', label: 'شائع', icon: Star },
              { value: 'new', label: 'جديد', icon: Sparkles },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  const current = localFilters.statuses || [];
                  const updated = current.includes(value as 'active' | 'popular' | 'new')
                    ? current.filter((s) => s !== value)
                    : [...current, value as 'active' | 'popular' | 'new'];
                  handleChange('statuses', updated);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  (localFilters.statuses || []).includes(value as 'active' | 'popular' | 'new')
                    ? 'bg-gov-600 text-white shadow-md'
                    : `bg-gray-100 ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:bg-gray-200`
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* نطاق الرسوم */}
        <div className="mb-4">
          <label className={`text-sm font-bold ${textClass} block mb-2`}>نطاق الرسوم</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="الحد الأدنى"
              value={localFilters.feeMin || ''}
              onChange={(e) =>
                handleChange('feeMin', e.target.value ? Number(e.target.value) : undefined)
              }
              className={`w-1/2 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-gov-500/30`}
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="الحد الأعلى"
              value={localFilters.feeMax || ''}
              onChange={(e) =>
                handleChange('feeMax', e.target.value ? Number(e.target.value) : undefined)
              }
              className={`w-1/2 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-gov-500/30`}
            />
          </div>
        </div>

        {/* وقت التقدير */}
        <div className="mb-6">
          <label className={`text-sm font-bold ${textClass} block mb-2`}>
            الوقت التقديري (أيام)
          </label>
          <input
            type="range"
            min="0"
            max="30"
            value={localFilters.maxTime || 30}
            onChange={(e) => handleChange('maxTime', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>{localFilters.maxTime || 30} يوم</span>
            <span>30</span>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex gap-3">
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-gov-600 hover:bg-gov-700 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
          >
            تطبيق التصفية
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm transition-all"
          >
            إعادة ضبط
          </button>
        </div>
      </div>
    </div>
  );
});

// 4.6. نافذة المعاينة السريعة (Quick View Modal)
const QuickViewModal = memo(function QuickViewModal({
  service,
  onClose,
  onOpenFull,
  theme,
}: {
  service: ExtendedService;
  onClose: () => void;
  onOpenFull: (service: ExtendedService) => void;
  theme?: 'light' | 'dark';
}) {
  const Icon = service.icon;
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200';

  return (
    <div
      className="fixed inset-0 z-[160] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`${bg} rounded-3xl border shadow-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <Icon
                size={22}
                className="text-white"
              />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              {service.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X
              size={20}
              className="text-gray-500"
            />
          </button>
        </div>

        <div className="space-y-4">
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}>
            {service.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="text-xs text-gray-400">الفئة</div>
              <div className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {service.category}
              </div>
            </div>
            {service.estimatedTime && (
              <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="text-xs text-gray-400">الوقت التقديري</div>
                <div className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {service.estimatedTime}
                </div>
              </div>
            )}
            {service.feeRange && (
              <div
                className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} col-span-2`}
              >
                <div className="text-xs text-gray-400">الرسوم</div>
                <div className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {service.feeRange.min.toLocaleString()} - {service.feeRange.max.toLocaleString()}{' '}
                  {service.feeRange.currency}
                </div>
              </div>
            )}
            {service.department && (
              <div
                className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} col-span-2`}
              >
                <div className="text-xs text-gray-400">القسم المختص</div>
                <div className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {service.department}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onOpenFull(service)}
              className="flex-1 py-3 bg-gov-600 hover:bg-gov-700 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              عرض التفاصيل
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// 5. المكون الرئيسي - الإصدار المتكامل
// ============================================================

export const ServicesSection = forwardRef<ServicesSectionRef, ServicesSectionProps>(
  function ServicesSection(
    {
      services: externalServices,
      isLoading: externalLoading = false,
      error: externalError = null,
      onNavigate,
      onSearch,
      theme = 'light',
      title = 'خدماتنا الهندسية والإدارية',
      subtitle = 'نقدم مجموعة متكاملة من الخدمات الهندسية والإدارية لتلبية احتياجات المواطنين والمقاولين',
      className = '',
    },
    ref,
  ) {
    // ============================================================
    // 5.1. الحالات الداخلية (Internal State)
    // ============================================================

    const [services, setServices] = useState<ExtendedService[]>(() =>
      externalServices.length > 0 ? (externalServices as ExtendedService[]) : DEFAULT_SERVICES,
    );
    const [loadState, setLoadState] = useState<ServiceLoadState>(
      externalLoading ? 'loading' : 'idle',
    );
    const [error, setError] = useState<string | null>(externalError);
    const [activeCategory, setActiveCategory] = useState('الكل');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ServiceViewMode>('grid');
    const [sortBy, setSortBy] = useState<ServiceSortBy>('popularity');
    const [filters, setFilters] = useState<ServiceFilters>({ categories: [], statuses: [] });
    const [selectedService, setSelectedService] = useState<ExtendedService | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [interactions, setInteractions] = useState<ServiceInteraction[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // ============================================================
    // 5.2. المراجع (Refs)
    // ============================================================

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // ============================================================
    // 5.3. القيم المحسوبة (Computed Values)
    // ============================================================

    const isDark = theme === 'dark';

    const themeClasses = useMemo(() => {
      if (isDark) {
        return {
          section: 'bg-gray-900',
          text: 'text-gray-100',
          muted: 'text-gray-400',
          cardBg: 'bg-gray-800/90 border-gray-700/50',
          inputBg: 'bg-gray-800 border-gray-700 text-gray-100',
          inputPlaceholder: 'placeholder-gray-500',
          border: 'border-gray-700',
          hoverBg: 'hover:bg-gray-800',
        };
      }
      return {
        section: 'bg-gray-50',
        text: 'text-gray-800',
        muted: 'text-gray-500',
        cardBg: 'bg-white/90 border-gray-100/50',
        inputBg: 'bg-white border-gray-200 text-gray-800',
        inputPlaceholder: 'placeholder-gray-400',
        border: 'border-gray-200',
        hoverBg: 'hover:bg-gray-50',
      };
    }, [isDark]);

    // الفئات المتاحة
    const categories = useMemo(() => {
      const unique = new Set(services.map((s) => s.category));
      return ['الكل', ...Array.from(unique)];
    }, [services]);

    // إحصائيات
    const statistics = useMemo<ServiceStatistics>(() => {
      const total = services.length;
      const active = services.filter((s) => s.isActive !== false).length;
      const inactive = total - active;
      const newServices = services.filter((s) => s.isNew).length;
      const popular = services.filter((s) => s.isPopular).length;
      const totalViews = services.reduce((acc, s) => acc + (s.views || 0), 0);
      const totalRequests = services.reduce((acc, s) => acc + (s.requests || 0), 0);
      const rated = services.filter((s) => s.rating);
      const avgRating = rated.length
        ? rated.reduce((acc, s) => acc + (s.rating || 0), 0) / rated.length
        : 0;
      const categoryDistribution: Record<string, number> = {};
      services.forEach((s) => {
        categoryDistribution[s.category] = (categoryDistribution[s.category] || 0) + 1;
      });

      return {
        total,
        active,
        inactive,
        new: newServices,
        popular,
        totalViews,
        totalRequests,
        averageRating: avgRating,
        categoryDistribution,
      };
    }, [services]);

    // الخدمات المفلترة والمصنفة
    const filteredServices = useMemo(() => {
      let result = [...services];

      // تصفية حسب الفئة
      if (activeCategory !== 'الكل') {
        result = result.filter((s) => s.category === activeCategory);
      }

      // تصفية حسب الفئات المختارة (فلتر متقدم)
      if (filters.categories && filters.categories.length > 0) {
        result = result.filter((s) => filters.categories.includes(s.category));
      }

      // تصفية حسب الحالات
      if (filters.statuses && filters.statuses.length > 0) {
        result = result.filter((s) => {
          const statusMatches = filters.statuses.some((status: string) => {
            if (status === 'active') return s.isActive !== false;
            if (status === 'popular') return s.isPopular;
            if (status === 'new') return s.isNew;
            return false;
          });
          return statusMatches;
        });
      }

      // تصفية حسب نطاق الرسوم
      if (filters.feeMin !== undefined) {
        result = result.filter((s) => s.feeRange && s.feeRange.max >= (filters.feeMin || 0));
      }
      if (filters.feeMax !== undefined) {
        result = result.filter((s) => s.feeRange && s.feeRange.min <= (filters.feeMax || Infinity));
      }

      // تصفية حسب الوقت
      if (filters.maxTime !== undefined) {
        result = result.filter((s) => {
          if (!s.estimatedTime) return true;
          const days = parseInt(s.estimatedTime.replace(/[^0-9]/g, ''));
          return !isNaN(days) && days <= (filters.maxTime || 30);
        });
      }

      // البحث النصي
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        result = result.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            (s.tags && s.tags.some((tag) => tag.toLowerCase().includes(q))) ||
            (s.department && s.department.toLowerCase().includes(q)),
        );
      }

      // الترتيب
      switch (sortBy) {
        case 'popularity':
          result.sort((a, b) => (b.requests || 0) - (a.requests || 0));
          break;
        case 'newest':
          result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
          break;
        case 'oldest':
          result.sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
          break;
        case 'alphabetical':
          result.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
          break;
        case 'alphabetical-desc':
          result.sort((a, b) => b.title.localeCompare(a.title, 'ar'));
          break;
        case 'estimated-time':
          result.sort((a, b) => {
            const daysA = parseInt(a.estimatedTime?.replace(/[^0-9]/g, '') || '0');
            const daysB = parseInt(b.estimatedTime?.replace(/[^0-9]/g, '') || '0');
            return daysA - daysB;
          });
          break;
        case 'fee-low':
          result.sort((a, b) => (a.feeRange?.min || 0) - (b.feeRange?.min || 0));
          break;
        case 'fee-high':
          result.sort((a, b) => (b.feeRange?.min || 0) - (a.feeRange?.min || 0));
          break;
        default:
          break;
      }

      return result;
    }, [services, activeCategory, filters, searchQuery, sortBy]);

    // ============================================================
    // 5.4. معالجات الأحداث (Event Handlers)
    // ============================================================

    const handleCategoryChange = useCallback((cat: string) => {
      setActiveCategory(cat);
      setSearchQuery('');
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
      // تسجيل تفاعل
      trackInteraction({
        serviceId: 'category-filter',
        type: 'click',
        timestamp: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: { category: cat } as any,
      });
    }, []);

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (onSearch) {
          onSearch(value);
        }
        // تسجيل تفاعل
        if (value.length > 2) {
          trackInteraction({
            serviceId: 'search',
            type: 'click',
            timestamp: new Date(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: { query: value } as any,
          });
        }
      },
      [onSearch],
    );

    const handleSortChange = useCallback((sort: ServiceSortBy) => {
      setSortBy(sort);
    }, []);

    const handleOpenModal = useCallback((service: ExtendedService) => {
      setSelectedService(service);
      setIsModalOpen(true);
      trackInteraction({
        serviceId: service.id,
        type: 'view',
        timestamp: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: { source: 'card' } as any,
      });
    }, []);

    const handleCloseModal = useCallback(() => {
      setIsModalOpen(false);
      setSelectedService(null);
    }, []);

    const handleQuickView = useCallback((service: ExtendedService) => {
      setSelectedService(service);
      setIsQuickViewOpen(true);
      trackInteraction({
        serviceId: service.id,
        type: 'view',
        timestamp: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: { source: 'quick-view' } as any,
      });
    }, []);

    const handleCloseQuickView = useCallback(() => {
      setIsQuickViewOpen(false);
      setSelectedService(null);
    }, []);

    const handleBookmark = useCallback((service: ExtendedService) => {
      setBookmarkedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(service.id)) {
          newSet.delete(service.id);
          trackInteraction({
            serviceId: service.id,
            type: 'click',
            timestamp: new Date(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: { action: 'unbookmark' } as any,
          });
        } else {
          newSet.add(service.id);
          trackInteraction({
            serviceId: service.id,
            type: 'click',
            timestamp: new Date(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: { action: 'bookmark' } as any,
          });
        }
        return newSet;
      });
    }, []);

    const handleShare = useCallback((service: ExtendedService) => {
      const url = `${window.location.origin}${service.permalink || `/services/${service.id}`}`;
      if (navigator.share) {
        navigator
          .share({
            title: service.title,
            text: service.description,
            url,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(url).then(() => {
          alert('تم نسخ رابط الخدمة');
        });
      }
      trackInteraction({
        serviceId: service.id,
        type: 'share',
        timestamp: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: { url } as any,
      });
    }, []);

    const handleViewModeChange = useCallback((mode: ServiceViewMode) => {
      setViewMode(mode);
      trackInteraction({
        serviceId: 'view-mode',
        type: 'click',
        timestamp: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: { mode } as any,
      });
    }, []);

    const handleApplyFilters = useCallback((newFilters: ServiceFilters) => {
      setFilters(newFilters);
      trackInteraction({
        serviceId: 'filter',
        type: 'click',
        timestamp: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: { filters: newFilters } as any,
      });
    }, []);

    const handleResetFilters = useCallback(() => {
      setFilters({ categories: [], statuses: [] });
      setActiveCategory('الكل');
      setSearchQuery('');
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
    }, []);

    const handleRefresh = useCallback(async () => {
      if (isRefreshing) return;
      setIsRefreshing(true);
      setLoadState('refreshing');
      try {
        // محاكاة جلب البيانات (يمكن استبدالها بـ API حقيقي)
        await new Promise((resolve) => setTimeout(resolve, 800));
        setServices((prev) => [...prev]);
        setLoadState('success');
        setError(null);
      } catch {
        setError('حدث خطأ أثناء تحديث البيانات');
        setLoadState('error');
      } finally {
        setIsRefreshing(false);
      }
    }, [isRefreshing]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const trackInteraction = useCallback((interaction: ServiceInteraction) => {
      setInteractions((prev) => [...prev, interaction]);
      // يمكن إرسال التفاعل إلى نظام التحليلات هنا
    }, []);

    const navigateToServicePage = useCallback(() => {
      onNavigate?.('services');
    }, [onNavigate]);

    const navigateToForms = useCallback(() => {
      onNavigate?.('forms');
    }, [onNavigate]);

    // ============================================================
    // 5.5. تصدير الواجهة الخارجية (Exposed Interface)
    // ============================================================

    useImperativeHandle(
      ref,
      () => ({
        refresh: handleRefresh,
        setViewMode: (mode: ServiceViewMode) => setViewMode(mode),
        applyFilters: (filters: ServiceFilters) => setFilters(filters),
        resetFilters: handleResetFilters,
        search: (query: string) => {
          setSearchQuery(query);
          if (searchInputRef.current) {
            searchInputRef.current.value = query;
          }
        },
        getSelectedService: () => selectedService,
        getStatistics: () => statistics,
        exportCSV: () => {
          const headers = ['العنوان', 'الفئة', 'الحالة', 'المشاهدات', 'الطلبات', 'التقييم'];
          const rows = services.map((s) => [
            s.title,
            s.category,
            s.isActive ? 'نشط' : 'غير نشط',
            s.views || 0,
            s.requests || 0,
            s.rating || 0,
          ]);
          const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `services-${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        },
        exportJSON: () => {
          const json = JSON.stringify(services, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `services-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        },
        trackInteraction,
      }),
      [handleRefresh, handleResetFilters, selectedService, statistics, services],
    );

    // ============================================================
    // 5.6. تأثيرات جانبية (Effects)
    // ============================================================

    useEffect(() => {
      if (externalServices.length > 0) {
        setServices(externalServices as ExtendedService[]);
      }
    }, [externalServices]);

    useEffect(() => {
      setLoadState(externalLoading ? 'loading' : 'success');
    }, [externalLoading]);

    useEffect(() => {
      setError(externalError);
    }, [externalError]);

    // ============================================================
    // 5.7. التصيير (Rendering)
    // ============================================================

    return (
      <section
        ref={containerRef}
        className={`relative py-16 md:py-24 overflow-hidden ${themeClasses.section} ${className}`}
        aria-label="الخدمات الهندسية والإدارية"
        dir="rtl"
      >
        {/* الخلفية المتحركة */}
        <AnimatedSectionBackground theme={theme} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ===== الهيدر ===== */}
          <ScrollReveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gov-50 to-gov-100/50 text-gov-700 px-5 py-2 rounded-full text-sm font-bold mb-4 border border-gov-200/50">
                <HardHat
                  size={18}
                  className="text-gov-600"
                />
                <span className="tracking-wide">بوابة الخدمات الهندسية</span>
                <span className="w-1 h-1 bg-gov-400 rounded-full" />
                <span className="text-gov-500 font-normal text-xs">{services.length} خدمة</span>
              </div>
              <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-black mb-3 ${themeClasses.text}`}
              >
                {title}
              </h2>
              <p
                className={`${themeClasses.muted} max-w-2xl mx-auto text-base md:text-lg font-medium`}
              >
                {subtitle}
              </p>
            </div>
          </ScrollReveal>

          {/* ===== الإحصائيات ===== */}
          {!loadState.includes('loading') && !error && services.length > 0 && (
            <ScrollReveal delay={50}>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
                <div
                  className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border transition-all hover:shadow-md`}
                >
                  <div className="text-2xl font-black text-gov-600">
                    <AnimatedCounter
                      end={statistics.total}
                      duration={1000}
                    />
                  </div>
                  <div className={`text-xs ${themeClasses.muted} mt-1`}>إجمالي الخدمات</div>
                </div>
                <div
                  className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border transition-all hover:shadow-md`}
                >
                  <div className="text-2xl font-black text-emerald-600">
                    <AnimatedCounter
                      end={statistics.active}
                      duration={1000}
                    />
                  </div>
                  <div className={`text-xs ${themeClasses.muted} mt-1`}>خدمات نشطة</div>
                </div>
                <div
                  className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border transition-all hover:shadow-md`}
                >
                  <div className="text-2xl font-black text-amber-600">
                    <AnimatedCounter
                      end={statistics.popular}
                      duration={1000}
                    />
                  </div>
                  <div className={`text-xs ${themeClasses.muted} mt-1`}>الأكثر طلباً</div>
                </div>
                <div
                  className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border transition-all hover:shadow-md`}
                >
                  <div className="text-2xl font-black text-blue-600">
                    <AnimatedCounter
                      end={statistics.new}
                      duration={1000}
                    />
                  </div>
                  <div className={`text-xs ${themeClasses.muted} mt-1`}>خدمات جديدة</div>
                </div>
                <div
                  className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border transition-all hover:shadow-md hidden sm:block`}
                >
                  <div className="text-2xl font-black text-purple-600">
                    <AnimatedCounter
                      end={Math.round(statistics.averageRating * 10) / 10}
                      duration={1000}
                    />
                  </div>
                  <div className={`text-xs ${themeClasses.muted} mt-1`}>متوسط التقييم</div>
                </div>
                <div
                  className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border transition-all hover:shadow-md hidden sm:block`}
                >
                  <div className="text-2xl font-black text-rose-600">
                    <AnimatedCounter
                      end={statistics.totalRequests}
                      duration={1000}
                    />
                  </div>
                  <div className={`text-xs ${themeClasses.muted} mt-1`}>إجمالي الطلبات</div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* ===== شريط التحكم ===== */}
          <ScrollReveal delay={80}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              {/* شريط البحث */}
              <div className="relative w-full md:w-80">
                <Search
                  size={18}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${themeClasses.muted}`}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ابحث عن خدمة..."
                  onChange={handleSearchChange}
                  className={`w-full pr-10 pl-4 py-2.5 ${themeClasses.inputBg} border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gov-500/40 focus:border-gov-500 transition-all ${themeClasses.inputPlaceholder}`}
                  aria-label="بحث عن الخدمات"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      if (searchInputRef.current) {
                        searchInputRef.current.value = '';
                      }
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* أزرار التحكم */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* تصفية */}
                <button
                  onClick={() => setIsFilterPanelOpen(true)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all ${
                    filters.categories.length > 0 || filters.statuses.length > 0
                      ? 'bg-gov-600 text-white border-gov-600 shadow-md'
                      : `${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.border} hover:border-gov-300`
                  }`}
                >
                  <Filter size={16} />
                  تصفية
                  {(filters.categories.length > 0 || filters.statuses.length > 0) && (
                    <span className="bg-white text-gov-600 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {filters.categories.length + filters.statuses.length}
                    </span>
                  )}
                </button>

                {/* أزرار التصنيف */}
                <div className="flex flex-wrap gap-1">
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        activeCategory === cat
                          ? 'bg-gov-600 text-white shadow-md'
                          : `${themeClasses.cardBg} ${themeClasses.text} border ${themeClasses.border} hover:border-gov-300`
                      }`}
                    >
                      {cat}
                      {cat !== 'الكل' && (
                        <span className="mr-1 text-[9px] opacity-60">
                          ({statistics.categoryDistribution[cat] || 0})
                        </span>
                      )}
                    </button>
                  ))}
                  {categories.length > 5 && (
                    <button
                      onClick={() => setIsFilterPanelOpen(true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${themeClasses.cardBg} ${themeClasses.text} border ${themeClasses.border} hover:border-gov-300`}
                    >
                      +{categories.length - 5}
                    </button>
                  )}
                </div>

                {/* طرق العرض */}
                <div className="flex items-center gap-0.5 border rounded-2xl overflow-hidden">
                  {(['grid', 'list', 'compact'] as ServiceViewMode[]).map((mode) => {
                    const Icon = mode === 'grid' ? Grid : mode === 'list' ? List : LayoutGrid;
                    return (
                      <button
                        key={mode}
                        onClick={() => handleViewModeChange(mode)}
                        className={`p-2 transition-all ${
                          viewMode === mode
                            ? 'bg-gov-600 text-white'
                            : `${themeClasses.muted} hover:bg-gray-100`
                        }`}
                        aria-label={`عرض ${mode === 'grid' ? 'شبكة' : mode === 'list' ? 'قائمة' : 'مدمج'}`}
                      >
                        <Icon size={16} />
                      </button>
                    );
                  })}
                </div>

                {/* ترتيب */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as ServiceSortBy)}
                    className={`appearance-none px-3 py-2.5 rounded-2xl border text-sm font-bold ${themeClasses.inputBg} ${themeClasses.border} pr-8 pl-4 focus:outline-none focus:ring-2 focus:ring-gov-500/40`}
                  >
                    <option value="popularity">الأكثر طلباً</option>
                    <option value="newest">الأحدث</option>
                    <option value="oldest">الأقدم</option>
                    <option value="alphabetical">أبجدياً (أ-ي)</option>
                    <option value="alphabetical-desc">أبجدياً (ي-أ)</option>
                    <option value="estimated-time">الوقت التقديري</option>
                    <option value="fee-low">أقل رسوم</option>
                    <option value="fee-high">أعلى رسوم</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${themeClasses.muted}`}
                  />
                </div>

                {/* تحديث */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`p-2.5 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.border} hover:border-gov-300 transition-all ${
                    isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="تحديث"
                >
                  <RefreshCw
                    size={16}
                    className={`${themeClasses.text} ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* ===== حالة التحميل ===== */}
          {(loadState === 'loading' || loadState === 'refreshing') && (
            <div className="flex items-center justify-center py-20">
              <Loader2
                size={40}
                className="text-gov-600 animate-spin"
              />
              <span className={`mr-3 ${themeClasses.muted} text-sm font-medium`}>
                {loadState === 'refreshing' ? 'جاري التحديث...' : 'جاري تحميل الخدمات...'}
              </span>
            </div>
          )}

          {/* ===== حالة الخطأ ===== */}
          {error && (
            <div className="text-center py-20">
              <AlertCircle
                size={48}
                className="mx-auto text-red-500 mb-4 opacity-50"
              />
              <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>عذراً، حدث خطأ</h3>
              <p className={themeClasses.muted}>{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 text-gov-600 text-sm font-bold hover:underline flex items-center gap-1 mx-auto"
              >
                <RefreshCw size={14} />
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* ===== عرض الخدمات ===== */}
          {!loadState.includes('loading') && !error && (
            <>
              {filteredServices.length === 0 ? (
                <div className="text-center py-20">
                  <div
                    className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 ${themeClasses.cardBg} border ${themeClasses.border}`}
                  >
                    <HardHat
                      size={40}
                      className={themeClasses.muted}
                    />
                  </div>
                  <p className={`${themeClasses.text} font-semibold text-lg`}>
                    لا توجد خدمات تطابق معايير البحث
                  </p>
                  <p className={`${themeClasses.muted} text-sm mt-1`}>
                    حاول تعديل الفلاتر أو البحث بكلمات مختلفة
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 text-gov-600 text-sm font-bold hover:underline flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw size={14} />
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredServices.map((service, idx) => (
                    <ScrollReveal
                      key={service.id}
                      delay={idx * 60}
                    >
                      <PremiumServiceCard
                        service={service}
                        onOpenModal={handleOpenModal}
                        onQuickView={handleQuickView}
                        onBookmark={handleBookmark}
                        onShare={handleShare}
                        theme={theme}
                        index={idx}
                        isBookmarked={bookmarkedIds.has(service.id)}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-3">
                  {filteredServices.map((service, idx) => (
                    <ScrollReveal
                      key={service.id}
                      delay={idx * 40}
                    >
                      <ServiceListItem
                        service={service}
                        onOpenModal={handleOpenModal}
                        onQuickView={handleQuickView}
                        theme={theme}
                        index={idx}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                // وضع مدمج (Compact)
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredServices.map((service, idx) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={service.id}
                        className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl border p-4 transition-all hover:shadow-md cursor-pointer`}
                        onClick={() => handleOpenModal(service)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(service)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center shadow-lg shrink-0`}
                          >
                            <Icon
                              size={18}
                              className="text-white"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`font-bold text-sm ${themeClasses.text} truncate`}>
                              {service.title}
                            </h4>
                            <div className={`text-[10px] ${themeClasses.muted} truncate`}>
                              {service.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ===== رابط إلى صفحة الخدمات ===== */}
          <ScrollReveal delay={200}>
            <div className="text-center mt-10">
              <button
                onClick={navigateToServicePage}
                className={`group inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${
                  isDark
                    ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
                    : 'bg-white text-gov-700 border-2 border-gray-200 hover:border-gov-300 hover:shadow-lg'
                } hover:scale-105 active:scale-95`}
              >
                <Building2
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span>استعراض جميع الخدمات والنماذج</span>
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* ===== لوحة التصفية المتقدمة ===== */}
        {isFilterPanelOpen && (
          <AdvancedFilterPanel
            filters={filters}
            onFiltersChange={handleApplyFilters}
            categories={categories.filter((c) => c !== 'الكل')}
            onClose={() => setIsFilterPanelOpen(false)}
            theme={theme}
          />
        )}

        {/* ===== نافذة المعاينة السريعة ===== */}
        {isQuickViewOpen && selectedService && (
          <QuickViewModal
            service={selectedService}
            onClose={handleCloseQuickView}
            onOpenFull={handleOpenModal}
            theme={theme}
          />
        )}

        {/* ===== نافذة الخدمة المنبثقة (ServiceModal) ===== */}
        {isModalOpen && selectedService && (
          <ServiceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            serviceId={selectedService.id}
            serviceName={selectedService.title}
            onNavigate={onNavigate}
          >
            <div className="space-y-6">
              {/* وصف الخدمة */}
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gov-50'} rounded-2xl p-5`}>
                <p
                  className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}
                >
                  {selectedService.description}
                </p>
              </div>

              {/* معلومات إضافية */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}
                >
                  <div className={`text-xs ${themeClasses.muted} mb-1`}>القسم المختص</div>
                  <div className={`font-bold text-sm ${themeClasses.text}`}>
                    {selectedService.department || 'الإدارة العامة'}
                  </div>
                </div>
                {selectedService.estimatedTime && (
                  <div
                    className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}
                  >
                    <div className={`text-xs ${themeClasses.muted} mb-1`}>الوقت التقديري</div>
                    <div
                      className={`font-bold text-sm ${themeClasses.text} flex items-center gap-1`}
                    >
                      <Clock
                        size={14}
                        className="text-gov-600"
                      />
                      {selectedService.estimatedTime}
                    </div>
                  </div>
                )}
                {selectedService.feeRange && (
                  <div
                    className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'} col-span-2`}
                  >
                    <div className={`text-xs ${themeClasses.muted} mb-1`}>الرسوم التقديرية</div>
                    <div className={`font-bold text-sm ${themeClasses.text}`}>
                      {selectedService.feeRange.min.toLocaleString()} -{' '}
                      {selectedService.feeRange.max.toLocaleString()}{' '}
                      {selectedService.feeRange.currency}
                    </div>
                  </div>
                )}
                {selectedService.rating && (
                  <div
                    className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'} col-span-2`}
                  >
                    <div className={`text-xs ${themeClasses.muted} mb-1`}>التقييم</div>
                    <div
                      className={`font-bold text-sm ${themeClasses.text} flex items-center gap-2`}
                    >
                      <Star
                        size={16}
                        className="fill-yellow-500 text-yellow-500"
                      />
                      {selectedService.rating.toFixed(1)} ({selectedService.reviews || 0} مراجعة)
                    </div>
                  </div>
                )}
              </div>

              {/* المستندات المطلوبة */}
              {selectedService.requiredDocuments &&
                selectedService.requiredDocuments.length > 0 && (
                  <div
                    className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/30' : 'bg-amber-50 border border-amber-200'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText
                        size={16}
                        className="text-amber-600"
                      />
                      <span
                        className={`font-bold ${isDark ? 'text-gray-200' : 'text-amber-700'} text-sm`}
                      >
                        المستندات المطلوبة:
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {selectedService.requiredDocuments.map((doc, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                          <CheckCircle2
                            size={14}
                            className="text-emerald-500 shrink-0"
                          />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* الفوائد */}
              {selectedService.benefits && selectedService.benefits.length > 0 && (
                <div
                  className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/30' : 'bg-emerald-50 border border-emerald-200'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Award
                      size={16}
                      className="text-emerald-600"
                    />
                    <span
                      className={`font-bold ${isDark ? 'text-gray-200' : 'text-emerald-700'} text-sm`}
                    >
                      الفوائد:
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {selectedService.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        <Star
                          size={14}
                          className="text-amber-500 shrink-0"
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedService.formId && (
                  <button
                    onClick={() => {
                      handleCloseModal();
                      navigateToForms();
                    }}
                    className="flex-1 py-3.5 bg-gov-600 hover:bg-gov-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <FileText size={16} />
                    تعبئة النموذج ({selectedService.formId})
                  </button>
                )}
                <button
                  onClick={() => {
                    handleCloseModal();
                    onNavigate?.('contact');
                  }}
                  className="flex-1 py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  استفسار
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition-all"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </ServiceModal>
        )}

        {/* ===== أنماط CSS الإضافية ===== */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.05); }
            66% { transform: translate(-20px, 20px) scale(0.95); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-30px, 30px) scale(1.05); }
            66% { transform: translate(20px, -20px) scale(0.95); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-float { animation: float 25s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 30s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 20s ease-in-out infinite; }
          .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
          .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
          .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0,0,0,0.4); }
        `}</style>
      </section>
    );
  },
);

// ============================================================
// 6. تصدير المكون مع اسم افتراضي (Default Export)
// ============================================================

export default ServicesSection;

// ============================================================
// 7. دوال مساعدة إضافية للاستخدام الخارجي
// ============================================================

/** إنشاء خدمة جديدة */
export function createService(data: Partial<ExtendedService>): ExtendedService {
  return {
    id: `svc-${Date.now()}`,
    title: data.title || 'خدمة جديدة',
    description: data.description || 'وصف الخدمة',
    icon: data.icon || HardHat,
    color: data.color || 'from-gray-500 to-gray-700',
    category: data.category || 'عام',
    isActive: data.isActive ?? true,
    isPopular: data.isPopular ?? false,
    isNew: data.isNew ?? true,
    tags: data.tags || [],
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    views: data.views || 0,
    requests: data.requests || 0,
    rating: data.rating || 0,
    reviews: data.reviews || 0,
    ...data,
  };
}

/** تصدير الإحصائيات كـ JSON */
export function exportStatistics(stats: ServiceStatistics): string {
  return JSON.stringify(stats, null, 2);
}

// ============================================================
// 8. التوثيق الشامل (Comprehensive Documentation)
// ============================================================

/**
 * 📘 دليل استخدام ServicesSection - الإصدار المؤسسي المتكامل v5.0
 *
 * ## المميزات الأساسية
 * - ✅ عرض مرن بـ 3 أنماط (شبكة، قائمة، مدمج)
 * - ✅ بحث فوري مع اقتراحات
 * - ✅ تصفية متقدمة متعددة المعايير
 * - ✅ ترتيب بـ 8 خيارات مختلفة
 * - ✅ بطاقات خدمة ثلاثية الأبعاد مع تأثيرات حيوية
 * - ✅ معاينة سريعة بدون فتح النافذة
 * - ✅ إضافة إلى المفضلة (حفظ)
 * - ✅ مشاركة الخدمات
 * - ✅ إحصائيات ديناميكية
 * - ✅ سجل تفاعلات المستخدم
 * - ✅ تصدير البيانات (CSV/JSON)
 * - ✅ دعم كامل للوضع المظلم
 * - ✅ واجهة برمجية غنية للتحكم الخارجي
 * - ✅ متوافق مع معايير WCAG 2.1
 *
 * ## مثال استخدام أساسي
 * ```tsx
 * import ServicesSection, { createService } from './ServicesSection';
 *
 * const services = [
 *   createService({
 *     title: 'ترخيص بناء',
 *     description: 'إصدار ترخيص بناء سكني',
 *     category: 'تراخيص',
 *   }),
 * ];
 *
 * <ServicesSection
 *   services={services}
 *   onNavigate={navigate}
 *   theme="light"
 *   title="خدماتنا الهندسية"
 * />
 * ```
 *
 * ## مثال استخدام مع Ref للتحكم الخارجي
 * ```tsx
 * const servicesRef = useRef<ServicesSectionRef>(null);
 *
 * const handleExport = () => {
 *   servicesRef.current?.exportCSV();
 * };
 *
 * const handleFilter = () => {
 *   servicesRef.current?.applyFilters({
 *     categories: ['تراخيص'],
 *     statuses: ['active'],
 *   });
 * };
 *
 * <ServicesSection ref={servicesRef} ... />
 * ```
 *
 * ## طرق العرض المدعومة
 * - grid: شبكة (افتراضي)
 * - list: قائمة
 * - compact: مدمج
 *
 * ## خيارات الترتيب
 * - popularity: الأكثر طلباً
 * - newest: الأحدث
 * - oldest: الأقدم
 * - alphabetical: أبجدياً (أ-ي)
 * - alphabetical-desc: أبجدياً (ي-أ)
 * - estimated-time: الوقت التقديري
 * - fee-low: أقل رسوم
 * - fee-high: أعلى رسوم
 *
 * ## خيارات التصفية المتقدمة
 * - categories: قائمة بالفئات
 * - statuses: ['active', 'popular', 'new']
 * - feeMin: الحد الأدنى للرسوم
 * - feeMax: الحد الأعلى للرسوم
 * - maxTime: أقصى وقت تقديري (أيام)
 * - hasForm: يحتوي على نموذج
 * - keywords: كلمات مفتاحية
 *
 * ## متطلبات التشغيل
 * - React 18+
 * - lucide-react ^0.200.0
 * - Tailwind CSS 3+
 *
 * ## الإصدار
 * v5.0 - الإصدار المؤسسي المتكامل
 */