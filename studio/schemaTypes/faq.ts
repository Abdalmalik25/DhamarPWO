import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'faq',
  type: 'document',
  title: 'الأسئلة الشائعة',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      title: 'السؤال',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'answer',
      type: 'array',
      title: 'الإجابة',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'التصنيف',
      options: {
        list: [
          {value: 'planning', title: 'تخطيط'},
          {value: 'permitting', title: 'ترخيص'},
          {value: 'execution', title: 'تنفيذ'},
          {value: 'inspection', title: 'معاينة'},
          {value: 'handover', title: 'تسليم'},
          {value: 'legal', title: 'قانوني'},
          {value: 'general', title: 'عام'},
        ],
      },
    }),
    defineField({
      name: 'tip',
      type: 'text',
      title: 'نصيحة هندسية إضافية',
      rows: 2,
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'الكلمات المفتاحية',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'isPopular',
      type: 'boolean',
      title: 'سؤال شائع',
      initialValue: false,
    }),
    defineField({
      name: 'isAdvanced',
      type: 'boolean',
      title: 'سؤال متقدم',
      initialValue: false,
    }),
    defineField({
      name: 'estimatedTime',
      type: 'string',
      title: 'الوقت المقدر',
    }),
    defineField({
      name: 'workflow',
      type: 'array',
      title: 'إجراءات العمل خطوة بخطوة',
      of: [{type: 'string'}],
    }),
  ],
  orderings: [
    {
      title: 'الأسئلة الشائعة أولاً',
      name: 'popularFirst',
      by: [
        {field: 'isPopular', direction: 'desc'},
        {field: '_createdAt', direction: 'desc'},
      ],
    },
  ],
})
