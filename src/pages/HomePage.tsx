import { useMemo, useCallback, lazy, Suspense, useEffect, useState, useRef, memo } from 'react';
import {
  ChevronUp,
  Shield,
  Scale,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ArrowUpRight,
  ArrowLeft,
  Flag,
  Award as AwardIcon,
  Calendar,
  Globe,
  HardHat,
  CheckCircle,
  BookOpen,
  Trees,
  Users,
  TrendingUp,
  Minimize2,
  Maximize2,
  Award,
} from 'lucide-react';
import HomePageLogo from '../components/HomePageLogo';
import HeroSection from './home/sections/HeroSection';
import DhamarMap from '../components/DhamarMap';
import type { AwarenessContent } from './home/homeData';

const AboutOfficeSection = lazy(() => import('./home/sections/AboutOfficeSection'));

const ServicesSection = lazy(() => import('./home/sections/ServicesSection'));

const AnnouncementsSection = lazy(() => import('./home/sections/AnnouncementsSection'));
const FAQSection = lazy(() => import('./home/sections/FAQSection'));
const ContactCTASection = lazy(() => import('./home/sections/ContactCTASection'));

import {
  FALLBACK_SERVICES as SERVICES_DATA,
  FALLBACK_ANNOUNCEMENTS as ANNOUNCEMENTS_DATA,
  FALLBACK_FAQS as FAQS_DATA,
  FALLBACK_STATS as STATS_DATA,
  FALLBACK_QUICK_LINKS as QUICK_LINKS_DATA,
  FALLBACK_AWARENESS,
  getAwarenessByCategory,
  getFeaturedAwareness,
} from './home/homeData';

const SITE_CONFIG = {
  fullName: 'مكتب الأشغال العامة والطرق',
  shortName: 'مكتب الأشغال',
  governorate: 'محافظة ذمار',
  country: 'الجمهورية اليمنية',
  ministry: 'وزارة الأشغال العامة والطرق',
  authority: 'السلطة المحلية',
  description:
    'الجهة الحكومية الرسمية المخولة بتنظيم قطاع التشييد والبناء، وإصدار التراخيص العمرانية، والإشراف على مشاريع الطرق والبنية التحتية في محافظة ذمار وفقاً للقوانين واللوائح النافذة',
  legalReferences: [
    'قانون البناء رقم (19) لسنة 2002م',
    'قانون التخطيط الحضري رقم (20) لسنة 1995م',
    'اللائحة التنفيذية لقانون البناء',
  ],
  contact: {
    phone: '06-521222',
    fax: '06-521223',
    email: 'dpw.dhamar@yemen.gov.ye',
    address: 'مدينة ذمار - شارع الجامعة',
    poBox: 'ص.ب 88',
    workingDays: 'السبت - الأربعاء',
    workingHours: '8:00 صباحاً - 2:00 مساءً',
  },
  officialLinks: {
    lawsPortal: 'http://agoyemen.net/',
    nationalInfoCenter: 'http://yemen-nic.info/',
    ministryPortal: '#',
  },
  version: '5.0.0',
  year: new Date().getFullYear(),
  developer: 'فريق التطوير - مكتب الأشغال العامة والطرق',
};

const SectionLoader = memo(
  ({ message = 'جاري التحميل...', showLogo = true }: { message?: string; showLogo?: boolean }) => (
    <div
      className="flex flex-col items-center justify-center py-32"
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل المحتوى"
    >
      <div className="relative">
        <div className="w-24 h-24 border-4 border-gray-200 border-t-gold-500 rounded-full animate-spin" />
        {showLogo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full border-2 border-gold-400/50 bg-white/10 shadow-lg"
              aria-hidden="true"
            />
          </div>
        )}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-ping" />
        <div
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-gold-500 rounded-full animate-ping"
          style={{ animationDelay: '0.5s' }}
        />
      </div>
      <p className="mt-8 text-gray-500 text-sm font-medium animate-pulse">{message}</p>
      <p className="mt-1 text-gray-400 text-xs">
        {SITE_CONFIG.fullName} - {SITE_CONFIG.governorate}
      </p>
    </div>
  ),
);
SectionLoader.displayName = 'SectionLoader';

