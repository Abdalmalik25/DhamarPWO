// ============================================================
// src/pages/home/homeData.ts - البيانات والثوابت (نسخة مؤسسية)
// ============================================================

import type { Page } from '../../types/page';
import {
  FileText,
  ClipboardCheck,
  Hammer,
  Construction,
  AlertCircle,
  Briefcase,
  Heart,
  Store,
  FlaskConical,
  Users,
  Award,
  Home,
  Factory,
  Trees,
  School,
  Building2,
  HardHat,
  TrendingUp,
  Phone,
  Lightbulb,
  BookOpen,
  CheckCircle,
  Info,
  Scale,
  Truck,
} from 'lucide-react';

// ============================================================
// تعريفات الأنواع
// ============================================================

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: Page;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'high' | 'normal' | 'low';
  category?: string;
  isPinned?: boolean;
  expiresAt?: string;
  views?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: 'general' | 'procedural' | 'legal';
  isPopular?: boolean;
}

export interface Guideline {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category?:
    | 'residential'
    | 'commercial'
    | 'industrial'
    | 'agricultural'
    | 'educational'
    | 'health';
  isPopular?: boolean;
  isNew?: boolean;
  estimatedTime?: string;
  views?: number;
  downloads?: number;
}

export interface FormPreview {
  ref: string;
  title: string;
  desc: string;
  category: string;
  isActive?: boolean;
  updatedAt?: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon: React.ElementType;
  suffix: string;
  color: string;
  description?: string;
}

export interface QuickLink {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: Page;
  color: string;
}

// ============================================================
// البيانات الاحتياطية - الخدمات (محتوى مؤسسي رسمي)
// ============================================================

export const FALLBACK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'تراخيص البناء والتعديل',
    description:
      'إصدار تراخيص البناء الجديدة والتجديد والتعديل والهدم وفقاً لقانون تنظيم البناء النافذ.',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    href: 'forms',
    category: 'تراخيص',
    isPopular: true,
  },
  {
    id: '2',
    title: 'اعتماد المخططات الهندسية',
    description:
      'مراجعة واعتماد المخططات المعمارية والإنشائية والميكانيكية والكهربائية المقدمة من المكاتب الاستشارية المرخصة.',
    icon: ClipboardCheck,
    color: 'from-emerald-500 to-emerald-600',
    href: 'forms',
    category: 'اعتماد',
    isPopular: true,
  },
  {
    id: '3',
    title: 'المعاينات الميدانية',
    description:
      'تكليف لجان فنية متخصصة للمعاينة الميدانية وفحص المواقع للتأكد من مطابقة التنفيذ للمخططات المعتمدة.',
    icon: Hammer,
    color: 'from-amber-500 to-amber-600',
    href: 'forms',
    category: 'معاينات',
  },
  {
    id: '4',
    title: 'تصاريح الحفريات والطرق',
    description:
      'منح تصاريح الحفر وأعمال البنية التحتية والطرق مع الالتزام باشتراطات السلامة العامة.',
    icon: Construction,
    color: 'from-purple-500 to-purple-600',
    href: 'forms',
    category: 'تصاريح',
  },
  {
    id: '5',
    title: 'الإفادات الفنية',
    description: 'إصدار إفادات فنية هندسية للجهات الرسمية والخاصة وفقاً للوائح المعتمدة.',
    icon: ClipboardCheck,
    color: 'from-rose-500 to-rose-600',
    href: 'forms',
    category: 'إفادات',
  },
  {
    id: '6',
    title: 'الشكاوى والتظلمات',
    description:
      'استقبال الشكاوى والتظلمات حول القرارات الإدارية ومعالجتها وفق الإجراءات النظامية.',
    icon: AlertCircle,
    color: 'from-sky-500 to-sky-600',
    href: 'forms',
    category: 'شكاوى',
  },
  {
    id: '7',
    title: 'تراخيص المهن والمحلات',
    description:
      'إصدار وتجديد تراخيص المحلات التجارية والمهن الحرفية والصناعية وفق اللوائح المنظمة.',
    icon: Briefcase,
    color: 'from-indigo-500 to-indigo-600',
    href: 'forms',
    category: 'تراخيص',
    isPopular: true,
  },
  {
    id: '8',
    title: 'البطاقات الصحية للمنشآت',
    description: 'إصدار بطاقات صحية للمنشآت الغذائية والتجارية وفقاً للاشتراطات الصحية المعتمدة.',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    href: 'forms',
    category: 'صحة',
  },
  {
    id: '9',
    title: 'تنظيم الأسواق والمواقف',
    description: 'تنظيم الأسواق والمواقف العامة وإزالة المخالفات بالتنسيق مع الجهات المعنية.',
    icon: Store,
    color: 'from-teal-500 to-teal-600',
    href: 'forms',
    category: 'تنظيم',
  },
  {
    id: '10',
    title: 'مراقبة جودة الخرسانة',
    description:
      'إجراء اختبارات الجودة للخرسانة ومراقبة مصانع الخرسانة الجاهزة ضمن المختبر المركزي.',
    icon: FlaskConical,
    color: 'from-orange-500 to-orange-600',
    href: 'forms',
    category: 'مختبرات',
  },
  {
    id: '11',
    title: 'ترخيص المكاتب الاستشارية',
    description: 'منح تراخيص مزاولة المهنة للمكاتب الاستشارية الهندسية وتصنيفها حسب التخصص.',
    icon: Building2,
    color: 'from-violet-500 to-violet-600',
    href: 'forms',
    category: 'تراخيص',
  },
  {
    id: '12',
    title: 'الاستشارات الفنية',
    description:
      'تقديم استشارات فنية للمواطنين حول اشتراطات البناء والارتدادات والإجراءات النظامية.',
    icon: Lightbulb,
    color: 'from-yellow-500 to-yellow-600',
    href: 'forms',
    category: 'استشارات',
  },
];

