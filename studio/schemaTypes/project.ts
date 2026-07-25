import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'project',
  type: 'document',
  title: 'المشاريع الإنشائية',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'عنوان المشروع',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'وصف المشروع',
      rows: 4,
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'حالة المشروع',
      options: {
        list: [
          {value: 'planning', title: 'في التخطيط'},
          {value: 'in-progress', title: 'قيد التنفيذ'},
          {value: 'completed', title: 'مكتمل'},
          {value: 'delayed', title: 'متأخر'},
        ],
      },
      initialValue: 'planning',
    }),
    defineField({
      name: 'progress',
      type: 'number',
      title: 'نسبة الإنجاز',
      description: 'من 0 إلى 100',
      initialValue: 0,
    }),
    defineField({
      name: 'budget',
      type: 'string',
      title: 'الميزانية',
    }),
    defineField({
      name: 'startDate',
      type: 'date',
      title: 'تاريخ البدء',
    }),
    defineField({
      name: 'expectedEndDate',
      type: 'date',
      title: 'تاريخ الانتهاء المتوقع',
    }),
    defineField({
      name: 'actualEndDate',
      type: 'date',
      title: 'تاريخ الانتهاء الفعلي',
    }),
    defineField({
      name: 'location',
      type: 'geopoint',
      title: 'الموقع الجغرافي',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'صورة المشروع',
    }),
    defineField({
      name: 'contractor',
      type: 'string',
      title: 'المقاول',
    }),
    defineField({
      name: 'supervisingEngineer',
      type: 'string',
      title: 'المهندس المشرف',
    }),
    defineField({
      name: 'isFeatured',
      type: 'boolean',
      title: 'مشروع مميز',
      initialValue: false,
    }),
  ],
})
