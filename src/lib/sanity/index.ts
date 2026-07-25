// ============================================================
// Sanity Enterprise Integration - نقطة التكامل المؤسسية الموحدة
// الإصدار 5.0.0 - واجهة برمجية متكاملة لقراءة المحتوى من Sanity
// ============================================================
// 
// هذا الملف هو نقطة الدخول الوحيدة للتفاعل مع Sanity CMS.
// كل المكونات والـ Hooks تستورد من هنا فقط.
//
// مثال الاستخدام:
// import { useSanityServices, useSanityHomePage, invalidateAllCache } from '@/lib/sanity';
//
// أو للصفحة الرئيسية (استعلام واحد مجمّع):
// const { data, isLoading, source } = useSanityHomePage();
// ============================================================

// ============================================================
// 1. الأنواع (Types) - تعريفات TypeScript لجميع أنواع المحتوى
// ============================================================
export type {
  // أنواع Sanity الأساسية
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

  // أنواع مساعدة
  LoadingState,
  FetchOptions,
  PerformanceMetrics,
  ContentTypeMap,
  ContentTypeName,
  QueryParams,
  SanityDocumentTypes,
} from './types';

// ============================================================
// 2. العميل (Client) - اتصال Sanity مع إعادة محاولة ومراقبة
// ============================================================
export {
  enterpriseClient,
  enterpriseDraftClient,
  getClient,
  checkSanityHealth,
  fetchWithRetry,
  fetchMultiple,
  clientStats,
} from './client';

// ============================================================
// 3. الاستعلامات (Queries) - استعلامات GROQ محسّنة وجاهزة
// ============================================================
export {
  // استعلامات جاهزة لكل نوع محتوى
  SERVICES_QUERY,
  ACTIVE_ANNOUNCEMENTS_QUERY,
  FAQS_QUERY,
  AWARENESS_QUERY,
  STATISTICS_QUERY,
  QUICK_LINKS_QUERY,
  PROJECTS_QUERY,
  TEAM_MEMBERS_QUERY,
  OFFICIAL_DOCUMENTS_QUERY,
  GALLERIES_QUERY,
  SITE_SETTINGS_QUERY,

  // استعلامات متقدمة
  HOME_PAGE_QUERY,
  SEARCH_QUERY,
  SERVICES_SEARCH_QUERY,
  CONTENT_STATS_QUERY,
  RELATED_CONTENT_QUERY,

  // دوال بناء الاستعلامات
  buildTypeQuery,
  buildProjectedQuery,
  getQuery,
  QUERY_MAP,
  FRAGMENTS,
} from './queries';

// ============================================================
// 4. الـ Hooks الذكية - مع تخزين مؤقت وإعادة محاولة
// ============================================================
export {
  // Hooks متخصصة لكل نوع محتوى
  useSanityServices,
  useSanityAnnouncements,
  useSanityFAQs,
  useSanityAwareness,
  useSanityStatistics,
  useSanityQuickLinks,
  useSanityProjects,
  useSanityTeamMembers,
  useSanityDocuments,
  useSanityGalleries,
  useSanitySiteSettings,

  // Hook متكامل للصفحة الرئيسية (استعلام واحد)
  useSanityHomePage,

  // Hook إحصائيات المحتوى
  useSanityContentStats,

  // Hook البحث الشامل
  useSanitySearch,

  // دوال إدارة التخزين المؤقت
  invalidateAllCache,
  invalidateContentCache,
  getCacheReport,
  getClientReport,
} from './hooks';

export type {
  HomePageResult,
  ContentStats,
  SearchResult,
} from './hooks';

// ============================================================
// 5. المحولات (Transformers) - تحويل بيانات Sanity للواجهة
// ============================================================
export {
  // محولات فردية
  transformService,
  transformAnnouncement,
  transformFAQ,
  transformAwareness,
  transformStatistic,
  transformQuickLink,
  transformProject,
  transformTeamMember,
  transformOfficialDocument,
  transformGallery,
  transformSiteSettings,

  // محولات مصفوفات
  transformServices,
  transformAnnouncements,
  transformFAQs,
  transformAwarenessList,
  transformStatistics,
  transformQuickLinks,
  transformProjects,
  transformTeamMembers,
  transformOfficialDocuments,
  transformGalleries,

  // محولات متقدمة
  transformHomePageData,
  transformSearchResults,
  transformByType,
  TRANSFORMER_MAP,
} from './transformers';

// ============================================================
// 6. المراقبة (Monitoring) - نظام مراقبة أداء Sanity
// ============================================================
export {
  sanityMonitor,
  getSanityReport,
  startSanityMonitoring,
  stopSanityMonitoring,
  getSanityConnectionStatus,
  resetSanityMonitoring,
} from './monitoring';

export type {
  SanityPerformanceReport,
} from './monitoring';

// ============================================================
// 7. العميل القديم (للتوافق مع الكود الموجود)
// ============================================================
export { sanityClient, sanityClientDrafts, hasSanityToken, getServices, getAnnouncements, getFAQs, getAwarenessContent, getStatistics, getQuickLinks, getProjects, getTeamMembers, getOfficialDocuments, getGalleries, getHomeContent, QUERIES } from '../sanity';
