// ============================================================
// types/page.ts - العمارة النوعية المتقدمة (Enterprise v3.0)
// متوافق مع: React 19 | TypeScript 5.8+ | Vite | Supabase
// ============================================================
/* eslint-disable @typescript-eslint/no-namespace */
/* cspell:disable */

// ============================================================
// 1. مساحات الأسماء (Namespaces) لتنظيم أفضل
// ============================================================
export namespace App {
  /**
   * الصفحات الأساسية للتطبيق.
   * استخدام `Template Literal Type` لزيادة الأمان النوعي.
   */
  export type Page =
    | 'home'
    | 'services'
    | 'forms'
    | 'about'
    | 'contact'
    | 'track'
    | 'documents'
    | 'guidelines'
    | 'news'
    | 'gallery'
    | 'privacy'
    | 'terms';

  /**
   * خيارات التنقل (مع دعم `replace` و `state`).
   */
  export interface NavigateOptions {
    replace?: boolean;
    state?: Record<string, unknown>;
  }

  /**
   * إعادة توجيه الصفحات (لتحقيق المرونة).
   */
  export const PAGE_REDIRECTS: Partial<Record<Page, Page>> = {
    news: 'home',
    gallery: 'home',
  } as const;

  /**
   * وظيفة آمنة لحل مسارات الصفحات.
   */
  export function resolvePage(page: Page): Page {
    return PAGE_REDIRECTS[page] ?? page;
  }
}

// ============================================================
// 2. أنواع البيانات الأساسية (Core Data Types)
// ============================================================
export namespace Data {
  /**
   * فئات الوثائق (مستخدمة بكثرة في لوحات التحكم).
   */
  export type DocumentCategory = 'دليل' | 'فصل' | 'نموذج' | 'صورة' | 'مرجع' | 'أخرى';

  /**
   * أنواع الملفات المدعومة.
   */
  export type FileType = 'pdf' | 'image' | 'doc' | 'folder';

  /**
   * حالة معاملة التتبع (منظمة بدقة).
   */
  export type SubmissionStatus =
    | 'pending' // قيد الانتظار
    | 'processing' // قيد المعالجة
    | 'approved' // معتمدة
    | 'rejected' // مرفوضة
    | 'completed'; // منتهية
}

// ============================================================
// 3. النماذج الأساسية (Core Models) - مع `Readonly` للحماية
// ============================================================
export namespace Models {
  // --- 3.1 الخدمات (Services) ---
  export interface Service {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly icon: React.ElementType;
    readonly color: string;
    readonly href: App.Page;
    readonly category: string;
  }

  // --- 3.2 الإعلانات والأخبار (Announcements) ---
  export interface Announcement {
    readonly id: string;
    readonly date: string;
    readonly title: string;
    readonly description: string;
    priority?: 'high' | 'normal' | 'low';
  }

  // --- 3.3 الأسئلة الشائعة (FAQ) ---
  export interface FAQ {
    readonly id: string;
    readonly question: string;
    readonly answer: string;
  }

  // --- 3.4 فريق العمل (Team) ---
  export interface TeamMember {
    readonly name: string;
    readonly role: string;
    readonly phone: string;
    readonly email?: string;
  }

  // --- 3.5 الشركاء (Partners) ---
  export interface Partner {
    readonly id: string;
    readonly name: string;
    readonly type?: string;
    readonly logo?: string;
  }

  // --- 3.6 الإحصائيات (Stats) ---
  export interface Stat {
    readonly value: string;
    readonly label: string;
    readonly icon?: React.ElementType;
    readonly suffix?: string;
    readonly color?: string;
  }

  // --- 3.7 الدليل الإرشادي (Guidelines) ---
  export interface Guideline {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly icon: React.ElementType;
    readonly color?: string;
  }

  // --- 3.8 وثائق المكتبة (Library Items) ---
  export interface GuidelineItem {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly category: Data.DocumentCategory;
    readonly type: Data.FileType;
    readonly url: string;
    readonly pages?: number;
    readonly size?: string;
    readonly updatedAt?: string;
    readonly featured?: boolean;
    readonly icon?: string; // Lucide icon name
  }

  // --- 3.9 النماذج الرسمية (Forms) ---
  export interface FormItem {
    readonly ref: string;
    readonly title: string;
    readonly description: string;
    readonly url?: string;
  }
}

// ============================================================
// 4. أنظمة الألوان والتصميم (Design System)
// ============================================================
export namespace Design {
  /**
   * فئات الألوان الخاصة بـ Tailwind / CSS.
   */
  export interface ColorClasses {
    readonly bg: string;
    readonly border: string;
    readonly badge: string;
    readonly icon: string;
    readonly lightBg?: string;
    readonly gradient?: string;
  }

  /**
   * خريطة الألوان لكل فئة (استخدام `Record` الآمن).
   */
  export type ColorMap = Record<string, ColorClasses>;
}

