// ============================================================
// useOffline.ts - هوك إدارة الاتصال المتقدم (Enterprise v2.0)
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none';

export interface OfflineStatus {
  /** هل الجهاز متصل بالإنترنت حالياً؟ */
  isOnline: boolean;
  /** هل كان الجهاز غير متصل بالإنترنت سابقاً (للإشعارات) */
  wasOffline: boolean;
  /** نوع الاتصال الحالي (4G, 5G, WiFi, ...) */
  connectionType: ConnectionType;
  /** سرعة الاتصال التقديرية (بالميغابت في الثانية) */
  downlink?: number;
  /** وقت آخر انقطاع للإنترنت */
  lastOfflineAt?: Date;
  /** وقت آخر اتصال بالإنترنت */
  lastOnlineAt?: Date;
  /** إجمالي وقت الانقطاع (بالثواني) */
  totalOfflineTime: number;
  /** وظيفة مساعدة للحصول على وصف نوع الاتصال */
  getConnectionTypeLabel?: (type: ConnectionType) => string;
  /** إعادة محاولة الاتصال */
  retryConnection?: () => void;
}

export interface OfflineOptions {
  /** هل تريد تفعيل الكشف عن نوع الاتصال؟ */
  detectConnectionType?: boolean;
  /** عدد المحاولات لإعادة الاتصال قبل اعتباره غير متصل */
  retryCount?: number;
  /** الفاصل الزمني بين محاولات إعادة الاتصال (بالمللي ثانية) */
  retryInterval?: number;
}

// ============================================================
// 2. مزود الحالة (OfflineProvider)
// ============================================================

import { createContext, useContext, ReactNode } from 'react';

interface OfflineContextType {
  status: OfflineStatus;
  setOnline: () => void;
  setOffline: () => void;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<OfflineStatus>(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
    connectionType: 'unknown',
    totalOfflineTime: 0,
  }));

  const setOnline = useCallback(() => {
    setStatus((prev) => ({ ...prev, isOnline: true, wasOffline: prev.wasOffline }));
  }, []);

  const setOffline = useCallback(() => {
    setStatus((prev) => ({ ...prev, isOnline: false, wasOffline: true }));
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnline();
    const handleOffline = () => setOffline();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, setOffline]);

  return (
    <OfflineContext.Provider value={{ status, setOnline, setOffline }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    // Return default values if not in provider
    return {
      status: {
        isOnline: true,
        wasOffline: false,
        connectionType: 'unknown' as ConnectionType,
        totalOfflineTime: 0,
      },
      setOnline: () => {},
      setOffline: () => {},
    };
  }
  return context;
}

// ============================================================
// 3. الهوك الرئيسي (Main Hook - Legacy)
// ============================================================

