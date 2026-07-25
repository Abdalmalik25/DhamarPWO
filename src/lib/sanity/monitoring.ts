// ============================================================
// Sanity Enterprise Monitoring - نظام مراقبة أداء Sanity المتقدم
// الإصدار 5.0.0 - مراقبة حية، تقارير أداء، تنبيهات ذكية
// ============================================================

import { clientStats } from './client';

// ============================================================
// 📊 أنواع بيانات المراقبة
// ============================================================

/** تقرير أداء Sanity الشامل */
export interface SanityPerformanceReport {
  /** إحصائيات الطلبات */
  requests: {
    total: number;
    successful: number;
    failed: number;
    retries: number;
    successRate: string;
  };
  /** زمن الاستجابة */
  latency: {
    average: string;
    p50: string;
    p95: string;
    p99: string;
    max: string;
    min: string;
  };
  /** التخزين المؤقت */
  cache: {
    hitRate: string;
    totalEntries: number;
    memoryEstimate: string;
  };
  /** الصحة العامة */
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    isConnected: boolean;
    lastChecked: string;
    uptime: string;
  };
  /** توصيات */
  recommendations: string[];
}

/** حدث مراقبة */
interface MonitoringEvent {
  type: 'request' | 'error' | 'cache' | 'health';
  timestamp: number;
  duration: number;
  metadata?: Record<string, unknown>;
}

// ============================================================
// 🕒 نظام المراقبة
// ============================================================

class SanityMonitor {
  private events: MonitoringEvent[] = [];
  private maxEvents = 1000;
  private startTime = Date.now();
  private latencySamples: number[] = [];
  private cacheHits = 0;
  private cacheMisses = 0;
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;

  /** تسجيل حدث */
  recordEvent(event: MonitoringEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    if (event.type === 'request') {
      this.latencySamples.push(event.duration);
      if (this.latencySamples.length > 1000) {
        this.latencySamples.shift();
      }
    }
  }

  /** تسجيل طلب ناجح */
  recordRequest(duration: number): void {
    this.recordEvent({
      type: 'request',
      timestamp: Date.now(),
      duration,
    });
  }

  /** تسجيل خطأ */
  recordError(duration: number, error?: string): void {
    this.recordEvent({
      type: 'error',
      timestamp: Date.now(),
      duration,
      metadata: { error },
    });
  }

  /** تسجيل استخدام التخزين المؤقت */
  recordCacheHit(): void {
    this.cacheHits++;
  }

  recordCacheMiss(): void {
    this.cacheMisses++;
  }

  /** بدء المراقبة الدورية للصحة */
  startHealthCheck(intervalMs = 60000): void {
    if (this.healthCheckInterval) return;
    this.healthCheckInterval = setInterval(() => {
      this.checkHealth();
    }, intervalMs);
  }

  /** إيقاف المراقبة الدورية */
  stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /** فحص الصحة */
  private async checkHealth(): Promise<void> {
    try {
      const { checkSanityHealth } = await import('./client');
      const result = await checkSanityHealth();
      this.recordEvent({
        type: 'health',
        timestamp: Date.now(),
        duration: result.latency,
        metadata: { isConnected: result.isConnected },
      });
    } catch {
      this.recordEvent({
        type: 'health',
        timestamp: Date.now(),
        duration: 0,
        metadata: { isConnected: false },
      });
    }
  }

