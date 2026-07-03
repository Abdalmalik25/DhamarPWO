/**
 * Middleware للأمان والمراقبة
 * مكتب الأشغال العامة والطرق - محافظة ذمار
 */

import { useEffect } from 'react';

export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
};

export const CSP_DIRECTIVES = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
  'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
  'img-src': "'self' data: https:",
  'font-src': "'self' https://fonts.gstatic.com",
  'connect-src': "'self' https://*.supabase.co",
  'frame-ancestors': "'none'",
  'base-uri': "'self'",
  'form-action': "'self'",
  'upgrade-insecure-requests': '',
};

export function buildCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([key, value]) => `${key} ${value}`)
    .join('; ');
}

// كاشف للبيئات الخطأ
export function reportError(error: Error, context?: Record<string, unknown>) {
  const errorReport = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // في الإنتاج، يمكن إرسال التقرير لخدمة مثل Sentry
  if (import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true') {
    console.error('[Error Report]', errorReport);
    // TODO: إرسال لـ Sentry أو خدمة مشابهة
  }
}

// Hook لمراقبة الأخطاء
export function useErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reportError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}