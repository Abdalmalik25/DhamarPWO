// ============================================================
// Sanity GROQ Queries Enterprise - استعلامات GROQ مؤسسية متقدمة
// الإصدار 5.0.0 - قابلة للتوسع والتخصيص، محسّنة للأداء
// ============================================================

/** بادئات الاستعلامات المجزأة القابلة لإعادة الاستخدام */
export const FRAGMENTS = {
  /** أبعاد الصورة المثالية */
  IMAGE_DIMENSIONS: `
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
  `,

  /** بيانات الصورة المحسّنة */
  IMAGE_DATA: `
    "url": image.asset->url,
    "alt": image.alt,
    "caption": image.caption,
    "lqip": image.asset->metadata.lqip,
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio,
  `,

  /** إحصائيات المحتوى (عدد المشاهدات والتفاعلات) */
  CONTENT_STATS: `
    views,
    downloads,
  `,

  /** بيانات النشر */
  PUBLICATION_META: `
    _createdAt,
    _updatedAt,
    publishedAt,
  `,

  /** التصنيفات والوسوم */
  TAXONOMY: `
    category,
    tags,
  `,

  /** الترتيب والتصفية */
  ORDERING: `
    order,
    isPopular,
    isFeatured,
    isPinned,
  `,
};

// ============================================================
// استعلامات GROQ الأساسية - موحدة لكل أنواع المحتوى
// ============================================================

/** استعلام ديناميكي حسب النوع مع خيارات التصفية */
export function buildTypeQuery(
  type: string,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    filters?: string[];
  },
): string {
  const {
    limit = 100,
    offset = 0,
    orderBy = '_createdAt',
    orderDirection = 'desc',
    filters = [],
  } = options || {};

  const filterClause = filters.length > 0 ? ` && ${filters.join(' && ')}` : '';
  const orderClause = `| order(${orderBy} ${orderDirection})`;

  return `*[_type == "${type}"${filterClause}] ${orderClause} [${offset}...${offset + limit}]`;
}

/** استعلام ديناميكي مع إسقاط الحقول */
export function buildProjectedQuery(
  projection: string,
  options?: {
    type?: string;
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    filters?: string[];
  },
): string {
  const {
    limit = 100,
    offset = 0,
    orderBy = '_createdAt',
    orderDirection = 'desc',
    filters = [],
    type,
  } = options || {};

  const typeClause = type ? `_type == "${type}"` : '';
  const filterClause = filters.length > 0 ? ' && ' + filters.join(' && ') : '';
  const whereClause = typeClause || filterClause ? `*[${typeClause}${filterClause}]` : '*';
  const orderClause = `| order(${orderBy} ${orderDirection})`;

  return `${whereClause} ${orderClause} [${offset}...${offset + limit}] { ${projection} }`;
}

// ============================================================
// استعلامات محسّنة لكل نوع محتوى
// ============================================================

/** استعلام الخدمات مع العلاقات */
export const SERVICES_QUERY = `
  *[_type == "service"] | order(isPopular desc, order asc, _createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    longDescription,
    icon,
    color,
    category,
    href,
    isPopular,
    isNew,
    estimatedTime,
    requiredSteps,
    requiredDocuments,
    estimatedFees,
    relatedAuthorities,
    relatedFAQs,
    relatedForms,
    tags,
    legalReference,
    statistics,
    order
  }
`;

/** استعلام الإعلانات النشطة */
export const ACTIVE_ANNOUNCEMENTS_QUERY = `
  *[_type == "announcement" && (!defined(expiresAt) || expiresAt > now())]
    | order(priority desc, _createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    "type": coalesce(type, "general"),
    tag,
    tagColor,
    "link": coalesce(link, ""),
    target,
    expiresAt,
    priority,
    icon
  }
`;

