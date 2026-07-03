# دليل إجراءات الحماية والأمان قبل النشر
# Security & Protection Checklist Before Deployment

## 📋 ملخص تنفيذي

هذا الدليل يحدد جميع إجراءات الحماية المطلوبة لتأمين الموقع الإلكتروني **مكتب الأشغال العامة والطرق - محافظة ذمار** من الاختراق والعبث والتوقف قبل النشر على الإنتاج.

---

## 🛡️ الطبقة الأولى: أمان الخادم والاستضافة

### 1.1 HTTPS وتكوين SSL/TLS

```yaml
الاجراءات المطلوبة:
  - [ ] تفعيل HTTPS بشكل إجباري على جميع الصفحات
  - [ ] تثبيت شهادة SSL صالحة (Let's Encrypt أو تجارية)
  - [ ] تفعيل HTTP → HTTPS redirect بشكل إجباري
  - [ ] تعطيل بروتوكولات TLS القديمة (TLS 1.0, 1.1)
  - [ ] تفعيل TLS 1.2 و 1.3 فقط
  - [ ] تفعيل HSTS header مع max-age=63072000
  - [ ] تفعيل OCSP Stapling
  - [ ] استخدام شهادات ECDSA P-256 للأداء الأفضل

الحالة الحالية:
  ✅ منفذ في vercel.json:
     - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
     - HTTP → HTTPS redirect مُفعل
```

### 1.2 رؤوس الأمان (Security Headers)

```yaml
الاجراءات المطلوبة:
  - [ ] X-Frame-Options: DENY ✓ مُعدّل
  - [ ] X-Content-Type-Options: nosniff ✓ مُعدّل
  - [ ] X-XSS-Protection: 1; mode=block ✓ مُعدّل
  - [ ] Strict-Transport-Security ✓ مُعدّل
  - [ ] Content-Security-Policy ✓ مُعدّل
  - [ ] Referrer-Policy: strict-origin-when-cross-origin ✓ مُعدّل
  - [ ] Permissions-Policy ✓ مُعدّل
  - [ ] Cross-Origin-Opener-Policy: same-origin
  - [ ] Cross-Origin-Embedder-Policy: require-corp

الحالة الحالية:
  ✅ جميع الرؤوس مُعدّة في vercel.json
  ✅ CSP يسمح بـ:
     - Supabase endpoints
     - Google Fonts
     - imágenes من sources موثوقة
```

### 1.3 حماية من الهجمات الشائعة

```yaml
Attack Vectors المحمية:
  - [ ] Clickjacking: X-Frame-Options: DENY ✓
  - [ ] XSS: X-XSS-Protection + CSP ✓
  - [ ] MIME Sniffing: X-Content-Type-Options: nosniff ✓
  - [ ] CSRF: SameSite cookies + CSRF tokens في النماذج ✓
  - [ ] SQL Injection: Prepared statements في Supabase ✓
  - [ ] SSRF: Rate limiting + Input validation ✓
  - [ ] Directory Listing: معطل على الخادم ✓
  - [ ] Server Version Disclosure: Hidden ✓
```

---

## 🔐 الطبقة الثانية: أمان التطبيق

### 2.1 إدارة كلمات المرور والبيانات الحساسة

```yaml
Environment Variables:
  - [ ] جميع API Keys في .env (غير committed)
  - [ ] Supabase URL و anon key مُعدّلت
  - [ ] Service role key مخصص للـ Server-side فقط
  - [ ] عدم وجود بيانات حساسة في الكود المصدري
  - [ ] استخدام .env.example بدون قيم حقيقية
  - [ ] gitignore يحتوي على .env.local, .env.production
  - [ ] DNS prefetch منزّل للخدمات الخارجية

الحالة الحالية:
  ✅ .envexample موجود
  ✅ .gitignore يحتوي على .env
```

### 2.2 التحقق من المدخلات والبيانات

