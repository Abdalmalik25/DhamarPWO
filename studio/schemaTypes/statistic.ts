import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'statistic',
  type: 'document',
  title: 'الإحصائيات',
  fields: [
    defineField({
      name: 'value',
      type: 'string',
      title: 'القيمة',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      title: 'التسمية',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'الوصف المختصر',
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
    }),
    defineField({
      name: 'suffix',
      type: 'string',
      title: 'اللاحقة',
      initialValue: '+',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'الترتيب',
    }),
  ],
})