// ============================================================
// البيانات الاحتياطية - الإعلانات (محتوى مؤسسي رسمي)
// ============================================================

export const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'تفعيل نظام التتبع الإلكتروني للمعاملات',
    description:
      'تم تفعيل نظام التتبع الإلكتروني لجميع المعاملات الهندسية، يمكنكم متابعة طلباتكم عبر الموقع الرسمي باستخدام رقم التتبع المقدم عند تقديم المعاملة.',
    date: '2026-06-25',
    priority: 'high',
    category: 'رقمي',
    isPinned: true,
    views: 1520,
  },
  {
    id: '2',
    title: 'مشاريع رصف وبنية تحتية في مديرية مغرب عنس',
    description:
      'انطلاق أعمال رصف الطرق الرئيسية والفرعية في مديرية مغرب عنس بطول 12 كم ضمن خطة تطوير البنية التحتية للمحافظة للعام 2026.',
    date: '2026-06-20',
    priority: 'high',
    category: 'مشاريع',
    views: 890,
  },
  {
    id: '3',
    title: 'حملة توعوية حول مخالفات البناء',
    description:
      'ينظم المكتب حملة توعوية للمواطنين والمقاولين حول أهمية الالتزام بالتراخيص واشتراطات البناء حفاظاً على السلامة العامة والمظهر الحضاري.',
    date: '2026-06-15',
    priority: 'high',
    category: 'توعوي',
    views: 670,
  },
  {
    id: '4',
    title: 'تحديث الدليل الإرشادي للخدمات',
    description:
      'تم تحديث الدليل الإرشادي للخدمات الهندسية والإجراءات والرسوم المحدثة، يمكن تحميل النسخة الإلكترونية من صفحة الدلائل.',
    date: '2026-06-10',
    priority: 'normal',
    category: 'دليل',
    views: 430,
  },
  {
    id: '5',
    title: 'توسعة مركز خدمة الجمهور',
    description:
      'تم الانتهاء من المرحلة الأولى لتوسعة مركز خدمة الجمهور بإضافة شباك خدمة جديدة لتسريع إنهاء معاملات المواطنين.',
    date: '2026-06-05',
    priority: 'normal',
    category: 'خدمات',
    views: 380,
  },
  {
    id: '6',
    title: 'ورشة عمل حول السلامة المهنية',
    description:
      'دعوة المقاولين والمكاتب الاستشارية لحضور ورشة عمل حول اشتراطات السلامة المهنية في مواقع البناء يوم الثلاثاء الموافق 15 يوليو 2026.',
    date: '2026-06-01',
    priority: 'normal',
    category: 'تدريب',
    views: 290,
  },
  {
    id: '7',
    title: 'مبادرة التصالح مع مخالفات البناء',
    description:
      'أعلن المكتب عن مبادرة للتصالح مع مخالفات البناء وفقاً للضوابط القانونية المعتمدة ولمدة محدودة.',
    date: '2026-05-28',
    priority: 'normal',
    category: 'مبادرة',
    views: 510,
  },
];

