// ============================================================
// ServicesSection.tsx v6.0 - Elite Ultra 3D Cards
// خدماتنا الهندسية - بطاقات ثلاثية الأبعاد متحركة
// ============================================================

import { useState, useMemo, useRef, memo } from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { HardHat, Shield, Clock, Star, Sparkles, Eye, BookmarkCheck, ExternalLink, Award, TrendingUp, Users, Zap } from 'lucide-react';

// ============================================================
// أنواع البيانات
// ============================================================

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
  rating?: number;
  reviews?: number;
  estimatedTime?: string;
  views?: number;
}

export interface ServicesSectionProps {
  services?: Service[];
  onNavigate?: (page: string) => void;
  theme?: 'light' | 'dark';
  title?: string;
  subtitle?: string;
  className?: string;
}

// ============================================================
// البيانات الافتراضية
// ============================================================

const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    title: 'تراخيص البناء والتعديل',
    description: 'إصدار تراخيص البناء الجديدة والتجديد والتعديل والهدم وفقاً لقانون تنظيم البناء النافذ.',
    icon: HardHat,
    color: 'from-blue-500 to-blue-600',
    href: 'forms',
    category: 'تراخيص',
    isPopular: true,
    rating: 4.7,
    reviews: 85,
    estimatedTime: '3 أيام عمل',
    views: 1250,
  },
  {
    id: '2',
    title: 'اعتماد المخططات الهندسية',
    description: 'مراجعة واعتماد المخططات المعمارية والإنشائية والميكانيكية والكهربائية.',
    icon: Shield,
    color: 'from-emerald-500 to-emerald-600',
    href: 'forms',
    category: 'اعتماد',
    isPopular: true,
    rating: 4.8,
    reviews: 62,
    estimatedTime: '5 أيام عمل',
    views: 980,
  },
  {
    id: '3',
    title: 'المعاينات الميدانية',
    description: 'تكليف لجان فنية متخصصة للمعاينة الميدانية وفحص المواقع.',
    icon: Eye,
    color: 'from-amber-500 to-amber-600',
    href: 'forms',
    category: 'معاينات',
    rating: 4.5,
    reviews: 41,
    estimatedTime: '48 ساعة',
    views: 760,
  },
  {
    id: '4',
    title: 'تصاريح الحفريات والطرق',
    description: 'منح تصاريح الحفر وأعمال البنية التحتية والطرق مع الالتزام باشتراطات السلامة.',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    href: 'forms',
    category: 'تصاريح',
    rating: 4.3,
    reviews: 18,
    estimatedTime: '3 أيام',
    views: 430,
  },
  {
    id: '5',
    title: 'الإفادات الفنية',
    description: 'إصدار إفادات فنية هندسية للجهات الرسمية والخاصة وفقاً للوائح المعتمدة.',
    icon: Award,
    color: 'from-rose-500 to-rose-600',
    href: 'forms',
    category: 'إفادات',
    rating: 4.6,
    reviews: 32,
    estimatedTime: 'يوم واحد',
    views: 580,
  },
  {
    id: '6',
    title: 'الشكاوى والتظلمات',
    description: 'استقبال الشكاوى والتظلمات حول القرارات الإدارية ومعالجتها وفق الإجراءات النظامية.',
    icon: Users,
    color: 'from-sky-500 to-sky-600',
    href: 'forms',
    category: 'شكاوى',
    rating: 4.1,
    reviews: 67,
    estimatedTime: '48 ساعة',
    views: 920,
  },
  {
    id: '7',
    title: 'تراخيص المهن والمحلات',
    description: 'إصدار وتجديد تراخيص المحلات التجارية والمهن الحرفية والصناعية.',
    icon: Zap,
    color: 'from-indigo-500 to-indigo-600',
    href: 'forms',
    category: 'تراخيص',
    isPopular: true,
    rating: 4.5,
    reviews: 54,
    estimatedTime: '3 أيام',
    views: 850,
  },
  {
    id: '8',
    title: 'البطاقات الصحية للمنشآت',
    description: 'إصدار بطاقات صحية للمنشآت الغذائية والتجارية وفقاً للاشتراطات الصحية.',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    href: 'forms',
    category: 'صحة',
    rating: 4.4,
    reviews: 28,
    estimatedTime: '48 ساعة',
    views: 620,
  },
];

