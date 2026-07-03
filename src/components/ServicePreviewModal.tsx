// ============================================================
// ServicePreviewModal.tsx - نافذة معاينة تفاصيل الخدمة
// ============================================================

import { memo, useEffect } from 'react';
import {
  X,
  FileText,
  BookOpen,
  Clock,
  MapPin,
  CheckCircle,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import ScrollReveal from '../shared/components/ScrollReveal';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  category: string;
}

interface ServicePreviewModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  تراخيص: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  اعتماد: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  معاينات: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  تصاريح: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  إفادات: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  شكاوى: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  صحة: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  تنظيم: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  مختبرات: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

const ServicePreviewModal = memo(function ServicePreviewModal({
  service,
  isOpen,
  onClose,
  onNavigate,
}: ServicePreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const Icon = service.icon;
  const categoryStyle = categoryColors[service.category] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };

  const handleNavigate = () => {
    onClose();
    onNavigate(service.href);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${service.color} p-6 rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <X
              size={20}
              className="text-white"
            />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
              <Icon
                size={32}
                className="text-white"
              />
            </div>
            <div className="flex-1">
              <span
                className={`inline-block px-3 py-1 ${categoryStyle.bg} ${categoryStyle.text} rounded-full text-xs font-bold mb-2`}
              >
                {service.category}
              </span>
              <h2 className="text-2xl font-bold text-white mb-2">{service.title}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <ScrollReveal>
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen
                  size={18}
                  className="text-gov-600"
                />
                وصف الخدمة
              </h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          </ScrollReveal>

          {/* معلومات إضافية */}
          <ScrollReveal delay={100}>
            <div className="bg-gov-50 border border-gov-100 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-gov-700 mb-3">معلومات هامة</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-green-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">المستندات المطلوبة</p>
                    <p className="text-xs text-gray-600 mt-1">
                      صورة البطاقة الشخصية، سند ملكية الأرض، مخططات معتمدة من مكتب استشاري
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock
                    size={18}
                    className="text-blue-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">مدة الإنجاز</p>
                    <p className="text-xs text-gray-600 mt-1">
                      5-15 يوم عمل حسب نوع الخدمة واكتمال المستندات
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">مكان التقديم</p>
                    <p className="text-xs text-gray-600 mt-1">
                      مركز خدمة الجمهور - الشباك الواحد - مبنى المكتب الرئيسي
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* الإحصائيات المتعلقة */}
          <ScrollReveal delay={200}>
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp
                  size={18}
                  className="text-gov-600"
                />
                إحصائيات الأداء
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gov-700">4,131</div>
                  <div className="text-xs text-gray-500">رخصة بناء مُصدرة</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gov-700">2,521</div>
                  <div className="text-xs text-gray-500">مخطط مُراجع</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gov-700">1,746</div>
                  <div className="text-xs text-gray-500">شكوى مُعالجة</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gov-700">98%</div>
                  <div className="text-xs text-gray-500">نسبة الرضا</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleNavigate}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gov-600 hover:bg-gov-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <FileText size={18} />
              تقديم طلب الآن
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3.5 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ServicePreviewModal;
