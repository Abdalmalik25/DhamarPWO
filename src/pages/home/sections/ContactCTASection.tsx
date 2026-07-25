// ============================================================
// ContactCTASection.tsx v6.0 - Platinum Interactive
// قسم التواصل - تصميم تفاعلي متقدم مع تأثيرات 3D
// ============================================================

import { memo, useState, useCallback, useRef } from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  ExternalLink,
  ChevronLeft,
  Copy,
  CheckCheck,
} from 'lucide-react';

export interface ContactCTASectionProps {
  onNavigate?: (page: string) => void;
  theme?: 'light' | 'dark';
  className?: string;
}

const CONTACT_INFO = {
  phone: '06-521222',
  mobile: '777-888-198',
  email: 'dpw.dhamar@yemen.gov.ye',
  address: 'مدينة ذمار - شارع الحسينية جوار مكتب الجمارك',
  workingDays: 'السبت - الأربعاء',
  workingHours: '8:00 صباحاً - 2:00 مساءً',
};

const ContactCard3D = memo(function ContactCard3D({
  icon: Icon,
  title,
  value,
  link,
  color,
  index,
  theme,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  link?: string;
  color: string;
  index: number;
  theme?: 'light' | 'dark';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

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

  const content = link ? (
    <a href={link} className="text-sm font-bold text-gov-600 hover:text-gov-700 transition-colors">
      {value}
    </a>
  ) : (
    <span className="text-sm font-bold text-gray-800">{value}</span>
  );

  return (
    <div
      ref={cardRef}
      className={`group relative card-3d cursor-pointer ${
        isDark ? 'text-gray-100' : 'text-gray-800'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="card-3d-inner relative h-full"
        style={{
          transform: isHovered
            ? `rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div
          className={`absolute inset-0 rounded-3xl border-2 transition-all duration-500 ${
            isDark
              ? 'bg-gray-800/90 border-gray-700/50'
              : 'bg-white/90 border-gray-100/50'
          } ${isHovered ? 'shadow-2xl' : 'shadow-lg'}`}
        />

        <div
          className="card-3d-shine"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
              : 'none',
          }}
        />

        <div className="relative p-6 flex items-start gap-4">
          <div
            className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Icon size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {title}
            </h3>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
});

export const ContactCTASection = memo(function ContactCTASection({
  onNavigate,
  theme = 'light',
  className = '',
}: ContactCTASectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const contactItems = [
    {
      icon: Phone,
      title: 'الهاتف',
      value: CONTACT_INFO.phone,
      link: `tel:${CONTACT_INFO.phone}`,
      color: 'from-emerald-600 to-teal-600',
      field: 'phone',
    },
    {
      icon: MessageCircle,
      title: 'الجوال',
      value: CONTACT_INFO.mobile,
      link: `tel:${CONTACT_INFO.mobile}`,
      color: 'from-blue-600 to-indigo-600',
      field: 'mobile',
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: CONTACT_INFO.email,
      link: `mailto:${CONTACT_INFO.email}`,
      color: 'from-amber-600 to-orange-600',
      field: 'email',
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: CONTACT_INFO.address,
      color: 'from-red-600 to-rose-600',
      field: 'address',
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: `${CONTACT_INFO.workingDays} | ${CONTACT_INFO.workingHours}`,
      color: 'from-purple-600 to-violet-600',
      field: 'hours',
    },
  ];

  return (
    <section className={`py-16 lg:py-20 ${isDark ? 'bg-gray-900' : 'bg-white'} relative overflow-hidden ${className}`}>
      {/* خلفية */}
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
              <MessageCircle size={18} className="text-gov-600" />
              <span className="text-sm font-bold text-gov-700">تواصل معنا</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              نحن هنا لمساعدتك
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              تواصل معنا مباشرة أو زرنا في مقر المكتب خلال ساعات العمل الرسمية
            </p>
          </div>
        </ScrollReveal>

        {/* بطاقات التواصل */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactItems.map((item, idx) => (
            <ScrollReveal key={item.field} delay={idx * 80}>
              <div className="relative group">
                <ContactCard3D
                  icon={item.icon}
                  title={item.title}
                  value={item.value}
                  link={item.link}
                  color={item.color}
                  index={idx}
                  theme={theme}
                />
                
                {/* زر النسخ */}
                {!item.link && (
                  <button
                    onClick={() => handleCopy(item.value, item.field)}
                    className="absolute top-4 left-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                    aria-label="نسخ"
                  >
                    {copiedField === item.field ? (
                      <CheckCheck size={16} className="text-emerald-600" />
                    ) : (
                      <Copy size={16} className="text-gray-600" />
                    )}
                  </button>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA الرئيسي */}
        <ScrollReveal delay={300}>
          <div className={`relative rounded-3xl p-8 md:p-12 overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
              : 'bg-gradient-to-br from-gov-50 to-white border-2 border-gov-100'
          }`}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-gold-300 px-4 py-2 rounded-full mb-6">
                <Send size={18} className="text-gold-600" />
                <span className="text-sm font-bold text-gold-700">جاهز للتواصل</span>
              </div>

              <h3 className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                هل تحتاج إلى مساعدة؟
              </h3>
              <p className={`max-w-2xl mx-auto mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                فريقنا جاهز لمساعدتك في جميع الخدمات الهندسية والإدارية. لا تتردد في الاتصال بنا.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => window.location.href = `tel:${CONTACT_INFO.phone}`}
                  className="px-8 py-4 bg-gradient-to-r from-gov-600 to-gov-700 hover:from-gov-700 hover:to-gov-800 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  <Phone size={20} />
                  اتصل بنا الآن
                </button>

                <button
                  onClick={() => window.location.href = `mailto:${CONTACT_INFO.email}`}
                  className="px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  <Mail size={20} />
                  راسلنا
                </button>

                <button
                  onClick={() => onNavigate?.('contact')}
                  className="px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  <ExternalLink size={20} />
                  صفحة التواصل
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* معلومات إضافية */}
              <div className={`mt-8 pt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      متاحون للرد خلال 24 ساعة
                    </span>
                  </div>
                  <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    استجابة سريعة لجميع الاستفسارات
                  </span>
                  <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    خدمات متكاملة للمواطنين
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

ContactCTASection.displayName = 'ContactCTASection';
export default ContactCTASection;