// ============================================================
// AboutOfficeSection.tsx v7.0 - Platinum Interactive
// عن المكتب - تفاعلي متقدم مع modal مدمج وتأثيرات 3D
// ============================================================

import { memo, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Building2,
  Target,
  Eye,
  Award,
  TrendingUp,
  Users,
  HardHat,
  CheckCircle2,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Linkedin,
  MapPin,
  Shield,
  FileText,
  Leaf,
  Zap,
  Compass,
  Truck,
  Flag,
  ChevronLeft,
  Sparkles,
  ArrowUpRight,
  Star,
  Clock,
  Calendar,
  Layers,
  Grid3x3,
  BarChart3,
  ExternalLink,
  X,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import AnimatedCounter from '../../../shared/components/AnimatedCounter';
import type { Stat } from '../homeData';

// ============================================================
// الأنواع والواجهات
// ============================================================

export interface AboutOfficeSectionProps {
  onNavigate: (page: string) => void;
  theme?: 'light' | 'dark';
  stats?: Stat[];
  hideRoadmap?: boolean;
  hideShare?: boolean;
  className?: '';
}

type SharePlatform = 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'copy';

// ============================================================
// البيانات المؤسسية
// ============================================================

const INSTITUTIONAL_PROFILE = {
  title: 'مكتب الأشغال العامة والطرق',
  subtitle: 'محافظة ذمار',
  description: 'المنظومة الهندسية الرائدة في محافظة ذمار',
  establishment: 'تأسس عام 2002',
  headquarters: 'شارع الحسينية - جوار مكتب الجمارك',
  vision: 'رؤية تطلعية نحو مستقبل هندسي مستدام',
  mission: 'مهمة ترسيخ معالم البنية التحتية وفق أعلى المعايير',
  goals: 'التحول الرقمي وتحسين الأداء المؤسسي',
  vision2030: 'نموذج يحتذى به في التنمية الحضرية',
  coreValues: [
    { id: 1, label: 'الشفافية', icon: Shield, color: 'from-blue-600 to-blue-700' },
    { id: 2, label: 'الكفاءة', icon: Zap, color: 'from-amber-600 to-orange-600' },
    { id: 3, label: 'الجودة', icon: Award, color: 'from-emerald-600 to-teal-600' },
    { id: 4, label: 'الابتكار', icon: Sparkles, color: 'from-purple-600 to-violet-600' },
  ],
};

const EVOLUTION_TIMELINE = [
  {
    year: 1990,
    title: 'تأسيس الهوية المؤسسية',
    description:
      'وضع اللبنة الأولى لانطلاق مؤسستنا كمنارة هندسية تقود قاطرة التنمية والتنظيم العمراني.',
    icon: Flag,
    stats: '٣٦ سنة من الخبرة',
  },
  {
    year: 2005,
    title: 'التوسع في الخدمات الهندسية',
    description:
      'افتتاح الفروع في المديريات وتوسيع نطاق الخدمات الهندسية لتغطية جميع أنحاء المحافظة.',
    icon: Layers,
    stats: '+٥ فروع إدارية',
  },
  {
    year: 2015,
    title: 'الإصلاح والحوكمة',
    description: 'تنفيذ إجراءات الإصلاح الإداري وتعزيز الحوكمة والشفافية.',
    icon: Shield,
    stats: '+٧٠٪ تحسين الإجراءات',
  },
  {
    year: 2020,
    title: 'التحول الرقمي',
    description: 'إطلاق المنصة الإلكترونية للخدمات الهندسية وتطبيق أنظمة المعلومات الحديثة.',
    icon: Zap,
    stats: '+٨٥٪ أتمتة',
  },
  {
    year: 2024,
    title: 'التميز والشمولية',
    description: 'توسعة الخدمات وتطويد قنوات التواصل وتطبيق المعايير المؤسسية العالمية.',
    icon: Sparkles,
    stats: '+٣ ملايين خدمة',
  },
  {
    year: 2026,
    title: 'الريادة المؤسسية',
    description: 'تصبح محطة النموذج المثالي للمنظمات الحكومية في تنظيم العمران والبنية التحتية.',
    icon: Award,
    stats: 'جودة احترافية',
  },
];

const SERVICES_PORTFOLIO = [
  {
    id: 1,
    name: 'الرقابة على جودة البناء',
    icon: HardHat,
    color: 'from-orange-600 to-red-600',
    description:
      'نضمن أن كل مبنى يُنشأ وفق المعايير الهندسية المعتمدة لحماية أرواح وممتلكات المواطنين، وتطبيق أحدث الممارسات الدولية في السلامة.',
    outcomes: [
      'إصدار أكثر من ٢٬٢٠٠ رخصة بناء',
      'تنفيذ أكثر من ٥٠٠ عملية مساحية',
      'ضبط أكثر من ١٧٠٠ مخالفة',
    ],
    metrics: { projects: 2274, inspections: 1746, satisfaction: '٩٧%' },
  },
  {
    id: 2,
    name: 'التخطيط العمراني المتكامل',
    icon: Compass,
    color: 'from-emerald-600 to-teal-600',
    description:
      'نخطط للمستقبل من خلال تحديث المخططات الحضرية وإنشاء وحدات جوار جديدة وفق أساليب التخطيط الحضري الصحيح.',
    outcomes: ['تحديث المخططات الحضرية', 'إعداد ١٠ وحدات جوار', 'توفير مرجعيات تنظيمية'],
    metrics: { plans: 10, zones: 10, coverage: '١٠٠%' },
  },
  {
    id: 3,
    name: 'التحول الرقمي للخدمات',
    icon: Zap,
    color: 'from-blue-600 to-indigo-600',
    description:
      'نستخدم التكنولوجيا الحديثة لتسهيل وصولك إلى الخدمات الهندسية عبر منصات إلكترونية متطورة.',
    outcomes: ['أتمتة نظام إصدار التراخيص', 'قاعدة بيانات موحدة', 'حصر إلكتروني بنسبة ٨٥%'],
    metrics: { automation: 85, users: '١٥٠٠٠+', duration: '٢٤ ساعة' },
  },
  {
    id: 4,
    name: 'الرقابة الصحية والبيئية',
    icon: Leaf,
    color: 'from-green-600 to-emerald-600',
    description:
      'نحمي صحة المجتمع من خلال الرقابة على سلامة الأغذية والمنشآت الصحية وتطبيق المعايير البيئية.',
    outcomes: ['أكثر من ٧٦٠ زيارة رقابية', 'إصدار ٩١١ بطاقة صحية', 'مصادرة ٨١٢ كجم'],
    metrics: { visits: 764, cards: 911, seized: 812 },
  },
  {
    id: 5,
    name: 'تطويد البنية التحتية',
    icon: Truck,
    color: 'from-amber-600 to-orange-600',
    description: 'نساهم في تطويد شبكة الطرق والبنية التحتية لتحسين حركة النقل وتوصيل الخدمات.',
    outcomes: ['مشاريع الرصف والصيانة', 'شوارع رئيسية', 'مسح ٢٨٣٠٠٠ م²'],
    metrics: { projects: 156, streets: 78, area: '٢٨٣٠٠٠ م²' },
  },
  {
    id: 6,
    name: 'تطويد كادر المؤسسي',
    icon: Building2,
    color: 'from-yellow-600 to-amber-700',
    description: 'نطور مباني ومرافق المكتب لضمان بيئة عمل مناسبة تتماشى مع المعايير الحديثة.',
    outcomes: ['بناء الدور الثالث', 'ترميم المرافق', 'إنشاء ورشة صيانة'],
    metrics: { facilities: 5, projects: 12, capacity: '٣٠٠%' },
  },
];

const IMPACT_STATISTICS: Stat[] = [
  {
    id: 'stat-1',
    value: '2,274',
    label: 'مشروع بناء مرخص',
    suffix: '+',
    icon: HardHat,
    color: 'from-orange-600 to-red-600',
  },
  {
    id: 'stat-2',
    value: '1,746',
    label: 'مخالفة معالجة',
    suffix: '',
    icon: Shield,
    color: 'from-red-600 to-rose-700',
  },
  {
    id: 'stat-3',
    value: '4,245',
    label: 'نشاط تجاري مرخص',
    suffix: '+',
    icon: FileText,
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'stat-4',
    value: '10',
    label: 'وحدة جوار جديدة',
    suffix: '+',
    icon: Compass,
    color: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'stat-5',
    value: '120',
    label: 'كادر مؤهل',
    suffix: '+',
    icon: Users,
    color: 'from-purple-600 to-violet-700',
  },
  {
    id: 'stat-6',
    value: '764',
    label: 'زيارة رقابية',
    suffix: '',
    icon: Leaf,
    color: 'from-green-600 to-emerald-700',
  },
];

// ============================================================
// مكونات الخلفية
// ============================================================

const EngineeringPatternBackground = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03]">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="engineering-grid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#d4af37"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="engineering-dots"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="20"
                cy="20"
                r="1"
                fill="#3b82f6"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#engineering-grid)"
          />
          <rect
            width="100%"
            height="100%"
            fill="url(#engineering-dots)"
          />
        </svg>
      </div>
      <div className="absolute -top-1/4 -left-1/4 w-96 h-96">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-yellow-400/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-[28rem] h-[28rem] bg-gradient-to-tl from-blue-200/25 to-indigo-400/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-emerald-200/25 to-teal-400/15 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </div>
  );
});

