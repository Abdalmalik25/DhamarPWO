// ============================================================
// HeroSection.tsx v7.0 - Ultimate Platinum
// HeroSection - أقوى تصميم على الإطلاق مع تأثيرات 3D متقدمة
// ============================================================

import { memo, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  HardHat,
  Compass,
  FileCheck,
  Route,
  Shield,
  Scale,
  Award,
  TrendingUp,
  Users,
  MapPin,
  Clock,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import type { Page } from '../../../types/page';
import './HeroSection.css';

interface HeroSectionProps {
  onNavigate: (page: Page) => void;
}

// ============================================================
// البيانات المتطورة
// ============================================================

const OFFICE_DATA = {
  identity: {
    name: 'مكتب الأشغال العامة والطرق',
    governorate: 'محافظة ذمار',
    country: 'الجمهورية اليمنية',
    ministry: 'وزارة الأشغال العامة والطرق',
    vision: 'بوابة التنمية الحضرية',
    mission: 'نحو بيئة عمرانية مستدامة وآمنة',
    description:
      'المرجعية الرسمية لصياغة المشهد العمراني وتطوير البنية التحتية في محافظة ذمار. نضع المعايير، ننظم التوسع العمراني، ونؤسس لمدينة ذكية وآمنة وفق أحدث الكودات الهندسية والمعايير العالمية.',
  },
  tasks: [
    { icon: FileCheck, label: 'تراخيص البناء', desc: 'إصدار رخص البناء وفق الاشتراطات' },
    { icon: Route, label: 'الطرق', desc: 'تنفيذ وصيانة شبكات الطرق' },
    { icon: Compass, label: 'التخطيط', desc: 'تنظيم التوسع العمراني' },
    { icon: HardHat, label: 'الإشراف', desc: 'متابعة جودة التنفيذ' },
  ],
  stats: [
    { value: '٤٬١٣١', label: 'رخصة بناء', icon: FileCheck, desc: 'صدرت منذ التأسيس' },
    { value: '١٢٠+', label: 'كادر متخصص', icon: Users, desc: 'مهندسين وفنيين' },
    { value: '١٫٧ب', label: 'ريال مشاريع', icon: TrendingUp, desc: 'قيمة المشاريع المنفذة' },
  ],
  achievements: [
    { label: 'تأهيل شبكة الطرق', year: '١٤٤٥هـ' },
    { label: 'تطوير التخطيط العمراني', year: '١٤٤٤هـ' },
    { label: 'رقمنة الخدمات', year: '١٤٤٥هـ' },
  ],
  values: [
    { icon: Shield, label: 'النزاهة', desc: 'الشفافية في جميع الإجراءات' },
    { icon: Scale, label: 'العدالة', desc: 'المساواة في تطبيق اللوائح' },
    { icon: Award, label: 'الجودة', desc: 'التميز في الخدمات المقدمة' },
  ],
};

// ============================================================
// المكون الرئيسي
// ============================================================

const HeroSection = memo(function HeroSection({ onNavigate }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString('ar-YE', {
          timeZone: 'Asia/Aden',
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 3D Parallax Effect - تتبع الماوس
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigate = useCallback(
    (page: Page) => {
      onNavigate(page);
    },
    [onNavigate],
  );

  const scrollDown = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  // Memoized particles to prevent recreation on render
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      style: {
        '--tx': `${Math.random() * 200 - 100}px`,
        '--ty': `${Math.random() * 200 - 100}px`,
        animationDuration: `${12 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 5}s`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${2 + Math.random() * 3}px`,
        height: `${2 + Math.random() * 3}px`,
        opacity: 0.2 + Math.random() * 0.5,
      } as React.CSSProperties,
    }));
  }, []);

  // Debounced parallax offsets for performance
  const parallaxOffset = useMemo(
    () => ({
      x: mousePos.x * 20,
      y: mousePos.y * 20,
      bgY: scrollY * 0.3,
    }),
    [mousePos.x, mousePos.y, scrollY],
  );

  return (
    <section
      ref={sectionRef}
      className={`hero-section ${isVisible ? 'hero-section--visible' : ''}`}
      aria-label={OFFICE_DATA.identity.name}
      dir="rtl"
    >
      {/* ===== الخلفية المتطورة ===== */}
      <div className="hero-background">
        <div className="hero-background-gradient" />

        {/* النقش الهندسي */}
        <div className="hero-geometric-pattern">
          <svg
            className="hero-svg"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="heroGrid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.3"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="1"
                  fill="currentColor"
                  opacity="0.25"
                />
              </pattern>
              <pattern
                id="heroDiamond"
                width="120"
                height="120"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="60,10 110,60 60,110 10,60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.15"
                  opacity="0.15"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#heroGrid)"
            />
            <rect
              width="100%"
              height="100%"
              fill="url(#heroDiamond)"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* إضاءات متحركة 3D Parallax */}
        <div className="hero-ambient-lights">
          <div
            className="hero-ambient-light hero-ambient-light--gold"
            style={{
              transform: `translate(${parallaxOffset.x * 0.3}px, ${parallaxOffset.y * 0.3}px)`,
            }}
          />
          <div
            className="hero-ambient-light hero-ambient-light--blue"
            style={{
              transform: `translate(${parallaxOffset.x * -0.2}px, ${parallaxOffset.y * -0.2}px)`,
            }}
          />
          <div
            className="hero-ambient-light hero-ambient-light--green"
            style={{
              transform: `translate(${parallaxOffset.x * 0.1}px, ${parallaxOffset.y * -0.3}px)`,
            }}
          />
        </div>

        {/* جسيمات متحركة محسّنة */}
        <div
          className="hero-particles"
          aria-hidden="true"
        >
          {particles.map((p) => (
            <div
              key={p.id}
              className="hero-particle"
              style={p.style}
            />
          ))}
        </div>
      </div>

      {/* ===== المحتوى المتطور ===== */}
      <div className="hero-content">
        <div className="hero-layout">
          {/* ===== العمود النصي ===== */}
          <div className="hero-text-column">
            <ScrollReveal>
              <div className="hero-institutional-badge">
                <span className="hero-badge-text">
                  {OFFICE_DATA.identity.governorate} - {OFFICE_DATA.identity.country}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="hero-title-group">
                <h1 className="hero-title">
                  <span className="hero-title-vision">{OFFICE_DATA.identity.vision}</span>
                  <span className="hero-title-mission">{OFFICE_DATA.identity.mission}</span>
                </h1>
                <p className="hero-description">{OFFICE_DATA.identity.description}</p>
              </div>
            </ScrollReveal>

            {/* القيم المؤسسية */}
            <ScrollReveal delay={100}>
              <div className="flex items-center gap-3 flex-wrap">
                {OFFICE_DATA.values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="hero-value-chip"
                    >
                      <Icon
                        size={12}
                        className="text-gold-400"
                      />
                      <span className="text-[11px] text-white/70 font-medium">{value.label}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* بطاقات المهام */}
            <ScrollReveal delay={150}>
              <div className="hero-tasks-grid">
                {OFFICE_DATA.tasks.map((task, index) => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={index}
                      className="hero-task-card"
                      style={{
                        '--rotate-x': `${mousePos.y * 2}deg`,
                        '--rotate-y': `${mousePos.x * -2}deg`,
                      } as React.CSSProperties}
                    >
                      <div className="hero-task-icon">
                        <Icon size={18} />
                      </div>
                      <div className="hero-task-text">
                        <span className="hero-task-label">{task.label}</span>
                        <span className="hero-task-desc">{task.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* أزرار الإجراءات */}
            <ScrollReveal delay={250}>
              <div className="hero-actions">
                <button
                  onClick={() => handleNavigate('services')}
                  className="hero-btn hero-btn--primary"
                >
                  <span>استعرض الخدمات</span>
                  <ArrowLeft
                    size={16}
                    className="hero-btn-icon"
                  />
                </button>

                <button
                  onClick={() => handleNavigate('about')}
                  className="hero-btn hero-btn--secondary"
                >
                  <span>تعرف على المكتب</span>
                </button>

                <button
                  onClick={() => handleNavigate('track')}
                  className="hero-btn hero-btn--secondary"
                >
                  <span>تتبع معاملة</span>
                </button>
              </div>
            </ScrollReveal>

            {/* المؤشرات الإحصائية */}
            <ScrollReveal delay={350}>
              <div className="hero-stats">
                {OFFICE_DATA.stats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="hero-stat"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <StatIcon
                          size={12}
                          className="text-gold-400/60"
                        />
                        <span className="hero-stat-value">{stat.value}</span>
                      </div>
                      <span className="hero-stat-label">{stat.label}</span>
                      <span className="text-[9px] text-white/20">{stat.desc}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* ===== العمود البصري ===== */}
          <div className="hero-visual-column">
            <ScrollReveal delay={100}>
              <div
                className="hero-visual-frame"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -3}deg)`,
                  transition: 'transform 0.3s ease-out',
                }}
              >
                <div className="hero-image-wrapper">
                  <img
                    src="/images/imagemainstreet.png"
                    alt="التخطيط الحضري - محافظة ذمار"
                    className="hero-image"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="hero-image-overlay" />

                  {/* الإنجازات */}
                  <div className="hero-achievements">
                    {OFFICE_DATA.achievements.map((item, idx) => (
                      <div
                        key={idx}
                        className="hero-achievement-badge"
                      >
                        <span className="hero-achievement-label">{item.label}</span>
                        <span className="hero-achievement-year">{item.year}</span>
                      </div>
                    ))}
                  </div>

                  {/* الختم الهندسي */}
                  <div
                    className="hero-corner-seal"
                    aria-hidden="true"
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        stroke="#d4af37"
                        strokeWidth="0.8"
                        opacity="0.3"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="16"
                        stroke="#d4af37"
                        strokeWidth="0.5"
                        opacity="0.2"
                      />
                      <path
                        d="M24 8 L28 20 L40 20 L30 28 L34 40 L24 32 L14 40 L18 28 L8 20 L20 20 Z"
                        fill="#d4af37"
                        opacity="0.12"
                      />
                    </svg>
                  </div>
                </div>

                {/* معلومات أسفل الصورة */}
                <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-white/30">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} />
                    <span>محافظة ذمار - اليمن</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{currentDate || '--'}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* ===== مؤشر التمرير ===== */}
      <button
        onClick={scrollDown}
        className="hero-scroll-indicator"
        aria-label="التمرير للأسفل"
      >
        <span className="hero-scroll-label">استكشف المزيد</span>
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-dot" />
        </div>
      </button>

      {/* ===== شريط الانتقال السفلي ===== */}
      <div className="hero-bottom-transition" />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
