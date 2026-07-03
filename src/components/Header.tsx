import { useState, useEffect, useRef, useCallback, memo } from 'react';
import type { Page } from '../types/page';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Search,
  Clock,
  ArrowRight,
  ArrowLeft,
  Home,
  BookOpen,
  FileText,
  Info,
  PhoneCall,
  Truck,
  Sun,
  Moon,
  Shield,
} from 'lucide-react';
import { useNavigation } from './NavigationHistory';
import MobileDrawer from './MobileDrawer';
import OptimizedImage from '../shared/components/OptimizedImage';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

// دوال التحميل المسبق للصفحات
const prefetchMap: Partial<Record<Page, () => Promise<unknown>>> = {
  home: () => import('../pages/HomePage'),
  services: () => import('../pages/ServicesPage'),
  forms: () => import('../pages/FormsPage'),
  about: () => import('../pages/AboutPage'),
  contact: () => import('../pages/ContactPage'),
  track: () => import('../pages/TrackPage'),
  documents: () => import('../pages/DocumentsPage'),
  guidelines: () => import('../pages/GuidelinesPage'),
};

// قائمة التنقل الرئيسية
const navItems = [
  { id: 'home' as Page, label: 'الرئيسية', icon: Home },
  { id: 'services' as Page, label: 'الخدمات', icon: BookOpen },
  { id: 'forms' as Page, label: 'النماذج', icon: FileText },
  { id: 'guidelines' as Page, label: 'الدليل الإرشادي', icon: BookOpen },
  { id: 'about' as Page, label: 'عن المكتب', icon: Info },
  { id: 'contact' as Page, label: 'تواصل معنا', icon: PhoneCall },
];

