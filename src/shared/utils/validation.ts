// ============================================================
// Validation Schemas - مكتب الأشغال العامة والطرق - 2026
// ============================================================
import { z } from 'zod';

// ┌──────────────────────────────────────────────────────────
// │ Validation for Form N01 - طلب خدمة هندسية موحد
// └──────────────────────────────────────────────────────────
export const formN01Schema = z.object({
  applicant_name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
  national_id: z.string().regex(/^\d{12}$/, 'الرقم الوطني يجب أن يكون 12 رقماً'),
  phone: z.string().regex(/^(\+?967|0)?[1279]\d{7}$/, 'رقم هاتف يمني غير صالح'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  service_type: z.string().min(1, 'يجب اختيار نوع الخدمة'),
  location: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  area: z.number().min(1, 'المساحة يجب أن تكون أكبر من صفر').max(100000),
  floors: z.number().min(1, 'عدد الطوابق يجب أن يكون 1 على الأقل').max(50),
  description: z.string().max(500, 'الوصف يجب أن يكون أقل من 500 حرف').optional(),
  terms_accepted: z.boolean().refine((val: boolean) => val === true, 'يجب قبول الشروط والأحكام'),
});

// ┌──────────────────────────────────────────────────────────
// │ Validation for Form N02 - مراجعة المخططات
// └──────────────────────────────────────────────────────────
export const formN02Schema = z.object({
  applicant_name: z.string().min(2).max(100),
  national_id: z.string().regex(/^\d{12}$/, 'الرقم الوطني غير صالح'),
  phone: z.string().regex(/^(\+?967|0)?[1279]\d{7}$/, 'رقم هاتف غير صالح'),
  project_type: z.string().min(1, 'يجب اختيار نوع المشروع'),
  area: z.number().min(1).max(100000),
  floors: z.number().min(1).max(50),
  consultant_name: z.string().min(2).max(100),
  consultant_license: z.string().min(1, 'يجب إدخال رقم ترخيص المكتب'),
  drawings_count: z.number().min(1, 'يجب تحديد عدد المخططات'),
  notes: z.string().max(500).optional(),
  terms_accepted: z.boolean().refine((val: boolean) => val === true, 'يجب قبول الشروط'),
});

// ┌──────────────────────────────────────────────────────────
// │ Validation for Form N03 - تكليف لجنة معاينة
// └──────────────────────────────────────────────────────────
export const formN03Schema = z.object({
  applicant_name: z.string().min(2).max(100),
  national_id: z.string().regex(/^\d{12}$/),
  phone: z.string().regex(/^(\+?967|0)?[1279]\d{7}$/),
  site_location: z.string().min(5),
  site_area: z.number().min(1).max(100000),
  current_status: z.string().min(1),
  inspection_type: z.string().min(1),
  preferred_date: z.string().min(1, 'يجب تحديد التاريخ المفضل'),
  notes: z.string().max(500).optional(),
  terms_accepted: z.boolean().refine((val: boolean) => val === true, 'يجب قبول الشروط'),
});

// ┌──────────────────────────────────────────────────────────
// │ Validation for Form N04 - تصريح حفريات
// └──────────────────────────────────────────────────────────
export const formN04Schema = z.object({
  applicant_name: z.string().min(2).max(100),
  national_id: z.string().regex(/^\d{12}$/),
  phone: z.string().regex(/^(\+?967|0)?[1279]\d{7}$/),
  company_name: z.string().optional().or(z.literal('')),
  license_number: z.string().min(1, 'يجب إدخال رقم الترخيص'),
  road_section: z.string().min(5),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  depth: z.number().min(0.1).max(10),
  width: z.number().min(0.1).max(10),
  length: z.number().min(0.1).max(1000),
  work_type: z.string().min(1),
  traffic_management: z.string().min(1),
  safety_measures: z.string().min(10, 'يجب وصف إجراءات السلامة'),
  terms_accepted: z.boolean().refine((val: boolean) => val === true, 'يجب قبول الشروط'),
});

// ┌──────────────────────────────────────────────────────────
// │ Validation for Form N05 - طلب إفادة فنية
// └──────────────────────────────────────────────────────────
export const formN05Schema = z.object({
  applicant_name: z.string().min(2).max(100),
  national_id: z.string().regex(/^\d{12}$/),
  phone: z.string().regex(/^(\+?967|0)?[1279]\d{7}$/),
  property_id: z.string().min(1, 'يجب إدخال رقم العقار'),
  property_address: z.string().min(5),
  certificate_type: z.string().min(1, 'يجب اختيار نوع الشهادة'),
  purpose: z.string().min(5, 'يجب ذكر الغرض من الشهادة'),
  supporting_docs: z.string().optional(),
  notes: z.string().max(500).optional(),
  terms_accepted: z.boolean().refine((val: boolean) => val === true, 'يجب قبول الشروط'),
});

// ┌──────────────────────────────────────────────────────────
// │ Validation for Form N06 - بلاغات وشكاوى
// └──────────────────────────────────────────────────────────
export const formN06Schema = z.object({
  complainant_name: z.string().min(2).max(100),
  national_id: z.string().regex(/^\d{12}$/),
  phone: z.string().regex(/^(\+?967|0)?[1279]\d{7}$/),
  email: z.string().email().optional().or(z.literal('')),
  complaint_type: z.string().min(1, 'يجب اختيار نوع الشكوى'),
  location: z.string().min(5),
  violation_date: z.string().optional(),
  description: z.string().min(20, 'يجب كتابة وصف مفصل (20 حرف على الأقل)').max(1000),
  witnesses: z.string().optional(),
  photos_attached: z.boolean().optional(),
  previous_complaints: z.boolean().optional(),
  desired_outcome: z.string().max(500).optional(),
  terms_accepted: z.boolean().refine((val: boolean) => val === true, 'يجب قبول الشروط'),
});

// ┌──────────────────────────────────────────────────────────
// │ Validation for Satisfaction Form
// └──────────────────────────────────────────────────────────
export const satisfactionSchema = z.object({
  rating: z.number().min(1, 'التقييم مطلوب').max(5, 'التقييم يجب أن يكون من 1 إلى 5'),
  service_type: z.string().min(1, 'يجب تحديد نوع الخدمة'),
  name: z.string().optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^(\+?967|0)?[1279]\d{7}$/, 'رقم هاتف غير صالح')
    .optional()
    .or(z.literal('')),
  feedback: z.string().max(1000, 'الملاحظات يجب أن تكون أقل من 1000 حرف').optional(),
});

