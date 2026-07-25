// ============================================================
// HeroSectionNew.tsx - القسم الرئيسي الاحترافي (Government Digital Experience Level)
// توزيع بصري واضح: عنوان رئيسي - وصف داعم - زر إجراء
// مكتب الأشغال العامة والطرق - محافظة ذمار
// ============================================================

import { memo, useCallback, useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  HardHat,
  Calendar,
  Phone,
  Mail,
  Shield,
  Award,
  Clock,
  MapPin,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import type { Page } from '../../../types/page';

interface HeroSectionProps {
  onNavigate: (page: Page) => void;
}

const OFFICE_DATA = {
  fullName: 'مكتب الأشغال العامة والطرق',
  governorate: 'محافظة ذمار',
  slogan: 'نحو بنية تحتية مستدامة وتنمية عمرانية شاملة',
  phone: '06-521222',
  email: 'dpw.dhamar@yemen.gov.ye',
  workingDays: 'السبت - الأربعاء',
  workingHours: '8:00 صباحاً - 2:00 مساءً',
};

// الإحصائيات الرئيسية - مبسطة
const MAIN_STATS = [
  { value: '2,274', label: 'رخصة بناء', color: 'from-emerald-600 to-green-700' },
  { value: '320', label: 'موظف وفني', color: 'from-blue-600 to-indigo-700' },
  { value: '283,240', label: 'متر مربع طرق', color: 'from-violet-600 to-purple-700' },
  { value: '16', label: 'مديرية مغطاة', color: 'from-amber-600 to-orange-700' },
];

// القيم الأساسية - 4 قيم رئيسية فقط
const CORE_VALUES = [
  { icon: Shield, title: 'النزاهة والشفافية', description: 'أعلى معايير النزاهة في المعاملات' },
  { icon: HardHat, title: 'الجودة والتميز', description: 'الريادة في الخدمات الهندسية' },
  { icon: Award, title: 'الخدمة المجتمعية', description: 'ضيفنا مواطننا في مركز اهتمامنا' },
  { icon: Clock, title: 'التحول الرقمي', description: 'خدمات رقمية متطورة' },
];

// ============================================================
// AnimatedLogo - صورة محسّنة بتأثيرات ديناميكية
// ============================================================
const AnimatedLogo = memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mx-auto select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* طبقة الظل الخارجية */}
      <div
        className={`
        absolute -inset-6 rounded-full transition-all duration-700
        ${
          isHovered
            ? 'bg-gradient-to-br from-gold-500/30 via-gold-400/20 to-gold-600/30 blur-3xl scale-110'
            : 'bg-gradient-to-br from-gold-500/15 to-gold-600/15 blur-2xl scale-100'
        }
      `}
      />

      {/* إطار دائري احترافي */}
      <div
        className={`
        relative w-full h-full rounded-full overflow-hidden
        border-[4px] border-gold-500/40 shadow-2xl
        transition-all duration-500
        ${isHovered ? 'scale-[1.06] shadow-gold-500/40' : 'scale-100'}
      `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />

        {!logoError ? (
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img
              src="/images/office-building.png"
              alt="مبنى مكتب الأشغال العامة والطرق - محافظة ذمار"
              className="w-full h-full object-cover"
              style={{
                filter: 'contrast(1.05) saturate(1.1) brightness(1.02)',
              }}
              onError={() => setLogoError(true)}
            />
            {/* طبقة Overlay خفيفة لتحسين القراءة */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-600">
            <Shield
              size={80}
              className="text-white"
            />
          </div>
        )}

        {/* لمعان ديناميكي */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent
          transition-all duration-1000 rounded-full
          ${isHovered ? 'translate-x-full' : '-translate-x-full'}
        `}
        />

        {/* شارة التحقق */}
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-xl">
          <Shield
            size={20}
            className="text-white"
          />
        </div>

        {/* شارة النصب */}
        <div className="absolute -top-2 -left-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-xl border border-gold-200">
          <div className="text-gov-900 font-black text-sm">منذ 1979</div>
          <div className="text-gold-600 text-[10px] font-bold">45+ عام</div>
        </div>
      </div>
    </div>
  );
});

AnimatedLogo.displayName = 'AnimatedLogo';

// ============================================================
// HeroSection الاحترافي
// ============================================================
const HeroSectionNew = memo(function HeroSectionNew({ onNavigate }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  // تأثيرات الظهور
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // تحديث الوقت والتاريخ
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-YE', {
          timeZone: 'Asia/Aden',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      );
      setCurrentDate(
        now.toLocaleDateString('ar-YE', {
          timeZone: 'Asia/Aden',
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }),
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        relative min-h-[90vh] lg:min-h-[80vh] flex items-center overflow-hidden
        bg-gradient-to-br from-[#0a1628] via-[#0f1f38] to-[#0a1628]
        transition-all duration-1000
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      aria-label="القسم الرئيسي - مكتب الأشغال العامة والطرق بمحافظة ذمار"
      dir="rtl"
    >
      {/* خلفية بصرية محسّنة */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gov-950/90 via-gov-900/80 to-gov-950/90" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
            linear-gradient(to right, #d4af37 1px, transparent 1px),
            linear-gradient(to bottom, #d4af37 1px, transparent 1px)
          `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* شريط المعلومات العلوي الخفيف */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="bg-black/30 backdrop-blur-lg border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/60 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock
                  size={12}
                  className="text-gold-400"
                />
                <span className="font-mono">{currentTime || '--:--'}</span>
              </div>
              <span className="hidden sm:inline text-white/20">|</span>
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={12}
                  className="text-gold-400"
                />
                <span>{currentDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${OFFICE_DATA.phone}`}
                className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
              >
                <Phone
                  size={12}
                  className="text-gold-400"
                />
                <span>{OFFICE_DATA.phone}</span>
              </a>
              <span className="text-white/20">|</span>
              <a
                href={`mailto:${OFFICE_DATA.email}`}
                className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
              >
                <Mail
                  size={12}
                  className="text-gold-400"
                />
                <span className="text-[11px]">{OFFICE_DATA.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي - Grid واضح */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* العمود النصي - يمين الشاشة (RTL) */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-right">
            {/* الشعار النصي الصغير */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-gradient-to-l from-gold-500/15 to-gold-600/10 backdrop-blur-xl border border-gold-400/20 rounded-full px-4 py-2 shadow-lg">
                <Shield
                  size={16}
                  className="text-gold-400"
                />
                <span className="text-xs font-bold text-white tracking-wider">
                  البوابة الإلكترونية الرسمية
                </span>
              </div>
            </ScrollReveal>

            {/* العنوان الرئيسي - كبير ومؤثر */}
            <ScrollReveal delay={150}>
              <div className="space-y-4">
                <h1 className="typography-h1 text-white leading-tight">
                  <span className="block gold-text-gradient pb-1">مكتب الأشغال العامة والطرق</span>
                  <span className="block text-lg lg:text-2xl text-gold-300/80 font-semibold mt-2 flex items-center justify-center lg:justify-end gap-2">
                    <MapPin
                      size={20}
                      className="text-gold-400"
                    />
                    محافظة ذمار
                  </span>
                </h1>
                <p className="typography-body-lg text-white/70 max-w-2xl mx-auto lg:mr-auto leading-relaxed">
                  الجهة الحكومية الرسمية المخولة بتنظيم قطاع التشييد والبناء، وإصدار التراخيص
                  العمرانية، والإشراف على مشاريع الطرق والبنية التحتية في محافظة ذمار.
                </p>
              </div>
            </ScrollReveal>

            {/* الزر الرئيسي - واضح ومميز */}
            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <button
                  onClick={() => onNavigate('services')}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-l from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:via-gold-700 hover:to-gold-800 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-500 hover:scale-[1.02] shadow-2xl hover:shadow-gold-500/30 active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <HardHat
                    size={22}
                    className="relative z-10"
                  />
                  <span className="relative z-10 text-base">استعرض خدماتنا</span>
                  <ArrowLeft
                    size={18}
                    className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300"
                  />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="group relative inline-flex items-center justify-center gap-3 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-xl border-2 border-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-500 hover:scale-[1.02] shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  <span className="relative z-10 text-base">تعرف على المكتب</span>
                  <ArrowLeft
                    size={18}
                    className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>
            </ScrollReveal>

            {/* القيم الأساسية - 4 قيم مبسطة */}
            <ScrollReveal delay={400}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                {CORE_VALUES.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-center hover:bg-white/[0.06] transition-all duration-300 group"
                    >
                      <Icon
                        size={20}
                        className="text-gold-400 mx-auto mb-2 group-hover:scale-110 transition-transform"
                      />
                      <div className="text-white/80 text-xs font-bold">{value.title}</div>
                      <div className="text-white/50 text-[10px] mt-1">{value.description}</div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* الصورة الرئيسية - عمودية (ليس جانبية) */}
          <div className="flex items-center justify-center relative">
            <AnimatedLogo />
          </div>
        </div>

        {/* الإحصائيات السريعة - مبسطة */}
        <ScrollReveal delay={500}>
          <div className="mt-12 lg:mt-16">
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl max-w-4xl mx-auto lg:mx-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {MAIN_STATS.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center group"
                  >
                    <div
                      className={`w-12 h-12 lg:w-14 lg:h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white text-xl lg:text-2xl font-black">{stat.value}</div>
                    </div>
                    <div className="text-white/80 text-sm lg:text-base font-bold">{stat.label}</div>
                    <div className="text-white/50 text-xs mt-1">خلال العام الحالي</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* مؤشر التمرير للأسفل */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="flex flex-col items-center gap-2 group"
          aria-label="استكشاف المزيد"
        >
          <span className="text-xs text-white/60 font-medium group-hover:text-gold-400 transition-colors">
            اكتشف خدماتنا
          </span>
          <div className="w-8 h-8 border-2 border-white/30 group-hover:border-gold-400 rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft
              size={14}
              className="text-white/60 group-hover:text-gold-400 rotate-90 transition-colors"
            />
          </div>
        </button>
      </div>
    </section>
  );
});

HeroSectionNew.displayName = 'HeroSectionNew';
export default HeroSectionNew;
