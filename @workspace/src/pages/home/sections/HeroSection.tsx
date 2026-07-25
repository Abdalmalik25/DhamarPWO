// ============================================================
// HeroSection.tsx - القسم الرئيسي (نسخة متطورة عالية الأداء)
// مكتب الأشغال العامة والطرق - محافظة ذمار
// ============================================================

import { memo, useCallback, useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  HardHat,
  Building2,
  ShieldCheck,
  Gauge,
  Clock,
  Award,
  MapPin,
  Phone,
  CalendarDays,
  Info,
  ChevronDown,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import type { Page } from '../../../types/page';
import { getSiteSettings } from '../../../lib/sanity';
import { urlFor } from '../../../lib/sanity/client';

// ============================================================
// الأنواع والواجهات
// ============================================================
interface HeroSectionProps {
  onNavigate: (page: Page) => void;
  onQuickAction?: (action: string) => void;
}

interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  trend?: number; // نسبة التغير
  description?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  page: Page;
  color?: string;
}

interface EngineeringTip {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: 'safety' | 'quality' | 'planning' | 'maintenance';
}

// ============================================================
// البيانات الثابتة - المؤسسية والتوعوية
// ============================================================
const OFFICE_DATA = {
  fullName: 'مكتب الأشغال العامة والطرق',
  governorate: 'محافظة ذمار',
  slogan: 'نحو بنية تحتية مستدامة وتنمية عمرانية شاملة',
  phone: '06-521222',
  workingDays: 'السبت - الأربعاء',
  workingHours: '8:00 صباحاً - 2:00 مساءً',
  establishedYear: 1979,
  vision: 'الريادة في تطوير البنية التحتية ورفع جودة الحياة',
};

// الإحصائيات الرئيسية - مع بيانات أكثر تفصيلاً
const MAIN_STATS: StatItem[] = [
  {
    id: 'licenses',
    value: '٢٬٢٧٤',
    label: 'رخصة بناء صادرة',
    icon: <Building2 size={20} />,
    trend: 12,
    description: 'زيادة ١٢٪ عن العام الماضي',
  },
  {
    id: 'roads',
    value: '٢٨٣K م²',
    label: 'طرق مُنظّمة',
    icon: <Gauge size={20} />,
    trend: 8,
    description: 'توسعة الشبكة بنسبة ٨٪',
  },
  {
    id: 'staff',
    value: '٣٢٠',
    label: 'كوادر مؤهلة',
    icon: <ShieldCheck size={20} />,
    trend: 5,
    description: 'زيادة الكفاءات بنسبة ٥٪',
  },
  {
    id: 'projects',
    value: '١٤٧',
    label: 'مشروع منجز',
    icon: <Award size={20} />,
    trend: 15,
    description: 'إنجاز قياسي خلال العام',
  },
];

// الإجراءات السريعة - الخدمات الأكثر طلباً
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'building-permit',
    label: 'طلب رخصة بناء',
    icon: <Building2 size={18} />,
    page: 'services',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'inquiry',
    label: 'استعلام عن معاملة',
    icon: <Info size={18} />,
    page: 'services',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'complaint',
    label: 'بلاغات الطرق',
    icon: <MapPin size={18} />,
    page: 'contact',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'guidelines',
    label: 'دليل الإجراءات',
    icon: <CheckCircle2 size={18} />,
    page: 'about',
    color: 'from-purple-400 to-pink-500',
  },
];

// النصائح التوعوية الهندسية - مصنفة
const ENGINEERING_TIPS: EngineeringTip[] = [
  {
    id: 'concrete',
    text: 'استخدام الخرسانة عالية الجودة يطيل عمر المنشآت ويقلل الصيانة',
    icon: <Zap size={16} />,
    category: 'quality',
  },
  {
    id: 'planning',
    text: 'التخطيط العمراني الجيد يقلل التكاليف المستقبلية بنسبة تصل إلى ٣٠٪',
    icon: <TrendingUp size={16} />,
    category: 'planning',
  },
  {
    id: 'maintenance',
    text: 'الصيانة الدورية للطرق تحافظ على السلامة وتوفر مليارات الريالات',
    icon: <ShieldCheck size={16} />,
    category: 'maintenance',
  },
  {
    id: 'safety',
    text: 'الالتزام بمعايير السلامة يقلل الحوادث الهندسية بنسبة ٤٠٪',
    icon: <HardHat size={16} />,
    category: 'safety',
  },
];

