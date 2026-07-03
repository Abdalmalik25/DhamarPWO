// ============================================================
// useOfflineStatus - كشف حالة الاتصال بالإنترنت
// ============================================================

import { useState, useEffect, useCallback } from 'react';

interface OfflineStatus {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnline: Date | null;
  checkConnection: () => boolean;
}

export function useOfflineStatus(): OfflineStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastOnline, setLastOnline] = useState<Date | null>(navigator.onLine ? new Date() : null);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setWasOffline(true);
    setLastOnline(new Date());
    // تشغيل حدث مخصص للمزامنة
    window.dispatchEvent(new CustomEvent('app-online'));
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    window.dispatchEvent(new CustomEvent('app-offline'));
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // فحص دوري للتأكد من حالة الاتصال
    const interval = setInterval(() => {
      const currentOnline = navigator.onLine;
      if (currentOnline !== isOnline) {
        setIsOnline(currentOnline);
        if (currentOnline) {
          setLastOnline(new Date());
          setWasOffline(true);
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [handleOnline, handleOffline, isOnline]);

  const checkConnection = useCallback(() => {
    return navigator.onLine;
  }, []);

  return { isOnline, wasOffline, lastOnline, checkConnection };
}

export default useOfflineStatus;
