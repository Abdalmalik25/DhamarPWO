import { useState } from 'react';
import { Star, Send, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { submitSatisfaction } from '../lib/supabase';

interface SatisfactionFormProps {
  compact?: boolean;
  className?: string;
}

export default function SatisfactionForm({
  compact = false,
  className = '',
}: SatisfactionFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', feedback: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    'تراخيص البناء',
    'اعتماد المخططات',
    'المعاينة الميدانية',
    'تصاريح الطرق',
    'الإفادات والشهادات',
    'الشكاوى والبلاغات',
    'الأرشفة والاستعلام',
    'أخرى',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !formData.service) return;

    setLoading(true);
    setError('');

    const result = await submitSatisfaction({
      rating,
      service_type: formData.service,
      name: formData.name || undefined,
      phone: formData.phone || undefined,
      feedback: formData.feedback || undefined,
    });

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'فشل في إرسال التقييم. يرجى المحاولة مرة أخرى.');
    }

    setLoading(false);
  };

  const resetForm = () => {
    setSubmitted(false);
    setRating(0);
    setHoverRating(0);
    setFormData({ name: '', phone: '', service: '', feedback: '' });
    setError('');
  };

  if (submitted) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-200 ${className}`}>
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2
                size={20}
                className="text-green-600"
              />
            </div>
            <div>
              <h3 className="font-bold text-green-800 text-sm">شكراً لتقييمك!</h3>
              <p className="text-green-600 text-xs">ملاحظاتك تساعدنا في تحسين الخدمات المقدمة</p>
            </div>
          </div>
        </div>
        <div className="p-5 text-center">
          <div
            className="flex justify-center gap-1 mb-3"
            dir="ltr"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={star <= rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}
              />
            ))}
          </div>
          {formData.service && (
            <p className="text-xs text-gray-500 mb-3">الخدمة: {formData.service}</p>
          )}
          {formData.feedback && (
            <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 mb-4 text-right">
              "{formData.feedback}"
            </p>
          )}
          <button
            onClick={resetForm}
            className="text-gov-600 text-xs font-semibold hover:underline"
          >
            تقييم جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="p-4 bg-gov-50 rounded-t-2xl border-b border-gov-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gov-600 rounded-xl flex items-center justify-center">
            <ThumbsUp
              size={20}
              className="text-white"
            />
          </div>
          <div>
            <h3 className="font-bold text-gov-700 text-sm">تقييم رضا المستفيدين</h3>
            <p className="text-gov-500 text-xs">نسعد بملاحظاتك لتطوير الخدمات</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* التقييم بالنجوم */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            مدى رضاك عن الخدمة <span className="text-red-500">*</span>
          </label>
          <div
            className="flex gap-1.5"
            dir="ltr"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-all duration-150 hover:scale-110"
                aria-label={`${star} من 5 نجوم`}
              >
                <Star
                  size={compact ? 22 : 28}
                  className={`transition-all duration-150 ${
                    star <= (hoverRating || rating)
                      ? 'fill-gold-400 text-gold-400 drop-shadow-sm'
                      : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {rating === 0
              ? 'اختر عدد النجوم'
              : rating === 1
                ? 'سيء جداً'
                : rating === 2
                  ? 'ضعيف'
                  : rating === 3
                    ? 'مقبول'
                    : rating === 4
                      ? 'جيد'
                      : 'ممتاز'}
          </p>
        </div>

        {/* نوع الخدمة */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            نوع الخدمة <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, service: s }))}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                  formData.service === s
                    ? 'bg-gov-600 text-white border-gov-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gov-300 hover:text-gov-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* الاسم ورقم الهاتف (اختياري) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              الاسم (اختياري)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="اسمك"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gov-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              رقم الهاتف (اختياري)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="هاتف"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gov-500"
            />
          </div>
        </div>

        {/* ملاحظات */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            ملاحظاتك واقتراحاتك
          </label>
          <textarea
            value={formData.feedback}
            onChange={(e) => setFormData((prev) => ({ ...prev, feedback: e.target.value }))}
            placeholder={
              compact
                ? 'اكتب ملاحظتك...'
                : 'شاركنا رأيك في الخدمة... ما الذي أعجبك؟ وما الذي يمكن تحسينه؟'
            }
            rows={compact ? 2 : 3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gov-500 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={rating === 0 || loading || !formData.service}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gov-600 hover:bg-gov-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={16} />
              إرسال التقييم
            </>
          )}
        </button>
      </div>
    </form>
  );
}
