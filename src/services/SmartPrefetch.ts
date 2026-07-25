// ============================================================
// Smart Prefetch Service - تحميل مسبق ذكي للصفحات
// ============================================================

type Page = import('../types/page').Page;

interface PrefetchConfig {
  enabled: boolean;
  threshold: number; // عدد النقرات قبل التنبؤ
  maxPages: number; // الحد الأقصى للصفحات المحملة مسبقاً
  popularPages: Page[]; // الصفحات الشائعة
}

interface UserBehavior {
  lastVisitedPages: Page[];
  frequentPages: Map<Page, number>;
  currentPage: Page | null;
}

class SmartPrefetchService {
  private config: PrefetchConfig = {
    enabled: true,
    threshold: 2, // تنبؤ بعد 2 زيارة للصفحة
    maxPages: 3, // تحميل 3 صفحات مسبقاً كحد أقصى
    popularPages: ['home', 'services', 'about', 'track'],
  };

  private behavior: UserBehavior = {
    lastVisitedPages: [],
    frequentPages: new Map(),
    currentPage: null,
  };

  private prefetchQueue: Set<Page> = new Set();
  private swRegistration: ServiceWorkerRegistration | null = null;

  // تهيئة الخدمة
  async init() {
    try {
      this.swRegistration = await navigator.serviceWorker.ready;
      console.log('[SmartPrefetch] Service initialized');
    } catch (error) {
      console.warn('[SmartPrefetch] Service Worker not available:', error);
    }
  }

  // تتبع سلوك المستخدم
  trackPageVisit(page: Page) {
    this.behavior.currentPage = page;

    // إضافة للصفحات الأخيرة
    this.behavior.lastVisitedPages = this.behavior.lastVisitedPages
      .filter((p) => p !== page)
      .slice(-4);
    this.behavior.lastVisitedPages.push(page);

    // تحديث عدّاد الزيارات
    const count = this.behavior.frequentPages.get(page) || 0;
    this.behavior.frequentPages.set(page, count + 1);

    // تحليل السلوك وتنفيذ التنبؤ
    this.analyzeAndPredict();
  }

  // تحليل السلوك وتنفيذ التنبؤ
  private analyzeAndPredict() {
    if (!this.config.enabled || !this.swRegistration) return;

    const predictions = this.predictNextPages();

    if (predictions.length > 0) {
      this.prefetchPages(predictions);
    }
  }

  // تنبؤ بالصفحات التالية
  private predictNextPages(): Page[] {
    const predictions: Page[] = [];
    const current = this.behavior.currentPage;

    if (!current) return predictions;

    // قواعد التنبؤ بناءً على الصفحة الحالية
    const predictionRules: Partial<Record<Page, Page[]>> = {
      home: ['services', 'about', 'track'],
      services: ['forms', 'contact', 'guidelines'],
      about: ['contact', 'services', 'home'],
      contact: ['forms', 'about', 'services'],
      track: ['forms', 'home', 'documents'],
      guidelines: ['forms', 'documents', 'services'],
      forms: ['documents', 'guidelines', 'contact'],
      documents: ['forms', 'guidelines', 'track'],
      privacy: ['terms', 'about', 'home'],
      terms: ['privacy', 'about', 'home'],
      news: ['home', 'services', 'about'],
      gallery: ['home', 'services', 'documents'],
    };

    const likelyPages = predictionRules[current] || [];

    // ترتيب حسب عدد الزيارات السابقة
    const sorted = likelyPages
      .map((page) => ({
        page,
        score:
          (this.behavior.frequentPages.get(page) || 0) +
          (this.config.popularPages.includes(page) ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.maxPages);

    return sorted.map((item) => item.page);
  }

  // تحميل صفحات مسبقاً
  private async prefetchPages(pages: Page[]) {
    const toPrefetch = [...new Set(pages)].filter((page) => !this.prefetchQueue.has(page));

    if (toPrefetch.length === 0) return;

    toPrefetch.forEach((page) => this.prefetchQueue.add(page));

    try {
      // الحصول على Service Worker النشط
      const sw = await navigator.serviceWorker.getRegistration();
      if (!sw) return;

      // إرسال أمر التخزين المسبق للـ Service Worker
      const allUrls = toPrefetch.map((page) => {
        return page === 'home' ? '/' : `/${page}`;
      });

      // تنفيذ التخزين المسبق مباشرة
      const cache = await caches.open('runtime-pwo-v4');

      for (const url of allUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response.clone());
            console.log('[SmartPrefetch] Prefetched:', url);
          }
        } catch (error) {
          console.warn('[SmartPrefetch] Failed to prefetch:', url, error);
        }
      }
    } catch (error) {
      console.error('[SmartPrefetch] Prefetch failed:', error);
    } finally {
      // إزالة من قائمة الانتظار بعد 30 ثانية
      setTimeout(() => {
        toPrefetch.forEach((page) => this.prefetchQueue.delete(page));
      }, 30000);
    }
  }

  // تخزين مسبق يدوي للصفحات
  async prefetchManual(pages: Page[]) {
    await this.prefetchPages(pages);
  }

  // تحديث الإعدادات
  updateConfig(config: Partial<PrefetchConfig>) {
    this.config = { ...this.config, ...config };
  }

  // الحصول على إحصائيات
  getStats() {
    return {
      prefetchQueue: Array.from(this.prefetchQueue),
      frequentPages: Array.from(this.behavior.frequentPages.entries()),
      lastVisited: this.behavior.lastVisitedPages,
      totalVisits: this.behavior.frequentPages.size,
    };
  }

  // مسح البيانات
  clear() {
    this.behavior = {
      lastVisitedPages: [],
      frequentPages: new Map(),
      currentPage: null,
    };
    this.prefetchQueue.clear();
  }
}

// تصدير نسخة وحيدة
export const smartPrefetch = new SmartPrefetchService();
