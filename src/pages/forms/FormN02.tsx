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

export default function FormN02() {
  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
      data-form-container="true"
    >

      <div className="relative">
        <div className="absolute top-0 left-0 text-[10px] font-bold text-gray-300 opacity-20 transform -rotate-45">
          PWO-DHAMAR-APPROVAL
        </div>

        <ScrollReveal>
          <div className="sec-label">■ أولاً: بيانات المالك وطبيعة المشروع</div>
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
                    اسم المالك الرباعي <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">
                    رقم الهوية الوطنية <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهاتف للتواصل</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">اسم المشروع / المبنى</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">طبيعة الاستخدام (سكني/تجاري/استثماري/مختلط)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم القطعة والبلوك التنظيمي</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">عدد الأدوار المصممة</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">إجمالي مسطحات البناء (م²)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">الارتفاع الكلي (م)</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثانياً: بيانات الجهة الاستشارية / الهندسية المصممة</div>
          <table className="ftable">
            <colgroup>
              <col style={{ width: '50%' }} />
              <col style={{ width: '50%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">
                    اسم المكتب الهندسي / الاستشاري المعتمد <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم ترخيص مزاولة المهنة وتاريخ انتهائه</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">المهندس المعماري المصمم (الاسم ورقم القيد)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">المهندس الإنشائي المصمم (الاسم ورقم القيد)</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">مهندس التمديدات الصحية (الاسم ورقم القيد)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">مهندس التمديدات الكهربائية (الاسم ورقم القيد)</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثالثاً: نوع المخططات والدراسات المرفقة للتدقيق</div>
          <div className="opts opts-3">
            {[
              'مخططات معمارية (مساقط، واجهات، قطاعات)',
              'مخططات إنشائية (أساسات، تسليح)',
              'مخططات صحية (مياه وصرف)',
              'مخططات كهربائية والتيار الخفيف',
              'تقرير فحص فني لتربة الموقع',
              'جداول الكميات والمواصفات',
              'مخطط التنسيق المعماري للموقع',
              'دراسة تأثير المرور (للمشاريع الكبرى)',
              'تقرير الأثر البيئي (إن لزم)',
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
          <table
            className="ftable"
            style={{ borderTop: 'none' }}
          >
            <tbody>
              <tr>
                <td>
                  <div className="fl">تفاصيل إضافية عن التصميم أو اشتراطات خاصة:</div>
                  <span
                    className="farea"
                    style={{ height: 26 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="pledge">
            <strong>● نقر نحن المكتب الهندسي المصمم</strong> بمطابقة جميع المخططات المرفقة لكود
            البناء الوطني والاشتراطات الفنية المعتمدة بالمحافظة، وتحملنا المسؤولية الفنية عن أي خطأ
            في التصميم.
          </div>
          <div className="sig-row">
            <div className="sig-f">
              <span className="sig-lbl">توقيع وختم المكتب الهندسي:</span>
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
            title="للاستخدام الرسمي فقط — إدارة الشؤون الهندسية والدراسات"
            stampLabel="ختم الاعتماد"
            fields={[
              { label: 'المهندس الفني المدقق — الاسم' },
              { label: 'نتيجة التدقيق (مطابق / غير مطابق / ملاحظات)' },
              { label: 'ملاحظات المدقق الفنية', wide: true },
              { label: 'مدير الإدارة الهندسية — يعتمد التوقيع' },
              { label: 'تاريخ الاعتماد النهائي' },
            ]}
          />
        </ScrollReveal>

        <div className="form-foot">
          <span className="form-foot-l">مكتب الأشغال العامة والطرق — محافظة ذمار</span>
          <span className="form-foot-r">© 2026 · FORM REF: N-02</span>
        </div>
      </div>
    </div>
  );
}