const OfficialStatusBar = memo(() => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentHijriDate, setCurrentHijriDate] = useState('');
  const [isOnline, setIsOnline] = useState(
    typeof globalThis !== 'undefined' && 'navigator' in globalThis
      ? globalThis.navigator.onLine
      : true,
  );

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-YE', {
          timeZone: 'Asia/Aden',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
      );
      setCurrentDate(
        now.toLocaleDateString('ar-YE', {
          timeZone: 'Asia/Aden',
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      );
      try {
        setCurrentHijriDate(
          new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
            timeZone: 'Asia/Aden',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(now),
        );
      } catch {
        setCurrentHijriDate('');
      }
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    globalThis.addEventListener('online', handleOnline);
    globalThis.addEventListener('offline', handleOffline);
    return () => {
      clearInterval(interval);
      globalThis.removeEventListener('online', handleOnline);
      globalThis.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className="bg-gradient-to-r from-gov-950 via-gov-900 to-gov-950 border-b border-gold-500/20 py-2 px-4 hidden lg:block"
      aria-label="شريط المعلومات الرسمي"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[10px] text-white/60">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Shield
              size={10}
              className="text-gold-400"
              aria-hidden="true"
            />
            <span className="font-medium">{SITE_CONFIG.ministry}</span>
          </div>
          <span
            className="w-px h-3 bg-white/10"
            aria-hidden="true"
          />
          <div className="flex items-center gap-1.5">
            <Scale
              size={10}
              className="text-gold-400"
              aria-hidden="true"
            />
            <span>{SITE_CONFIG.legalReferences[0]}</span>
          </div>
          <span
            className="w-px h-3 bg-white/10"
            aria-hidden="true"
          />
          <div className="flex items-center gap-1.5">
            <Flag
              size={10}
              className="text-gold-400"
              aria-hidden="true"
            />
            <span>
              {SITE_CONFIG.country} - {SITE_CONFIG.governorate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <output
              className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
              aria-label={isOnline ? 'النظام متصل' : 'النظام غير متصل'}
            />
            <span>{isOnline ? 'النظام متصل' : 'النظام غير متصل'}</span>
          </div>
          <span
            className="w-px h-3 bg-white/10"
            aria-hidden="true"
          />
          <div className="flex items-center gap-1.5">
            <AwardIcon
              size={10}
              className="text-gold-400"
              aria-hidden="true"
            />
            <span>خدمات حكومية موثوقة</span>
          </div>
          <span
            className="w-px h-3 bg-white/10"
            aria-hidden="true"
          />
          <div className="flex items-center gap-1.5">
            <Calendar
              size={10}
              className="text-gold-400"
              aria-hidden="true"
            />
            <span>{currentDate}</span>
          </div>
          {currentHijriDate && (
            <>
              <span
                className="w-px h-3 bg-white/10"
                aria-hidden="true"
              />
              <span className="text-white/40">{currentHijriDate}</span>
            </>
          )}
          <span
            className="w-px h-3 bg-white/10"
            aria-hidden="true"
          />
          <div className="flex items-center gap-1.5 font-mono">
            <Clock
              size={10}
              className="text-gold-400"
              aria-hidden="true"
            />
            <span className="text-white/80 tabular-nums">{currentTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
OfficialStatusBar.displayName = 'OfficialStatusBar';

const ScrollToTopButton = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollY = globalThis.scrollY;
        const docHeight = document.documentElement.scrollHeight - globalThis.innerHeight;
        const calculatedProgress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        setIsVisible(scrollY > 500);
        setProgress(Math.min(calculatedProgress, 100));
      }, 50);
    };
    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      globalThis.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 left-8 z-50 group"
      aria-label="العودة إلى أعلى الصفحة"
    >
      <div className="relative">
        <svg
          className="w-14 h-14 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${progress * 1.5} 150`}
            className="text-gold-500 transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-gov-700 to-gov-800 hover:from-gov-800 hover:to-gov-900 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center">
            <ChevronUp
              size={20}
              className="group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            />
          </div>
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-ping" />
      </div>
    </button>
  );
});
ScrollToTopButton.displayName = 'ScrollToTopButton';

interface HomePageProps {
  readonly onNavigate: (page: string) => void;
  readonly onThemeToggle?: () => void;
  readonly theme?: 'light' | 'dark';
}

