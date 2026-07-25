// ============================================================
// GovernmentLogo - مكون الشعار الحكومي الموحد
// يستخدم الآن logo-dhamar.png بدلاً من الـ SVG
// دعم كامل للوضعين الفاتح والداكن مع تأثيرات انتقالية
// محسّن للجوال والتابلت والكمبيوتر باستخدام lazy loading
// ============================================================

import { memo, useState } from 'react';

interface GovernmentLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animated?: boolean;
  variant?: 'default' | 'navbar' | 'footer' | 'splash';
}

const sizeConfig = {
  'xs': { container: 'w-10 h-10', icon: 'w-6 h-6' },
  'sm': { container: 'w-12 h-12', icon: 'w-7 h-7' },
  'md': { container: 'w-14 h-14', icon: 'w-8 h-8' },
  'lg': { container: 'w-16 h-16', icon: 'w-10 h-10' },
  'xl': { container: 'w-20 h-20', icon: 'w-12 h-12' },
  '2xl': { container: 'w-24 h-24', icon: 'w-14 h-14' },
};

const GovernmentLogo = memo(function GovernmentLogo({
  size = 'md',
  className = '',
  animated = true,
  variant = 'default',
}: GovernmentLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const config = sizeConfig[size];

  // إعداد الأنماط حسب النسخة - محسّنة للجوال
  const getContainerClasses = () => {
    const base =
      'rounded-xl sm:rounded-2xl flex items-center justify-center relative overflow-hidden';

    if (variant === 'navbar') {
      return `${base} ${config.container} bg-gradient-to-br from-gov-700 to-gov-900 shadow-md sm:shadow-xl ring-1 sm:ring-2 ring-gold-400/40 group-hover:ring-gold-400/80 transition-all duration-300`;
    }

    if (variant === 'footer') {
      return `${base} ${config.container} bg-gradient-to-br from-gold-500 to-gold-700 shadow-md sm:shadow-lg shadow-gold-500/30`;
    }

    if (variant === 'splash') {
      return `${base} w-28 h-28 sm:w-32 sm:h-32 z-50 bg-gradient-to-br from-white/10 to-white/5 border border-white/30 shadow-xl sm:shadow-2xl backdrop-blur-sm`;
    }

    return `${base} ${config.container} bg-gradient-to-br from-gov-700 to-gov-900 shadow-md sm:shadow-xl ring-1 sm:ring-2 ring-gold-400/40 group-hover:ring-gold-400/80 transition-all duration-300`;
  };

  // تعيين أبعاد الصورة حسب الحجم
  const getImageDimensions = () => {
    if (variant === 'splash') return 'w-14 h-14 sm:w-16 sm:h-16';
    return `${config.icon} relative z-10`;
  };

  return (
    <>
      {/* تأثيرات الدوام والتوهج حول الشعار - فقط للـ splash وعند التوفر */}
      {variant === 'splash' && animated && typeof globalThis.window !== 'undefined' && (
        <>
          <div className="absolute -inset-6 sm:-inset-8 rounded-full border-2 border-gold-500/20 animate-spin-slow" />
          <div className="absolute -inset-8 sm:-inset-12 rounded-full border border-gold-500/10 animate-spin-slower" />
          <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-gold-500/20 to-transparent rounded-full blur-xl sm:blur-2xl animate-pulse" />
        </>
      )}

      <div className={`${getContainerClasses()} ${className}`}>
        {/* خلفية هندسية - تمثيل للبنية التحتية (مبسطة للجوال) */}
        {variant !== 'splash' && (
          <>
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gov-600/50 via-gov-700/30 to-gov-800/50 rounded-xl sm:rounded-2xl" />
            {/* توهج ذهبي عند التمرير - مبسط للأجهزة المحمولة */}
            {animated && (
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-400/30 via-gold-500/20 to-gold-400/30 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 blur-md sm:blur-xl transition-opacity duration-500" />
            )}
          </>
        )}

        {/* لمعان علوي (مبسط للجوال) */}
        {variant !== 'splash' && (
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-xl sm:rounded-2xl" />
        )}

        {/* الشعار - استخدام logo-dhamar.png مع تحسينات الأداء */}
        <img
          src="/icons/logo-dhamar.png"
          alt="شعار مكتب الأشغال العامة والطرق - ذمار"
          width={64}
          height={64}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className={`${getImageDimensions()} object-contain drop-shadow-lg sm:drop-shadow-2xl transition-transform duration-500 group-hover:scale-105`}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0.8 }}
        />
      </div>
    </>
  );
});

GovernmentLogo.displayName = 'GovernmentLogo';
export default GovernmentLogo;
