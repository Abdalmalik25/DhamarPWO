import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'service',
  type: 'document',
  title: 'الخدمات الهندسية',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'عنوان الخدمة',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'وصف الخدمة',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'الأيقونة',
      description: 'اسم الأيقونة من مكتبة lucide-react',
    }),
    defineField({
      name: 'color',
      type: 'string',
      title: 'اللون',
      initialValue: 'from-blue-500 to-blue-600',
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'الفئة',
    }),
    defineField({
      name: 'href',
      type: 'string',
      title: 'الصفحة المرتبطة',
      initialValue: 'forms',
    }),
    defineField({
      name: 'isPopular',
      type: 'boolean',
      title: 'خدمة شائعة',
      initialValue: false,
    }),
    defineField({
      name: 'isNew',
      type: 'boolean',
      title: 'خدمة حديثة',
      initialValue: false,
    }),
    defineField({
      name: 'estimatedTime',
      type: 'string',
      title: 'الوقت المقدر للخدمة',
    }),
  ],
  orderings: [
    {
      title: 'الترتيب حسب التاريخ',
      name: 'createdAt',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