export default function HomePage({
  onNavigate,
  theme = 'light',
}: Omit<Readonly<HomePageProps>, 'onThemeToggle'>) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const services = useMemo(() => SERVICES_DATA, []);
  const announcements = useMemo(() => ANNOUNCEMENTS_DATA, []);
  const faqs = useMemo(() => FAQS_DATA, []);
  const stats = useMemo(() => STATS_DATA, []);
  const quickLinks = useMemo(() => QUICK_LINKS_DATA, []);

  const handleNavigatePage = useCallback(
    (page: string) => {
      onNavigate(page);
    },
    [onNavigate],
  );

  useEffect(() => {
    document.title = `${SITE_CONFIG.fullName} - ${SITE_CONFIG.governorate} | البوابة الإلكترونية الرسمية`;
    const metaUpdates: Record<string, string> = {
      'description': `${SITE_CONFIG.description}. الدوام الرسمي: ${SITE_CONFIG.contact.workingDays} من ${SITE_CONFIG.contact.workingHours}. ${SITE_CONFIG.contact.phone}`,
      'keywords':
        'مكتب الأشغال, تراخيص البناء, الخدمات الهندسية, الرقابة العمرانية, البنية التحتية, ذمار, اليمن, وزارة الأشغال العامة والطرق, رخص البناء, مخططات عمرانية',
      'og:title': `${SITE_CONFIG.fullName} - ${SITE_CONFIG.governorate} | الموقع الرسمي`,
      'og:description': SITE_CONFIG.description,
      'og:type': 'website',
      'og:site_name': SITE_CONFIG.fullName,
      'og:locale': 'ar_YE',
      'og:image': '/images/og-image.jpg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:url': globalThis.location.href,
      'twitter:card': 'summary_large_image',
      'twitter:title': `${SITE_CONFIG.fullName} - ${SITE_CONFIG.governorate}`,
      'twitter:description': SITE_CONFIG.description,
      'twitter:image': '/images/twitter-image.jpg',
    };

    Object.entries(metaUpdates).forEach(([name, content]) => {
      const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      const element = document.querySelector(selector);
      if (element) element.setAttribute('content', content);
    });

    let baseElement = document.querySelector('link[rel="canonical"]');
    if (!baseElement) {
      baseElement = document.createElement('link');
      baseElement.setAttribute('rel', 'canonical');
      document.head.appendChild(baseElement);
    }
    baseElement.setAttribute('href', globalThis.location.href);

    const faqScriptId = 'structured-faq-schema';
    let faqScript = document.getElementById(faqScriptId) as HTMLScriptElement | null;
    if (!faqScript) {
      faqScript = document.createElement('script');
      faqScript.id = faqScriptId;
      faqScript.type = 'application/ld+json';
      document.head.appendChild(faqScript);
    }
    faqScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.slice(0, 12).map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer },
      })),
    });

    setIsLoaded(true);
    return () => {
      document.title = SITE_CONFIG.fullName;
      const oldScript = document.getElementById('structured-faq-schema');
      if (oldScript) oldScript.remove();
    };
  }, [faqs]);

  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <main
      ref={mainRef}
      className={`min-h-screen ${bgClass} transition-colors duration-300 ${isLoaded ? 'page-enter' : ''}`}
      aria-label={`الصفحة الرئيسية - ${SITE_CONFIG.fullName} - ${SITE_CONFIG.governorate}`}
      dir="rtl"
    >
      <OfficialStatusBar />
      <HeroSection
        onNavigate={handleNavigatePage}
      />
      <Suspense fallback={<SectionLoader message="جاري تحميل نبذة عن المكتب..." />}>
        <AboutOfficeSection
          onNavigate={handleNavigatePage}
          stats={stats}
          theme={theme}
        />
      </Suspense>
      <Suspense fallback={<SectionLoader message="جاري تحميل الروابط السريعة..." />}>
        <QuickLinksSection
          links={quickLinks}
          onNavigate={handleNavigatePage}
          theme={theme}
        />
      </Suspense>
      <MapHighlightSection />
      <Suspense fallback={<SectionLoader message="جاري تحميل الخدمات..." />}>
        <ServicesSection
          services={services}
          onNavigate={handleNavigatePage}
          theme={theme}
          title="خدماتنا الهندسية والفنية"
          subtitle="نقدم مجموعة متكاملة من الخدمات وفق أحدث المعايير واللوائح النافذة"
        />
      </Suspense>
      <Suspense fallback={<SectionLoader message="جاري تحميل المحتوى التوعوي والارشادي..." />}>
        <AdvancedAwarenessSection theme={theme} />
      </Suspense>
      <Suspense fallback={<SectionLoader message="جاري تحميل الإعلانات..." />}>
        <AnnouncementsSection
          announcements={announcements}
          onNavigate={handleNavigatePage}
          theme={theme}
          title="آخر الإعلانات والمستجدات"
          subtitle="تابع أحدث الأخبار والإعلانات الرسمية من المكتب"
          showViewAll
          autoSlide
          slideInterval={5000}
        />
      </Suspense>
      <Suspense fallback={<SectionLoader message="جاري تحميل الأسئلة الشائعة..." />}>
        <FAQSection
          faqs={faqs}
          theme={theme}
          title="الأسئلة الشائعة"
          subtitle="إجابات واضحة على أكثر الأسئلة تداولاً من قبل المواطنين"
          showAllLink
        />
      </Suspense>
      <Suspense fallback={<SectionLoader message="جاري تحميل معلومات التواصل..." />}>
        <ContactCTASection
          onNavigate={handleNavigatePage}
          theme={theme}
        />
      </Suspense>
      <Suspense
        fallback={
          <SectionLoader
            message="جاري تحميل التذييل..."
            showLogo={false}
          />
        }
      >
        <FooterSection
          onNavigate={handleNavigatePage}
          theme={theme}
        />
      </Suspense>
      <ScrollToTopButton />
    </main>
  );
}

