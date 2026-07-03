// ============================================================
// HeroSection.tsx - القسم الرئيسي المؤسسي الرسمي
// مكتب الأشغال العامة والطرق - محافظة ذمار
// ============================================================

import { memo, useCallback, useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  HardHat,
  Building2,
  Sparkles,
  Shield,
  ChevronDown,
  MapPin,
  Clock,
  Award,
  Users,
  FileCheck,
  Route,
  Zap,
  Phone,
  Mail,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Construction,
  Target,
  Flag,
  Monitor,
  Database,
  Search,
  Scale,
  Heart,
  Lightbulb,
  GitBranch,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import type { Page } from '../../../types/page';

interface HeroSectionProps {
  onNavigate: (page: Page) => void;
}

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
  colorClass: string;
}

interface CoreValue {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface QuickService {
  icon: React.ReactNode;
  title: string;
  description: string;
  page: Page;
  badge?: string;
  badgeStyle?: string;
}

interface Achievement {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
}

const OFFICE_DATA = {
  fullName: 'مكتب الأشغال العامة والطرق',
  governorate: 'محافظة ذمار',
  authority: 'السلطة المحلية',
  country: 'الجمهورية اليمنية',
  ministry: 'وزارة الأشغال العامة والطرق',
  slogan: 'نحو بنية تحتية مستدامة وتنمية عمرانية شاملة',
  vision: 'الريادة في تنظيم وتطوير قطاع التشييد والبناء وتحقيق تنمية عمرانية مستدامة',
  mission:
    'تقديم خدمات هندسية متميزة وتنظيم قطاع البناء والإشراف على مشاريع البنية التحتية وفق أعلى معايير الجودة',
  phone: '06-521222',
  email: 'dpw.dhamar@yemen.gov.ye',
  workingDays: 'السبت - الأربعاء',
  workingHours: '8:00 صباحاً - 2:00 مساءً',
  location: 'مدينة ذمار - شارع الجامعة',
  staff: '320',
  engineers: '145',
  technicians: '175',
  directoratesCovered: '16',
  directorateBranches: 'جميع المديريات',
  buildingLicenses: '2,274',
  professionLicenses: '4,245',
  buildingViolations: '1,746',
  healthInspections: '764',
  healthCertificates: '911',
  internalAuditReviews: '8,813',
  trainingBeneficiaries: '200',
  communityEvents: '42',
  digitalTransformation: 'المرحلة الأولى مكتملة',
  neighborhoodUnits: '10',
  electronicInventory: '5,600',
  electronicInventoryProgress: '85%',
  roadsMaintained: '283,240',
  roadsUnit: 'متر مربع',
  annualAchievementRate: 'متقدم',
};

const KEY_ACHIEVEMENTS: Achievement[] = [
  {
    icon: <Database size={18} />,
    title: 'التحول الرقمي الشامل',
    description:
      'استكمال البنية التحتية للأتمتة وربط جميع الإدارات بالشبكة الداخلية، وتشغيل النظام الإلكتروني لإصدار التراخيص',
    colorClass: 'from-blue-600 to-indigo-700',
  },
  {
    icon: <Scale size={18} />,
    title: 'الإصلاح المؤسسي والحوكمة',
    description:
      'إعادة تنظيم الإجراءات الإدارية والمالية، وتعزيز الشفافية والنزاهة، وترسيخ مبادئ الحوكمة والانضباط المؤسسي',
    colorClass: 'from-emerald-600 to-green-700',
  },
  {
    icon: <GitBranch size={18} />,
    title: 'تفعيل الفروع في المديريات',
    description:
      'توسيع نطاق الخدمات لتشمل جميع المديريات، مع تفعيل فروع جديدة ورفدها بالكوادر الهندسية والإدارية المؤهلة',
    colorClass: 'from-violet-600 to-purple-700',
  },
  {
    icon: <Search size={18} />,
    title: 'تعزيز الرقابة والمراجعة الداخلية',
    description:
      'مراجعة آلاف المعاملات الهندسية والإدارية، وضبط المخالفات، وتعزيز آليات الرقابة على جودة البناء والخدمات',
    colorClass: 'from-amber-600 to-orange-700',
  },
  {
    icon: <Lightbulb size={18} />,
    title: 'تطوير البنية المؤسسية',
    description:
      'توسعة المباني والمرافق، وتطوير المختبر الهندسي، وإنشاء ورش الصيانة، وتحديث الأصول التشغيلية للمكتب',
    colorClass: 'from-rose-600 to-pink-700',
  },
  {
    icon: <Heart size={18} />,
    title: 'المشاركة المجتمعية الفاعلة',
    description:
      'تنظيم عشرات الفعاليات المجتمعية والثقافية والتدريبية، وتعزيز الشراكة مع المجتمع في مشاريع التنمية المحلية',
    colorClass: 'from-cyan-600 to-teal-700',
  },
];

const STATS: StatItem[] = [
  {
    icon: <FileCheck size={20} />,
    value: OFFICE_DATA.buildingLicenses,
    label: 'رخصة بناء صادرة',
    description: 'خلال العام مع ضبط المخالفات وإزالتها',
    colorClass: 'from-emerald-600 to-green-700',
  },
  {
    icon: <Route size={20} />,
    value: OFFICE_DATA.roadsMaintained,
    label: 'متر مربع طرق مسحّاة',
    description: 'أعمال المسح والتسوية والتهيئة العمرانية',
    colorClass: 'from-blue-600 to-indigo-700',
  },
  {
    icon: <Monitor size={20} />,
    value: OFFICE_DATA.electronicInventory,
    label: 'مكلّف بالحصر الإلكتروني',
    description: `بنسبة إنجاز ${OFFICE_DATA.electronicInventoryProgress}`,
    colorClass: 'from-violet-600 to-purple-700',
  },
  {
    icon: <Users size={20} />,
    value: OFFICE_DATA.staff,
    label: 'موظف ومهندس وفني',
    description: 'كوادر وطنية مؤهلة في المركز والفروع',
    colorClass: 'from-amber-600 to-orange-700',
  },
  {
    icon: <ClipboardCheck size={20} />,
    value: OFFICE_DATA.internalAuditReviews,
    label: 'معاملة مراجعة',
    description: 'مراجعة داخلية للرخص والمعاملات المتنوعة',
    colorClass: 'from-rose-600 to-pink-700',
  },
];

const CORE_VALUES: CoreValue[] = [
  {
    icon: <Shield size={18} />,
    title: 'النزاهة والشفافية',
    description:
      'نلتزم بأعلى معايير النزاهة في جميع معاملاتنا وإجراءاتنا، مع وضوح الرسوم والإجراءات للمواطنين',
  },
  {
    icon: <Target size={18} />,
    title: 'الجودة والتميز المؤسسي',
    description:
      'نسعى للريادة في تقدير خدمات هندسية متطورة تلبي المعايير الفنية ونتجاوز توقعات المستفيدين',
  },
  {
    icon: <Heart size={18} />,
    title: 'خدمة المجتمع والشراكة',
    description:
      'نضع المواطن في مركز اهتمامنا، ونعزز المشاركة المجتمعية في مشاريع التنمية والتطوير المحلية',
  },
  {
    icon: <Zap size={18} />,
    title: 'الابتكار والتحول الرقمي',
    description:
      'نتبنى أحدث التقنيات والحلول الرقمية لتطوير خدماتنا وتبسيط الإجراءات وتسريع الإنجاز',
  },
];

const QUICK_SERVICES: QuickService[] = [
  {
    icon: <ClipboardCheck size={20} />,
    title: 'إصدار رخص البناء',
    description: 'استخراج وتجديد تراخيص البناء للمباني السكنية والتجارية',
    page: 'services',
    badge: 'الأكثر طلباً',
    badgeStyle: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    icon: <Monitor size={20} />,
    title: 'الخدمات الإلكترونية',
    description: 'منصة الخدمات الرقمية لإصدار التراخيص ومتابعة المعاملات',
    page: 'services',
    badge: 'رقمي',
    badgeStyle: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    icon: <Search size={20} />,
    title: 'الاستعلام عن المعاملات',
    description: 'متابعة حالة المعاملات والرخص الصادرة إلكترونياً',
    page: 'services',
    badge: 'متاح',
    badgeStyle: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    icon: <Construction size={20} />,
    title: 'متابعة المشاريع',
    description: 'الاطلاع على المشاريع القائمة ونسب الإنجاز في الطرق والبنية التحتية',
    page: 'services',
    badge: 'نشط',
    badgeStyle: 'bg-violet-100 text-violet-700 border-violet-200',
  },
];

// ============================================================
// OfficialEmblem - صورة استعراضية مكبرة
// ============================================================
const OfficialEmblem = memo(() => {
  const [logoError, setLogoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="img"
    >
      {/* هالة خارجية مكبرة */}
      <div
        className={`
        absolute -inset-8 rounded-full transition-all duration-1000
        ${
          isHovered
            ? 'bg-gradient-to-br from-gold-500/25 via-gold-400/15 to-gold-600/25 blur-2xl scale-105'
            : 'bg-gradient-to-br from-gold-500/10 via-gold-400/5 to-gold-600/10 blur-3xl scale-100'
        }
      `}
      />

      {/* الدائرة الرئيسية مكبرة */}
      <div
        className={`
        relative w-full h-full bg-white rounded-full 
        border-[3px] border-gold-500/60 
        shadow-2xl overflow-hidden
        transition-all duration-500
        transform
        -translate-y-[10px]
        ${isHovered ? 'shadow-gold-500/40 scale-[1.06] -translate-y-[12px]' : 'shadow-gold-500/20 scale-105'}
      `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
        <div className="absolute inset-2 rounded-full border-2 border-gold-400/30" />
        <div className="absolute inset-4 rounded-full border border-gold-400/15" />

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.3"
            strokeDasharray="3 6"
            opacity="0.3"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-12 lg:p-14 xl:p-16">
          <div
            className={`w-full h-full transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
          >
            {!logoError ? (
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src="/docs/imagemainstreet.png"
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setLogoError(true)}
                  loading="eager"
                  alt="شارع رئيسي في مدينة ذمار"
                  style={{
                    imageRendering: 'auto',
                    filter: 'contrast(1.05) saturate(1.1) brightness(1.05)',
                  }}
                />
                <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-full bg-black/35 border border-white/10 px-4 py-2 text-xs text-white/90 backdrop-blur-sm">
                  شارع رئيسي ومحور عمراني في محافظة ذمار
                </div>
              </div>
            ) : (
              <div className="w-36 h-36 lg:w-40 lg:h-40 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <polygon
                    points="12,2 22,22 2,22"
                    fill="#d4af37"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="3"
                    fill="#0a192f"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5" />

        <div
          className={`
          absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent
          transition-all duration-1000 rounded-full
          ${isHovered ? 'translate-x-full' : '-translate-x-full'}
        `}
        />
      </div>

      <div
        className={`
        absolute -top-4 -right-4 bg-gradient-to-br from-gold-400 to-gold-600 
        rounded-full p-3 lg:p-3.5 shadow-xl transition-all duration-500
        ${isHovered ? 'scale-110' : 'scale-100'}
      `}
      >
        <CheckCircle2
          size={20}
          className="text-white"
        />
      </div>
    </div>
  );
});
OfficialEmblem.displayName = 'OfficialEmblem';

// ============================================================
// StatsBar
// ============================================================
const StatsBar = memo(() => {
  return (
    <div className="absolute bottom-24 lg:bottom-28 left-4 right-4 z-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl lg:rounded-3xl p-5 lg:p-7 shadow-2xl shadow-black/20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-5">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="group relative text-center cursor-default"
              >
                <div
                  className={`
                  w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 rounded-xl flex items-center justify-center
                  bg-gradient-to-br ${stat.colorClass} shadow-lg
                  group-hover:scale-110 transition-all duration-300
                `}
                >
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-xl lg:text-2xl xl:text-3xl font-black text-white mb-0.5 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm font-bold text-white/70 mb-0.5">
                  {stat.label}
                </div>
                <div className="text-[10px] lg:text-xs text-white/40 font-medium">
                  {stat.description}
                </div>
                {index < STATS.length - 1 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 lg:h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
StatsBar.displayName = 'StatsBar';

// ============================================================
// HeroSection الرئيسي
// ============================================================
const HeroSection = memo(function HeroSection({ onNavigate }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const handleNavigate = useCallback(
    (page: Page) => {
      onNavigate(page);
    },
    [onNavigate],
  );

  const scrollDown = useCallback(() => {
    globalThis.scrollTo({ top: globalThis.innerHeight, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Aden',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Aden',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentTime(now.toLocaleTimeString('ar-YE', timeOptions));
      setCurrentDate(now.toLocaleDateString('ar-YE', dateOptions));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        setScrollProgress(progress);
      }
    };
    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      globalThis.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        relative min-h-[100vh] flex items-center overflow-hidden 
        bg-[#747880]
        transition-opacity duration-1000 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      aria-label="القسم الرئيسي - مكتب الأشغال العامة والطرق بمحافظة ذمار"
      dir="rtl"
    >
      {/* الخلفية */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f1f38] to-[#0a1628]" />
        <div className="absolute inset-0 opacity-[0.012]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #d4af37 1px, transparent 1px),
                linear-gradient(to bottom, #d4af37 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(30deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
                linear-gradient(150deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37)
              `,
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 40px 70px',
            }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 30%, transparent 70%)',
              animation: 'breathe 8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute top-1/2 -left-60 w-[700px] h-[700px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 30%, transparent 70%)',
              animation: 'breathe 10s ease-in-out 3s infinite',
            }}
          />
          <div
            className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)',
              animation: 'breathe 12s ease-in-out 6s infinite',
            }}
          />
        </div>
      </div>

      {/* شريط المعلومات العلوي */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="bg-black/45 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 lg:py-2.5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 lg:gap-2">
              <div className="flex items-center gap-3 lg:gap-4 text-white/55 text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock
                    size={12}
                    className="text-gold-400/80 flex-shrink-0"
                  />
                  <span className="font-mono tracking-wider tabular-nums">{currentTime}</span>
                </div>
                <span className="hidden sm:inline text-white/20">|</span>
                <div className="hidden sm:flex items-center gap-1.5">
                  <Calendar
                    size={12}
                    className="text-gold-400/80 flex-shrink-0"
                  />
                  <span className="font-medium">{currentDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 lg:gap-4 text-white/55 text-xs">
                <span className="hidden md:flex items-center gap-1">
                  <Clock
                    size={11}
                    className="text-gold-400/70"
                  />
                  <span>
                    الدوام الرسمي: {OFFICE_DATA.workingDays} | {OFFICE_DATA.workingHours}
                  </span>
                </span>
                <span className="hidden sm:inline text-white/20">|</span>
                <a
                  href={`tel:${OFFICE_DATA.phone}`}
                  className="flex items-center gap-1 hover:text-gold-300 transition-colors duration-300"
                >
                  <Phone
                    size={11}
                    className="text-gold-400/70"
                  />
                  <span className="font-mono tracking-wide">{OFFICE_DATA.phone}</span>
                </a>
                <span className="hidden lg:inline text-white/20">|</span>
                <a
                  href={`mailto:${OFFICE_DATA.email}`}
                  className="hidden lg:flex items-center gap-1 hover:text-gold-300 transition-colors duration-300"
                >
                  <Mail
                    size={11}
                    className="text-gold-400/70"
                  />
                  <span className="text-[11px]">{OFFICE_DATA.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* العمود الأيمن - المحتوى النصي */}
          <div className="space-y-8 lg:space-y-10">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500/15 to-gold-600/10 backdrop-blur-xl border border-gold-400/20 rounded-full px-4 py-2 lg:px-5 lg:py-2.5 shadow-[0_0_25px_rgba(212,175,55,0.08)]">
                <div className="relative flex items-center">
                  <div className="absolute inset-0 bg-gold-400/25 rounded-full blur-sm animate-pulse" />
                  <Sparkles
                    size={14}
                    className="text-gold-400 relative z-10"
                  />
                </div>
                <span className="text-white/85 text-xs lg:text-sm font-bold tracking-wide">
                  البوابة الإلكترونية الرسمية
                </span>
                <div className="flex items-center gap-1">
                  <Shield
                    size={12}
                    className="text-gold-400/60"
                  />
                  <Award
                    size={12}
                    className="text-gold-400/60"
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="space-y-3 lg:space-y-4">
                <p className="text-gold-400/75 text-xs lg:text-sm font-medium tracking-[0.2em] uppercase">
                  مرحباً بكم في البوابة الإلكترونية لـ
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.15]">
                  <span
                    className="block bg-gradient-to-l from-gold-200 via-gold-400 to-gold-300 bg-clip-text text-transparent pb-1"
                    style={{ backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite' }}
                  >
                    مكتب الاشغال العامة والطرق
                  </span>
                  <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl text-gold-300/85 mt-1.5 lg:mt-2 font-bold flex items-center gap-2 lg:gap-3">
                    <MapPin
                      size={20}
                      className="text-gold-400 flex-shrink-0"
                    />
                    محافظة ذمار
                  </span>
                </h1>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <div className="space-y-4 text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed lg:leading-loose">
                <p className="font-light">
                  الجهة الحكومية الرسمية المسؤولة عن تنظيم وتطوير قطاع التشييد والبناء في محافظة
                  ذمار، والتابعة لـ
                  <strong className="text-white/85 font-semibold">
                    {' '}
                    وزارة الأشغال العامة والطرق
                  </strong>{' '}
                  و
                  <strong className="text-white/85 font-semibold"> السلطة المحلية بالمحافظة</strong>
                  . نقود تحولاً مؤسسياً شاملاً يجمع بين
                  <span className="text-gold-300 font-medium"> الإصلاح الإداري</span>،
                  <span className="text-gold-300 font-medium"> التحول الرقمي</span>، و
                  <span className="text-gold-300 font-medium"> الحوكمة المؤسسية</span>.
                </p>
                <p className="font-light">
                  نغطي بخدماتنا
                  <strong className="text-white/80 font-semibold"> جميع مديريات المحافظة</strong>
                  عبر فروع فاعلة، ونعمل على تسهيل إجراءات التراخيص، وضبط المخالفات، وضمان جودة
                  البناء والطرق والمرافق العامة.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex items-center gap-3 p-3 lg:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Flag
                  size={18}
                  className="text-gold-400 flex-shrink-0"
                />
                <p className="text-gold-300/80 text-xs lg:text-sm font-bold italic">
                  {OFFICE_DATA.slogan}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={350}>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <button
                  onClick={() => handleNavigate('services')}
                  className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:via-gold-700 hover:to-gold-800 text-white font-bold px-6 lg:px-8 py-4 lg:py-5 rounded-2xl text-sm lg:text-base transition-all duration-500 hover:scale-[1.02] shadow-[0_8px_30px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.5)] active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                  <HardHat
                    size={20}
                    className="relative z-10"
                  />
                  <span className="relative z-10">استعرض خدماتنا</span>
                  <ArrowLeft
                    size={18}
                    className="relative z-10 group-hover:-translate-x-1.5 transition-transform duration-300"
                  />
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className="group relative inline-flex items-center justify-center gap-2.5 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-xl border-2 border-white/15 hover:border-white/25 text-white font-bold px-6 lg:px-8 py-4 lg:py-5 rounded-2xl text-sm lg:text-base transition-all duration-500 hover:scale-[1.02] shadow-lg hover:shadow-xl active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/8 to-gold-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Building2
                    size={20}
                    className="relative z-10"
                  />
                  <span className="relative z-10">تعرف على المكتب</span>
                  <ArrowUpRight
                    size={18}
                    className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                  />
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={450}>
              <div className="space-y-3">
                <h3 className="text-white/60 text-xs lg:text-sm font-bold tracking-wider uppercase">
                  أبرز ملامح التحول المؤسسي
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                  {KEY_ACHIEVEMENTS.map((achievement, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-2.5 lg:gap-3 p-3 lg:p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-500 cursor-default"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${achievement.colorClass} bg-opacity-15 group-hover:scale-105 transition-all duration-300 shadow-md`}
                      >
                        <div className="text-white">{achievement.icon}</div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-white/80 text-xs lg:text-sm font-bold group-hover:text-white transition-colors duration-300">
                          {achievement.title}
                        </h4>
                        <p className="text-white/40 text-[10px] lg:text-xs mt-0.5 leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {CORE_VALUES.map((value, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-2 lg:gap-2.5 p-2.5 lg:p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] hover:border-white/[0.08] transition-all duration-500 cursor-default"
                  >
                    <div className="flex-shrink-0 w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center group-hover:from-gold-500/30 group-hover:to-gold-600/20 transition-all duration-500">
                      <div className="text-gold-400 group-hover:text-gold-300 transition-colors duration-500">
                        {value.icon}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white/75 text-[11px] lg:text-xs font-bold group-hover:text-white transition-colors duration-300">
                        {value.title}
                      </h4>
                      <p className="text-white/35 text-[9px] lg:text-[10px] mt-0.5 leading-relaxed group-hover:text-white/45 transition-colors duration-300 line-clamp-2">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* العمود الأيسر - صورة المبنى مع overlay */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-lg xl:max-w-xl">
              {/* glow خلفية */}
              <div className="absolute -inset-6 bg-gradient-to-br from-gold-500/15 via-blue-500/10 to-gold-600/15 rounded-full blur-3xl opacity-70 animate-pulse" />

              {/* دائرة الصورة */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full border-[3px] border-gold-500/40 shadow-2xl overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
                <div className="absolute inset-2 rounded-full border-2 border-gold-400/20" />
                <div className="absolute inset-4 rounded-full border border-gold-400/10" />

                <img
                  src="/images/office-building.png"
                  alt="مبنى مكتب الأشغال العامة والطرق - محافظة ذمار"
                  className="relative w-full h-full object-cover rounded-full"
                  loading="eager"
                  style={{
                    imageRendering: 'auto',
                    filter: 'contrast(1.05) saturate(1.1) brightness(1.02)',
                  }}
                />

                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-500/0 via-white/15 to-gold-500/0 animate-[shimmer_5s_ease-in-out_infinite]" />
              </div>

              {/* شارة التحقق */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full p-4 shadow-xl">
                <CheckCircle2
                  size={24}
                  className="text-white"
                />
              </div>

              {/* شارة التأريخ */}
              <div className="absolute -top-3 -left-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl border border-gold-200">
                <div className="text-gov-900 font-black text-sm">منذ 1979</div>
                <div className="text-gold-600 text-xs font-bold">45+ عام</div>
              </div>
            </div>
          </div>
        </div>

        {/* خدمات سريعة */}
        <div className="hidden lg:block mt-10 xl:mt-12">
          <ScrollReveal delay={550}>
            <div className="grid grid-cols-4 gap-4">
              {QUICK_SERVICES.map((service, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigate(service.page)}
                  className="group relative p-4 xl:p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] hover:border-white/[0.08] transition-all duration-500 text-right hover:scale-[1.02] active:scale-[0.98]"
                >
                  {service.badge && (
                    <div
                      className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${service.badgeStyle}`}
                    >
                      {service.badge}
                    </div>
                  )}
                  <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-xl bg-gradient-to-br from-gold-500/15 to-gold-600/10 flex items-center justify-center mb-3 xl:mb-4 group-hover:from-gold-500/25 group-hover:to-gold-600/15 transition-all duration-500">
                    <div className="text-gold-400 group-hover:text-gold-300 transition-colors duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-white/80 text-sm font-bold mb-1.5 group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-white/35 text-xs leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                    {service.description}
                  </p>
                  <div className="mt-3 flex justify-start">
                    <ArrowLeft
                      size={14}
                      className="text-gold-400/40 group-hover:text-gold-400/80 group-hover:-translate-x-1 transition-all duration-300"
                    />
                  </div>
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <StatsBar />

      <button
        onClick={scrollDown}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 group"
        aria-label="التمرير للأسفل لاستكشاف المحتوى"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <span className="text-xs font-medium text-white/70 tracking-wider">
              اكتشف خدماتنا وإنجازاتنا
            </span>
            <span className="text-[10px] text-white/40 mt-0.5">ومشاريعنا وخططنا التطويرية</span>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-lg group-hover:bg-gold-400/30 transition-all duration-500" />
            <ChevronDown
              size={30}
              className="relative text-white/50 group-hover:text-gold-400 transition-all duration-500 animate-bounce"
            />
          </div>
          <div className="w-24 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
            />
          </div>
        </div>
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent pointer-events-none z-10" />

      <style>{`
    @keyframes breathe {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.02); opacity: 1; }
    }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin-slower {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
        .animate-reverse-spin-slower { animation: reverse-spin-slower 40s linear infinite; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float 5s ease-in-out 2s infinite; }
      `}</style>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