/** استعلام الأسئلة الشائعة مع الإجراءات */
export const FAQS_QUERY = `
  *[_type == "faq"] | order(isPopular desc, order asc, _createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    question,
    answer,
    category,
    isPopular,
    isAdvanced,
    tip,
    regulation,
    similarCases,
    workflow,
    resources,
    estimatedTime,
    tags,
    relatedPage,
    views,
    helpfulCount,
    order
  }
`;

/** استعلام المحتوى التوعوي مع التفاصيل */
export const AWARENESS_QUERY = `
  *[_type == "awareness"] | order(isFeatured desc, order asc, _createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    description,
    category,
    icon,
    color,
    isFeatured,
    tips,
    detailedInfo,
    images,
    videos,
    tags,
    order
  }
`;

/** استعلام الإحصائيات */
export const STATISTICS_QUERY = `
  *[_type == "statistic"] | order(order asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    value,
    label,
    description,
    icon,
    color,
    suffix,
    order,
    lastVerifiedAt,
    source,
    numericValue,
    showOnHome
  }
`;

/** استعلام الروابط السريعة */
export const QUICK_LINKS_QUERY = `
  *[_type == "quickLink"] | order(order asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    description,
    href,
    icon,
    color,
    order,
    isExternal,
    openInNewTab
  }
`;

/** استعلام المشاريع مع المراحل */
export const PROJECTS_QUERY = `
  *[_type == "project"] | order(isFeatured desc, _createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
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
    gallery,
    phases,
    benefits,
    tags
  }
`;

/** استعلام أعضاء الكادر */
export const TEAM_MEMBERS_QUERY = `
  *[_type == "teamMember"] | order(isChief desc, order asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    name,
    position,
    department,
    specialization,
    email,
    phone,
    bio,
    isChief,
    order,
    imageUrl,
    qualifications,
    experiences,
    skills
  }
`;

/** استعلام الوثائق الرسمية */
export const OFFICIAL_DOCUMENTS_QUERY = `
  *[_type == "officialDocument"] | order(_createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    description,
    category,
    downloadUrl,
    publishedAt,
    views,
    downloads,
    tags,
    fileSize,
    fileFormat,
    documentNumber,
    issuingAuthority,
    expiresAt
  }
`;

/** استعلام ألبومات الصور */
export const GALLERIES_QUERY = `
  *[_type == "gallery"] | order(_createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    description,
    category,
    date,
    images,
    coverImage,
    tags
  }
`;

/** استعلام إعدادات الموقع */
export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    _id,
    _type,
    fullName,
    shortName,
    governorate,
    country,
    ministry,
    contact,
    legalReferences,
    logos,
    generalStats,
    footerLinks,
    seo,
    maintenance
  }
`;

// ============================================================
// استعلامات متقدمة للصفحة الرئيسية والصفحات المعقدة
// ============================================================

/** استعلام متكامل للصفحة الرئيسية (جميع أنواع المحتوى دفعة واحدة) */
export const HOME_PAGE_QUERY = `
  {
    "services": *[_type == "service"] | order(isPopular desc, order asc) { _id, title, description, icon, color, category, href, isPopular, isNew, estimatedTime, order },
    "announcements": *[_type == "announcement" && (!defined(expiresAt) || expiresAt > now())] | order(isPinned desc, date desc) { _id, title, description, date, priority, category, isPinned, views },
    "faqs": *[_type == "faq" && isPopular == true] | order(order asc) { _id, question, answer, category, estimatedTime },
    "awareness": *[_type == "awareness" && isFeatured == true] | order(order asc) { _id, title, description, category, icon, color, tips, detailedInfo },
    "stats": *[_type == "statistic" && showOnHome == true] | order(order asc) { _id, value, label, description, icon, color, suffix },
    "quickLinks": *[_type == "quickLink"] | order(order asc) { _id, title, description, href, icon, color },
    "settings": *[_type == "siteSettings"][0] { fullName, shortName, contact, logos, seo }
  }
