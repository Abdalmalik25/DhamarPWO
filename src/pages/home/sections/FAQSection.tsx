// ============================================================
// FAQSection.tsx v6.0 - Platinum Interactive
// الأسئلة الشائعة - تصميم تفاعلي متقدم مع accordion أنيق
// ============================================================

import { memo, useState, useMemo, useCallback } from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isPopular?: boolean;
}

export interface FAQSectionProps {
  faqs?: FAQ[];
  theme?: 'light' | 'dark';
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
  className?: string;
}

const DEFAULT_FAQS: FAQ[] = [
  {
    id: '1',
    question: 'كيف أستطيع الحصول على رخصة بناء؟',
    answer: 'للحصول على رخصة بناء، يجب تقديم طلب إلى مكتب الأشغال العامة والطرق معRequired الوثائق تتضمن: مخططات معمارية وإنشائية موقعة من مهندس مرخص، سند ملكية الأرض، هوية المالك، ورسوم الرخصة. يمكنك زيارة المكتب أو استخدام البوابة الإلكترونية.',
    category: 'تراخيص',
    isPopular: true,
  },
  {
    id: '2',
    question: 'ما هي الوثائق المطلوبة لترخيص بناء؟',
    answer: 'الوثائق المطلوبة تشمل: 1) مخططات معمارية وإنشائية 2) سند ملكية الأرض 3) هوية وطنية للمالك 4) عقد مهندس مرخص 5) شهادة مطابقة للمواد 6) رسوم الرخصة.',
    category: 'تراخيص',
    isPopular: true,
  },
  {
    id: '3',
    question: 'كم تستغرق إصدار الرخصة Typically؟',
    answer: 'تستغرق إصدار الرخصة Typically من 3 إلى 5 أيام عمل بعد اكتمال الوثائق ودفع الرسوم. في الحالات المعقدة قد تحتاج إلى وقت إضافي للمراجعة.',
    category: 'خدمات',
  },
  {
    id: '4',
    question: 'هل أستطيع متابعة حالة طلبي إلكترونياً؟',
    answer: 'نعم، يمكنك متابعة حالة طلبك من خلال صفحة "تتبع معاملة" في الموقع الإلكتروني باستخدام رقم الطلب والرمز التحقق.',
    category: 'خدمات إلكترونية',
    isPopular: true,
  },
  {
    id: '5',
    question: 'ما هي رسوم التراخيص؟',
    answer: 'تختلف الرسوم حسب نوع الرخصة ومساحة البناء. يمكنك الاطلاع على جدول الرسوم في مكتب الأشغال أو على الموقع الإلكتروني.',
    category: 'رسوم',
  },
  {
    id: '6',
    question: 'كيف أقدم شكوى حول مخالفة بناء؟',
    answer: 'يمكنك تقديم شكوى من خلال زيارة المكتب أو عبر البوابة الإلكترونية. يُرفق مع الشكوى الوثائق الداعمة مثل الصور والموقع.',
    category: 'شكاوى',
  },
  {
    id: '7',
    question: 'هل التراخيص التي أحرزها صالحة في جميع المحافظات؟',
    answer: 'تراخيص البناء صالحة في محافظة ذمار فقط. إذا كنت تريد البناء في محافظة أخرى، يجب الحصول على ترخيص من المكتب المختص في تلك المحافظة.',
    category: 'تراخيص',
  },
  {
    id: '8',
    question: 'ماذا يحدث إذا بنيت بدون ترخيص؟',
    answer: 'البناء بدون ترخيص يعتبر مخالفة ويعرضك لغرامات مالية وقد يتم إيقاف العمل. في الحالات الخطيرة قد يتم الهدم.',
    category: 'قوانين',
    isPopular: true,
  },
];

const CategoryBadge = memo(function CategoryBadge({ category, isPopular }: { category: string; isPopular?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gov-100 text-gov-700">
        {category}
      </span>
      {isPopular && (
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
          <HelpCircle size={10} />
          شائع
        </span>
      )}
    </div>
  );
});