// ============================================================
// البيانات الاحتياطية - الأسئلة الشائعة (محتوى مؤسسي رسمي)
// ============================================================

export const FALLBACK_FAQS: FAQ[] = [
  {
    id: '1',
    question: 'ما هي المستندات المطلوبة للحصول على ترخيص بناء جديد؟',
    answer:
      'تشترط اللوائح النظامية تقديم المستندات التالية لإصدار ترخيص بناء جديد: (1) صورة من البطاقة الشخصية سارية المفعول، (2) سند ملكية الأرض أو ما يثبت حق الانتفاع، (3) المخططات الهندسية المعتمدة من مكتب استشاري مرخص، (4) تقرير التربة للمشاريع التي تزيد عن 4 أدوار، (5) نموذج طلب الخدمة ن-1 مكتمل البيانات. ينصح بالاستعانة بمكتب استشاري معتمد لإعداد المخططات قبل التقديم.',
    category: 'general',
    isPopular: true,
  },
  {
    id: '2',
    question: 'كم تستغرق مدة إصدار ترخيص البناء؟',
    answer:
      'تتراوح مدة إصدار ترخيص البناء بين 5 إلى 15 يوم عمل من تاريخ تقديم الطلب مستوفياً جميع المستندات المطلوبة، وتختلف المدة حسب نوع الترخيص واكتمال المستندات والحاجة للمعاينة الميدانية.',
    category: 'general',
    isPopular: true,
  },
  {
    id: '3',
    question: 'كيف يمكن تتبع المعاملة إلكترونياً؟',
    answer:
      'يتيح الموقع الرسمي خدمة تتبع المعاملات إلكترونياً عبر إدخال رقم التتبع المقدم عند تقديم المعاملة، وتظهر الحالة خطوة بخطوة: قيد المراجعة، قيد المعاينة، قيد الاعتماد، تم الإصدار.',
    category: 'procedural',
    isPopular: true,
  },
  {
    id: '4',
    question: 'ما هي الرسوم النظامية للخدمات الهندسية؟',
    answer:
      'تحدد الرسوم وفقاً للائحة الرسوم المعتمدة من وزارة الأشغال العامة والطرق، وتشمل رسوم التراخيص ومراجعة المخططات والمعاينات والإفادات. يمكن الاطلاع على التفاصيل في الدليل الإرشادي.',
    category: 'legal',
  },
  {
    id: '5',
    question: 'كيف يتم الإبلاغ عن مخالفات البناء؟',
    answer:
      'يمكن الإبلاغ عن مخالفات البناء عبر تعبئة النموذج ن-6 في مركز خدمة الجمهور، أو الاتصال على الرقم الموحد 777-888-198، مع تقديم وصف دقيق للمخالفة وموقعها.',
    category: 'procedural',
  },
  {
    id: '6',
    question: 'ما هي إجراءات التظلم من القرارات الإدارية؟',
    answer:
      'يحق للمواطن التظلم من القرارات الإدارية خلال 30 يوماً من تاريخ الإشعار، عبر تقديم طلب التظلم (نموذج ن-7) مرفقاً بالمستندات الداعمة إلى لجنة التظلمات المختصة، التي تبت في الطلب خلال 15 يوم عمل.',
    category: 'legal',
  },
  {
    id: '7',
    question: 'ما هي ساعات العمل الرسمية؟',
    answer:
      'أوقات العمل الرسمية من السبت إلى الأربعاء من 8:00 صباحاً حتى 3:00 مساءً، ويغلق المكتب يومي الخميس والجمعة. يمكن حجز موعد مسبق عبر الاتصال على 777-888-198.',
    category: 'general',
  },
  {
    id: '8',
    question: 'ما هي اشتراطات السلامة في مواقع البناء؟',
    answer:
      'تشترط اللوائح الفنية توفير اشتراطات السلامة المهنية في مواقع البناء، وتشمل: سور الموقع، خوذات السلامة، شبكات الأمان، طفايات الحريق، وصندوق الإسعافات الأولية، والتزام المقاول بتنفيذها.',
    category: 'legal',
  },
  {
    id: '9',
    question: 'كيف يمكن الحصول على البطاقة الصحية للمنشآت؟',
    answer:
      'يتم التقدم بطلب البطاقة الصحية عبر النموذج ن-7 بعد الحصول على ترخيص تشغيل المنشأة، مرفقاً بالشهادات الصحية للعاملين وتقرير صحي معتمد، وتخضع المنشأة للمعاينة الميدانية.',
    category: 'procedural',
  },
  {
    id: '10',
    question: 'ما هي الفئات المعفاة من رسوم التراخيص؟',
    answer:
      'تشمل الفئات المعفاة من رسوم التراخيص بحسب اللائحة: مشاريع الجمعيات الخيرية، دور العبادة، المدارس والمستشفيات الحكومية، ومشاريع الإسكان الاجتماعي، وفقاً للضوابط المعتمدة.',
    category: 'legal',
  },
];

