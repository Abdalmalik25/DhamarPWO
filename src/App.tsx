// ============================================================
// App.tsx - المنصة الحكومية v4.0 (Final Platinum Edition)
// لا تكرار - لا مربعات فارغة - جاهز للنشر المباشر
// ============================================================
import { Suspense, lazy, useState, useRef, useCallback, useEffect, memo } from 'react';
import type { Page } from './types/page';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumb from './shared/components/Breadcrumb';
import ScrollToTop from './shared/components/ScrollToTop';
import { NavigationProvider, useNavigation } from './components/NavigationHistory';
import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';
import { useSwipeNavigation, getAdjacentPages } from './shared/hooks/useSwipeNavigation';
import QuickActionFAB from './shared/components/QuickActionFAB';
import { FaSearch, FaPrint, FaPhone } from 'react-icons/fa';

// تحميل كسول
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const FormsPage = lazy(() => import('./pages/FormsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TrackPage = lazy(() => import('./pages/TrackPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const GuidelinesPage = lazy(() => import('./pages/GuidelinesPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));

// ============================================================
// مكون تحميل واحد موحد - مع مؤشر تقدم متحرك احترافي
// ============================================================
const AppLoader = memo(function AppLoader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('جاري التهيئة...');

  useEffect(() => {
    let frame: number;
    const startTime = performance.now();
    const duration = 2200;

    const statuses = [
      { max: 15, text: 'جاري التهيئة...' },
      { max: 35, text: 'تحميل الموارد...' },
      { max: 60, text: 'تهيئة المكونات...' },
      { max: 85, text: 'التحقق من النظام...' },
      { max: 100, text: 'جاهز ✓' },
    ];

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const raw = Math.min(elapsed / duration, 1);
      // easeInOutCubic
      const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      const display = Math.round(eased * 100);
      setProgress(display);

      // تحديث النص حسب التقدم
      for (const s of statuses) {
        if (display <= s.max) { setStatus(s.text); break; }
      }

      if (raw < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0a1628] via-[#0f1f38] to-[#0a1628] flex flex-col items-center justify-center">
      {/* حلقات دوارة */}
      <div className="relative mb-10">
        <div className="absolute -inset-10 rounded-full border-2 border-[#d4af37]/10 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute -inset-6 rounded-full border border-[#d4af37]/20 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
        <div className="absolute -inset-3 bg-gradient-to-br from-[#d4af37]/15 to-transparent rounded-full blur-2xl animate-pulse" />
        <div className="relative w-28 h-28 bg-white/[0.07] rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
          <svg className="w-14 h-14 text-[#d4af37]" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M50 10 L61 39 H92 L67 58 L76 88 L50 70 L24 88 L33 58 L8 39 H39 Z" fill="currentColor" opacity="0.85" />
          </svg>
        </div>
      </div>
      
      {/* النص */}
      <h1 className="text-white font-black text-3xl md:text-4xl mb-2 tracking-tight">مكتب الأشغال العامة والطرق</h1>
      <p className="text-[#fbbf24] font-bold text-lg md:text-xl mb-8">محافظة ذمار</p>
      
      {/* ===== مؤشر التقدم المتطور ===== */}
      <div className="w-72 md:w-80 space-y-3">
        {/* شريط التقدم مع تدرج ذهبي */}
        <div className="relative h-2.5 bg-white/[0.08] rounded-full overflow-hidden shadow-inner">
          {/* توهج خلفي */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/30 to-[#fbbf24]/20 blur-md" style={{ width: `${progress}%` }} />
          {/* التعبئة الفعلية */}
          <div
            className="h-full bg-gradient-to-l from-[#d4af37] via-[#fbbf24] to-[#d4af37] rounded-full relative transition-all duration-200 ease-out"
            style={{ width: `${progress}%`, boxShadow: '0 0 12px rgba(212,175,55,0.4)' }}
          >
            {/* لمعة متحركة */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow" />
          </div>
        </div>

        {/* النسبة المئوية والنص */}
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs font-medium">{status}</span>
          <div className="flex items-center gap-2">
            <span className="text-[#fbbf24] text-sm font-mono font-bold tabular-nums">{progress}%</span>
            {progress < 100 && (
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1 h-1 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1 h-1 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0.3s' }} />
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* النص السفلي */}
      <p className="text-white/30 text-xs mt-10">الجمهورية اليمنية</p>
    </div>
  );
});

// ============================================================
// AppContent
// ============================================================
function AppContent() {
  const { currentPage, navigate } = useNavigation();
  const mainRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  // إخفاء شاشة التحميل بعد تجهيز التطبيق
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    if (page === currentPage) return;
    navigate(page);
  }, [currentPage, navigate]);

  // التنقل بالسحب
  useSwipeNavigation(mainRef, { onSwipeLeft: () => { const n = getAdjacentPages(currentPage).next; if(n) handleNavigate(n as Page); }, onSwipeRight: () => { const p = getAdjacentPages(currentPage).prev; if(p) handleNavigate(p as Page); }, threshold: 50 },
    { excludeSelectors: ['.no-swipe','.swiper','[data-no-swipe]','button','a','input','select','textarea'] });

  const renderPage = () => {
    const pages: Record<string, React.ReactNode> = {
      home: <HomePage onNavigate={handleNavigate as (page: string) => void} />,
      services: <ServicesPage onNavigate={handleNavigate} />,
      about: <AboutPage />,
      contact: <ContactPage />,
      track: <TrackPage />,
      guidelines: <GuidelinesPage />,
      forms: <FormsPage />,
      documents: <DocumentsPage />,
      privacy: <PrivacyPolicyPage />,
      terms: <TermsOfUsePage />,
    };
    return pages[currentPage] || pages.home;
  };

  const HIDE_FOOTER: Page[] = ['home', 'forms', 'documents'];
  const showFooter = !HIDE_FOOTER.includes(currentPage);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]" dir="rtl">
      {/* ===== شاشة التحميل الموحدة ===== */}
      {!ready && <AppLoader />}

      {/* ===== الهيدر ===== */}
      {ready && (
        <>
          <div className="sticky top-0 z-40 bg-white shadow-sm">
            <Header currentPage={currentPage} onNavigate={handleNavigate} />
          </div>

          {/* ===== مسار التنقل ===== */}
          <div className="bg-gray-50 border-b border-gray-100 py-2">
            <div className="max-w-7xl mx-auto px-4">
              <Breadcrumb currentPage={currentPage} items={[]} onNavigate={handleNavigate} />
            </div>
          </div>
        </>
      )}

      {/* ===== المحتوى الرئيسي ===== */}
      <ErrorBoundary fallback={<div className="p-8 text-center text-red-600 font-bold">عذراً، حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.</div>}>
        <main ref={mainRef} className="flex-1 relative" style={{ paddingBottom: ready ? '130px' : '0' }}>
          {ready ? (
            <Suspense fallback={
              <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
                <div className="h-10 bg-gray-200 rounded-xl w-3/4" />
                <div className="h-5 bg-gray-200 rounded-xl w-1/2" />
                <div className="h-40 bg-gray-200 rounded-2xl" />
                <div className="h-40 bg-gray-200 rounded-2xl" />
              </div>
            }>
              {renderPage()}
            </Suspense>
          ) : (
            <div className="h-screen" />
          )}
        </main>
      </ErrorBoundary>

      {/* ===== الفوتر (شاشات كبيرة) ===== */}
      {ready && showFooter && (
        <div className="hidden lg:block">
          <Footer onNavigate={handleNavigate} />
        </div>
      )}

      {/* ===== الإجراءات السريعة ===== */}
      {ready && (
        <QuickActionFAB
          actions={[
            { id: 'track', label: 'تتبع معاملة', icon: <FaSearch />, onClick: () => handleNavigate('track') },
            { id: 'print', label: 'طباعة نموذج', icon: <FaPrint />, onClick: () => handleNavigate('forms') },
            { id: 'contact', label: 'اتصل بنا', icon: <FaPhone />, onClick: () => handleNavigate('contact') },
          ]}
        />
      )}

      {/* ===== التنقل السفلي ===== */}
      {ready && (
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* ===== زر العودة للأعلى ===== */}
      <ScrollToTop />
    </div>
  );
}

// ============================================================
// App
// ============================================================
export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}