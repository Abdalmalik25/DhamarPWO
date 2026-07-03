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

const PLEDGES = [
  'أتعهد بالالتزام التام بالمخططات الهندسية المعتمدة للترخيص وعدم إحداث أي تعديل إلا بعد مراجعة المكتب.',
  'أتعهد بالالتزام بخطوط التنظيم الحمراء المحددة وعدم التعدي على حرم الشارع العام أو ممتلكات الجوار.',
  'أتعهد باتخاذ كافة تدابير الأمن والسلامة المهنية وتأمين حفريات الموقع بسياج لحماية المارة والعمال.',
  'أتعهد بإزالة ونقل كافة المخلفات الإنشائية إلى المقالب المخصصة وعدم تركها في الرصيف إطلاقاً.',
  'أتعهد بعدم صب الخرسانات أو العمل بالآليات الثقيلة في أوقات الراحة المتأخرة ليلاً.',
  'أتعهد بالاستجابة الفورية لأي إشعار أو قرار إيقاف يصدر من لجان الرقابة والتفتيش وتحمل الغرامات إن خالفت.',
  'أتعهد بعدم إدخال مواد البناء أو الرمل والبحص على الرصيف إلا في أوقات التحميل والتفريغ فقط.',
  'أتعهد بإنشاء سياج مؤقت حول الموقع خلال فترة التنفيذ ووضع لوحة باسم المشروع والمقاول والمهندس المشرف.',
];

export default function FormN08() {
  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
      data-form-container="true"
    >

      <div className="relative">
        <div className="absolute top-0 left-0 text-[10px] font-bold text-gray-300 opacity-20 transform -rotate-45">
          PWO-DHAMAR-LEGAL
        </div>

        <ScrollReveal>
          <div className="sec-label">■ أولاً: بيانات الملتزم / المتعهد</div>
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
                    الاسم الكامل للمتعهد <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهوية الوطنية</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهاتف للوصول السريع</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">رقم المعاملة / الترخيص المرتبط</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">اسم المقاول المنفذ</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">اسم المهندس المشرف</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className="fl">
                    عنوان موقع المشروع (المديرية / الحي / الشارع / رقم القطعة)
                  </div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">
            ■ ثانياً: قائمة التعهدات الملزمة (يقر المتعهد بما تم التأشير عليه أدناه)
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #c8d5e8',
              tableLayout: 'fixed',
            }}
          >
            <colgroup>
              <col style={{ width: 28 }} />
              <col />
            </colgroup>
            <tbody>
              {PLEDGES.map((p, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: i < PLEDGES.length - 1 ? '1px solid #e2e8f0' : undefined,
                    background: i % 2 === 0 ? '#fff' : '#f8faff',
                  }}
                >
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '4px 0',
                      borderLeft: '1px solid #c8d5e8',
                      verticalAlign: 'middle',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        width: 12,
                        height: 12,
                        border: '1.5px solid #4b5563',
                        borderRadius: 2,
                      }}
                    />
                  </td>
                  <td
                    style={{
                      padding: '4px 8px',
                      fontSize: '8.5pt',
                      lineHeight: 1.5,
                      color: '#1f2937',
                    }}
                  >
                    {p}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fca5a5',
              borderRight: '3px solid #dc2626',
              padding: '5px 9px',
              fontSize: '8pt',
              color: '#991b1b',
              fontWeight: 700,
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            ⚠ تحذير: مخالفة أي من هذه التعهدات يعرض المتعهد للإجراءات القانونية والغرامات المنصوص
            عليها في قانون تنظيم البناء والتخطيط العمراني، ويحق للمكتب إيقاف الأعمال فوراً
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sig-row sig-row-3">
            <div className="sig-f">
              <span className="sig-lbl">توقيع المتعهد:</span>
              <div
                className="sig-line"
                style={{ height: 22 }}
              />
            </div>
            <div className="sig-f">
              <span className="sig-lbl">البصمة / الختم:</span>
              <div style={{ border: '1px solid #e2e8f0', background: '#f9fafb', height: 22 }} />
            </div>
            <div className="sig-f">
              <span className="sig-lbl">التاريخ:&nbsp;&nbsp; /&nbsp;&nbsp; / 202&nbsp; م</span>
              <div
                className="sig-line"
                style={{ height: 22 }}
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <OfficialUseBox
            title="للاستخدام الرسمي فقط — إدارة الترخيص والمتابعة"
            stampLabel="الختم الرسمي"
            layout="three-col"
            fields={[
              { label: 'موظف الاستلام — الاسم والتوقيع' },
              { label: 'رقم التعهد في السجل الرسمي' },
              { label: 'مدير الإدارة — الاعتماد النهائي' },
            ]}
          />
        </ScrollReveal>

        <div className="form-foot">
          <span className="form-foot-l">مكتب الأشغال العامة والطرق — محافظة ذمار</span>
          <span className="form-foot-r">© 2026 · FORM REF: N-08</span>
        </div>
      </div>
    </div>
  );
}