// ============================================================
// البيانات الاحتياطية - الإرشادات
// ============================================================

export const FALLBACK_GUIDELINES: Guideline[] = [
  {
    id: '1',
    title: 'المنشآت السكنية',
    description: 'إرشادات تراخيص البناء للمنازل السكنية والارتدادات حسب التصنيف العمراني.',
    icon: Home,
    color: 'bg-blue-500',
    category: 'residential',
    isPopular: true,
    views: 450,
    downloads: 120,
  },
  {
    id: '2',
    title: 'المنشآت التجارية',
    description: 'اشتراطات تراخيص المحلات التجارية والأسواق والمراكز التجارية.',
    icon: Store,
    color: 'bg-amber-500',
    category: 'commercial',
    isPopular: true,
    views: 380,
    downloads: 95,
  },
  {
    id: '3',
    title: 'المنشآت الصناعية',
    description: 'معايير تراخيص المصانع والمنشآت الصناعية واشتراطات الموقع والسلامة.',
    icon: Factory,
    color: 'bg-purple-500',
    category: 'industrial',
    isNew: true,
    views: 210,
    downloads: 45,
  },
  {
    id: '4',
    title: 'المنشآت الزراعية',
    description: 'إرشادات تراخيص المنشآت الزراعية والصوبات والمشاريع السمكية.',
    icon: Trees,
    color: 'bg-green-500',
    category: 'agricultural',
    views: 180,
    downloads: 40,
  },
  {
    id: '5',
    title: 'المنشآت التعليمية',
    description: 'اشتراطات تراخيص المدارس والجامعات والمعاهد التعليمية.',
    icon: School,
    color: 'bg-teal-500',
    category: 'educational',
    isPopular: true,
    views: 320,
    downloads: 88,
  },
  {
    id: '6',
    title: 'المنشآت الصحية',
    description: 'معايير تراخيص المستشفيات والمراكز الصحية والمختبرات.',
    icon: Heart,
    color: 'bg-rose-500',
    category: 'health',
    views: 250,
    downloads: 65,
  },
  {
    id: '7',
    title: 'الدليل الإرشادي الشامل',
    description: 'الدليل الكامل لجميع الخدمات الهندسية والإجراءات والرسوم المعتمدة.',
    icon: BookOpen,
    color: 'bg-indigo-500',
    category: 'residential',
    isPopular: true,
    isNew: true,
    views: 1200,
    downloads: 340,
    estimatedTime: '5-10 دقائق',
  },
];