// ============================================================
// مكونات الواجهة
// ============================================================

const HeroBadge = memo(() => {
  return (
    <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-xl border-2 border-amber-300 px-6 py-3 rounded-full text-sm font-black text-amber-800 shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-100/50 via-yellow-200/50 to-amber-100/50 animate-shimmer" />
      <div className="relative flex items-center gap-2">
        <span className="p-1.5 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full shadow-lg">
          <Building2
            size={18}
            className="text-white"
          />
        </span>
        <span className="tracking-wider font-bold text-gray-800">عن المكتب</span>
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        <span className="text-amber-700 font-semibold"> </span>
        <Sparkles
          size={14}
          className="text-amber-600 group-hover:rotate-12 transition-transform duration-500"
        />
      </div>
    </div>
  );
});

const PremiumStatCard = memo(function PremiumStatCard({
  stat,
  index,
}: {
  stat: Stat;
  index: number;
}) {
  const Icon = stat.icon || TrendingUp;
  const delay = index * 100;

  return (
    <div
      className="group relative bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-xl rounded-3xl p-6 text-center border-2 border-amber-200 hover:border-amber-400 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-amber-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div
        className={`w-14 h-14 bg-gradient-to-br ${stat.color || 'from-amber-600 to-amber-700'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
      >
        <Icon
          size={16}
          className="text-white"
        />
      </div>
      <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1 tracking-tight">
        <AnimatedCounter
          end={parseInt(stat.value.replace(/\D/g, ''))}
          duration={2000}
        />
        <span className="text-base font-normal text-gray-600">{stat.value.replace(/\d/g, '')}</span>
      </div>
      <div className="text-gray-700 text-sm font-medium tracking-wide">{stat.label}</div>
    </div>
  );
});

const VisionMissionCard = memo(function VisionMissionCard({
  label,
  icon: Icon,
  content,
  color,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  content: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-right p-7 rounded-3xl border-2 transition-all duration-500 ${
        isActive
          ? 'border-amber-500 bg-gradient-to-br from-amber-100 to-yellow-100 shadow-2xl shadow-amber-200'
          : 'border-gray-300 bg-white hover:border-amber-400 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-500`}
        >
          <Icon
            size={16}
            className="text-white"
          />
        </div>
        <span
          className={`text-xl font-black transition-colors duration-300 ${isActive ? 'text-amber-800' : 'text-gray-900 group-hover:text-amber-700'}`}
        >
          {label}
        </span>
      </div>
      <p className="text-gray-800 text-base leading-relaxed font-medium">{content}</p>
      {isActive && (
        <div className="absolute top-4 left-4">
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
        </div>
      )}
    </button>
  );
});

