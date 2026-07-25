// ============================================================
// Sanity Content Types - أنواع المحتوى المؤسسية الموحدة
// الإصدار 5.0.0 - معايير هندسية متقدمة
// ============================================================

/** حالة التحميل الموحدة */
export interface LoadingState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  /** الطابع الزمني لآخر تحديث ناجح */
  lastSyncedAt: Date | null;
  /** مصدر البيانات (sanity | cache | fallback) */
  source: 'sanity' | 'cache' | 'fallback';
  /** مدة الاستجابة بالمللي ثانية */
  responseTimeMs: number;
  /** عدد المحاولات */
  retryCount: number;
}

/** خيارات الجلب الموحدة */
export interface FetchOptions {
  /** إعادة المحاولة عند الفشل */
  retries?: number;
  /** مهلة الطلب بالمللي ثانية */
  timeout?: number;
  /** تجاهل التخزين المؤقت */
  bypassCache?: boolean;
  /** وقت انتهاء صلاحية التخزين المؤقت (ثوانٍ) */
  cacheTTL?: number;
  /** تفضيل البيانات المخزنة مؤقتاً */
  preferCached?: boolean;
  /** معرف الإصدار للمقارنة */
  version?: string;
}

/** مقاييس الأداء */
export interface PerformanceMetrics {
  /** وقت الاستجابة الإجمالي */
  totalTimeMs: number;
  /** وقت استعلام Sanity */
  queryTimeMs: number;
  /** وقت التحويل */
  transformTimeMs: number;
  /** حجم الاستجابة بالبايت */
  payloadBytes: number;
  /** هل تم جلبها من ذاكرة التخزين؟ */
  fromCache: boolean;
  /** عدد مرات الوصول */
  accessCount: number;
}

// ============================================================
// الخدمات - Service
// ============================================================
export interface SanityService {
  _id: string;
  _type: 'service';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: { current: string };
  description: string;
  longDescription?: string;
  icon: string;
  color: string;
  category: 'تراخيص' | 'اعتماد' | 'معاينات' | 'تصاريح' | 'إفادات' | 'شكاوى' | 'صحة' | 'تنظيم' | 'مختبرات' | 'استشارات';
  href: string;
  isPopular: boolean;
  isNew: boolean;
  estimatedTime?: string;
  /** الإجراءات المطلوبة */
  requiredSteps?: string[];
  /** المستندات المطلوبة */
  requiredDocuments?: string[];
  /** الرسوم المقدرة */
  estimatedFees?: string;
  /** الجهات المرتبطة */
  relatedAuthorities?: string[];
  /** الأسئلة الشائعة المرتبطة */
  relatedFAQs?: string[];
  /** النماذج المرتبطة */
  relatedForms?: string[];
  /** الكلمات المفتاحية */
  tags?: string[];
  /** رابط المرجع القانوني */
  legalReference?: string;
  /** إحصائيات الخدمة */
  statistics?: {
    totalCompleted: number;
    averageTime: string;
    satisfactionRate: number;
  };
  order?: number;
}

// ============================================================
// الإعلانات - Announcement
// ============================================================
export interface SanityAnnouncement {
  _id: string;
  _type: 'announcement';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  text?: string;
  type: 'urgent' | 'info' | 'achievement' | 'warning' | 'general';
  tag?: string;
  tagColor?: string;
  link?: {
    url: string;
    target: '_blank' | '_self';
  } | string;
  target?: '_blank' | '_self';
  expiresAt?: string;
  priority: number;
  icon?: string;
  typeLabel?: string;
}

// ============================================================
// الأسئلة الشائعة - FAQ
// ============================================================
export interface SanityFAQ {
  _id: string;
  _type: 'faq';
  _createdAt: string;
  _updatedAt: string;
  question: string;
  answer: string;
  category: 'planning' | 'permitting' | 'execution' | 'inspection' | 'handover' | 'legal' | 'general' | 'technical';
  isPopular: boolean;
  isAdvanced: boolean;
  tip?: string;
  /** المرجع القانوني */
  regulation?: {
    law: string;
    article: string;
    summary: string;
  };
  /** حالات عملية */
  similarCases: string[];
  /** إجراءات العمل */
  workflow: string[];
  /** الموارد المرتبطة */
  resources: Array<{
    title: string;
    url: string;
    type: 'pdf' | 'doc' | 'link' | 'video';
  }>;
  estimatedTime?: string;
  tags: string[];
  relatedPage?: string;
  /** عدد مرات المشاهدة */
  views: number;
  /** هل الإجابة مفيدة؟ */
  helpfulCount: number;
  order?: number;
}

// ============================================================
// المحتوى التوعوي - Awareness
// ============================================================
export interface SanityAwareness {
  _id: string;
  _type: 'awareness';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  category: 'safety' | 'quality' | 'environment' | 'legal' | 'community' | 'technical';
  icon: string;
  color: string;
  isFeatured: boolean;
  tips: string[];
  /** محتوى موسع */
  detailedInfo?: {
    standards: string[];
    benefits: string[];
    procedures: string[];
    statistics: Array<{ label: string; value: string }>;
  };
  /** صور توضيحية */
  images?: Array<{
    url: string;
    caption: string;
    alt: string;
  }>;
  /** ملفات فيديو */
  videos?: Array<{
    url: string;
    title: string;
    duration: string;
  }>;
  /** الكلمات المفتاحية */
  tags: string[];
  order?: number;
}

// ============================================================
// الإحصائيات - Statistic
// ============================================================
export interface SanityStatistic {
  _id: string;
  _type: 'statistic';
  _createdAt: string;
  _updatedAt: string;
  value: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
  suffix: string;
  order: number;
  /** تاريخ آخر تحديث للإحصائية */
  lastVerifiedAt?: string;
  /** مصدر الإحصائية */
  source?: string;
  /** القيمة الرقمية للتحريك */
  numericValue?: number;
  /** هل تظهر في الصفحة الرئيسية */
  showOnHome: boolean;
}