// ============================================================
// البيانات الاحتياطية - النماذج
// ============================================================

export const FALLBACK_FORMS: FormPreview[] = [
  {
    ref: 'ن-1',
    title: 'طلب خدمة هندسية موحد (تراخيص)',
    desc: 'لطلب تراخيص البناء والتجديد والتعديل والهدم',
    category: 'تراخيص',
    isActive: true,
    updatedAt: '2026-01-01',
  },
  {
    ref: 'ن-2',
    title: 'مراجعة واعتماد المخططات الهندسية',
    desc: 'لتقديم المخططات المعمارية والإنشائية والميكانيكية والكهربائية',
    category: 'اعتماد',
    isActive: true,
    updatedAt: '2026-01-15',
  },
  {
    ref: 'ن-3',
    title: 'طلب تكليف لجنة معاينة ميدانية',
    desc: 'لطلب النزول الميداني لمعاينة الموقع',
    category: 'معاينات',
    isActive: true,
    updatedAt: '2026-02-01',
  },
  {
    ref: 'ن-4',
    title: 'تصريح أعمال طرق وحفريات',
    desc: 'لاستئذان الحفر وأعمال البنية التحتية',
    category: 'تصاريح',
    isActive: true,
    updatedAt: '2026-02-15',
  },
  {
    ref: 'ن-5',
    title: 'طلب ترخيص مهن ومحلات',
    desc: 'لإصدار وتجديد تراخيص المحلات والمهن',
    category: 'تراخيص',
    isActive: true,
    updatedAt: '2026-03-01',
  },
  {
    ref: 'ن-6',
    title: 'بلاغ عن مخالفة بناء',
    desc: 'لتقديم بلاغ عن مخالفات البناء والتعديات',
    category: 'شكاوى',
    isActive: true,
    updatedAt: '2026-03-15',
  },
  {
    ref: 'ن-7',
    title: 'طلب بطاقة صحية للمنشآت',
    desc: 'لإصدار وتجديد بطاقات صحية للمنشآت الغذائية',
    category: 'صحة',
    isActive: true,
    updatedAt: '2026-04-01',
  },
  {
    ref: 'ن-8',
    title: 'طلب تصريح نشاط تجاري',
    desc: 'لإصدار تصاريح الأسواق والمحلات',
    category: 'تنظيم',
    isActive: true,
    updatedAt: '2026-04-15',
  },
  {
    ref: 'ن-9',
    title: 'طلب تظلم وإعادة نظر',
    desc: 'للاعتراض على القرارات الإدارية والغرامات',
    category: 'شكاوى',
    isActive: true,
    updatedAt: '2026-05-01',
  },
  {
    ref: 'ن-10',
    title: 'طلب إفادة فنية',
    desc: 'لإصدار إفادات فنية للجهات الرسمية والخاصة',
    category: 'إفادات',
    isActive: true,
    updatedAt: '2026-05-15',
  },
];

// ============================================================
// البيانات الاحتياطية - الإحصائيات
// ============================================================