// ============================================================
// 5. المصادقة والأمان (Auth & Security)
// ============================================================
export namespace Auth {
  /**
   * صلاحيات الصفحات (مستوى متقدم من التحكم).
   * يمكن أن يكون لكل صفحة مصفوفة من الصلاحيات المسموحة.
   */
  export type PagePermission = {
    readonly page: App.Page;
    readonly roles: ReadonlyArray<'admin' | 'engineer' | 'guest'>;
  };

  /**
   * طلب المصادقة (Voyage / JWT).
   */
  export interface Request {
    readonly action: string;
    readonly data: unknown;
  }

  /**
   * استجابة المصادقة المحسنة (مع `role` و `permissions`).
   */
  export interface Response {
    readonly success: boolean;
    readonly token?: string;
    readonly error?: string;
    readonly user?: {
      readonly id: string;
      readonly email: string;
      readonly role?: 'admin' | 'engineer' | 'guest';
      readonly permissions?: ReadonlyArray<string>;
    };
  }
}

// ============================================================
// 6. قاعدة البيانات والـ API (Supabase Integration)
// ============================================================
export namespace Database {
  /**
   * أنواع البيانات التي يتم إرجاعها من Supabase.
   * يمكن توسيعها لتشمل باقي الجداول.
   */
  export type Tables = {
    services: Models.Service;
    announcements: Models.Announcement;
    guidelines: Models.GuidelineItem;
    users: Auth.Response['user'];
  };

  /**
   * نوع جزئي آمن للبيانات القادمة من قاعدة البيانات.
   * يضمن أن التطبيق لا ينهار إذا تغير هيكل الجدول.
   */
  export type PartialRecord<T extends keyof Tables> = Partial<Tables[T]>;
}

// ============================================================
// 7. نظام التتبع (Tracking System)
// ============================================================
export namespace Tracking {
  /**
   * نتيجة البحث عن معاملة (تستخدم في `TrackPage`).
   */
  export interface Result {
    submission: import('../lib/supabase').FormSubmission | null;
    notFound: boolean;
  }
}

// ============================================================
// 8. أنواع المصادر الخارجية (External Integrations)
// ============================================================
export namespace External {
  /**
   * أنواع `react-hook-form` للتحقق من صحة النماذج.
   */
  export type FormErrors<T extends Record<string, unknown>> = {
    [K in keyof T]?: string;
  };

  /**
   * أنواع `Zod` للتحقق من صحة البيانات (اختياري).
   * يمكن استخدام هذا لإنشاء `zod` schemas.
   */
  export type ZodType<T> = {
    parse: (data: unknown) => T;
    safeParse: (data: unknown) => { success: boolean; data?: T; error?: Error };
  };
}

// ============================================================
// 9. أنواع الأداة المساعدة (Utility Types)
// ============================================================
export namespace Utils {
  /**
   * نوع `satisfies` للتحقق من أن البيانات مطابقة للنوع.
   * أفضل من `as` لأنه يحافظ على النوع الحقيقي.
   */
  export type Satisfies<T, U> = T extends U ? T : never;

  /**
   * نوع `DeepPartial` لجعل الكائنات عميقة الاختيارية.
   */
  export type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
}

// ============================================================
// 10. تصدير سريع للأنواع الأكثر استخداماً (Quick Exports)
// ============================================================

export type Page = App.Page;
export type Service = Models.Service;
export type Announcement = Models.Announcement;
export type FAQ = Models.FAQ;
export type TeamMember = Models.TeamMember;
export type Partner = Models.Partner;
export type Stat = Models.Stat;
export type Guideline = Models.Guideline;
export type GuidelineItem = Models.GuidelineItem;
export type FormItem = Models.FormItem;
export type TrackingResult = Tracking.Result;
export type NavigateOptions = App.NavigateOptions;
export type ColorMap = Design.ColorMap;
export type ColorClasses = Design.ColorClasses;
export type SubmissionStatus = Data.SubmissionStatus;
export type DocumentCategory = Data.DocumentCategory;
export type FileType = Data.FileType;

// ============================================================
// 11. دالة التحقق من النوع (Type Guard)
// ============================================================

/**
 * دالة للتحقق مما إذا كانت قيمة معينة هي صفحة صالحة.
 */
export function isPage(value: unknown): value is Page {
  return (
    typeof value === 'string' &&
    [
      'home',
      'services',
      'forms',
      'about',
      'contact',
      'track',
      'documents',
      'guidelines',
      'news',
      'gallery',
    ].includes(value)
  );
}

// ============================================================
// ملاحظة للمطورين (Developer Notes)
// ============================================================
/**
 * أفضل الممارسات لهذا الملف:
 * 1. استخدم `satisfies` بدلاً من `as` لتجنب فقدان النوع.
 * 2. استخدم `Readonly` للخصائص التي لا يجب أن تتغير بعد التحميل.
 * 3. استخدم `Namespace` لتنظيم الأنواع المتشابهة.
 * 4. عند استخدام `Supabase`، استخدم `Database.PartialRecord` لتجنب الأخطاء.
 */