const Header = memo(({ currentPage, onNavigate, theme = 'light', onThemeToggle }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const navigation = useNavigation();
  const canGoBack = navigation?.canGoBack ?? false;
  const canGoForward = navigation?.canGoForward ?? false;

  // تحديث الوقت
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-YE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // معالجة التمرير
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // تأثير الشفافية المتدرج
      if (headerRef.current) {
        const opacity = Math.min(1, scrollY / 100);
        headerRef.current.style.setProperty('--header-opacity', String(opacity));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق القوائم عند تغيير الصفحة
  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
    setDrawerOpen(false);
  }, [currentPage]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // التركيز على حقل البحث
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // البحث
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        onNavigate('services');
        setSearchQuery('');
        setSearchOpen(false);
      }
    },
    [searchQuery, onNavigate],
  );

  // التنقل بين الصفحات
  const handleBack = useCallback(() => {
    if (canGoBack) navigation?.goBack();
  }, [canGoBack, navigation]);

  const handleForward = useCallback(() => navigation?.goForward?.(), [navigation]);

  // فتح وإغلاق القائمة الجانبية
  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  // تبديل الثيم
  const handleThemeToggle = useCallback(() => {
    onThemeToggle?.();
  }, [onThemeToggle]);

  // تحميل مسبق للصفحات
  const handlePrefetch = useCallback((pageId: Page) => {
    const fn = prefetchMap[pageId];
    if (fn) fn();
  }, []);

  return (
    <>
      {/* القائمة الجانبية للموبايل */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onTrack={() => {
          onNavigate('track');
          handleDrawerClose();
        }}
      />

      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-2xl shadow-2xl border-b border-gov-200/60'
            : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
        }`}
        role="banner"
        aria-label="القائمة الرئيسية"
        style={
          {
            '--header-opacity': 1,
            'backdropFilter': isScrolled ? 'blur(24px)' : 'blur(12px)',
            'WebkitBackdropFilter': isScrolled ? 'blur(24px)' : 'blur(12px)',
          } as React.CSSProperties
        }
      >
        {/* الشريط العلوي الرسمي */}
        <div className="bg-gradient-to-l from-gov-800 via-gov-900 to-gov-950 text-white no-print relative overflow-hidden">
          {/* أنماط الخلفية */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* صورة الخلفية */}
          <div className="absolute inset-0">
            <img
              src="/vite.svg"
              alt=""
              className="w-full h-full object-cover opacity-6"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-gov-800/95 via-gov-900/90 to-gov-800/95" />
          </div>

          {/* شريط ذهبي أنيق */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50" />

          <div className="relative max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px]">
            {/* الجهة اليسرى - معلومات الاتصال */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-white/80 group">
                <MapPin
                  size={11}
                  className="text-gold-400 group-hover:scale-110 transition-transform"
                />
                <span className="font-medium">محافظة ذمار</span>
              </div>

              <div className="h-4 w-px bg-white/20" />

              <a
                href="tel:+967777888198"
                className="flex items-center gap-1.5 hover:text-gold-300 transition-colors text-white/70 font-medium group"
                aria-label="اتصل بنا"
              >
                <Phone
                  size={11}
                  className="text-gold-400 group-hover:rotate-12 transition-transform"
                />
                <span
                  dir="ltr"
                  className="text-xs"
                >
                  777-888-198
                </span>
              </a>

              <div className="h-4 w-px bg-white/20 hidden md:block" />

              <a
                href="mailto:info@pwo-dhamar.gov.ye"
                className="flex items-center gap-1.5 hover:text-gold-300 transition-colors text-white/70 font-medium group"
              >
                <Mail
                  size={11}
                  className="text-gold-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs">info@pwo-dhamar.gov.ye</span>
              </a>
            </div>

            {/* الجهة اليمنى - معلومات رسمية */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white/50">
                <Shield
                  size={11}
                  className="text-gold-400"
                />
                <span className="font-medium">الجمهورية اليمنية</span>
                <span className="text-white/20">|</span>
                <span className="text-white/60 font-medium">وزارة الأشغال</span>
              </div>

              <div className="h-4 w-px bg-white/20" />

              <div className="flex items-center gap-1.5 text-white/50">
                <Clock
                  size={11}
                  className="text-gold-400"
                />
                <span className="font-medium text-xs">{currentTime || '--:--'}</span>
              </div>

              <div className="h-4 w-px bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-1.5 text-white/40">
                <span className="text-[10px]">أوقات العمل:</span>
                <span className="text-white/60 font-medium text-[10px]">السبت - الأربعاء</span>
                <span className="text-white/40 text-[10px]">|</span>
                <span className="text-white/60 font-medium text-[10px]">8ص - 3م</span>
              </div>
            </div>
          </div>
        </div>

        {/* الشريط الرئيسي */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* الشعار والاسم */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-gov-400 rounded-xl transition-all"
              aria-label="الرئيسية"
            >
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gov-700 to-gov-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden ring-2 ring-gold-400/40 group-hover:ring-gold-400/80">
                  {/* خلفية هندسية */}
                  <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'}} />
                  <div className="absolute inset-0 bg-gradient-to-br from-gov-600/50 via-gov-700/30 to-gov-800/50 rounded-2xl" />
                  {/* توهج ذهبي */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold-400/30 via-gold-500/20 to-gold-400/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  {/* لمعان علوي */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-2xl" />
                  <OptimizedImage
                    src="/icons/Emblem_office.svg"
                    alt="شعار مكتب الأشغال العامة والطرق"
                    fallback="/icons/Emblem_office.svg"
                    className="w-full h-full object-contain p-2.5 relative z-10 drop-shadow-2xl"
                    priority
                  />
                </div>
              <div className="text-right">
                <div className="text-gov-900 font-black text-sm lg:text-base leading-tight tracking-tight">
                  مكتب الأشغال العامة والطرق
                </div>
                <div className="text-gold-600 text-[11px] font-bold flex items-center justify-end gap-2 mt-0.5">
                  <span>محافظة ذمار</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-sm" />
                  <span>الجمهورية اليمنية</span>
                </div>
                <div className="text-gov-700 text-[10px] font-bold mt-1 tracking-wide">
                </div>
              </div>
            </button>

            {/* روابط التنقل للشاشات الكبيرة */}
            <nav
              className="hidden lg:flex items-center gap-0.5"
              aria-label="التنقل الرئيسي"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    onMouseEnter={() => handlePrefetch(item.id)}
                    className={`relative px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-l from-gov-600 to-gov-700 text-white shadow-lg shadow-gov-500/25 scale-105'
                        : 'text-gray-700 hover:bg-gov-50 hover:text-gov-700 hover:scale-105'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {Icon && (
                      <Icon
                        size={15}
                        className={isActive ? 'text-gold-300' : 'text-gov-500'}
                      />
                    )}
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-gold-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* الأزرار - منظمة بشكل نظيف */}
            <div className="flex items-center gap-1.5">
              {/* بحث */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  searchOpen
                    ? 'text-gov-600 bg-gov-50 shadow-inner'
                    : 'text-gray-500 hover:text-gov-600 hover:bg-gray-100'
                }`}
                aria-label="بحث"
                title="بحث"
              >
                <Search size={16} />
              </button>

              {/* التنقل بين الصفحات */}
              <div className="hidden sm:flex items-center gap-0.5">
                <button
                  onClick={handleBack}
                  disabled={!canGoBack}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    canGoBack
                      ? 'text-gov-600 hover:bg-gov-50 hover:scale-110'
                      : 'text-gray-300 cursor-not-allowed opacity-50'
                  }`}
                  aria-label="رجوع"
                  title="رجوع"
                >
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={handleForward}
                  disabled={!canGoForward}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    canGoForward
                      ? 'text-gov-600 hover:bg-gov-50 hover:scale-110'
                      : 'text-gray-300 cursor-not-allowed opacity-50'
                  }`}
                  aria-label="تقدم"
                  title="تقدم"
                >
                  <ArrowLeft size={14} />
                </button>
              </div>

              {/* زر تتبع المعاملة */}
              <button
                onClick={() => onNavigate('track')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-l from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 hover:scale-105"
                title="تتبع معاملتك"
              >
                <Truck
                  size={14}
                  className="animate-pulse"
                />
                <span>تتبع معاملة</span>
              </button>

              {/* تبديل الثيم (اختياري) */}
              {onThemeToggle && (
                <button
                  onClick={handleThemeToggle}
                  className="p-2 text-gray-500 hover:text-gov-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="تبديل الثيم"
                  title="تبديل الثيم"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}

              {/* زر القائمة للموبايل */}
              <button
                onClick={handleDrawerOpen}
                className="lg:hidden p-2 text-gray-600 hover:text-gov-600 rounded-lg hover:bg-gray-100 transition-colors relative"
                aria-expanded={drawerOpen}
                aria-label="القائمة"
              >
                {drawerOpen ? <X size={18} /> : <Menu size={18} />}
                {drawerOpen && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-gov-600 rounded-full animate-ping" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* شريط البحث المتقدم */}
        {searchOpen && (
          <div className="border-t border-gray-100/80 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-4 py-3 no-print shadow-inner">
            <form
              onSubmit={handleSearch}
              className="max-w-7xl mx-auto flex items-center gap-3"
            >
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن خدمة، نموذج، دليل إرشادي..."
                  className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-400 focus:border-transparent transition-all"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-l from-gov-600 to-gov-700 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                بحث
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="إغلاق البحث"
              >
                <X size={16} />
              </button>
            </form>

            {/* اقتراحات بحث سريعة */}
            <div className="max-w-7xl mx-auto mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-gray-400 font-medium">بحث سريع:</span>
              {['ترخيص بناء', 'نموذج طلب', 'دليل إرشادي', 'شكوى'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setTimeout(() => {
                      onNavigate('services' as Page);
                      setSearchOpen(false);
                    }, 200);
                  }}
                  className="text-[10px] px-3 py-1 bg-gray-100 hover:bg-gov-100 text-gray-600 hover:text-gov-700 rounded-full transition-all hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
