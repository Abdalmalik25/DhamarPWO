// ============================================================
// src/shared/data/contactData.ts - البيانات الموحدة لصفحة التواصل
// تضم جميع المعلومات المتكررة بين ContactPage/ContactSidebar/ContactCTASection
// ============================================================

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  Shield,
  Zap,
  Send,
  MessageSquare,
  HardHat,
  ClipboardCheck,
} from 'lucide-react';

// ============================================================
// 1. بيانات الاتصال الأساسية
// ============================================================

export const CONTACT_INFO = {
  office: {
    name: 'مكتب الأشغال العامة والطرق',
    address: 'شارع الحسينية - جوار مكتب الجمارك',
    plusCode: 'H96P+9VX',
    city: 'مدينة ذمار، محافظة ذمار',
    country: 'الجمهورية اليمنية',
    phone: '06-425186',
    phoneCode: '06425186',
    mobile: '777-888-000',
    email: 'info@pwo-dhamar.gov.ye',
    website: 'www.pwo-dhamar.gov.ye',
    workingDays: 'السبت - الأربعاء',
    workingHours: '8:00 صباحاً - 2:00 ظهراً',
    responseTime: 'خلال 24 ساعة',
  },
  // نسخة مختصرة للـ Footer
  short: {
    phone: '777-888-198',
    address: 'شارع الحسينية جوار مكتب الجمارك',
    hours: 'السبت - الأربعاء: 8:00 ص - 3:00 م',
  },
} as const;

// ============================================================
// 2. فروع المكتب
// ============================================================

export const BRANCHES = [
  {
    name: 'المقر الرئيسي - ذمار',
    address: 'شارع الحسينية - جوار الجمارك',
    phone: '06-425186',
    hours: '8ص - 2م',
  },
  { name: 'فرع مدينة ذمار', address: 'حي السوق القديم', phone: '06-425187', hours: '8ص - 2م' },
  {
    name: 'فرع مديرية جهران',
    address: 'وسط المديرية - جوار المجلس المحلي',
    phone: '06-425188',
    hours: '8ص - 2م',
  },
  { name: 'فرع مديرية عنة', address: 'مركز المديرية', phone: '06-425189', hours: '8ص - 2م' },
  {
    name: 'فرع مديرية وصاب',
    address: 'مركز المديرية - طريق الرئيسي',
    phone: '06-425190',
    hours: '8ص - 2م',
  },
  { name: 'فرع مديرية الحدأ', address: 'مركز المديرية', phone: '06-425191', hours: '8ص - 2م' },
];

// ============================================================
// 3. فئات الخدمات الهندسية
// ============================================================

export interface ServiceCategory {
  id: string;
  name: string;
  nameEngineering: string;
  icon: React.ElementType;
  color: string;
  description: string;
  descriptionEngineering: string;
  guidance: string;
  keywords?: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'inquiry',
    name: 'استفسار عام',
    nameEngineering: 'استفسار هندسي',
    icon: HelpCircle,
    color: 'from-blue-600 to-blue-700',
    description: 'استفسارات عن الخدمات العامة',
    descriptionEngineering: 'استفسارات عن الخدمات الهندسية والإنشائية',
    guidance: 'سيتم التواصل مع مهندس مختص',
  },
  {
    id: 'complaint',
    name: 'شكوى',
    nameEngineering: 'بلاغ إنشائي',
    icon: Shield,
    color: 'from-red-600 to-rose-700',
    description: 'بلغونا عن أي مخالفة أو مشكلة',
    descriptionEngineering: 'بلاغ عن مخالفة إنشائية أو بناية',
    guidance: 'سيتم اتخاذ إجراء فوري',
  },
  {
    id: 'suggestion',
    name: 'اقتراح',
    nameEngineering: 'اقتراح تحسين',
    icon: Zap,
    color: 'from-amber-600 to-orange-700',
    description: 'اقتراحات لتطوير الخدمات',
    descriptionEngineering: 'اقتراحات لتطوير الخدمات الهندسية',
    guidance: 'نقرأ جميع الاقتراحات',
  },
  {
    id: 'request',
    name: 'طلب خدمة',
    nameEngineering: 'طلب ترخيص هندسي',
    icon: Send,
    color: 'from-emerald-600 to-teal-700',
    description: 'طلب ترخيص أو خدمة معينة',
    descriptionEngineering: 'طلب ترخيص بناء أو تعديل',
    guidance: 'مرفق المخططات الهندسية مطلوب',
  },
  {
    id: 'inspection',
    name: 'معاينة ميدانية',
    nameEngineering: 'معاينة ميدانية',
    icon: HardHat,
    color: 'from-amber-600 to-orange-700',
    description: 'طلب زيارة مهندسية للموقع',
    descriptionEngineering: 'طلب زيارة مهندسية للموقع',
    guidance: 'تحتاج وثائق التصميم والموقع',
  },
  {
    id: 'other',
    name: 'أخرى',
    nameEngineering: 'أخرى',
    icon: MessageSquare,
    color: 'from-purple-600 to-violet-700',
    description: 'أي استفسار آخر',
    descriptionEngineering: 'أي استفسار آخر',
    guidance: 'نحن جاهزون لخدمتك',
  },
];

