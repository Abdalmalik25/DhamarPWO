// ============================================================
// Live Statistics Service - إحصائيات حية متجددة
// ============================================================

export interface StatItem {
  id: string;
  label: string;
  value: number;
  target: number;
  unit?: string;
  icon?: string;
  color?: string;
  lastUpdated: number;
  trend?: 'up' | 'down' | 'stable';
}

interface LiveStatsConfig {
  refreshInterval: number; // milliseconds
  enableAnimations: boolean;
  enableTrends: boolean;
  cacheDuration: number;
}

class LiveStatisticsService {
  private config: LiveStatsConfig = {
    refreshInterval: 5000, // 5 ثواني لتسريع المحاكاة التفاعلية
    enableAnimations: true,
    enableTrends: true,
    cacheDuration: 60000, // دقيقة واحدة
  };

  private stats: Map<string, StatItem> = new Map();
  private cache: Map<string, { data: StatItem; timestamp: number }> = new Map();
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(stats: StatItem[]) => void> = new Set();

  constructor() {
    this.init();
  }

  // تهيئة الخدمة
  private init() {
    // تحميل الإحصائيات المحفوظة
    this.loadCachedStats();

    // بدء التحديث الدوري
    this.startAutoRefresh();
  }

  // تحميل الإحصائيات المخزنة
  private loadCachedStats() {
    try {
      const cached = localStorage.getItem('liveStats');
      if (cached) {
        const data = JSON.parse(cached) as Record<string, StatItem>;
        Object.entries(data).forEach(([id, stat]) => {
          this.stats.set(id, stat);
        });
      }
    } catch (error) {
      console.warn('[LiveStats] Failed to load cache:', error);
    }
  }

  // حفظ الإحصائيات في التخزين المحلي
  private saveToCache() {
    try {
      const data: Record<string, StatItem> = {};
      this.stats.forEach((stat, id) => {
        data[id] = stat;
      });
      localStorage.setItem('liveStats', JSON.stringify(data));
    } catch (error) {
      console.warn('[LiveStats] Failed to save cache:', error);
    }
  }

