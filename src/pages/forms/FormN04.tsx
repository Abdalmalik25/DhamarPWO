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

export default function FormN04() {
  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
      data-form-container="true"
    >

      <div className="relative">
        <div className="absolute top-0 left-0 text-[10px] font-bold text-gray-300 opacity-20 transform -rotate-45">
          PWO-DHAMAR-INFRASTRUCTURE
        </div>

        <ScrollReveal>
          <div className="sec-label">■ أولاً: بيانات الجهة الطالبة للتصريح</div>
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
                    الجهة الطالبة / المؤسسة / المواطن <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم السجل التجاري / الهوية الوطنية</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم هاتف مدير المشروع</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">
                    اسم المقاول المنفذ للحفرية <span className="req">*</span>
                  </div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم ترخيص المقاول</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">رقم هاتف المشرف الميداني</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثانياً: التفاصيل الهندسية لمسار العمل</div>
          <table className="ftable">
            <colgroup>
              <col style={{ width: '100%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">
                    الموقع المستهدف (اسم الشارع، الحي، المعلم القريب، نقطة البداية والنهاية)
                  </div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
          <table
            className="ftable"
            style={{ borderTop: 'none' }}
          >
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div className="fl">طول الحفرية (م طولي)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">عرض الحفرية (م)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">عمق الحفرية (م)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">مدة التنفيذ (بالأيام)</div>
                  <span className="fline" />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="fl">تاريخ البدء المتوقع</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">تاريخ الانتهاء المتوقع</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">أوقات العمل (صباحي/مسائي/ليلي)</div>
                  <span className="fline" />
                </td>
                <td>
                  <div className="fl">عدد العمال المتوقع</div>
                  <span className="fline" />
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sec-label">■ ثالثاً: نوع الأعمال ومسار البنية التحتية</div>
          <div className="opts opts-2">
            {[
              'تمديد شبكة مياه عمومية',
              'تمديد شبكة صرف صحي (مجاري)',
              'تمديدات كابلات كهربائية (ضغط عالي/منخفض)',
              'تمديدات شبكات اتصالات وإنترنت (ألياف ضوئية)',
              'صيانة طارئة لطبقة الأسفلت والرصف',
              'إشغال مؤقت لحرم الطريق (مواد بناء / رافعات)',
              'إنشاء جسور أو جدران استنادية',
              'أعمال إنارة الشوارع العامة',
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
          <div className="sec-label">■ رابعاً: التدابير الوقائية والسلامة المرورية</div>
          <div className="opts opts-3">
            {[
              'توفير لوحات تحذيرية وعاكسة',
              'سياج حماية حول الحفرية',
              'إشارات مرورية يدوية',
              'عوامل إرشاد ليلية',
              'خوذ وملابس سلامة للعمال',
              'تأمين مسار بديل للمرور',
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
            <strong>● نتعهد</strong> بتوفير لوحات السلامة والإرشاد المروري أثناء العمل، وإعادة
            السفلتة والردم حسب المواصفات الفنية فور الانتهاء، وتعويض أي أضرار تلحق بالمرافق العامة.
          </div>
          <div className="sig-row">
            <div className="sig-f">
              <span className="sig-lbl">توقيع وختم الجهة المنفذة:</span>
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
            title="للاستخدام الرسمي فقط — إدارة الطرق والبنية التحتية"
            stampLabel="ختم إدارة الطرق"
            fields={[
              { label: 'مهندس الطرق المختص — الاسم والتوقيع' },
              { label: 'مدير البنية التحتية — تصريح العمل معتمد' },
              { label: 'مدة التصريح (من — إلى)' },
              { label: 'ضمان إعادة الحالة (ريال)' },
            ]}
          />
        </ScrollReveal>

        <div className="form-foot">
          <span className="form-foot-l">مكتب الأشغال العامة والطرق — محافظة ذمار</span>
          <span className="form-foot-r">© 2026 · FORM REF: N-04</span>
        </div>
      </div>
    </div>
  );
}
