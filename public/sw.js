// ============================================================
// PRODUCTION Service Worker مع Cache-First + Network-Fallback
// ============================================================

const CACHE_VERSION = 'pwo-v3';
const OFFLINE_URL = '/offline.html';

// قائمة الملفات الأساسية للتخزين المؤقت
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/vite.svg',
];

// استراتيجيات التخزين حسب نوع الملف
const STRATEGIES = {
  // ملفات static - cache first
  STATIC: /\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?|eot|ttf|otf)$/,
  // HTML - network first
  HTML: /\.(html)$/,
  // صور من CDNs - cache first
  CDN: /https?:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|images\.pexels\.com)/,
};

// تسميات الكاش
const CACHES = {
  PRECACHE: `precache-${CACHE_VERSION}`,
  RUNTIME: `runtime-${CACHE_VERSION}`,
  IMAGES: `images-${CACHE_VERSION}`,
};

// تثبيت التطبيق - تخزين مسبق للملفات الأساسية
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  // نتخطى التخزين المسبق في وضع التطوير (dev)
  // لأن الملفات تُخدم عبر Vite dev server وقد لا تكون متاحة
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    console.log('[SW] Dev mode - skipping precache');
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHES.PRECACHE).then((cache) => {
      console.log('[SW] Precaching app shell');
      return Promise.all(
        PRECACHE_URLS.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn('[SW] Failed to precache:', url, err);
            return Promise.resolve();
          });
        })
      );
    })
  );
  
  self.skipWaiting();
});

// تفعيل - تنظيف الكاش القديمة
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !Object.values(CACHES).includes(key))
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  
  // السيطرة على جميع العملاء فوراً
  self.clients.claim();
});

// معالجة الطلبات - اختيار الاستراتيجية المناسبة
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات غير GET
  if (request.method !== 'GET') return;

  // تجاهل الطلبات الخارجية للـ API
  if (url.origin !== self.location.origin) {
    // معالجة الخطوط فقط من Google Fonts
    if (url.hostname.includes('fonts.googleapis.com') || 
        url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(cacheFirst(request, CACHES.RUNTIME));
      return;
    }
    // تجاهل باقي الطلبات الخارجية
    return;
  }

  // HTML pages - Network First
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, CACHES.RUNTIME, OFFLINE_URL));
    return;
  }

  // Static assets - Cache First
  if (STRATEGIES.STATIC.test(url.pathname)) {
    event.respondWith(cacheFirst(request, CACHES.PRECACHE));
    return;
  }

  // Images - Cache First with fallback
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
    event.respondWith(cacheFirst(request, CACHES.IMAGES));
    return;
  }

  // Default - Network First
  event.respondWith(networkFirst(request, CACHES.RUNTIME));
});

// ============================================================
// استراتيجيات التخزين المؤقت
// ============================================================

// Cache First - يبحث في الكاش أولاً
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First - يبحث في الشبكة أولاً
async function networkFirst(request, cacheName, fallbackUrl) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // إرجاع صفحة Offline للطلبات HTML
    if (request.headers.get('accept')?.includes('text/html') && fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) return fallback;
      return caches.match('/');
    }

    return new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Background Sync - للمزامنة عند عودة الاتصال
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// المزامنة مع السيرفر
async function syncData() {
  try {
    // يمكن إضافة منطق المزامنة هنا
    console.log('[SW] Syncing data...');
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// معالجة الرسائل من التطبيق الرئيسي
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then((keys) => 
          Promise.all(keys.map((key) => caches.delete(key)))
        )
      );
      break;
      
    default:
      break;
  }
});

// تنظيف دوري للصور القديمة
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'clean-images') {
    event.waitUntil(cleanOldImages());
  }
});

async function cleanOldImages() {
  const cache = await caches.open(CACHES.IMAGES);
  const keys = await cache.keys();
  
  // حذف الصور الأقدم من 7 أيام
  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  for (const request of keys) {
    const dateHeader = request.headers.get('date');
    if (dateHeader) {
      const date = new Date(dateHeader).getTime();
      if (date < weekAgo) {
        await cache.delete(request);
      }
    }
  }
}
