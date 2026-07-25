// ============================================================
// SEO Service - تحسين محركات البحث المتقدم
// ============================================================

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle?: string;
}

interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

class SEOService {
  private config: SEOConfig = {
    siteName: 'مكتب الأشغال العامة والطرق - محافظة ذمار',
    siteUrl: 'https://pwo-dhamar.gov.ye',
    defaultTitle: 'مكتب الأشغال العامة والطرق - محافظة ذمار | البوابة الإلكترونية الرسمية',
    defaultDescription:
      'الجهة الحكومية الرسمية المخولة بتنظيم قطاع التشييد والبناء، وإصدار التراخيص العمرانية، والإشراف على مشاريع الطرق والبنية التحتية في محافظة ذمار',
    defaultImage: '/images/og-image.jpg',
    twitterHandle: '@pwo_dhamar',
  };

  private structuredData: Map<string, StructuredData> = new Map();

  // تحديث SEO للصفحة
  updatePageSEO(page: PageSEO) {
    this.updateTitle(page.title);
    this.updateMetaDescription(page.description);
    this.updateMetaKeywords(page.keywords);
    this.updateOpenGraph(page);
    this.updateTwitterCard(page);
    this.updateCanonical(page.canonical);
    this.addStructuredData(page);
  }

  // تحديث العنوان
  private updateTitle(title: string) {
    const fullTitle = `${title} | ${this.config.siteName}`;
    document.title = fullTitle;

    // تحديث meta tag
    let titleTag = document.querySelector('meta[name="title"]') as HTMLMetaElement | null;
    if (!titleTag) {
      titleTag = document.createElement('meta');
      titleTag.setAttribute('name', 'title');
      document.head.appendChild(titleTag);
    }
    titleTag.setAttribute('content', fullTitle);

    // تحديث og:title
    this.updateMetaProperty('og:title', title);
    this.updateMetaName('twitter:title', title);
  }

  // تحديث الوصف
  private updateMetaDescription(description: string) {
    let descTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', description);

    this.updateMetaProperty('og:description', description);
    this.updateMetaName('twitter:description', description);
  }