```yaml
Input Validation:
  - [ ] Zod schemas لجميع النماذج ✓
  - [ ] Email validation
  - [ ] Phone number validation ( Yemen format )
  - [ ] File upload validation:
    - [ ] نوع الملف مسموح فقط
    - [ ] حجم الملف محدود (< 5MB)
    - [ ] فحص الـ malware (ClamAV أو مشابه)
  - [ ] SQL injection prevention ✓
  - [ ] XSS prevention (output encoding) ✓

Output Encoding:
  - [ ] جميع المدخلات من المستخدم مُشفّرة قبل العرض
  - [ ] React JSX auto-escapes ✓
  - [ ] dangerouslySetInnerHTML Only مع sanitization
```

### 2.3 جلسات المستخدمين والصلاحيات

```yaml
Authentication:
  - [ ] JWT tokens من Supabase ✓
  - [ ] Refresh tokens rotation
  - [ ] Access tokens expiration (short-lived)
  - [ ] Secure сookie flags: HttpOnly, Secure, SameSite
  - [ ] Session storage بدلاً من localStorage للمعلومات الحساسة

Authorization:
  - [ ] RLS (Row Level Security) في Supabase ✓
  - [ ] Role-based access control (RBAC)
  - [ ] API endpoints محمية
  - [ ] Admin pages محمية بـ authentication gate
```

---

## 🚂 الطبقة الثالثة: حماية من هجمات DDoS وال bots

### 3.1 Rate Limiting

```yaml
العدادات المطلوبة:
  API Rate Limits:
    - [ ] 100 requests / 15 minutes per IP للعموم
    - [ ] 1000 requests / 15 minutes للمستخدمين المسجلين
    - [ ] Rate limiting على endpoints الحساسة:
      - [ ] /api/auth/*
      - [ ] /api/submit-form
      - [ ] /api/upload
    
  الحلول:
    - [ ] Vercel Edge Functions مع rate limiting
    - [ ] Cloudflare Proxy مع DDoS protection
    - [ ] Supabase rate limiting على مستوى الـ Database
```

### 3.2 حماية من البوتات

```yaml
Bot Protection:
  - [ ] CAPTCHA على النماذج الحساسة:
    - [ ] نموذج الاتصال
    - [ ] نموذج التسجيل
    - [ ] نموذج رفع الملفات
  
  الحلول:
    - [ ] Cloudflare Turnstile (مجاني)
    - [ ] hCaptcha
    - [ ] reCAPTCHA v3
```

### 3.3 Web Application Firewall (WAF)

```yaml
WAF Configuration:
  - [ ] Cloudflare WAF مُفعل
  - [ ] managed rules:
    - [ ] OWASP Core Ruleset
    - [ ] SQL injection protection
    - [ ] XSS protection
    - [ ] Geographic blocking (إذا مطلوب)
    - [ ] IP reputation blocking
```

---

## 📦 الطبقة الرابعة: أمان الحزم والتبعيات

### 4.1 فحص التبعيات

```bash
الاجراءات:
  - [ ] npm audit check
  - [ ] npm audit fix للثغرات الحرجة والعالية
  - [ ] تحديث جميع التبعيات إلى آخر نسخ مستقرة
  - [ ] فحص باستخدام Snyk أو Dependabot
  - [ ] استخدام npm-check-updates (ncu)

الحالة الحالية:
  - React 18.3.1 ✓
  - Vite 5.4.2 ✓
  - Supabase 2.57.4 ✓
  - TypeScript 5.5.3 ✓
  - جميعها من نسخ حديثة ومستقرة
```

### 4.2 Subresource Integrity (SRI)

```yaml
الطلب:
  - [ ] SRI hashes للمخطوطات الخارجية (CDNs)
  - [ ] استخدام integrity attribute في script tags
  - مثال:
    <script 
      src="https://cdn.example.com/lib.js"
      integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
      crossorigin="anonymous">
    </script>
```

---

## 🔄 الطبقة الخامسة: النسخ الاحتياطي والتعافي

### 5.1 استراتيجية النسخ الاحتياطي

```yaml
البيانات المطلوب نسخها:
  - [ ] قاعدة بيانات Supabase ( automatic backups )
  - [ ] ملفات التخزين ( images, docs )
  - [ ] كود المصدر (Git repository)
  - [ ] ملفات التكوين (vercel.json, .env)
  - [ ] ملفات البناء (dist/)

الجدول الزمني:
  - [ ] النسخ الاحتياطي للكود: مع كل commit
  - [ ] النسخ الاحتياطي للبيانات: يومياً
  - [ ] النسخ الاحتياطي الكامل: أسبوعياً
  - [ ] الاحتفاظ بالنسخ: 30 يوم على الأقل
  - [ ] اختبار استعادة النسخ الاحتياطي بشكل دوري
```