// ============================================================
// المكون الرئيسي
// ============================================================
const HeroSection = memo(function HeroSection({ onNavigate, onQuickAction }: HeroSectionProps) {
  // ============================================================
  // المراجع والحالات
  // ============================================================
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string>('/images/imagemainstreet.png');
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState<string>('/images/GoverThemarMap.jpg');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // ============================================================
  // القيم المحسوبة
  // ============================================================
  const officeYears = useMemo(() => {
    return new Date().getFullYear() - OFFICE_DATA.establishedYear;
  }, []);

  // ============================================================
  // دوال المعالجة
  // ============================================================
  const handleNavigate = useCallback(
    (page: Page) => {
      onNavigate(page);
    },
    [onNavigate],
  );

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      if (onQuickAction) {
        onQuickAction(action.id);
      }
      handleNavigate(action.page);
    },
    [onQuickAction, handleNavigate],
  );

  const scrollToServices = useCallback(() => {
    const target = document.getElementById('services-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  }, []);

  // ============================================================
  // التأثيرات
  // ============================================================
  // ظهور تدريجي
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // جلب إعدادات الموقع
  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        if (!isMounted) return;

        if (settings?.heroImage) {
          const url = urlFor(settings.heroImage);
          if (url) setHeroImageUrl(url);
        }
        if (settings?.heroBackgroundImage) {
          const url = urlFor(settings.heroBackgroundImage);
          if (url) setHeroBackgroundUrl(url);
        } else if (settings?.governorateMap) {
          const url = urlFor(settings.governorateMap);
          if (url) setHeroBackgroundUrl(url);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('HeroSection: Failed to load settings', error);
        }
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // تأثير البارالاكس للخلفية
  useEffect(() => {
    if (!sectionRef.current) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const offset = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
      setParallaxOffset(offset * 20); // إزاحة تصل إلى 20px
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تدوير النصائح التوعوية
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % ENGINEERING_TIPS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // دوال مساعدة للعرض
  // ============================================================
  const renderStat = useCallback(
    (stat: StatItem) => (
      <div
        key={stat.id}
        className="text-center relative group transition-all duration-300 hover:scale-105"
        role="statistic"
        aria-label={`${stat.label}: ${stat.value}`}
      >
        <div className="flex items-center justify-center gap-2 text-2xl lg:text-3xl xl:text-4xl font-black text-gold-400 mb-1">
          <span className="text-gold-500/50 group-hover:text-gold-300 transition-colors duration-300">
            {stat.icon}
          </span>
          <span dir="ltr">{stat.value}</span>
          {stat.trend && (
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full font-bold">
              ↑{stat.trend}%
            </span>
          )}
        </div>
        <div className="text-xs lg:text-sm text-white/70 font-medium tracking-wide">
          {stat.label}
        </div>
        {stat.description && (
          <div className="text-[10px] text-white/40 mt-0.5 hidden sm:block">{stat.description}</div>
        )}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold-400/60 group-hover:w-10 transition-all duration-500 rounded-full" />
      </div>
    ),
    [],
  );

  const renderQuickAction = useCallback(
    (action: QuickAction) => (
      <button
        key={action.id}
        onClick={() => handleQuickAction(action)}
        className={`
          group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
          bg-white/5 backdrop-blur-sm border border-white/10
          hover:border-gold-400/40 hover:bg-white/10
          transition-all duration-300 hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-gold-400/30
          text-white/80 hover:text-white font-medium text-sm
        `}
        aria-label={action.label}
      >
        <span className="text-gold-400/70 group-hover:text-gold-300 transition-colors">
          {action.icon}
        </span>
        <span>{action.label}</span>
        <ExternalLink
          size={14}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </button>
    ),
    [handleQuickAction],
  );

  // ============================================================
  // العرض الرئيسي
  // ============================================================
  return (
    <section
      ref={sectionRef}
      className={`
        relative min-h-[100dvh] flex items-center justify-center overflow-hidden
        transition-opacity duration-1000 ease-out will-change-transform
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      aria-label="القسم الرئيسي - مكتب الأشغال العامة والطرق بمحافظة ذمار"
      dir="rtl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* ============================================================
          طبقات الخلفية المتقدمة
          ============================================================ */}
      <div className="absolute inset-0 z-0">
        {/* صورة الخلفية مع تأثير بارالاكس */}
        <div
          ref={backgroundRef}
          className="absolute inset-0 overflow-hidden will-change-transform"
          style={{
            transform: `translateY(${parallaxOffset}px) scale(${1 + parallaxOffset / 500})`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <img
            src={heroBackgroundUrl}
            alt="خلفية خريطة محافظة ذمار"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setIsBackgroundLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {!isBackgroundLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gov-900">
              <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* تراكبات متدرجة متعددة الطبقات */}
        <div className="absolute inset-0 bg-gradient-to-b from-gov-950/85 via-gov-950/75 to-gov-950/90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-gov-900/60 via-transparent to-gov-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />

        {/* نمط هندسي دقيق جداً للخلفية */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, #d4af37 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, #d4af37 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, #d4af37 0.5px, transparent 0.5px)
            `,
            backgroundSize: '120px 120px, 100px 100px, 80px 80px',
          }}
        />

        {/* تأثيرات ضوئية متحركة */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)',
              animation: 'heroGlow 14s ease-in-out infinite alternate',
            }}
          />
          <div
            className="absolute -bottom-1/3 -left-1/4 w-2/5 h-2/5 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)',
              animation: 'heroGlow 18s ease-in-out 3s infinite alternate',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 60%)',
              animation: 'heroPulse 20s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ============================================================
          تراكب إضافي لتحسين تباين النص
          ============================================================ */}
      <div
        className="absolute inset-0 bg-black/15 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* ============================================================
          المحتوى الرئيسي - تصميم شبكي محسن
          ============================================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* ===================== العمود النصي (7 أعمدة) ===================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* الشارة الرسمية */}
            <ScrollReveal
              delay={60}
              direction="up"
            >
              <div
                className="inline-flex items-center gap-2.5 bg-gold-500/10 backdrop-blur-md border border-gold-400/20 rounded-full px-5 py-2 shadow-lg shadow-gold-500/5"
                role="status"
              >
                <HardHat
                  size={16}
                  className="text-gold-300"
                  aria-hidden="true"
                />
                <span className="text-white/90 text-sm font-bold tracking-wide">
                  البوابة الإلكترونية الرسمية
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400/50 mx-1" />
                <span className="text-gold-300/70 text-xs font-medium">ذمار · اليمن</span>
              </div>
            </ScrollReveal>

            {/* العنوان الرئيسي مع تأثير كتابة محسّن */}
            <ScrollReveal
              delay={120}
              direction="up"
              distance={20}
            >
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.08]">
                  <span
                    className="block bg-gradient-to-l from-gold-100 via-gold-300 to-gold-400 bg-clip-text text-transparent"
                    style={{ backgroundSize: '150% auto' }}
                  >
                    بوابة التنمية الحضرية
                  </span>
                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gold-300/80 mt-1 font-bold">
                    نحو بيئة عمرانية مستدامة
                  </span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-2xl font-medium">
                  المرجعية الرسمية لصناعة التشييد والبنية التحتية؛ نضع المعايير، نُنظم التوسع، ونؤسس
                  لمدينة ذكية وآمنة تليق بتطلعات مجتمعنا.
                </p>
              </div>
            </ScrollReveal>

            {/* الشعار + النصائح التوعوية المتحركة */}
            <ScrollReveal
              delay={180}
              direction="up"
              distance={15}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 lg:p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
                <div className="flex items-center gap-2 shrink-0">
                  <Building2
                    size={20}
                    className="text-gold-400"
                    aria-hidden="true"
                  />
                  <p className="text-gold-300/90 text-sm font-bold italic">{OFFICE_DATA.slogan}</p>
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/10" />
                <div className="flex items-center gap-2 text-xs text-white/70 overflow-hidden flex-1 min-w-0">
                  <Sparkles
                    size={14}
                    className="text-gold-400/60 shrink-0"
                    aria-hidden="true"
                  />
                  <span
                    className="truncate animate-fade-slide"
                    key={activeTipIndex}
                  >
                    {ENGINEERING_TIPS[activeTipIndex]?.icon}
                    <span className="mr-1.5">{ENGINEERING_TIPS[activeTipIndex]?.text}</span>
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* الأزرار الرئيسية والإجراءات السريعة */}
            <ScrollReveal
              delay={240}
              direction="up"
              distance={20}
            >
              <div className="flex flex-col gap-5 mt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={scrollToServices}
                    className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:via-gold-500 hover:to-gold-500 text-gov-950 font-black px-8 lg:px-10 py-4 lg:py-5 rounded-2xl text-base lg:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] shadow-[0_0_40px_-12px_rgba(212,175,55,0.5)] hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.7)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:ring-offset-2 focus:ring-offset-gov-950"
                    aria-label="الانتقال إلى الخدمات الإلكترونية"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <HardHat
                      size={22}
                      className="relative z-10"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">الخدمات الإلكترونية</span>
                    <ArrowLeft
                      size={18}
                      className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    onClick={() => handleNavigate('about')}
                    className="group inline-flex items-center justify-center gap-3 text-white font-bold px-8 lg:px-10 py-4 lg:py-5 rounded-2xl text-base lg:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] bg-white/5 backdrop-blur-sm border border-white/15 hover:bg-white/15 hover:border-white/25 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-gov-950"
                    aria-label="الانتقال إلى دليل الثقافة الهندسية"
                  >
                    <Building2
                      size={22}
                      className="text-gold-400 group-hover:scale-110 transition-transform duration-300"
                      aria-hidden="true"
                    />
                    <span>دليل الثقافة الهندسية</span>
                  </button>
                </div>

                {/* الإجراءات السريعة - شبكة أفقية */}
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((action) => renderQuickAction(action))}
                </div>
              </div>
            </ScrollReveal>

            {/* الإحصائيات الرئيسية - 4 أعمدة */}
            <ScrollReveal
              delay={300}
              direction="up"
              distance={15}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/5">
                {MAIN_STATS.map((stat) => renderStat(stat))}
              </div>
            </ScrollReveal>

            {/* معلومات الاتصال السريعة + بيانات مؤسسية */}
            <ScrollReveal
              delay={340}
              direction="up"
              distance={10}
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-[11px] text-white/40">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40" />
                  {OFFICE_DATA.fullName}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40" />
                  {OFFICE_DATA.governorate}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40" />
                  <CalendarDays
                    size={12}
                    className="text-gold-400/60"
                  />
                  منذ {OFFICE_DATA.establishedYear} ({officeYears}+ عاماً)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40" />
                  <Phone
                    size={12}
                    className="text-gold-400/60"
                  />
                  {OFFICE_DATA.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40" />
                  {OFFICE_DATA.workingDays} · {OFFICE_DATA.workingHours}
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* ===================== العمود البصري (5 أعمدة) ===================== */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <ScrollReveal
              delay={150}
              direction="left"
              distance={30}
            >
              <div className="relative w-full max-w-sm md:max-w-md">
                {/* الإطار الدائري الرئيسي - محسّن مع تأثيرات تحميل */}
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto">
                  {/* هالات خارجية */}
                  <div
                    className="absolute -inset-6 rounded-full bg-gradient-to-br from-emerald-500/20 via-green-400/10 to-teal-600/20 blur-3xl animate-pulse-slow"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -inset-3 rounded-full border border-gold-400/10 animate-spin-slow"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -inset-8 rounded-full bg-gold-400/5 blur-2xl"
                    aria-hidden="true"
                  />

                  {/* الإطار الدائري الرئيسي */}
                  <div className="relative w-full h-full rounded-full border-2 border-gold-400/30 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-gold-500/10 transition-all duration-500 hover:shadow-gold-500/20 hover:border-gold-400/50">
                    {/* مؤشر تحميل الصورة */}
                    {!isImageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gov-800/70 z-10">
                        <div className="w-10 h-10 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
                      </div>
                    )}

                    {/* الصورة مع تحسينات التحميل */}
                    <div className="relative w-full h-full">
                      <img
                        src={heroImageUrl}
                        alt="الشارع النموذجي - مكتب الأشغال العامة والطرق بمحافظة ذمار"
                        className={`
                          w-full h-full object-cover rounded-full p-1.5
                          transition-all duration-700 ease-out
                          ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                        `}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        onLoad={() => setIsImageLoaded(true)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/imagemainstreet.png';
                          setIsImageLoaded(true);
                        }}
                        style={{
                          filter: 'contrast(1.05) saturate(1.1) brightness(1.02)',
                        }}
                      />
                      {/* تراكب خفيف لتحسين التباين */}
                      <div
                        className="absolute inset-0 rounded-full bg-gradient-to-t from-gov-900/30 via-transparent to-transparent pointer-events-none"
                        aria-hidden="true"
                      />
                      {/* إطار داخلي ذهبي رفيع */}
                      <div
                        className="absolute inset-3 rounded-full border border-gold-400/10 pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* شارة الخبرة - محسّنة */}
                  <div className="absolute -top-3 -left-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-xl border border-gold-200/50 hover:shadow-gold-200/30 transition-all duration-300 hover:scale-105">
                    <div className="text-gov-900 font-black text-xs leading-tight">منذ ١٩٧٩</div>
                    <div className="text-gold-600 text-[10px] font-bold tracking-wide">
                      {officeYears}+ عاماً من التميز
                    </div>
                  </div>

                  {/* شارة الجودة المعتمدة */}
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-gold-500 to-amber-700 rounded-full p-3.5 shadow-xl border-2 border-white/20 hover:scale-110 transition-transform duration-300 cursor-default">
                    <Award
                      size={22}
                      className="text-white"
                      aria-hidden="true"
                    />
                  </div>

                  {/* شارة إضافية - الإنجازات */}
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-gov-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gold-400/20 hidden md:flex items-center gap-1.5">
                    <Sparkles
                      size={12}
                      className="text-gold-400"
                    />
                    <span className="text-[10px] text-gold-300 font-bold">١٤٧ مشروعاً</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* ============================================================
          زر التمرير للأسفل - محسّن
          ============================================================ */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 group focus:outline-none focus:ring-2 focus:ring-gold-400/40 rounded-full p-1"
        aria-label="التمرير للأسفل لاستكشاف الخدمات"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] sm:text-xs text-white/40 group-hover:text-gold-400 transition-colors duration-300 tracking-wider font-medium">
            استكشف خدماتنا
          </span>
          <div className="relative w-7 h-11 rounded-full border-2 border-white/15 group-hover:border-gold-400/40 transition-all duration-300 flex items-center justify-center">
            <div className="w-1 h-3 bg-white/40 group-hover:bg-gold-400 rounded-full animate-scroll-bounce" />
            <ChevronDown
              size={14}
              className="absolute text-white/20 group-hover:text-gold-400/40 transition-all duration-300 opacity-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </button>

      {/* ============================================================
          تدرج انتقالي للأسفل - محسّن
          ============================================================ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white/95 via-white/60 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* ============================================================
          أنماط CSS المدمجة للرسوم المتحركة
          ============================================================ */}
      <style>{`
        @keyframes heroGlow {
          0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          100% { transform: translate(30px, -30px) scale(1.3); opacity: 1; }
        }
        @keyframes heroPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-scroll-bounce {
          animation: scrollBounce 1.8s ease-in-out infinite;
        }
        .animate-fade-slide {
          animation: fadeSlide 0.6s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        /* تحسينات إضافية لـ RTL */
        .rtl {
          direction: rtl;
        }
      `}</style>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
