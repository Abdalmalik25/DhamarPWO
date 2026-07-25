import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'teamMember',
  type: 'document',
  title: 'أعضاء الكادر',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'الاسم الكامل',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      type: 'string',
      title: 'المنصب',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'department',
      type: 'string',
      title: 'القسم',
    }),
    defineField({
      name: 'specialization',
      type: 'string',
      title: 'التخصص',
    }),
    defineField({
      name: 'email',
      type: 'email',
      title: 'البريد الإلكتروني',
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'الهاتف',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'الصورة الشخصية',
    }),
    defineField({
      name: 'bio',
      type: 'text',
      title: 'السيرة الذاتية',
      rows: 4,
    }),
    defineField({
      name: 'isChief',
      type: 'boolean',
      title: 'مدير/مديرة',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'الترتيب',
    }),
  ],
  orderings: [
    {
      title: 'المديرون أولاً',
      name: 'chiefFirst',
      by: [
        {field: 'isChief', direction: 'desc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
})
