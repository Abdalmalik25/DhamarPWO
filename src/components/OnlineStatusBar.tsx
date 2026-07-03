// ============================================================
// OnlineStatusBar - شريط حالة الإنترنت
// ============================================================

import { memo, useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface OnlineStatusBarProps {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType?: string;
}

const OnlineStatusBar = memo(function OnlineStatusBar({
  isOnline,
  wasOffline,
  connectionType,
}: OnlineStatusBarProps) {
  const [visible, setVisible] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      setIsRestored(false);
    } else if (wasOffline && !isRestored) {
      // تمت استعادة الاتصال
      setVisible(true);
      setIsRestored(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOnline, wasOffline, isRestored]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 inset-x-0 z-[70] transition-all duration-500 transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="alert"
      aria-live="polite"
    >
      {!isOnline ? (
        <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg">
          <WifiOff
            size={16}
            className="animate-pulse"
          />
          <span>لا يوجد اتصال بالإنترنت - بعض الخدمات غير متاحة</span>
          <button
            onClick={() => window.location.reload()}
            className="mr-2 p-1 rounded-md bg-red-400 hover:bg-red-300 transition-colors"
            aria-label="إعادة المحاولة"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      ) : isRestored ? (
        <div className="bg-green-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg">
          <Wifi size={16} />
          <span>تمت استعادة الاتصال بالإنترنت ✓</span>
        </div>
      ) : null}
    </div>
  );
});

export default OnlineStatusBar;
