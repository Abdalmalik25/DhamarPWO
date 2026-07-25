// ============================================================
// Sanity Enterprise Hooks - Hooks ذكية لقراءة المحتوى من Sanity
// الإصدار 5.0.0 - مع تخزين مؤقت، إعادة محاولة، ومراقبة أداء
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWithRetry, clientStats } from './client';
import { getQuery } from './queries';
import { FALLBACK_SERVICES, FALLBACK_ANNOUNCEMENTS, FALLBACK_FAQS, FALLBACK_AWARENESS, FALLBACK_STATS, FALLBACK_QUICK_LINKS } from '../../pages/home/homeData';
import type { LoadingState, FetchOptions, PerformanceMetrics } from './types';

// ============================================================
// 🧠 نظام التخزين المؤقت الذكي (In-Memory Cache)
// ============================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version?: string;
}

class SmartCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxEntries = 50;
  private defaultTTL = 5 * 60 * 1000; // 5 دقائق

  /** الحصول على عنصر من التخزين المؤقت */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // التحقق من الصلاحية
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /** تخزين عنصر */
  set<T>(key: string, data: T, ttl = this.defaultTTL): void {
    // تنظيف عند الوصول للحد الأقصى
    if (this.cache.size >= this.maxEntries) {
      const oldest = this.cache.entries().next().value;
      if (oldest) this.cache.delete(oldest[0]);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /** إبطال التخزين المؤقت لنمط معين */
  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /** الحصول على حجم التخزين */
  get size(): number {
    return this.cache.size;
  }

  /** الحصول على تقرير التخزين */
  getReport() {
    return {
      totalEntries: this.cache.size,
      maxEntries: this.maxEntries,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/** مثيل التخزين المؤقت العام */
const contentCache = new SmartCache();

// ============================================================
// ⚙️ Hook أساسي لجلب البيانات مع SWR (Stale-While-Revalidate)
// ============================================================

/** حالة التحميل الأساسية */
function createInitialLoadingState<T>(): LoadingState<T> {
  return {
    data: null,
    isLoading: true,
    isError: false,
    error: null,
    lastSyncedAt: null,
    source: 'fallback',
    responseTimeMs: 0,
    retryCount: 0,
  };
}

/**
 * Hook ذكي لجلب البيانات مع تخزين مؤقت وإعادة محاولة
 * يدعم: SWR، إبطال التخزين، مراقبة الأداء، مصدر البيانات
 */
function useSanityData<T>(
  queryName: string,
  options?: FetchOptions & {
    /** بيانات احتياطية عند فشل الجلب */
    fallbackData?: T;
    /** إعادة الجلب عند التركيز على التبويب */
    reloadOnFocus?: boolean;
    /** إعادة الجلب عند عودة الاتصال */
    reloadOnReconnect?: boolean;
    /** دورة التحديث التلقائي (مللي ثانية) */
    refreshInterval?: number;
  },
): LoadingState<T> & {
  /** إعادة الجلب يدوياً */
  refetch: () => Promise<void>;
  /** إبطال التخزين المؤقت وإعادة الجلب */
  invalidate: () => Promise<void>;
  /** مقاييس الأداء */
  metrics: PerformanceMetrics | null;
} {
  const [state, setState] = useState<LoadingState<T>>(createInitialLoadingState);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cacheKey = `${queryName}_${JSON.stringify(options || {})}`;

  const fetchData = useCallback(async () => {
    const startTime = performance.now();
    const queryStartTime = performance.now();

    const {
      retries = 2,
      bypassCache = false,
      cacheTTL = 300,
      preferCached = false,
      fallbackData,
    } = options || {};

    // 1. التحقق من التخزين المؤقت أولاً
    if (!bypassCache) {
      const cached = contentCache.get<T>(cacheKey);
      if (cached) {
        const elapsed = performance.now() - startTime;
        setState({
          data: cached,
          isLoading: false,
          isError: false,
          error: null,
          lastSyncedAt: new Date(),
          source: 'cache',
          responseTimeMs: elapsed,
          retryCount: 0,
        });
        setMetrics({
          totalTimeMs: elapsed,
          queryTimeMs: 0,
          transformTimeMs: 0,
          payloadBytes: 0,
          fromCache: true,
          accessCount: clientStats.totalRequests,
        });
        if (preferCached) return;
      }
    }

    // 2. محاولة الجلب من Sanity
    setState(prev => ({ ...prev, isLoading: true }));
    let retryCount = 0;

    try {
      const query = getQuery(queryName);
      const data = await fetchWithRetry<T>(
        query,
        undefined,
        { maxRetries: retries },
      );

      // 3. حساب وقت التحويل
      const transformStartTime = performance.now();
      const processedData = data;
      const transformTime = performance.now() - transformStartTime;

      // 4. تخزين في الذاكرة المؤقتة
      contentCache.set(cacheKey, processedData, cacheTTL * 1000);

      const totalElapsed = performance.now() - startTime;
      const queryElapsed = performance.now() - queryStartTime;

      setState({
        data: processedData,
        isLoading: false,
        isError: false,
        error: null,
        lastSyncedAt: new Date(),
        source: 'sanity',
        responseTimeMs: totalElapsed,
        retryCount,
      });
      setMetrics({
        totalTimeMs: totalElapsed,
        queryTimeMs: queryElapsed,
        transformTimeMs: transformTime,
        payloadBytes: JSON.stringify(processedData).length,
        fromCache: false,
        accessCount: clientStats.totalRequests,
      });
    } catch (err) {
      retryCount++;
      const error = err instanceof Error ? err : new Error('Failed to fetch data');

      // 5. الرجوع للبيانات الاحتياطية
      setState({
        data: fallbackData ?? null,
        isLoading: false,
        isError: true,
        error,
        lastSyncedAt: null,
        source: 'fallback',
        responseTimeMs: performance.now() - startTime,
        retryCount,
      });
    }
  }, [queryName, cacheKey, options]);

  // التحميل الأولي
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // إعادة التحميل عند التركيز
  useEffect(() => {
    if (!options?.reloadOnFocus) return;
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, options?.reloadOnFocus]);

  // إعادة التحميل عند عودة الاتصال
  useEffect(() => {
    if (!options?.reloadOnReconnect) return;
    const handleOnline = () => {
      contentCache.invalidate();
      fetchData();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetchData, options?.reloadOnReconnect]);

  // التحديث الدوري
  useEffect(() => {
    if (!options?.refreshInterval) return;
    intervalRef.current = setInterval(fetchData, options.refreshInterval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, options?.refreshInterval]);

  return {
    ...state,
    refetch: fetchData,
    invalidate: useCallback(async () => {
      contentCache.invalidate(cacheKey);
      await fetchData();
    }, [cacheKey, fetchData]),
    metrics,
  };
}

// ============================================================
// 📦 Hooks متخصصة لكل نوع محتوى - مع بيانات احتياطية مضمّنة
// ============================================================

/** Hook مخصص لجلب الخدمات */
export function useSanityServices(options?: FetchOptions) {
  return useSanityData('services', {
    fallbackData: FALLBACK_SERVICES as never[],
    ...options,
  });
}

/** Hook مخصص لجلب الإعلانات النشطة */
export function useSanityAnnouncements(options?: FetchOptions) {
  return useSanityData('announcements', {
    fallbackData: FALLBACK_ANNOUNCEMENTS as never[],
    ...options,
  });
}

/** Hook مخصص لجلب الأسئلة الشائعة */
export function useSanityFAQs(options?: FetchOptions) {
  return useSanityData('faqs', {
    fallbackData: FALLBACK_FAQS as never[],
    ...options,
  });
}

/** Hook مخصص لجلب المحتوى التوعوي */
export function useSanityAwareness(options?: FetchOptions) {
  return useSanityData('awareness', {
    fallbackData: FALLBACK_AWARENESS as never[],
    ...options,
  });
}

/** Hook مخصص لجلب الإحصائيات */
export function useSanityStatistics(options?: FetchOptions) {
  return useSanityData('statistics', {
    fallbackData: FALLBACK_STATS as never[],
    ...options,
  });
}

/** Hook مخصص لجلب الروابط السريعة */
export function useSanityQuickLinks(options?: FetchOptions) {
  return useSanityData('quickLinks', {
    fallbackData: FALLBACK_QUICK_LINKS as never[],
    ...options,
  });
}

/** Hook مخصص لجلب المشاريع */
export function useSanityProjects(options?: FetchOptions) {
  return useSanityData('projects', {
    fallbackData: [] as never[],
    ...options,
  });
}

/** Hook مخصص لجلب أعضاء الكادر */
export function useSanityTeamMembers(options?: FetchOptions) {
  return useSanityData('teamMembers', {
    fallbackData: [] as never[],
    ...options,
  });
}

/** Hook مخصص لجلب الوثائق الرسمية */
export function useSanityDocuments(options?: FetchOptions) {
  return useSanityData('officialDocuments', {
    fallbackData: [] as never[],
    ...options,
  });
}

/** Hook مخصص لجلب ألبومات الصور */
export function useSanityGalleries(options?: FetchOptions) {
  return useSanityData('galleries', {
    fallbackData: [] as never[],
    ...options,
  });
}

/** Hook مخصص لجلب إعدادات الموقع */
export function useSanitySiteSettings(options?: FetchOptions) {
  return useSanityData('siteSettings', {
    fallbackData: null,
    ...options,
  });
}

// ============================================================
// 🏠 Hook متكامل للصفحة الرئيسية - استعلام واحد لكل المحتوى
// ============================================================

/** نتيجة الصفحة الرئيسية الموحدة */
export interface HomePageResult {
  services: unknown[];
  announcements: unknown[];
  faqs: unknown[];
  awareness: unknown[];
  stats: unknown[];
  quickLinks: unknown[];
  settings: Record<string, unknown> | null;
}

/**
 * Hook متكامل للصفحة الرئيسية
 * يستخدم استعلام GROQ واحد مجمّع لجلب كل المحتوى دفعة واحدة
 * بدلاً من 6 استعلامات منفصلة
 */
export function useSanityHomePage(options?: FetchOptions) {
  const defaultResult: HomePageResult = {
    services: FALLBACK_SERVICES,
    announcements: FALLBACK_ANNOUNCEMENTS,
    faqs: FALLBACK_FAQS,
    awareness: FALLBACK_AWARENESS,
    stats: FALLBACK_STATS,
    quickLinks: FALLBACK_QUICK_LINKS,
    settings: null,
  };

  return useSanityData<HomePageResult>('homePage', {
    fallbackData: defaultResult,
    reloadOnFocus: true,
    refreshInterval: 5 * 60 * 1000, // كل 5 دقائق
    ...options,
  });
}

// ============================================================
// 📊 Hook إحصائيات المحتوى
// ============================================================

/** إحصائيات المحتوى */
export interface ContentStats {
  totalServices: number;
  totalAnnouncements: number;
  totalFAQs: number;
  totalAwareness: number;
  totalProjects: number;
  totalTeamMembers: number;
  totalDocuments: number;
  totalGalleries: number;
  totalQuickLinks: number;
}

/** Hook لجلب إحصائيات المحتوى */
export function useSanityContentStats(options?: FetchOptions) {
  return useSanityData<ContentStats>('contentStats', {
    fallbackData: {
      totalServices: 12,
      totalAnnouncements: 7,
      totalFAQs: 10,
      totalAwareness: 6,
      totalProjects: 0,
      totalTeamMembers: 0,
      totalDocuments: 0,
      totalGalleries: 0,
      totalQuickLinks: 4,
    },
    ...options,
  });
}

// ============================================================
// 🔍 Hook البحث الشامل
// ============================================================

/** نتيجة البحث */
export interface SearchResult {
  _id: string;
  _type: string;
  title: string;
  description: string;
  url: string;
  _score?: number;
}

/** Hook للبحث الشامل في المحتوى */
export function useSanitySearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (term: string, limit = 20) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!term || term.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { SEARCH_QUERY } = await import('./queries');
        const data = await fetchWithRetry<SearchResult[]>(
          SEARCH_QUERY,
          { searchTerm: `*${term}*`, limit },
        );
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms Debounce
  }, []);

  return { search, results, isSearching };
}

// ============================================================
// 🧹 دوال إدارة التخزين المؤقت
// ============================================================

/** إبطال التخزين المؤقت بالكامل */
export function invalidateAllCache(): void {
  contentCache.invalidate();
}

/** إبطال التخزين المؤقت لنوع محتوى معين */
export function invalidateContentCache(contentType: string): void {
  contentCache.invalidate(contentType);
}

/** الحصول على تقرير التخزين المؤقت */
export function getCacheReport() {
  return contentCache.getReport();
}

/** الحصول على تقرير أداء العميل */
export function getClientReport() {
  return clientStats.getReport();
}