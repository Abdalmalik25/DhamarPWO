# دليل حماية الكود والبيئات
# Code Protection & Anti-Reverse Engineering Guide

## 📋 فهرس المحتويات

1. [الملفات المحمية](#الملفات-المحمية)
2. [حماية من Reverse Engineering](#حماية-من-reverse-engineering)
3. [تحسين الأداء والموثوقية](#تحسين-الأداء-والموثوقية)
4. [الحماية من العبث بالمحتوى](#الحماية-من-العبث-بالمحتوى)
5. [أمان الكود المصدري](#أمان-الكود-المصدري)
6. [إجراءات إضافية للحماية](#إجراءات-إضافية-للحماية)

---

## 🔒 الملفات المحمية

### 1.1 ملفات يجب عدم رفعها إلى GitHub (مُعدّة في `.gitignore`)

```yaml
الملفات الحساسة الممنوعة:
  ✅ .env                    # جميع متغيرات البيئة
  ✅ .env.local             # متغيرات التطوير المحلي
  ✅ .env.production        # متغيرات الإنتاج
  ✅ .env.*.local           # جميع ملفات .env المحلية
  ✅ .gitignore             # قائمة الملفات المحمية
  
  ملفات البناء:
  ✅ dist/                  # مجلد البناء النهائي
  ✅ build/                 # مجلد البناء البديل
  ✅ out/                   # مجلد الإخراج
  
  التبعيات:
  ✅ node_modules/          # مكتبات Node.js
  ✅ pnpm-lock.yaml         # قفل التبعيات
  
  IDE و OS:
  ✅ .vscode/               # إعدادات VS Code
  ✅ .idea/                 # إعدادات JetBrains
  ✅ *.swp, *.swo           # ملفات Vim
  ✅ .DS_Store, Thumbs.db   # ملفات النظام
```

### 1.2 ملفات يمكن رفعها بأمان

```yaml
ملفات آمنة للرفع:
  ✅ .env.example           # مثال بدون قيم حقيقية
  ✅ vercel.json            # تكوين النشر العام
  ✅ package.json           # التبعيات (بدون قيم حساسة)
  ✅ src/                   # الكود المصدري
  ✅ public/                # الملفات العامة
  ✅ supabase/              # migrations (بدون بيانات حساسة)
  ✅ scripts/               # سكربتات المساعدة
  ✅ docs/                  # الوثائق
```

### 1.3 محتويات `.env.example` (يجب أن تكون عامة)

```env
# ❌ NEVER commit real values
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ✅ Use placeholders only
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🔐 حماية من Reverse Engineering

### 2.1 حماية الكود في الإنتاج

```yaml
Vite Build Optimizations:
  - [ ] Tree Shaking: يُزيل الكود غير المستخدم ✓
  - [ ] Minification: يُصغّر الكود (Terser) ✓
  - [ ] Dead Code Elimination: يزيل الكود الميت ✓
  - [ ] Scope Hoisting: يحسن الأداء ✓

الملفات الناتجة:
  - [ ] assets/index-[hash].js (minified & obfuscated)
  - [ ] assets/index-[hash].css (minified)
  - [ ] Source maps (اختياري - يُفضل تعطيلها في الإنتاج)

تعطيل Source Maps في الإنتاج:
  // vite.config.ts
  export default defineConfig({
    build: {
      sourcemap: false, // أو 'hidden' لـ hidden source maps
    }
  })
```

### 2.2 تشفير الكود المصدر (Code Obfuscation)

```typescript
// للتثبيت:
// pnpm add -D rollup-plugin-obfuscator

// vite.config.ts
import { obfuscator } from 'rollup-plugin-obfuscator';

export default defineConfig({
  plugins: [
    react(),
    obfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayThreshold: 0.75,
    })
  ]
})
```

⚠️ **ملاحظة:** التشفير لا يمنع reverse engineering كلياً، لكنه يزيد الصعوبة.

### 2.3 حماية API Keys والبيانات الحساسة

```yaml
Critical Protection:
  1. [ ] API Keys **NEVER** في الكود المصدري
  2. [ ] Use environment variables فقط
  3. [ ] Server-side validation (Supabase edge functions)
  4. [ ] Rate limiting على جميع الـ API endpoints
  5. [ ] IP whitelisting (إذا أمكن)
  6. [ ] API Key rotation دوري

مثال تخزين آمن:
  // ✅ صحيح - في .env
  VITE_SUPABASE_ANON_KEY=...
  
  // ❌ خطأ - في الكود
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### 2.4 منع فحص العناصر (Browser DevTools)

```typescript
// ⚠️ تحذير: لا يمكن منع DevTools بشكل كامل
// لكن يمكن جعله أصعب:

// 1. كشف فتح DevTools
// src/lib/anti-debug.ts
export const detectDevTools = () => {
  const threshold = 160;
  
  setInterval(() => {
    const devtools = { open: false, orientation: undefined };
    
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      devtools.open = true;
      
      // إجراءات:
      // - تنبيه المستخدم
      // - تعطيل بعض الوظائف
      // - تسجيل الحدث
    }
  }, 500);
};

// 2. تعطيل Right-click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// 3. تعطيل حداثيات لوحة المفاتيح
document.addEventListener('keydown', (e) => {
  // F12, Ctrl+Shift+I, Ctrl+Shift+J
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key))
  ) {
    e.preventDefault();
  }
});
```

---

## ⚡ تحسين الأداء والموثوقية

### 3.1 Build-time Optimizations

```typescript
// vite.config.ts - تحسينات البناء
export default defineConfig({
  build: {
    // 1. حجم الحزمة المستهدفة
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    
    // 2. تقسيم الكود (Code Splitting)
    rollupOptions: {
      output: {
        manualChunks: {
          // فصل المكتبات الكبيرة
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'react-icons'],
          'vendor-maps': ['leaflet', 'react-leaflet'],
        },
      },
    },
    
    // 3. حجم Chunk
    chunkSizeWarningLimit: 500, // KB
    
    // 4. Source maps (اختياري للإنتاج)
    sourcemap: false,
  },
  
  // 5. Prefetching ذكي
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
```

### 3.2 Compression و Caching

```json
// vercel.json - موجود مُعد مسبقاً
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 3.3 Service Worker Optimizations

```typescript
// public/sw.js - محسّن
const CACHE_NAME = 'pwo-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
];

// تحديث ذكي للـ Cache
const updateCache = async () => {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  requests.forEach((request) => {
    cache.delete(request);
  });
  
  await cache.addAll(STATIC_ASSETS);
};
```

### 3.4 Image Optimization

```yaml
Optimizations Applied:
  - [ ] WebP format עם fallbacks
  - [ ] AVIF format للصور عالية الجودة
  - [ ] Responsive images (srcset & sizes)
  - [ ] Lazy loading للصور خارج الشاشة
  - [ ] SVG للـ icons (minified)
  - [ ] Image CDN (Cloudinary/Imgix) - اختياري

مثال:
  <img
    src="image.webp"
    srcset="image-400.webp 400w, image-800.webp 800w"
    sizes="(max-width: 768px) 100vw, 50vw"
    loading="lazy"
    alt="وصف الصورة"
  />
```

### 3.5 Reliability Measures

```yaml
High Availability:
  - [ ] CDN مُفعل (Vercel/Cloudflare)
  - [ ] DDoS Protection
  - [ ] Auto-scaling
  - [ ] Health checks آلية (/api/health)
  - [ ] Graceful degradation
  - [ ] Offline fallback pages
  
Monitoring:
  - [ ] Uptime monitoring (UptimeRobot)
  - [ ] Performance monitoring (Web Vitals)
  - [ ] Error tracking (Sentry)
  - [ ] Real User Monitoring (RUM)
```

---

## 🛡️ الحماية من العبث بالمحتوى

### 4.1 حماية النماذج (Forms)

```typescript
//src/lib/form-protection.ts

// 1. CSRF Protection
export const csrfProtection = {
  getToken: () => {
    return localStorage.getItem('csrf_token');
  },
  
  validate: (token: string) => {
    return token && token.length > 32;
  }
};

// 2. Rate Limiting على العميل
export const rateLimiter = {
  requests: new Map(),
  
  check: (key: string, limit: number, window: number) => {
    const now = Date.now();
    const requests = rateLimiter.requests.get(key) || [];
    
    const recentRequests = requests.filter(
      (time) => now - time < window
    );
    
    if (recentRequests.length >= limit) {
      return false; // محظور
    }
    
    recentRequests.push(now);
    rateLimiter.requests.set(key, recentRequests);
    return true;
  }
};

// 3. Honeypot للبوتات
export const honeypot = {
  fields: ['website', 'email_confirm', 'phone_confirm'],
  
  check: (formData: FormData) => {
    for (const field of honeypot.fields) {
      if (formData.get(field)) {
        return false; // Bot detected
      }
    }
    return true;
  }
};
```

### 4.2 Content Integrity

```typescript
// التحقق من سلامة المحتوى

// 1. Hash verification للبيانات الحساسة
export const verifyDataIntegrity = (data: string, hash: string) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  return crypto.subtle.digest('SHA-256', dataBuffer)
    .then((buffer) => {
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return hashHex === hash;
    });
};

// 2. Timestamp validation
export const validateTimestamp = (timestamp: number, maxAge: number) => {
  const now = Date.now();
  const age = now - timestamp;
  return age < maxAge;
};
```

### 4.3 Protection Against Content Tampering

```yaml
Client-side:
  - [ ] Input sanitization (DOMPurify)
  - [ ] Output encoding (React auto-escapes)
  - [ ] Content hashing
  - [ ] Signature verification

Server-side (Supabase):
  - [ ] Row Level Security (RLS)
  - [ ] Database triggers للـ audit
  - [ ] Timestamps على جميع السجلات
  - [ ] Version control للمحتوى الحساس

مثال RLS Policy:
  -- منع العبث بالبيانات
  CREATE POLICY "Protect content" ON posts
    FOR ALL
    USING (auth.uid() = author_id);
```

---

## 🔐 أمان الكود المصدري

### 5.1 Branch Protection (GitHub)

```yaml
إعدادات الحماية:
  Branch: main
    - [ ] Require pull request قبل الـ merge
    - [ ] Require approvals (2+ reviewers)
    - [ ] Require status checks (CI/CD)
    - [ ] Require branches up-to-date
    - [ ] Include administrators في القيود
    - [ ] Restrict pushes (أعضاء فقط)
    - [ ] Restrict force pushes
    - [ ] Restrict deletions
  
  Branch: develop
    - [ ] Require pull request
    - [ ] Require 1 approval
```

### 5.2 CODEOWNERS File

```yaml
# .github/CODEOWNERS

# الأمان - يتطلب مراجعة
* @security-team

# الكود المصدري
/src/ @m.haielalbahri@pwo-dhamar.gov.ye
/src/lib/ @m.haielalbahri@pwo-dhamar.gov.ye
/src/pages/ @m.haielalbahri@pwo-dhamar.gov.ye

# قاعدة البيانات
/supabase/ @db-admin

# الإعدادات
/vercel.json @devops
/.env* @security-team
```

### 5.3 Pre-commit Hooks (Husky)

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "pnpm lint && pnpm typecheck",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ]
  }
}
```

### 5.4 Secret Scanning

```yaml
GitHub Actions:
  - [ ] secret-scanning مُفعل تلقائياً
  - [ ] Dependabot alerts مُفعل
  - [ ] Code scanning (CodeQL)
  - [ ] dependency review

أدوات مطلوبة:
  - [ ] git-secrets
  - [ ] gitleaks
  - - [ ] truffleHog

فحص دوري:
  ```bash
  # استخدام gitleaks
  gitleaks detect --source .
  
  # استخدام truffleHog
  trufflehog filesystem .
  ```
```

---

## 🚀 إجراءات إضافية للحماية

### 6.1 Two-Factor Authentication (2FA)

```yaml
GitHub:
  - [ ] تفعيل 2FA على جميع الحسابات
  - [ ] استخدام authenticator apps
  - [ ] backup codes محفوظة بشكل آمن

Vercel:
  - [ ] 2FA مُفعل
  - [ ] Team access restricted

Supabase:
  - [ ] 2FA مُفعل
  - [ ] Audit logging مُفعل
```

### 6.2 Access Control

```yaml
Principle of Least Privilege:
  - [ ] Team members لديهم صلاحيات محدودة
  - [ ] Service accounts للـ automation
  - [ ] Regular access reviews (شهرياً)
  - [ ] Offboarding process (عند مغادرة أعضاء الفريق)

GitHub Teams:
  - Admins: Full access
  - Maintainers: Write access (PR approval required)
  - Contributors: PR only
  - Read-only: Stakeholders
```

### 6.3 Audit Logging

```yaml
Logging Requirements:
  - [ ] Git push/pull/merge logs
  - [ ] Deployment logs
  - [ ] Database access logs
  - [ ] Error logs (Sentry)
  - [ ] Performance logs (Vercel Analytics)
  - [ ] Security events logs

Log Retention:
  - Git history: indefinite
  - Application logs: 90 days
  - Access logs: 30 days
  - Error logs: 1 year
```

### 6.4 Dependency Security

```bash
# فحص دوري للتبعيات
pnpm audit

# تحديث آمن
pnpm update --interactive

# فحص التحديثات المتاحة
pnpm outdated

# استخدام Dependabot (GitHub)
# يُحدث التبعيات تلقائياً مع PR

# فحص أمني
pnpm audit --audit-level=high
```

### 6.5 Docker / Container Security (إذا استخدم)

```dockerfile
# Dockerfile.security
FROM node:18-alpine

# تشغيل كمستخدم غير root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

USER nodeuser

# فحص الصحة
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
```

---

## 📊 مراقبة الأمان المستمرة

### 7.1 Automated Security Scans

```yaml
Tools:
  - GitHub Dependabot (تحديثات أمنية تلقائية)
  - GitHub CodeQL (فحص الكود)
  - Snyk (فحص التبعيات)
  - OWASP ZAP (اختبار اختراق)
  - npm audit (فحص الثغرات)

الجدول:
  - Daily: Automated dependency scans
  - Weekly: Code quality review
  - Monthly: Security audit
  - Quarterly: Penetration testing
```

### 7.2 Incident Response

```yaml
إذا اكتُشف ثغرة:
  1. [ ] عزل الملفات/النظم المتأثرة
  2. [ ] تقييم مدى الضرر
  3. [ ] إصلاح الثغرة عاجلاً
  4. [ ] إشعار المستخدمين (إذا لزم)
  5. [ ] توثيق الحادث
  6. [ ] مراجعة لمنع التكرار

الاتصال:
  - Internal: security@pwo-dhamar.gov.ye
  - GitHub Security Advisory
  - Vercel Support
```

---

## ✅ قائمة التحقق النهائية

### قبل رفع الكود إلى GitHub:

```yaml
الملفات:
  - [ ] .env في .gitignore ✓
  - [ ] لا توجد كلمات مرور في الكود
  - [ ] لا توجد API keys في الكود
  - [ ] .env.example عام فقط (بدون قيم حقيقية)
  - [ ] لا توجد بيانات حساسة في الـ logs

الأمان:
  - [ ] RLS مُفعل في Supabase
  - [ ] Security headers مُعدّة
  - [ ] HTTPS مُفعل
  - [ ] Rate limiting مُعدّل
  - [ ] Input validation مُطبّق
  - [ ] Output encoding مُطبّق

الأداء:
  - [ ] Build successful
  - [ ] Bundle size < 500KB
  - [ ] Lighthouse Score > 90
  - [ ] Images optimized
  - [ ] Caching مُعدّل

الجودة:
  - [ ] Lint passes
  - [ ] TypeScript errors: 0
  - [ ] Tests pass
  - [ ] Code reviewed
  - [ ] Documentation updated
```

### بعد النشر:

```yaml
المراقبة:
  - [ ] Vercel Analytics يعمل
  - [ ] Error tracking يعمل
  - [ ] Uptime monitoring يعمل
  - [ ] SSL Labs Grade A+
  - [ ] Security headers scan OK
  
التوثيق:
  - [ ] commit message واضح
  - [ ] CHANGELOG محدّث
  - [ ] Version bumped
  - [ ] Release notes written
```

---

## 🔗 مراجع وروابط مهمة

```yaml
GitHub Security:
  - https://docs.github.com/en/code-security
  - https://docs.github.com/en/code-security/dependabot
  - https://docs.github.com/en/code-security/secret-scanning

OWASP:
  - https://owasp.org/www-project-top-ten/
  - https://cheatsheetseries.owasp.org/

Tools:
  - https://github.com/gitleaks/gitleaks
  - https://github.com/trufflesecurity/truffleHog
  - https://www.zaproxy.org/

Best Practices:
  - https://vercel.com/security
  - https://supabase.com/docs/guides/auth
```

---

## 📞 التواصل للاستفسارات الأمنية

```yaml
الإبلاغ عن ثغرات:
  Email: security@pwo-dhamar.gov.ye
  Expected Response: 24-48 hours
  
الإبلاغ عن bugs:
  GitHub Issues: https://github.com/Abdalmalik25/DhamarPWO/issues
  
الدعم التقني:
  Email: m.haielalbahri@pwo-dhamar.gov.ye
```

---

## 📝 ملاحظات هامة

1. **لا يمكن حماية الكود بشكل كامل** - لكن يمكن جعل reverse engineering صعباً
2. **الأمان عملية مستمرة** - ليست لمرة واحدة
3. **التوازن بين الأمان والأداء** - لا تُفرط في الحماية على حساب الأداء
4. **التوثيق ضروري** - احفظ كل الإجراءات
5. **المراقبة المستمرة** - راقب السجلات يومياً

---

**© 2026 مكتب الأشغال العامة والطرق - محافظة ذمار**

**Last Updated:** 2026-07-03  
**Review:** Quarterly