const TimelineNode = memo(function TimelineNode({
  item,
  index,
  isEven,
}: {
  item: (typeof EVOLUTION_TIMELINE)[0];
  index: number;
  isEven: boolean;
}) {
  const Icon = item.icon;

  return (
    <div
      className={`relative flex items-center ${isEven ? 'flex-row-reverse' : 'flex-row'} group`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <div className="relative">
          <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full ring-4 ring-white shadow-xl group-hover:ring-amber-300 transition-all duration-500" />
          <div className="absolute inset-0 w-6 h-6 bg-amber-500 rounded-full animate-ping opacity-30" />
        </div>
      </div>
      <div className={`w-5/12 ${isEven ? 'text-right pr-10' : 'text-left pl-10'}`}>
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group-hover:border-amber-400">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl shadow-lg">
              <Icon
                size={14}
                className="text-white"
              />
            </div>
            <span className="text-sm font-black text-amber-700 tracking-wider">{item.year}</span>
            <span className="text-xs text-gray-700 bg-amber-100 px-2 py-1 rounded-full font-medium">
              {item.stats}
            </span>
          </div>
          <h4 className="font-black text-gray-900 text-lg mb-2">{item.title}</h4>
          <p className="text-gray-800 text-sm leading-relaxed">{item.description}</p>
        </div>
      </div>
      <div className="w-1/6" />
    </div>
  );
});

const ServicePortfolioCard = memo(function ServicePortfolioCard({
  service,
  onOpenModal,
  index,
}: {
  service: (typeof SERVICES_PORTFOLIO)[0];
  onOpenModal: (service: (typeof SERVICES_PORTFOLIO)[0]) => void;
  index: number;
}) {
  const Icon = service.icon;

  return (
    <div
      className="group relative bg-white rounded-3xl border-2 border-gray-200 p-7 hover:border-amber-400 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-pointer overflow-hidden"
      onClick={() => onOpenModal(service)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-amber-100/30 opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="relative mb-5">
        <div
          className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
        >
          <Icon
            size={28}
            className="text-white"
          />
        </div>
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight
            size={12}
            className="text-amber-600"
          />
        </div>
      </div>
      <h4 className="font-black text-gray-900 text-lg mb-3 group-hover:text-amber-700 transition-colors duration-300">
        {service.name}
      </h4>
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
        {service.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(service.metrics)
          .slice(0, 2)
          .map(([key, value]) => (
            <span
              key={key}
              className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200"
            >
              {value}
            </span>
          ))}
      </div>
    </div>
  );
});

const ProfessionalShareBar = memo(function ProfessionalShareBar({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = useCallback(
    (platform: SharePlatform) => {
      const shareUrls: Record<SharePlatform, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)} ${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        copy: '',
      };

      if (platform === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
          const toast = document.createElement('div');
          toast.className =
            'fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-2xl z-50 animate-scale-in';
          toast.textContent = '✅ تم نسخ الرابط بنجاح';
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        });
        return;
      }

      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    },
    [title, url],
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <Share2 size={16} />
        مشاركة المحتوى
        <ChevronLeft
          size={14}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 p-3 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 flex gap-2 animate-fade-in-up z-20">
          {[
            {
              platform: 'facebook' as SharePlatform,
              icon: Facebook,
              label: 'فيسبوك',
              color: 'hover:bg-blue-600',
            },
            {
              platform: 'twitter' as SharePlatform,
              icon: Twitter,
              label: 'تويتر',
              color: 'hover:bg-sky-500',
            },
            {
              platform: 'whatsapp' as SharePlatform,
              icon: MessageCircle,
              label: 'واتساب',
              color: 'hover:bg-emerald-500',
            },
            {
              platform: 'linkedin' as SharePlatform,
              icon: Linkedin,
              label: 'لينكدإن',
              color: 'hover:bg-blue-700',
            },
            {
              platform: 'copy' as SharePlatform,
              icon: ExternalLink,
              label: 'نسخ',
              color: 'hover:bg-gray-800',
            },
          ].map(({ platform, icon: PlatformIcon, label, color }) => (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={`p-2.5 rounded-xl text-gray-700 ${color} hover:text-white transition-all duration-300 hover:scale-110 border border-gray-200`}
              aria-label={`مشاركة على ${label}`}
            >
              <PlatformIcon size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================================
// Modal مدمج للخدمات
// ============================================================

const ServiceDetailModal = memo(function ServiceDetailModal({
  service,
  onClose,
}: {
  service: (typeof SERVICES_PORTFOLIO)[0] | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [service]);

  if (!service) return null;

  const Icon = service.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative h-48 bg-gradient-to-br ${service.color} rounded-t-3xl flex items-center justify-center`}
        >
          <Icon
            size={80}
            className="text-white drop-shadow-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
          >
            <X
              size={20}
              className="text-white"
            />
          </button>
        </div>
        <div className="p-8">
          <h3 className="text-3xl font-black text-gray-900 mb-4">{service.name}</h3>
          <p className="text-gray-700 text-base leading-relaxed mb-6">{service.description}</p>
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-3">النتائج والانجازات:</h4>
            <ul className="space-y-2">
              {service.outcomes.map((outcome, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <CheckCircle2
                    size={18}
                    className="text-emerald-500 mt-0.5 shrink-0"
                  />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(service.metrics).map(([key, value]) => (
              <div
                key={key}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-black text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{key}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// المكون الرئيسي
// ============================================================

export const AboutOfficeSection = memo(function AboutOfficeSection({
  stats = [],
  hideRoadmap = false,
  hideShare = false,
  className = '',
}: AboutOfficeSectionProps) {
  const [activeTab, setActiveTab] = useState<'vision' | 'mission' | 'goals'>('vision');
  const [selectedService, setSelectedService] = useState<(typeof SERVICES_PORTFOLIO)[0] | null>(
    null,
  );
  const sectionRef = useRef<HTMLElement>(null);

  const displayStats = useMemo(() => (stats.length > 0 ? stats : IMPACT_STATISTICS), [stats]);

  const handleTabChange = useCallback(
    (tabId: 'vision' | 'mission' | 'goals') => setActiveTab(tabId),
    [],
  );
  const handleOpenModal = useCallback((service: (typeof SERVICES_PORTFOLIO)[0]) => {
    setSelectedService(service);
  }, []);
  const handleCloseModal = useCallback(() => {
    setSelectedService(null);
  }, []);

  const tabContent = {
    vision: INSTITUTIONAL_PROFILE.vision,
    mission: INSTITUTIONAL_PROFILE.mission,
    goals: INSTITUTIONAL_PROFILE.goals,
    vision2030: INSTITUTIONAL_PROFILE.vision2030,
  };

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-gray-50 via-amber-50/30 to-gray-50 ${className}`}
      aria-label="عن المكتب"
    >
      <EngineeringPatternBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* الهيدر البطل */}
        <ScrollReveal>
          <div className="relative text-center mb-20">
            <div className="mb-8">
              <HeroBadge />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
              {INSTITUTIONAL_PROFILE.title}
              <span className="block text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-yellow-600 mt-3 tracking-wider">
                {INSTITUTIONAL_PROFILE.subtitle}
              </span>
            </h1>
            <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-700 leading-relaxed font-medium mb-10">
              {INSTITUTIONAL_PROFILE.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              <div className="flex items-center gap-4 bg-white border-2 border-amber-200 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-2.5 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl">
                  <Calendar
                    size={18}
                    className="text-white"
                  />
                </div>
                <div className="text-right">
                  <span className="block text-xs text-gray-600 font-medium">تاريخ التأسيس</span>
                  <span className="text-sm font-bold text-gray-800">
                    {INSTITUTIONAL_PROFILE.establishment}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white border-2 border-blue-200 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                  <MapPin
                    size={18}
                    className="text-white"
                  />
                </div>
                <div className="text-right">
                  <span className="block text-xs text-gray-600 font-medium">المقر الرئيسي</span>
                  <span className="text-sm font-bold text-gray-800">
                    {INSTITUTIONAL_PROFILE.headquarters}
                  </span>
                </div>
              </div>
            </div>
            {!hideShare && (
              <div className="flex items-center justify-center gap-4">
                <ProfessionalShareBar
                  title={INSTITUTIONAL_PROFILE.title}
                  url={window.location.href}
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* القيم الأساسية */}
        <ScrollReveal delay={100}>
          <div className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl shadow-lg">
                <Star
                  size={18}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">قيمنا الأساسية</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {INSTITUTIONAL_PROFILE.coreValues.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.id}
                    className="group relative bg-white border-2 border-gray-200 rounded-2xl p-5 text-center hover:border-amber-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon
                        size={18}
                        className="text-white"
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                      {value.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* الرؤية والرسالة */}
        <ScrollReveal delay={150}>
          <div className="relative mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'vision' as const,
                  label: 'الرؤية الاستراتيجية',
                  icon: Eye,
                  content: tabContent.vision,
                  color: 'from-amber-600 to-yellow-700',
                },
                {
                  id: 'mission' as const,
                  label: 'الرسالة المؤسسية',
                  icon: Target,
                  content: tabContent.mission,
                  color: 'from-blue-600 to-indigo-700',
                },
                {
                  id: 'goals' as const,
                  label: 'الأهداف المستقبلية',
                  icon: Award,
                  content: tabContent.goals,
                  color: 'from-emerald-600 to-teal-700',
                },
              ].map((tab) => (
                <VisionMissionCard
                  key={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  content={tab.content}
                  color={tab.color}
                  isActive={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* مسار التطور */}
        {!hideRoadmap && (
          <ScrollReveal delay={200}>
            <div className="mb-20">
              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="p-2 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl shadow-lg">
                  <Clock
                    size={18}
                    className="text-white"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                  مسيرة التطور المؤسسي
                </h3>
              </div>
              <div className="relative">
                <div className="space-y-12">
                  {EVOLUTION_TIMELINE.map((item, idx) => (
                    <TimelineNode
                      key={idx}
                      item={item}
                      index={idx}
                      isEven={idx % 2 === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* الخدمات المؤسسية */}
        <ScrollReveal delay={250}>
          <div className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                <Grid3x3
                  size={18}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">خدماتنا المتميزة</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {SERVICES_PORTFOLIO.map((service, idx) => (
                <ServicePortfolioCard
                  key={service.id}
                  service={service}
                  onOpenModal={handleOpenModal}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* الإحصائيات */}
        <ScrollReveal delay={300}>
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl overflow-hidden mb-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern
                      id="stats-pattern"
                      x="0"
                      y="0"
                      width="30"
                      height="30"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="15"
                        cy="15"
                        r="1"
                        fill="#ffffff"
                        opacity="0.1"
                      />
                      <path
                        d="M 0 0 L 30 30 M 30 0 L 0 30"
                        stroke="#ffffff"
                        strokeWidth="0.3"
                        opacity="0.05"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#stats-pattern)"
                  />
                </svg>
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl shadow-lg">
                  <BarChart3
                    size={18}
                    className="text-white"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white">
                  أثرنا في المجتمع بالأرقام
                </h3>
              </div>
              <p className="text-amber-200 text-center mb-10 max-w-2xl mx-auto text-base font-medium">
                مؤشرات أداء تعكس قيمة خدماتنا للمواطن والمجتمع
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {displayStats.map((stat, idx) => (
                  <PremiumStatCard
                    key={stat.id}
                    stat={stat}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={handleCloseModal}
      />
    </section>
  );
});

AboutOfficeSection.displayName = 'AboutOfficeSection';
export default AboutOfficeSection;