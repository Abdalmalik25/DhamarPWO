import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'إعلان',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'النص',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'النوع',
      type: 'string',
      options: {
        list: [
          {value: 'urgent', title: 'عاجل'},
          {value: 'info', title: 'تنويه'},
          {value: 'achievement', title: 'إنجاز'},
          {value: 'warning', title: 'تحذير'},
          {value: 'general', title: 'عام'},
        ],
      },
    }),
    defineField({
      name: 'tag',
      title: 'وسم مخصص',
      type: 'string',
    }),
    defineField({
      name: 'tagColor',
      title: 'لون الوسم',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'رابط',
      type: 'url',
    }),
    defineField({
      name: 'target',
      title: 'فتح الرابط',
      type: 'string',
      options: {
        list: [
          {value: '_self', title: 'النافذة الحالية'},
          {value: '_blank', title: 'نافذة جديدة'},
        ],
      },
    }),
    defineField({
      name: 'expiresAt',
      title: 'تنتهي في',
      type: 'datetime',
    }),
    defineField({
      name: 'priority',
      title: 'أولوية (رقم أكبر = أعلى)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'icon',
      title: 'أيقونة (اختياري)',
      type: 'string',
    }),
  ],
  orderings: [
    {
      title: 'الأولوية',
      name: 'priorityDesc',
      by: [{field: 'priority', direction: 'desc'}],
    },
  ],
})
