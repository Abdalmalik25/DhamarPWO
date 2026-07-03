// ============================================================
// AboutPage.tsx - صفحة من نحن (الهوية المؤسسية المتكاملة v3.0)
// الإصدار الاحترافي الشامل - مكتب الأشغال العامة والطرق - ذمار
// ============================================================

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Building2, Users, Award, Target, Eye, Shield, Clock, MapPin,
  Phone, Mail, ExternalLink, ChevronLeft, HardHat, FileText,
  Compass, HeartHandshake, TrendingUp, Leaf, Zap, CheckCircle2,
  Star, BookOpen, Scale, Landmark, Flag, Globe, ChevronDown,
  BarChart3, Briefcase, Network, Lightbulb,
  GraduationCap, Handshake, ArrowUpRight, Quote,
  Layers, GitBranch, Calendar, Search,
} from 'lucide-react';
import { useNavigation } from '../components/NavigationHistory';
import DhamarMap from '../components/DhamarMap';

// ============================================================
// 1. مكون ScrollReveal محسّن
// ============================================================
function ScrollReveal({
  children, className = '', delay = 0, threshold = 0.1
}: {
  children: React.ReactNode; className?: string; delay?: number; threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.unobserve(node); } },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, [delay, threshold]);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
}

// ============================================================
// 2. مكون عداد متحرك
// ============================================================
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.unobserve(node); } },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  useEffect(() => {
    if (!started) return;
    const num = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0;
    const step = Math.ceil(num / 30);
    const interval = setInterval(() => {
      start += step;
      if (start >= num) { clearInterval(interval); setDisplay(value); }
      else setDisplay(start + suffix);
    }, 40);
    return () => clearInterval(interval);
  }, [started, value, suffix]);

  return <span ref={ref} className="tabular-nums">{display}</span>;
}

// ============================================================
// 3. البيانات المؤسسية الشاملة
// ============================================================

const INSTITUTIONAL_DATA = {
  name: 'مكتب الأشغال العامة والطرق - محافظة ذمار',
  shortName: 'مكتب الأشغال العامة والطرق',
  established: '1979',
  headquarters: 'H96P+9VX، مدينة ذمار، محافظة ذمار، الجمهورية اليمنية',
  phone: '06-425186',
  phoneCode: '06425186',
  email: 'info@pwo-dhamar.gov.ye',
  website: 'https://www.pwo-dhamar.gov.ye',
  coordinates: [14.54293, 44.40458] as [number, number],
  manager: 'المهندس / معاذ عبدالله محمد الشوكاني',
  managerTitle: 'مدير عام المكتب',
  employees: '320',
  engineers: '85',
  servicesCount: '16',
  branches: '12',
  annualLicenses: '2,000',
  urbanPlans: '152',
};

// ============================================================
// 4. المكون الرئيسي
// ============================================================