// ============================================================
// الروابط السريعة - QuickLink
// ============================================================
export interface SanityQuickLink {
  _id: string;
  _type: 'quickLink';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  order: number;
  /** هل الرابط خارجي */
  isExternal: boolean;
  /** فتح في تبويب جديد */
  openInNewTab: boolean;
}

// ============================================================
// المشاريع - Project
// ============================================================
export interface SanityProject {
  _id: string;
  _type: 'project';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  progress: number;
  budget: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  location: string;
  contractor: string;
  supervisingEngineer: string;
  isFeatured: boolean;
  /** صور المشروع */
  gallery: Array<{
    url: string;
    caption: string;
  }>;
  /** مراحل المشروع */
  phases: Array<{
    name: string;
    status: 'pending' | 'in-progress' | 'completed';
    startDate: string;
    endDate: string;
    description: string;
  }>;
  /** الفوائد المتوقعة */
  benefits: string[];
  /** الكلمات المفتاحية */
  tags: string[];
}

// ============================================================
// أعضاء الكادر - TeamMember
// ============================================================
export interface SanityTeamMember {
  _id: string;
  _type: 'teamMember';
  _createdAt: string;
  _updatedAt: string;
  name: string;
  position: string;
  department: string;
  specialization: string;
  email: string;
  phone: string;
  bio: string;
  isChief: boolean;
  order: number;
  /** صورة شخصية */
  imageUrl?: string;
  /** المؤهلات العلمية */
  qualifications: string[];
  /** الخبرات */
  experiences: Array<{
    title: string;
    organization: string;
    period: string;
  }>;
  /** المهارات */
  skills: string[];
}

// ============================================================
// الوثائق الرسمية - OfficialDocument
// ============================================================
export interface SanityOfficialDocument {
  _id: string;
  _type: 'officialDocument';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  category: 'قوانين' | 'لوائح' | 'نماذج' | 'تقارير' | 'دراسات' | 'أدلة' | 'تعاميم' | 'عقود';
  downloadUrl: string;
  publishedAt: string;
  views: number;
  downloads: number;
  tags: string[];
  /** حجم الملف */
  fileSize: string;
  /** صيغة الملف */
  fileFormat: string;
  /** رقم الوثيقة */
  documentNumber?: string;
  /** الجهة المصدرة */
  issuingAuthority?: string;
  /** تاريخ انتهاء الصلاحية */
  expiresAt?: string;
}

// ============================================================
// ألبوم الصور - Gallery
// ============================================================
export interface SanityGallery {
  _id: string;
  _type: 'gallery';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  category: 'مشاريع' | 'فعاليات' | 'إنجازات' | 'زيارات' | 'معارض' | 'تدريب' | 'عام';
  date: string;
  /** صور الألبوم */
  images: Array<{
    url: string;
    caption: string;
    alt: string;
    width: number;
    height: number;
  }>;
  coverImage?: string;
  tags: string[];
}

// ============================================================
// إعدادات الموقع - SiteSettings
// ============================================================
export interface SanitySiteSettings {
  _id: string;
  _type: 'siteSettings';
  fullName: string;
  shortName: string;
  governorate: string;
  country: string;
  ministry: string;
  contact: {
    phone: string;
    fax: string;
    email: string;
    address: string;
    workingHours: string;
    emergencyPhone?: string;
    socialMedia: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
  legalReferences: string[];
  /** الشعارات */
  logos: {
    primary: string;
    secondary: string;
    favicon: string;
    ogImage: string;
    appleTouchIcon: string;
  };
  /** إحصائيات عامة */
  generalStats: {
    foundedYear: number;
    totalEmployees: number;
    totalProjects: number;
    totalLicenses: number;
  };
  /** روابط تذييل الموقع */
  footerLinks: Array<{
    title: string;
    url: string;
    category: string;
  }>;
  /** إعدادات SEO */
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    verificationCodes: {
      google: string;
      bing: string;
      yandex: string;
      facebook: string;
    };
  };
  /** إعدادات الصيانة */
  maintenance: {
    isUnderMaintenance: boolean;
    maintenanceMessage: string;
    expectedEndTime: string;
  };
}

// ============================================================
// أنواع المحتوى الموحدة للواجهة الأمامية
// ============================================================

/** نوع موحد لكل أنواع المحتوى */
export type SanityDocumentTypes =
  | SanityService
  | SanityAnnouncement
  | SanityFAQ
  | SanityAwareness
  | SanityStatistic
  | SanityQuickLink
  | SanityProject
  | SanityTeamMember
  | SanityOfficialDocument
  | SanityGallery
  | SanitySiteSettings;

/** خريطة أنواع المحتوى */
export interface ContentTypeMap {
  service: SanityService;
  announcement: SanityAnnouncement;
  faq: SanityFAQ;
  awareness: SanityAwareness;
  statistic: SanityStatistic;
  quickLink: SanityQuickLink;
  project: SanityProject;
  teamMember: SanityTeamMember;
  officialDocument: SanityOfficialDocument;
  gallery: SanityGallery;
  siteSettings: SanitySiteSettings;
}

/** أسماء أنواع المحتوى */
export type ContentTypeName = keyof ContentTypeMap;

/** استعلامات GROQ المحددة مسبقاً */
export type QueryName = 'byType' | 'byId' | 'bySlug' | 'byCategory' | 'popular' | 'featured' | 'search';

/** معاملات الاستعلام */
export interface QueryParams {
  type?: ContentTypeName;
  id?: string;
  slug?: string;
  category?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  searchTerm?: string;
  tags?: string[];
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}