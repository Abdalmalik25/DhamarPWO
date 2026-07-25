// تكامل Sanity مع موقع مكتب الأشغال العامة والطرق
import { createClient } from '@sanity/client';

// رمز API للقراءة - اختياري للاستخدام العام
// إذا لم يكن محدداً، سيتم استخدام بيانات احتياطية محلية
const readToken = import.meta.env.VITE_SANITY_API_READ_TOKEN;

// إعداد عميل Sanity
export const sanityClient = createClient({
  projectId: 'xqbc1jjs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // استخدام CDN للبيانات المنشورة
  perspective: 'published',
  token: readToken || undefined,
});

// عميل للبيانات المسودجة (Drafts) - للاستخدام في وضع المعاينة
export const sanityClientDrafts = createClient({
  projectId: 'xqbc1jjs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // لا نستخدم CDN للبيانات المسودجة
  perspective: 'drafts',
  token: readToken || undefined,
});

// التحقق من توفر الاتصال بـ Sanity
export const hasSanityToken = !!readToken;

// استعلامات GROQ الأساسية
export const QUERIES = {
  // جلب جميع الخدمات
  SERVICES: `*[_type == "service"] | order(_createdAt desc) {
    _id,
    title,
    description,
    icon,
    color,
    category,
    href,
    isPopular,
    isNew,
    estimatedTime
  }`,

  // جلب الإعلانات النشطة
  ANNOUNCEMENTS: `*[_type == "announcement" && (!defined(expiresAt) || expiresAt > now())] | order(isPinned desc, date desc) {
    _id,
    title,
    description,
    date,
    priority,
    category,
    isPinned,
    views
  }`,

  // جلب الأسئلة الشائعة
  FAQS: `*[_type == "faq"] | order(isPopular desc, _createdAt desc) {
    _id,
    question,
    answer,
    category,
    isPopular,
    tags,
    tip,
    estimatedTime
  }`,

  // جلب المحتوى التوعوي
  AWARENESS: `*[_type == "awareness"] | order(isFeatured desc, _createdAt desc) {
    _id,
    title,
    description,
    category,
    icon,
    color,
    tips,
    isFeatured,
    standards,
    benefits,
    statistics
  }`,

  // جلب الإحصائيات
  STATISTICS: `*[_type == "statistic"] | order(order asc) {
    _id,
    value,
    label,
    description,
    icon,
    color,
    suffix,
    order
  }`,

  // جلب الروابط السريعة
  QUICK_LINKS: `*[_type == "quickLink"] | order(order asc) {
    _id,
    title,
    description,
    href,
    icon,
    color,
    order
  }`,

  // جلب إعدادات الموقع
  SITE_SETTINGS: `*[_type == "siteSettings"][0] {
    fullName,
    shortName,
    governorate,
    country,
    ministry,
    contact,
    legalReferences,
    heroImage,
    heroBackgroundImage,
    parkingGuidelines,
    governorateMap
  }`,

  // جلب المشاريع الإنشائية
  PROJECTS: `*[_type == "project"] | order(isFeatured desc, _createdAt desc) {
    _id,
    title,
    description,
    status,
    progress,
    budget,
    startDate,
    expectedEndDate,
    actualEndDate,
    location,
    contractor,
    supervisingEngineer,
    isFeatured,
  }`,

  // جلب أعضاء الكادر
  TEAM_MEMBERS: `*[_type == "teamMember"] | order(isChief desc, order asc) {
    _id,
    name,
    position,
    department,
    specialization,
    email,
    phone,
    bio,
    isChief,
    order,
  }`,

  // جلب الوثائق الرسمية
  OFFICIAL_DOCUMENTS: `*[_type == "officialDocument"] | order(_createdAt desc) {
    _id,
    title,
    description,
    category,
    downloadUrl,
    publishedAt,
    views,
    downloads,
    tags,
  }`,

  // جلب البوم الصور
  GALLERIES: `*[_type == "gallery"] | order(_createdAt desc) {
    _id,
    title,
    description,
    category,
    date,
  }`,
};

// دوال جلب البيانات
export async function getServices() {
  try {
    const data = await sanityClient.fetch(QUERIES.SERVICES);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching services:', error);
    return null;
  }
}

export async function getAnnouncements() {
  try {
    const data = await sanityClient.fetch(QUERIES.ANNOUNCEMENTS);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return null;
  }
}

export async function getFAQs() {
  try {
    const data = await sanityClient.fetch(QUERIES.FAQS);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return null;
  }
}

export async function getAwarenessContent() {
  try {
    const data = await sanityClient.fetch(QUERIES.AWARENESS);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching awareness content:', error);
    return null;
  }
}

export async function getStatistics() {
  try {
    const data = await sanityClient.fetch(QUERIES.STATISTICS);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
}

export async function getQuickLinks() {
  try {
    const data = await sanityClient.fetch(QUERIES.QUICK_LINKS);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching quick links:', error);
    return null;
  }
}

export async function getSiteSettings() {
  try {
    const data = await sanityClient.fetch(QUERIES.SITE_SETTINGS);
    return data || null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

// الدوال الجديدة
export async function getProjects() {
  try {
    const data = await sanityClient.fetch(QUERIES.PROJECTS);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
}

export async function getTeamMembers() {
  try {
    const data = await sanityClient.fetch(QUERIES.TEAM_MEMBERS);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return null;
  }
}

export async function getOfficialDocuments() {
  try {
    const data = await sanityClient.fetch(QUERIES.OFFICIAL_DOCUMENTS);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching official documents:', error);
    return null;
  }
}

export async function getGalleries() {
  try {
    const data = await sanityClient.fetch(QUERIES.GALLERIES);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return null;
  }
}

// دالة لجلب كل المحتوى بصفحة واحدة (للصفحة الرئيسية)
export async function getHomeContent() {
  try {
    const [services, announcements, faqs, awareness, stats, quickLinks, settings] =
      await Promise.all([
        getServices(),
        getAnnouncements(),
        getFAQs(),
        getAwarenessContent(),
        getStatistics(),
        getQuickLinks(),
        getSiteSettings(),
      ]);

    return {
      services: services || [],
      announcements: announcements || [],
      faqs: faqs || [],
      awareness: awareness || [],
      stats: stats || [],
      quickLinks: quickLinks || [],
      settings,
    };
  } catch (error) {
    console.error('Error fetching home content:', error);
    return null;
  }
}
