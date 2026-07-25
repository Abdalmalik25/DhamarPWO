import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'officialDocument',
  type: 'document',
  title: 'الوثائق الرسمية',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'عنوان الوثيقة',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'وصف الوثيقة',
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'الفئة',
      options: {
        list: [
          {value: 'law', title: 'قانونية'},
          {value: 'regulation', title: 'لوائح'},
          {value: 'guideline', title: 'دلائل'},
          {value: 'report', title: 'تقارير'},
          {value: 'form', title: 'نماذج'},
          {value: 'contract', title: 'عقود'},
        ],
      },
    }),
    defineField({
      name: 'file',
      type: 'file',
      title: 'ملف الوثيقة',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
      },
    }),
    defineField({
      name: 'downloadUrl',
      type: 'url',
      title: 'رابط التحميل الخارجي',
    }),
    defineField({
      name: 'publishedAt',
      type: 'date',
      title: 'تاريخ النشر',
    }),
    defineField({
      name: 'views',
      type: 'number',
      title: 'عدد المشاهدات',
      initialValue: 0,
    }),
    defineField({
      name: 'downloads',
      type: 'number',
      title: 'عدد التحميلات',
      initialValue: 0,
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'الكلمات المفتاحية',
      of: [{type: 'string'}],
    }),
  ],
})