const QuickLinksSection = memo(
  ({
    links,
    onNavigate,
    theme,
  }: {
    links: typeof QUICK_LINKS_DATA;
    onNavigate: (page: string) => void;
    theme?: 'light' | 'dark';
  }) => {
    if (!links.length) return null;
    const bgClass = theme === 'dark' ? 'bg-gray-800/50' : 'bg-white';
    const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-100';
    const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';

    return (
      <section
        className={`py-16 lg:py-20 ${bgClass} border-b ${borderClass} relative overflow-hidden`}
        aria-label="روابط سريعة للخدمات"
      >
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">روابط سريعة</h2>
            <p className="text-gray-500 text-sm lg:text-base max-w-2xl mx-auto">
              وصول مباشر إلى أهم الخدمات والإجراءات الهندسية
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.href)}
                  className={`group p-5 lg:p-6 rounded-2xl border ${borderClass} bg-gradient-to-br ${theme === 'dark' ? 'from-gray-800 to-gray-800/50' : 'from-white to-gray-50'} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div
                    className={`relative w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${link.color} rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}
                  >
                    <Icon
                      size={24}
                      className="text-white"
                    />
                  </div>
                  <h3
                    className={`relative text-sm font-bold text-center ${textClass} group-hover:text-gold-600 transition-colors`}
                  >
                    {link.title}
                  </h3>
                  <p className="relative text-xs text-center mt-1.5 leading-relaxed">
                    {link.description}
                  </p>
                  <div className="relative mt-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gold-500 font-medium flex items-center gap-1">
                      انتقال <ArrowUpRight size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);
QuickLinksSection.displayName = 'QuickLinksSection';

