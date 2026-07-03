/**
 * نظام مراقبة الصحة والموثوقية
 * مكتب الأشغال العامة والطرق - محافظة ذمار
 */

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  error?: string;
  timestamp: Date;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheck[];
  lastChecked: Date;
}

// فاحص صحة الاتصال بقاعدة البيانات
export async function checkDatabaseHealth(url?: string): Promise<HealthCheck> {
  const start = performance.now();
  const check: HealthCheck = {
    name: 'database',
    status: 'healthy',
    timestamp: new Date(),
  };

  try {
    const supabaseUrl = url || import.meta.env.VITE_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error('Supabase URL غير معرف');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    check.latency = Math.round(performance.now() - start);

    if (response.status >= 400) {
      check.status = 'unhealthy';
      check.error = `HTTP ${response.status}`;
    }
  } catch (error) {
    check.status = 'unhealthy';
    check.error = error instanceof Error ? error.message : 'خطأ غير معروف';
    check.latency = Math.round(performance.now() - start);
  }

  return check;
}

// فاحص صحة الاتصال بالشبكة
export async function checkNetworkHealth(): Promise<HealthCheck> {
  const start = performance.now();
  const check: HealthCheck = {
    name: 'network',
    status: 'healthy',
    timestamp: new Date(),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    });

    clearTimeout(timeout);
    check.latency = Math.round(performance.now() - start);
    check.status = 'healthy';
  } catch {
    check.status = 'degraded';
    check.error = 'الشبكة غير متاحة أو بطيئة';
    check.latency = Math.round(performance.now() - start);
  }

  return check;
}

// فاحص صحة التخزين المحلي
export async function checkStorageHealth(): Promise<HealthCheck> {
  const start = performance.now();
  const check: HealthCheck = {
    name: 'storage',
    status: 'healthy',
    timestamp: new Date(),
  };

  try {
    const testKey = '__health_check__';
    const testValue = Date.now();

    localStorage.setItem(testKey, testValue.toString());
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    if (retrieved !== testValue.toString()) {
      throw new Error('فشل في قراءة/كتابة التخزين المحلي');
    }

    check.latency = Math.round(performance.now() - start);
    check.status = 'healthy';
  } catch (error) {
    check.status = 'unhealthy';
    check.error = error instanceof Error ? error.message : 'خطأ في التخزين المحلي';
    check.latency = Math.round(performance.now() - start);
  }

  return check;
}

// تشغيل جميع الفحوصات
export async function runAllHealthChecks(url?: string): Promise<SystemHealth> {
  const checks = await Promise.all([
    checkDatabaseHealth(url),
    checkNetworkHealth(),
    checkStorageHealth(),
  ]);

  const failedChecks = checks.filter((c) => c.status === 'unhealthy').length;
  const degradedChecks = checks.filter((c) => c.status === 'degraded').length;

  let overall: SystemHealth['overall'] = 'healthy';
  if (failedChecks > 0) {
    overall = 'unhealthy';
  } else if (degradedChecks > 0) {
    overall = 'degraded';
  }

  return {
    overall,
    checks,
    lastChecked: new Date(),
  };
}

// مدير حالة الصحة
export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthStatus: SystemHealth | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private listeners: ((health: SystemHealth) => void)[] = [];

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  subscribe(listener: (health: SystemHealth) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    const currentStatus = this.healthStatus;
    if (currentStatus) {
      this.listeners.forEach((listener) => listener(currentStatus));
    }
  }

  async check(url?: string): Promise<SystemHealth> {
    this.healthStatus = await runAllHealthChecks(url);
    this.notifyListeners();
    return this.healthStatus;
  }

  startPeriodicCheck(intervalMs: number = 300000) {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.check();
    }, intervalMs);
  }

  stopPeriodicCheck() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// واجهة برمجة بسيطة للوصول لحالة الصحة
export const healthMonitor = HealthMonitor.getInstance();
