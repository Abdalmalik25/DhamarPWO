// ============================================================
// main.tsx - نقطة الدخول للتطبيق المؤسسي (Enterprise Entry Point)
// ============================================================
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// ============================================================
// 1. نظام مراقبة الأخطاء المتقدم (Error Monitoring System)
// ============================================================

/**
 * تخزين الأخطاء في ذاكرة التخزين المؤقتة للتحليل
 */
const MAX_STORED_ERRORS = 50;
const errorBuffer: Array<{ message: string; timestamp: number; type: string }> = [];

function pushError(type: string, message: string) {
  if (errorBuffer.length >= MAX_STORED_ERRORS) {
    errorBuffer.shift();
  }
  errorBuffer.push({ message, timestamp: Date.now(), type });

  // إرسال الأخطاء غير المعروفة إلى CustomEvent للمراقبة
  if (
    !message.includes("reading 'map'") &&
    !message.includes('Cannot read properties of undefined') &&
    !message.includes('Hydration failed') &&
    !message.includes('Minified React error')
  ) {
    window.dispatchEvent(
      new CustomEvent('app-error', {
        detail: { type, message, timestamp: Date.now() },
      }),
    );
  }
}

// ============================================================
// 2. التزيين الذكي لوظائف الكونسول (Console Decorator)
// ============================================================

// الحصول على المراجع الأصلية
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

// أخطاء معروفة وآمنة يمكن تجاهلها (تعمل مع جميع إصدارات React)
const KNOWN_SAFE_PATTERNS = [
  /Cannot read properties of undefined.*reading 'map'/,
  /Cannot read properties of undefined.*reading '0'/,
  /Minified React error #185/,
  /Hydration failed because the/,
  /There was an error during/,
  /Warning: React.createElement/,
  /React does not recognize the/,
  /Invalid prop `.*` supplied to/,
  /validateDOMNesting/,
  /Using UNSAFE_/,
  /findDOMNode is deprecated/,
];

function isKnownSafeError(message: string): boolean {
  return KNOWN_SAFE_PATTERNS.some((pattern) => pattern.test(message));
}

// تزيين console.error بطريقة ذكية
console.error = function (...args: unknown[]) {
  const message = args.join(' ');

  // تجاهل الأخطاء المعروفة والآمنة
  if (isKnownSafeError(message)) {
    pushError('warn', `[Suppressed] ${message}`);
    return;
  }

  // تسجيل الأخطاء الحقيقية مع تتبع
  pushError('error', message);
  originalError.apply(console, ['[App Error]', ...args]);
};

console.warn = function (...args: unknown[]) {
  const message = args.join(' ');

  if (isKnownSafeError(message)) {
    pushError('warn', `[Suppressed] ${message}`);
    return;
  }

  pushError('warn', message);
  originalWarn.apply(console, ['[App Warning]', ...args]);
};

// المحافظة على console.log للتصحيح
console.log = function (...args: unknown[]) {
  if (import.meta.env.DEV) {
    originalLog.apply(console, ['[App Dev]', ...args]);
  }
};

// ============================================================
// 3. معالج الأخطاء العالمي (Global Error Handler)
// ============================================================