export const FALLBACK_STATS: Stat[] = [
  {
    id: '1',
    value: '4,131',
    label: 'رخصة بناء',
    icon: ClipboardCheck,
    suffix: '+',
    color: 'blue',
    description: 'صدرت منذ التأسيس',
  },
  {
    id: '2',
    value: '120',
    label: 'كادر متخصص',
    icon: Users,
    suffix: '+',
    color: 'amber',
    description: 'مهندسين وفنيين',
  },
  {
    id: '3',
    value: '1.7B',
    label: 'ريال مشاريع',
    icon: TrendingUp,
    suffix: '+',
    color: 'rose',
    description: 'قيمة المشاريع المنفذة',
  },
  {
    id: '4',
    value: '18',
    label: 'سنة خدمة',
    icon: Award,
    suffix: '',
    color: 'teal',
    description: 'منذ التأسيس',
  },
];

// ============================================================
// البيانات الاحتياطية - المحتوى التوعوي الهندسي المؤسسي
// ============================================================

export interface AwarenessContent {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'safety' | 'quality' | 'environment' | 'legal' | 'community';
  tips: string[];
  imageUrl?: string;
  isFeatured?: boolean;
  detailedInfo?: {
    standards?: string[];
    benefits?: string[];
    statistics?: { label: string; value: string }[];
  };
}

