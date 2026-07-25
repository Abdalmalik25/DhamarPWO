// ============================================================
// Header.tsx v7.0 - Platinum Ultra Premium
// الهيدر الحكومي - تصميم يتجاوز فيجما مع inscription 3D
// ============================================================

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import type { Page } from '../types/page';
import { darkMode } from '../services';
import MobileDrawer from './MobileDrawer';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Search,
  Clock,
  Home,
  BookOpen,
  FileText,
  Info,
  PhoneCall,
  Truck,
  Settings,
  Sun,
  Moon,
  Globe,
  Award,
} from 'lucide-react';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

// ============================================================
// البيانات
// ============================================================

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

const navItems = [
  { id: 'home' as Page, label: 'الرئيسية', icon: Home, badge: null },
  { id: 'services' as Page, label: 'الخدمات', icon: BookOpen, badge: null },
  { id: 'forms' as Page, label: 'النماذج', icon: FileText, badge: null },
  { id: 'guidelines' as Page, label: 'الدليل الإرشادي', icon: BookOpen, badge: null },
  { id: 'about' as Page, label: 'عن المكتب', icon: Info, badge: null },
  { id: 'contact' as Page, label: 'تواصل معنا', icon: PhoneCall, badge: null },
];

const QUICK_STATS = [
  { icon: Phone, text: '777-888-198', color: 'text-emerald-600' },
  { icon: Mail, text: 'dpw.dhamar@yemen.gov.ye', color: 'text-blue-600' },
  { icon: MapPin, text: 'محافظة ذمار', color: 'text-red-600' },
  { icon: Clock, text: 'السبت - الأربعاء', color: 'text-amber-600' },
];

// ============================================================
// المكون الرئيسي
// ============================================================

const Header = memo(({ currentPage, onNavigate }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // متابعة حالة الوضع الليلي
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تأثير الماوس للـ inscription
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // إغلاق القوائم عند تغيير الصفحة
  useEffect(() => {
    setSearchOpen(false);
    setDrawerOpen(false);
  }, [currentPage]);

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

  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  const handlePrefetch = useCallback((pageId: Page) => {
    const fn = prefetchMap[pageId];
    if (fn) fn();
  }, []);

  const handleDarkModeToggle = useCallback(() => {
    darkMode.toggle();
  }, []);

  return (
    <>
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

      {/* الشريط العلوي الرسمي المطور - ثابت دائماً */}
      <div className="sticky top-0 z-[60] bg-gov-950/95 backdrop-blur-md border-b border-gold-400/20 py-2 px-4 text-white/70 text-[10px] hidden lg:block transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* معلومات الاتصال */}
          <div className="flex items-center gap-6">
            {QUICK_STATS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 group"
                >
                  <Icon
                    size={10}
                    className={item.color}
                  />
                  <span className="group-hover:text-white transition-colors duration-300">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* معلومات إضافية */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Award
                size={12}
                className="text-gold-400"
              />
              <span>خدمات موثوقة</span>
            </div>
            <div className="w-px h-3 bg-white/9" />
            <div className="flex items-center gap-2">
              <Globe
                size={12}
                className="text-gold-400"
              />
              <span>الجمهورية اليمنية</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <Clock
                size={12}
                className="text-gold-400"
              />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* الهيدر الرئيسي - inscription 3D */}
      {/* الهيدر الرئيسي */}
      <header
        ref={headerRef}
        className={`
          sticky top-[24px] z-50 w-full transition-all duration-500 ${
            isScrolled ? 'glass-header shadow-xl py-0' : 'py-1'
          }
        `}
        style={{
          background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
        }}
        role="banner"
        aria-label="القائمة الرئيسية"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-1">
          {/* نظام Grid ثلاثي الأبعاد */}
          <div className="grid grid-cols-3 items-center h-16 lg:h-20">
            {/* منطقة الشعار والهوية */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-xl transition-all shrink-0"
                aria-label="الصفحة الرئيسية"
              >
                <div
                  className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-gov-700 to-gov-900 flex items-center justify-center shadow-lg transition-all duration-500 group-hover:shadow-gold-500/50"
                  style={{
                    transform: `rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <img
                    src="/icons/icon-48x48.ico"
                    alt="شعار مكتب الأشغال العامة والطرق"
                    className="w-10 h-10 lg:w-11 lg:h-12 object-contain relative z-12"
                    loading="eager"
                    decoding="async"
                    width={48}
                    height={48}
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-gold-400/60 animate-pulse" />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.3), transparent 60%)',
                    }}
                  />
                </div>
                <div className="hidden md:block min-w-0">
                  <h1 className="text-gov-900 font-black text-sm lg:text-base leading-tight group-hover:text-gov-700 transition-colors truncate">
                    مكتب الأشغال العامة والطرق
                  </h1>
                  <p className="text-gold-600 text-[10px] lg:text-xs font-bold -mt-0.5">
                    محافظة ذمار
                  </p>
                </div>
              </button>
            </div>

            {/* التنقل الرئيسي */}
            <nav
              className="hidden lg:flex items-center justify-center gap-1"
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
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                      ${
                        isActive
                          ? 'text-white bg-gradient-to-l from-gov-600 to-gov-700 shadow-md'
                          : 'text-gray-700 hover:text-gov-800 hover:bg-gov-50'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {Icon && (
                      <Icon
                        size={16}
                        className={isActive ? 'text-gold-300' : 'text-gov-500'}
                      />
                    )}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-gold-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                    {/* مؤشر الصفحة النشطة */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* أدوات مساعدة */}
            <div className="flex items-center justify-end gap-2 lg:gap-3">
              {/* زر البحث */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  searchOpen
                    ? 'bg-gov-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gov-700 hover:bg-gray-50'
                }`}
                aria-label="بحث"
                title="بحث"
              >
                <Search size={18} />
              </button>

              {/* زر تتبع المعاملة */}
              <button
                onClick={() => onNavigate('track')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 hover:scale-105"
                title="تتبع معاملتك"
              >
                <Truck size={16} />
                <span>تتبع معاملة</span>
              </button>

              {/* زر القائمة للموبايل */}
              <button
                onClick={handleDrawerOpen}
                className="lg:hidden p-2 text-gray-600 hover:text-gov-700 rounded-xl hover:bg-gray-50 transition-colors relative"
                aria-expanded={drawerOpen}
                aria-label="القائمة"
              >
                <Menu size={22} />
              </button>

              {/* زر الوضع الليلي */}
              <button
                onClick={handleDarkModeToggle}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? 'text-gold-400 bg-gov-50'
                    : 'text-gray-600 hover:text-gov-700 hover:bg-gray-50'
                }`}
                aria-label="تبديل الوضع الليلي"
                title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* زر الإعدادات */}
              {currentPage === 'home' && (
                <button
                  onClick={() => {
                    const studioUrl = 'https://xqbc1jjs.sanity.studio';
                    window.open(studioUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                  title="لوحة التحكم"
                >
                  <Settings size={16} />
                  <span>الإعدادات</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* شريط البحث المتقدم */}
        {searchOpen && (
          <div className="border-t border-gray-100/60 bg-white/95 backdrop-blur-md px-4 py-3 shadow-inner">
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
                  placeholder="ابحث عن خدمة، نموذج، أو دليل إرشادي..."
                  className="w-full bg-white/90 border-2 border-gold-400/30 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
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
          </div>
        )}
      </header>
    </>
  );
});

Header.displayName = 'Header';
export default Header;
