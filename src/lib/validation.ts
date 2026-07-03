// ============================================================
// validation.ts - Enhanced Validation Schemas with Zod
// ============================================================

import { z } from 'zod';

// ============================================================
// 1. Phone Number Validation (Yemen)
// ============================================================

export const YemenPhoneSchema = z
  .string()
  .regex(/^(\+967|0)?[7-9]\d{7,8}$/, 'رقم الهاتف غير صحيح. يجب أن يبدأ بـ 7 أو 8 أو 9');

export const EmailSchema = z.string().email('البريد الإلكتروني غير صحيح').optional();

// ============================================================
// 2. National ID Validation (Yemen)
// ============================================================

export const NationalIdSchema = z
  .string()
  .length(16, 'رقم الهوية الوطنية يجب أن يكون 16 رقماً')
  .regex(/^\d{16}$/, 'رقم الهوية الوطنية يجب أن يحتوي على أرقام فقط');

// ============================================================
// 3. Form Submission Validation
// ============================================================

export const FormSubmissionSchema = z.object({
  tracking_number: z.string().regex(/^PWO-\d{8}-[A-Z0-9]{8}$/, 'رقم التتبع غير صحيح'),
  applicant_name: z
    .string()
    .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'الاسم طويل جداً'),
  national_id: YemenPhoneSchema,
  phone: YemenPhoneSchema,
  email: EmailSchema,
  form_name: z.string().min(1, 'اسم النموذج مطلوب'),
  service_type: z.string().min(1, 'نوع الخدمة مطلوب'),
  status: z.enum(['pending', 'processing', 'approved', 'rejected', 'completed']),
  submission_data: z.record(z.string(), z.any()),
});

// ============================================================
// 4. Satisfaction Survey Validation
// ============================================================

export const SatisfactionSchema = z.object({
  rating: z
    .number()
    .int('التقييم يجب أن يكون رقماً صحيحاً')
    .min(1, 'التقييم الأدنى هو 1')
    .max(5, 'التقييم الأقصى هو 5'),
  service_type: z.string().min(1, 'نوع الخدمة مطلوب'),
  name: z.string().max(100).optional(),
  phone: YemenPhoneSchema.optional(),
  feedback: z.string().max(1000, 'التعليق طويل جداً').optional(),
});

// ============================================================
// 5. General Form Validation Helper
// ============================================================

export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .slice(0, 1000); // Limit length
};

export const validateFormData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', '),
      };
    }
    return { success: false, error: 'خطأ في التحقق من البيانات' };
  }
};

// ============================================================
// 6. Rate Limiting Utilities
// ============================================================

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Filter out old requests
    const recentRequests = requests.filter((time) => now - time < this.windowMs);
    this.requests.set(key, recentRequests);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter((time) => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}

export const formSubmitRateLimiter = new RateLimiter(60000, 5); // 5 requests per minute