export const FALLBACK_AWARENESS: AwarenessContent[] = [
  {
    id: '1',
    title: 'اشتراطات السلامة في مواقع البناء',
    description:
      'دليل توعوي شامل حول اشتراطات السلامة المهنية الواجب توفرها في جميع مواقع البناء لحماية العمال والمواطنين.',
    icon: HardHat,
    color: 'from-orange-500 to-orange-600',
    category: 'safety',
    isFeatured: true,
    tips: [
      'توفير خوذات السلامة لجميع العمال',
      'تركيب سياج أمان حول الموقع',
      'تركيب لافتات تحذيرية',
      'توفير طفايات الحريق',
      'توفير صندوق إسعافات أولية',
    ],
    detailedInfo: {
      standards: [
        'الالتزام بالكود اليمني للبناء和安全',
        'تطبيق معايير OSHA للسلامة المهنية',
        'تركيب شبكات الحماية للمناطق المرتفعة',
        'توفير معدات الوقاية الشخصية',
      ],
      benefits: [
        'تقليل حوادث العمل بنسبة 85%',
        'حماية الأرواح والممتلكات',
        'تحسين بيئة العمل',
        'الالتزام باللوائح القانونية',
      ],
      statistics: [
        { label: 'انخفاض الحوادث', value: '85%' },
        { label: 'مواقع مراقبة', value: '120+ موقع' },
        { label: 'فحوصات دورية', value: '500+ فحص' },
      ],
    },
  },
  {
    id: '2',
    title: 'معايير الجودة الإنشائية',
    description:
      'إرشادات حول المعايير الهندسية المعتمدة لضمان جودة المباني ومطابقتها للمواصفات الفنية.',
    icon: CheckCircle,
    color: 'from-emerald-500 to-emerald-600',
    category: 'quality',
    isFeatured: true,
    tips: [
      'استخدام مواد بناء معتمدة',
      'التزام بالتصاميم المعتمدة',
      'إجراء اختبارات الجودة',
      'مراقبة تنفيذ الأعمال',
    ],
    detailedInfo: {
      standards: [
        'استخدام خرسانة بمواصفات ACI',
        'تفعيل المختبر المركزي للمواد',
        'اختبارات الضغط للخرسانة',
        'رقابة مستمرة على الجودة',
      ],
      benefits: [
        'ضمان متانة المباني',
        'رضا المستفيدين',
        'تقليل الصيانة المستقبلية',
        'تعزيز سمعة المكتب',
      ],
      statistics: [
        { label: 'اختبارات جودة', value: '2,500+' },
        { label: 'مواد معتمدة', value: '180+ مادة' },
        { label: 'مقاييس مستقلة', value: '100%' },
      ],
    },
  },
  {
    id: '3',
    title: 'الحفاظ على البيئة العمرانية',
    description: 'أهمية الحفاظ على المظهر الحضاري والبيئة العمرانية وفقاً للمخططات المعتمدة.',
    icon: Trees,
    color: 'from-green-500 to-green-600',
    category: 'environment',
    tips: [
      'الالتزام بالارتدادات',
      'الحفاظ على المظهر العام',
      'عدم البناء العشوائي',
      'المحافظة على الشبكة الخدمية',
    ],
    detailedInfo: {
      standards: [
        'الالتزام بالمخطط العام للمدينة',
        'المحافظة على الارتدادات العامة',
        'الامتثال للوائح البناء',
        'المحافظة على المرافق العامة',
      ],
      benefits: [
        'تحسين المظهر الحضاري',
        'الحفاظ على القيمة العقارية',
        'توفير خدمات عامة منظمة',
        'بيئة عمرانية مستدامة',
      ],
      statistics: [
        { label: 'مخالفات بيئية', value: '1,700+' },
        { label: 'مخططات معتمدة', value: '232+' },
        { label: 'وحدات جوار', value: '10+' },
      ],
    },
  },
  {
    id: '4',
    title: 'الالتزام بالتراخيص واللوائح',
    description: 'التوعية بأهمية الحصول على التراخيص النظامية قبل البدء في أي أعمال بناء أو تعديل.',
    icon: Scale,
    color: 'from-blue-500 to-blue-600',
    category: 'legal',
    isFeatured: true,
    tips: [
      'الحصول على ترخيص بناء',
      'اعتماد المخططات هندسياً',
      'عدم التعدي على الأملاك العامة',
      'احترام مناطق الارتداد',
    ],
    detailedInfo: {
      standards: [
        'قانون البناء رقم 19 لسنة 2002م',
        'قانون التخطيط الحضري رقم 20 لسنة 1995م',
        'اللائحة التنفيذية لقانون البناء',
        'قرارات الوزارة المعتمدة',
      ],
      benefits: [
        'حماية حقوق الملكية',
        'ضمان السلامة الإنشائية',
        'تسهيل الإجراءات المستقبلية',
        'تجنب الغرامات والعقوبات',
      ],
      statistics: [
        { label: 'تراخيص صادرة', value: '4,131+' },
        { label: 'مخالفات معالجة', value: '1,746+' },
        { label: 'غرامات محصلة', value: '450M+' },
      ],
    },
  },
  {
    id: '5',
    title: 'المشاركة المجتمعية',
    description: 'دور المواطن في الحفاظ على المظهر الحضاري والإبلاغ عن المخالفات.',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    category: 'community',
    tips: [
      'الإبلاغ عن المخالفات',
      'المحافظة على الممتلكات العامة',
      'المشاركة في الحملات التوعوية',
      'احترام اللوائح النظامية',
    ],
    detailedInfo: {
      standards: [
        'الالتزام بالمواطنة المسؤولة',
        'المشاركة في الحملات التوعوية',
        'الإبلاغ عن المخالفات',
        'التنسيق مع الجهات المختصة',
      ],
      benefits: [
        'تحسين البيئة الحضرية',
        'تعزيز الشعور بالانتماء',
        'حماية الممتلكات العامة',
        'شراكة مجتمعية فعالة',
      ],
      statistics: [
        { label: 'بلاغات مواطنين', value: '850+' },
        { label: 'حملات توعوية', value: '25 حملة' },
        { label: 'مشاركين', value: '5,000+' },
      ],
    },
  },
  {
    id: '6',
    title: 'إدارة المشاريع الهندسية',
    description: 'أفضل الممارسات في إدارة المشاريع الإنشائية من التخطيط حتى التسليم النهائي.',
    icon: ClipboardCheck,
    color: 'from-teal-500 to-teal-600',
    category: 'quality',
    tips: [
      'التخطيط المسبق الشامل',
      'إدارة الموارد بكفاءة',
      'الرقابة المستمرة على الجودة',
      'التسليم في الموعد المحدد',
    ],
    detailedInfo: {
      standards: [
        'تطبيق منهجية PMP',
        'استخدام برامج إدارة المشاريع',
        'التقارير الدورية للمتابعة',
        'ضوابط الجودة الشاملة',
      ],
      benefits: ['تقليل التكاليف', 'الالتزام بالمواعيد', 'جودة عالية للنتائج', 'رضا المستفيدين'],
      statistics: [
        { label: 'مشاريع مكتملة', value: '150+' },
        { label: 'مشاريع قيد التنفيذ', value: '45' },
        { label: 'نسبة إنجاز', value: '92%' },
      ],
    },
  },
];