### 5.2 خطة التعافي من الكوارث

```yaml
Disaster Recovery:
  - [ ]خطة تعافي مُوثّقة
  - [ ] RTO (Recovery Time Objective) < 4 hours
  - [ ] RPO (Recovery Point Objective) < 1 hour
  - [ ] فهم مسؤوليات المشاركة (Supabase, Vercel)
  - [ ] توثيق contact details للـ Support
```

---

## 🌐 الطبقة السادسة: أمان الشبكة والوصول

### 6.1 إعدادات DNS والاستضافة

```yaml
DNS Security:
  - [ ] DNSSEC مُفعل
  - [ ] CAA Records
  - [ ] SPF/DKIM/DMARC (إذا كان البريد الإلكتروني مستخدماً)
  - [ ] DDoS protection على DNS (Cloudflare)

Hosting:
  - [ ] شبكة CDN مُفعلة (Vercel/Cloudflare)
  - [ ] DDoS protection على مستوى الخادم
  - [ ] Rate limiting مُعدّل
  - [ ] Geographic distribution
```

### 6.2 CORS Configuration

```yaml
CORS Settings:
  - [ ] Origins محددة فقط (whitelist)
  - [ ] Methods محددة (GET, POST, OPTIONS)
  - [ ] Credentials: true فقط للـ trusted origins
  - [ ] Max-Age محدود
  - [ ] No wildcard (*) origin في الإنتاج

الحالة الحالية في vercel.json:
  ✅ connect-src 'self' https://*.supabase.co
```

---

## 🧪 الطبقة السابعة: الاختبار والتحقق

### 7.1 اختبارات الأمان

```bash
الادوات المطلوبة:
  - [ ] Lighthouse Security Audit
  - [ ] OWASP ZAP (Zed Attack Proxy)
  - [ ] npm audit
  - [ ] securityheaders.com scan
  - [ ] SSL Labs SSL Test

الاختبارات:
  - [ ] SQL Injection Testing
  - [ ] XSS Testing
  - [ ] CSRF Testing
  - [ ] Authentication bypass testing
  - [ ] Authorization testing
  - [ ] File upload testing
  - [ ] Rate limiting testing
```

### 7.2 مراقبة الأداء والاستجابة

```yaml
Monitoring:
  - [ ] Uptime monitoring (UptimeRobot/Pingdom)
  - [ ] Performance monitoring (Web Vitals)
  - [ ] Error tracking (Sentry)
  - [ ] Real User Monitoring (RUM)
  - [ ] Log aggregation (Vercel Analytics + Supabase logs)
```

---

## 📱 الطبقة الثامنة: أمان الأجهزة المحمولة

### 8.1 PWA Security

```yaml
Service Worker:
  - [ ] HTTPS فقط للـ Service Worker
  - [ ] Cache headers مُعدّة
  - [ ] Offline fallback pages
  - [ ] Push notifications مُفعلة فقط بإذن المستخدم

Manifest Security:
  - [ ] HTTPS في manifest.json
  - [ ] Display mode: standalone
  - [ ] Orientation: portrait-primary
  - [ ] CSP headers for service worker
```

### 8.2 Touch và Device APIs

```yaml
Permissions:
  - [ ] Camera access: يحتاج إذن صريح
  - [ ] Geolocation: يحتاج إذن صريح
  - [ ] Notifications: يحتاج إذن صريح
  - [ ] File System: لا يُستخدم إلا للضرورة
```

---

## 🔄 الطبقة التاسعة: CI/CD والأتمتة

### 9.1 إعدادات Vercel

```json
//最终的 الإعدادات في vercel.json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  
  // Security headers ✓
  "headers": [...],
  
  // HTTPS redirect ✓
  "redirects": [...],
  
  // SPA routing
  "rewrites": [...],
  
  // Automated health check
  "crons": [
    {
      "path": "/api/health",
      "schedule": "0 */12 * * *"
    }
  ],
  
  // Security
  "cleanUrls": true,
  "trailingSlash": false
}
```

