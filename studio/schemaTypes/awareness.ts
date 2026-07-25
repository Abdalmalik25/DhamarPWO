import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'awareness',
  type: 'document',
  title: 'المحتوى التوعوي',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'عنوان التوعية',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'وصف التوعية',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'الفئة',
      options: {
        list: [
          {value: 'safety', title: 'سلامة مهنية'},
          {value: 'quality', title: 'جودة إنشائية'},
          {value: 'environment', title: 'بيئة عمرانية'},
          {value: 'legal', title: 'إطار قانوني'},
          {value: 'community', title: 'مشاركة مجتمعية'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'الأيقونة',
    }),
    defineField({
      name: 'color',
      type: 'string',
      title: 'اللون',
      initialValue: 'from-orange-500 to-orange-600',
    }),
    defineField({
      name: 'tips',
      type: 'array',
      title: 'نقاط رئيسية',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'الصورة التوعوية',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isFeatured',
      type: 'boolean',
      title: 'محتوى مميز',
      initialValue: false,
    }),
    defineField({
      name: 'standards',
      type: 'array',
      title: 'المعايير والاشتراطات',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'benefits',
      type: 'array',
      title: 'الفوائد المرجوة',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'statistics',
      type: 'array',
      title: 'الإحصائيات',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', type: 'string', title: 'التسمية'},
            {name: 'value', type: 'string', title: 'القيمة'},
          ],
        },
      ],
    }),
  ],
})