// ============================================================
// البيانات الاحتياطية - الروابط السريعة
// ============================================================

export const FALLBACK_QUICK_LINKS: QuickLink[] = [
  {
    id: '1',
    title: 'تتبع المعاملة',
    description: 'تتبع حالة معاملتك الهندسية',
    icon: Truck,
    href: 'track',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    title: 'طلب ترخيص',
    description: 'تقديم طلب ترخيص بناء أو تجديد',
    icon: FileText,
    href: 'forms',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: '3',
    title: 'الدليل الإرشادي',
    description: 'دليل الخدمات والإجراءات النظامية',
    icon: BookOpen,
    href: 'guidelines',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: '4',
    title: 'تواصل معنا',
    description: 'استفسارات وشكاوى ومقترحات',
    icon: Phone,
    href: 'contact',
    color: 'from-purple-500 to-purple-600',
  },
];

// ============================================================
// دوال مساعدة
// ============================================================

/**
 * الحصول على الإعلانات النشطة
 */
export const getActiveAnnouncements = (announcements: Announcement[] = FALLBACK_ANNOUNCEMENTS) => {
  const now = new Date();
  return announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > now);
};

/**
 * الحصول على الإعلانات المميزة
 */
export const getFeaturedAnnouncements = (
  announcements: Announcement[] = FALLBACK_ANNOUNCEMENTS,
) => {
  return announcements.filter((a) => a.priority === 'high' || a.isPinned);
};

/**
 * الحصول على الأسئلة حسب التصنيف
 */
export const getFAQsByCategory = (category: FAQ['category'], faqs: FAQ[] = FALLBACK_FAQS) => {
  return faqs.filter((f) => f.category === category);
};

/**
 * الحصول على الأسئلة الأكثر شيوعاً
 */
export const getPopularFAQs = (faqs: FAQ[] = FALLBACK_FAQS) => {
  return faqs.filter((f) => f.isPopular);
};

/**
 * الحصول على الخدمات حسب التصنيف
 */
export const getServicesByCategory = (
  category: string,
  services: Service[] = FALLBACK_SERVICES,
) => {
  return services.filter((s) => s.category === category);
};

/**
 * الحصول على الخدمات الأكثر شيوعاً
 */
export const getPopularServices = (services: Service[] = FALLBACK_SERVICES) => {
  return services.filter((s) => s.isPopular);
};

/**
 * الحصول على المحتوى التوعوي حسب التصنيف
 */
export const getAwarenessByCategory = (
  category: AwarenessContent['category'],
  content: AwarenessContent[] = FALLBACK_AWARENESS,
) => {
  return content.filter((c) => c.category === category);
};

/**
 * الحصول على المحتوى المميز
 */
export const getFeaturedAwareness = (content: AwarenessContent[] = FALLBACK_AWARENESS) => {
  return content.filter((c) => c.isFeatured);
};
