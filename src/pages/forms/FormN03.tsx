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

export default function FormN03() {
  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
      data-form-container="true"
    >
      <div className="relative">
        <div className="absolute top-0 left-0 text-[10px] font-bold text-gray-300 opacity-20 transform -rotate-45">
          PWO-DHAMAR-INSPECTION
        </div>

        <ScrollReveal>
          <div className="sec-label">■ أولاً: بيانات مقدم الطلب وموقع المعاينة</div>
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
                    اسم مقدم الطلب <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهاتف للتنسيق الميداني</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهوية الوطنية</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className="fl">
                    عنوان الموقع المطلوب معاينته بالتفصيل الدقيق (المديرية / الحي / الشارع / المعلم
                    القريب)
                  </div>
                  <span
                    className="fline"
                    style={{ height: 16 }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">رقم ترخيص البناء أو المعاملة (إن وجد)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">اسم المقاول أو الشركة المنفذة</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم هاتف المقاول</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثانياً: الغرض الفني من المعاينة الميدانية</div>
          <div className="opts opts-2">
            {[
              'معاينة فنية مبدئية للموقع (قبل الترخيص)',
              'مطابقة حدود الأرض والإسقاط على المخطط العام',
              'الكشف واستلام أعمال الحفر والأساسات (القواعد)',
              'الكشف واستلام الهيكل الخرساني والأعمدة',
              'الكشف واستلام الصبة الخرسانية (الأسقف)',
              'معاينة أضرار إنشائية أو منشأة آيلة للسقوط',
              'الاستلام الابتدائي / النهائي للمشاريع',
              'معاينة مخالفات بناء وتثبيت حالة الاستحداث',
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
          <div className="sec-label">■ ثالثاً: تفاصيل الوصول للموقع والإحداثيات</div>
          <table className="ftable">
            <colgroup>
              <col style={{ width: '50%' }} />
              <col style={{ width: '50%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">إحداثيات GPS (خط العرض / خط الطول)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">أقرب معلم بارز لتسهيل الوصول</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="fl">ملاحظات إضافية أو وصف للموقع:</div>
                  <span
                    className="farea"
                    style={{ height: 24 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="pledge">
            <strong>● ألتزم</strong> بتسهيل مهام اللجنة الفنية، وتوفير كافة المخططات والوثائق
            المعتمدة في الموقع أثناء الزيارة، وتوفير وسيلة الوصول للموقع إن لزم.
          </div>
          <div className="sig-row">
            <div className="sig-f">
              <span className="sig-lbl">توقيع مقدم الطلب:</span>
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
            title="للاستخدام الرسمي فقط — إدارة الرقابة والتفتيش الهندسي"
            stampLabel="ختم اللجنة"
            fields={[
              { label: 'قرار التكليف بالنزول — رقم وتاريخ' },
              { label: 'تاريخ وموعد التكليف المحدد' },
              { label: 'رئيس لجنة المعاينة — الاسم والتوقيع' },
              { label: 'أعضاء اللجنة (أسماء)' },
              { label: 'نتيجة المعاينة الميدانية', wide: true },
              { label: 'تاريخ رفع المحضر' },
            ]}
          />
        </ScrollReveal>

        <div className="form-foot">
          <span className="form-foot-l">مكتب الأشغال العامة والطرق — محافظة ذمار</span>
          <span className="form-foot-r">© 2026 · FORM REF: N-03</span>
        </div>
      </div>
    </div>
  );
}
