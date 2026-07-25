// ============================================================
// ContactSidebar.tsx - الشريط الجانبي الهندسي الإرشادي
// تصميم احترافي بارز مع تصحيح التداخل (z-index متقدم)
// ============================================================

import { useState, useCallback, useMemo } from 'react';
import { X, Clock, CheckCircle2, HardHat, FileText } from 'lucide-react';
import { CONTACT_INFO, SERVICE_CATEGORIES, QUICK_GUIDANCE } from '../data/contactData';

interface ContactSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

const OFFICE_DATA = CONTACT_INFO.office;

const ContactSidebar = ({ isOpen, onClose, defaultCategory = 'inquiry' }: ContactSidebarProps) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('success'), 1500);
    setTimeout(() => setFormStatus('idle'), 5000);
  }, []);

  const selectedCategoryInfo = useMemo(
    () => SERVICE_CATEGORIES.find((cat) => cat.id === selectedCategory),
    [selectedCategory],
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - خلفية تعتيم بارزة بأولوية قصوى */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar - الشريط الجانبي البارز بأولوية أعلى من أي عنصر آخر */}
      <div className="fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-[100000] overflow-hidden flex flex-col">
        {/* شريط علوي مميز بلون ذهبي */}
        <div className="h-1.5 bg-gradient-to-l from-amber-500 via-amber-400 to-amber-500 shadow-md" />

        {/* الهيدر الاحترافي - بارز وواضح */}
        <div className="flex items-center justify-between p-4 border-b-2 border-amber-200 bg-gradient-to-l from-amber-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
              <HardHat
                size={20}
                className="text-white"
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-800">مراسلة هندسية</h2>
              <p className="text-xs text-amber-700 font-medium">مكتب الأشغال العامة والطرق</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md"
            aria-label="إغلاق"
          >
            <X
              size={18}
              className="text-gray-600"
            />
          </button>
        </div>

        {/* معلومات الاتصال السريعة - بطاقات واضحة */}
        <div className="p-4 bg-amber-50/80 border-b-2 border-amber-100">
          <div className="grid grid-cols-1 gap-2">
            <a
              href={`tel:+967${OFFICE_DATA.phone.replace(/-/g, '')}`}
              className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border-2 border-amber-200 text-xs font-semibold text-gray-700 hover:border-amber-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <HardHat
                  size={14}
                  className="text-white"
                />
              </div>
              <span>{OFFICE_DATA.phone}</span>
            </a>
            <a
              href={`mailto:${OFFICE_DATA.email}`}
              className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border-2 border-amber-200 text-xs font-semibold text-gray-700 hover:border-amber-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <FileText
                  size={14}
                  className="text-white"
                />
              </div>
              <span>{OFFICE_DATA.email}</span>
            </a>
            <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border-2 border-amber-200 text-xs font-semibold text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Clock
                  size={14}
                  className="text-white"
                />
              </div>
              <span>{OFFICE_DATA.responseTime}</span>
            </div>
          </div>
        </div>

        {/* نموذج المراسلة أو رسالة النجاح */}
        <div className="flex-1 overflow-y-auto p-4">
          {formStatus === 'success' ? (
            <div className="text-center py-12 px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2
                  size={40}
                  className="text-white"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تم إرسال رسالتك</h3>
              <p className="text-sm text-gray-600 bg-amber-50 rounded-lg p-3">
                سيتم الرد عليك خلال {OFFICE_DATA.responseTime}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* الفئات الهندسية - بطاقات مميزة */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  نوع الخدمة الهندسية
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-right transition-all border-2 ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-l from-amber-50 to-white border-amber-400 shadow-lg scale-[1.02]'
                          : 'bg-white border-gray-200 hover:border-amber-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center shadow-md`}
                      >
                        <cat.icon
                          size={18}
                          className="text-white"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-800">
                          {cat.nameEngineering || cat.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate">{cat.guidance}</div>
                      </div>
                      {selectedCategory === cat.id && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* إرشادات الفئة المختارة */}
              {selectedCategoryInfo && (
                <div className="bg-gradient-to-l from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <HardHat
                        size={12}
                        className="text-white"
                      />
                    </div>
                    <span className="text-xs font-bold text-amber-800">إرشاد الخدمة</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    {selectedCategoryInfo.descriptionEngineering ||
                      selectedCategoryInfo.description}
                  </p>
                </div>
              )}

              {/* حقول النموذج - بطاقات واضحة */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    الرسالة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none bg-white"
                  />
                </div>
              </div>

              {/* زر الإرسال البارز */}
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full py-3 bg-gradient-to-l from-amber-600 to-amber-700 text-white font-bold rounded-xl text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:transform-none"
              >
                {formStatus === 'sending' ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <HardHat size={16} />
                    إرسال الرسالة الهندسية
                  </div>
                )}
              </button>
            </form>
          )}
        </div>

        {/* الدليل الإرشادي السريع - مميز وواضح */}
        <div className="p-4 border-t-2 border-amber-200 bg-gradient-to-l from-amber-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
              <HardHat
                size={12}
                className="text-white"
              />
            </div>
            <span className="text-sm font-bold text-gray-800">الدليل الإرشادي السريع</span>
          </div>
          <div className="flex flex-col gap-2">
            {QUICK_GUIDANCE.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-gray-700 bg-white rounded-lg p-2 border border-gray-200"
                >
                  <Icon
                    size={12}
                    className="text-amber-600"
                  />
                  <span className="font-medium">{item.tip}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSidebar;
