// ============================================================
// HomePageLogo.tsx - الشعار الرئيسي للصفحة الرئيسية (Elite Edition v2.0)
// صورة الشارع الرئيسي بتصميم احترافي مبهر
// دعم PWA كامل + تحسينات الأداء + إطار ذهبي مميز
// ============================================================

import { memo, useState } from 'react';

interface HomePageLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  altText?: string;
}

const sizeConfig = {
  'xs': { container: 'w-20 h-20', border: 'border-2' },
  'sm': { container: 'w-28 h-28', border: 'border-3' },
  'md': { container: 'w-36 h-36', border: 'border-4' },
  'lg': { container: 'w-44 h-44', border: 'border-[5px]' },
  'xl': { container: 'w-52 h-52', border: 'border-[6px]' },
  '2xl': { container: 'w-64 h-64', border: 'border-[8px]' },
};

const HomePageLogo = memo(function HomePageLogo({
  size = '2xl',
  className = '',
  altText = 'البوابة الرئيسية لمكتب الأشغال العامة والطرق - محافظة ذمار',
}: HomePageLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const config = sizeConfig[size];

  return (
    <div className={`relative ${config.container} ${className} group`}>
      {/* توهج ذهبي خارجي - محسن للجوال */}
      <div className="absolute inset-[-6px] sm:inset-[-8px] lg:inset-[-10px] bg-gradient-to-br from-gold-400/50 via-gold-500/40 to-gold-400/50 rounded-full blur-xl sm:blur-2xl lg:blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-700 animate-pulse" />

      {/* انعكاس معدني */}
      <div className="absolute inset-[-12px] sm:inset-[-16px] lg:inset-[-20px] rounded-full border-2 border-gold-500/20 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

      {/* الإطار الدائري الرئيسي الذهبي الفاخر */}
      <div
        className={`relative w-full h-full bg-gradient-to-br from-gold-50 via-white to-gold-100 rounded-full ${config.border} border-gold-500 shadow-xl sm:shadow-2xl overflow-hidden`}
      >
        {/* الصورة الاحترافية للشارع الرئيسي */}
        <img
          src="/images/imagemainstreet.png"
          alt={altText}
          width={256}
          height={256}
          loading="eager"
          decoding="async"
          className={`w-full h-full object-cover rounded-full transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          style={{ filter: 'contrast(1.1) saturate(1.2) brightness(1.05)' }}
        />

        {/* إطار داخلي ذهبي متوهج */}
        <div className="absolute inset-2 sm:inset-3 rounded-full border border-gold-400/50 pointer-events-none group-hover:border-gold-500 transition-all duration-500" />

        {/* توهج داخلي */}
        <div className="absolute inset-4 sm:inset-6 rounded-full bg-gradient-to-br from-gold-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* شارة التحقق الذهبية */}
      <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full p-2 sm:p-3 shadow-lg border-2 border-white">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-white sm:w-5 sm:h-5"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      {/* شارة الخبرة المميزة */}
      <div className="absolute -top-3 -left-3 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-lg border-2 border-gold-300">
        <div className="text-gov-900 font-black text-[10px] sm:text-xs">1979</div>
        <div className="text-gold-600 text-[8px] sm:text-[10px] font-bold">خبرة</div>
      </div>

      {/* نجوم حول الشعار */}
      <div className="absolute -top-1 -right-4 w-2 h-2 bg-gold-400 rounded-full animate-ping" />
      <div
        className="absolute -bottom-4 -left-1 w-1.5 h-1.5 bg-gold-300 rounded-full animate-ping"
        style={{ animationDelay: '0.5s' }}
      />
    </div>
  );
});

HomePageLogo.displayName = 'HomePageLogo';
export default HomePageLogo;
