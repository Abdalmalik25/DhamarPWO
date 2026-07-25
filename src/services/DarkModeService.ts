// ============================================================
// Dark Mode Pro Service - وضع ليلي كامل مع ألوان مخصصة
// ============================================================

type Theme = 'light' | 'dark' | 'auto';

interface ThemeColors {
  // خلفيات
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgCard: string;

  // نصوص
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // حدود
  borderPrimary: string;
  borderSecondary: string;

  // ألوان خاصة
  gold: string;
  goldLight: string;
  white: string;

  // ألوان الحالة
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface DarkModeConfig {
  theme: Theme;
  colors?: ThemeColors;
  transitionDuration: number;
  saveToStorage: boolean;
}

class DarkModeService {
  private config: DarkModeConfig = {
    theme: 'auto',
    transitionDuration: 300,
    saveToStorage: true,
  };

  private currentTheme: 'light' | 'dark' = 'light';
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Set<(isDark: boolean) => void> = new Set();

  // ألوان الوضع الفاتح
  private lightColors: ThemeColors = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f9fafb',
    bgTertiary: '#f3f4f6',
    bgCard: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    borderPrimary: '#e5e7eb',
    borderSecondary: '#d1d5db',
    gold: '#d4af37',
    goldLight: '#fbbf24',
    white: '#ffffff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  };

  // ألوان الوضع الليلي
  private darkColors: ThemeColors = {
    bgPrimary: '#0a1628',
    bgSecondary: '#0f1f38',
    bgTertiary: '#1a2744',
    bgCard: '#152238',
    textPrimary: '#f9fafb',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    borderPrimary: '#1e3a5f',
    borderSecondary: '#2d4a6f',
    gold: '#d4af37',
    goldLight: '#fbbf24',
    white: '#ffffff',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  };

  constructor() {
    this.init();
  }

  // تهيئة الخدمة
  private init() {
    // تحميل الإعدادات المحفوظة
    if (this.config.saveToStorage) {
      const saved = localStorage.getItem('theme');
      if (saved) {
        this.config.theme = saved as Theme;
      }
    }

    // الاستماع لتغييرات النظام
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }

    // تطبيق الموضوع الأولي
    this.applyTheme();
  }

  // معالجة تغيير ثيم النظام
  private handleSystemThemeChange = (_event: MediaQueryListEvent) => {
    if (this.config.theme === 'auto') {
      this.setTheme('auto');
    }
  };

  // تعيين الثيم
  setTheme(theme: Theme) {
    this.config.theme = theme;

    if (this.config.saveToStorage) {
      localStorage.setItem('theme', theme);
    }

    this.applyTheme();
  }

  // تطبيق الثيم
  private applyTheme() {
    let isDark = false;

    if (this.config.theme === 'auto') {
      isDark = this.mediaQuery?.matches ?? false;
    } else {
      isDark = this.config.theme === 'dark';
    }

    this.currentTheme = isDark ? 'dark' : 'light';
    const colors = isDark ? this.darkColors : this.lightColors;

    this.config.colors = colors;

    // تطبيق CSS variables
    this.applyCSSVariables(colors);

    // إضافة/إزالة class من body
    document.body.classList.toggle('dark-mode', isDark);

    // تحديث attr لـ HTML
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // إشعار المستمعين
    this.notifyListeners(isDark);
  }

  // تطبيق CSS Variables
  private applyCSSVariables(colors: ThemeColors) {
    const root = document.documentElement;

    // Backgrounds
    root.style.setProperty('--color-bg-primary', colors.bgPrimary);
    root.style.setProperty('--color-bg-secondary', colors.bgSecondary);
    root.style.setProperty('--color-bg-tertiary', colors.bgTertiary);
    root.style.setProperty('--color-bg-card', colors.bgCard);

    // Texts
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-tertiary', colors.textTertiary);

    // Borders
    root.style.setProperty('--color-border-primary', colors.borderPrimary);
    root.style.setProperty('--color-border-secondary', colors.borderSecondary);

    // Special
    root.style.setProperty('--color-gold', colors.gold);
    root.style.setProperty('--color-gold-light', colors.goldLight);
    root.style.setProperty('--color-white', colors.white);

    // Status
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-info', colors.info);

    // إضافة transition
    root.style.setProperty(
      '--theme-transition',
      `all ${this.config.transitionDuration}ms ease-in-out`,
    );
  }

  // إشعار المستمعين
  private notifyListeners(isDark: boolean) {
    this.listeners.forEach((listener) => {
      try {
        listener(isDark);
      } catch {
        console.error('[DarkMode] Listener error');
      }
    });
  }

  // التبديل بين الوضعين
  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  // الحصول على الثيم الحالي
  getTheme(): Theme {
    return this.config.theme;
  }

  // الحصول على الوضع الحالي
  isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  // الحصول على الألوان الحالية
  getColors(): ThemeColors {
    const colors =
      this.config.colors || (this.currentTheme === 'dark' ? this.darkColors : this.lightColors);
    return { ...colors };
  }

  // الاشتراك في التغييرات
  subscribe(listener: (isDark: boolean) => void) {
    this.listeners.add(listener);

    // إلغاء الاشتراك
    return () => {
      this.listeners.delete(listener);
    };
  }

  // تحديث مدة الانتقال
  setTransitionDuration(duration: number) {
    this.config.transitionDuration = duration;
    document.documentElement.style.setProperty(
      '--theme-transition',
      `all ${duration}ms ease-in-out`,
    );
  }

  // التحقق من دعم الوضع الليلي
  isSupported() {
    return 'matchMedia' in window && localStorage !== undefined;
  }

  // إعادة تعيين الإعدادات
  reset() {
    this.config.theme = 'auto';
    if (this.config.saveToStorage) {
      localStorage.removeItem('theme');
    }
    this.applyTheme();
  }
}

// تصدير نسخة وحيدة
export const darkMode = new DarkModeService();
