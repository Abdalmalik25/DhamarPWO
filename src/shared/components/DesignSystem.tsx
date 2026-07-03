// ============================================================
// DesignSystem.tsx - نظام التصميم المؤسسي الموحد (Enterprise Design System v1.0)
// مكتب الأشغال العامة والطرق - محافظة ذمار
// ============================================================

import { type ReactNode } from 'react';

// ============================================================
// 1. Typography System - نظامTypography موحد
// ============================================================

export const Typography = {
  // العناوين الرئيسية (مثل HeroSection)
  HeroTitle: ({ children, subtitle }: { children: ReactNode; subtitle?: string }) => (
    <div className="text-center mb-6">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
        {children}
      </h1>
      {subtitle && (
        <p className="text-white/70 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  ),

  // العناوين البيضاء (للاستخدام على الخلفيات الداكنة)
  WhiteSectionTitle: ({ children, subtitle }: { children: ReactNode; subtitle?: string }) => (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
        {children}
      </h2>
      {subtitle && (
        <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  ),

  // العناوين الرمادية (للاستخدام على الخلفيات الفاتحة)
  GraySectionTitle: ({ children, subtitle }: { children: ReactNode; subtitle?: string }) => (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
        {children}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  ),

  // النصوص المتنوعة
  BodyText: ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <p className={`text-gray-600 leading-relaxed ${className}`}>
      {children}
    </p>
  ),
};

// ============================================================
// 2. Card System - نظام البطاقات الموحد
// ============================================================

export const Cards = {
  // بطاقة زجاجية (Glass Card) - للاستخدام على الخلفيات الداكنة
  GlassCard: ({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
    <div
      onClick={onClick}
      className={`
        relative bg-white/10 backdrop-blur-xl 
        border-2 border-white/15 
        rounded-[2rem] 
        p-6 md:p-8 
        shadow-2xl
        hover:bg-white/15
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
    >
      {/* تأثير التوهج الداخلي */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[2rem]" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  ),

  // بطاقة بيضاء (White Card) - للاستخدام على الخلفيات الفاتحة
  WhiteCard: ({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
    <div
      onClick={onClick}
      className={`
        bg-white
        border border-gray-200
        rounded-[2rem]
        p-6 md:p-8
        shadow-lg
        hover:shadow-xl
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  ),

  // بطاقة الإحصائيات (Stats Card)
  StatsCard: ({ icon: Icon, value, label, colorClass }: { 
    icon: React.ElementType; 
    value: string | number; 
    label: string; 
    colorClass: string;
  }) => (
    <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30">
      <div className={`w-10 h-10 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-2xl md:text-3xl font-black text-white mb-1">
        {value}
      </div>
      <div className="text-white/70 text-xs font-semibold">{label}</div>
    </div>
  ),

  // بطاقة الخدمة (Service Card)
  ServiceCard: ({ 
    icon: Icon, 
    title, 
    description, 
    colorClass, 
    onClick 
  }: { 
    icon: React.ElementType; 
    title: string; 
    description: string; 
    colorClass: string;
    onClick?: () => void;
  }) => (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
      <h4 className="font-bold text-gray-800 text-base mb-2 group-hover:text-gov-700 transition-colors">
        {title}
      </h4>
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  ),
};

// ============================================================
// 3. Badge System - نظام الشارات الموحد
// ============================================================

export const Badges = {
  // شارة ذهبية (Gold Badge)
  Gold: ({ children, icon: Icon }: { children: ReactNode; icon?: React.ElementType }) => (
    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/30 text-gold-300 px-4 py-1.5 rounded-full text-xs font-bold">
      {Icon && <Icon size={12} />}
      {children}
    </span>
  ),

  // شارة زرقاء (Blue Badge)
  Blue: ({ children, icon: Icon }: { children: ReactNode; icon?: React.ElementType }) => (
    <span className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold">
      {Icon && <Icon size={12} />}
      {children}
    </span>
  ),

  // شارة خضراء (Green Badge)
  Green: ({ children, icon: Icon }: { children: ReactNode; icon?: React.ElementType }) => (
    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold">
      {Icon && <Icon size={12} />}
      {children}
    </span>
  ),

  // شارة حكومية (Gov Badge)
  Gov: ({ children, icon: Icon }: { children: ReactNode; icon?: React.ElementType }) => (
    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-white/80">
      {Icon && <Icon size={12} className="text-gold-400" />}
      {children}
    </span>
  ),
};

// ============================================================
// 4. Button System - نظام الأزرار الموحد
// ============================================================

export const Buttons = {
  // زر أساسي ذهبي (Primary Gold)
  PrimaryGold: ({ 
    children, 
    onClick, 
    disabled = false
  }: { 
    children: ReactNode; 
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        bg-gradient-to-r from-gold-500 to-gold-600
        hover:from-gold-600 hover:to-gold-700
        text-white
        font-bold
        px-8 py-4
        rounded-2xl
        text-lg
        transition-all
        shadow-xl
        hover:shadow-2xl
        hover:scale-105
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  ),

  // زر ثانوي زجاجي (Secondary Glass)
  SecondaryGlass: ({ 
    children, 
    onClick 
  }: { 
    children: ReactNode; 
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all border-2 border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
    >
      {children}
    </button>
  ),

  // زر أساسي حكومي (Primary Gov)
  PrimaryGov: ({ 
    children, 
    onClick 
  }: { 
    children: ReactNode; 
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gov-600 to-gov-700 hover:from-gov-700 hover:to-gov-800 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
    >
      {children}
    </button>
  ),
};

// ============================================================
// 5. Section System - نظام الأقسام الموحد
// ============================================================

export const Sections = {
  // قسم الهيدر المظلم (Dark Header Section)
  DarkHeader: ({ 
    children, 
    badge,
    BadgeIcon
  }: { 
    children: ReactNode;
    badge?: string;
    BadgeIcon?: React.ElementType;
  }) => (
    <div className="relative bg-gov-800 text-white py-20 overflow-hidden">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/vite.svg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-gov-800/90 via-gov-900/90 to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {badge && BadgeIcon && (
          <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/30 text-gold-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <BadgeIcon size={14} />
            {badge}
          </div>
        )}
        {children}
      </div>
    </div>
  ),

  // قسم المحتوى الرئيسي (Main Content Section)
  Content: ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`max-w-7xl mx-auto px-4 py-12 ${className}`}>
      {children}
    </div>
  ),

  // قسم التذييل الداكن (Dark Footer Section)
  DarkFooter: ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`bg-gradient-to-br from-gov-700 via-gov-800 to-gov-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl ${className}`}>
      {/* خلفية زخرفية */}
      <div className="geo-pattern absolute inset-0 opacity-10 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  ),
};

// ============================================================
// 6. Separator System - نظام الفواصل الموحد
// ============================================================

export const Separators = {
  Gold: () => (
    <div className="h-px bg-gradient-to-l from-transparent via-gold-500/50 to-transparent my-8" />
  ),

  White: () => (
    <div className="h-px bg-gradient-to-l from-transparent via-white/20 to-transparent my-8" />
  ),

  Gray: () => (
    <div className="h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent my-8" />
  ),
};

// ============================================================
// 7. Container System - نظام الحاويات الموحد
// ============================================================

export const Containers = {
  // حاوية المحتوى الرئيسية
  Main: ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  ),

  // حاوية البطاقات
  CardsGrid: ({ 
    children, 
    cols = 'md:grid-cols-3' 
  }: { 
    children: ReactNode; 
    cols?: string;
  }) => (
    <div className={`grid ${cols} gap-6`}>
      {children}
    </div>
  ),
};

export default {
  Typography,
  Cards,
  Badges,
  Buttons,
  Sections,
  Separators,
  Containers,
};