const FAQItem = memo(function FAQItem({
  faq,
  isOpen,
  onClick,
  index,
  theme,
}: {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
  index: number;
  theme?: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`group relative rounded-2xl border-2 transition-all duration-500 ${
        isOpen
          ? 'bg-white shadow-2xl border-amber-300'
          : isDark
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-amber-200'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        onClick={onClick}
        className="w-full text-right p-6 flex items-start gap-4"
        aria-expanded={isOpen}
      >
        {/* الأيقونة */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
          isOpen
            ? 'bg-gradient-to-br from-amber-600 to-yellow-700 text-white'
            : 'bg-gray-100 text-gray-600 group-hover:bg-amber-50 group-hover:text-amber-600'
        }`}>
          {isOpen ? <ChevronUp size={20} /> : <HelpCircle size={20} />}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-base font-bold transition-colors duration-300 ${
              isOpen ? 'text-amber-800' : isDark ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {faq.question}
            </h3>
          </div>
          <CategoryBadge category={faq.category || ''} isPopular={faq.isPopular} />
        </div>

        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
          isOpen
            ? 'bg-amber-100 text-amber-600 rotate-180'
            : 'bg-gray-100 text-gray-600'
        }`}>
          <ChevronDown size={16} />
        </div>
      </button>

      {/*الإجابة*/}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-6 pb-6 pr-20 mr-14 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <p className="text-sm leading-relaxed">{faq.answer}</p>
        </div>
      </div>

      {/* تأثير اللمعان */}
      {isOpen && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-50/50 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
});

export const FAQSection = memo(function FAQSection({
  faqs: externalFaqs,
  theme = 'light',
  title = 'الأسئلة الشائعة',
  subtitle = 'إجابات واضحة على أكثر الأسئلة تداولاً من قبل المواطنين',
  showAllLink = false,
  className = '',
}: FAQSectionProps) {
  const faqs = useMemo(() => externalFaqs || DEFAULT_FAQS, [externalFaqs]);
  const [openId, setOpenId] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleToggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const popularFaqs = useMemo(() => faqs.filter((faq) => faq.isPopular), [faqs]);
  const otherFaqs = useMemo(() => faqs.filter((faq) => !faq.isPopular), [faqs]);

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

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* الهيدر */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gov-50 border border-gov-100 px-4 py-2 rounded-full mb-4">
              <HelpCircle size={18} className="text-gov-600" />
              <span className="text-sm font-bold text-gov-700">مركز المساعدة</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* الأسئلة الشائعة */}
        <div className="space-y-4">
          {popularFaqs.length > 0 && (
            <ScrollReveal delay={100}>
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  الأسئلة الأكثر شيوعاً
                </h3>
                <div className="space-y-3">
                  {popularFaqs.map((faq, idx) => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isOpen={openId === faq.id}
                      onClick={() => handleToggle(faq.id)}
                      index={idx}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {otherFaqs.length > 0 && (
            <ScrollReveal delay={200}>
              <div>
                {popularFaqs.length > 0 && (
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    أسئلة أخرى
                  </h3>
                )}
                <div className="space-y-3">
                  {otherFaqs.map((faq, idx) => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isOpen={openId === faq.id}
                      onClick={() => handleToggle(faq.id)}
                      index={popularFaqs.length + idx}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* رابط التواصل */}
        {showAllLink && (
          <ScrollReveal delay={300}>
            <div className="mt-12 text-center">
              <div className={`inline-flex items-center gap-3 p-6 rounded-2xl border-2 ${
                isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-gov-600 to-gov-700 rounded-xl flex items-center justify-center">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    لم تجد إجابة لسؤالك؟
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    تواصل معنا مباشرة وسنفيدك في أقرب وقت
                  </p>
                </div>
                <button className="px-6 py-2.5 bg-gradient-to-r from-gov-600 to-gov-700 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  تواصل معنا
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';
export default FAQSection;