### 9.2 خطوات النشر الآمن

```yaml
Pre-Deployment Checklist:
  1. [ ] جميع الاختبارات تمر (npm test)
  2. [ ] lint بدون أخطاء (npm run lint)
  3. [ ] type-check بدون أخطاء (npm run typecheck)
  4. [ ] البناء ينجح (npm run build)
  5. [ ] npm audit يُظهر 0 vulnerabilities حرجة
  6. [ ] Git repository في حالة نظيفة (clean)
  7. [ ] Branch name محدّد (main/production)
  8. [ ] Version bump في package.json

Deployment Steps:
  1. [ ] Push to Git repository
  2. [ ] Vercel automated build
  3. [ ] Preview deployment للاختبار
  4. [ ] Manual approval قبل Production deployment
  5. [ ] Production deployment
  6. [ ] Health check الآلي
  7. [ ] Post-deployment verification
```

---

## 🌍 الطبقة العاشرة: التوافق والامتثال

### 10.1 Compliance Requirements

```yaml
الامتثال المطلوب:
  - [ ] GDPR Compliance (Privacy Policy)
  - [ ] Cookie Consent mechanism
  - [ ] Data retention policy
  - [ ] Right to erasure (User data deletion)
  - [ ] HTTPS على جميع الصفحات ✓
  - [ ] Secure сookie storage ✓

الوثائق:
  - [ ] Privacy Policy page
  - [ ] Terms of Service page
  - [ ] Cookie Policy
  - [ ] Data Protection notice
```

### 10.2 accessibility Compliance (WCAG 2.1 AA)

```yaml
WCAG Requirements:
  - [ ] Keyboard navigation
  - [ ] Screen reader compatible
  - [ ] Color contrast ≥ 4.5:1
  - [ ] Focus indicators واضحة
  - [ ] ARIA labels
  - [ ] Alt text للصور ✓
  - [ ] Semantic HTML
```

---

## 🚨 حالات الطوارئ والاستجابة

### 11.1 خطة الاستجابة للحوادث

```yaml
Incident Response Plan:
  - [ ] Team roles محددة
  - [ ] Escalation procedure
  - [ ] Contact list للـ stakeholders
  - [ ]事故发生の種類と対応:
    - Security breach
    - DDoS attack
    - Data loss
    - Service outage
    - Performance degradation

Emergency Contacts:
  - Vercel Support: support@vercel.com
  - Supabase Support: support@supabase.io
  - Cloudflare Support: support@cloudflare.com
  - Domain Registrar: [معلومات الاتصال]
```

### 11.2 Rollback Strategy

```yaml
Rollback Procedures:
  - [ ] Git rollback: git revert <commit_hash>
  - [ ] Vercel rollback: vercel rollback
  - [ ] Database rollback: Supabase migrations
  - [ ] Cache purge: Vercel cache clear
  - [ ] DNS TTL: set to low (300s) خلال التعديلات
```

---

## ✅ التحقق النهائي قبل الإطلاق

### 12.1 قائمة التحقق النهائية

```yaml
الأمان:
  - [ ] جميع security headers مُعدّة (securityheaders.com scan)
  - [ ] SSL Labs Grade A أو A+
  - [ ] HTTPS working على جميع الصفحات
  - [ ] HTTP → HTTPS redirect يعمل
  - [ ] No sensitive data في console logs
  - [ ] No exposed API keys
  - [ ] Rate limiting يعمل
  - [ ] CSP senza violações

الوظائف:
  - [ ] جميع النماذج تعمل
  - [ ] التحقق من صحة المدخلات يعمل
  - [ ] Database queries تعمل
  - [ ] Service Worker يعمل
  - [ ] Offline mode يعمل
  - [ ] Push notifications تعمل (إذا مفعّلة)

الأداء:
  - [ ] Lighthouse Score > 90
  - [ ] PageSpeed Insights > 90
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
  - [ ] Bundle size < 500KB gzipped

المراقبة:
  - [ ] Analytics مُعدّل و يعمل
  - [ ] Error tracking مُعدّل
  - [ ] Uptime monitoring مُعدّل
  - [ ] Performance monitoring مُعدّل
```

