// ============================================================
// Sanity Client Enterprise - عميل Sanity المؤسسي المتقدم
// الإصدار 5.0.0 - مع مراقبة وإعادة محاولة وتخزين مؤقت
// ============================================================

import { createClient } from '@sanity/client';
import { hasSanityToken } from '../sanity';

/** عميل Sanity الأساسي مع إعدادات محسّنة */
export const enterpriseClient = createClient({
  projectId: 'xqbc1jjs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
  token: hasSanityToken ? import.meta.env.VITE_SANITY_API_READ_TOKEN : undefined,
});

/** عميل للبيانات المسودجة (للمعاينة) */
export const enterpriseDraftClient = createClient({
  projectId: 'xqbc1jjs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'drafts',
  token: hasSanityToken ? import.meta.env.VITE_SANITY_API_READ_TOKEN : undefined,
});

/** الحصول على العميل المناسب حسب السياق */
export function getClient(useDrafts = false) {
  return useDrafts ? enterpriseDraftClient : enterpriseClient;
}

/** التحقق من صحة الاتصال وإرجاع حالة Sanity */
export async function checkSanityHealth(): Promise<{
  isConnected: boolean;
  latency: number;
  error: string | null;
}> {
  const start = performance.now();
  try {
    await enterpriseClient.fetch('count(*)');
    return {
      isConnected: true,
      latency: performance.now() - start,
      error: null,
    };
  } catch (err) {
    return {
      isConnected: false,
      latency: performance.now() - start,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/** تنفيذ استعلام مع إعادة محاولة ذكية */
export async function fetchWithRetry<T>(
  query: string,
  params?: Record<string, string | number | boolean | string[]>,
  options?: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    useDrafts?: boolean;
  },
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, useDrafts = false } = options || {};
  const client = getClient(useDrafts);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const startTime = performance.now();
      const data = await client.fetch<T>(query, params || {});
      // تسجيل الإحصائيات
      clientStats.recordSuccess(performance.now() - startTime);
      return data;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown fetch error');
      clientStats.recordFailure();
      clientStats.recordRetry();

      if (attempt <= maxRetries) {
        // تأخير تصاعدي مع التشتت (jitter)
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
        const jitter = Math.random() * delay * 0.1;
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      }
    }
  }

  throw lastError || new Error('Fetch failed after retries');
}

/** تنفيذ استعلام متعدد (للصفحة الرئيسية) */
export async function fetchMultiple<T>(
  queries: Array<{ name: string; query: string; params?: Record<string, string | number | boolean | string[]> }>,
  options?: { useDrafts?: boolean },
): Promise<Record<string, T>> {
  const results: Record<string, T> = {};

  for (const { name, query, params } of queries) {
    try {
      results[name] = await fetchWithRetry<T>(query, params, options);
    } catch (err) {
      console.error(`[Sanity Enterprise] Failed to fetch "${name}":`, err);
      results[name] = [] as unknown as T;
    }
  }

  return results;
}

/** دالة لإنشاء URL الصور من Sanity */
export function urlFor(source: { asset: { _ref: string } } | string | null | undefined): string {
  if (!source) return '/icons/logo-dhamar.png';
  
  // إذا كان المصدر نصيًا (مسار مباشر)
  if (typeof source === 'string') {
    return source.startsWith('/') ? source : `/${source}`;
  }
  
  // إذا كان مرجع Sanity
  if (source.asset?._ref) {
    const ref = source.asset._ref;
    // تنسيق: image-<id>-<dimensions>-<format>
    const parts = ref.replace('image-', '').split('-');
    const id = parts[0];
    const dimensions = parts.slice(1).join('-');
    return `https://cdn.sanity.io/images/xqbc1jjs/production/${id}-${dimensions}`;
  }
  
  return '/icons/logo-dhamar.png';
}

/** إحصائيات استخدام العميل */
export const clientStats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalRetries: 0,
  averageLatency: 0,
  lastRequestTime: null as number | null,

  /** تسجيل طلب ناجح */
  recordSuccess(latency: number) {
    this.totalRequests++;
    this.successfulRequests++;
    this.averageLatency =
      (this.averageLatency * (this.totalRequests - 1) + latency) / this.totalRequests;
    this.lastRequestTime = Date.now();
  },

  /** تسجيل طلب فاشل */
  recordFailure() {
    this.totalRequests++;
    this.failedRequests++;
    this.lastRequestTime = Date.now();
  },

  /** تسجيل إعادة محاولة */
  recordRetry() {
    this.totalRetries++;
  },

  /** الحصول على التقرير */
  getReport() {
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      totalRetries: this.totalRetries,
      successRate: this.totalRequests > 0
        ? ((this.successfulRequests / this.totalRequests) * 100).toFixed(1) + '%'
        : 'N/A',
      averageLatency: this.averageLatency
        ? this.averageLatency.toFixed(0) + 'ms'
        : 'N/A',
      lastRequestTime: this.lastRequestTime
        ? new Date(this.lastRequestTime).toISOString()
        : 'N/A',
      isHealthy: this.failedRequests < this.totalRequests * 0.1,
    };
  },
};