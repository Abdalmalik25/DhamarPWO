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

export default function FormN06() {
  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
      data-form-container="true"
    >

      <div className="relative">
        <div className="absolute top-0 left-0 text-[10px] font-bold text-gray-300 opacity-20 transform -rotate-45">
          PWO-DHAMAR-COMPLAINT
        </div>

        <ScrollReveal>
          <div className="sec-label">■ أولاً: بيانات مقدم الشكوى أو المُبَلِّغ</div>
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
                    الاسم الرباعي أو اسم الجهة الاعتبارية <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهوية الوطنية / السجل التجاري</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم الهاتف الجوال للتواصل العاجل</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">العنوان الشخصي (المديرية / الحي)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">البريد الإلكتروني (إن وجد)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">الصفة (متضرر مباشر / شاهد / جهة رسمية)</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثانياً: بيانات الجهة المشكو منها (المخالف)</div>
          <table className="ftable">
            <colgroup>
              <col style={{ width: '50%' }} />
              <col style={{ width: '50%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">اسم الجهة أو الشخص المخالف (إن عُرف)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم هاتف المخالف (إن توفر)</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="fl">
                    عنوان موقع المخالفة بالتفصيل (المديرية / الحي / الشارع / رقم العقار)
                  </div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثالثاً: نوع الشكوى أو البلاغ الميداني</div>
          <div className="opts opts-2">
            {[
              'بلاغ عن استحداث بناء بدون ترخيص رسمي',
              'بلاغ تعدي صريح على الشارع العام أو حرم الطريق',
              'بلاغ عن حفريات عشوائية أو تخريب في السفلتة',
              'شكوى تضرر من عقار مجاور أو أعمال إنشائية خطرة',
              'شكوى إدارية من سوء الخدمة أو عرقلة مسار المعاملات',
              'بلاغ عن إشغال رصيف بمخلفات بناء، خرسانة، أو عوائق',
              'بلاغ عن منشأة آيلة للسقوط تشكل خطراً عاماً',
              'بلاغ عن مخالفة لخطوط التنظيم أو الارتفاع المسموح',
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
          <div className="sec-label">■ رابعاً: تفاصيل وأسباب الشكوى</div>
          <table className="ftable">
            <tbody>
              <tr>
                <td>
                  <div className="fl">
                    اكتب هنا وصفاً دقيقاً للمخالفة أو الشكوى، مع ذكر تاريخ بداية المخالفة وتكرارها:
                  </div>
                  <span
                    className="farea"
                    style={{ height: 40 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ خامساً: الأدلة والمرفقات المؤيدة للشكوى</div>
          <div className="opts opts-3">
            {[
              'صور فوتوغرافية للموقع',
              'شهادة شهود',
              'مستندات ملكية',
              'مخططات توضيحية',
              'تقرير هندسي',
              'لا توجد مرفقات',
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
          <div className="pledge danger">
            <strong>⚠ أقر أنا المذكور أعلاه</strong> بصحة الوقائع المذكورة، وأعلم أن تقديم بلاغ كيدي
            وغير صحيح يعرضني للمساءلة القانونية المشددة وفقاً للقانون.
          </div>
          <div className="sig-row sig-row-3">
            <div className="sig-f">
              <span className="sig-lbl">توقيع مقدم البلاغ:</span>
              <div className="sig-line" />
            </div>
            <div className="sig-f">
              <span className="sig-lbl">البصمة:</span>
              <div style={{ border: '1px solid #e2e8f0', background: '#f9fafb', height: 17 }} />
            </div>
            <div className="sig-f">
              <span className="sig-lbl">التاريخ:&nbsp;&nbsp; /&nbsp;&nbsp; / 202&nbsp; م</span>
              <div className="sig-line" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <OfficialUseBox
            title="للاستخدام الرسمي فقط — وحدة الشؤون القانونية والشكاوى"
            stampLabel="ختم الشؤون القانونية"
            fields={[
              { label: 'المحقق / المفتش الميداني — استلام وإثبات حالة' },
              { label: 'التوجيه الإداري — توجيه مدير عام المكتب' },
              { label: 'رقم الشكوى في السجل' },
              { label: 'تاريخ الإحالة للجنة' },
            ]}
          />
        </ScrollReveal>

        <div className="form-foot">
          <span className="form-foot-l">مكتب الأشغال العامة والطرق — محافظة ذمار</span>
          <span className="form-foot-r">© 2026 · FORM REF: N-06</span>
        </div>
      </div>
    </div>
  );
}
