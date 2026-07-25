import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  type: 'document',
  title: 'إعدادات الموقع',
  fields: [
    defineField({
      name: 'fullName',
      type: 'string',
      title: 'الاسم الكامل',
      initialValue: 'مكتب الأشغال العامة والطرق',
    }),
    defineField({
      name: 'shortName',
      type: 'string',
      title: 'الاسم المختصر',
      initialValue: 'مكتب الأشغال',
    }),
    defineField({
      name: 'governorate',
      type: 'string',
      title: 'المحافظة',
      initialValue: 'محافظة ذمار',
    }),
    defineField({
      name: 'country',
      type: 'string',
      title: 'البلد',
      initialValue: 'الجمهورية اليمنية',
    }),
    defineField({
      name: 'ministry',
      type: 'string',
      title: 'الوزارة',
      initialValue: 'وزارة الأشغال العامة والطرق',
    }),
    defineField({
      name: 'contact',
      type: 'object',
      title: 'معلومات الاتصال',
      fields: [
        {name: 'phone', type: 'string', title: 'الهاتف', initialValue: '06-521222'},
        {name: 'fax', type: 'string', title: 'الفاكس', initialValue: '06-521223'},
        {
          name: 'email',
          type: 'email',
          title: 'البريد الإلكتروني',
          initialValue: 'dpw.dhamar@yemen.gov.ye',
        },
        {
          name: 'address',
          type: 'string',
          title: 'العنوان',
          initialValue: 'مدينة ذمار - شارع الجامعة',
        },
        {name: 'poBox', type: 'string', title: 'الصندوق البريدي', initialValue: 'ص.ب 88'},
        {
          name: 'workingDays',
          type: 'string',
          title: 'أيام العمل',
          initialValue: 'السبت - الأربعاء',
        },
        {
          name: 'workingHours',
          type: 'string',
          title: 'ساعات العمل',
          initialValue: '8:00 صباحاً - 2:00 مساءً',
        },
      ],
    }),
    defineField({
      name: 'legalReferences',
      type: 'array',
      title: 'الإشارات القانونية',
      of: [{type: 'string'}],
      initialValue: [
        'قانون البناء رقم (19) لسنة 2002م',
        'قانون التخطيط الحضري رقم (20) لسنة 1995م',
        'اللائحة التنفيذية لقانون البناء',
      ],
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'صورة البطل الرئيسية',
      description: 'الصورة التعريفية للشارك النموذجي في الصفحة الرئيسية (يمكن تعديلها من لوحة التحكم)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroBackgroundImage',
      type: 'image',
      title: 'خلفية البطل الجغرافية',
      description: 'صورة الخريطة أو الخلفية التوعوية للبطل (اختياري)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'parkingGuidelines',
      type: 'image',
      title: 'إرشادات تنظيم المواقف',
      description: 'الصور التوعوية لتنظيم المواقف والبنية التحتية',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'governorateMap',
      type: 'image',
      title: 'خريطة المحافظة',
      description: 'خريطة المحافظة للاستخدام في البطل أو المحتوى التوعوي',
      options: {
        hotspot: true,
      },
    }),
   ],
 })
