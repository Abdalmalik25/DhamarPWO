// ============================================================
// ContactPage.tsx - صفحة تواصل معنا (قنوات الاتصال المتكاملة v4.0)
// الإصدار الاحترافي المطوّر - مكتب الأشغال العامة والطرق - ذمار
// ============================================================

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Phone, Mail, MapPin, Clock, ChevronLeft, ExternalLink,
  Send, CheckCircle2, MessageSquare, Globe,
  Printer, FileText, HelpCircle, ChevronDown,
  Landmark, ArrowUpRight, Network,
  Copy, Check, Shield, BadgeCheck,
} from 'lucide-react';
import { useNavigation } from '../components/NavigationHistory';
import DhamarMap from '../components/DhamarMap';

// ============================================================
// 1. مكون ScrollReveal
// ============================================================
function ScrollReveal({
  children, className = '', delay = 0,
}: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.unobserve(node); } },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
}

// ============================================================
// 2. البيانات
// ============================================================

const CONTACT_DATA = {
  address: 'شارع الحسينية - جوار مكتب الجمارك',
  plusCode: 'H96P+9VX',
  city: 'مدينة ذمار، محافظة ذمار',
  country: 'الجمهورية اليمنية',
  phone: '06-425186',
  phoneCode: '06425186',
  mobile: '777-888-000',
  email: 'info@pwo-dhamar.gov.ye',
  website: 'www.pwo-dhamar.gov.ye',
  coordinates: [14.54293, 44.40458] as [number, number],
  workDays: 'السبت - الأربعاء',
  workHours: '8:00 صباحاً - 2:00 ظهراً',
  responseTime: 'خلال 24 ساعة',
  founded: '1979',
  employees: '320',
  branches: '12',
};

const BRANCHES = [
  { name: 'المقر الرئيسي - ذمار', address: 'شارع الحسينية - جوار الجمارك', phone: '06-425186', hours: '8ص - 2م' },
  { name: 'فرع مدينة ذمار', address: 'حي السوق القديم', phone: '06-425187', hours: '8ص - 2م' },
  { name: 'فرع مديرية جهران', address: 'وسط المديرية - جوار المجلس المحلي', phone: '06-425188', hours: '8ص - 2م' },
  { name: 'فرع مديرية عتمة', address: 'مركز المديرية', phone: '06-425189', hours: '8ص - 2م' },
  { name: 'فرع مديرية وصاب', address: 'مركز المديرية - طريق الرئيسي', phone: '06-425190', hours: '8ص - 2م' },
  { name: 'فرع مديرية الحداء', address: 'مركز المديرية', phone: '06-425191', hours: '8ص - 2م' },
];

const FAQS = [
  { q: 'ما هي أوقات الدوام الرسمي؟', a: 'من الساعة 8:00 صباحاً إلى 2:00 ظهراً، من السبت إلى الأربعاء. الخميس والجمعة عطلة رسمية.' },
  { q: 'كيف يمكنني تقديم شكوى أو اقتراح؟', a: 'يمكنكم التواصل عبر نموذج المراسلة في هذه الصفحة، أو عبر الهاتف 06-425186، أو بزيارة مكتب خدمة الجمهور في المقر الرئيسي.' },
  { q: 'هل يمكن حجز موعد مسبق؟', a: 'نعم، يمكن حجز موعد عبر الاتصال على 06-425186 أو عبر نموذج التواصل الإلكتروني، وسيتم تأكيد الموعد خلال 24 ساعة.' },
  { q: 'كيف أتقدم بطلب للحصول على مستند رسمي؟', a: 'يتم تقديم الطلب عبر مركز خدمة الجمهور في المقر الرئيسي أو أقرب فرع، مرفقاً بالوثائق المطلوبة حسب نوع الخدمة.' },
];

// ============================================================
// 3. المكون الرئيسي
// ============================================================

