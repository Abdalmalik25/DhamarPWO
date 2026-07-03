// ============================================================
// FAQSection.tsx - بوابة المعرفة الهندسية المتكاملة (Pro v4.0)
// ============================================================

import { memo, useState, useCallback, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  HardHat,
  FileText,
  ArrowRight,
  Phone,
  Scale,
  BookOpen,
  Gavel,
  Lightbulb,
  Calculator,
  FolderOpen,
  CheckCircle2,
  Clock,
  Layout,
  Settings,
  Save,
  Layers,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import type { Page } from '../../../types/page';

// ============================================================
// 1. أنواع البيانات المتخصصة (Specialized Types)
// ============================================================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?:
    'planning' | 'permitting' | 'execution' | 'inspection' | 'handover' | 'legal' | 'general';
  /** نصيحة هندسية أو تنبيه قانوني إضافي */
  tip?: string;
  /** أحكام قانونية مرتبطة */
  regulation?: {
    law: string;
    article: string;
    summary: string;
  };
  /** حالات عملية مشابهة */
  similarCases?: string[];
  /** الصفحة المرتبطة للانتقال إليها */
  relatedPage?: Page;
  /** الكلمات المفتاحية للبحث الدلالي */
  tags?: string[];
  /** هل هذا السؤال يعتبر "سؤالاً عميقاً"؟ */
  isAdvanced?: boolean;
  /** إجراءات العمل خطوة بخطوة */
  workflow?: string[];
  /** المراجع والوثائق المرتبطة */
  resources?: {
    title: string;
    url: string;
    type: 'pdf' | 'doc' | 'link';
  }[];
  /** الوقت التقديري للإجراء */
  estimatedTime?: string;
}

export interface FAQSectionProps {
  /** قائمة الأسئلة الشائعة */
  faqs?: FAQ[];
  /** دالة التنقل */
  onNavigate?: (page: Page) => void;
  /** دالة البحث (لربطها بالبحث العالمي) */
  onSearch?: (query: string) => void;
  /** إظهار رابط عرض الكل */
  showAllLink?: boolean;
  /** نوع التصميم */
  theme?: 'light' | 'dark';
  /** العنوان الرئيسي */
  title?: string;
  /** النص الفرعي */
  subtitle?: string;
  /** فئات CSS إضافية */
  className?: string;
}

// ============================================================
// 2. قاعدة المعرفة المتكاملة (Integrated Knowledge Base)
// ============================================================

