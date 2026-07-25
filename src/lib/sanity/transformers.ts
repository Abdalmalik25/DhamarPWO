// ============================================================
// Sanity Data Transformers - محولات بيانات ذكية
// الإصدار 5.0.0 - تحويل بيانات Sanity إلى صيغة الواجهة الأمامية
// ============================================================

import type {
  SanityService,
  SanityAnnouncement,
  SanityFAQ,
  SanityAwareness,
  SanityStatistic,
  SanityQuickLink,
  SanityProject,
  SanityTeamMember,
  SanityOfficialDocument,
  SanityGallery,
  SanitySiteSettings,
} from './types';

// ============================================================
// 🎯 محولات البيانات الأساسية
// ============================================================

/** تحويل بيانات الخدمة من Sanity إلى صيغة الواجهة */
export function transformService(data: SanityService) {
  return {
    id: data._id,
    title: data.title,
    description: data.description || data.title,
    longDescription: data.longDescription || data.description,
    icon: data.icon,
    color: data.color,
    category: data.category,
    href: data.href || 'forms',
    isPopular: data.isPopular || false,
    isNew: data.isNew || false,
    estimatedTime: data.estimatedTime || '',
    requiredSteps: data.requiredSteps || [],
    requiredDocuments: data.requiredDocuments || [],
    estimatedFees: data.estimatedFees || '',
    relatedAuthorities: data.relatedAuthorities || [],
    tags: data.tags || [],
    legalReference: data.legalReference || '',
    statistics: data.statistics || null,
    order: data.order || 0,
    createdAt: data._createdAt,
    updatedAt: data._updatedAt,
  };
}

/** تحويل بيانات الإعلان من Sanity إلى صيغة الواجهة */
export function transformAnnouncement(data: SanityAnnouncement) {
  return {
    id: data._id,
    title: data.title,
    description: data.text || data.title,
    date: '',
    priority: 'normal',
    category: 'عام',
    isPinned: false,
    views: 0,
    text: data.text || data.title,
    type: data.type || 'general',
    tag: data.tag || '',
    tagColor: data.tagColor || undefined,
    link: typeof data.link === 'string' ? data.link : data.link?.url || '',
    target: typeof data.link === 'string' ? '_self' : (data.link?.target || data.target || '_self'),
    expiresAt: data.expiresAt,
    priorityNumber: data.priority,
    icon: data.icon || undefined,
    createdAt: data._createdAt,
    updatedAt: data._updatedAt,
  };
}

/** تحويل بيانات السؤال الشائع من Sanity إلى صيغة الواجهة */
export function transformFAQ(data: SanityFAQ) {
  return {
    id: data._id,
    question: data.question,
    answer: data.answer,
    category: data.category || 'general',
    isPopular: data.isPopular || false,
    isAdvanced: data.isAdvanced || false,
    tip: data.tip || '',
    regulation: data.regulation || null,
    similarCases: data.similarCases || [],
    workflow: data.workflow || [],
    resources: data.resources || [],
    estimatedTime: data.estimatedTime || '',
    tags: data.tags || [],
    relatedPage: data.relatedPage || '',
    views: data.views || 0,
    helpfulCount: data.helpfulCount || 0,
    order: data.order || 0,
  };
}

/** تحويل بيانات المحتوى التوعوي من Sanity إلى صيغة الواجهة */
export function transformAwareness(data: SanityAwareness) {
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    category: data.category || 'community',
    icon: data.icon,
    color: data.color,
    isFeatured: data.isFeatured || false,
    tips: data.tips || [],
    detailedInfo: data.detailedInfo || null,
    images: data.images || [],
    videos: data.videos || [],
    tags: data.tags || [],
    order: data.order || 0,
  };
}

/** تحويل بيانات الإحصائية من Sanity إلى صيغة الواجهة */
export function transformStatistic(data: SanityStatistic) {
  return {
    id: data._id,
    value: data.value,
    label: data.label,
    description: data.description || '',
    icon: data.icon,
    color: data.color,
    suffix: data.suffix || '',
    order: data.order || 0,
    lastVerifiedAt: data.lastVerifiedAt || '',
    source: data.source || '',
    numericValue: data.numericValue || 0,
    showOnHome: data.showOnHome !== false,
  };
}