// ┌──────────────────────────────────────────────────────────
// │ Validation for Track Submission
// └──────────────────────────────────────────────────────────
export const trackingSchema = z.object({
  tracking_number: z.string().regex(/^[A-Z0-9]{10,20}$/, 'رقم التتبع غير صالح'),
});

// ┌──────────────────────────────────────────────────────────
// │ Generic validators
// └──────────────────────────────────────────────────────────
export const yemeniPhoneSchema = z
  .string()
  .regex(/^(\+?967|0)?[1279]\d{7}$/, 'رقم هاتف يمني غير صالح');
export const nationalIdSchema = z.string().regex(/^\d{12}$/, 'الرقم الوطني يجب أن يكون 12 رقماً');
export const emailSchema = z
  .string()
  .email('البريد الإلكتروني غير صالح')
  .optional()
  .or(z.literal(''));

// ┌──────────────────────────────────────────────────────────
// │ Type exports
// └──────────────────────────────────────────────────────────
export type FormN01Input = z.infer<typeof formN01Schema>;
export type FormN02Input = z.infer<typeof formN02Schema>;
export type FormN03Input = z.infer<typeof formN03Schema>;
export type FormN04Input = z.infer<typeof formN04Schema>;
export type FormN05Input = z.infer<typeof formN05Schema>;
export type FormN06Input = z.infer<typeof formN06Schema>;
export type SatisfactionInput = z.infer<typeof satisfactionSchema>;
export type TrackingInput = z.infer<typeof trackingSchema>;