  // بدء التحديث التلقائي
  startAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(() => {
      this.refresh();
    }, this.config.refreshInterval);
  }

  // إيقاف التحديث التلقائي
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // تحديث الإحصائيات
  async refresh() {
    try {
      // هنا يمكن استدعاء API للحصول على الإحصائيات المحدثة
      // مثال: const response = await fetch('/api/stats/live');

      // محاكاة تحديث البيانات
      await this.fetchLiveStats();

      // إشعار المستمعين
      this.notifyListeners();

      // حفظ في التخزين المحلي
      this.saveToCache();
    } catch (error) {
      console.error('[LiveStats] Refresh failed:', error);
    }
  }

  private async fetchLiveStats() {
    // محاكاة نظام إدارة محتوى ديناميكي (Headless CMS Simulation)

    const updateOrInit = (
      id: string,
      label: string,
      baseVal: number,
      target: number,
      unit: string,
      icon: string,
      color: string,
    ) => {
      const existing = this.stats.get(id);
      const increment = Math.floor(Math.random() * 3); // زيادة عشوائية (0, 1, 2)
      const newValue = existing ? existing.value + increment : baseVal;
      // ضمان عدم تجاوز النسبة المئوية 100
      const finalValue = unit === '%' ? Math.min(newValue, 100) : newValue;

      return {
        id,
        label,
        target,
        unit,
        icon,
        color,
        value: finalValue,
        lastUpdated: Date.now(),
        trend: increment > 0 ? 'up' : ('stable' as 'up' | 'down' | 'stable'),
      };
    };

    const statsToUpdate: StatItem[] = [
      updateOrInit(
        'transactions_completed',
        'المعاملات المنجزة',
        1247,
        1500,
        'معاملة',
        'CheckCircle',
        '#10b981',
      ),
      updateOrInit('transactions_pending', 'قيد الانتظار', 23, 100, 'معاملة', 'Clock', '#f59e0b'),
      updateOrInit('satisfaction_rate', 'نسبة الرضا', 94, 100, '%', 'Smile', '#d4af37'),
      updateOrInit('active_users', 'الزوار النشطون', 156, 500, 'زائر', 'Users', '#3b82f6'),
      updateOrInit('services_count', 'الخدمات المتاحة', 68, 100, 'خدمة', 'Layers', '#8b5cf6'),
    ];

    // تحديث الإحصائيات
    statsToUpdate.forEach((stat) => {
      this.stats.set(stat.id, stat);
    });
  }

  // الحصول على إحصائية واحدة
  getStat(id: string): StatItem | undefined {
    return this.stats.get(id);
  }

  // الحصول على جميع الإحصائيات
  getAllStats(): StatItem[] {
    return Array.from(this.stats.values()).sort((a, b) => b.lastUpdated - a.lastUpdated);
  }

  // الحصول على إحصائيات حسب الفئة
  getStatsByCategory(_category: string): StatItem[] {
    // يمكن إضافة تصنيف للإحصائيات
    return this.getAllStats();
  }

  // تحديث إحصائية يدوياً
  updateStat(id: string, updates: Partial<StatItem>) {
    const existing = this.stats.get(id);
    if (existing) {
      this.stats.set(id, {
        ...existing,
        ...updates,
        lastUpdated: Date.now(),
      });
      this.notifyListeners();
      this.saveToCache();
    }
  }

  // إضافة إحصائية جديدة
  addStat(stat: StatItem) {
    this.stats.set(stat.id, stat);
    this.saveToCache();
    this.notifyListeners();
  }

  // حذف إحصائية
  removeStat(id: string) {
    this.stats.delete(id);
    this.saveToCache();
    this.notifyListeners();
  }

  // الاشتراك في التحديثات
  subscribe(listener: (stats: StatItem[]) => void) {
    this.listeners.add(listener);

    // إرسال البيانات الحالية فوراً
    listener(this.getAllStats());

    // إلغاء الاشتراك
    return () => {
      this.listeners.delete(listener);
    };
  }

  // إشعار المستمعين
  private notifyListeners() {
    const stats = this.getAllStats();

    this.listeners.forEach((listener) => {
      try {
        listener(stats);
      } catch (error) {
        console.error('[LiveStats] Listener error:', error);
      }
    });
  }

  // تحديث الإعدادات
  updateConfig(config: Partial<LiveStatsConfig>) {
    this.config = { ...this.config, ...config };

    // إعادة تشغيل التحديث إذا تغير الفاصل الزمني
    if (config.refreshInterval && this.refreshTimer) {
      this.stopAutoRefresh();
      this.startAutoRefresh();
    }
  }

  // الحصول على الإحصائيات كملخص
  getSummary() {
    const stats = this.getAllStats();

    return {
      total: stats.length,
      active: stats.filter((s) => Date.now() - s.lastUpdated < this.config.cacheDuration).length,
      avgValue: stats.reduce((sum, s) => sum + s.value, 0) / stats.length || 0,
      lastUpdate: Math.max(...stats.map((s) => s.lastUpdated), 0),
    };
  }

  // مسح جميع الإحصائيات
  clear() {
    this.stats.clear();
    this.cache.clear();
    this.saveToCache();
    this.notifyListeners();
  }

  // التحقق من صحة البيانات
  validateStats(): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];

    this.stats.forEach((stat, id) => {
      if (stat.value >= 0 && stat.label && stat.id) {
        valid.push(id);
      } else {
        invalid.push(id);
      }
    });

    return { valid, invalid };
  }

  // تدمير الخدمة
  destroy() {
    this.stopAutoRefresh();
    this.listeners.clear();
    this.stats.clear();
    this.cache.clear();
  }
}

// تصدير نسخة وحيدة
export const liveStatistics = new LiveStatisticsService();
