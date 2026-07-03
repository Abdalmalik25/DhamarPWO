import { useEffect, useRef } from 'react';
import OfficialUseBox from '../../components/OfficialUseBox';

function ScrollReveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`scroll-fade-in ${className} ${ref.current?.classList.contains('visible') ? 'visible' : ''}`}
    >
      {children}
    </div>
  );
}

export default function FormN07() {
  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
      data-form-container="true"
    >

      <div className="relative">
        <div className="absolute top-0 left-0 text-[10px] font-bold text-gray-300 opacity-20 transform -rotate-45">
          PWO-DHAMAR-APPEAL
        </div>

        <ScrollReveal>
          <div className="sec-label">■ أولاً: بيانات صاحب التظلم</div>
          <table className="ftable">
            <colgroup>
              <col style={{ width: '33.3%' }} />
              <col style={{ width: '33.3%' }} />
              <col style={{ width: '33.4%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">
                    اسم المتظلم الرباعي <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهوية الوطنية</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهاتف للتواصل وإبلاغ النتيجة</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">العنوان (المديرية / الحي)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">الصفة (مالك / وكيل / مستأجر)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">البريد الإلكتروني</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثانياً: بيانات القرار المتظلم منه</div>
          <table className="ftable">
            <colgroup>
              <col style={{ width: '33.3%' }} />
              <col style={{ width: '33.3%' }} />
              <col style={{ width: '33.4%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">رقم القرار المتظلم منه</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">تاريخ صدور القرار</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">تاريخ التبليغ بالقرار</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className="fl">الجهة مصدرة القرار (الإدارة / القسم)</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثالثاً: تصنيف ونوع التظلم المرفوع</div>
          <div className="opts opts-2">
            {[
              'التظلم من قرار رفض منح ترخيص بناء أو تجديد',
              'التظلم من قرار تقدير غرامة مالية باهظة لمخالفة إنشائية',
              'التظلم من قرار إزالة لاستحداثات بناء، ملاحق، أو تسوير',
              'التظلم من رسوم التحسين أو العوائد القانونية المقدرة',
              'التظلم من إيقاف الأعمال أو الحجز على معدات البناء',
              'التظلم من قرار رفض اعتماد مخططات هندسية',
            ].map((o) => (
              <div
                key={o}
                className="citem"
              >
                <span className="cbox" />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ رابعاً: المبررات القانونية والفنية للتظلم</div>
          <table className="ftable">
            <tbody>
              <tr>
                <td>
                  <div className="fl">
                    اكتب أسباب ومبررات التظلم بوضوح تام، واذكر الدلائل أو الوثائق المرفقة:
                  </div>
                  <span
                    className="farea"
                    style={{ height: 42 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ خامساً: الوثائق والمرفقات المؤيدة للتظلم</div>
          <div className="opts opts-3">
            {[
              'صورة من القرار المتظلم منه',
              'صورة من الهوية الوطنية',
              'صورة من سند الملكية',
              'مخططات هندسية (إن لزم)',
              'تقرير مهندسي استشاري',
              'وثائق أخرى',
            ].map((o) => (
              <div
                key={o}
                className="citem"
              >
                <span className="cbox" />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="pledge">
            <strong>● أقر</strong> بأنني قدمت هذا التظلم خلال المدة النظامية المسموحة (15 يوم عمل)
            من تاريخ تبليغي بالقرار، وأن البيانات والمرفقات صحيحة.
          </div>
          <div className="sig-row">
            <div className="sig-f">
              <span className="sig-lbl">توقيع المتظلم:</span>
              <div className="sig-line" />
            </div>
            <div className="sig-f">
              <span className="sig-lbl">
                التاريخ:&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp; / 202&nbsp;&nbsp; م
              </span>
              <div className="sig-line" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <OfficialUseBox
            title="للاستخدام الرسمي فقط — لجنة التظلمات بالمكتب"
            stampLabel="ختم لجنة التظلمات"
            fields={[
              { label: 'المستشار القانوني — رأي الشؤون القانونية' },
              { label: 'قرار مدير عام المكتب — اعتماد النتيجة النهائية' },
              { label: 'رقم التظلم في السجل' },
              { label: 'تاريخ جلسة النظر' },
              { label: 'النتيجة (قبول / رفض / إعادة نظر)' },
            ]}
          />
        </ScrollReveal>

        <div className="form-foot">
          <span className="form-foot-l">مكتب الأشغال العامة والطرق — محافظة ذمار</span>
          <span className="form-foot-r">© 2026 · FORM REF: N-07</span>
        </div>
      </div>
    </div>
  );
}
