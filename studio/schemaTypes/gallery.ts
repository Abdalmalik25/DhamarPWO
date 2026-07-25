import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'gallery',
  type: 'document',
  title: 'البوم الصور',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'عنوان البوم',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'الوصف',
    }),
    defineField({
      name: 'images',
      type: 'array',
      title: 'الصور',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'التسميات',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'النص البديل',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'الفئة',
      options: {
        list: [
          {value: 'projects', title: 'مشاريع'},
          {value: 'facilities', title: 'منشآت'},
          {value: 'events', title: 'فعاليات'},
          {value: 'infrastructure', title: 'بنية تحتية'},
        ],
      },
    }),
    defineField({
      name: 'date',
      type: 'date',
      title: 'التاريخ',
    }),
  ],
})
