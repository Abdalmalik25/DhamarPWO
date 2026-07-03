# 🏛️ مكتب الأشغال العامة والطرق - محافظة ذمار

## 📖 نظرة عامة

البوابة الإلكترونية الرسمية لمكتب الأشغال العامة والطرق في محافظة ذمار - الجمهورية اليمنية.

### 🎯 الخدمات المتاحة:
- ✅ تراخيص البناء والإعمار
- ✅ اعتماد المخططات الهندسية
- ✅ معاينات ميدانية
- ✅ تصاريح حفريات
- ✅ إفادات فنية
- ✅ شكاوى وتظلمات
- ✅ دليل إرشادي للمستفيدين
- ✅ تتبع المعاملات

---

## 🌟 الميزات الرئيسية

### 📱 تجربة المستخدمMobile)
- **Bottom Navigation** - تنقل سهل
- **Mobile Drawer** - قائمة جانبية
- **Swipe Gestures** - إيماءات اللمس
- **Offline Support** - عمل بدون إنترنت
- **Safe Area Support** - دعم الشاشات الجديدة
- **PWA Ready** - تثبيت كتطبيق

### ⚡ أداء عالي
- **Service Worker** - تخزين مؤقت ذكي
- **Cache-First Strategy** - سرعة تحميل فائقة
- **Lazy Loading** - تحميل كسول للمكونات
- **Code Splitting** - تقسيم الكود تلقائياً
- **Bundle Compression** - ضغط الملفات

### 🎨 تصميم احترافي
- بدون حواف
- LQIP (Low Quality Image Placeholder)
- Shimmer animations
- Priority loading
- Responsive design (Mobile/Tablet/Desktop)

### 🔒 أمان متقدم
- XSS Protection
- Input Validation
- Secure URLs
- Encryption utilities
- Security Headers (CSP, HSTS, X-Frame-Options)
- CORS protection

### 🌐 SEO محسّن
- Meta tags كاملة
- Open Graph
- Twitter Cards
- Structured Data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Canonical URLs

---

## 🚀 التشغيل المحلي

### المتطلبات المسبقة
```bash
Node.js >= 18.x
pnpm >= 8.x
Git
```

### خطوات التثبيت

```bash
# 1. نسخ المستودع
git clone https://github.com/Abdalmalik25/DhamarPWO.git
cd DhamarPWO

# 2. تثبيت المتغيرات
cp .env.example .env
# ثم تعديل .env بالقيم الحقيقية

# 3. تثبيت الحزم
pnpm install

# 4. تشغيل الخادم المحلي
pnpm dev

# 5. فتح المتصفح
# http://localhost:8080
```

---

## 📦 البناء والإنتاج

```bash
# بناء المشروع
pnpm build

# معاينة الإنتاج محلياً
pnpm preview

# فحص TypeScript
pnpm typecheck

# فحص الأكواد
pnpm lint
```

---

## 📁 هيكل المشروع

```
ThamarOfficeWeb/
├── public/
│   ├── sw.js              # Service Worker
│   ├── manifest.json       # PWA Manifest
│   ├── robots.txt          # SEO
│   ├── sitemap.xml         # SEO
│   ├── images/             # الصور الثابتة
│   └── docs/               # الوثائق
├── src/
│   ├── components/         # المكونات العامة
│   ├── pages/              # الصفحات
│   │   ├── home/           # الصفحة الرئيسية
│   │   ├── forms/          # النماذج
│   │   └── ...
│   ├── shared/             # مكونات مشتركة
│   ├── lib/                # المكتبات
│   ├── services/           # الخدمات
│   ├── types/              # TypeScript Types
│   ├── App.tsx             # المكون الرئيسي
│   └── main.tsx            # نقطة الدخول
├── dist/                   # الإنتاج (مُنشأ)
├── .env.example            # المتغيرات البيئية
├── vercel.json             # إعدادات Vercel
├── vite.config.ts          # إعدادات Vite
├── package.json            # الحزم
└── README.md               # هذا الملف
```

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **React** 18.2
- **TypeScript** 5.3
- **Vite** 5.4
- **Tailwind CSS** 3.4
- **Lucide React** (أيقونات)

### Libraries
- **React Router** - التنقل
- **React Leaflet** - الخرائط
- **React Hot Toast** - الإشعارات
- **Zod** - التحقق من البيانات
- **date-fns** - التواريخ

### Deployment
- **Vercel** / **Netlify** / **Nginx**
- **PWA** - Service Worker
- **HTTPS** - Let's Encrypt

---

## 📊 إحصائيات المشروع

| المقياس | القيمة |
|---------|-------|
| الإصدار | 5.0.0 |
| لغة البرمجة | TypeScript + React |
| عدد الصفحات | 10+ |
| عدد النماذج | 8 نماذج رسمية |
| عدد الخدمات | 12 خدمة |
| عدد المكونات | 25+ |
| حجم الإنتاج | ~500KB (gzipped) |
| Lighthouse Score | 90+ |

---

## 🤝 المساهمة

### للمطورين

```bash
# 1. Fork المشروع
# 2. إنشاء فرع جديد
git checkout -b feature/amazing-feature

# 3.Commit التغييرات
git commit -m "Add amazing feature"

# 4. Push الفرع
git push origin feature/amazing-feature

# 5. فتح Pull Request
```

### إرشادات الكود
- استخدم **TypeScript** دائماً
- اتبع **ESLint** rules
- اكتب **تعليقات عربية**
- اختبر قبل الـ commit

---

## 📝 الترخيص

MIT © مكتب الأشغال العامة والطرق - محافظة ذمار

---

## 📞 التواصل

- **الموقع:** https://pwo-dhamar.gov.ye
- **البريد:** dpw.dhamar@yemen.gov.ye
- **الهاتف:** 06-521222
- **العنوان:** مدينة ذمار - شارع الجامعة

---

## 📅 سجل الإصدارات

### الإصدار 5.0.0 (2026-01-02)
- 🎨 تصميم احترافي جديد
- 📱 تجربة موبايل محسّنة
- 🌙 وضع ليلي/نهاري
- 🖨️ طباعة حقيقية
- 📚 محتوى توعوي هندسي
- 🔒 أمان متقدم
- ⚡ أداء محسّن

### الإصدار 4.0.0
- تحسينات عامة

---

## 🙏 شكر خاص

- فريق التطوير
- Ministry of Public Works and Roads
- Local Government - Dhamar Governorate

---

**صُنع بـ ❤️ لمحافظة ذمار**

© 2026 مكتب الأشغال العامة والطرق - محافظة ذمار. جميع الحقوق محفوظة.