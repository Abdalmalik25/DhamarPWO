// ============================================================
// ContactPage.tsx - صفحة تواصل معنا (الإصدار الذكي المؤسسي v7.0)
// تصميم احترافي تفاعلي مع تكامل حقيقي مع Sanity وتحليلات
// ============================================================

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Network,
  Copy,
  Check,
  BadgeCheck,
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  Loader2,
  AlertCircle,
  Sparkles,
  Bot,
  User,
  Globe,
  ShieldCheck,
  Award,
  Building2,
  Calendar,
  Bell,
  Zap,
} from 'lucide-react';
import { useNavigation } from '../components/NavigationHistory';
import ScrollReveal from '../shared/components/ScrollReveal';
import {
  CONTACT_INFO,
  BRANCHES,
  SERVICE_CATEGORIES,
} from '../shared/data/contactData';
import { createClient } from '@sanity/client';

// ============================================================
// Sanity Client Configuration
// ============================================================
const sanityClient = createClient({
  projectId: 'eom8ac5ihv7aw75rfoousbkt',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

// ============================================================
// 1. مكونات مساعدة متطورة
// ============================================================

// Toast Notifications (بدون مكتبة خارجية)
const Toast = ({
  message,
  type = 'success',
  onClose,
}: {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-50 border-emerald-500 text-emerald-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 max-w-sm w-full p-4 rounded-xl border-r-4 shadow-2xl backdrop-blur-md animate-slideIn ${colors[type]}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
        {type === 'info' && <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

// مؤشر الكتابة الذكي
const SmartTypingIndicator = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current < text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev + text[indexRef.current]);
        indexRef.current++;
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [displayed, text, speed]);

  return <span>{displayed}</span>;
};

// ============================================================
// 2. مكونات الواجهة الذكية
// ============================================================

const ProfessionalContactBadge = () => {
  return (
    <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-xl border-2 border-amber-300 px-6 py-3 rounded-full text-sm font-black text-amber-800 shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-100/50 via-yellow-200/50 to-amber-100/50 animate-shimmer" />
      <div className="relative flex items-center gap-2">
        <span className="p-1.5 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full shadow-lg">
          <MessageSquare size={18} className="text-white" />
        </span>
        <span className="tracking-wider font-bold text-gray-800">خدمة العملاء</span>
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        <span className="text-amber-700 font-semibold"> </span>
        <BadgeCheck size={14} className="text-amber-600 group-hover:rotate-12 transition-transform duration-500" />
      </div>
    </div>
  );
};

const PremiumContactCard = ({
  icon: Icon,
  title,
  value,
  sub,
  href,
  bg,
  iconBg,
  border,
  index,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  sub: string;
  href?: string;
  bg: string;
  iconBg: string;
  border: string;
  index: number;
}) => {
  const spans = title === 'اتصل بنا' || title === 'أوقات الدوام' ? 'md:col-span-2' : '';

  return (
    <div
      className={`${bg} ${border} rounded-2xl p-5 border-2 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${spans} animate-fadeInUp`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-white/50 to-transparent rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
      <div className="relative">
        <div
          className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-3 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="font-black text-gray-800 text-sm mb-1">{title}</h3>
        {href ? (
          <a href={href} className="text-sm font-bold text-amber-600 hover:underline block truncate">
            {value}
          </a>
        ) : (
          <div className="text-sm font-bold text-gray-800">{value}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{sub}</div>
      </div>
    </div>
  );
};

const CopyButton = ({
  field,
  copiedField,
  handleCopy,
  textToCopy,
}: {
  field: string;
  copiedField: string | null;
  handleCopy: (text: string, field: string) => void;
  textToCopy: string;
}) => (
  <button
    onClick={() => handleCopy(textToCopy, field)}
    className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
    aria-label="نسخ"
  >
    {copiedField === field ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
  </button>
);

const ServiceCategoryCard = ({
  category,
  selected,
  onSelect,
}: {
  category: (typeof SERVICE_CATEGORIES)[number];
  selected: boolean;
  onSelect: () => void;
}) => {
  const Icon = category.icon;

  return (
    <button
      onClick={onSelect}
      className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 text-right hover:-translate-y-1 hover:shadow-lg ${
        selected ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50' : 'border-gray-200 bg-white hover:border-amber-300'
      }`}
    >
      <div
        className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <h4 className="font-bold text-gray-800 text-sm mb-1">{category.name}</h4>
      <p className="text-xs text-gray-600">{category.description}</p>
      {selected && (
        <div className="absolute top-2 left-2">
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
        </div>
      )}
    </button>
  );
};

// ============================================================
// 3. المكون الرئيسي مع تحسينات تفاعلية وذكية
// ============================================================

export default function ContactPage() {
  const { navigate } = useNavigation();

  // --- حالات النموذج والإشعارات ---
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // --- بيانات النموذج ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // --- أخطاء التحقق ---
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- حالة الاتصال بالإنترنت ---
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- رسالة ترحيبية ذكية ---
  const getGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 صباح الخير';
    if (hour < 18) return '☀️ مساء الخير';
    return '🌙 مساء الخير';
  }, []);

  // --- تحقق فوري من صحة الحقول ---
  const validateField = useCallback((name: string, value: string) => {
    let error = '';
    if (name === 'name' && value.trim().length < 2) error = 'الاسم يجب أن يكون حرفين على الأقل';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'بريد إلكتروني غير صحيح';
    if (name === 'phone' && value && !/^[\+\d\s\-]{8,15}$/.test(value)) error = 'رقم هاتف غير صحيح';
    if (name === 'subject' && !value) error = 'الرجاء اختيار الموضوع';
    if (name === 'message' && value.trim().length < 10) error = 'الرسالة يجب أن تحتوي على 10 أحرف على الأقل';
    return error;
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // تحقق فوري مع تأخير بسيط لتجنب التقلبات
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  // --- اقتراح الخدمة بناءً على محتوى الرسالة (ذكاء بسيط) ---
  useEffect(() => {
    if (formData.message.length > 5) {
      const keywords = formData.message.toLowerCase();
      const matched = SERVICE_CATEGORIES.find((cat) =>
        cat.keywords?.some((kw) => keywords.includes(kw))
      );
      if (matched && matched.id !== selectedCategory) {
        setSelectedCategory(matched.id);
        // إشعار ذكي
        setToast({
          message: `💡 يبدو أنك تبحث عن خدمة "${matched.name}"، تم اختيارها تلقائياً`,
          type: 'info',
        });
      }
    }
  }, [formData.message, selectedCategory]);

  // --- نسخ النص مع إشعار ---
  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setToast({ message: '📋 تم النسخ إلى الحافظة', type: 'success' });
      setTimeout(() => setCopiedField(null), 2000);
    });
  }, []);

  // --- مشاركة الموقع ---
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = 'مكتب الأشغال العامة والطرق - ذمار';
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setToast({ message: '📤 تم فتح نافذة المشاركة', type: 'info' });
    }
  };

  // --- إرسال النموذج إلى Sanity ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // تحقق شامل قبل الإرسال
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ message: '⚠️ الرجاء تصحيح الأخطاء في النموذج', type: 'error' });
      return;
    }

    setFormStatus('sending');

    try {
      const doc = {
        _type: 'contactMessage',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
        serviceCategory: selectedCategory || undefined,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
      };

      await sanityClient.create(doc);
      setFormStatus('success');
      setToast({ message: '✅ تم إرسال رسالتك بنجاح! سنرد عليك قريباً.', type: 'success' });
      // إعادة تعيين النموذج
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSelectedCategory('');
      setErrors({});
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setFormStatus('error');
      setToast({ message: '❌ حدث خطأ في الإرسال. حاول مرة أخرى.', type: 'error' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  // --- عرض الإشعارات ---
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- حالة تحميل النموذج (محاكاة) ---
  const isSubmitting = formStatus === 'sending';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-amber-50/30 to-gray-50" dir="rtl">
      {/* إشعارات */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* حالة الاتصال بالإنترنت */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm font-bold shadow-lg">
          ⚠️ أنت غير متصل بالإنترنت، بعض الميزات غير متاحة.
        </div>
      )}

      {/* ============================== */}
      {/* 1. الهيدر الذكي مع رسالة ترحيبية */}
      {/* ============================== */}
      <div className="relative bg-gradient-to-l from-gray-900 via-gray-800 to-gray-900 text-white pt-12 pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2x, #d4af37 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full blur-3xl opacity-15" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-l from-amber-500 via-amber-400 to-amber-500 shadow-lg" />

        <div className="relative max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate('home')}
            className="mb-4 flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">العودة للرئيسية</span>
          </button>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-white/10 border-2 border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
              <MessageSquare size={38} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <ProfessionalContactBadge />
                <span className="text-sm bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 text-amber-200 flex items-center gap-2">
                  <Sparkles size={14} />
                  {getGreeting}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-3 leading-tight">
                تواصل
                <span className="block text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400 mt-2 tracking-wider">
                  مع مكتب الأشغال العامة والطرق
                </span>
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-3xl leading-relaxed">
                نضع قنوات التواصل بين يديك - فريقنا جاهز للاستماع لك والرد على استفساراتك في أقرب وقت ممكن
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={16} className="text-amber-400" /> معلوماتك آمنة
                </span>
                <span className="flex items-center gap-1">
                  <Award size={16} className="text-amber-400" /> خدمة معتمدة
                </span>
                <span className="flex items-center gap-1">
                  <Globe size={16} className="text-amber-400" /> متاحة للجميع
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        {/* ============================== */}
        {/* 2. بطاقات التواصل المتطورة */}
        {/* ============================== */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-12">
            {[
              {
                icon: Phone,
                title: 'اتصل بنا',
                value: CONTACT_INFO.office.phone,
                sub: CONTACT_INFO.office.responseTime
                  ? `الرد ${CONTACT_INFO.office.responseTime}`
                  : 'السبت - الأربعاء 8ص - 2م',
                href: `tel:+967${CONTACT_INFO.office.phoneCode}`,
                bg: 'bg-gradient-to-br from-blue-50 to-blue-100/60',
                iconBg: 'bg-gradient-to-br from-blue-600 to-blue-700',
                border: 'border-blue-200',
              },
              {
                icon: Mail,
                title: 'راسلنا',
                value: CONTACT_INFO.office.email,
                sub: `الرد ${CONTACT_INFO.office.responseTime}`,
                href: `mailto:${CONTACT_INFO.office.email}`,
                bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/60',
                iconBg: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
                border: 'border-emerald-200',
              },
              {
                icon: MapPin,
                title: 'زورنا',
                value: CONTACT_INFO.office.address,
                sub: CONTACT_INFO.office.city,
                bg: 'bg-gradient-to-br from-amber-50 to-amber-100/60',
                iconBg: 'bg-gradient-to-br from-amber-600 to-amber-700',
                border: 'border-amber-200',
              },
              {
                icon: Clock,
                title: 'أوقات الدوام',
                value: CONTACT_INFO.office.workingDays,
                sub: CONTACT_INFO.office.workingHours,
                bg: 'bg-gradient-to-br from-purple-50 to-purple-100/60',
                iconBg: 'bg-gradient-to-br from-purple-600 to-purple-700',
                border: 'border-purple-200',
              },
            ].map((card, idx) => (
              <PremiumContactCard key={card.title} {...card} index={idx} />
            ))}
          </div>
        </ScrollReveal>

        {/* ============================== */}
        {/* 3. نموذج المراسلة الذكي مع خيارات متقدمة */}
        {/* ============================== */}
        <div className="grid lg:grid-cols-1 gap-6 mb-12">
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-md">
                  <Send size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800">أرسل لنا رسالة ذكية</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Bot size={14} className="text-amber-500" /> سيتم اقتراح الخدمة تلقائياً بناءً على رسالتك
                  </p>
                </div>
              </div>

              {/* أقسام الخدمات مع تمييز تلقائي */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">نوع الخدمة المطلوبة</h3>
                <div className="grid sm:grid-cols-3 gap-2">
                  {SERVICE_CATEGORIES.map((category) => (
                    <ServiceCategoryCard
                      key={category.id}
                      category={category}
                      selected={selectedCategory === category.id}
                      onSelect={() => setSelectedCategory(category.id)}
                    />
                  ))}
                </div>
              </div>

              {/* حالات النموذج */}
              {formStatus === 'success' ? (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-2 border-emerald-200 rounded-2xl p-8 text-center animate-fadeIn">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">تم إرسال رسالتك بنجاح</h3>
                  <p className="text-emerald-600 text-sm">
                    سيتم الرد عليك خلال {CONTACT_INFO.office.responseTime}. شكراً لتواصلك معنا.
                  </p>
                  <button
                    onClick={() => setFormStatus('idle')}
                    className="mt-4 text-sm text-emerald-700 underline hover:no-underline"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : formStatus === 'error' ? (
                <div className="bg-gradient-to-br from-red-50 to-red-100/40 border-2 border-red-200 rounded-2xl p-8 text-center animate-fadeIn">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={40} className="text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-800 mb-2">حدث خطأ</h3>
                  <p className="text-red-600 text-sm">لم نتمكن من إرسال رسالتك. حاول مرة أخرى لاحقاً.</p>
                  <button
                    onClick={() => setFormStatus('idle')}
                    className="mt-4 text-sm text-red-700 underline hover:no-underline"
                  >
                    المحاولة مرة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="أدخل اسمك الكامل"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        aria-invalid={!!errors.name}
                        aria-describedby="name-error"
                      />
                      {errors.name && (
                        <p id="name-error" className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        البريد الإلكتروني <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الهاتف</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+967 XXX XXX XXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        الموضوع <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all bg-white ${
                          errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">اختر موضوع الرسالة</option>
                        {SERVICE_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      الرسالة <span className="text-red-500">*</span>
                      <span className="text-gray-400 text-[10px] mr-2">(سيتم اقتراح الخدمة تلقائياً)</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="اكتب رسالتك هنا..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all resize-none ${
                        errors.message ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* مؤشر الذكاء الاصطناعي */}
                  {formData.message.length > 0 && selectedCategory && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-center gap-2 animate-fadeIn">
                      <Sparkles size={16} className="text-amber-500" />
                      <span>تم اقتراح الخدمة: <strong>{SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name}</strong></span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-xs text-gray-500">
                      الحقول الموسومة بـ <span className="text-red-500">*</span> إلزامية
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isOnline}
                      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl transition-all text-sm shadow-lg hover:shadow-xl ${
                        isSubmitting || !isOnline ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> إرسال الرسالة
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* ============================== */}
        {/* 4. فروع المكتب مع معلومات إضافية */}
        {/* ============================== */}
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-6 md:p-8 mb-12 transition-all hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-md">
                <Network size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800">فروعنا في المحافظة</h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Building2 size={14} /> {BRANCHES.length} فرعاً موزعة على مديريات محافظة ذمار
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BRANCHES.map((branch, idx) => (
                <div
                  key={branch.name}
                  className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200 hover:shadow-lg hover:border-amber-200 hover:-translate-y-1 transition-all animate-fadeInUp"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{branch.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{branch.address}</p>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500">
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
        {/* 5. شريط أدوات المشاركة والنسخ */}
        {/* ============================== */}
        <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2">
          <button
            onClick={() => setShareOpen(!shareOpen)}
            className="p-3 bg-amber-600 text-white rounded-full shadow-xl hover:bg-amber-700 transition-all hover:scale-110"
            aria-label="مشاركة"
          >
            <Share2 size={20} />
          </button>
          {shareOpen && (
            <div className="flex flex-col gap-2 bg-white p-2 rounded-xl shadow-2xl border border-gray-200 animate-fadeInUp">
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Facebook size={18} />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-lg text-gray-700 hover:bg-sky-500 hover:text-white transition-colors"
              >
                <Twitter size={18} />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 rounded-lg text-gray-700 hover:bg-blue-700 hover:text-white transition-colors"
              >
                <Linkedin size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>

      {/* ============================== */}
      {/* 6. إضافة أنماط CSS للرسوم المتحركة */}
      {/* ============================== */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease forwards;
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
        .animate-fadeIn {
          animation: fadeInUp 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}