export function useOfflineStatus(options: OfflineOptions = {}): OfflineStatus {
  const { detectConnectionType = true, retryCount = 3, retryInterval = 5000 } = options;

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [wasOffline, setWasOffline] = useState(false);
  const [connectionType, setConnectionType] = useState<ConnectionType>('unknown');
  const [downlink, setDownlink] = useState<number | undefined>(undefined);
  const [lastOfflineAt, setLastOfflineAt] = useState<Date | undefined>(undefined);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | undefined>(undefined);
  const [totalOfflineTime, setTotalOfflineTime] = useState(0);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const offlineStartTimeRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================================
  // 3.1. دالة تحديث حالة الاتصال (Connectivity Update)
  // ============================================================

  const updateConnectivity = useCallback((online: boolean) => {
    setIsOnline(online);
    setWasOffline(!online);

    if (online) {
      setLastOnlineAt(new Date());
      if (offlineStartTimeRef.current) {
        const offlineDuration = (Date.now() - offlineStartTimeRef.current) / 1000;
        setTotalOfflineTime((prev) => prev + offlineDuration);
        offlineStartTimeRef.current = null;
      }
      setRetryAttempt(0);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    } else {
      setLastOfflineAt(new Date());
      if (!offlineStartTimeRef.current) {
        offlineStartTimeRef.current = Date.now();
      }
    }
  }, []);

  // ============================================================
  // 3.2. دالة الكشف عن نوع الاتصال (Connection Type Detection)
  // ============================================================

  const updateConnectionInfo = useCallback(() => {
    if (!detectConnectionType || typeof navigator === 'undefined') return;

    try {
      const nav = navigator as any;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

      if (connection) {
        const effectiveType = connection.effectiveType as ConnectionType;
        if (effectiveType) {
          setConnectionType(effectiveType);
        }

        if (typeof connection.downlink === 'number') {
          setDownlink(connection.downlink);
        }

        const handleChange = () => {
          setConnectionType(connection.effectiveType as ConnectionType);
          setDownlink(connection.downlink);
        };

        connection.addEventListener('change', handleChange);
        return () => {
          connection.removeEventListener('change', handleChange);
        };
      }
    } catch {
      setConnectionType('unknown');
    }
  }, [detectConnectionType]);

  // ============================================================
  // 3.3. إعادة محاولة الاتصال (Retry Logic)
  // ============================================================

  const retryConnection = useCallback(() => {
    if (isOnline) return;

    if (retryAttempt < retryCount) {
      setRetryAttempt((prev) => prev + 1);

      const checkConnectivity = async () => {
        try {
          const response = await fetch('https://www.google.com/generate_204', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
          });
          updateConnectivity(true);
        } catch {
          retryTimeoutRef.current = setTimeout(() => {
            retryConnection();
          }, retryInterval);
        }
      };

      checkConnectivity();
    } else {
      updateConnectivity(false);
    }
  }, [isOnline, retryAttempt, retryCount, retryInterval, updateConnectivity]);

  // ============================================================
  // 3.4. الأحداث العالمية (Global Events)
  // ============================================================

  useEffect(() => {
    const handleOffline = () => {
      updateConnectivity(false);
      if (retryCount > 0) {
        retryTimeoutRef.current = setTimeout(() => {
          retryConnection();
        }, retryInterval);
      }
    };

    const handleOnline = () => {
      updateConnectivity(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const cleanupConnection = updateConnectionInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (typeof cleanupConnection === 'function') {
        cleanupConnection();
      }
    };
  }, [updateConnectivity, updateConnectionInfo, retryConnection, retryCount, retryInterval]);

  // ============================================================
  // 3.5. تحسين الأداء (Performance Optimization)
  // ============================================================

  const getConnectionTypeLabel = useCallback((type: ConnectionType): string => {
    switch (type) {
      case 'slow-2g':
        return 'بطيء جداً (2G)';
      case '2g':
        return 'بطيء (2G)';
      case '3g':
        return 'متوسط (3G)';
      case '4g':
        return 'سريع (4G)';
      case '5g':
        return 'سريع جداً (5G)';
      case 'none':
        return 'لا يوجد اتصال';
      default:
        return 'غير معروف';
    }
  }, []);

  // ============================================================
  // 3.6. واجهة الهوك (Return Value)
  // ============================================================

  return {
    isOnline,
    wasOffline,
    connectionType,
    downlink,
    lastOfflineAt,
    lastOnlineAt,
    totalOfflineTime,
    getConnectionTypeLabel,
    retryConnection,
  };
}

// ============================================================
// 4. دوال مساعدة (Utility Functions)
// ============================================================

export function useOnlineStatus(): boolean {
  const { isOnline } = useOfflineStatus({ detectConnectionType: false, retryCount: 0 });
  return isOnline;
}

export function useConnectivityListener(onOnline?: () => void, onOffline?: () => void): void {
  const { isOnline } = useOfflineStatus();

  useEffect(() => {
    if (isOnline) {
      onOnline?.();
    } else {
      onOffline?.();
    }
  }, [isOnline, onOnline, onOffline]);
}
