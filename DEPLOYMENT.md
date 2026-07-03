# دليل النشر والتشغيل - الإصدار 5.0.0
## مكتب الأشغال العامة والطرق - محافظة ذمار

---

## 1. المتطلبات الأساسية

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- حساب Vercel (أو أي منصة استضافة أخرى)
- مشروع Supabase مُعد مسبقاً

---

## 2. إعداد متغيرات البيئة

### 2.1 نسخ ملف المتغيرات
```bash
cp .env.example .env
```

### 2.2 تعديل القيم الأساسية
```env
# قاعدة البيانات
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# أمان - استخدام مفاتيح قوية عشوائية (32+ حرف)
VITE_APP_ENCRYPTION_KEY=your-secure-32-char-encryption-key-here-1234567890
VITE_CSRF_SECRET=your-csrf-secret-key-here-1234567890

# عنوان الموقع
VITE_ALLOWED_ORIGINS=https://pwo-dhamar.gov.ye,https://www.pwo-dhamar.gov.ye

# الميزات
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PWA=true
VITE_ENABLE_PRINT=true
```

### 2.3 توليد مفاتيح أمنية آمنة
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 3. بناء المشروع محلياً

```bash
# تثبيت الاعتمادات
pnpm install

# تشغيل فحوصات الجودة
pnpm lint
pnpm typecheck
pnpm format:check

# بناء المشروع
pnpm build

# معاينة النتائج محلياً
pnpm preview
```

---

## 4. التحقق من الجودة

### 4.1 فحوصات الأداء
```bash
# تحليل حجم الحزمة
pnpm analyze

# اختبار الأداء مع Lighthouse
pnpm test:perf
```

### 4.2 التحقق من الأمان
```bash
# فحص ثغرات الاعتمادات
pnpm audit

# فحص نوع TypeScript
pnpm typecheck

# فحص جودة الكود
pnpm lint
```

---

## 5. النشر على Vercel

### 5.1 إعداد المشروع
```bash
# تسجيل الدخول إلى Vercel
vercel login

# ربط المشروع
vercel link
```

### 5.2 إعداد متغيرات البيئة في Vercel
```bash
# إضافة متغيرات البيئة
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add VITE_APP_ENCRYPTION_KEY production
vercel env add VITE_CSRF_SECRET production
vercel env add VITE_ALLOWED_ORIGINS production
vercel env add VITE_ENABLE_ANALYTICS production
vercel env add VITE_ENABLE_ERROR_REPORTING production
vercel env add VITE_ENABLE_PWA production
```

### 5.3 النشر
```bash
# نشر الإنتاج
vercel --prod

# أو استخدام السكربت
pnpm deploy:vercel
```

---

## 6. إعدادات ما بعد النشر

### 6.1 التحقق من النشر
- [ ] الموقع يعمل على https://pwo-dhamar.gov.ye
- [ ] جميع الصفحات تعمل بشكل صحيح
- [ ] النماذج تُرسل البيانات بنجاح
- [ ] الخريطة تعمل بشكل صحيح
- [ ] PWA يعمل (تثبيت التطبيق)
- [ ] Service Worker نشط

### 6.2 إعداد المراقبة
- [ ] تفعيل تحليلات Google Analytics
- [ ] إعداد Sentry لمراقبة الأخطاء
- [ ] إعداد تنبيهات Vercel
- [ ] إعداد uptime monitoring

### 6.3 إعداد CDN والاستضافة
- [ ] تفعيل Cloudflare (موصى به)
- [ ] إعداد SSL/TLS
- [ ] إعداد Custom Domain
- [ ] تفعيل Compression (Brotli/Gzip)

---

## 7. الأمان والحماية

### 7.1 رؤوس الأمان (تم إعدادها في vercel.json)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=63072000
- Content-Security-Policy: كما هو معرف في vercel.json

### 7.2 متغيرات البيئة
- ✅ جميع المفاتيح السرية في متغيرات البيئة
- ✅ عدم تخزين كلمات المرور أو البيانات الحساسة في الكود
- ✅ استخدام HTTPS فقط

### 7.3 قاعدة البيانات
- [ ] RLS (Row Level Security) مفعّل في Supabase
- [ ] سياسات الأمان مُعدة للجداول الحساسة
- [ ] نسخ احتياطية دورية

---

## 8. الأداء والتحسين

### 8.1 الصفحة الرئيسية
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] First Input Delay < 100ms

### 8.2 التحسينات المُطبقة
- ✅ ضغط Gzip/Brotli
- ✅ Code Splitting
- ✅ Tree Shaking
- ✅ Lazy Loading
- ✅ Service Worker للتخزين المؤقت
- ✅ PWA محسّن
- ✅ صور مُحسّنة (WebP/Avif)

---

## 9. استكشاف الأخطاء

### 9.1 مشاكل البناء
```bash
# تنظيف وإعادة البناء
pnpm clean
pnpm install
pnpm build
```

### 9.2 مشاكل النشر
```bash
# سجلات Vercel
vercel logs

# إعادة النشر
vercel --prod --force
```

### 9.3 مشاكل قاعدة البيانات
```bash
# فحص الاتصال
pnpm test:db

# مراجعة migrations
ls supabase/migrations/
```

---

## 10. الدعم والصيانة

### 10.1 التحديثات الدورية
- تحديث الاعتمادات: `pnpm update`
- مراجعة الأمان: `pnpm audit`
- تنظيف الحزم: `pnpm store prune`

### 10.2 النسخ الاحتياطية
- قاعدة البيانات: يومياً (Supabase)
- الملفات الثابتة: مرتبطة بـ Git
- إعدادات النشر: متوفرة في vercel.json

### 10.3 التواصل
- **الأمان:** security@pwo-dhamar.gov.ye
- **الدعم التقني:** m.haielalbahri@pwo-dhamar.gov.ye
- **ال repository:** https://github.com/Abdalmalik25/DhamarPWO

---

## 11. التحقق النهائي قبل النشر

### 11.1 قائمة التحقق
- [ ] جميع الاختبارات تمر (`pnpm test`)
- [ ] Build ناجح بدون أخطاء (`pnpm build`)
- [ ] Lint بدون أخطاء (`pnpm lint`)
- [ ] TypeCheck بدون أخطاء (`pnpm typecheck`)
- [ ] المتغيرات البيئية مُعدة بشكل صحيح
- [ ] HTTPS مفعّل
- [ ] Domain مُعد بشكل صحيح
- [ ] SSL certificate صالح
- [ ] موقع parked على HTTPS

### 11.2 اختبار يدوي
- [ ] الصفحة الرئيسية: OK
- [ ] صفحة الخدمات: OK
- [ ] النماذج: OK
- [ ] الخريطة: OK
- [ ] التواصل: OK
- [ ] الروابط الخارجية: OK
- [ ] PWA: OK
- [ ] Service Worker: OK

---

## ملاحظات هامة

1. **لا ترفع ملف `.env` إلى Git** - تم إضافته في `.gitignore`
2. **استخدم always HTTPS** - تم إعداده في vercel.json
3. **راقب الأداء دورياً** - استخدم Lighthouse
4. **حدث الاعتمادات بانتظام** - للتأمين
5. **احتفظ بنسخ احتياطية** - قبل أي تحديث كبير

---

## ملخص سريع

```bash
# أول نشر
cp .env.example .env
# ثم عدل القيم
pnpm install
pnpm build
vercel link
vercel env add ...
vercel --prod
```

**تم إعداد الموقع بنجاح للنشر الإنتاجي! ✅**