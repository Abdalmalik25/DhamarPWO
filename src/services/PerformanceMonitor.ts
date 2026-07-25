// ============================================================
// Performance Monitor Dashboard - مراقب أداء المباشرة
// ============================================================

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte

  // Custom Metrics
  fcp: number | null; // First Contentful Paint
  domContentLoaded: number | null;
  loadComplete: number | null;

  // Navigation Timing
  redirectTime: number;
  dnsTime: number;
  tcpTime: number;
  requestTime: number;
  responseTime: number;

  // Resource Timing
  jsExecutionTime: number;
  cssParseTime: number;

  // Custom App Metrics
  pageLoadTime: number;
  apiCalls: Array<{
    url: string;
    duration: number;
    status: number;
    timestamp: number;
  }>;

  // Memory (if available)
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

interface PerformanceReport {
  timestamp: number;
  page: string;
  metrics: PerformanceMetrics;
  score: number; // 0-100
  rating: 'good' | 'needs-improvement' | 'poor';
  recommendations: string[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = this.initMetrics();
  private reports: PerformanceReport[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  private startTime = 0;

  // تهيئة القيم الافتراضية
  private initMetrics(): PerformanceMetrics {
    return {
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      fcp: null,
      domContentLoaded: null,
      loadComplete: null,
      redirectTime: 0,
      dnsTime: 0,
      tcpTime: 0,
      requestTime: 0,
      responseTime: 0,
      jsExecutionTime: 0,
      cssParseTime: 0,
      pageLoadTime: 0,
      apiCalls: [],
    };
  }

  // بدء المراقبة
  startMonitoring(pageName: string) {
    if (this.isMonitoring) {
      this.stopMonitoring();
    }

    this.startTime = performance.now();
    this.isMonitoring = true;
    this.metrics = this.initMetrics();

    console.log(`[PerformanceMonitor] Starting monitoring for: ${pageName}`);

    // مراقبة Navigation Timing
    this.observeNavigationTiming();

    // مراقبة Core Web Vitals
    this.observeWebVitals();

    // مراقبة Resource Timing
    this.observeResourceTiming();

    // مراقبة Long Tasks
    this.observeLongTasks();

    // مراقبة Memory (إذا متاح)
    this.observeMemory();

    // تسجيل تحميل الصفحة
    window.addEventListener('load', () => {
      setTimeout(() => this.generateReport(pageName), 1000);
    });
  }

  // إيقاف المراقبة
  stopMonitoring() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
    console.log('[PerformanceMonitor] Monitoring stopped');
  }

  // مراقبة Navigation Timing
  private observeNavigationTiming() {
    try {
      const [navigation] = performance.getEntriesByType(
        'navigation',
      ) as PerformanceNavigationTiming[];

      if (navigation) {
        this.metrics.redirectTime = navigation.redirectEnd - navigation.redirectStart;
        this.metrics.dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart;
        this.metrics.tcpTime = navigation.connectEnd - navigation.connectStart;
        this.metrics.requestTime = navigation.requestStart;
        this.metrics.responseTime = navigation.responseEnd - navigation.responseStart;
        this.metrics.ttfb = navigation.responseStart;
        this.metrics.domContentLoaded =
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      }
    } catch (error) {
      console.warn('[PerformanceMonitor] Navigation timing not available:', error);
    }
  }

  // مراقبة Core Web Vitals
  private observeWebVitals() {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);
    } catch {
      console.warn('[PerformanceMonitor] LCP not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);
    } catch {
      console.warn('[PerformanceMonitor] FID not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const layoutEntry = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value;
          }
        });
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    } catch {
      console.warn('[PerformanceMonitor] CLS not supported');
    }

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const paintEntry = entry as PerformancePaintTiming;
          if (paintEntry.name === 'first-contentful-paint') {
            this.metrics.fcp = paintEntry.startTime;
          }
        });
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      this.observers.push(fcpObserver);
    } catch {
      console.warn('[PerformanceMonitor] FCP not supported');
    }
  }

  // مراقبة Resource Timing
  private observeResourceTiming() {
    try {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        let jsTime = 0;
        let cssTime = 0;

        entries.forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.initiatorType === 'script') {
            jsTime += resourceEntry.duration;
          } else if (
            resourceEntry.initiatorType === 'link' &&
            resourceEntry.name.includes('.css')
          ) {
            cssTime += resourceEntry.duration;
          }
        });

        this.metrics.jsExecutionTime = jsTime;
        this.metrics.cssParseTime = cssTime;
      });
      resourceObserver.observe({ type: 'resource', buffered: true });
      this.observers.push(resourceObserver);
    } catch {
      console.warn('[PerformanceMonitor] Resource timing not supported');
    }
  }

   // مراقبة Long Tasks (المهام الطويلة) - مُحسن للأداء
   private observeLongTasks() {
     try {
       const longTaskObserver = new PerformanceObserver((entryList) => {
         const entries = entryList.getEntries();
         entries.forEach((entry) => {
           const longTask = entry as PerformanceEntry & { duration: number };
           // تسجيل المهام الطويلة جداً فقط (> 1000ms) لتجنب الإزعاج
           if (longTask.duration > 1000) {
             console.warn(`[PerformanceMonitor] Long task detected: ${longTask.duration}ms`);
           }
           // تسجيل جميع المهام الطويلة للإحصائيات دون تحذير
           this.trackPerformanceIssue(longTask.duration);
         });
       });
       longTaskObserver.observe({ entryTypes: ['longtask'] });
       this.observers.push(longTaskObserver);
     } catch {
       // Long tasks غير مدعوم في المتصفح - لا نعرض تحذير
     }
   }

   // تتبع مشكلات الأداء
   private longTasksCount = 0;
   private trackPerformanceIssue(duration: number) {
     this.longTasksCount++;
     // يمكن استخدام هذه البيانات لاحقاً لحساب النتيجة
     if (duration > 250 && duration <= 1000) {
       // مهام متوسطة - لا تُظهر تحذير
     }
   }

  // مراقبة Memory
  private observeMemory() {
    try {
      const perfWithMemory = performance as Performance & {
        memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number };
      };
      if ('memory' in perfWithMemory && perfWithMemory.memory) {
        const mem = perfWithMemory.memory;
        this.metrics.memoryUsage = {
          usedJSHeapSize: mem.usedJSHeapSize,
          totalJSHeapSize: mem.totalJSHeapSize,
          jsHeapSizeLimit: mem.jsHeapSizeLimit,
        };
      }
    } catch {
      console.warn('[PerformanceMonitor] Memory info not available');
    }
  }

  // تسجيل استدعاء API
  trackApiCall(url: string, duration: number, status: number) {
    this.metrics.apiCalls.push({
      url,
      duration,
      status,
      timestamp: Date.now(),
    });
  }

  // حساب النتيجة الإجمالية
  private calculateScore(): {
    score: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let score = 100;

    // تقييم LCP
    if (this.metrics.lcp !== null) {
      if (this.metrics.lcp > 4000) {
        score -= 30;
        recommendations.push('تأخر تحميل أكبر عنصر - زد من ضغط الصور أو استخدم WebP');
      } else if (this.metrics.lcp > 2500) {
        score -= 15;
        recommendations.push('LCP يمكن تحسينه - فكر في تسريع الخادم');
      }
    }

    // تقييم FID
    if (this.metrics.fid !== null) {
      if (this.metrics.fid > 300) {
        score -= 25;
        recommendations.push('تأخر استجابة التفاعل - قلل من جافاسكريبتال-blocking');
      } else if (this.metrics.fid > 100) {
        score -= 10;
      }
    }

    // تقييم CLS
    if (this.metrics.cls !== null) {
      if (this.metrics.cls > 0.25) {
        score -= 25;
        recommendations.push('تحولات layout كثيرة - أضف أبعاد ثابتة للصور');
      } else if (this.metrics.cls > 0.1) {
        score -= 10;
      }
    }

    // تقييم TTFB
    if (this.metrics.ttfb !== null) {
      if (this.metrics.ttfb > 800) {
        score -= 20;
        recommendations.push('استجابة الخادم بطيئة - فكر في CDN');
      } else if (this.metrics.ttfb > 600) {
        score -= 10;
      }
    }

    // تقييم أوقات التحميل
    if (this.metrics.pageLoadTime > 5000) {
      score -= 20;
      recommendations.push('تحميل الصفحة بطيء جداً - تحقق من حجم الملفات');
    } else if (this.metrics.pageLoadTime > 3000) {
      score -= 10;
    }

    // تقييم API calls
    if (this.metrics.apiCalls.length > 0) {
      const slowApis = this.metrics.apiCalls.filter((api) => api.duration > 2000);
      if (slowApis.length > 0) {
        score -= 15;
        recommendations.push(`استدعاءات API بطيئة: ${slowApis.length} استدعاء تجاوز 2 ثانية`);
      }
    }

    // تحديد التصنيف
    let rating: 'good' | 'needs-improvement' | 'poor';
    if (score >= 90) {
      rating = 'good';
    } else if (score >= 50) {
      rating = 'needs-improvement';
    } else {
      rating = 'poor';
    }

    return { score: Math.max(0, score), rating, recommendations };
  }

  // إنشاء التقرير
  private generateReport(page: string): PerformanceReport {
    const { score, rating, recommendations } = this.calculateScore();

    const report: PerformanceReport = {
      timestamp: Date.now(),
      page,
      metrics: { ...this.metrics },
      score,
      rating,
      recommendations,
    };

    this.reports.push(report);

    // الاحتفاظ بآخر 10 تقارير فقط
    if (this.reports.length > 10) {
      this.reports = this.reports.slice(-10);
    }

    // طباعة التقرير في الكونسول
    console.log('[PerformanceMonitor] Report:', report);

    // إرسال للتحليل (إذا لزم الأمر)
    this.sendReport(report);

    return report;
  }

  // إرسال التقرير للتحليل
  private async sendReport(report: PerformanceReport) {
    // يمكن إرسال التقرير لـ backend للتحليل
    // مثال: await fetch('/api/analytics/performance', { method: 'POST', body: JSON.stringify(report) });
    console.log('[PerformanceMonitor] Report generated:', report);
  }

  // الحصول على آخر تقرير
  getLatestReport(): PerformanceReport | null {
    return this.reports.length > 0 ? this.reports[this.reports.length - 1] : null;
  }

  // الحصول على جميع التقارير
  getAllReports(): PerformanceReport[] {
    return [...this.reports];
  }

  // الحصول على إحصائيات سريعة
  getQuickStats() {
    const latest = this.getLatestReport();
    if (!latest) return null;

    return {
      score: latest.score,
      rating: latest.rating,
      lcp: latest.metrics.lcp,
      fid: latest.metrics.fid,
      cls: latest.metrics.cls,
      ttfb: latest.metrics.ttfb,
      pageLoadTime: latest.metrics.pageLoadTime,
      apiCalls: latest.metrics.apiCalls.length,
    };
  }

  // مسح التقارير
  clearReports() {
    this.reports = [];
  }
}

// تصدير نسخة وحيدة
export const performanceMonitor = new PerformanceMonitor();