  // تحديث الكلمات المفتاحية
  private updateMetaKeywords(keywords?: string[]) {
    if (!keywords || keywords.length === 0) return;

    let keywordsTag = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!keywordsTag) {
      keywordsTag = document.createElement('meta');
      keywordsTag.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsTag);
    }
    keywordsTag.setAttribute('content', keywords.join(', '));
  }

  // تحديث Open Graph
  private updateOpenGraph(page: PageSEO) {
    const image = page.image || this.config.defaultImage;
    const fullImage = image.startsWith('http') ? image : `${this.config.siteUrl}${image}`;

    this.updateMetaProperty('og:title', page.title);
    this.updateMetaProperty('og:description', page.description);
    this.updateMetaProperty('og:image', fullImage);
    this.updateMetaProperty('og:url', page.canonical || this.config.siteUrl);
    this.updateMetaProperty('og:type', page.type || 'website');
    this.updateMetaProperty('og:site_name', this.config.siteName);
    this.updateMetaProperty('og:locale', 'ar_YE');

    if (page.publishedTime) {
      this.updateMetaProperty('article:published_time', page.publishedTime);
    }
    if (page.modifiedTime) {
      this.updateMetaProperty('article:modified_time', page.modifiedTime);
    }
    if (page.author) {
      this.updateMetaProperty('article:author', page.author);
    }
  }

  // تحديث Twitter Card
  private updateTwitterCard(page: PageSEO) {
    const image = page.image || this.config.defaultImage;
    const fullImage = image.startsWith('http') ? image : `${this.config.siteUrl}${image}`;

    this.updateMetaName('twitter:card', 'summary_large_image');
    this.updateMetaName('twitter:site', this.config.twitterHandle || '');
    this.updateMetaName('twitter:title', page.title);
    this.updateMetaName('twitter:description', page.description);
    this.updateMetaName('twitter:image', fullImage);
  }

  // تحديث Canonical
  private updateCanonical(canonical?: string) {
    const url = canonical || this.config.siteUrl;

    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', url);
  }

  // تحديث Meta Property
  private updateMetaProperty(property: string, content: string) {
    let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    if (content) {
      tag.setAttribute('content', content);
    }
  }

  // تحديث Meta Name
  private updateMetaName(name: string, content: string) {
    let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    if (content) {
      tag.setAttribute('content', content);
    }
  }

  // إضافة Structured Data
  private addStructuredData(page: PageSEO) {
    const schema = this.generateSchema(page);
    if (!schema) return;

    const scriptId = `structured-data-${page.type || 'website'}`;

    // إزالة البيانات القديمة من نفس النوع
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    // حفظ في الذاكرة
    this.structuredData.set(scriptId, schema);
  }

  // توليد Schema.org
  private generateSchema(page: PageSEO): StructuredData | null {
    if (!page.title) return null;

    const baseSchema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': this.config.siteName,
      'url': this.config.siteUrl,
      'logo': `${this.config.siteUrl}/images/logo.png`,
      'description': page.description,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'ذمار',
        'addressCountry': 'YE',
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+967-6-521222',
        'contactType': 'customer service',
      },
    };

    switch (page.type) {
      case 'service':
        return {
          ...baseSchema,
          '@type': 'Service',
          'serviceType': this.extractServiceType(page.title),
          'provider': {
            '@type': 'GovernmentOrganization',
            'name': this.config.siteName,
          },
        } as StructuredData;

      case 'article':
        return {
          ...baseSchema,
          '@type': 'Article',
          'headline': page.title,
          'description': page.description,
          'author': {
            '@type': 'Organization',
            'name': page.author || this.config.siteName,
          },
          'publisher': {
            '@type': 'Organization',
            'name': this.config.siteName,
          },
          'datePublished': page.publishedTime || new Date().toISOString(),
          'dateModified': page.modifiedTime || page.publishedTime || new Date().toISOString(),
        } as StructuredData;

      default:
        return {
          ...baseSchema,
          '@type': 'WebPage',
          'name': page.title,
          'description': page.description,
        } as StructuredData;
    }
  }

  // استخراج نوع الخدمة
  private extractServiceType(title: string): string {
    const serviceKeywords: Record<string, string> = {
      رخصة: 'تراخيص البناء',
      تصريح: 'التصاريح',
      شهادة: 'الشهادات',
      تقرير: 'التقارير',
      استمارة: 'النماذج',
    };

    for (const [keyword, serviceType] of Object.entries(serviceKeywords)) {
      if (title.includes(keyword)) {
        return serviceType;
      }
    }

    return 'خدمات هندسية';
  }

  // إضافة BreadcrumbList Schema
  addBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    if (items.length === 0) return;

    const schema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url,
      })),
    };

    const scriptId = 'structured-data-breadcrumb';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // إضافة FAQ Schema
  addFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    if (faqs.length === 0) return;

    const schema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    };

    const scriptId = 'structured-data-faq';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // إضافة Service Schema
  addServiceSchema(service: { name: string; description: string; url: string }) {
    const schema: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': service.name,
      'description': service.description,
      'provider': {
        '@type': 'GovernmentOrganization',
        'name': this.config.siteName,
      },
      'serviceArea': {
        '@type': 'City',
        'name': 'ذمار',
      },
    };

    const scriptId = 'structured-data-service';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // تحديث Configuration
  updateConfig(config: Partial<SEOConfig>) {
    this.config = { ...this.config, ...config };
  }

  // الحصول على Configuration
  getConfig(): SEOConfig {
    return { ...this.config };
  }
}

// تصدير نسخة وحيدة
export const seo = new SEOService();

// Export type
export type { SEOConfig, PageSEO };