const AdvancedAwarenessSection = memo(({ theme }: { theme?: 'light' | 'dark' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleItems, setVisibleItems] = useState<number>(3);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const allAwareness = useMemo<AwarenessContent[]>(() => FALLBACK_AWARENESS, []);

  const filteredAwareness = useMemo<AwarenessContent[]>(() => {
    if (selectedCategory === 'all') return allAwareness;
    return getAwarenessByCategory(selectedCategory as AwarenessContent['category'], allAwareness);
  }, [selectedCategory, allAwareness]);

  const displayedAwareness = filteredAwareness.slice(0, visibleItems);

  const categoryLabels: Record<string, string> = {
    all: 'الكل',
    safety: 'السلامة المهنية',
    quality: 'الجودة الإنشائية',
    environment: 'البيئة العمرانية',
    legal: 'الإطار القانوني',
    community: 'المشاركة المجتمعية',
  };

  const categoryIcons: Record<string, React.ElementType> = {
    all: BookOpen,
    safety: HardHat,
    quality: CheckCircle,
    environment: Trees,
    legal: Scale,
    community: Users,
  };

  const toggleCardExpand = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className={`py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : ''}`}
      aria-label="المحتوى التوعوي والارشادي الهندسي"
    >
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gov-50 border border-gov-100 px-4 py-2 rounded-full mb-4">
            <BookOpen
              size={18}
              className="text-gov-600"
            />
            <span className="text-sm font-bold text-gov-700">مركز التوعية والارشاد الهندسي</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">
            إرشادات وتوعية هندسية متخصصة
          </h2>
          <p className="text-gray-500 text-sm lg:text-base max-w-3xl mx-auto leading-relaxed">
            تعرف على أحدث الإرشادات والمعايير الهندسية المعتمدة لضمان سلامة وجودة المباني والمنشآت،
            وتعزيز الوعي المجتمعي بأهمية الالتزام باللوائح والضوابط الهندسية.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {allAwareness.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 text-center hover:shadow-lg transition-all"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon
                    size={24}
                    className="text-white"
                  />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {item.detailedInfo?.statistics?.[0]?.value || '--'}
                </div>
                <div className="text-xs text-gray-500">
                  {item.detailedInfo?.statistics?.[0]?.label || item.title}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const CategoryIcon = categoryIcons[key] || BookOpen;
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(key);
                  setVisibleItems(3);
                  setExpandedCard(null);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-gradient-to-r from-gov-600 to-gov-700 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:border-gov-300 hover:shadow-md'}`}
              >
                <CategoryIcon size={16} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAwareness.map((item, index) => {
            const Icon = item.icon;
            const isExpanded = expandedCard === item.id;
            const detailedInfo = item.detailedInfo;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`h-28 bg-gradient-to-br ${item.color} relative overflow-hidden cursor-pointer`}
                  onClick={() => toggleCardExpand(item.id)}
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('/vite.svg')] bg-cover bg-center" />
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <Icon
                      size={56}
                      className="text-white drop-shadow-lg"
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">
                      {item.category === 'safety'
                        ? 'سلامة'
                        : item.category === 'quality'
                          ? 'جودة'
                          : item.category === 'environment'
                            ? 'بيئة'
                            : item.category === 'legal'
                              ? 'قانوني'
                              : 'مجتمع'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-gov-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.description}</p>

                  <div className="space-y-2 mb-4">
                    <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                      <CheckCircle
                        size={12}
                        className="text-emerald-500"
                      />
                      نقاط رئيسية:
                    </h4>
                    {item.tips.slice(0, isExpanded ? item.tips.length : 3).map((tip, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>

                  {isExpanded && detailedInfo && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                      {detailedInfo.standards && (
                        <div>
                          <h4 className="text-xs font-bold text-gov-700 mb-2">
                            المعايير والاشتراطات:
                          </h4>
                          <ul className="space-y-1">
                            {detailedInfo.standards.map((standard, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-gray-600"
                              >
                                <Shield
                                  size={10}
                                  className="text-blue-500 mt-0.5 shrink-0"
                                />
                                <span>{standard}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {detailedInfo.benefits && (
                        <div>
                          <h4 className="text-xs font-bold text-emerald-700 mb-2">
                            الفوائد المرجوة:
                          </h4>
                          <ul className="space-y-1">
                            {detailedInfo.benefits.map((benefit, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-gray-600"
                              >
                                <TrendingUp
                                  size={10}
                                  className="text-emerald-500 mt-0.5 shrink-0"
                                />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {detailedInfo.statistics && (
                        <div className="grid grid-cols-3 gap-2">
                          {detailedInfo.statistics.map((stat, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 rounded-lg p-2 text-center"
                            >
                              <div className="text-sm font-bold text-gov-700">{stat.value}</div>
                              <div className="text-[10px] text-gray-500">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => toggleCardExpand(item.id)}
                    className="mt-4 w-full py-2 bg-gov-50 hover:bg-gov-100 text-gov-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
                    {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAwareness.length > visibleItems && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleItems((prev) => prev + 3)}
              className="px-8 py-3 bg-gradient-to-r from-gov-600 to-gov-700 hover:from-gov-700 hover:to-gov-800 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
            >
              <BookOpen size={18} />
              عرض المزيد من الإرشادات ({filteredAwareness.length - visibleItems} متبقي)
            </button>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gold-50 to-gold-100 border border-gold-200 px-6 py-4 rounded-2xl">
            <Award
              size={24}
              className="text-gold-600"
            />
            <div className="text-right">
              <div className="font-bold text-gold-800 text-sm">معاً نحو مدنية ذمار نموذجية</div>
              <div className="text-xs text-gold-600 mt-0.5">
                نحو مدينة ذمارية حديثة، منظمة، ومستدامة
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
AdvancedAwarenessSection.displayName = 'AdvancedAwarenessSection';

const MapHighlightSection = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
      aria-label="الموقع الجغرافي"
    >
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #1e3a8a 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gov-50 border border-gov-100 px-4 py-2 rounded-full mb-4">
            <MapPin
              size={18}
              className="text-gov-600"
            />
            <span className="text-sm font-bold text-gov-700">موقعنا الجغرافي</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
            زورونا في مقر المكتب
          </h2>
          <p className="text-gray-500 text-sm lg:text-base max-w-2xl mx-auto">
            يقع مكتب الأشغال العامة والطرق في قلب مدينة ذمار، ويسعدنا استقبالكم خلال ساعات العمل
            الرسمية
          </p>
        </div>
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gov-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gov-100 rounded-xl flex items-center justify-center">
                <MapPin
                  size={22}
                  className="text-gov-600"
                />
              </div>
              <div>
                <h3 className="font-bold text-gov-800">مكتب الأشغال العامة والطرق</h3>
                <p className="text-xs text-gray-500"> شارع الحسينية جوار مكتب الجمارك </p>
              </div>
            </div>
            <a
              href="https://www.google.com/maps?q=14.5425,44.3864"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gov-600 hover:text-gov-700 font-semibold flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200"
            >
              فتح في خرائط جوجل <ExternalLink size={14} />
            </a>
          </div>
          <div className="p-4">
            <DhamarMap
              compact={true}
              className="h-64 sm:h-80"
            />
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Clock
                  size={14}
                  className="text-gov-500"
                />
                <span>السبت - الأربعاء: 8:00 ص - 3:00 م</span>
              </div>
              <span className="hidden sm:inline text-gray-300">|</span>
              <div className="flex items-center gap-2">
                <Phone
                  size={14}
                  className="text-gov-500"
                />
                <a
                  href="tel:+967777888198"
                  className="hover:text-gov-600 transition-colors"
                >
                  777-888-198
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            انقر على الخريطة للتفاعل مع المعالم - استخدم أزرار التكبير للتنقل
          </p>
        </div>
      </div>
    </section>
  );
});
MapHighlightSection.displayName = 'MapHighlightSection';

const FooterSection = memo(
  ({
    onNavigate,
    onThemeToggle,
    theme,
  }: {
    onNavigate: (page: string) => void;
    onThemeToggle?: () => void;
    theme?: 'light' | 'dark';
  }) => {
    const bgClass = theme === 'dark' ? 'bg-gray-950' : 'bg-gov-900';
    const textClass = theme === 'dark' ? 'text-gray-300' : 'text-white/90';
    const borderClass = theme === 'dark' ? 'border-gray-800' : 'border-gold-500/30';

    const footerLinks = [
      { label: 'الرئيسية', page: 'home' },
      { label: 'الخدمات الإلكترونية', page: 'services' },
      { label: 'النماذج والاستمارات', page: 'forms' },
      { label: 'الدليل الإرشادي', page: 'guidelines' },
      { label: 'عن المكتب', page: 'about' },
      { label: 'تواصل معنا', page: 'contact' },
      { label: 'تتبع معاملة', page: 'track' },
      { label: 'الوثائق والتقارير', page: 'documents' },
    ];

    const legalLinks = [
      {
        label: 'قانون البناء رقم 19 لسنة 2002م',
        href: SITE_CONFIG.officialLinks.lawsPortal + 'lib_details.php?id=42',
      },
      {
        label: 'قانون التخطيط الحضري رقم 20',
        href: SITE_CONFIG.officialLinks.lawsPortal + 'lib_details.php?id=118',
      },
      { label: 'المركز الوطني للمعلومات', href: SITE_CONFIG.officialLinks.nationalInfoCenter },
      { label: 'بوابة القوانين اليمنية', href: SITE_CONFIG.officialLinks.lawsPortal },
    ];

    const contactInfo = [
      { icon: MapPin, text: SITE_CONFIG.contact.address },
      { icon: Phone, text: SITE_CONFIG.contact.phone, href: `tel:${SITE_CONFIG.contact.phone}` },
      { icon: Mail, text: SITE_CONFIG.contact.email, href: `mailto:${SITE_CONFIG.contact.email}` },
      {
        icon: Clock,
        text: `${SITE_CONFIG.contact.workingDays} | ${SITE_CONFIG.contact.workingHours}`,
      },
    ];

    return (
      <footer
        className={`relative ${bgClass} text-white pt-16 lg:pt-20 pb-8 border-t ${borderClass} overflow-hidden`}
        role="contentinfo"
        aria-label="تذييل الصفحة"
      >
        {/* خلفية زخرفية */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 50%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center shadow-lg shadow-gold-500/30">
                  <Flag size={28} className="text-white" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl opacity-30 blur-sm" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">مكتب الأشغال</h3>
                  <p className="text-[10px] text-gold-400 font-bold">العامة والطرق - ذمار</p>
                </div>
              </div>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                الجهة الحكومية الرسمية المخولة بتنظيم قطاع التشييد والبناء، وإصدار التراخيص العمرانية، والإشراف على مشاريع الطرق والبنية التحتية في محافظة ذمار.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/50">
                  <Globe size={12} className="text-gold-400" />
                  <span className="text-[10px]">الجمهورية اليمنية</span>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <Shield size={12} className="text-gold-400" />
                  <span className="text-[10px]">وزارة الأشغال العامة والطرق</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
                روابط سريعة
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.map((item) => (
                  <li key={item.page}>
                    <button onClick={() => onNavigate(item.page)} className="text-white/60 hover:text-gold-400 hover:translate-x-1 transition-all text-xs flex items-center gap-2 group w-full text-right">
                      <ArrowLeft size={12} className="group-hover:text-gold-400 transition-colors" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
                مراجع قانونية
              </h4>
              <ul className="space-y-2.5">
                {legalLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold-400 transition-colors text-xs flex items-center gap-2 group">
                      <ExternalLink size={10} className="group-hover:scale-110 transition-transform text-gold-400/60 group-hover:text-gold-400" />
                      <span className="group-hover:translate-x-1 transition-transform inline-block">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
                تواصل معنا
              </h4>
              <div className="space-y-3">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = item.href ? (
                    <a href={item.href} className="text-white/60 hover:text-gold-400 transition-colors text-xs font-mono">{item.text}</a>
                  ) : (
                    <span className="text-white/60 text-xs">{item.text}</span>
                  );
                  return (
                    <div key={item.text} className="flex items-start gap-3 group">
                      <div className="w-9 h-9 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl flex items-center justify-center shrink-0 border border-gold-500/20 group-hover:border-gold-500/40 group-hover:scale-110 transition-all">
                        <Icon size={14} className="text-gold-400" />
                      </div>
                      <div className="flex-1 pt-1.5">{content}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white/40 text-xs text-center md:text-right">
                <p>© {SITE_CONFIG.year} {SITE_CONFIG.fullName} - {SITE_CONFIG.governorate}. جميع الحقوق محفوظة.</p>
              </div>
              <div className="flex items-center gap-4">
                <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="text-white/40 hover:text-gold-400 text-xs transition-colors">سياسة الخصوصية</a>
                <span className="text-white/20">|</span>
                <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="text-white/40 hover:text-gold-400 text-xs transition-colors">شروط الاستخدام</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  },
);
FooterSection.displayName = 'FooterSection';

export {
  OfficialStatusBar,
  ScrollToTopButton,
  SectionLoader,
  SITE_CONFIG,
  QuickLinksSection,
  FooterSection,
  MapHighlightSection,
};