const DEFAULT_FAQS: FAQ[] = [
  // ============================================================
  // القسم 1: التخطيط العمراني (Planning)
  // ============================================================
  {
    id: 'faq-plan-1',
    question: 'كيف أتأكد من أن قطعة الأرض التي سأشتريها صالحة للبناء؟',
    answer:
      'قبل شراء أي قطعة أرض، يجب عليك القيام بالخطوات التالية: 1) الحصول على "إفادة تنظيمية" من مكتب الأشغال لتحديد خطوط التنظيم وعرض الشارع. 2) التأكد من أن الأرض ليست ضمن المخططات التنظيمية للطرق أو المشاريع الحكومية المستقبلية. 3) مراجعة السجل العقاري للتأكد من خلوه من النزاعات.',
    category: 'planning',
    tip: 'نصيحة هندسية: يفضل الحصول على الإفادة التنظيمية قبل دفع أي مبالغ مالية للبائع. الإفادة تكلف حوالي 1,500 ريال وتوفر عليك مشاكل مستقبلية.',
    regulation: {
      law: 'قانون البناء اليمني',
      article: 'المادة (12)',
      summary: 'إجراءات الحصول على الإفادات التنظيمية للمخططات.',
    },
    similarCases: ['مواطن (س) اشترى أرضاً تبين أنها ضمن مشروع توسعة طريق رئيسي'],
    relatedPage: 'services',
    tags: ['تخطيط', 'أرض', 'إفادة', 'تنظيم', 'شراء'],
    isAdvanced: true,
    estimatedTime: '2-3 أيام عمل',
  },
  {
    id: 'faq-plan-2',
    question: 'كيف يتم احتساب نسبة البناء المسموح بها في الأرض السكنية؟',
    answer:
      'نسبة البناء المسموح بها تحدد بناءً على عدة عوامل: مساحة الأرض الكلية، عرض الشارع (إذا كان الشارع أقل من 6 أمتار، النسبة 50%، إذا كان 6-12 متراً، النسبة 60%، وإذا كان أكثر من 12 متراً، النسبة 70%). كما تختلف النسبة حسب المنطقة (سكنية، تجارية، إدارية). للحصول على حساب دقيق، يمكنك استخدام الحاسبة التفاعلية أدناه.',
    category: 'planning',
    tip: 'نصيحة هندسية: يمكنك استخدام حاسبة نسبة البناء المتوفرة في قسم "الأدوات الهندسية" لمعرفة النسبة الدقيقة لأرضك.',
    tags: ['نسبة', 'بناء', 'مساحة', 'شارع', 'حاسبة'],
    isAdvanced: true,
    relatedPage: 'services',
  },
  {
    id: 'faq-plan-3',
    question: 'ما هي المناطق التي يمنع فيها البناء في محافظة ذمار؟',
    answer:
      'يمنع البناء في المناطق التالية: 1) المناطق الواقعة ضمن خطوط التنظيم للطرق العامة. 2) المناطق المخصصة للمشاريع الحكومية (مثل: مدارس، مستشفيات). 3) المناطق القريبة من الآثار التاريخية أو المحميات الطبيعية. 4) المناطق التي تم إعلانها كمناطق خطرة (مثل: مناطق السيول). يمكنك الاستعلام عن حالة أي منطقة من خلال زيارة إدارة التخطيط العمراني.',
    category: 'planning',
    tip: 'تنبيه: البناء في المناطق المحظورة يعرضك للمساءلة القانونية والإزالة على نفقتك الخاصة.',
    regulation: {
      law: 'نظام ضوابط البناء',
      article: 'المادة (8)',
      summary: 'المناطق المحظورة والمقيدة للبناء.',
    },
    similarCases: ['تم إزالة بناء في منطقة وادي ذمار عام 2024 بسبب السيول'],
    tags: ['منع', 'بناء', 'محظور', 'آثار', 'سيول'],
    isAdvanced: true,
    relatedPage: 'contact',
  },

  // ============================================================
  // القسم 2: التراخيص والموافقات (Permitting)
  // ============================================================
  {
    id: 'faq-perm-1',
    question: 'ما هي الخطوات الكاملة للحصول على ترخيص بناء جديد؟',
    answer:
      'الحصول على ترخيص بناء جديد يتطلب الخطوات التالية:\n1) مراجعة إدارة التخطيط للتأكد من خلو الأرض من أي عوائق.\n2) تعيين مكتب هندسي استشاري لإعداد المخططات الهندسية.\n3) تقديم النموذج (ن-1) مع المخططات والوثائق المطلوبة.\n4) مراجعة اللجنة الفنية للمخططات (تستغرق 3-5 أيام).\n5) دفع الرسوم المقررة حسب مساحة البناء.\n6) استلام الترخيص بعد اعتماده.',
    category: 'permitting',
    tip: 'نصيحة إدارية: تأكد من تعيين مكتب استشاري معتمد من قبل الوزارة. المكاتب غير المعتمدة تسبب تأخيرات ومشاكل.',
    regulation: {
      law: 'قانون البناء اليمني',
      article: 'المادة (25)',
      summary: 'إلزامية الحصول على ترخيص قبل بدء أي بناء.',
    },
    similarCases: ['المواطن (ع) حصل على الترخيص في 12 يوم عمل فقط'],
    relatedPage: 'forms',
    tags: ['ترخيص', 'بناء', 'خطوات', 'نموذج ن-1'],
    isAdvanced: true,
    estimatedTime: '10-15 يوم عمل',
    workflow: [
      'مراجعة إدارة التخطيط',
      'تعيين مكتب هندسي معتمد',
      'تقديم النموذج (ن-1)',
      'مراجعة اللجنة الفنية',
      'دفع الرسوم',
      'استلام الترخيص',
    ],
  },
  {
    id: 'faq-perm-2',
    question: 'ما هي المستندات المطلوبة لتقديم طلب ترخيص بناء؟',
    answer:
      'المستندات المطلوبة هي: 1) نموذج (ن-1) مكتمل البيانات. 2) صورة الهوية الوطنية (سارية). 3) وثيقة ملكية العقار (البصيرة) أو عقد إيجار موثق. 4) المخططات الهندسية المعتمدة من مكتب استشاري (4 نسخ). 5) إفادة تنظيمية من مكتب الأشغال.',
    category: 'permitting',
    tip: 'نصيحة: تأكد من أن جميع الوثائق موقعة ومختومة. أي نقص في الوثائق يؤدي إلى تأخير المعاملة.',
    tags: ['وثائق', 'مستندات', 'نموذج ن-1', 'ملكية'],
    isAdvanced: false,
    relatedPage: 'forms',
  },
  {
    id: 'faq-perm-3',
    question: 'هل يمكنني تجديد ترخيص بناء منتهٍ؟ وما هي الإجراءات؟',
    answer:
      'يمكنك تجديد ترخيص البناء إذا كان قد انتهى ولم يتم تنفيذ المشروع. يجب عليك تقديم طلب تجديد مع إيضاح أسباب التأخير. في حال كان التأخير بسبب ظروف قاهرة (مثل: الحرب، الكوارث الطبيعية)، قد يتم إعفاؤك من الرسوم الإضافية. في الحالات العادية، يتم احتساب رسوم إضافية حسب مدة التأخير.',
    category: 'permitting',
    tip: 'نصيحة إدارية: حاول تجديد الترخيص قبل انتهاء صلاحيته. التجديد بعد الانتهاء يتطلب إجراءات إضافية ورسوم إضافية.',
    regulation: {
      law: 'نظام ضوابط البناء',
      article: 'المادة (30)',
      summary: 'إجراءات تجديد التراخيص والإعفاءات.',
    },
    tags: ['تجديد', 'ترخيص', 'انتهاء', 'رسوم'],
    isAdvanced: true,
    relatedPage: 'services',
  },

  // ============================================================
  // القسم 3: التنفيذ والبناء (Execution)
  // ============================================================
  {
    id: 'faq-exec-1',
    question: 'ما هي إجراءات المعاينة أثناء التنفيذ؟',
    answer:
      'يجب إجراء المعاينات التالية أثناء التنفيذ: 1) معاينة الحفر والأساسات: قبل صب الخرسانة. 2) معاينة الهيكل الخرساني: بعد صب الأعمدة والجسور. 3) معاينة التشطيبات: قبل التسليم النهائي. يجب تقديم طلب معاينة عبر النموذج (ن-3) لكل مرحلة. عدم المعاينة قد يؤدي إلى توقف العمل.',
    category: 'execution',
    tip: 'نصيحة هندسية: احتفظ بسجل للمعاينات مع التواريخ. هذا يساعد في حال وجود أي نزاعات مستقبلية.',
    regulation: {
      law: 'قانون البناء اليمني',
      article: 'المادة (33)',
      summary: 'إجراءات المعاينات والكشف الميداني.',
    },
    similarCases: ['مشروع (س) توقف لمدة أسبوع بسبب عدم إجراء المعاينة في الوقت المحدد'],
    relatedPage: 'services',
    tags: ['معاينة', 'تنفيذ', 'أساسات', 'هيكل'],
    isAdvanced: true,
    estimatedTime: '3-5 أيام لكل مرحلة',
    workflow: [
      'تقديم طلب معاينة (ن-3)',
      'جدولة الزيارة الميدانية',
      'تقييم الحالة وتحرير محضر المعاينة',
      'رفع التقرير للجنة الفنية',
    ],
  },
  {
    id: 'faq-exec-2',
    question: 'هل يمكنني إجراء تعديلات على المخططات أثناء التنفيذ؟',
    answer:
      'نعم، يمكن إجراء تعديلات، ولكن بشرط أن تكون التعديلات ضمن حدود القانون ولا تتعارض مع خطوط التنظيم. يجب عليك تقديم طلب تعديل عبر النموذج (ن-1) مع المخططات المعدلة، وسيتم إعادة دراسة الطلب من قبل اللجنة الفنية. قد يتم احتساب رسوم إضافية حسب حجم التعديل.',
    category: 'execution',
    tip: 'نصيحة هندسية: يفضل عدم البدء في التعديلات قبل الحصول على موافقة خطية من المكتب. أي تعديل بدون موافقة يُعتبر مخالفة يعرضك للغرامة.',
    regulation: {
      law: 'نظام ضوابط البناء',
      article: 'المادة (22)',
      summary: 'إجراءات تعديل التراخيص والموافقات الهندسية.',
    },
    tags: ['تعديل', 'مخططات', 'ترخيص', 'موافقة'],
    isAdvanced: true,
    relatedPage: 'forms',
  },
  {
    id: 'faq-exec-3',
    question: 'كيف يتم التعامل مع مخلفات البناء والأنقاض؟',
    answer:
      'يجب على المقاول أو صاحب المشروع التخلص من مخلفات البناء والأنقاض في المواقع المخصصة لذلك. يمنع رمي المخلفات في الشوارع أو الأراضي الفضاء. قد يتم تغريم المخالفين بمبالغ تصل إلى 50,000 ريال. يمكنك الاستفادة من خدمات النقل المتاحة في المكتب لضمان التخلص الآمن.',
    category: 'execution',
    tip: 'نصيحة بيئية: إعادة تدوير المخلفات (مثل: الحديد، الخرسانة) يمكن أن يوفر لك تكاليف إضافية ويساهم في الحفاظ على البيئة.',
    regulation: {
      law: 'قانون البيئة اليمني',
      article: 'المادة (15)',
      summary: 'إدارة النفايات والمخلفات الصلبة.',
    },
    similarCases: ['مقاول (م) تم تغريمه 30,000 ريال لرمي الأنقاض في شارع عام'],
    tags: ['مخلفات', 'أنقاض', 'بيئة', 'غرامة'],
    isAdvanced: false,
  },

  // ============================================================
  // القسم 4: المعاينة والتسليم (Handover)
  // ============================================================
  {
    id: 'faq-hand-1',
    question: 'كيف أحصل على شهادة إتمام البناء؟',
    answer:
      'بعد الانتهاء من تنفيذ المشروع وفق المخططات المعتمدة، يجب عليك تقديم طلب للحصول على شهادة إتمام بناء عبر النموذج (ن-5). سيقوم فريق الهندسة بإجراء معاينة ميدانية نهائية للتأكد من مطابقة التنفيذ للمخططات. في حال كانت المطابقة كاملة، يتم إصدار الشهادة.',
    category: 'handover',
    tip: 'نصيحة هندسية: قبل طلب الشهادة، تأكد من أن جميع النواقص قد تم إصلاحها. أي ملاحظة قد تؤدي إلى رفض الطلب.',
    regulation: {
      law: 'نظام ضوابط البناء',
      article: 'المادة (40)',
      summary: 'إجراءات استلام المشاريع وإصدار شهادات الإتمام.',
    },
    similarCases: ['مواطن (ح) حصل على شهادة الإتمام بعد أسبوع من تقديم الطلب'],
    relatedPage: 'services',
    tags: ['شهادة', 'إتمام', 'بناء', 'معاينة'],
    isAdvanced: true,
    estimatedTime: '5-7 أيام عمل',
  },
  {
    id: 'faq-hand-2',
    question: 'هل يمكنني الاعتراض على نتائج المعاينة النهائية؟',
    answer:
      'نعم، يحق لك الاعتراض على نتائج المعاينة النهائية. يجب تقديم اعتراض رسمي إلى اللجنة الفنية مع إيضاح أسباب الاعتراض. ستقوم اللجنة بإعادة تقييم الموقع وإصدار قرار نهائي. الاعتراض يجب أن يتم خلال 3 أيام من تاريخ استلام نتائج المعاينة.',
    category: 'handover',
    tip: 'نصيحة إدارية: تأكد من توثيق جميع ملاحظات المعاينة. هذا يساعدك في إثبات موقفك عند الاعتراض.',
    regulation: {
      law: 'قانون الإجراءات المدنية',
      article: 'المادة (110)',
      summary: 'حق الاعتراض على القرارات الإدارية.',
    },
    tags: ['اعتراض', 'معاينة', 'نتائج', 'لجنة'],
    isAdvanced: true,
    relatedPage: 'contact',
  },

  // ============================================================
  // القسم 5: الأسئلة القانونية (Legal)
  // ============================================================
  {
    id: 'faq-legal-1',
    question: 'ما هي العقوبات المترتبة على البناء بدون ترخيص؟',
    answer:
      'البناء بدون ترخيص يعتبر مخالفة قانونية ويعرض صاحبه لعقوبات تشمل: 1) الغرامة المالية التي قد تصل إلى 100,000 ريال. 2) إيقاف الأعمال فوراً. 3) إزالة المبنى على نفقة المخالف. 4) إحالة المخالف إلى النيابة العامة في الحالات الجسيمة. كما قد يتم منع المخالف من التعامل مع المكتب لمدة 5 سنوات.',
    category: 'legal',
    tip: 'تنبيه: البناء بدون ترخيص ليس فقط مخالفة إدارية، بل قد يكون جريمة جنائية في بعض الحالات. تأكد دائماً من حصولك على الترخيص قبل بدء أي عمل.',
    regulation: {
      law: 'قانون البناء اليمني',
      article: 'المادة (45)',
      summary: 'العقوبات والغرامات للمخالفات العمرانية.',
    },
    similarCases: ['شركة (س) تم تغريمها 5 مليون ريال لبناء 4 أدوار دون ترخيص'],
    tags: ['عقوبات', 'غرامة', 'مخالفة', 'إزالة'],
    isAdvanced: true,
  },
  {
    id: 'faq-legal-2',
    question: 'كيف يمكنني تقديم شكوى ضد إجراءات المكتب؟',
    answer:
      'إذا كنت تعتقد أن هناك خطأ أو تأخير في إجراءات المكتب، يمكنك تقديم شكوى رسمية عبر النموذج (ن-6). يجب أن تحتوي الشكوى على: 1) تفاصيل المعاملة. 2) أسباب الشكوى. 3) أي مستندات داعمة. سيتم دراسة الشكوى من قبل إدارة الرقابة والرد عليك خلال 10 أيام عمل.',
    category: 'legal',
    tip: 'نصيحة قانونية: احتفظ بنسخة من الشكوى ورقم الإيداع. هذا يساعدك في متابعة حالة الشكوى.',
    regulation: {
      law: 'قانون الإجراءات المدنية',
      article: 'المادة (115)',
      summary: 'إجراءات تقديم الشكاوى والتظلمات.',
    },
    tags: ['شكوى', 'تظلم', 'إجراءات', 'رقابة'],
    isAdvanced: false,
    relatedPage: 'contact',
  },

  // ============================================================
  // القسم 6: الأسئلة العامة (General)
  // ============================================================
  {
    id: 'faq-gen-1',
    question: 'هل يمكنني الحصول على صورة طبق الأصل من ترخيص سابق؟',
    answer:
      'نعم، يمكنك طلب صورة طبق الأصل من أي ترخيص سابق عبر النموذج (ن-8) المخصص للأرشفة. يجب إرفاق ما يثبت علاقتك بالمعاملة الأصلية (مثل: صورة الهوية، رقم التتبع). يتم دفع رسوم 1,000 ريال للصورة الواحدة. تستغرق العملية 1-3 أيام عمل.',
    category: 'general',
    tip: 'نصيحة إدارية: إذا كنت تريد الحصول على العديد من الوثائق، يفضل تقديم طلب واحد شامل لتوفير الوقت والجهد.',
    tags: ['أرشفة', 'ترخيص', 'صورة', 'نموذج ن-8'],
    isAdvanced: false,
    relatedPage: 'documents',
    estimatedTime: '1-3 أيام عمل',
  },
  {
    id: 'faq-gen-2',
    question: 'كيف يمكنني متابعة حالة معاملتي إلكترونياً؟',
    answer:
      'يمكنك متابعة حالة معاملتك من خلال الموقع الإلكتروني عبر خدمة "تتبع المعاملة". كل ما عليك فعله هو إدخال رقم التتبع الذي حصلت عليه عند تقديم الطلب. ستظهر لك الحالة الحالية (قيد الانتظار، قيد المعالجة، معتمدة، مرفوضة، منتهية). إذا كانت الحالة "قيد المعالجة" لأكثر من 10 أيام، يمكنك الاتصال بمركز خدمة الجمهور للاستفسار.',
    category: 'general',
    tip: 'نصيحة إدارية: احتفظ برقم التتبع في مكان آمن. هذا هو المفتاح لمتابعة معاملتك.',
    tags: ['تتبع', 'معاملة', 'رقم التتبع'],
    isAdvanced: false,
    relatedPage: 'track',
  },
];