  /** حساب النسب المئوية لزمن الاستجابة */
  private calculatePercentile(percentile: number): number {
    if (this.latencySamples.length === 0) return 0;
    const sorted = [...this.latencySamples].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /** الحصول على تقرير الأداء الشامل */
  getReport(): SanityPerformanceReport {
    const stats = clientStats.getReport();
    const totalRequests = stats.totalRequests;
    const successfulRequests = stats.successfulRequests;
    const failedRequests = stats.failedRequests;
    const totalRetries = stats.totalRetries;
    const avgLatency = parseFloat(stats.averageLatency) || 0;

    // حساب زمن الاستجابة
    const p50 = this.calculatePercentile(50);
    const p95 = this.calculatePercentile(95);
    const p99 = this.calculatePercentile(99);
    const max = this.latencySamples.length > 0 ? Math.max(...this.latencySamples) : 0;
    const min = this.latencySamples.length > 0 ? Math.min(...this.latencySamples) : 0;

    // حساب التخزين المؤقت
    const totalCache = this.cacheHits + this.cacheMisses;
    const hitRate = totalCache > 0 ? (this.cacheHits / totalCache) * 100 : 0;

    // تحديد حالة الصحة
    const errorRate = totalRequests > 0 ? failedRequests / totalRequests : 0;
    let healthStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (errorRate > 0.1) healthStatus = 'unhealthy';
    else if (errorRate > 0.05) healthStatus = 'degraded';

    // توليد التوصيات
    const recommendations: string[] = [];
    if (errorRate > 0.05) {
      recommendations.push('⚠️ ارتفاع معدل الأخطاء - يُنصح بمراجعة اتصال Sanity');
    }
    if (avgLatency > 2000) {
      recommendations.push('🐢 زمن استجابة مرتفع - يُنصح بتمكين CDN أو تحسين الاستعلامات');
    }
    if (hitRate < 50) {
      recommendations.push('💾 معدل تخزين مؤقت منخفض - يُنصح بزيادة TTL');
    }
    if (totalRetries > totalRequests * 0.1) {
      recommendations.push('🔄 كثرة إعادة المحاولة - يُنصح بمراجعة استقرار الشبكة');
    }
    if (recommendations.length === 0) {
      recommendations.push('✅ النظام يعمل بكفاءة - لا توجد توصيات');
    }

    return {
      requests: {
        total: totalRequests,
        successful: successfulRequests,
        failed: failedRequests,
        retries: totalRetries,
        successRate: stats.successRate,
      },
      latency: {
        average: stats.averageLatency,
        p50: p50.toFixed(0) + 'ms',
        p95: p95.toFixed(0) + 'ms',
        p99: p99.toFixed(0) + 'ms',
        max: max.toFixed(0) + 'ms',
        min: min.toFixed(0) + 'ms',
      },
      cache: {
        hitRate: hitRate.toFixed(1) + '%',
        totalEntries: 0, // يتم تحديثها من SmartCache
        memoryEstimate: '~' + (this.events.length * 0.5).toFixed(0) + 'KB',
      },
      health: {
        status: healthStatus,
        isConnected: errorRate < 0.5,
        lastChecked: new Date().toISOString(),
        uptime: this.getUptime(),
      },
      recommendations,
    };
  }

  /** الحصول على مدة التشغيل */
  private getUptime(): string {
    const uptime = Date.now() - this.startTime;
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const seconds = Math.floor((uptime % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  /** الحصول على آخر الأحداث */
  getRecentEvents(count = 10): MonitoringEvent[] {
    return this.events.slice(-count);
  }

  /** الحصول على إحصائيات الأخطاء */
  getErrorStats(): { count: number; rate: string; lastError: MonitoringEvent | null } {
    const errors = this.events.filter((e) => e.type === 'error');
    const total = this.events.length;
    return {
      count: errors.length,
      rate: total > 0 ? ((errors.length / total) * 100).toFixed(1) + '%' : '0%',
      lastError: errors[errors.length - 1] || null,
    };
  }

  /** إعادة تعيين الإحصائيات */
  reset(): void {
    this.events = [];
    this.latencySamples = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.startTime = Date.now();
  }
}

/** مثيل المراقبة العام */
export const sanityMonitor = new SanityMonitor();

// ============================================================
// 🚀 دوال مساعدة للاستخدام السريع
// ============================================================

/** الحصول على تقرير أداء Sanity */
export function getSanityReport(): SanityPerformanceReport {
  return sanityMonitor.getReport();
}

/** بدء مراقبة Sanity التلقائية */
export function startSanityMonitoring(intervalMs = 60000): void {
  sanityMonitor.startHealthCheck(intervalMs);
  console.log('[Sanity Monitor] Started health monitoring every', intervalMs / 1000, 's');
}

/** إيقاف مراقبة Sanity */
export function stopSanityMonitoring(): void {
  sanityMonitor.stopHealthCheck();
  console.log('[Sanity Monitor] Stopped health monitoring');
}

/** الحصول على حالة اتصال Sanity */
export async function getSanityConnectionStatus(): Promise<{
  isConnected: boolean;
  latency: number;
  error: string | null;
}> {
  const { checkSanityHealth } = await import('./client');
  return checkSanityHealth();
}

/** إعادة تعيين إحصائيات المراقبة */
export function resetSanityMonitoring(): void {
  sanityMonitor.reset();
  console.log('[Sanity Monitor] Reset all statistics');
}