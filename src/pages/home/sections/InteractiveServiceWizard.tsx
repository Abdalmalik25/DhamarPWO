import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Search,
  HelpCircle,
  HardHat,
  Briefcase,
  FileText,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { FALLBACK_SERVICES as SERVICES_DATA } from '../homeData';

// خيارات المستشار الذكي
const QUESTIONS = [
  {
    id: 'user_type',
    question: 'مرحباً بك.. كيف يمكننا خدمتك اليوم؟ (يرجى تحديد صفتك)',
    options: [
      { id: 'citizen', label: 'مواطن (فرد)', icon: HelpCircle },
      { id: 'investor', label: 'مستثمر / شركة', icon: Briefcase },
      { id: 'contractor', label: 'مقاول / مهندس', icon: HardHat },
    ],
  },
  {
    id: 'service_type',
    question: 'ما هو نوع الخدمة التي تبحث عنها؟',
    options: [
      { id: 'build', label: 'تراخيص البناء والهدم', icon: FileText },
      { id: 'road', label: 'خدمات الطرق والحفريات', icon: Search },
      { id: 'audit', label: 'الرقابة والتفتيش', icon: CheckCircle },
    ],
  },
];

export default function InteractiveServiceWizard({
  theme = 'light',
}: {
  theme?: 'light' | 'dark';
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 300);
    } else {
      setTimeout(() => setIsComplete(true), 400);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsComplete(false);
  };

  // محاكاة نظام تصفية الخدمات (CMS Filtering Simulation)
  const recommendedServices = useMemo(() => {
    if (!isComplete) return [];
    const type = answers['service_type'];
    return SERVICES_DATA.filter((service) => {
      if (type === 'build' && service.category === 'build') return true;
      if (type === 'road' && service.category === 'road') return true;
      if (type === 'audit' && service.category === 'inspection') return true;
      return false;
    }).slice(0, 3); // عرض أفضل 3 توصيات فقط
  }, [answers, isComplete]);

  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gov-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';

  return (
    <section
      className={`py-16 ${bgClass} relative overflow-hidden`}
      aria-label="المستشار الهندسي الذكي"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/hero-pattern.svg')] bg-cover" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-gold-100/50 text-gold-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <SparklesIcon /> نظام محتوى تفاعلي
            </span>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4">
              المستشار الهندسي الذكي
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              أجب عن سؤالين بسيطين وسنقوم بتوجيهك فوراً إلى الخدمة الهندسية المناسبة لحالتك مع كافة
              الشروط والمتطلبات.
            </p>
          </div>

          <div
            className={`rounded-3xl shadow-xl p-6 md:p-10 ${cardBg} transition-all duration-500 min-h-[400px] flex flex-col justify-center`}
          >
            {!isComplete ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>
                      الخطوة {currentStep + 1} من {QUESTIONS.length}
                    </span>
                    <span>{Math.round((currentStep / QUESTIONS.length) * 100)}% مکتمل</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(currentStep / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center">
                  {QUESTIONS[currentStep].question}
                </h3>

                <div className="grid sm:grid-cols-3 gap-4">
                  {QUESTIONS[currentStep].options.map((opt) => {
                    const isSelected = answers[QUESTIONS[currentStep].id] === opt.id;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(QUESTIONS[currentStep].id, opt.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50 text-gold-700 scale-105 shadow-md'
                            : 'border-gray-100 hover:border-gov-300 hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <Icon
                          size={32}
                          className={`mb-4 ${isSelected ? 'text-gold-500' : 'text-gray-400'}`}
                        />
                        <span className="font-bold text-sm">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-in zoom-in duration-500">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    الخدمات المقترحة خصيصاً لك
                  </h3>
                  <p className="text-gray-500">
                    بناءً على المعطيات التي أدخلتها، هذه هي أفضل الإجراءات الهندسية المناسبة:
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {recommendedServices.length > 0 ? (
                    recommendedServices.map((service, idx) => {
                      const SIcon = service.icon;
                      return (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow text-right"
                        >
                          <SIcon
                            size={24}
                            className="text-gov-600 mb-3"
                          />
                          <h4 className="font-bold text-gray-800 text-sm mb-2">{service.title}</h4>
                          <p className="text-xs text-gray-500 mb-4">
                            {service.description.substring(0, 60)}...
                          </p>
                          <button className="text-xs font-bold text-gold-600 flex items-center gap-1 hover:text-gold-700">
                            بدء الخدمة <ArrowLeft size={12} />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center text-gray-500 py-4">
                      لا توجد خدمات مطابقة حالياً.
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <RefreshCw size={16} /> ابدأ استشارة جديدة
                  </button>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