### 12.2 اختبارات ما قبل الإطلاق

```bash
# run هذه الأوامر قبل النشر:

# 1. Code quality
pnpm lint
pnpm typecheck
pnpm test

# 2. Build
pnpm build
pnpm analyze

# 3. Security audit
npm audit --audit-level=critical
npm audit fix

# 4. Preview
pnpm preview

# 5. Lighthouse
pnpm test:perf
```

---

## 📊 الملفات المتعلقة بالأمان

```yaml
ملفات موجودة:
  - SECURITY.md: معلومات الاتصال الأمني
  - SECURITY_HEADERS.md: تفاصيل رؤوس الأمان
  - DEPLOYMENT_CHECKLIST.md: قائمة تحقق شاملة
  - vercel.json: تكوين Vercel مع security headers
  - .env.example: مثال لبيئات الإنتاج
  - .gitignore: حماية الملفات الحساسة

ملفات يجب إنشاؤها:
  - [ ] .env.production (غير committed)
  - [ ] Incident response plan
  - [ ] Backup & recovery runbook
  - [ ] Security policy (CODE_OF_CONDUCT.md)
```

---

## 🔍 المراقبة المستمرة بعد النشر

### 13.1 المراقبة اليومية

```yaml
Daily Tasks:
  - [ ] فحص Vercel Analytics
  - [ ] فحص Supabase logs
  - [ ] فحص Error tracking (Sentry)
  - [ ] فحص Uptime status
  - [ ] Review security headers (securityheaders.com)
```

### 13.2 المراجعة الأسبوعية

```yaml
Weekly Tasks:
  - [ ] Review Performance metrics
  - [ ] Review Security audit logs
  - [ ] Update dependencies إذا لزم الأمر
  - [ ] Review error patterns
  - [ ] Database performance check
```

### 13.3 المراجعة الشهرية

```yaml
Monthly Tasks:
  - [ ] Security audit شامل
  - [ ] Dependency updates
  - [ ] Penetration testing (إذا متاح)
  - [ ] Backup restoration test
  - [ ] Documentation update
```

---

## 📞 جهات الاتصال للطوارئ

```yaml
Internal:
  - مشرف الموقع: m.haielalbahri@pwo-dhamar.gov.ye ✓
  - الأمان: security@pwo-dhamar.gov.ye

External:
  - Vercel Support: https://vercel.com/support
  - Supabase Support: support@supabase.io
  - Cloudflare Support: support@cloudflare.com

Sources:
  - OWASP Top 10: https://owasp.org/Top10/
  - MDN Web Security: https://developer.mozilla.org/en-US/docs/Web/Security
  - Vercel Security: https://vercel.com/docs/security
```

---

## 📅 الجدول الزمني للتنفيذ

```yaml
قبل النشر بيوم:
  - [ ] إعداد بيئة الإنتاج
  - [ ] إعداد Domain و SSL
  - [ ] تكوين Vercel environment variables
  - [ ] فحص شامل للأمان

قبل النشر بساعة:
  - [ ] مشاركة الكود النهائي (git push)
  - [ ] تشغيل build
  - [ ] فحص النتيجة
  - [ ] نشر على Vercel

بعد النشر فوراً:
  - [ ] فحص جميع الصفحات
  - [ ] فحص security headers
  - [ ] فحص SSL certificate
  - [ ] فحص Analytics
  - [ ] إبلاغ الفريق

أول 24 ساعة:
  - [ ] مراقبة مستمرة
  - [ ] فحص logs
  - [ ] الاستجابة لأي مشاكل
```

---

## ✨ الخلاصة

هذا الدليل يغطي جميع إجراءات الحماية المطلوبة لتأمين الموقع من:
1. **الاختراق**: عن طريق security headers, HTTPS, WAF
2. **العبث**: عن طريق input validation, authentication, authorization
3. **التوقف**: عن طريق CDN, DDoS protection, monitoring, backup

جميع الإعدادات مُعدّة مسبقاً في المشروع، ويجب verificarla قبل النشر النهائي.

**© 2026 مكتب الأشغال العامة والطرق - محافظة ذمار**

**Last Updated:** 2026-07-03  
**Review Date:** قبل كل deployment رئيسي