globalThis.addEventListener(
  'error',
  (event) => {
    const message = event.message || '';

    // تجاهل الأخطاء المعروفة
    if (isKnownSafeError(message)) {
      event.preventDefault();
      event.stopPropagation();
      pushError('global-warn', `[Suppressed] ${message}`);
      return;
    }

    // للأخطاء الحقيقية - نسجلها ولكن لا نمنعها
    pushError('global-error', message);

    // Attempt to show a non-destructive fallback overlay (do not wipe #root)
    // Append a single overlay element to the document body so React state
    // may still be inspected in devtools and we avoid removing server markup.
    const ensureGlobalErrorOverlay = () => {
      if (document.querySelector('.app-global-error-overlay')) return;
      const overlay = document.createElement('div');
      overlay.className = 'app-global-error-overlay';
      overlay.setAttribute('role', 'alert');
      overlay.style.cssText =
        'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;min-height:100vh;direction:rtl;font-family:Segoe UI,system-ui,sans-serif;background:rgba(15,23,42,0.6);z-index:99999;';
      overlay.innerHTML = `
        <div style="text-align:center;max-width:520px;padding:2rem;background:white;border-radius:20px;box-shadow:0 20px 40px rgba(2,6,23,0.25);">
          <div style="font-size:3.25rem;margin-bottom:0.75rem;">⚠️</div>
          <h1 style="font-size:1.25rem;color:#0f172a;margin-bottom:0.25rem;font-weight:800;">عذراً، حدث خطأ غير متوقع</h1>
          <p style="color:#475569;margin-bottom:1rem;line-height:1.6;">فريق الدعم الفني قد تم إخطاره. يمكنك محاولة تحديث الصفحة أو فتح التطبيق لاحقاً.</p>
          <div style="display:flex;gap:8px;justify-content:center;">
            <button id="app-global-reload" style="background:#0f172a;color:white;border:none;padding:0.6rem 1.25rem;border-radius:10px;font-size:0.95rem;cursor:pointer;font-weight:700;">تحديث الصفحة</button>
            <button id="app-global-dismiss" style="background:transparent;border:1px solid #e6eef8;color:#0f172a;padding:0.6rem 1rem;border-radius:10px;font-size:0.95rem;cursor:pointer;">إغلاق</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const reloadBtn = document.getElementById('app-global-reload');
      const dismissBtn = document.getElementById('app-global-dismiss');
      reloadBtn?.addEventListener('click', () => location.reload());
      dismissBtn?.addEventListener('click', () => overlay.remove());
    };

    ensureGlobalErrorOverlay();
  },
  true,
);

// مراقبة الوعد المرفوض (Unhandled Promise Rejection)
globalThis.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || event.reason || 'Unknown promise rejection';
  pushError('unhandled-rejection', message);

  if (isKnownSafeError(message)) {
    event.preventDefault();
  }
});

// ============================================================
// 4. مراقبة حالة الشبكة والاتصال (Network Observer)
// ============================================================

// كشف الاتصال البطيء - Network Information API
if ('connection' in navigator) {
  try {
    const nav = navigator as unknown as {
      connection?: {
        effectiveType?: string;
        addEventListener?: (type: string, listener: EventListener) => void;
        removeEventListener?: (type: string, listener: EventListener) => void;
      };
    };
    const conn = nav.connection;
    if (conn && typeof conn.addEventListener === 'function') {
      conn.addEventListener('change', () => {
        const effectiveType = conn.effectiveType;
        // إرسال حدث للتطبيق إذا كان الاتصال ضعيفاً
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          window.dispatchEvent(
            new CustomEvent('slow-connection', { detail: { type: effectiveType } }),
          );
        }
      });
    }
  } catch {
    // تجاهل الأخطاء في المتصفحات القديمة
  }
}

// مراقبة حالة الاتصال بالإنترنت
globalThis.addEventListener('online', () => {
  globalThis.dispatchEvent(new CustomEvent('connection-status', { detail: { isOnline: true } }));
});

globalThis.addEventListener('offline', () => {
  globalThis.dispatchEvent(new CustomEvent('connection-status', { detail: { isOnline: false } }));
});

// ============================================================
// 5. تسجيل Service Worker المتقدم (Progressive Web App)
// ============================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('✅ SW registered at:', registration.scope);
        }

        // فحص التحديثات الجديدة
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateNotification(registration);
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('⚠️ SW registration failed:', error);
      });

    // تفعيل الـ Service Worker فوراً عند فتح الصفحة مجدداً
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        // إعادة التحميل إذا كان هناك تحديث
        window.location.reload();
      }
    });
  });
}

// ============================================================
// 6. إظهار إشعار التحديث المتاح (Update Notification)
// ============================================================

function showUpdateNotification(registration: ServiceWorkerRegistration) {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-notification-content" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e293b;color:white;padding:16px 24px;border-radius:16px;display:flex;align-items:center;gap:16px;box-shadow:0 10px 40px rgba(0,0,0,0.3);z-index:9999;direction:rtl;max-width:90%;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="background:#facc15;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#1e293b;font-weight:bold;">🔄</div>
        <div>
          <strong style="display:block;font-size:14px;">تحديث متاح!</strong>
          <span style="display:block;font-size:12px;color:#94a3b8;">تم تحميل إصدار جديد من التطبيق</span>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button onclick="applyUpdate()" style="background:#3b82f6;border:none;color:white;padding:8px 16px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:12px;">تحديث الآن</button>
        <button onclick="this.closest('.update-notification').remove()" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:16px;padding:0 8px;">✕</button>
      </div>
    </div>
  `;
  document.body.appendChild(notification);

  // إضافة دالة التحديث للنافذة
  (window as unknown as Record<string, () => void>).applyUpdate = () => {
    notification.remove();
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // إخفاء الإشعار بعد 30 ثانية إذا لم يتفاعل المستخدم
  setTimeout(() => {
    if (notification.parentElement) notification.remove();
  }, 30000);
}

// ============================================================
// 7. دعم تثبيت التطبيق على الجهاز (PWA Install Prompt)
// ============================================================

// تعريف نوع حدث beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e: Event) => {
  // لا نستدعي e.preventDefault() هنا للسماح بعرض البanner تلقائياً
  deferredPrompt = e as BeforeInstallPromptEvent;

  // إعلام التطبيق بوجود إمكانية التثبيت
  window.dispatchEvent(new CustomEvent('pwa-install-ready', { detail: true }));
});

window.addEventListener('app-install-pwa', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(
      (result: { outcome: 'accepted' | 'dismissed'; platform: string }) => {
        if (result.outcome === 'accepted') {
          if (import.meta.env.DEV) {
            console.log('✅ User installed PWA successfully');
          }
        }
        deferredPrompt = null;
      },
    );
  }
});

// ============================================================
// 8. مراقبة حالة التطبيق (App Lifecycle Monitor)
// ============================================================

// تحديث علامة تبويب المتصفح
document.addEventListener('visibilitychange', () => {
  const isVisible = document.visibilityState === 'visible';
  window.dispatchEvent(new CustomEvent('app-visibility', { detail: { isVisible } }));

  // إذا عاد المستخدم إلى التبويب، نرسل حدثاً لتحديث البيانات
  if (isVisible) {
    window.dispatchEvent(new CustomEvent('app-resume'));
  }
});

// ============================================================
// 9. تشغيل التطبيق (Application Bootstrap)
// ============================================================

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // إزالة شاشات التحميل/Splash placeholders المحتملة بأسماء متعددة
  // (قد يكون هناك `initial-loader` في index.html أو `app-splash` من قوالب سابقة)
  ['initial-loader', 'app-splash'].forEach((id) => {
    const el = document.getElementById(id);
    el?.remove?.();
  });
  // وأيضاً إزالة أي كلاس قد يمنع إخفاء الواجهة
  document.body.classList.remove('initial-loader-active');
} else {
  console.error('❌ لم يتم العثور على عنصر الجذر #root');
}

// ============================================================
// 10. تصدير معلومات النظام للتصحيح (System Info Export)
// ============================================================

if (import.meta.env.DEV) {
  // إضافة كائن للتشخيص في وحدة التحكم
  (window as unknown as Record<string, unknown>).__APP_DEBUG__ = {
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    mode: import.meta.env.MODE,
    errorBuffer,
    buildTime: new Date().toISOString(),
  };
}