`;

/** استعلام البحث الشامل عبر جميع أنواع المحتوى */
export const SEARCH_QUERY = `
  *[
    _type in ["service", "announcement", "faq", "awareness", "project", "officialDocument"]
    && (
      title match $searchTerm
      || description match $searchTerm
      || category match $searchTerm
      || $searchTerm in tags[]
    )
  ]
  | order(_createdAt desc)
  [0...$limit]
  {
    _id,
    _type,
    _type == "service" => { title, description, "url": "/services" },
    _type == "announcement" => { title, description, "url": "/" },
    _type == "faq" => { "title": question, "description": answer, "url": "/faq" },
    _type == "awareness" => { title, description, "url": "/awareness" },
    _type == "project" => { title, description, "url": "/projects" },
    _type == "officialDocument" => { title, description, "url": "/documents" },
    _score
  }
`;

/** استعلام البحث عن الخدمات حسب الكلمة المفتاحية */
export const SERVICES_SEARCH_QUERY = `
  *[
    _type == "service"
    && (
      title match $searchTerm
      || description match $searchTerm
      || longDescription match $searchTerm
      || category match $searchTerm
      || $searchTerm in tags[]
    )
  ]
  | order(isPopular desc, _createdAt desc)
  [0...$limit]
`;

/** استعلام الحصول على محتوى ذي صلة */
export const RELATED_CONTENT_QUERY = (
  type: string,
  currentId: string,
  category?: string,
  limit = 3,
): string => {
  const categoryFilter = category ? `&& category == "${category}"` : '';
  return `
    *[_type == "${type}" && _id != "${currentId}" ${categoryFilter}]
    | order(isPopular desc, _createdAt desc)
    [0...${limit}]
  `;
};

/** استعلام إحصائيات المحتوى (عدد الوثائق لكل نوع) */
export const CONTENT_STATS_QUERY = `
  {
    "totalServices": count(*[_type == "service"]),
    "totalAnnouncements": count(*[_type == "announcement"]),
    "totalFAQs": count(*[_type == "faq"]),
    "totalAwareness": count(*[_type == "awareness"]),
    "totalProjects": count(*[_type == "project"]),
    "totalTeamMembers": count(*[_type == "teamMember"]),
    "totalDocuments": count(*[_type == "officialDocument"]),
    "totalGalleries": count(*[_type == "gallery"]),
    "totalQuickLinks": count(*[_type == "quickLink"])
  }
`;

// ============================================================
// خريطة الاستعلامات - للوصول السريع
// ============================================================

/** خريطة جميع الاستعلامات للوصول الديناميكي */
export const QUERY_MAP: Record<string, string> = {
  services: SERVICES_QUERY,
  announcements: ACTIVE_ANNOUNCEMENTS_QUERY,
  faqs: FAQS_QUERY,
  awareness: AWARENESS_QUERY,
  statistics: STATISTICS_QUERY,
  quickLinks: QUICK_LINKS_QUERY,
  projects: PROJECTS_QUERY,
  teamMembers: TEAM_MEMBERS_QUERY,
  officialDocuments: OFFICIAL_DOCUMENTS_QUERY,
  galleries: GALLERIES_QUERY,
  siteSettings: SITE_SETTINGS_QUERY,
  homePage: HOME_PAGE_QUERY,
  contentStats: CONTENT_STATS_QUERY,
};

/** الحصول على استعلام بالاسم مع معاملات اختيارية */
export function getQuery(queryName: string, params?: { limit?: number; offset?: number }): string {
  const baseQuery = QUERY_MAP[queryName];
  if (!baseQuery) {
    throw new Error(`[Sanity Queries] Unknown query: "${queryName}"`);
  }
  if (params && (params.limit !== undefined || params.offset !== undefined)) {
    const limit = params.limit ?? 100;
    const offset = params.offset ?? 0;
    return baseQuery.replace(/\[0\.\.\.100\]/g, `[${offset}...${limit}]`);
  }
  return baseQuery;
}