// ============================================================
// 4. الأسئلة الشائعة
// ============================================================

export const CONTACT_FAQS = [
  {
    q: 'ما هي أوقات الدوام الرسمي؟',
    a: 'من الساعة 8:00 صباحاً إلى 2:00 ظهراً، من السبت إلى الأربعاء. الخميس والجمعة عطلة رسمية.',
    category: 'general',
  },
  {
    q: 'كيف يمكنني تقديم شكوى أو اقتراح؟',
    a: 'يمكنكم التواصل عبر نموذج المراسلة في هذه الصفحة، أو عبر الهاتف 06-425186، أو بزيارة مكتب خدمة الجمهور في المقر الرئيسي.',
    category: 'services',
  },
  {
    q: 'هل يمكن حجز موعد مسبق؟',
    a: 'نعم، يمكن حجز موعد عبر الاتصال على 06-425186 أو عبر نموذج التواصل الإلكتروني، وسيتم تأكيد الموعد خلال 24 ساعة.',
    category: 'appointments',
  },
  {
    q: 'كيف أتقدم بطلب للحصول على مستند رسمي؟',
    a: 'يتم تقديم الطلب عبر مركز خدمة الجمهور في المقر الرئيسي أو أقرب فرع، مرفقاً بالوثائق المطلوبة حسب نوع الخدمة.',
    category: 'documents',
  },
];

// ============================================================
// 5. الدليل الإرشادي السريع
// ============================================================

export const QUICK_GUIDANCE = [
  { icon: HardHat, tip: 'قانون البناء #19 لسنة 2002م' },
  { icon: ClipboardCheck, tip: 'متطلبات الترخيص: مخططات + إرشادات' },
  { icon: Shield, tip: 'مخالفات البناء: ضبط فوري' },
];

// ============================================================
// 6. أدوات مساعدة
// ============================================================

export const getServiceCategoryById = (id: string) =>
  SERVICE_CATEGORIES.find((cat) => cat.id === id);

export const getContactCardData = () => [
  {
    icon: Phone,
    title: 'اتصل بنا',
    value: CONTACT_INFO.office.phone,
    sub: `الرد ${CONTACT_INFO.office.responseTime}`,
    href: `tel:+967${CONTACT_INFO.office.phoneCode}`,
  },
  {
    icon: Mail,
    title: 'راسلنا',
    value: CONTACT_INFO.office.email,
    sub: `الرد ${CONTACT_INFO.office.responseTime}`,
    href: `mailto:${CONTACT_INFO.office.email}`,
  },
  {
    icon: MapPin,
    title: 'زورنا',
    value: CONTACT_INFO.office.address,
    sub: CONTACT_INFO.office.city,
  },
  {
    icon: Clock,
    title: 'أوقات الدوام',
    value: CONTACT_INFO.office.workingDays,
    sub: CONTACT_INFO.office.workingHours,
  },
];