// ============================================================
// المكونات الفرعية
// ============================================================

// بطاقة الخدمة ثلاثية الأبعاد
const ServiceCard3D = memo(function ServiceCard3D({
  service,
  onNavigate,
  theme,
}: {
  service: Service;
  onNavigate: (page: string) => void;
  theme?: 'light' | 'dark';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const Icon = service.icon;
  const isDark = theme === 'dark';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`group relative card-3d cursor-pointer ${
        isDark ? 'text-gray-100' : 'text-gray-800'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onNavigate(service.href)}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="card-3d-inner relative h-full"
        style={{
          transform: isHovered
            ? `rotateX(${mousePos.y * -5}deg) rotateY(${mousePos.x * 5}deg) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* الخلفية المتدرجة */}
        <div className={`absolute inset-0 rounded-3xl border transition-all duration-500 ${
          isDark
            ? 'bg-gray-800/90 border-gray-700/50'
            : 'bg-white/90 border-gray-100/50'
        } ${isHovered ? 'shadow-2xl' : 'shadow-lg'}`} />

        {/* تأثير اللمعان */}
        <div
          className="card-3d-shine"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
              : 'none',
          }}
        />

        {/* المحتوى */}
        <div className="relative p-6">
          {/* الأيقونة */}
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl transition-all duration-500"
            style={{
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl`} />
            <Icon size={28} className="text-white relative z-10" />
            
            {/* تأثير التوهج */}
            {isHovered && (
              <div className="absolute inset-0 rounded-2xl animate-glow-pulse" />
            )}
          </div>

          {/* العنوان */}
          <h3 className={`text-lg font-bold mb-2 line-clamp-2 transition-colors duration-300 ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {service.title}
          </h3>

          {/* الوصف */}
          <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {service.description}
          </p>

          {/* الشارات */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              isDark ? 'bg-gov-700 text-gov-200' : 'bg-gov-50 text-gov-600'
            }`}>
              {service.category}
            </span>
            {service.isPopular && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                <Star size={10} className="fill-amber-500" />
                الأكثر طلباً
              </span>
            )}
            {service.isNew && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <Sparkles size={10} />
                جديد
              </span>
            )}
          </div>

          {/* المؤشرات */}
          <div className={`flex items-center justify-between text-xs border-t pt-3 ${
            isDark ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'
          }`}>
            {service.rating && (
              <span className="flex items-center gap-1">
                <Award size={12} className="text-amber-500" />
                {service.rating.toFixed(1)}
              </span>
            )}
            {service.estimatedTime && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {service.estimatedTime}
              </span>
            )}
            {service.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {service.views.toLocaleString()}
              </span>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(service.href);
              }}
              className="flex-1 py-2 bg-gradient-to-r from-gov-600 to-gov-700 hover:from-gov-700 hover:to-gov-800 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
            >
              <ExternalLink size={12} />
              عرض الخدمة
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 bg-gold-50 hover:bg-gold-100 text-gold-700 rounded-lg transition-all"
            >
              <BookmarkCheck size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// المكون الرئيسي
// ============================================================

export const ServicesSection = memo(function ServicesSection({
  services: externalServices,
  onNavigate,
  theme = 'light',
  title = 'خدماتنا الهندسية والفنية',
  subtitle = 'نقدم مجموعة متكاملة من الخدمات وفق أحدث المعايير واللوائح النافذة',
  className = '',
}: ServicesSectionProps) {
  const services = useMemo(() => externalServices || DEFAULT_SERVICES, [externalServices]);
  const isDark = theme === 'dark';

  return (
    <section className={`py-16 lg:py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-hidden ${className}`}>
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* الهيدر */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gov-50 border border-gov-100 px-4 py-2 rounded-full mb-4">
              <HardHat size={18} className="text-gov-600" />
              <span className="text-sm font-bold text-gov-700">بوابة الخدمات الهندسية</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* شبكة الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <ScrollReveal key={service.id} delay={idx * 80}>
              <ServiceCard3D
                service={service}
                onNavigate={onNavigate || (() => {})}
                theme={theme}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate?.('services')}
            className="px-8 py-3 bg-gradient-to-r from-gov-600 to-gov-700 hover:from-gov-700 hover:to-gov-800 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
          >
            <Sparkles size={18} />
            عرض جميع الخدمات
          </button>
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';
export default ServicesSection;