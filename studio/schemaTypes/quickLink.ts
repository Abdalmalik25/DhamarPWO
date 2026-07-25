import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'quickLink',
  type: 'document',
  title: 'الروابط السريعة',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'عنوان الرابط',
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'الوصف',
    }),
    defineField({
      name: 'href',
      type: 'string',
      title: 'الصفحة المرتبطة',
      validation: (Rule) => Rule.required(),
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
      name: 'order',
      type: 'number',
      title: 'الترتيب',
    }),
  ],
})
