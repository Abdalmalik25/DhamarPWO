// ============================================================
// Haptic Feedback Service - اهتزازات ذكية للتفاعلات
// ============================================================

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticPattern {
  duration: number;
  interval?: number;
  count?: number;
}

interface HapticConfig {
  enabled: boolean;
  defaultIntensity: number;
  patterns: Record<HapticType, HapticPattern>;
}

class HapticFeedbackService {
  private config: HapticConfig = {
    enabled: true,
    defaultIntensity: 0.5,
    patterns: {
      light: { duration: 10 },
      medium: { duration: 20 },
      heavy: { duration: 30 },
      success: { duration: 15, count: 2, interval: 50 },
      warning: { duration: 20, count: 3, interval: 40 },
      error: { duration: 30, count: 3, interval: 30 },
    },
  };

  private isSupported = false;
  private lastHaptic = 0;
  private throttleMs = 50; // منع الاهتزاز المتكرر

  constructor() {
    this.checkSupport();
  }

  // التحقق من الدعم
  private checkSupport() {
    // التحقق من Vibration API
    if ('vibrate' in navigator) {
      this.isSupported = true;
    }

    // التحقق من Feedback API (تجريبي)
    if ('vibrate' in navigator || 'feedback' in navigator) {
      this.isSupported = true;
    }
  }

  // تنفيذ الاهتزاز
  private vibrate(pattern: HapticPattern) {
    if (!this.config.enabled || !this.isSupported) return;

    const now = Date.now();
    if (now - this.lastHaptic < this.throttleMs) return;

    this.lastHaptic = now;

    try {
      const { vibrate } = navigator;

      if (pattern.count && pattern.interval) {
        // اهتزاز متعدد
        const sequence: number[] = [];
        for (let i = 0; i < pattern.count; i++) {
          sequence.push(pattern.duration);
          if (i < pattern.count - 1) {
            sequence.push(pattern.interval);
          }
        }
        vibrate(sequence);
      } else {
        // اهتزاز واحد
        vibrate(pattern.duration);
      }
    } catch (error) {
      console.warn('[Haptic] Vibration failed:', error);
    }
  }

  // اهتزاز خفيف (للتنقل بين الصفحات)
  light() {
    this.vibrate(this.config.patterns.light);
  }

  // اهتزاز متوسط (للأزرار)
  medium() {
    this.vibrate(this.config.patterns.medium);
  }

  // اهتزاز قوي (للإجراءات المهمة)
  heavy() {
    this.vibrate(this.config.patterns.heavy);
  }

  // اهتزاز نجاح
  success() {
    this.vibrate(this.config.patterns.success);
  }

  // اهتزاز تحذير
  warning() {
    this.vibrate(this.config.patterns.warning);
  }

  // اهتزاز خطأ
  error() {
    this.vibrate(this.config.patterns.error);
  }

  // اهتزاز مخصص
  custom(pattern: HapticType | Partial<HapticPattern>) {
    if (typeof pattern === 'string') {
      this.vibrate(this.config.patterns[pattern]);
    } else {
      this.vibrate({ ...this.config.patterns.light, ...pattern });
    }
  }

  // سحب للتحديث (Pull to Refresh)
  pullToRefresh() {
    this.custom({ duration: 15, count: 1 });
  }

  // فتح القائمة (Drawer)
  openDrawer() {
    this.light();
  }

  // إغلاق القائمة
  closeDrawer() {
    this.light();
  }

  // سجل للتنقل (Swipe Navigation)
  swipe() {
    this.light();
  }

  // ضغط زر
  buttonPress() {
    this.medium();
  }

  // ضغط زر طويل
  longPress() {
    this.heavy();
  }

  // تبديل الوضع الليلي
  toggleTheme() {
    this.success();
  }

  // تحديث البيانات
  refresh() {
    this.custom({ duration: 20, count: 2, interval: 100 });
  }

  // تحميل
  loading() {
    this.custom({ duration: 10, count: 3, interval: 200 });
  }

  // تم التحميل
  loaded() {
    this.success();
  }

  // خطأ في التحميل
  loadError() {
    this.error();
  }

  // تبديل الإعداد
  toggle(enabled?: boolean) {
    this.config.enabled = enabled ?? !this.config.enabled;

    if (!this.config.enabled && 'vibrate' in navigator) {
      // إيقاف أي اهتزاز قائم
      (navigator as any).vibrate(0);
    }
  }

  // التحقق إذا كان مفعل
  isEnabled() {
    return this.config.enabled && this.isSupported;
  }

  // تحديث الشدة
  setIntensity(intensity: number) {
    this.config.defaultIntensity = Math.max(0, Math.min(1, intensity));
  }

  // تحديث نمط اهتزاز
  updatePattern(type: HapticType, pattern: Partial<HapticPattern>) {
    this.config.patterns[type] = { ...this.config.patterns[type], ...pattern };
  }
}

// تصدير نسخة وحيدة
export const hapticFeedback = new HapticFeedbackService();
