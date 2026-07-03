// ============================================================
// ContactCTASection.tsx - محطة الخدمة الهندسية الذكية (Pro v3.0)
// مصمم خصيصًا لمكتب الأشغال العامة والطرق
// ============================================================

import { memo, useMemo } from 'react';
import {
  Phone,
  MessageCircle,
  HeadphonesIcon,
  Smartphone,
  HardHat,
  ClipboardCheck,
  MapPin,
  Clock,
  AlertTriangle,
  Printer,
  Search,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import type { Page } from '../../../types/page';

// ============================================================
// 1. أنواع البيانات المتخصصة (Specialized Types)
// ============================================================

export type ServiceAction = 'track' | 'print' | 'consult' | 'report' | 'inspection';

export interface ContactCTASectionProps {
  /** دالة التنقل */
  onNavigate: (page: Page) => void;
  /** الصفحة الحالية (لتجنب عرض الزر إذا كنا بالفعل في صفحة التواصل) */
  currentPage?: Page;
  /** نوع التصميم (engineering / emergency / default) */
  variant?: 'engineering' | 'emergency' | 'default';
  /** رقم الهاتف (قابل للتخصيص) */
  phoneNumber?: string;
  /** رقم واتساب (قابل للتخصيص) */
  whatsappNumber?: string;
  /** عنوان المكتب (للعرض في البطاقة) */
  officeAddress?: string;
  /** ساعات العمل */
  workingHours?: string;
  /** العنوان الرئيسي */
  title?: string;
  /** النص الفرعي */
  subtitle?: string;
  /** هل تريد إظهار أزرار الخدمات السريعة؟ */
  showQuickServices?: boolean;
  /** إخفاء الشعار */
  hideLogo?: boolean;
  /** إخفاء المعلومات الإضافية (العنوان والساعات) */
  hideInfo?: boolean;
  /** فئات CSS إضافية */
  className?: string;
}

// ============================================================
// 2. المكون الرئيسي (Main Component)
// ============================================================

const ContactCTASection = memo(function ContactCTASection({
  onNavigate,
  currentPage = 'home',
  variant = 'engineering',
  phoneNumber = '777-888-198',
  whatsappNumber = '777-888-198',
  officeAddress = ' شارع الحسينية جوار مكتب الجمارك ',
  workingHours = 'السبت - الأربعاء: 8:00 ص - 3:00 م',
  title = 'هل تحتاج مساعدة هندسية؟',
  subtitle = 'فريق المهندسين والفنيين في مكتب الأشغال جاهز لخدمتك',
  showQuickServices = true,
  hideLogo = false,
  hideInfo = false,
  className = '',
}: ContactCTASectionProps) {
  // ============================================================
  // 2.1. التحقق من السياق (Context Check)
  // ============================================================

  const isOnContactPage = useMemo(() => currentPage === 'contact', [currentPage]);

  // ============================================================
  // 2.2. الكشف عن الجهاز (Device Detection)
  // ============================================================

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
  }, []);

  // ============================================================
  // 2.3. تكوينات التصميم حسب النوع (Variant Configurations)
  // ============================================================

  const variantConfig = useMemo(() => {
    switch (variant) {
      case 'engineering':
        return {
          section: 'from-gov-900 via-gov-800 to-gov-900',
          card: 'bg-white/10 backdrop-blur-xl border-2 border-white/15',
          text: 'text-white',
          textMuted: 'text-white/80',
          iconGradient: 'from-gold-400 to-gold-600',
          accentColor: 'gold',
          buttonPrimary: 'from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700',
          buttonSecondary: 'border-2 border-white/30 hover:border-white/60',
        };
      case 'emergency':
        return {
          section: 'from-red-900 via-red-800 to-red-900',
          card: 'bg-white/10 backdrop-blur-xl border-2 border-red-500/40',
          text: 'text-white',
          textMuted: 'text-white/80',
          iconGradient: 'from-red-400 to-red-600',
          accentColor: 'red',
          buttonPrimary: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
          buttonSecondary: 'border-2 border-white/30 hover:border-white/60',
        };
      default:
        return {
          section: 'from-gov-800 via-gov-900 to-gov-800',
          card: 'bg-white/10 backdrop-blur-xl border-2 border-white/15',
          text: 'text-white',
          textMuted: 'text-white/80',
          iconGradient: 'from-gold-400 to-gold-600',
          accentColor: 'gold',
          buttonPrimary: 'from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700',
          buttonSecondary: 'border-2 border-white/30 hover:border-white/60',
        };
    }
  }, [variant]);

  // ============================================================
  // 2.4. دوال معالجة الخدمات السريعة (Quick Service Handlers)
  // ============================================================

  const handleQuickService = (action: ServiceAction) => {
    switch (action) {
      case 'track':
        onNavigate('track');
        break;
      case 'print':
        onNavigate('forms');
        break;
      case 'consult':
        onNavigate('services');
        break;
      case 'report':
        onNavigate('contact');
        break;
      case 'inspection':
        onNavigate('services');
        break;
    }
  };

  // ============================================================
  // 2.5. التصيير (Rendering)
  // ============================================================

  return (
    <section
      className={`py-24 bg-gradient-to-br ${variantConfig.section} relative overflow-hidden ${className}`}
      aria-label="مركز خدمة الجمهور - مكتب الأشغال"
    >
      {/* ===== خلفية متدرجة ===== */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ===== صورة الخلفية ===== */}
      <div className="absolute inset-0">
        <img
          src="/vite.svg"
          alt=""
          className="w-full h-full object-cover opacity-5"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gov-800/90 via-gov-900/85 to-gov-800/90" />
      </div>

      {/* ===== عناصر زخرفية ===== */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute -bottom-40 left-1/4 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* ===== المحتوى الرئيسي ===== */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <div
            className={`relative ${variantConfig.card} rounded-[2.5rem] p-12 md:p-16 shadow-2xl overflow-hidden`}
          >
            {/* زخرفة داخلية */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              {/* الشعار */}
              {!hideLogo && (
                <div className="inline-flex items-center justify-center mb-6">
                  <div className="relative w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl p-2 ring-2 ring-gold-500/30">
                    <div
                      className="w-full h-full rounded-2xl bg-gold-100/50"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              )}

              {/* الأيقونة الرئيسية */}
              <div
                className={`w-20 h-20 bg-gradient-to-br ${variantConfig.iconGradient} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl`}
              >
                {variant === 'emergency' ? (
                  <AlertTriangle
                    size={36}
                    className="text-white"
                  />
                ) : (
                  <HeadphonesIcon
                    size={36}
                    className="text-white"
                  />
                )}
              </div>

              {/* النصوص */}
              <h2 className={`text-4xl md:text-5xl font-black ${variantConfig.text} mb-5`}>
                {title}
              </h2>
              <p
                className={`${variantConfig.textMuted} mb-10 text-lg md:text-xl max-w-2xl mx-auto`}
              >
                {subtitle}
              </p>

              {/* ===== الخدمات السريعة (Quick Engineering Services) ===== */}
              {showQuickServices && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-3xl mx-auto">
                  <button
                    onClick={() => handleQuickService('track')}
                    className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-white transition-all border border-white/10 hover:border-white/30"
                  >
                    <Search
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs md:text-sm font-medium">تتبع معاملة</span>
                  </button>
                  <button
                    onClick={() => handleQuickService('print')}
                    className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-white transition-all border border-white/10 hover:border-white/30"
                  >
                    <Printer
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs md:text-sm font-medium">طباعة نموذج</span>
                  </button>
                  <button
                    onClick={() => handleQuickService('consult')}
                    className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-white transition-all border border-white/10 hover:border-white/30"
                  >
                    <ClipboardCheck
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs md:text-sm font-medium">استشارة فنية</span>
                  </button>
                  <button
                    onClick={() => handleQuickService('report')}
                    className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-white transition-all border border-white/10 hover:border-white/30"
                  >
                    <AlertTriangle
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs md:text-sm font-medium">بلاغ عاجل</span>
                  </button>
                </div>
              )}

              {/* ===== أزرار الاتصال ===== */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`tel:+967${phoneNumber}`}
                  className={`group inline-flex items-center gap-3 bg-gradient-to-r ${variantConfig.buttonPrimary} text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95`}
                >
                  <Phone
                    size={22}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  <span>{phoneNumber}</span>
                </a>

                {isMobile && whatsappNumber && (
                  <a
                    href={`https://wa.me/+967${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-3 ${variantConfig.buttonSecondary} text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`}
                  >
                    <Smartphone
                      size={22}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>واتساب</span>
                  </a>
                )}

                {!isOnContactPage && (
                  <button
                    onClick={() => onNavigate('contact')}
                    className={`group inline-flex items-center gap-3 ${variantConfig.buttonSecondary} text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`}
                  >
                    <MessageCircle
                      size={22}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>تواصل معنا</span>
                  </button>
                )}
              </div>

              {/* ===== معلومات المكتب ===== */}
              {!hideInfo && (
                <div className="mt-8 pt-8 border-t border-white/10 text-white/70 text-sm flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      className="text-gold-400"
                    />
                    <span>{officeAddress}</span>
                  </div>
                  <span className="hidden sm:inline text-white/20">|</span>
                  <div className="flex items-center gap-2">
                    <Clock
                      size={16}
                      className="text-gold-400"
                    />
                    <span>{workingHours}</span>
                  </div>
                  <span className="hidden sm:inline text-white/20">|</span>
                  <div className="flex items-center gap-2">
                    <HardHat
                      size={16}
                      className="text-gold-400"
                    />
                    <span>الإشراف: م. هايل البحري</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

// ============================================================
// 3. تصدير الكل (Exports)
// ============================================================

export default ContactCTASection;
