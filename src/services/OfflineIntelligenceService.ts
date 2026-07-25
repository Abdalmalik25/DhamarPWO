// ============================================================
// Offline Intelligence Service - كشف المناطق بدون تغطية
// ============================================================

interface OfflineConfig {
  checkInterval: number;
  enableAutoSwitch: boolean;
  enableNotifications: boolean;
  cacheStrategy: 'aggressive' | 'moderate' | 'minimal';
}

interface NetworkStatus {
  isOnline: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  lastChecked: number;
}

interface OfflineQueue {
  actions: Array<{
    id: string;
    type: string;
    payload: any;
    timestamp: number;
    retries: number;
  }>;
  maxRetries: number;
}

class OfflineIntelligenceService {
  private config: OfflineConfig = {
    checkInterval: 30000,
    enableAutoSwitch: true,
    enableNotifications: true,
    cacheStrategy: 'moderate',
  };

  private networkStatus: NetworkStatus = {
    isOnline: navigator.onLine,
    lastChecked: Date.now(),
  };

  private offlineQueue: OfflineQueue = {
    actions: [],
    maxRetries: 3,
  };

  private listeners: Set<(status: NetworkStatus) => void> = new Set();
  private checkTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.init();
  }

  // تهيئة الخدمة
  private init() {
    // الاستماع لتغييرات الشبكة
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // التحقق من الاتصال دورياً
    this.startPeriodicCheck();

    // الحصول على معلومات الاتصال
    this.updateConnectionInfo();

    // معالجة الأحداث المعلقة
    this.processOfflineQueue();
  }

  // معالجة العودة للاتصال
  private handleOnline = () => {
    console.log('[OfflineIntelligence] Back online');
    this.networkStatus.isOnline = true;
    this.networkStatus.lastChecked = Date.now();

    this.notifyListeners();

    // معالجة الأحداث المعلقة
    this.processOfflineQueue();

    // إشعار
    if (this.config.enableNotifications) {
      this.showNotification('تم استعادة الاتصال', 'success');
    }
  };

  // معالجة فقدان الاتصال
  private handleOffline = () => {
    console.log('[OfflineIntelligence] Gone offline');
    this.networkStatus.isOnline = false;
    this.networkStatus.lastChecked = Date.now();

    this.notifyListeners();

    // إشعار
    if (this.config.enableNotifications) {
      this.showNotification('تم فقدان الاتصال - التطبيق يعمل في وضع عدم الاتصال', 'warning');
    }
  };

  // بدء التحقق الدوري
  private startPeriodicCheck() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }

    this.checkTimer = setInterval(() => {
      this.updateConnectionInfo();
    }, this.config.checkInterval);
  }

  // تحديث معلومات الاتصال
  private updateConnectionInfo() {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      this.networkStatus.connectionType = connection.type || 'unknown';
      this.networkStatus.effectiveType = connection.effectiveType || 'unknown';
      this.networkStatus.downlink = connection.downlink || 0;
      this.networkStatus.rtt = connection.rtt || 0;
    }

    this.networkStatus.isOnline = navigator.onLine;
    this.networkStatus.lastChecked = Date.now();

    this.notifyListeners();
  }

  // إضافة إجراء للقائمة المعلقة
  queueAction(type: string, payload: any) {
    const action = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
      retries: 0,
    };

    this.offlineQueue.actions.push(action);
    console.log('[OfflineIntelligence] Action queued:', action);
  }

  // معالجة القائمة المعلقة
  private async processOfflineQueue() {
    if (!this.networkStatus.isOnline) {
      return;
    }

    const pendingActions = this.offlineQueue.actions.filter(
      (action) => action.retries < this.offlineQueue.maxRetries,
    );

    for (const action of pendingActions) {
      try {
        await this.executeAction(action);
        this.offlineQueue.actions = this.offlineQueue.actions.filter((a) => a.id !== action.id);
      } catch (error) {
        console.error('[OfflineIntelligence] Failed to execute action:', action, error);
        action.retries++;
      }
    }
  }

  // تنفيذ إجراء
  private async executeAction(action: { type: string; payload: any }) {
    // يمكن تنفيذ الإجراءات المختلفة هنا
    console.log('[OfflineIntelligence] Executing action:', action.type, action.payload);

    // مثال: إرسال بيانات للسيرفر
    // await fetch('/api/actions', {
    //   method: 'POST',
    //   body: JSON.stringify(action.payload),
    // });
  }

  // إشعار
  private showNotification(message: string, type: 'success' | 'warning' | 'error' | 'info') {
    if (!this.config.enableNotifications) return;

    // استخدام Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('مكتب الأشغال العامة والطرق', {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }

    // أو استخدام نظام الإشعارات الداخلي
    console.log(`[OfflineIntelligence] ${type}: ${message}`);
  }

  // الاشتراك في التغييرات
  subscribe(listener: (status: NetworkStatus) => void) {
    this.listeners.add(listener);

    // إرسال الحالة الحالية
    listener(this.networkStatus);

    return () => {
      this.listeners.delete(listener);
    };
  }

  // إشعار المستمعين
  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.networkStatus);
      } catch (error) {
        console.error('[OfflineIntelligence] Listener error:', error);
      }
    });
  }

  // الحصول على حالة الشبكة
  getStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  // التحقق من الاتصال
  isOnline(): boolean {
    return this.networkStatus.isOnline;
  }

  // الحصول على سرعة الاتصال
  getConnectionSpeed(): 'slow' | 'medium' | 'fast' | 'unknown' {
    if (!this.networkStatus.effectiveType) return 'unknown';

    const effectiveType = this.networkStatus.effectiveType;

    switch (effectiveType) {
      case '4g':
        return 'fast';
      case '3g':
        return 'medium';
      case '2g':
      case 'slow-2g':
        return 'slow';
      default:
        return 'unknown';
    }
  }

  // تحديث الإعدادات
  updateConfig(config: Partial<OfflineConfig>) {
    this.config = { ...this.config, ...config };

    if (config.checkInterval && this.checkTimer) {
      this.startPeriodicCheck();
    }
  }

  // تدمير الخدمة
  destroy() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }

    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);

    this.listeners.clear();
  }
}

// تصدير نسخة وحيدة
export const offlineIntelligence = new OfflineIntelligenceService();