// ============================================================
// 3. المكونات الفرعية (Sub-components)
// ============================================================

// أيقونة الفئة
const CategoryIcon = memo(({ category }: { category?: string }) => {
  switch (category) {
    case 'planning':
      return <Layout size={14} />;
    case 'permitting':
      return <FileText size={14} />;
    case 'execution':
      return <HardHat size={14} />;
    case 'inspection':
      return <CheckCircle2 size={14} />;
    case 'handover':
      return <Save size={14} />;
    case 'legal':
      return <Gavel size={14} />;
    default:
      return <HelpCircle size={14} />;
  }
});

// تسمية الفئة
const CategoryLabel = memo(({ category }: { category?: string }) => {
  switch (category) {
    case 'planning':
      return 'التخطيط العمراني';
    case 'permitting':
      return 'التراخيص والموافقات';
    case 'execution':
      return 'التنفيذ والبناء';
    case 'inspection':
      return 'المعاينة والتفتيش';
    case 'handover':
      return 'التسليم والاستلام';
    case 'legal':
      return 'القانوني';
    default:
      return 'عام';
  }
});

// مكون الإجراءات خطوة بخطوة
const WorkflowSteps = memo(({ steps }: { steps?: string[] }) => {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="bg-gov-50 border border-gov-200 rounded-xl p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Settings
          size={16}
          className="text-gov-600"
        />
        <span className="text-xs font-bold text-gov-700">إجراءات العمل</span>
      </div>
      <ol className="space-y-2">
        {steps.map((step, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-sm text-gov-700"
          >
            <span className="w-5 h-5 rounded-full bg-gov-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
});

// مكون المراجع والوثائق
const ResourcesList = memo(
  ({ resources }: { resources?: { title: string; url: string; type: string }[] }) => {
    if (!resources || resources.length === 0) return null;
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen
            size={16}
            className="text-blue-600"
          />
          <span className="text-xs font-bold text-blue-700">المراجع والوثائق</span>
        </div>
        <ul className="space-y-2">
          {resources.map((res, idx) => (
            <li key={idx}>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
              >
                {res.type === 'pdf' ? <FileText size={14} /> : <LinkIcon size={14} />}
                <span>{res.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

// مكون عنصر الأسئلة الشائعة المتقدم
const FAQItem = memo(function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
  onNavigate,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  onNavigate?: (page: Page) => void;
}) {
  const {
    question,
    answer,
    category,
    tip,
    regulation,
    similarCases,
    relatedPage,
    workflow,
    resources,
    estimatedTime,
  } = faq;

  return (
    <div
      className={`group border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen ? 'border-gov-300 shadow-lg' : 'hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-right transition-colors hover:bg-gray-50/50"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              <CategoryIcon category={category} /> <CategoryLabel category={category} />
            </span>
            {faq.isAdvanced && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-gov-100 text-gov-600 rounded-full">
                متقدم
              </span>
            )}
            {estimatedTime && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full">
                <Clock size={10} /> ~{estimatedTime}
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-gray-700 flex-1 block text-start">
            {question}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-180 text-gov-600' : ''
          }`}
        />
      </button>
      <div
        id={`faq-answer-${index}`}
        role="region"
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 pt-0 space-y-4">
          <div className="w-8 h-0.5 bg-gold-400 rounded-full mb-3" />

          {/* الإجابة الأساسية */}
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{answer}</p>

          {/* النصيحة الهندسية */}
          {tip && (
            <div className="bg-gov-50 border-r-4 border-gov-600 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb
                  size={16}
                  className="text-gov-600 mt-0.5 shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-gov-700 block mb-1">نصيحة هندسية</span>
                  <p className="text-sm text-gov-700 leading-relaxed">{tip}</p>
                </div>
              </div>
            </div>
          )}

          {/* الأحكام القانونية */}
          {regulation && (
            <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Scale
                  size={16}
                  className="text-amber-600 mt-0.5 shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-amber-700 block mb-1">
                    الأحكام والضوابط
                  </span>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {regulation.law} - {regulation.article}: {regulation.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* إجراءات العمل */}
          <WorkflowSteps steps={workflow} />

          {/* المراجع والوثائق */}
          <ResourcesList resources={resources} />

          {/* حالات مشابهة */}
          {similarCases && similarCases.length > 0 && (
            <div className="bg-blue-50 border-r-4 border-blue-400 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <BookOpen
                  size={16}
                  className="text-blue-600 mt-0.5 shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-blue-700 block mb-1">حالات مشابهة</span>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    {similarCases.map((caseItem, idx) => (
                      <li key={idx}>{caseItem}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* أزرار الإجراءات السريعة */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            {relatedPage && onNavigate && (
              <button
                onClick={() => onNavigate(relatedPage)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gov-50 hover:bg-gov-100 text-gov-600 rounded-full text-xs font-bold transition-all"
              >
                <ArrowRight size={12} />
                اذهب إلى الخدمة
              </button>
            )}
            <button
              onClick={() => window.open('tel:+967777888198', '_blank')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gold-50 hover:bg-gold-100 text-gold-700 rounded-full text-xs font-bold transition-all"
            >
              <Phone size={12} />
              اتصل بنا
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// 4. المكون الرئيسي (Main Component)
// ============================================================

const FAQSection = memo(function FAQSection({
  faqs = [],
  onNavigate,
  onSearch,
  showAllLink = false,
  theme = 'light',
  title = 'بوابة المعرفة الهندسية والإدارية',
  subtitle = 'دليل شامل للإجراءات الهندسية والإدارية في مكتب الأشغال العامة والطرق',
  className = '',
}: FAQSectionProps) {
  // ============================================================
  // 4.1. الحالات الداخلية (Internal State)
  // ============================================================

  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================================
  // 4.2. دمج البيانات (Data Merging)
  // ============================================================

  const allFaqs = useMemo(() => {
    return faqs.length > 0 ? faqs : DEFAULT_FAQS;
  }, [faqs]);

  // ============================================================
  // 4.3. الفئات المتاحة (Available Categories)
  // ============================================================

  const categories = useMemo(() => {
    const uniqueCategories = new Set(allFaqs.map((f) => f.category || 'general'));
    return ['all', ...Array.from(uniqueCategories)];
  }, [allFaqs]);

  // ============================================================
  // 4.4. التصفية والبحث (Filtering & Search)
  // ============================================================

  const filteredFaqs = useMemo(() => {
    let filtered = allFaqs;

    // تصفية حسب الفئة
    if (activeCategory !== 'all') {
      filtered = filtered.filter((f) => f.category === activeCategory);
    }

    // البحث الدلالي المتقدم
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          (f.tip && f.tip.toLowerCase().includes(q)) ||
          (f.tags && f.tags.some((tag) => tag.toLowerCase().includes(q))),
      );
    }

    return filtered;
  }, [allFaqs, activeCategory, searchQuery]);

  // ============================================================
  // 4.5. معالجات الأحداث (Event Handlers)
  // ============================================================

  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.clear();
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setOpenItems(new Set());
  }, []);

  const handleShowAllFaqs = useCallback(() => {
    setActiveCategory('all');
    setSearchQuery('');
    setOpenItems(new Set());
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch],
  );

  // ============================================================
  // 4.6. الثيم (Theming)
  // ============================================================

  const themeClasses = useMemo(() => {
    if (theme === 'dark') {
      return {
        section: 'bg-gray-900 border-gray-800',
        text: 'text-white',
        muted: 'text-gray-400',
      };
    }
    return {
      section: 'bg-white border-gray-100',
      text: 'text-gray-800',
      muted: 'text-gray-500',
    };
  }, [theme]);

  // ============================================================
  // 4.7. التصيير (Rendering)
  // ============================================================

  if (allFaqs.length === 0) return null;

  return (
    <section
      className={`py-24 ${themeClasses.section} border-b relative overflow-hidden ${className}`}
      aria-label="بوابة المعرفة الهندسية والإدارية"
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #1e3a8a 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== الهيدر ===== */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-5">
              <div
                className="relative w-16 h-16 rounded-2xl bg-gold-50 ring-2 ring-gold-200/70 shadow-inner"
                aria-hidden="true"
              />
            </div>
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-gov-50 to-gov-100/50 text-gov-700 px-5 py-2 rounded-full text-sm font-bold mb-5 border border-gov-200/50">
              <BookOpen
                size={16}
                className="text-gov-600"
              />
              {title}
            </div>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${themeClasses.text}`}>{title}</h2>
            <p className={`${themeClasses.muted} max-w-2xl mx-auto`}>{subtitle}</p>
            {showAllLink && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleShowAllFaqs}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-gov-200 text-gov-700 bg-white hover:bg-gov-50 transition-colors text-sm font-bold"
                >
                  عرض جميع الأسئلة
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ===== البحث والتصنيف ===== */}
        <ScrollReveal delay={50}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="ابحث في المعرفة الهندسية..."
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gov-500/30 focus:border-gov-500 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-gov-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gov-300 hover:text-gov-600'
                  }`}
                >
                  {cat === 'all' ? 'الكل' : <CategoryLabel category={cat} />}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ===== قائمة الاستفسارات المتقدمة ===== */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HelpCircle
                  size={36}
                  className="text-gray-400"
                />
              </div>
              <p className="text-gray-500 font-semibold">لا توجد نتائج للبحث</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-gov-600 text-sm font-bold hover:underline"
              >
                عرض جميع الاستفسارات
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <ScrollReveal
                key={faq.id}
                delay={idx * 50}
              >
                <FAQItem
                  faq={faq}
                  isOpen={openItems.has(faq.id)}
                  onToggle={() => toggleItem(faq.id)}
                  index={idx}
                  onNavigate={onNavigate}
                />
              </ScrollReveal>
            ))
          )}
        </div>

        {/* ===== قسم الأدوات الهندسية ===== */}
        <ScrollReveal delay={100}>
          <div className="mt-12 p-6 bg-gradient-to-br from-gov-50 to-gov-100 rounded-2xl border border-gov-200">
            <div className="flex items-center gap-3 mb-4">
              <Calculator
                size={20}
                className="text-gov-600"
              />
              <h3 className="font-bold text-gov-700 text-lg">الأدوات الهندسية</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-gov-300">
                <FileText
                  size={18}
                  className="text-gov-600"
                />
                <span className="text-sm font-medium text-gray-700">حاسبة نسبة البناء</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-gov-300">
                <Calculator
                  size={18}
                  className="text-gov-600"
                />
                <span className="text-sm font-medium text-gray-700">حاسبة الرسوم التقديرية</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-gov-300">
                <Layers
                  size={18}
                  className="text-gov-600"
                />
                <span className="text-sm font-medium text-gray-700">أداة قياس المسافات</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

export default FAQSection;