export default function ContactPage() {
  const { navigate } = useNavigation();
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = useMemo(() => (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('success'), 1500);
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }} dir="rtl">
      {/* ============================== */}
      {/* 1. الهيدر الرئيسي المطور       */}
      {/* ============================== */}
      <div className="relative bg-gradient-to-l from-gov-950 via-gov-900 to-gov-950 text-white pt-10 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        </div>
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-gradient-to-br from-gold-500 to-gold-700 rounded-full blur-3xl opacity-[0.12] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-gradient-to-br from-blue-600 to-blue-800 rounded-full blur-3xl opacity-[0.1] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gov-950/50" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-l from-gold-500 via-gold-400 to-gold-500 shadow-lg" />

        <div className="relative max-w-7xl mx-auto px-4">
          <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors group">
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">العودة للرئيسية</span>
          </button>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
              <MessageSquare size={38} className="text-gold-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-medium">
                  <BadgeCheck size={12} className="text-gold-400" />
                  خدمة المتعاملين
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium text-emerald-300">
                  <Clock size={12} />
                  الرد خلال {CONTACT_DATA.responseTime}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 leading-tight">
                تواصل معنا
              </h1>
              <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">
                نضع قنوات التواصل بين يديك - فريقنا جاهز للاستماع لك والرد على استفساراتك في أقرب وقت ممكن
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-14 relative z-10">
        {/* ============================== */}
        {/* 2. Bento Grid - بطاقات التواصل  */}
        {/* ============================== */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
            {[
              { icon: Phone, title: 'اتصل بنا', value: CONTACT_DATA.phone, sub: 'السبت - الأربعاء 8ص - 2م', href: `tel:+967${CONTACT_DATA.phoneCode}`, bg: 'bg-gradient-to-br from-blue-50 to-blue-100/60', iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600', iconColor: 'text-white', border: 'border-blue-200' },
              { icon: Mail, title: 'راسلنا', value: CONTACT_DATA.email, sub: `الرد ${CONTACT_DATA.responseTime}`, href: `mailto:${CONTACT_DATA.email}`, bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/60', iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', iconColor: 'text-white', border: 'border-emerald-200' },
              { icon: MapPin, title: 'زورنا', value: CONTACT_DATA.address, sub: CONTACT_DATA.city, bg: 'bg-gradient-to-br from-amber-50 to-amber-100/60', iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600', iconColor: 'text-white', border: 'border-amber-200' },
              { icon: Clock, title: 'أوقات الدوام', value: CONTACT_DATA.workDays, sub: CONTACT_DATA.workHours, bg: 'bg-gradient-to-br from-purple-50 to-purple-100/60', iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600', iconColor: 'text-white', border: 'border-purple-200' },
              ].map((card, index) => {
                const spans = index === 0 ? 'md:col-span-2' : index === 3 ? 'md:col-span-2' : '';
                return (
                  <div key={card.title} className={`${card.bg} ${card.border} rounded-2xl p-5 border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${spans}`}>
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                    <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all relative`}>
                      <card.icon size={24} className={card.iconColor} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1 relative">{card.title}</h3>
                    {card.href ? (
                      <a href={card.href} className="text-sm font-bold text-gov-600 hover:underline block truncate relative">{card.value}</a>
                    ) : (
                      <div className="text-sm font-bold text-gray-800 relative">{card.value}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1 relative">{card.sub}</div>
                  </div>
                );
              })}
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 3. المحتوى الرئيسي: نموذج + خريطة */}
        {/* ============================== */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          {/* نموذج المراسلة */}
          <ScrollReveal delay={100}>
            <div className="md:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gov-600 to-gov-700 rounded-xl flex items-center justify-center shadow-md">
                  <Send size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800">أرسل لنا رسالة</h2>
                  <p className="text-xs text-gray-500">نحن نقرأ كل رسالة ونتواصل معك في أقرب وقت</p>
                </div>
              </div>

              {formStatus === 'success' ? (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200 rounded-2xl p-8 text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">تم إرسال رسالتك بنجاح</h3>
                  <p className="text-emerald-600 text-sm">سيتم الرد عليك خلال {CONTACT_DATA.responseTime}. شكراً لتواصلك معنا.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">الاسم الكامل <span className="text-red-500">*</span></label>
                      <input type="text" required placeholder="أدخل اسمك الكامل"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-gov-500 focus:ring-2 focus:ring-gov-100 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">البريد الإلكتروني <span className="text-red-500">*</span></label>
                      <input type="email" required placeholder="example@email.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-gov-500 focus:ring-2 focus:ring-gov-100 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الهاتف</label>
                      <input type="tel" placeholder="+967 XXX XXX XXX"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-gov-500 focus:ring-2 focus:ring-gov-100 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">الموضوع <span className="text-red-500">*</span></label>
                      <select required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-gov-500 focus:ring-2 focus:ring-gov-100 outline-none transition-all bg-white">
                        <option value="">اختر موضوع الرسالة</option>
                        <option value="inquiry">استفسار عام</option>
                        <option value="complaint">شكوى</option>
                        <option value="suggestion">اقتراح</option>
                        <option value="request">طلب خدمة</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">الرسالة <span className="text-red-500">*</span></label>
                    <textarea required rows={5} placeholder="اكتب رسالتك هنا..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-gov-500 focus:ring-2 focus:ring-gov-100 outline-none transition-all resize-none" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">الحقول الموسومة بـ <span className="text-red-500">*</span> إلزامية</p>
                    <button type="submit" disabled={formStatus === 'sending'}
                      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gov-600 to-gov-700 hover:from-gov-700 hover:to-gov-800 text-white font-bold rounded-xl transition-all text-sm shadow-lg hover:shadow-xl ${
                        formStatus === 'sending' ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
                      }`}>
                      {formStatus === 'sending' ? (
                        <>جاري الإرسال...</>
                      ) : (
                        <><Send size={16} /> إرسال الرسالة</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* معلومات التواصل الجانبية */}
          <ScrollReveal delay={150}>
            <div className="md:col-span-2 space-y-4">
              {/* الهاتف */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Phone size={18} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">رقم الهاتف</h3>
                  </div>
                  <button onClick={() => handleCopy(CONTACT_DATA.phone, 'phone')} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {copiedField === 'phone' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
                <a href={`tel:+967${CONTACT_DATA.phoneCode}`} className="text-gov-600 font-bold text-base hover:underline block">{CONTACT_DATA.phone}</a>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Clock size={12} /> {CONTACT_DATA.workDays} | {CONTACT_DATA.workHours}
                </div>
              </div>

              {/* البريد */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                      <Mail size={18} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">البريد الإلكتروني</h3>
                  </div>
                  <button onClick={() => handleCopy(CONTACT_DATA.email, 'email')} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {copiedField === 'email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
                <a href={`mailto:${CONTACT_DATA.email}`} className="text-gov-600 font-bold text-base hover:underline block">{CONTACT_DATA.email}</a>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <CheckCircle2 size={12} className="text-emerald-500" /> الرد {CONTACT_DATA.responseTime}
                </div>
              </div>

              {/* العنوان */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">العنوان</h3>
                  </div>
                  <button onClick={() => handleCopy(`${CONTACT_DATA.address}, ${CONTACT_DATA.city}`, 'address')} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {copiedField === 'address' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="text-gray-800 font-bold text-sm">{CONTACT_DATA.address}</div>
                <div className="text-xs text-gray-500 mt-1">{CONTACT_DATA.city}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{CONTACT_DATA.plusCode} · {CONTACT_DATA.country}</div>
              </div>

              {/* أوقات الدوام */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">أوقات الدوام</h3>
                    <div className="text-[10px] text-gray-400">العطل الرسمية: الخميس والجمعة</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'].map((day) => (
                    <div key={day} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{day}</span>
                      <span className="text-gray-800 font-semibold">8:00 ص - 2:00 م</span>
                    </div>
                  ))}
                  {['الخميس', 'الجمعة'].map((day) => (
                    <div key={day} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{day}</span>
                      <span className="text-red-500 font-semibold">عطلة رسمية</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* روابط سريعة */}
              <div className="bg-gradient-to-br from-gov-700 to-gov-800 rounded-2xl p-5 text-white shadow-lg">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Globe size={16} className="text-gold-300" />
                  روابط سريعة
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'الخدمات الإلكترونية', href: '#', icon: FileText },
                    { label: 'النماذج الرسمية', href: '#', icon: Printer },
                    { label: 'تتبع معاملة', href: '#', icon: Shield },
                    { label: 'سياسة الخصوصية', href: '#', icon: CheckCircle2 },
                  ].map((link) => {
                    const Icon = link.icon;
                    return (
                      <a key={link.label} href={link.href}
                        className="flex items-center justify-between text-xs text-white/80 hover:text-white transition-colors py-1.5 border-b border-white/10 last:border-0">
                        <span className="flex items-center gap-2">
                          <Icon size={12} />
                          {link.label}
                        </span>
                        <ArrowUpRight size={12} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ============================== */}
        {/* 4. فروع المكتب                  */}
        {/* ============================== */}
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gov-600 to-gov-700 rounded-xl flex items-center justify-center shadow-md">
                <Network size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800">فروعنا في المحافظة</h2>
                <p className="text-xs text-gray-500">{CONTACT_DATA.branches} فرعاً موزعة على مديريات محافظة ذمار</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BRANCHES.map((branch, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 hover:shadow-lg hover:border-gov-200 hover:-translate-y-1 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gov-600 to-gov-700 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                      <Landmark size={16} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{branch.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{branch.address}</p>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Phone size={10} /> {branch.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {branch.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 5. الأسئلة الشائعة               */}
        {/* ============================== */}
        <ScrollReveal delay={250}>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 mb-12">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 bg-gov-50 px-4 py-2 rounded-full text-sm font-bold text-gov-700 mb-3">
                <HelpCircle size={16} />
                أسئلة شائعة حول التواصل
              </span>
              <h2 className="text-2xl font-black text-gray-800">استفسارات التواصل والخدمات</h2>
              <p className="text-gray-500 text-sm mt-2">أجوبة سريعة عن أكثر الأسئلة شيوعاً</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-right bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-bold text-sm text-gray-700">{faq.q}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 py-4 border-t border-gray-200 text-sm text-gray-600 leading-relaxed bg-white">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 6. الخريطة التفاعلية             */}
        {/* ============================== */}
        <ScrollReveal delay={300}>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-100 bg-gov-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MapPin size={22} className="text-gov-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gov-800">موقع المكتب على الخريطة</h2>
                    <p className="text-xs text-gray-500">{CONTACT_DATA.plusCode} - {CONTACT_DATA.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'خرائط جوجل', href: `https://maps.google.com/?q=${CONTACT_DATA.coordinates[0]},${CONTACT_DATA.coordinates[1]}` },
                    { label: 'OpenStreetMap', href: `https://www.openstreetmap.org/?mlat=${CONTACT_DATA.coordinates[0]}&mlon=${CONTACT_DATA.coordinates[1]}#map=18/${CONTACT_DATA.coordinates[0]}/${CONTACT_DATA.coordinates[1]}` },
                  ].map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-gov-600 hover:text-gov-700 font-semibold flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                      {link.label} <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4">
              <DhamarMap compact className="h-64 sm:h-80 rounded-xl" />
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-gray-500">الإحداثيات: {CONTACT_DATA.coordinates[0]}, {CONTACT_DATA.coordinates[1]} (WGS84)</p>
              <p className="text-xs text-gray-500">انقر على الخريطة للتفاعل - استخدم التكبير والتصغير</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="h-8" />
      </div>
    </div>
  );
}