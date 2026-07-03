// ============================================================
// EvaluationWidget.tsx - أداة التقييم المدمجة
// ============================================================

import { memo, useState } from 'react';
import { Star, Send, ThumbsUp, ThumbsDown } from 'lucide-react';

interface EvaluationWidgetProps {
  serviceName?: string;
  onSubmit?: (rating: number, feedback: string) => void;
}

const EvaluationWidget = memo(function EvaluationWidget({
  serviceName,
  onSubmit,
}: EvaluationWidgetProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit?.(rating, feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border-2 border-emerald-200 text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ThumbsUp
            size={32}
            className="text-white"
          />
        </div>
        <h4 className="font-black text-emerald-700 mb-2">شكراً لتقييمك!</h4>
        <p className="text-sm text-gray-600">تقييمك يساعدنا في تحسين الخدمات</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-black text-gov-700 text-lg">قيم هذه الخدمة</h4>
        {serviceName && (
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {serviceName}
          </span>
        )}
      </div>

      {/* Star Rating */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`transition-all duration-300 ${
              star <= rating ? 'scale-125' : 'hover:scale-110'
            }`}
          >
            <Star
              size={32}
              className={`${
                star <= rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>

      {/* Feedback Text */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="شاركنا ملاحظاتك حول هذه الخدمة..."
        className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm resize-none h-24 focus:outline-none focus:border-gov-500 transition-colors"
      />

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-gov-600 hover:bg-gov-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Send size={18} />
          إرسال التقييم
        </button>
        <button className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
          <ThumbsUp
            size={20}
            className="text-gray-600"
          />
        </button>
        <button className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
          <ThumbsDown
            size={20}
            className="text-gray-600"
          />
        </button>
      </div>
    </div>
  );
});

export default EvaluationWidget;
