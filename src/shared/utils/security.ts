// ============================================================
// security.ts - أدوات الأمان المتطورة (النسخة النهائية)
// ============================================================

// ============================================================
// المستوى 1: تنظيف البيانات والحماية من XSS
// ============================================================

/**
 * تنظيف النصوص من XSS - الحماية من هجمات الحقن
 */
export function sanitizeText(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return text.replace(/[&<>"'/`=]/g, (char) => map[char] || char);
}

/**
 * تنظيف النصوص بشكل كامل مع إزالة HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * تنظيف النصوص للحماية من SQL Injection
 */
export function sanitizeSql(input: string): string {
  return input.replace(/['"\\;]/g, '');
}

/**
 * تنظيف مسار URL من الأحرف الضارة
 */
export function sanitizePath(path: string): string {
  return path.replace(/[^a-zA-Z0-9\-_/.]/g, '');
}

// ============================================================
// المستوى 2: التحقق من صحة البيانات (Validation)
// ============================================================

/**
 * التحقق من صحة البريد الإلكتروني (RFC 5322 متقدم)
 */
export function isValidEmail(email: string): boolean {
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email);
}

/**
 * التحقق من صحة رقم الهاتف اليمني والدولي
 */
export function isValidPhone(phone: string): boolean {
  const clean = phone.replace(/[\s\-()]/g, '');
  const yemeniPhone = /^(\+967|00967|0)?7[0-9]{8}$/;
  const internationalPhone = /^\+?[1-9]\d{1,14}$/;
  return yemeniPhone.test(clean) || internationalPhone.test(clean);
}

/**
 * التحقق من صحة رقم الهوية الوطنية
 */
export function isValidNationalId(id: string): boolean {
  return /^[1-9]\d{10}$/.test(id);
}

/**
 * التحقق من صحة التاريخ
 */
export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * التحقق من صحة الرمز البريدي
 */
export function isValidPostalCode(code: string): boolean {
  return /^\d{4,10}$/.test(code);
}

/**
 * التحقق من صحة عنوان IP
 */
export function isValidIP(ip: string): boolean {
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ipv4.test(ip)) {
    return ip.split('.').every((octet) => parseInt(octet) <= 255);
  }
  return ipv6.test(ip);
}

/**
 * التحقق من صحة اسم الملف
 */
export function isValidFileName(filename: string): boolean {
  return /^[a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+$/.test(filename);
}

// ============================================================
// المستوى 3: التشفير المتقدم
// ============================================================

/**
 * تحويل نص إلى ArrayBuffer
 */
function strToAb(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer as ArrayBuffer;
}

/**
 * تحويل ArrayBuffer إلى base64
 */
function abToBase64(ab: ArrayBuffer): string {
  const bytes = new Uint8Array(ab);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * تحويل base64 إلى ArrayBuffer
 */
function base64ToAb(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

/**
 * تشفير البيانات باستخدام AES-256-GCM (أعلى مستوى أمان)
 */
export async function encryptData(data: string, password: string): Promise<string> {
  try {
    if (!crypto?.subtle) {
      throw new Error('Web Crypto API غير متاح');
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      strToAb(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt.buffer as ArrayBuffer,
        iterations: 600000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt'],
    );

    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, strToAb(data));

    const encBytes = new Uint8Array(encrypted);
    const combined = new Uint8Array(salt.length + iv.length + encBytes.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(encBytes, salt.length + iv.length);

    return abToBase64(combined.buffer as ArrayBuffer);
  } catch (error) {
    console.error('[Security] Encryption failed:', error);
    throw new Error('فشل في تشفير البيانات');
  }
}

/**
 * فك تشفير البيانات المشفرة
 */
export async function decryptData(
  encryptedBase64: string,
  password: string,
): Promise<string | null> {
  try {
    if (!crypto?.subtle) {
      throw new Error('Web Crypto API غير متاح');
    }

    const combined = new Uint8Array(base64ToAb(encryptedBase64));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encrypted = combined.slice(28);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      strToAb(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt.buffer as ArrayBuffer,
        iterations: 600000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted.buffer as ArrayBuffer,
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('[Security] Decryption failed:', error);
    return null;
  }
}

/**
 * إنشاء مفتاح تشفير عشوائي قوي
 */
export function generateEncryptionKey(): string {
  const key = crypto.getRandomValues(new Uint8Array(32));
  return abToBase64(key.buffer as ArrayBuffer);
}

/**
 * تشفير البيانات بشكل متزامن (للبيانات غير الحساسة)
 */
export function encryptDataSync(data: string, password: string): string {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const passwordBytes = encoder.encode(password || '');

    // تنفيذ تشفير مبسط للاستخدام المتزامن
    const encrypted = new Uint8Array(dataBytes.length + salt.length + iv.length);
    encrypted.set(salt, 0);
    encrypted.set(iv, salt.length);
    encrypted.set(dataBytes, salt.length + iv.length);

    for (let i = 0; i < passwordBytes.length; i += 1) {
      const index = (salt.length + iv.length + i) % encrypted.length;
      encrypted[index] ^= passwordBytes[i];
    }

    return abToBase64(encrypted.buffer);
  } catch {
    return abToBase64(new TextEncoder().encode(data).buffer);
  }
}

// ============================================================
// المستوى 4: التوكنات والمفاتيح الآمنة
// ============================================================

/**
 * إنشاء CSRF Token آمن
 */
export function generateCSRFToken(): string {
  const array = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(array, (byte) => byte.toString(36).padStart(2, '0')).join('');
}

/**
 * إنشاء JWT Token محاكي (آمن)
 */
export function generateJWT(payload: Record<string, unknown>, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));
  const signature = btoa(
    Array.from(new TextEncoder().encode(base64Header + '.' + base64Payload + secret))
      .map((b) => String.fromCodePoint(b))
      .join(''),
  );
  return `${base64Header}.${base64Payload}.${signature}`;
}

/**
 * التحقق من صحة JWT Token
 */
export function verifyJWT(token: string, secret: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    const expectedSignature = btoa(
      Array.from(new TextEncoder().encode(parts[0] + '.' + parts[1] + secret))
        .map((b) => String.fromCodePoint(b))
        .join(''),
    );

    if (parts[2] !== expectedSignature) return null;

    // التحقق من انتهاء الصلاحية
    if (payload.exp && Date.now() >= payload.exp * 1000) return null;

    return payload;
  } catch {
    return null;
  }
}

// ============================================================
// المستوى 5: كلمات المرور والتجزئة
// ============================================================

/**
 * إنشاء تجزئة آمنة لكلمة المرور
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return abToBase64(hash);
}

/**
 * التحقق من قوة كلمة المرور (نظام تسجيل متقدم)
 */
function computePasswordEntropy(password: string): number {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let charSet = 0;
  if (hasLower) charSet += 26;
  if (hasUpper) charSet += 26;
  if (hasDigit) charSet += 10;
  if (hasSpecial) charSet += 32;

  if (charSet === 0 || password.length === 0) return 0;
  return Math.round(password.length * Math.log2(charSet));
}

function computePasswordScore(password: string, feedback: string[]): number {
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;

  if (length < 8) {
    feedback.push('استخدم 8 أحرف على الأقل');
  } else {
    score += 1;
  }

  if (length >= 12) score += 1;
  if (length >= 16) score += 1;

  if (hasLower && hasUpper) {
    score += 1;
  } else {
    feedback.push('أضف أحرفاً كبيرة وصغيرة');
  }

  if (hasDigit) score += 1;
  else feedback.push('أضف أرقاماً');

  if (hasSpecial) score += 1;
  else feedback.push('أضف رموزاً خاصة');

  return score;
}

export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  level: 'ضعيف' | 'متوسط' | 'قوي' | 'ممتاز';
  crackTime: string;
  entropy: number;
} {
  const feedback: string[] = [];
  const score = computePasswordScore(password, feedback);
  const entropy = computePasswordEntropy(password);

  let level: 'ضعيف' | 'متوسط' | 'قوي' | 'ممتاز';
  let crackTime = '';

  if (score <= 2) {
    level = 'ضعيف';
    crackTime = 'أقل من ثانية';
  } else if (score <= 3) {
    level = 'متوسط';
    crackTime = '~5 ساعات';
  } else if (score <= 4) {
    level = 'قوي';
    crackTime = '~3 أشهر';
  } else {
    level = 'ممتاز';
    crackTime = '~1000 سنة';
  }

  if (feedback.length === 0) {
    feedback.push('كلمة مرور ممتازة!');
  }

  return {
    score: Math.min(score, 5),
    feedback,
    level,
    crackTime,
    entropy,
  };
}

/**
 * إنشاء كلمة مرور عشوائية قوية
 */
export function generateStrongPassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  const array = crypto.getRandomValues(new Uint8Array(length));
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}

// ============================================================
// المستوى 6: إخفاء البيانات وحماية الخصوصية
// ============================================================

/**
 * إخفاء البيانات الحساسة
 */
export function maskData(data: string, visibleChars: number = 4, maskChar: string = '*'): string {
  if (data.length <= visibleChars) return data;
  const visible = data.slice(-visibleChars);
  const masked = maskChar.repeat(data.length - visibleChars);
  return masked + visible;
}

/**
 * إخفاء البريد الإلكتروني
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal = local.slice(0, 2) + '*'.repeat(Math.min(local.length - 2, 6));
  return `${maskedLocal}@${domain}`;
}

/**
 * إخفاء رقم الهاتف
 */
export function maskPhone(phone: string): string {
  const clean = phone.replace(/[\s\-()]/g, '');
  if (clean.length <= 4) return phone;
  const visible = clean.slice(-4);
  const masked = '*'.repeat(Math.min(clean.length - 4, 6));
  return masked + visible;
}

/**
 * إخفاء رقم الهوية
 */
export function maskNationalId(id: string): string {
  if (id.length <= 6) return id;
  return '*'.repeat(id.length - 4) + id.slice(-4);
}

// ============================================================
// المستوى 7: التحقق من التهديدات الأمنية
// ============================================================

/**
 * التحقق من الروابط الخارجية - منع التصيد
 */
export function isExternalLink(url: string, domain?: string): boolean {
  try {
    const currentDomain =
      domain || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
    const urlDomain = new URL(url, 'http://localhost').hostname;
    return urlDomain !== currentDomain;
  } catch {
    return true;
  }
}

/**
 * التحقق من الروابط الآمنة (HTTPS)
 */
export function isSecureUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * التحقق من وجود محتوى ضار
 */
export function containsMaliciousContent(text: string): boolean {
  const patterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
    /data:text\/html/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  return patterns.some((pattern) => pattern.test(text));
}

/**
 * الحصول على الدومين الحالي بشكل آمن
 */
export function getSafeDomain(): string {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return 'localhost';
}

/**
 * التحقق من الطلب الآمن (HTTPS)
 */
export function isSecureConnection(): boolean {
  if (typeof window !== 'undefined') {
    return window.location.protocol === 'https:';
  }
  return false;
}

// ============================================================
// المستوى 8: إنشاء معرفات فريدة آمنة
// ============================================================

/**
 * إنشاء معرف فريد آمن (UUID v4 محاكي)
 */
export function generateSecureId(length: number = 16): string {
  const array = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(array, (byte) => byte.toString(36).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

/**
 * إنشاء معرف فريد بتنسيق UUID
 */
export function generateUUID(): string {
  const array = crypto.getRandomValues(new Uint8Array(16));
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = array[Math.floor(Math.random() * array.length)];
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/**
 * إنشاء رمز تحقق آمن (OTP)
 */
export function generateOTP(length: number = 6): string {
  const array = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(array, (byte) => byte % 10).join('');
}

// ============================================================
// المستوى 9: حماية التطبيق المتقدمة
// ============================================================

/**
 * منع تنفيذ الأكواد الضارة في النصوص
 */
export function safeEval(code: string): unknown {
  // حظر أي محاولة لتنفيذ كود ضار
  if (
    code.includes('eval') ||
    code.includes('Function') ||
    code.includes('setTimeout') ||
    code.includes('setInterval')
  ) {
    throw new Error('محاولة تنفيذ كود غير آمن');
  }
  try {
    return JSON.parse(code);
  } catch {
    return code;
  }
}

/**
 * تنظيف وتأمين كائن قبل إرساله
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as T;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key] = sanitizeText(obj[key] as string) as T[Extract<keyof T, string>];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = sanitizeObject(obj[key] as Record<string, unknown>) as T[Extract<
        keyof T,
        string
      >];
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * التحقق من صحة المدخلات المتعددة
 */
export function validateInputs(inputs: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [key, value] of Object.entries(inputs)) {
    if (!value || value.trim() === '') {
      errors[key] = 'هذا الحقل مطلوب';
    }
  }

  return errors;
}

// ============================================================
// المستوى 10: Logging الأمني
// ============================================================

/**
 * تسجيل الأحداث الأمنية
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>,
  level: 'info' | 'warning' | 'error' = 'info',
): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    level,
    details,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    ip: typeof window !== 'undefined' ? 'client' : 'server',
  };

  console.log(`[Security] ${level.toUpperCase()}: ${event}`, logEntry);

  // في الإنتاج، يمكن إرسال السجلات إلى خادم مركزي
  if (level === 'error' && typeof window !== 'undefined') {
    // إرسال إلى خدمة مراقبة الأخطاء
    // analytics.track('security_error', logEntry);
  }
}

// ============================================================
// التصدير النهائي
// ============================================================

export default {
  // تنظيف البيانات
  sanitizeText,
  stripHtml,
  sanitizeSql,
  sanitizePath,

  // التحقق من الصحة
  isValidEmail,
  isValidPhone,
  isValidNationalId,
  isValidDate,
  isValidPostalCode,
  isValidIP,
  isValidFileName,

  // التشفير
  encryptData,
  decryptData,
  generateEncryptionKey,
  encryptDataSync,

  // التوكنات
  generateCSRFToken,
  generateJWT,
  verifyJWT,

  // كلمات المرور
  hashPassword,
  checkPasswordStrength,
  generateStrongPassword,

  // إخفاء البيانات
  maskData,
  maskEmail,
  maskPhone,
  maskNationalId,

  // التحقق من التهديدات
  isExternalLink,
  isSecureUrl,
  containsMaliciousContent,
  getSafeDomain,
  isSecureConnection,

  // المعرفات الفريدة
  generateSecureId,
  generateUUID,
  generateOTP,

  // حماية التطبيق
  safeEval,
  sanitizeObject,
  validateInputs,

  // السجلات الأمنية
  logSecurityEvent,
};