/** تحويل بيانات الرابط السريع من Sanity إلى صيغة الواجهة */
export function transformQuickLink(data: SanityQuickLink) {
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    href: data.href,
    icon: data.icon,
    color: data.color,
    order: data.order || 0,
    isExternal: data.isExternal || false,
    openInNewTab: data.openInNewTab || false,
  };
}

/** تحويل بيانات المشروع من Sanity إلى صيغة الواجهة */
export function transformProject(data: SanityProject) {
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    status: data.status || 'planned',
    progress: data.progress || 0,
    budget: data.budget || 0,
    startDate: data.startDate,
    expectedEndDate: data.expectedEndDate,
    actualEndDate: data.actualEndDate || '',
    location: data.location || '',
    contractor: data.contractor || '',
    supervisingEngineer: data.supervisingEngineer || '',
    isFeatured: data.isFeatured || false,
    gallery: data.gallery || [],
    phases: data.phases || [],
    benefits: data.benefits || [],
    tags: data.tags || [],
  };
}

/** تحويل بيانات عضو الكادر من Sanity إلى صيغة الواجهة */
export function transformTeamMember(data: SanityTeamMember) {
  return {
    id: data._id,
    name: data.name,
    position: data.position,
    department: data.department || '',
    specialization: data.specialization || '',
    email: data.email || '',
    phone: data.phone || '',
    bio: data.bio || '',
    isChief: data.isChief || false,
    order: data.order || 0,
    imageUrl: data.imageUrl || '',
    qualifications: data.qualifications || [],
    experiences: data.experiences || [],
    skills: data.skills || [],
  };
}

/** تحويل بيانات الوثيقة الرسمية من Sanity إلى صيغة الواجهة */
export function transformOfficialDocument(data: SanityOfficialDocument) {
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    category: data.category || 'قوانين',
    downloadUrl: data.downloadUrl,
    publishedAt: data.publishedAt,
    views: data.views || 0,
    downloads: data.downloads || 0,
    tags: data.tags || [],
    fileSize: data.fileSize || '',
    fileFormat: data.fileFormat || '',
    documentNumber: data.documentNumber || '',
    issuingAuthority: data.issuingAuthority || '',
    expiresAt: data.expiresAt || '',
  };
}

/** تحويل بيانات ألبوم الصور من Sanity إلى صيغة الواجهة */
export function transformGallery(data: SanityGallery) {
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    category: data.category || 'عام',
    date: data.date,
    images: data.images || [],
    coverImage: data.coverImage || '',
    tags: data.tags || [],
  };
}

/** تحويل بيانات إعدادات الموقع من Sanity إلى صيغة الواجهة */
export function transformSiteSettings(data: SanitySiteSettings) {
  if (!data) return null;
  return {
    id: data._id,
    fullName: data.fullName,
    shortName: data.shortName,
    governorate: data.governorate,
    country: data.country,
    ministry: data.ministry,
    contact: {
      phone: data.contact?.phone || '',
      fax: data.contact?.fax || '',
      email: data.contact?.email || '',
      address: data.contact?.address || '',
      workingHours: data.contact?.workingHours || '',
      emergencyPhone: data.contact?.emergencyPhone || '',
      socialMedia: data.contact?.socialMedia || [],
    },
    legalReferences: data.legalReferences || [],
    logos: {
      primary: data.logos?.primary || '',
      secondary: data.logos?.secondary || '',
      favicon: data.logos?.favicon || '',
      ogImage: data.logos?.ogImage || '',
      appleTouchIcon: data.logos?.appleTouchIcon || '',
    },
    generalStats: {
      foundedYear: data.generalStats?.foundedYear || 0,
      totalEmployees: data.generalStats?.totalEmployees || 0,
      totalProjects: data.generalStats?.totalProjects || 0,
      totalLicenses: data.generalStats?.totalLicenses || 0,
    },
    footerLinks: data.footerLinks || [],
    seo: {
      defaultTitle: data.seo?.defaultTitle || '',
      defaultDescription: data.seo?.defaultDescription || '',
      keywords: data.seo?.keywords || [],
      verificationCodes: {
        google: data.seo?.verificationCodes?.google || '',
        bing: data.seo?.verificationCodes?.bing || '',
        yandex: data.seo?.verificationCodes?.yandex || '',
        facebook: data.seo?.verificationCodes?.facebook || '',
      },
    },
    maintenance: {
      isUnderMaintenance: data.maintenance?.isUnderMaintenance || false,
      maintenanceMessage: data.maintenance?.maintenanceMessage || '',
      expectedEndTime: data.maintenance?.expectedEndTime || '',
    },
  };
}

