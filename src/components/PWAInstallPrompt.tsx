// ============================================================
// PWAInstallPrompt - تنبيه تثبيت التطبيق الذكي
// مكتب الأشغال العامة والطرق - محافظة ذمار
// يكتشف نوع الجهاز ويظهر المحتوى المناسب
// يدعم اللغة العربية بشكل كامل مع تخطيط RTL احترافي
// ============================================================

import { memo, useState, useEffect, useCallback } from 'react';
import { X, Smartphone, WifiOff, Monitor, Download, RefreshCw, AlertCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

type DeviceType = 'mobile' | 'desktop' | 'tablet';

const PWAInstallPrompt = memo(function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  // كشف نوع الجهاز الذكي
  useEffect(() => {
    const detectDeviceType = (): DeviceType => {
      if (typeof window === 'undefined') return 'desktop';

      const userAgent = navigator.userAgent;
      const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|Mobile|mobile/i.test(userAgent);
      const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent);

      if (isTablet) return 'tablet';
      if (isMobile) return 'mobile';
      return 'desktop';
    };

    setDeviceType(detectDeviceType());

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode =
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone || isInStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // For mobile devices, show prompt automatically
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;

    // For iOS, show instructions without beforeinstallprompt
    if (isIOSDevice) {
      setTimeout(() => setShowPrompt(true), 3000);
    }
  }, []);

  // Handle install click - تثبيت التطبيق
  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      // لا يوجد prompt متاح - لا نفعل شيئًا لأننا بالفعل في النافذة التي تعرض التعليمات
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('PWA install error:', error);
    }

    setDeferredPrompt(null);
  }, [deferredPrompt]);

  // Handle dismiss - إغلاق التنبيه
  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }, []);

  // Listen for beforeinstallprompt event (Android/Chrome)
  useEffect(() => {
    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Handle header button click for install - الاستماع لحدث الزر من الهيدر
  useEffect(() => {
    const handleHeaderInstallClick = () => {
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream;

      // For iOS, show instructions
      if (isIOSDevice) {
        setShowPrompt(true);
        return;
      }

      // For all other devices (Android, desktop, tablet):
      // If we have deferredPrompt, trigger installation directly
      if (deferredPrompt) {
        handleInstallClick();
      } else {
        // Otherwise show the prompt dialog (for desktop or when prompt not yet available)
        setShowPrompt(true);
      }
    };

    window.addEventListener('pwa-install-click', handleHeaderInstallClick);

    return () => {
      window.removeEventListener('pwa-install-click', handleHeaderInstallClick);
    };
  }, [deferredPrompt, handleInstallClick]);

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt) {
    return null;
  }

  // Device-specific content
  const getDeviceContent = () => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;

    if (isIOS) {
      return {
        icon: Smartphone,
        title: 'ثبّت التطبيق على جهازك',
        description: (
          <>
            اضغط على زر المشاركة
            <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 rounded mx-1 text-[10px] font-bold">
              ↗
            </span>
            ثم اختر "إضافة إلى الشاشة الرئيسية"
          </>
        ),
        buttonText: 'فهمت',
        showInstallButton: false,
      };
    }

    if (deviceType === 'mobile') {
      return {
        icon: Smartphone,
        title: 'ثبّت التطبيق على هاتفك',
        description: 'احصل على تجربة مثبتة على هاتفك مع إشعارات فورية ووصول سريع',
        buttonText: 'تثبيت الآن',
        showInstallButton: true,
      };
    }

    // Desktop/Tablet
    return {
      icon: Monitor,
      title: 'ثبّت التطبيق على حاسوبك',
      description: 'استخدم التطبيق كبرنامج مستقل على الحاسوب بدون متصفح، مع جميع الميزات',
      buttonText: 'تثبيت الآن',
      showInstallButton: true,
    };
  };

  const deviceContent = getDeviceContent();

  return (
    <div
      className="fixed bottom-20 inset-x-0 z-40 px-4 animate-fade-in-up"
      dir="rtl"
    >
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Gold accent line */}
        <div className="h-1 bg-gradient-to-l from-amber-500 via-amber-400 to-amber-500" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <deviceContent.icon
                size={24}
                className="text-white"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 mb-1">{deviceContent.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                {deviceContent.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {deviceContent.showInstallButton ? (
                  deferredPrompt ? (
                    <button
                      onClick={handleInstallClick}
                      className="flex-1 px-4 py-2 bg-gradient-to-l from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                      {deviceContent.buttonText}
                    </button>
                  ) : (
                    <button
                      onClick={handleDismiss}
                      className="flex-1 px-4 py-2 bg-gradient-to-l from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                      حسناً
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleDismiss}
                    className="flex-1 px-4 py-2 bg-gradient-to-l from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-95"
                  >
                    {deviceContent.buttonText}
                  </button>
                )}
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                >
                  لاحقاً
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="إغلاق"
            >
              <X
                size={18}
                className="text-gray-400"
              />
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-[10px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <WifiOff
                  size={12}
                  className="text-amber-500"
                />
                <span>يعمل بدون إنترنت</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone
                  size={12}
                  className="text-amber-500"
                />
                <span>تجربة native</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PWAInstallPrompt.displayName = 'PWAInstallPrompt';

export default PWAInstallPrompt;
