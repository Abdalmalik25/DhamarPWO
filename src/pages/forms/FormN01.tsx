import { useState } from 'react';

export default function FormN01() {
  const [applicantType, setApplicantType] = useState('1');

  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
      data-form-container="true"
    >
      <div className="sec-label">أولاً: بيانات مقدم الطلب والمالك</div>
      <div
        className="opts opts-2"
        style={{ marginBottom: '8px' }}
      >
        {['1', '2', '3', '4'].map((type) => (
          <div
            key={type}
            className="citem"
            onClick={() => setApplicantType(type)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <span
              className={`cbox ${applicantType === type ? 'bg-gov-600 border-gov-600' : ''}`}
            />
            <span>{['مالك', 'وكيل شرعي', 'ورثة', 'ممثل شركة'][parseInt(type) - 1]}</span>
          </div>
        ))}
      </div>
      <table className="ftable">
        <tbody>
          <tr>
            <td>
              <div className="fl">
                اسم مقدم الطلب الكامل <span className="req">*</span>
              </div>
              <span className="fline" />
            </td>
            <td>
              <div className="fl">
                رقم الهوية الوطنية <span className="req">*</span>
              </div>
              <span className="fline" />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="sec-label">ثانياً: بيانات العقار</div>
      <table className="ftable">
        <tbody>
          <tr>
            <td>
              <div className="fl">
                المديرية / الحي <span className="req">*</span>
              </div>
              <span className="fline" />
            </td>
            <td>
              <div className="fl">
                المساحة (م²) <span className="req">*</span>
              </div>
              <span className="fline" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
