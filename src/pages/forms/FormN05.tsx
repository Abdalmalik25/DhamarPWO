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

export default function FormN05() {
  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
      data-form-container="true"
    >

      <div className="relative">
        <div className="absolute top-0 left-0 text-[10px] font-bold text-gray-300 opacity-20 transform -rotate-45">
          PWO-DHAMAR-CERTIFICATE
        </div>

        <ScrollReveal>
          <div className="sec-label">■ أولاً: بيانات مقدم الطلب الأساسية</div>
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
                    الاسم الكامل لصاحب الشأن <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهوية الوطنية / جواز السفر</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهاتف للتواصل المباشر</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className="fl">
                    العنوان والموقع الجغرافي للعقار المعني (المديرية / الحي / الشارع / رقم القطعة)
                  </div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثانياً: الغرض والجهة المستفيدة من الإفادة</div>
          <table className="ftable">
            <colgroup>
              <col style={{ width: '50%' }} />
              <col style={{ width: '50%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">الجهة الموجهة إليها الإفادة</div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '6.5pt',
                      color: '#9ca3af',
                      marginBottom: 1,
                    }}
                  >
                    مثال: المحكمة، البنك، البلدية، شركة الكهرباء
                  </span>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">الغاية المحددة من طلب الإفادة</div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '6.5pt',
                      color: '#9ca3af',
                      marginBottom: 1,
                    }}
                  >
                    مثال: لغرض البيع والشراء، إدخال الخدمات
                  </span>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثالثاً: نوع الوثيقة أو الشهادة المطلوبة</div>
          <div className="opts opts-2">
            {[
              'إفادة تنظيمية (تحديد خطوط التنظيم وعرض الشارع)',
              'إفادة هندسية فنية (سلامة إنشائية للمبنى القائم)',
              'شهادة إتمام بناء (شهادة أشغال بعد التنفيذ)',
              'إفادة حالة معاملة (إثبات وجود معاملة قيد الإجراء)',
              'طلب استخراج صورة طبق الأصل من ترخيص مفقود',
              'تصريح إدخال خدمات المرافق (كهرباء / مياه وصرف صحي)',
              'إفادة عدم ممانعة من البناء على الأرض',
              'إفادة مطابقة الموقع للمخطط المعتمد',
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
          <div className="sec-label">
            ■ رابعاً: بيانات الوثيقة الأصلية (في حال طلب صورة طبق الأصل)
          </div>
          <table className="ftable">
            <colgroup>
              <col style={{ width: '33.3%' }} />
              <col style={{ width: '33.3%' }} />
              <col style={{ width: '33.4%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">رقم الوثيقة الأصلية</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">تاريخ الإصدار الأصلي</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">سبب طلب الصورة (فقدان / تلف / أخرى)</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="pledge">
            <strong>● أقر أنا الموقع أدناه</strong> بصحة البيانات، وبدفع الرسوم القانونية المقررة
            لاستخراج هذه الوثيقة بعد الموافقة عليها واعتمادها، وأتحمل المسؤولية عن استخدامها في غير
            الغرض المحدد.
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
            title="للاستخدام الرسمي فقط — الإدارة المعنية بالإصدار"
            stampLabel="الختم الرسمي"
            fields={[
              { label: 'الموظف المختص بالمطابقة — الاسم والتوقيع' },
              { label: 'مدير الإدارة المعنية — يعتمد الإصدار النهائي' },
              { label: 'الرسوم المحصلة (ريال)' },
              { label: 'رقم الإفادة الصادرة' },
              { label: 'تاريخ الإصدار' },
            ]}
          />
        </ScrollReveal>

        <div className="form-foot">
          <span className="form-foot-l">مكتب الأشغال العامة والطرق — محافظة ذمار</span>
          <span className="form-foot-r">© 2026 · FORM REF: N-05</span>
        </div>
      </div>
    </div>
  );
}