export default function AboutPage() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'identity' | 'team' | 'achievements' | 'services'>('identity');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // === الإحصائيات الأساسية ===
  const stats = useMemo(() => [
    { label: 'عاماً من الخدمة المؤسسية', value: '45', icon: Calendar, color: 'from-gov-600 to-gov-700' },
    { label: 'موظف ومهندس', value: '320', icon: Users, color: 'from-emerald-500 to-emerald-600' },
    { label: 'مخططاً عمرانياً', value: '152', icon: Layers, color: 'from-blue-500 to-blue-600' },
    { label: 'رخصة بناء سنوياً', value: '2,000+', icon: FileText, color: 'from-amber-500 to-amber-600' },
    { label: 'فرعاً ميدانياً', value: '12', icon: GitBranch, color: 'from-purple-500 to-purple-600' },
    { label: 'خدمة هندسية متكاملة', value: '16', icon: Compass, color: 'from-cyan-500 to-cyan-600' },
    { label: 'مشروع طرق منفذ', value: '283k', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
    { label: 'نشاط تجاري منظم', value: '4,245', icon: Briefcase, color: 'from-rose-500 to-rose-600' },
  ], []);

  // === الهوية المؤسسية ===
  const identity = useMemo(() => ({
    mission: 'نعمل كجهة حكومية رائدة في تنظيم قطاع التشييد والبناء وإدارة مشاريع البنية التحتية بمحافظة ذمار، نلتزم بتقديم خدمات هندسية وإدارية عالية الجودة وفق أعلى معايير الشفافية والكفاءة والعدالة، ونسعى لتطوير البيئة العمرانية المستدامة وتلبية احتياجات المجتمع المحلي والمستثمرين.',
    vision: 'نطمح لأن نكون النموذج الحكومي الرائد في تقديم الخدمات الهندسية المتكاملة على مستوى الجمهورية، من خلال التحول الرقمي الشامل، وتطبيق مبادئ الحوكمة المؤسسية، وبناء شراكات فعالة مع جميع القطاعات، والوصول إلى نظام عمراني متطور يواكب رؤية التنمية الوطنية.',
    values: [
      { name: 'النزاهة والشفافية', icon: Shield, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', desc: 'نعمل بشفافية كاملة ونخضع للمساءلة في جميع الإجراءات' },
      { name: 'الجودة والاحترافية', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'نلتزم بأعلى معايير الجودة الهندسية والمؤسسية' },
      { name: 'الابتكار والتطوير', icon: Lightbulb, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', desc: 'نتبنى التقنيات الحديثة والحلول المبتكرة' },
      { name: 'المسؤولية المجتمعية', icon: HeartHandshake, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'نضع خدمة المجتمع والتنمية المستدامة في صميم عملنا' },
      { name: 'العمل المؤسسي', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'نبني فرق عمل متكاملة وروح التعاون المؤسسي' },
      { name: 'التميز والريادة', icon: Award, color: 'text-gold-600', bg: 'bg-gold-50', border: 'border-gold-200', desc: 'نسعى للتميز والريادة في جميع مجالات العمل الهندسي' },
    ],
  }), []);

  // === الفريق القيادي ===
  const leadership = useMemo(() => [
    { name: 'م. معاذ عبدالله الشوكاني', role: 'مدير عام المكتب', phone: '06-425186', email: 'moath@pwo-dhamar.gov.ye', initial: 'م', highlight: true },
    { name: 'م. أحمد محمد المنصور', role: 'نائب مدير المكتب لشؤون الطرق', phone: '777-888-199', email: 'ahmed@pwo-dhamar.gov.ye', initial: 'أ' },
    { name: 'م. عبدالله حسين القاضي', role: 'رئيس قسم التراخيص الهندسية', phone: '777-888-200', email: 'abdullah@pwo-dhamar.gov.ye', initial: 'ع' },
    { name: 'م. محمد يحيى الحمزي', role: 'رئيس قسم الرقابة الفنية', phone: '777-888-201', email: 'mohammed@pwo-dhamar.gov.ye', initial: 'م' },
    { name: 'م. علي صالح العنسي', role: 'رئيس قسم التخطيط العمراني', phone: '777-888-202', email: 'ali@pwo-dhamar.gov.ye', initial: 'ع' },
    { name: 'م. يحيى عبدالملك', role: 'مهندس مشاريع أول', phone: '777-888-203', email: 'yahya@pwo-dhamar.gov.ye', initial: 'ي' },
  ], []);

  // === الإنجازات ===
  const achievements = useMemo(() => [
    { year: '2026', title: 'الريادة المؤسسية في تنظيم العمران', desc: 'إنجاز 10 وحدات جوار جديدة، وتطوير النظام الإلكتروني المتكامل للتراخيص، وتدريب 45 مهندساً على نظام المعلومات الجغرافي GIS.', icon: Award, color: 'from-gold-500 to-gold-600' },
    { year: '2025', title: 'التحول الرقمي الشامل', desc: 'أتمتة 100% من إجراءات إصدار تراخيص البناء، وربط جميع الإدارات إلكترونياً، وإطلاق منصة المتابعة الذكية للمعاملات.', icon: Zap, color: 'from-blue-500 to-blue-600' },
    { year: '2024', title: 'توسعة شبكة الخدمات', desc: 'افتتاح 3 فروع جديدة في مديريات عتمة، وصبر الموادم، وميفعة عنس. وتطوير مركز خدمة الجمهور بنظام الانتظار الذكي.', icon: Handshake, color: 'from-emerald-500 to-emerald-600' },
    { year: '2023', title: 'مركز خدمة الجمهور المتطور', desc: 'افتتاح المركز الجديد وتقليص زمن إنجاز المعاملة من 14 إلى 5 أيام عمل، ورفع معدل رضا المستفيدين إلى 94%.', icon: Compass, color: 'from-purple-500 to-purple-600' },
    { year: '2022', title: 'مشاريع البنية التحتية', desc: 'رصف وتأهيل 283,000 م² من شوارع مدينة ذمار، وإنشاء جسر المشاة في التقاطع الغربي، وتطوير شبكة الإنارة العامة.', icon: HardHat, color: 'from-orange-500 to-orange-600' },
    { year: '2021', title: 'الرقابة الصحية وتعزيز الأمن الغذائي', desc: 'تنفيذ 764 زيارة رقابية، وإصدار 911 بطاقة صحية، ومصادرة 812 كجم من المواد غير الصالحة، وضبط 45 مخالفة.', icon: Shield, color: 'from-red-500 to-red-600' },
    { year: '2020', title: 'إطلاق المنصة الإلكترونية', desc: 'انطلقت مسيرة التحول الرقمي بإطلاق الموقع الرسمي والمنصة الإلكترونية للخدمات، مما مهد الطريق للأتمتة الشاملة.', icon: Globe, color: 'from-cyan-500 to-cyan-600' },
  ], []);

  // === الخدمات المؤسسية ===
  const services = useMemo(() => [
    { name: 'الرقابة على البناء', icon: HardHat, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', items: ['إصدار تراخيص البناء', 'فحص المخططات الهندسية', 'الإشراف على التنفيذ', 'رصد المخالفات العمرانية'] },
    { name: 'التخطيط العمراني', icon: Compass, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', items: ['تحديث المخططات الحضرية', 'إنشاء وحدات جوار', 'تنظيم التوسع السكاني', 'الحفاظ على المخطط الحضري'] },
    { name: 'التحول الرقمي', icon: Zap, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', items: ['أتمتة نظام التراخيص', 'قاعدة بيانات موحدة', 'الحصر الإلكتروني', 'ربط الإدارات إلكترونياً'] },
    { name: 'الرقابة الصحية', icon: Leaf, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', items: ['زيارات رقابية للمنشآت', 'إصدار البطاقات الصحية', 'مصادرة المواد غير الصالحة', 'حماية صحة المستهلك'] },
    { name: 'صيانة الطرق', icon: TrendingUp, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', items: ['رصف وصيانة الطرق', 'تأهيل الشوارع الرئيسية', 'مسح وتسوية الشوارع', 'مشاريع البنية التحتية'] },
    { name: 'ترخيص الأنشطة', icon: FileText, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', items: ['إصدار رخص الأنشطة', 'تجديد التراخيص', 'ضبط المخالفات التجارية', 'قاعدة بيانات المكلفين'] },
    { name: 'الاستشارات الهندسية', icon: Search, bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', items: ['استشارات فنية وهندسية', 'دراسات الجدوى', 'الإشراف على المشاريع', 'إعداد المواصفات الفنية'] },
    { name: 'التدريب والتأهيل', icon: GraduationCap, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', items: ['برامج تدريبية للكادر', 'ورش عمل فنية', 'نقل المعرفة', 'تطوير المهارات الهندسية'] },
  ], []);

  // === الأسئلة الشائعة ===
  const faqs = useMemo(() => [
    { q: 'ما هي ساعات العمل الرسمية؟', a: 'من الساعة 8:00 صباحاً إلى 2:00 ظهراً، من السبت إلى الأربعاء. الخميس والجمعة عطلة رسمية.' },
    { q: 'كيف يمكنني الحصول على رخصة بناء؟', a: 'يتم تقديم طلب عبر مركز خدمة الجمهور مرفقاً بالمستندات المطلوبة (صورة الملكية، المخططات الهندسية، شهادة صحية). مدة المعالجة 5-7 أيام عمل.' },
    { q: 'ما هي رسوم إصدار رخصة البناء؟', a: 'تحدد الرسوم حسب مساحة البناء والنشاط وفقاً للائحة الرسوم المعتمدة من السلطة المحلية. يمكنكم الاستفسار عبر مركز خدمة الجمهور.' },
    { q: 'هل يمكن متابعة معاملتي إلكترونياً؟', a: 'نعم، من خلال منصة الخدمات الإلكترونية على الموقع الرسمي، يمكنكم إدخال رقم المعاملة ومتابعة حالتها خطوة بخطوة.' },
    { q: 'ما هي الاشتراطات الفنية للبناء في ذمار؟', a: 'يجب الالتزام بكود البناء اليمني، والارتدادات النظامية، والمسافات البينية للجيران، وتوفير مواقف السيارات ضمن المخطط.' },
    { q: 'كيف أبلغ عن مخالفة بناء؟', a: 'يمكنكم الإبلاغ عبر مركز خدمة الجمهور هاتفياً 06-425186 أو عبر نموذج التواصل الإلكتروني في الموقع، ويتم التعامل مع البلاغ بسرية تامة.' },
  ], []);

  // === مؤشرات الأداء ===
  const performanceIndicators = useMemo(() => [
    { indicator: 'مخططات عمرانية منجزة', value: '152 مخططاً', details: '125 بمدينة ذمار، 25 بجهران، 2 بالحداء' },
    { indicator: 'متوسط التراخيص السنوية', value: '2,000+', details: 'تشمل سكني وتجاري وصناعي' },
    { indicator: 'فروع ميدانية نشطة', value: '12 فرعاً', details: 'موزعة على مديريات المحافظة' },
    { indicator: 'نسبة إنجاز المعاملات', value: '94%', details: 'خلال 5 أيام عمل من تاريخ التقديم' },
    { indicator: 'مشاريع الطرق المنجزة', value: '283,000 م²', details: 'رصف وصيانة وتأهيل' },
    { indicator: 'الزيارات الرقابية السنوية', value: '764', details: 'للمنشآت التجارية والغذائية' },
    { indicator: 'الموظفون الحكوميون', value: '320', details: 'كوادر إدارية وفنية وهندسية' },
    { indicator: 'سنوات الخبرة المتراكمة', value: '45+', details: 'منذ تأسيس المكتب 1979م' },
  ], []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }} dir="rtl">
      {/* ============================== */}
      {/* 1. الهيدر الرئيسي المطور       */}
      {/* ============================== */}
      <div className="relative bg-gradient-to-l from-gov-950 via-gov-900 to-gov-950 text-white pt-10 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        </div>
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-gold-500 to-gold-700 rounded-full blur-3xl opacity-[0.12] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-600 to-blue-800 rounded-full blur-3xl opacity-[0.1] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gov-950/50" />
        {/* شريط العلم اليمني */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-l from-red-600 via-white to-black shadow-lg" />

        <div className="relative max-w-7xl mx-auto px-4">
          <button onClick={() => navigate('home')} className="mb-4 flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors group">
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">العودة للرئيسية</span>
          </button>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
              <Building2 size={38} className="text-gold-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-medium">
                  <Flag size={12} className="text-gold-400" />
                  {INSTITUTIONAL_DATA.shortName}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gold-500/20 border border-gold-500/30 px-3 py-1 rounded-full text-xs font-medium text-gold-300">
                  <Clock size={12} />
                  تأسس {INSTITUTIONAL_DATA.established}م
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 leading-tight">
                من نحن
              </h1>
              <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">
                نبض الهوية المؤسسية ورحلة العطاء الهندسي لمكتب الأشغال العامة والطرق بمحافظة ذمار
                - {INSTITUTIONAL_DATA.established} عاماً من التميز والبناء
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-14 relative z-10">
        {/* ============================== */}
        {/* 2. الإحصائيات التفاعلية          */}
        {/* ============================== */}
        <ScrollReveal>
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-all hover:scale-105 group">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-gray-800 mb-1">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-xs font-semibold text-gray-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 3. عرض صورة المبنى المؤسسي        */}
        {/* ============================== */}
        <ScrollReveal delay={100}>
          <div className="relative mb-12 group">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              {/* صورة المبنى */}
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                <img
                  src="/images/office-building.png"
                  alt="مبنى مكتب الأشغال العامة والطرق - محافظة ذمار"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* المحتوى فوق الصورة */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
                      مقرنا الرئيسي
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-4">
                      يقع المقر الرئيسي لمكتب الأشغال العامة والطرق في قلب مدينة ذمار، 
                      حيث يجمع بين الطابع المعماري الحديث والمرافق المتطورة لتقديم أفضل الخدمات للمواطنين.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <a href="https://maps.google.com/?q=14.542930,44.404580" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all text-sm">
                        <MapPin size={14} />
                        <span>موقعنا على الخريطة</span>
                      </a>
                      <a href="tel:+9676425186"
                        className="inline-flex items-center gap-2 bg-gold-500/90 backdrop-blur-md border border-gold-400/30 text-white px-4 py-2 rounded-xl hover:bg-gold-600 transition-all text-sm">
                        <Phone size={14} />
                        <span>اتصل بنا</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* شارة */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 size={16} className="text-gold-400" />
                    <span className="text-xs font-bold">مقر رئيسي معتمد</span>
                  </div>
                </div>
              </div>

              {/* معلومات سريعة */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
                {[
                  { label: 'سنة التأسيس', value: '1979', icon: Calendar },
                  { label: 'المساحة', value: '2,500 م²', icon: Building2 },
                  { label: 'موظفين', value: '320+', icon: Users },
                  { label: 'ساعات عمل', value: '8ص - 2م', icon: Clock },
                ].map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <div key={i} className="bg-white p-4 text-center hover:bg-gray-50 transition-colors">
                      <Icon size={20} className="text-gov-600 mx-auto mb-2" />
                      <div className="text-lg font-black text-gov-900">{info.value}</div>
                      <div className="text-xs text-gray-500">{info.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* تأثيرات زخرفية */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/5 via-blue-500/5 to-gold-500/5 rounded-3xl -z-10 blur-xl" />
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 4. بطاقات المسار المؤسسي        */}
        {/* ============================== */}
        <ScrollReveal delay={100}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-12">
            {[
              { icon: Landmark, title: 'رسالة راسخة', desc: 'نعمل منذ 45 عاماً في تنظيم قطاع التشييد والبناء وإدارة مشاريع البنية التحتية بمحافظة ذمار بكفاءة واقتدار.', color: 'from-gov-600 to-gov-700' },
              { icon: Eye, title: 'رؤية استشرافية', desc: 'نستشرف المستقبل بخطة تطويرية شاملة تهدف للتحول الرقمي الكامل ورفع جودة الخدمات الحكومية.', color: 'from-purple-600 to-purple-700' },
              { icon: Scale, title: 'حوكمة مؤسسية', desc: 'نطبق أعلى معايير الحوكمة والشفافية في جميع الإجراءات الإدارية والمالية والفنية.', color: 'from-emerald-600 to-emerald-700' },
              { icon: Network, title: 'شبكة فروع متكاملة', desc: 'نغطي المحافظة بـ 12 فرعاً ميدانياً تقدم الخدمات الهندسية للمواطنين في مديرياتهم.', color: 'from-blue-600 to-blue-700' },
            ].map((item) => (
              <div key={item.title} className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, ${item.color.split(' ')[0].replace('from-', '')}, ${item.color.split(' ')[1].replace('to-', '')})` }} />
                <div className="relative">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gov-700 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 4. نبذة تعريفية شاملة            */}
        {/* ============================== */}
        <ScrollReveal delay={150}>
          <div className="relative bg-gradient-to-br from-gov-50 via-white to-gov-50 rounded-3xl border border-gov-100 p-8 md:p-10 mb-12 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="relative max-w-5xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 bg-gov-100 px-4 py-2 rounded-full text-sm font-bold text-gov-700 mb-5">
                <BookOpen size={16} />
                نبذة تعريفية
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gov-900 mb-4">
                {INSTITUTIONAL_DATA.name}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                مكتب الأشغال العامة والطرق بمحافظة ذمار هو الجهة الحكومية المخولة بتنظيم قطاع التشييد والبناء،
                وإصدار التراخيص العمرانية، والإشراف على مشاريع الطرق والبنية التحتية في محافظة ذمار.
                يعمل المكتب تحت مظلة السلطة المحلية وبالتنسيق مع وزارة الأشغال العامة والطرق،
                ويضم كوادر هندسية وإدارية مؤهلة تزيد عن <strong className="text-gov-700">320 موظفاً</strong>،
                موزعين على المقر الرئيسي <strong className="text-gov-700">12 فرعاً</strong> في مديريات المحافظة،
                لتقديم خدمات هندسية متكاملة تلبي احتياجات المواطنين والمستثمرين.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                {[
                  { icon: Flag, label: `تأسس عام ${INSTITUTIONAL_DATA.established}م` },
                  { icon: Users, label: `${INSTITUTIONAL_DATA.employees} موظف ومهندس` },
                  { icon: MapPin, label: INSTITUTIONAL_DATA.headquarters.split('،')[0] },
                  { icon: Phone, label: INSTITUTIONAL_DATA.phone },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5">
                    <item.icon size={14} className="text-gov-500" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 5. التبويبات التفاعلية            */}
        {/* ============================== */}
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-12">
            {/* أزرار التبويبات */}
            <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50/50">
              {[
                { id: 'identity', label: 'الهوية المؤسسية', icon: Building2 },
                { id: 'team', label: 'فريق القيادة', icon: Users },
                { id: 'achievements', label: 'الإنجازات', icon: Award },
                { id: 'services', label: 'خدماتنا', icon: Compass },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 font-bold text-sm transition-all min-w-fit ${
                      activeTab === tab.id ? 'bg-white text-gov-700 border-b-2 border-gov-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                    }`}>
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6 md:p-8">
              {/* ===== الهوية المؤسسية ===== */}
              {activeTab === 'identity' && (
                <div className="space-y-6">
                  {/* الرؤية والرسالة */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 rounded-2xl p-6 border border-blue-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                          <Target className="text-white" size={22} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-blue-900">رسالتنا</h3>
                          <p className="text-xs text-blue-500 font-medium">ما نقدمه للمجتمع</p>
                        </div>
                      </div>
                      <p className="text-blue-800 leading-relaxed text-sm">{identity.mission}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/40 rounded-2xl p-6 border border-purple-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                          <Eye className="text-white" size={22} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-purple-900">رؤيتنا</h3>
                          <p className="text-xs text-purple-500 font-medium">طموحنا المستقبلي</p>
                        </div>
                      </div>
                      <p className="text-purple-800 leading-relaxed text-sm">{identity.vision}</p>
                    </div>
                  </div>

                  {/* القيم الجوهرية */}
                  <div className="bg-gradient-to-br from-gold-50 to-gold-100/30 rounded-2xl p-6 border border-gold-200 shadow-sm">
                    <h3 className="text-lg font-black text-gold-900 mb-6 flex items-center gap-2">
                      <Star size={20} className="text-gold-600" />
                      قيمنا الجوهرية
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {identity.values.map((v, i) => {
                        const Icon = v.icon;
                        return (
                          <div key={i} className={`${v.bg} rounded-xl p-4 border ${v.border} hover:shadow-md transition-all`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon size={18} className={v.color} />
                              <span className="font-bold text-gray-800 text-sm">{v.name}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{v.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* مؤشرات الأداء */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="font-bold text-gray-700 flex items-center gap-2">
                        <BarChart3 size={16} className="text-gov-600" />
                        مؤشرات الأداء المؤسسي
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-right font-bold text-gray-600">المؤشر</th>
                            <th className="px-6 py-3 text-center font-bold text-gray-600">القيمة</th>
                            <th className="px-6 py-3 text-right font-bold text-gray-600">التفاصيل</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {performanceIndicators.map((item, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-3 font-medium text-gray-700">{item.indicator}</td>
                              <td className="px-6 py-3 text-center font-bold text-gov-600">{item.value}</td>
                              <td className="px-6 py-3 text-gray-500">{item.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== فريق القيادة ===== */}
              {activeTab === 'team' && (
                <div>
                  <p className="text-gray-500 text-sm mb-6 text-center max-w-2xl mx-auto">
                    قيادات مؤهلة وذات خبرة تقود مسيرة العمل الهندسي والإداري في مكتب الأشغال العامة والطرق بمحافظة ذمار
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leadership.map((member, i) => (
                      <div key={i} className={`rounded-2xl p-6 text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                        member.highlight
                          ? 'bg-gradient-to-br from-gov-600 to-gov-700 text-white border-gov-500 shadow-md'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-lg ${
                          member.highlight ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-gov-600 to-gov-700 text-white'
                        }`}>
                          {member.initial}
                        </div>
                        <h3 className={`text-lg font-bold mb-1 ${member.highlight ? 'text-white' : 'text-gray-800'}`}>{member.name}</h3>
                        <p className={`text-sm font-medium mb-4 ${member.highlight ? 'text-gold-300' : 'text-gov-600'}`}>{member.role}</p>
                        <div className="space-y-2">
                          <a href={`tel:+967${member.phone.replace(/-/g, '')}`}
                            className={`text-xs flex items-center justify-center gap-1 transition-colors ${
                              member.highlight ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gov-600'
                            }`}>
                            <Phone size={12} /> {member.phone}
                          </a>
                          <a href={`mailto:${member.email}`}
                            className={`text-xs flex items-center justify-center gap-1 transition-colors ${
                              member.highlight ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gov-600'
                            }`}>
                            <Mail size={12} /> {member.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== الإنجازات ===== */}
              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm mb-6 text-center max-w-2xl mx-auto">
                    مسيرة حافلة بالإنجازات الملموسة في خدمة محافظة ذمار منذ التأسيس وحتى اليوم
                  </p>
                  {/* خط زمني */}
                  <div className="relative">
                    <div className="absolute right-6 top-0 bottom-0 w-px bg-gradient-to-b from-gov-600 via-gold-500 to-gov-600 opacity-30 hidden md:block" />
                    {achievements.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="relative flex items-start gap-4 md:gap-6 mb-6 last:mb-0">
                          <div className="hidden md:flex flex-col items-center">
                            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg shrink-0 relative z-10`}>
                              <Icon size={20} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-1 bg-gradient-to-l from-gray-50 to-transparent rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="text-xs font-bold text-white bg-gov-600 px-2.5 py-1 rounded-full">{item.year}</span>
                              <h3 className="font-bold text-gray-800">{item.title}</h3>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                          </div>
                          {/* أيقونة للجوال */}
                          <div className={`md:hidden w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
                            <Icon size={18} className="text-white" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===== خدماتنا ===== */}
              {activeTab === 'services' && (
                <div>
                  <p className="text-gray-500 text-sm mb-6 text-center max-w-2xl mx-auto">
                    منظومة متكاملة من الخدمات الهندسية والإدارية المقدمة للمواطنين والمستثمرين
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {services.map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <div key={i} className={`${s.bg} rounded-xl p-5 border ${s.border} hover:shadow-lg transition-all`}>
                          <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-3 border ${s.border}`}>
                            <Icon size={20} className={s.text} />
                          </div>
                          <h3 className={`font-bold ${s.text} mb-3 text-sm`}>{s.name}</h3>
                          <ul className="space-y-1.5">
                            {s.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                                <CheckCircle2 size={12} className={`${s.text} mt-0.5 shrink-0`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 7. كلمة المدير العام               */}
        {/* ============================== */}
        <ScrollReveal delay={250}>
          <div className="relative bg-gradient-to-br from-gov-800 via-gov-900 to-gov-950 rounded-3xl p-8 md:p-10 mb-12 overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold-500 rounded-full blur-3xl opacity-[0.06] pointer-events-none" />
            <div className="relative max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Quote size={22} className="text-gold-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">كلمة المدير العام</h2>
              </div>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>بسم الله الرحمن الرحيم، والصلاة والسلام على رسول الله،</p>
                <p>يسعدني أن أرحب بكم في الموقع الرسمي لمكتب الأشغال العامة والطرق بمحافظة ذمار،
                الذي يعكس التزامنا بتقديم أفضل الخدمات الهندسية والإدارية للمواطنين والمستثمرين في محافظة ذمار.</p>
                <p>نعمل في المكتب وفق رؤية واضحة تهدف إلى تطوير قطاع التشييد والبناء،
                وتحسين جودة البنية التحتية، وتعزيز مبادئ الشفافية والحوكمة في جميع إجراءاتنا.
                وقد قطعنا شوطاً كبيراً في مسيرة التحول الرقمي، ونعمل حالياً على أتمتة شاملية لجميع الخدمات
                لتسهيل وصول المواطنين إلى الخدمات وتقليص زمن الإنجاز.</p>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h5 className="font-bold text-gold-300 mb-3">نؤمن بأن:</h5>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-3">
                      <ArrowUpRight size={14} className="text-gold-400 mt-1 shrink-0" />
                      <span>العمل المؤسسي الجاد هو السبيل الأمثل لتحقيق تطلعات المواطنين</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowUpRight size={14} className="text-gold-400 mt-1 shrink-0" />
                      <span>تطوير الكوادر البشرية والاستثمار في التقنيات الحديثة هو أولوية قصوى</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowUpRight size={14} className="text-gold-400 mt-1 shrink-0" />
                      <span>الشفافية في التعامل هي أساس الثقة بين المواطن والمؤسسة الحكومية</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowUpRight size={14} className="text-gold-400 mt-1 shrink-0" />
                      <span>الشراكة مع المجتمع هي مفتاح النجاح في تحقيق التنمية المستدامة</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold text-white backdrop-blur-sm">
                  م
                </div>
                <div>
                  <div className="font-bold text-lg text-white">{INSTITUTIONAL_DATA.manager}</div>
                  <div className="text-gold-300 text-sm font-medium">مدير عام مكتب الأشغال العامة والطرق – محافظة ذمار</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 8. الأسئلة الشائعة                 */}
        {/* ============================== */}
        <ScrollReveal delay={300}>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 mb-12">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 bg-gov-50 px-4 py-2 rounded-full text-sm font-bold text-gov-700 mb-3">
                <BookOpen size={16} />
                الأسئلة الشائعة
              </span>
              <h2 className="text-2xl font-black text-gray-800">استفسارات متكررة</h2>
              <p className="text-gray-500 text-sm mt-2">أجوبة على أكثر الأسئلة شيوعاً حول خدمات المكتب</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-right bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-bold text-sm text-gray-700">{faq.q}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 py-4 border-t border-gray-200 text-sm text-gray-600 leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 9. معلومات الاتصال               */}
        {/* ============================== */}
        <ScrollReveal delay={350}>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">معلومات الاتصال الرسمية</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: MapPin, title: 'العنوان الرسمي', value: 'شارع الحسينية - جوار مكتب الجمارك', sub: 'H96P+9VX، مدينة ذمار' },
                { icon: Phone, title: 'رقم الهاتف', value: INSTITUTIONAL_DATA.phone, sub: 'أيام السبت - الأربعاء 8ص - 2م', href: `tel:+967${INSTITUTIONAL_DATA.phoneCode}` },
                { icon: Mail, title: 'البريد الإلكتروني', value: INSTITUTIONAL_DATA.email, sub: 'الرد خلال 24 ساعة', href: `mailto:${INSTITUTIONAL_DATA.email}` },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gov-50 transition-all">
                  <div className="w-12 h-12 bg-gov-100 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-gov-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">{item.title}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-bold text-gov-600 hover:underline truncate block">{item.value}</a>
                    ) : (
                      <div className="text-sm font-bold text-gray-800 truncate">{item.value}</div>
                    )}
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 10. الخريطة التفاعلية              */}
        {/* ============================== */}
        <ScrollReveal delay={400}>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-100 bg-gov-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MapPin size={22} className="text-gov-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gov-800">موقع المكتب الجغرافي</h2>
                    <p className="text-xs text-gray-500">H96P+9VX - مدينة ذمار - محافظة ذمار</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'خرائط جوجل', href: 'https://maps.google.com/?q=14.542930,44.404580' },
                    { label: 'OpenStreetMap', href: 'https://www.openstreetmap.org/?mlat=14.542930&mlon=44.404580#map=18/14.542930/44.404580' },
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
              <p className="text-xs text-gray-500">الإحداثيات: 14.542930, 44.404580 (WGS84)</p>
              <p className="text-xs text-gray-500">انقر على الخريطة للتفاعل - استخدم التكبير والتصغير</p>
            </div>
          </div>
        </ScrollReveal>

        {/* المسافة السفلية */}
        <div className="h-8" />
      </div>
    </div>
  );
}