// ============================================================
// Services Index - تصدير جميع الخدمات
// ============================================================

// Stage 1: Performance & Intelligence
export { smartPrefetch } from './SmartPrefetch';
export { performanceMonitor } from './PerformanceMonitor';

// Stage 2: User Experience
export { darkMode } from './DarkModeService';
export { hapticFeedback } from './HapticFeedbackService';
export { liveStatistics } from './LiveStatisticsService';

// Stage 3: Advanced Features
export { offlineIntelligence } from './OfflineIntelligenceService';

// Stage 4: SEO & Marketing
export { seo } from './SEOService';
export type { SEOConfig, PageSEO } from './SEOService';

// ============================================================
// Service Initialization Helper
// ============================================================

interface ServiceStatus {
  name: string;
  initialized: boolean;
  error?: string;
}

class ServicesManager {
  private services: Map<string, { init: () => Promise<void> | void; status: ServiceStatus }> =
    new Map();
  private initialized = false;

  // تسجيل خدمة
  register(name: string, initFn: () => Promise<void> | void) {
    this.services.set(name, {
      init: initFn,
      status: { name, initialized: false },
    });
  }

  // تهيئة جميع الخدمات
  async initAll() {
    if (this.initialized) {
      console.warn('[Services] Already initialized');
      return;
    }

    console.log('[Services] Initializing all services...');

    const results: ServiceStatus[] = [];

    for (const [name, service] of this.services) {
      try {
        await service.init();
        service.status.initialized = true;
        results.push(service.status);
        console.log(`[Services] ✓ ${name} initialized`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        service.status.error = errorMessage;
        results.push(service.status);
        console.error(`[Services] ✗ ${name} failed:`, errorMessage);
      }
    }

    this.initialized = true;

    const successCount = results.filter((r) => r.initialized).length;
    const totalCount = results.length;

    console.log(`[Services] Initialized ${successCount}/${totalCount} services`);

    return results;
  }

  // الحصول على حالة خدمة
  getStatus(name: string): ServiceStatus | undefined {
    return this.services.get(name)?.status;
  }

  // الحصول على جميع الحالات
  getAllStatuses(): ServiceStatus[] {
    return Array.from(this.services.values()).map((s) => s.status);
  }

  // التحقق من التهيئة
  isInitialized() {
    return this.initialized;
  }

  // إعادة تعيين
  reset() {
    this.initialized = false;
    this.services.forEach((service) => {
      service.status.initialized = false;
      service.status.error = undefined;
    });
  }
}

// تصدير نسخة وحيدة
export const servicesManager = new ServicesManager();

// ============================================================
// تهيئة تلقائية عند تحميل التطبيق
// ============================================================

export async function initializeServices() {
  // تسجيل كل الخدمات
   servicesManager.register('SmartPrefetch', async () => {
    const { smartPrefetch: sp } = await import('./SmartPrefetch');
    await sp.init();
  });

  servicesManager.register('PerformanceMonitor', () => {
    // لا يتطلب تهيئة خاصة - يبدأ عند الطلب
    return Promise.resolve();
  });

  servicesManager.register('DarkMode', () => {
    // مهيأ تلقائياً عند الإنشاء
    return Promise.resolve();
  });

  servicesManager.register('HapticFeedback', () => {
    // مهيأ تلقائياً عند الإنشاء
    return Promise.resolve();
  });

  servicesManager.register('LiveStatistics', () => {
    // مهيأ تلقائياً عند الإنشاء
    return Promise.resolve();
  });

  // تهيئة جميع الخدمات
  return await servicesManager.initAll();
}
