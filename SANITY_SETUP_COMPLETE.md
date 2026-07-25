# تم إكمال تفعيل Sanity بالكامل - مكتب الأشغال العامة والطرق

## الخطوات المنجزة ✅

### 1. إنشاء ونشر المخططات (Schemas) - 11 مخطط
تم إنشاء ونشر 11 مخططاً في Sanity:
- **service** - الخدمات الهندسية
- **announcement** - الإعلانات والمستجدات
- **faq** - الأسئلة الشائعة
- **awareness** - المحتوى التوعوي
- **statistic** - الإحصائيات
- **quickLink** - الروابط السريعة
- **siteSettings** - إعدادات الموقع
- **project** - المشاريع الإنشائية ⭐ (جديد)
- **teamMember** - أعضاء الكادر ⭐ (جديد)
- **officialDocument** - الوثائق الرسمية ⭐ (جديد)
- **gallery** - البوم الصور ⭐ (جديد)

### 2. إنشاء محتوى أولي
تم نشر محتوى أولي يشمل:
- إعدادات الموقع الأساسية
- 2 خدمات (تراخيص البناء، الاعتماد الهندسي)
- 2 إحصائيات (رخصة بناء، كادر متخصص)
- 2 روابط سريعة (تتبع المعاملة، طلب ترخيص)

### 3. ربط الموقع بالـ Sanity
- تم تثبيت حزمة `@sanity/client`
- تم إنشاء ملف `src/lib/sanity.ts` (13 دالة جلب + استعلامات)
- تم إنشاء ملف `src/hooks/useSanityContent.ts` (10 React Hooks)
- تم إنشاء مخططات Schema محلياً في `studio/schemaTypes/`

### 4. نشر لوحة التحكم المعيارية
✅ تم نشر Sanity Studio بنجاح

## رابط لوحة التحكم
**https://dhamar-pwo.sanity.studio/**

## الخطوات المتبقية ⏳

### مطلوبة (خطوة واحدة فقط):
1. **إضافة رمز API للقراءة** - ادخل إلى الرابط أعلاه وأنشئ رمز Read Token
2. **تحديث .env** - أضف الرمز إلى متغير `VITE_SANITY_API_READ_TOKEN`

### اختيارية:
3. **إضافة محتوى كامل** - أضف باقي الخدمات والإعلانات والأسئلة الشائعة والمشاريع والكادر
4. **إنشاء مكونات جديدة** - استخدم ال Hooks الجديدة لعرض المشاريع والكادر والوثائق

## كيفية الحصول على رمز API (5 خطوات بسيطة)

1. ادخل إلى https://dhamar-pwo.sanity.studio/
2. سجّل الدخول أو أنشئ حساب
3. اذهب إلى **Settings** → **API** → **Tokens**
4. انقر **Create new token**
5. انسخ الرمز واحفظه في `.env`

## ملفات التكامل الكاملة

```
studio/
  ├── schemaTypes/
  │   ├── service.ts          ✅
  │   ├── announcement.ts      ✅
  │   ├── faq.ts               ✅
  │   ├── awareness.ts         ✅
  │   ├── statistic.ts         ✅
  │   ├── quickLink.ts         ✅
  │   ├── siteSettings.ts      ✅
  │   ├── project.ts           ✅ (جديد)
  │   ├── teamMember.ts        ✅ (جديد)
  │   ├── officialDocument.ts  ✅ (جديد)
  │   └── gallery.ts           ✅ (جديد)
  ├── sanity.config.ts         ✅ (موجود)
  └── sanity.cli.ts            ✅ (موجود)

src/
  ├── lib/
  │   └── sanity.ts            ✅ (13 دالة جلب)
  ├── hooks/
  │   └── useSanityContent.ts  ✅ (10 React Hooks)
  └── pages/home/
      └── homeData.ts          ✅ (بيانات احتياطية)
```

## React Hooks المتاحة

```tsx
import {
  useServices,
  useAnnouncements,
  useFAQs,
  useAwarenessContent,
  useStatistics,
  useQuickLinks,
  useProjects,          // جديد
  useTeamMembers,       // جديد
  useOfficialDocuments, // جديد
  useGalleries,         // جديد
  useHomeContent,
} from './hooks/useSanityContent';
```

## اختبار النظام

بعد إضافة الرمز إلى `.env`:

```bash
pnpm dev
```

سيبدأ الموقع في جلب البيانات من Sanity تلقائياً.

---

**ملاحظة:** الموقع يعمل حالياً بالبيانات الاحتياطية. بعد إضافة الرمز سيتم تحديثه تلقائياً.