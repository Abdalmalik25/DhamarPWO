// ============================================================
// OfficialUseBox.tsx - مربع الاستخدام الرسمي المتقدم
// متوافق مع: React 19 | Tailwind CSS | الطباعة الاحترافية
// ============================================================

import { forwardRef, useMemo } from 'react';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export type OfficialBoxLanguage = 'ar' | 'en';
export type OfficialBoxLayout = 'one-col' | 'two-col' | 'three-col';

export interface OfficialUseBoxProps {
  /** عنوان القسم (مثل: "للاستخدام الرسمي فقط") */
  title: string;
  /** قائمة الحقول (مثل: التوقيع، التاريخ، الموافقة) */
  fields: {
    label: string;
    wide?: boolean;
    placeholder?: string; // إضافة نص توضيحي
  }[];
  /** نص الختم أو رابط صورة الختم */
  stampLabel?: string;
  /** رابط صورة الختم (إذا تم تمريره، سيعرض صورة بدلاً من النص) */
  stampUrl?: string;
  /** عدد الأعمدة (واحد، اثنان، ثلاثة) */
  layout?: OfficialBoxLayout;
  /** لغة الوثيقة (لضبط اتجاه النص) */
  lang?: OfficialBoxLanguage;
  /** فئة CSS إضافية */
  className?: string;
}

// ============================================================
// 2. المكون الرئيسي (Main Component)
// ============================================================

const OfficialUseBox = forwardRef<HTMLDivElement, OfficialUseBoxProps>(function OfficialUseBox(
  {
    title,
    fields,
    stampLabel = 'الختم الرسمي',
    stampUrl,
    layout = 'two-col',
    lang = 'ar',
    className = '',
  },
  ref,
) {
  // ============================================================
  // 2.1. حساب تخطيط الشبكة (Grid Layout)
  // ============================================================

  const gridConfig = useMemo(() => {
    switch (layout) {
      case 'one-col':
        return 'grid-cols-1';
      case 'two-col':
        return 'grid-cols-2';
      case 'three-col':
        return 'grid-cols-3';
      default:
        return 'grid-cols-2';
    }
  }, [layout]);

  // ============================================================
  // 2.2. التأكد من اتجاه النص (RTL / LTR)
  // ============================================================

  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      ref={ref}
      className={`official-box border-2 border-gray-800 rounded-xl overflow-hidden shadow-md print:shadow-none print:border-gray-600 ${className}`}
      dir={direction}
      lang={lang}
    >
      {/* ===== رأس المربع الرسمي ===== */}
      <div className="off-header bg-gray-800 text-white px-6 py-3 text-center print:bg-gray-600 print:text-black">
        <h4 className="text-lg font-bold tracking-wider uppercase">{title}</h4>
      </div>

      {/* ===== جسم المربع ===== */}
      <div className="off-body p-6 bg-white print:bg-white">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ===== حقل التوقيعات ===== */}
          <div className="flex-1">
            <div className={`grid ${gridConfig} gap-6 md:gap-8`}>
              {fields.map((field) => (
                <div
                  key={field.label}
                  className={`sig-container flex flex-col gap-1 ${field.wide ? 'col-span-full' : ''}`}
                >
                  <label className="sig-label text-sm font-semibold text-gray-700 print:text-black">
                    {field.label}
                  </label>

                  {/* خط التوقيع المتقطع */}
                  <div className="sig-line-wrapper relative">
                    <div className="sig-line h-8 border-b-2 border-dashed border-gray-400 print:border-gray-600" />
                    {field.placeholder && (
                      <span className="absolute left-2 -top-1 text-xs text-gray-300 print:text-gray-400 select-none pointer-events-none">
                        {field.placeholder}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== الختم الرسمي ===== */}
          <div className="off-stamp-wrapper flex-shrink-0 flex flex-col items-center justify-center min-w-[180px] border-r-2 border-dashed border-gray-300 pr-6 print:border-gray-400">
            <div className="off-stamp-container w-40 h-40 rounded-full border-4 border-gray-700 flex items-center justify-center p-4 print:border-gray-600">
              {stampUrl ? (
                <img
                  src={stampUrl}
                  alt={stampLabel}
                  className="w-full h-full object-contain print:grayscale"
                  crossOrigin="anonymous"
                />
              ) : (
                <span className="text-center font-bold text-gray-700 text-sm leading-tight print:text-black">
                  {stampLabel}
                </span>
              )}
            </div>
            <p className="mt-3 text-[10px] text-gray-400 uppercase tracking-wider print:text-gray-600">
              ختم رسمي
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// 3. تصدير الكل (Exports)
// ============================================================

OfficialUseBox.displayName = 'OfficialUseBox';
export default OfficialUseBox;
