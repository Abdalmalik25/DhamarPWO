// ============================================================
// AboutOfficeSection.tsx - البوابة المؤسسية الإرشادية (Pro v6.0)
// تصميم احترافي يتفوق على تصاميم فيجما
// ============================================================

import { memo, useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  MapPin,
  Shield,
  FileText,
  Leaf,
  Zap,
  Compass,
  HeartHandshake,
  Truck,
  Flag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Quote,
  Star,
  Clock,
  Calendar,
  Layers,
  Grid3x3,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import AnimatedCounter from '../../../shared/components/AnimatedCounter';
import ServiceModal from '../../../shared/components/ServiceModal';
import type { Stat } from '../homeData';
import type { Page } from '../../../types/page';

// ============================================================
// 1. نظام التصميم المتقدم (Advanced Design System)
// ============================================================

// 1.1. ثوابت التصميم الموحدة
const DESIGN_TOKENS = {
  colors: {
    primary: {
      50: '#fefce8',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
  },
  shadows: {
    'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '3xl': '0 35px 60px -15px rgb(0 0 0 / 0.3)',
    'glow': '0 0 40px rgba(245, 158, 11, 0.15)',
    'glow-strong': '0 0 60px rgba(245, 158, 11, 0.25)',
    'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  borderRadius: {
    'none': '0',
    'sm': '0.125rem',
    'base': '0.25rem',
    'md': '0.375rem',
    'lg': '0.5rem',
    'xl': '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    '4xl': '2rem',
    'full': '9999px',
  },
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
};

// 1.2. أنماط متقدمة باستخدام CSS-in-JS (يمكن تحويلها إلى Tailwind)
const advancedStyles = {
  glass: `
    backdrop-blur-xl bg-white/10 border border-white/20 
    shadow-[0_8px_32px_rgba(0,0,0,0.12)] 
    hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]
    transition-all duration-500
  `,
  glassDark: `
    backdrop-blur-xl bg-black/20 border border-white/10 
    shadow-[0_8px_32px_rgba(0,0,0,0.3)] 
    hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]
    transition-all duration-500
  `,
  gradientGold: `
    bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600
  `,
  gradientBlue: `
    bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700
  `,
  gradientGreen: `
    bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600
  `,
};

// ============================================================
// 2. أنواع البيانات المتخصصة (Specialized Types)
// ============================================================

export interface AboutOfficeSectionProps {
  onNavigate: (page: Page) => void;
  stats?: Stat[];
  hideRoadmap?: boolean;
  hideShare?: boolean;
  className?: string;
}

// ============================================================
// 3. البيانات المؤسسية الموسعة (Enhanced Institutional Data)
// ============================================================

const PROFILE_DATA = {
  title: 'مكتب الأشغال العامة والطرق',
  subtitle: 'محافظة ذمار · الجمهورية اليمنية',
  description:
    'الجهة الحكومية المخولة بتنظيم قطاع التشييد والبناء، وإصدار التراخيص العمرانية، والإشراف على مشاريع الطرق والبنية التحتية في محافظة ذمار. نعمل تحت مظلة السلطة المحلية وبالتنسيق مع وزارة الأشغال العامة والطرق لضمان تنمية حضرية مستدامة وخدمات هندسية متكاملة.',
  establishment: 'تأسس في عام 1990 م بعد الوحدة اليمنية المباركة.',
  headquarters: 'المقر الرئيسي: شارع الحسينية  جوار مكتب الجمارك   الجمهورية اليمنية.',
  vision:
    'أن نكون المرجع الهندسي الأول والجهة الرائدة في تنظيم قطاع التشييد والبناء في محافظة ذمار، ونقدم نموذجاً حكومياً متميزاً في الخدمات الهندسية والشفافية الإدارية.',
  mission:
    'تطوير البنية التحتية وتنظيم قطاع التشييد والبناء من خلال تقديم خدمات هندسية متكاملة، وإصدار التراخيص العمرانية وفق أعلى معايير الجودة والشفافية والكفاءة.',
  goals:
    'التحول الرقمي الشامل في الخدمات الهندسية، رفع كفاءة الأداء المؤسسي، تطوير الكادر البشري، وتقليص زمن إنجاز المعاملات بنسبة 40% بحلول 2028.',
  achievements: [
    'أكثر من 2,200 رخصة بناء ممنوحة',
    'أكثر من 1,700 مخالفة تم ضبطها',
    'أكثر من 4,200 رخصة تجارية',
    'أكثر من 760 زيارة رقابية',
  ],
};

const EVOLUTION_DATA = [
  {
    year: 1990,
    title: 'تأسيس الهوية',
    description: 'تأسيس مكتب الأشغال العامة والطرق كمؤسسة حكومية رائدة.',
    icon: Flag,
  },
  {
    year: 2005,
    title: 'التوسع في الخدمات',
    description: 'افتتاح الفروع في المديريات وتوسيع نطاق الخدمات الهندسية.',
    icon: Layers,
  },
  {
    year: 2015,
    title: 'الإصلاح والشفافية',
    description: 'تنفيذ إجراءات الإصلاح الإداري وتعزيز الشفافية.',
    icon: Shield,
  },
  {
    year: 2020,
    title: 'التحول الرقمي',
    description: 'إطلاق المنصة الإلكترونية للخدمات الهندسية.',
    icon: Zap,
  },
  {
    year: 2024,
    title: 'الشمولية والتميز',
    description: 'توسعة الخدمات وتطوير قنوات التواصل.',
    icon: Sparkles,
  },
  {
    year: 2026,
    title: 'الريادة المؤسسية',
    description: 'تحقيق إنجازات نوعية في تنظيم العمران.',
    icon: Award,
  },
];

const SERVICES_DATA = [
  {
    id: 1,
    name: 'الرقابة على جودة البناء',
    icon: HardHat,
    color: 'from-orange-500 to-orange-700',
    description:
      'نضمن أن كل مبنى يُنشأ وفق المعايير الهندسية المعتمدة لحماية أرواح وممتلكات المواطنين.',
    outcomes: [
      'إصدار أكثر من 2,200 رخصة بناء للمواطنين',
      'تنفيذ أكثر من 500 عملية مساحية',
      'ضبط أكثر من 1,700 مخالفة بناء',
    ],
  },
  {
    id: 2,
    name: 'التخطيط العمراني المتكامل',
    icon: Compass,
    color: 'from-emerald-500 to-emerald-700',
    description: 'نخطط للمستقبل من خلال تحديث المخططات الحضرية وإنشاء وحدات جوار جديدة.',
    outcomes: [
      'تحديث المخططات الحضرية لمدينة ذمار',
      'إعداد 10 وحدات جوار جديدة',
      'توفير مرجعيات تنظيمية للبناء',
    ],
  },
  {
    id: 3,
    name: 'التحول الرقمي للخدمات',
    icon: Zap,
    color: 'from-blue-500 to-blue-700',
    description:
      'نستخدم التكنولوجيا الحديثة لتسهيل وصولك إلى الخدمات الهندسية عبر منصات إلكترونية متطورة.',
    outcomes: [
      'أتمتة نظام إصدار تراخيص البناء',
      'قاعدة بيانات إلكترونية موحدة',
      'حصر إلكتروني للأنشطة التجارية بنسبة 85%',
    ],
  },
  {
    id: 4,
    name: 'الرقابة الصحية والبيئية',
    icon: Leaf,
    color: 'from-green-500 to-green-700',
    description: 'نحمي صحة المجتمع من خلال الرقابة على سلامة الأغذية والمنشآت الصحية.',
    outcomes: [
      'أكثر من 760 زيارة رقابية',
      'إصدار 911 بطاقة صحية',
      'مصادرة 812 كجم من المواد غير الصالحة',
    ],
  },
  {
    id: 5,
    name: 'تطوير البنية التحتية والطرق',
    icon: Truck,
    color: 'from-amber-500 to-amber-700',
    description: 'نساهم في تطوير شبكة الطرق والبنية التحتية لتحسين حركة النقل.',
    outcomes: [
      'تنفيذ مشاريع الرصف والصيانة',
      'شق وتأهيل الشوارع الرئيسية',
      'مسح 283,000 م² من الشوارع',
    ],
  },
  {
    id: 6,
    name: 'تطوير الأصول والبنية التحتية للمكتب',
    icon: Building2,
    color: 'from-gold-500 to-gold-700',
    description: 'نطور مباني ومرافق المكتب لضمان بيئة عمل مناسبة.',
    outcomes: [
      'بناء الدور الثالث للمكتب',
      'ترميم وتأهيل مرافق المكتب',
      'إنشاء هنجر للمعدات وورشة صيانة',
    ],
  },
  {
    id: 7,
    name: 'الشراكة المجتمعية والدعم المؤسسي',
    icon: HeartHandshake,
    color: 'from-rose-500 to-rose-700',
    description: 'نؤمن بأن التنمية مسؤولية مشتركة، ونعمل مع المجتمع والمؤسسات.',
    outcomes: [
      'توطيد الشراكة مع المركز الوطني للتوثيق',
      'دعم المشاريع المجتمعية',
      'تعزيز التنسيق المؤسسي',
    ],
  },
  {
    id: 8,
    name: 'تطوير الكادر البشري والتدريب',
    icon: Users,
    color: 'from-purple-500 to-purple-700',
    description: 'نستثمر في تدريب وتأهيل كوادرنا البشرية لضمان تقديم خدمات متميزة.',
    outcomes: ['تدريب أكثر من 120 موظفاً', 'دورات تدريبية متخصصة', 'استيعاب 80 متدرباً'],
  },
  {
    id: 9,
    name: 'تنظيم وترخيص الأنشطة التجارية',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    description: 'ننظم حركة الأنشطة التجارية في المحافظة لضمان بيئة استثمارية صحية.',
    outcomes: [
      'إصدار وتجديد أكثر من 4,200 رخصة',
      'ضبط أكثر من 1,600 مخالفة تجارية',
      'تطبيق النظام الإلكتروني للتراخيص',
    ],
  },
];

const IMPACT_STATS: Stat[] = [
  {
    id: 'stat-1',
    value: '2,274',
    label: 'مشروع بناء مرخص',
    suffix: '+',
    icon: HardHat,
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'stat-2',
    value: '1,746',
    label: 'مخالفة تمت معالجتها',
    suffix: '',
    icon: Shield,
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'stat-3',
    value: '4,245',
    label: 'نشاط تجاري مرخص',
    suffix: '+',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'stat-4',
    value: '10',
    label: 'وحدة جوار جديدة',
    suffix: '+',
    icon: Compass,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'stat-5',
    value: '120',
    label: 'كادر مؤهل',
    suffix: '+',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'stat-6',
    value: '764',
    label: 'زيارة رقابية',
    suffix: '',
    icon: Leaf,
    color: 'from-green-500 to-green-600',
  },
];

// ============================================================
// 4. مكونات فرعية متطورة (Advanced Sub-components)
// ============================================================

// 4.1. تأثيرات متحركة خلفية (Animated Background)
const AnimatedBackground = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* كرات متحركة بزوايا متعددة */}
      <div className="absolute -top-1/2 -left-1/2 w-full h-full">
        <div
          className="absolute top-[10%] left-[20%] w-96 h-96 bg-gradient-to-br from-amber-200/20 via-yellow-300/15 to-gold-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDuration: '20s' }}
        />
        <div
          className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-gradient-to-tl from-blue-200/15 via-indigo-300/10 to-purple-400/10 rounded-full blur-3xl animate-float-delayed"
          style={{ animationDuration: '25s', animationDelay: '-5s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-emerald-200/10 via-teal-300/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDuration: '15s' }}
        />
      </div>
      {/* شبكة هندسية دقيقة */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* نقاط متحركة */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-particle ${15 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

// 4.2. شارة رئيسية (Hero Badge)
const HeroBadge = memo(() => {
  return (
    <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-400/20 via-yellow-500/25 to-amber-400/20 backdrop-blur-xl border border-amber-400/30 px-6 py-3 rounded-full text-sm font-black text-amber-700 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_50px_rgba(245,158,11,0.25)] transition-all duration-700 group">
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/10 via-yellow-500/10 to-amber-400/10 animate-pulse" />
      <span className="relative flex items-center gap-2">
        <span className="p-1.5 bg-gradient-to-br from-amber-500 to-gold-600 rounded-full shadow-lg">
          <Building2
            size={18}
            className="text-white"
          />
        </span>
        <span className="tracking-wider">عن المكتب</span>
        <span className="w-1 h-1 bg-amber-400 rounded-full" />
        <span className="text-amber-600 font-normal">الإصدار 6.0</span>
        <Sparkles
          size={14}
          className="text-amber-500 group-hover:rotate-12 transition-transform"
        />
      </span>
    </div>
  );
});

// 4.3. بطاقة إحصائية متطورة (Premium Stat Card)
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
      className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 text-center border border-white/10 hover:border-amber-400/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div
        className={`w-12 h-12 bg-gradient-to-br ${stat.color || 'from-amber-500 to-amber-600'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
      >
        <Icon
          size={22}
          className="text-white"
        />
      </div>
      <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
        <AnimatedCounter
          end={parseInt(stat.value.replace(/[^0-9]/g, ''))}
          duration={2000}
        />
        <span className="text-base font-normal text-white/60">
          {stat.value.replace(/[0-9]/g, '')}
        </span>
      </div>
      <div className="text-white/60 text-sm font-medium tracking-wide">{stat.label}</div>
    </div>
  );
});

// 4.4. بطاقة تطور زمني ثلاثية الأبعاد (3D Timeline Card)
const TimelineCard = memo(function TimelineCard({
  item,
  index,
  isEven,
}: {
  item: (typeof EVOLUTION_DATA)[0];
  index: number;
  isEven: boolean;
}) {
  const Icon = item.icon;

  return (
    <div
      className={`relative flex items-center ${isEven ? 'flex-row-reverse' : 'flex-row'} group`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* النقطة المركزية */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <div className="relative">
          <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full ring-4 ring-amber-300/50 shadow-xl group-hover:ring-amber-400/70 transition-all duration-500" />
          <div className="absolute inset-0 w-5 h-5 bg-amber-400 rounded-full animate-ping opacity-40" />
        </div>
      </div>

      {/* المحتوى */}
      <div className={`w-5/12 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group-hover:border-amber-400/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg">
              <Icon
                size={16}
                className="text-white"
              />
            </div>
            <span className="text-sm font-black text-amber-600 tracking-wider">{item.year}</span>
          </div>
          <h4 className="font-black text-gov-900 text-lg mb-2">{item.title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
        </div>
      </div>
      <div className="w-1/6" />
    </div>
  );
});

// 4.5. بطاقة خدمة ثلاثية الأبعاد مع تأثير انعكاس (3D Service Card)
const PremiumServiceCard = memo(function PremiumServiceCard({
  service,
  onOpenModal,
  index,
}: {
  service: (typeof SERVICES_DATA)[0];
  onOpenModal: (service: (typeof SERVICES_DATA)[0]) => void;
  index: number;
}) {
  const Icon = service.icon;

  return (
    <div
      className="group relative bg-white rounded-3xl border border-gray-100/80 p-7 hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-pointer overflow-hidden"
      onClick={() => onOpenModal(service)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* خلفية متدرجة عند التمرير */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-50/0 to-amber-100/0 group-hover:from-amber-50/30 group-hover:via-amber-50/20 group-hover:to-amber-100/10 transition-all duration-700" />

      {/* أيقونة متطورة */}
      <div
        className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}
      >
        <Icon
          size={28}
          className="text-white"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <h4 className="font-black text-gov-900 text-lg mb-2 group-hover:text-amber-700 transition-colors duration-300">
        {service.name}
      </h4>
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{service.description}</p>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {service.outcomes.length} محاور
        </span>
        <span className="text-xs text-amber-500 font-medium group-hover:translate-x-1 transition-transform duration-300">
          <ArrowUpRight size={14} />
        </span>
      </div>
    </div>
  );
});

// 4.6. شريط المشاركة المتقدم (Advanced Share Bar)
const ShareBar = memo(function ShareBar({ title, url }: { title: string; url: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = useCallback(
    (platform: 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'copy') => {
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)} ${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        copy: 'copy',
      };

      if (platform === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
          const toast = document.createElement('div');
          toast.className =
            'fixed bottom-4 left-1/2 -translate-x-1/2 bg-gov-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-2xl z-50 animate-fade-in-up';
          toast.textContent = '✅ تم نسخ الرابط';
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
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <Share2 size={16} />
        مشاركة
        <ChevronLeft
          size={14}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 flex gap-1 animate-fade-in-up z-20">
          {[
            { icon: Facebook, label: 'فيسبوك', platform: 'facebook', color: 'hover:bg-blue-600' },
            { icon: Twitter, label: 'تويتر', platform: 'twitter', color: 'hover:bg-sky-500' },
            {
              icon: MessageCircle,
              label: 'واتساب',
              platform: 'whatsapp',
              color: 'hover:bg-emerald-500',
            },
          ].map((item) => (
            <button
              key={item.platform}
              onClick={() => handleShare(item.platform as any)}
              className={`p-2.5 rounded-xl text-gray-600 ${item.color} hover:text-white transition-all duration-300 hover:scale-110`}
              aria-label={`مشاركة على ${item.label}`}
            >
              <item.icon size={18} />
            </button>
          ))}
          <button
            onClick={() => handleShare('copy')}
            className="p-2.5 rounded-xl text-gray-600 hover:bg-gov-600 hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="نسخ الرابط"
          >
            <FileText size={18} />
          </button>
        </div>
      )}
    </div>
  );
});

// ============================================================
// 5. المكون الرئيسي (Main Component) - نسخة متطورة
// ============================================================

const AboutOfficeSection = memo(function AboutOfficeSection({
  onNavigate,
  stats = [],
  hideRoadmap = false,
  hideShare = false,
  className = '',
}: AboutOfficeSectionProps) {
  // ============================================================
  // 5.1. الحالات الداخلية (Internal State)
  // ============================================================

  const [activeTab, setActiveTab] = useState<'vision' | 'mission' | 'goals'>('vision');
  const [selectedService, setSelectedService] = useState<(typeof SERVICES_DATA)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // ============================================================
  // 5.2. البيانات الديناميكية (Dynamic Data)
  // ============================================================

  const displayStats = useMemo(() => (stats.length > 0 ? stats : IMPACT_STATS), [stats]);

  // ============================================================
  // 5.3. معالجات الأحداث (Event Handlers)
  // ============================================================

  const handleTabChange = useCallback((tabId: 'vision' | 'mission' | 'goals') => {
    setActiveTab(tabId);
  }, []);

  const handleOpenModal = useCallback((service: (typeof SERVICES_DATA)[0]) => {
    setSelectedService(service);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedService(null);
  }, []);

  // ============================================================
  // 5.4. التصيير (Rendering)
  // ============================================================

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white ${className}`}
      aria-label="عن المكتب"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* ===== الخلفية المتحركة ===== */}
      <AnimatedBackground />

      {/* ===== المحتوى الرئيسي ===== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================ */}
        {/* 1. الهيدر البطل (Hero Header) */}
        {/* ============================================================ */}

        <ScrollReveal>
          <div className="relative text-center mb-16">
            {/* الشارة */}
            <div className="mb-6">
              <HeroBadge />
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gov-900 leading-[1.05] tracking-tight mb-4">
              {PROFILE_DATA.title}
              <span className="block text-2xl md:text-3xl font-bold text-amber-600 mt-2 tracking-wider">
                {PROFILE_DATA.subtitle}
              </span>
            </h1>

            {/* الوصف */}
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed font-medium mb-8">
              {PROFILE_DATA.description}
            </p>

            {/* بطاقات المعلومات السريعة */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-amber-200/50 px-5 py-3 rounded-2xl shadow-sm">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                  <Calendar
                    size={16}
                    className="text-white"
                  />
                </div>
                <span className="text-sm font-bold text-gov-800">{PROFILE_DATA.establishment}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-blue-200/50 px-5 py-3 rounded-2xl shadow-sm">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <MapPin
                    size={16}
                    className="text-white"
                  />
                </div>
                <span className="text-sm font-bold text-gov-800">{PROFILE_DATA.headquarters}</span>
              </div>
            </div>

            {/* شريط المشاركة */}
            {!hideShare && (
              <div className="flex items-center justify-center gap-3">
                <ShareBar
                  title={PROFILE_DATA.title}
                  url={window.location.href}
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ============================================================ */}
        {/* 2. الرؤية والرسالة والأهداف - بطاقات متطورة */}
        {/* ============================================================ */}

        <ScrollReveal delay={100}>
          <div className="relative mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'vision' as const,
                  label: 'الرؤية',
                  icon: Eye,
                  content: PROFILE_DATA.vision,
                  color: 'from-amber-400 to-amber-600',
                },
                {
                  id: 'mission' as const,
                  label: 'الرسالة',
                  icon: Target,
                  content: PROFILE_DATA.mission,
                  color: 'from-blue-500 to-indigo-600',
                },
                {
                  id: 'goals' as const,
                  label: 'الأهداف',
                  icon: Award,
                  content: PROFILE_DATA.goals,
                  color: 'from-emerald-500 to-teal-600',
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`group relative text-right p-6 rounded-3xl border-2 transition-all duration-500 ${
                      isActive
                        ? 'border-amber-400/60 bg-gradient-to-br from-amber-50/80 to-white shadow-xl shadow-amber-500/10'
                        : 'border-gray-100/50 bg-white/50 hover:border-amber-200/50 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${tab.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                      >
                        <Icon
                          size={22}
                          className="text-white"
                        />
                      </div>
                      <span
                        className={`text-lg font-black transition-colors duration-300 ${
                          isActive ? 'text-amber-700' : 'text-gov-900 group-hover:text-amber-700'
                        }`}
                      >
                        {tab.label}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{tab.content}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================================================ */}
        {/* 3. مسيرة التطور - تصميم زمني متقدم */}
        {/* ============================================================ */}

        {!hideRoadmap && (
          <ScrollReveal delay={150}>
            <div className="mb-16">
              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg">
                  <Clock
                    size={20}
                    className="text-white"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gov-900">
                  مسيرة التطور المؤسسي
                </h3>
              </div>

              <div className="relative">
                {/* الخط الزمني */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-amber-400/50 via-amber-500/50 to-amber-400/50 -translate-x-1/2" />

                <div className="space-y-12">
                  {EVOLUTION_DATA.map((item, idx) => (
                    <TimelineCard
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

        {/* ============================================================ */}
        {/* 4. الخدمات المؤسسية - شبكة متطورة */}
        {/* ============================================================ */}

        <ScrollReveal delay={200}>
          <div className="mb-16">
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Grid3x3
                  size={20}
                  className="text-white"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gov-900">خدماتنا للمجتمع</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {SERVICES_DATA.map((service, idx) => (
                <PremiumServiceCard
                  key={service.id}
                  service={service}
                  onOpenModal={handleOpenModal}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================================================ */}
        {/* 5. أثرنا بالأرقام - بطاقات إحصائية متطورة */}
        {/* ============================================================ */}

        <ScrollReveal delay={250}>
          <div className="relative bg-gradient-to-br from-gov-900 via-gov-950 to-black rounded-[2.5rem] p-10 md:p-14 shadow-2xl overflow-hidden mb-16">
            {/* خلفية زخرفية */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(245,158,11,0.15) 0%, transparent 60%),
                    radial-gradient(circle at 80% 50%, rgba(59,130,246,0.1) 0%, transparent 60%)
                  `,
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg">
                  <TrendingUp
                    size={20}
                    className="text-white"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white">
                  أثرنا في المجتمع بالأرقام
                </h3>
              </div>
              <p className="text-amber-200/80 text-center mb-10 max-w-2xl mx-auto text-base font-medium">
                مؤشرات أداء تعكس قيمة خدماتنا للمواطن والمجتمع
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        {/* ============================================================ */}
        {/* 6. نافذة الخدمة المنبثقة */}
        {/* ============================================================ */}

        <ServiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          serviceName={selectedService?.name}
          serviceId={`خدمة-${selectedService?.id}`}
          variant="premium"
          onNavigate={onNavigate}
        >
          {selectedService && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-2xl p-6 border border-amber-200/30">
                <p className="text-gray-700 text-base leading-relaxed">
                  {selectedService.description}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-gov-800 text-base mb-4 flex items-center gap-2">
                  <CheckCircle2
                    size={18}
                    className="text-amber-500"
                  />
                  ما نقدمه لك في هذه الخدمة:
                </h4>
                <ul className="space-y-3">
                  {selectedService.outcomes.map((outcome, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </ServiceModal>

        {/* ============================================================ */}
        {/* 7. رابط التصفح */}
        {/* ============================================================ */}

        <ScrollReveal delay={300}>
          <div className="text-center">
            <button
              onClick={() => onNavigate('about')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-black shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-500"
            >
              <Building2
                size={20}
                className="group-hover:rotate-12 transition-transform duration-500"
              />
              <span>تعرف أكثر عن المكتب</span>
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"
              />
            </button>
          </div>
        </ScrollReveal>
      </div>

      {/* ============================================================ */}
      {/* 8. أنماط CSS المخصصة للرسوم المتحركة */}
      {/* ============================================================ */}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes float-particle {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(var(--tx, 100px), var(--ty, -100px)) scale(1); opacity: 0; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 15s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
    </section>
  );
});

export default AboutOfficeSection;
