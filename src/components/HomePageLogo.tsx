// ============================================================
// HomePageLogo.tsx - صورة استعراضية للصفحة الرئيسية (بدون نصوص، دائرة محسّنة)
// ============================================================

import { memo } from 'react';

interface HomePageLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  altText?: string;
}

// أحجام أكبر وأكثر تناسباً للاستعراض (زيادة ~30% عن السابق)
const sizeConfig = {
  'xs': { container: 'w-28 h-28' }, // 112px
  'sm': { container: 'w-36 h-36' }, // 144px
  'md': { container: 'w-44 h-44' }, // 176px
  'lg': { container: 'w-56 h-56' }, // 224px
  'xl': { container: 'w-68 h-68' }, // 272px
  '2xl': { container: 'w-80 h-80' }, // 320px
};

const HomePageLogo = memo(function HomePageLogo({
  size = '2xl', // الحجم الافتراضي أصبح أكبر
  className = '',
  altText = 'صورة استعراضية من شوارع مدينة ذمار',
}: HomePageLogoProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={`relative ${config.container} ${className} group`}
      style={{ marginTop: '-10px' }} // رفع الدائرة لأعلى بمقدار 10px
    >
      {/* توهج ذهبي خارجي قوي وممتد */}
      <div className="absolute inset-[-8px] bg-gradient-to-br from-amber-400/40 via-yellow-500/30 to-amber-400/40 rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />

      {/* الإطار الدائري الرئيسي */}
      <div className="relative w-full h-full bg-white rounded-full border-[8px] border-amber-500/80 shadow-[0_20px_50px_rgba(0,0,0,0.4)] shadow-amber-500/20 overflow-hidden">
        {/* خلفية مموهة (اختيارية) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 md:opacity-20 blur-sm scale-110"
          style={{ backgroundImage: 'url(/vite.svg)' }}
          aria-hidden="true"
        />

        {/* طبقة شفافة لتحسين تباين الصورة */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />

        {/* إطار ذهبي داخلي مع تدرج ضوئي */}
        <div className="absolute inset-4 rounded-full border-[3px] border-amber-400/30 shadow-[inset_0_0_30px_rgba(212,175,55,0.15)]" />

        {/* الصورة الأساسية عالية الجودة مع تكبير عند التمرير */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img
            src="/images/imagemainstreet.png"
            alt={altText}
            className="w-full h-full object-cover rounded-full transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-2 shadow-lg"
          />
        </div>
      </div>

      {/* تم إلغاء النص بالكامل بناءً على طلبك */}
    </div>
  );
});

export default HomePageLogo;