// ============================================================
// 🔄 محولات متعددة (Arrays)
// ============================================================

/** تحويل مصفوفة الخدمات */
export function transformServices(data: SanityService[]) {
  return (data || []).map(transformService);
}

/** تحويل مصفوفة الإعلانات */
export function transformAnnouncements(data: SanityAnnouncement[]) {
  return (data || []).map(transformAnnouncement);
}

/** تحويل مصفوفة الأسئلة الشائعة */
export function transformFAQs(data: SanityFAQ[]) {
  return (data || []).map(transformFAQ);
}

/** تحويل مصفوفة المحتوى التوعوي */
export function transformAwarenessList(data: SanityAwareness[]) {
  return (data || []).map(transformAwareness);
}

/** تحويل مصفوفة الإحصائيات */
export function transformStatistics(data: SanityStatistic[]) {
  return (data || []).map(transformStatistic);
}

/** تحويل مصفوفة الروابط السريعة */
export function transformQuickLinks(data: SanityQuickLink[]) {
  return (data || []).map(transformQuickLink);
}

/** تحويل مصفوفة المشاريع */
export function transformProjects(data: SanityProject[]) {
  return (data || []).map(transformProject);
}

/** تحويل مصفوفة أعضاء الكادر */
export function transformTeamMembers(data: SanityTeamMember[]) {
  return (data || []).map(transformTeamMember);
}

/** تحويل مصفوفة الوثائق الرسمية */
export function transformOfficialDocuments(data: SanityOfficialDocument[]) {
  return (data || []).map(transformOfficialDocument);
}

/** تحويل مصفوفة ألبومات الصور */
export function transformGalleries(data: SanityGallery[]) {
  return (data || []).map(transformGallery);
}

// ============================================================
// 🧩 محولات متقدمة
// ============================================================

/** تحويل بيانات الصفحة الرئيسية المجمّعة */
export function transformHomePageData(data: {
  services?: SanityService[];
  announcements?: SanityAnnouncement[];
  faqs?: SanityFAQ[];
  awareness?: SanityAwareness[];
  stats?: SanityStatistic[];
  quickLinks?: SanityQuickLink[];
  settings?: SanitySiteSettings | null;
}) {
  return {
    services: transformServices(data.services || []),
    announcements: transformAnnouncements(data.announcements || []),
    faqs: transformFAQs(data.faqs || []),
    awareness: transformAwarenessList(data.awareness || []),
    stats: transformStatistics(data.stats || []),
    quickLinks: transformQuickLinks(data.quickLinks || []),
    settings: transformSiteSettings(data.settings as SanitySiteSettings),
  };
}

/** تحويل نتائج البحث */
export function transformSearchResults(
  data: Array<{
    _id: string;
    _type: string;
    title?: string;
    description?: string;
    url?: string;
    _score?: number;
  }>,
) {
  return (data || []).map((item) => ({
    id: item._id,
    type: item._type,
    title: item.title || '',
    description: item.description || '',
    url: item.url || '/',
    score: item._score || 0,
  }));
}

/** خريطة المحولات للوصول الديناميكي */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TRANSFORMER_MAP: Record<string, (data: any) => unknown> = {
  service: transformService,
  announcement: transformAnnouncement,
  faq: transformFAQ,
  awareness: transformAwareness,
  statistic: transformStatistic,
  quickLink: transformQuickLink,
  project: transformProject,
  teamMember: transformTeamMember,
  officialDocument: transformOfficialDocument,
  gallery: transformGallery,
  siteSettings: transformSiteSettings,
};

/** تحويل ديناميكي حسب النوع */
export function transformByType(type: string, data: unknown): unknown {
  const transformer = TRANSFORMER_MAP[type];
  if (!transformer) return data;
  return transformer(data);
}
