// src/components/BeneficiaryEvaluationForm.tsx
import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export function BeneficiaryEvaluationForm({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    serviceType: '',
    quality: 5,
    speed: 5,
    professionalism: 5,
    ease: 5,
    overall: 5,
    comments: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يمكن حفظ البيانات في localStorage أو إرسالها إلى API
    console.log('Evaluation data:', form);
    setSubmitted(true);
    onSuccess?.();
    setTimeout(onClose, 1500);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl text-green-600 mb-3">✅</div>
        <h3 className="text-xl font-bold text-gov-700">شكراً لك!</h3>
        <p className="text-gray-500">تم تسجيل تقييمك بنجاح.</p>
      </div>
    );
  }

  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-2xl focus:outline-none"
        >
          <Star
            size={24}
            fill={star <= value ? '#F59E0B' : 'none'}
            stroke={star <= value ? '#F59E0B' : '#D1D5DB'}
          />
        </button>
      ))}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto p-2"
    >
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-xl font-bold text-gov-700">تقييم الخدمة</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">الاسم (اختياري)</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">رقم الهاتف (اختياري)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">نوع الخدمة</label>
        <select
          value={form.serviceType}
          onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
        >
          <option value="">اختر...</option>
          <option value="ترخيص بناء">ترخيص بناء</option>
          <option value="اعتماد مخططات">اعتماد مخططات</option>
          <option value="معاينة ميدانية">معاينة ميدانية</option>
          <option value="ترخيص حفر">ترخيص حفر</option>
          <option value="شهادة/إفادة">شهادة / إفادة</option>
          <option value="أخرى">أخرى</option>
        </select>
      </div>

      {[
        { key: 'quality', label: 'جودة الخدمة' },
        { key: 'speed', label: 'سرعة الإنجاز' },
        { key: 'professionalism', label: 'احترافية الموظفين' },
        { key: 'ease', label: 'سهولة الإجراءات' },
        { key: 'overall', label: 'التقييم العام' },
      ].map((item) => (
        <div key={item.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
          <StarRating
            value={form[item.key as keyof typeof form] as number}
            onChange={(v) => setForm({ ...form, [item.key]: v })}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
        <textarea
          rows={3}
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
          placeholder="أخبرنا عن تجربتك..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl transition-colors"
      >
        إرسال التقييم
      </button>
    </form>
  );
}
