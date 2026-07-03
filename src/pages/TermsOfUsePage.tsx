// ============================================================
// TermsOfUsePage.tsx - شروط الاستخدام
// متوافق مع: React 18 | TypeScript 5.5+
// ============================================================

import { FileText, Scale, AlertTriangle, Ban, Gavel } from 'lucide-react';
import PageHeader from '../shared/components/PageHeader';
import { useNavigation } from '../components/NavigationHistory';

export default function TermsOfUsePage() {
  const { goBack, canGoBack } = useNavigation();

  const handleBack = () => {
    if (canGoBack) {
      goBack();
    }
  };

  return (
    <div
      className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
      dir="rtl"
    >
      <PageHeader
        title="شروط الاستخدام"
        subtitle="القواعد والضوابط القانونية لاستخدام الموقع"
        badge="شروط قانونية"
        badgeIcon={Scale}
      >
        {canGoBack && (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all border border-white/20"
          >
            <FileText size={16} />
            العودة للصفحة السابقة
          </button>
        )}
      </PageHeader>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12 space-y-8">
          {/* تاريخ آخر تحديث */}
          <div className="flex items-center gap-2 text-sm text-gray-500 border-b border-gray-100 pb-4">
            <FileText size={16} />
            <span>
              آخر تحديث:{' '}
              {new Date().toLocaleDateString('ar-YE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* القبول بالشروط */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Scale
                className="text-gov-600"
                size={24}
              />
              1. قبول الشروط
            </h2>
            <p className="text-gray-600 leading-relaxed">
              باستخدامك لهذا الموقع الإلكتروني، فإنك تقر بقبولك لشروط الاستخدام هذه. إذا كنت لا
              توافق على هذه الشروط، يرجى عدم استخدام الموقع. نحتفظ بالحق في تعديل هذه الشروط في أي
              وقت دون إشعار مسبق.
            </p>
          </section>

          {/* وصف الخدمات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. وصف الخدمات</h2>
            <p className="text-gray-600 leading-relaxed">
              يوفر موقع مكتب الأشغال العامة والطرق بمحافظة ذمار منصة إلكترونية للوصول إلى الخدمات
              التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-3">
              <li>عرض دليل الخدمات الهندسية والإدارية</li>
              <li>تقديم الطلبات والمعاملات إلكترونياً</li>
              <li>تتبع حالة المعاملات</li>
              <li>تحميل النماذج والوثائق الرسمية</li>
              <li>التواصل مع موظفي المكتب</li>
            </ul>
          </section>

          {/* التزامات المستخدم */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. التزامات المستخدم</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              عند استخدام هذا الموقع، فإنك توافق على:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>تقديم معلومات صحيحة ودقيقة عند ملء النماذج</li>
              <li>عدم استخدام الموقع لأغراض غير قانونية أو احتيالية</li>
              <li>عدم محاولة اختراق أو إلحاق الضرر بأنظمة الموقع</li>
              <li>عدم نشر محتوى مخالف للقوانين اليمنية أو الأخلاق العامة</li>
              <li>احترام حقوق الملكية الفكرية للمحتوى الموجود على الموقع</li>
              <li>عدم استخدامbots أو أدوات جمع البيانات الآلية دون إذن كتابي</li>
            </ul>
          </section>

          {/* الملكية الفكرية */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. الملكية الفكرية</h2>
            <p className="text-gray-600 leading-relaxed">
              جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والصور والرسومات والشعارات
              والبرمجيات، هي ملكية حصرية لمكتب الأشغال العامة والطرق بمحافظة ذمار أو لجهات أخرى
              مرخصة لاستخدامها. يُمنع نسخ أو توزيع أو تعديل أي parte من هذه المحتويات دون إذن كتابي
              مسبق.
            </p>
          </section>

          {/* حدود المسؤولية */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle
                className="text-amber-600"
                size={24}
              />
              5. حدود المسؤولية
            </h2>
            <p className="text-gray-600 leading-relaxed">
              نبذل قصارى جهدنا لضمان دقة وموثوقية المعلومات المعروضة على الموقع. ومع ذلك:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-3">
              <li>لا نضمن خلو الموقع من الأخطاء أو الانقطاعات</li>
              <li>لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام الموقع</li>
              <li>المعلومات المقدمة لأغراض إرشادية وقد تختلف عن الواقع</li>
              <li>نحتفظ بالحق في تعديل أو حذف أي محتوى دون إشعار</li>
            </ul>
          </section>

          {/* الخصوصية */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. الخصوصية</h2>
            <p className="text-gray-600 leading-relaxed">
              نحترم خصوصية مستخدمي الموقع. يرجى مراجعة <strong>سياسة الخصوصية</strong> الخاصة بنا
              لفهم كيفية جمعنا واستخدامنا وحماية لبياناتك الشخصية.
            </p>
          </section>

          {/* الروابط الخارجية */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. الروابط الخارجية</h2>
            <p className="text-gray-600 leading-relaxed">
              قد يحتوي الموقع على روابط لمواقع إلكترونية خارجية. نحن لا نتحكم في محتوى هذه المواقع
              ولسنا مسؤولين عن ممارسات الخصوصية أو المحتوى الخاص بها. ننصح بمراجعة شروط الاستخدام
              وخصوصية كل موقع تزوره.
            </p>
          </section>

          {/* الإنهاء */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Ban
                className="text-red-600"
                size={24}
              />
              8. الإنهاء أو التقييد
            </h2>
            <p className="text-gray-600 leading-relaxed">
              نحتفظ بالحق في تقييد أو تعليق أو إنهاء وصولك إلى الموقع في أي وقت ودون إشعار إذا
              اعتقدنا أنك انتهكت شروط الاستخدام هذه أو لأي سبب آخر نراه مناسباً.
            </p>
          </section>

          {/* القانون الواجب التطبيق */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Gavel
                className="text-gov-600"
                size={24}
              />
              9. القانون الواجب التطبيق
            </h2>
            <p className="text-gray-600 leading-relaxed">
              تخضع هذه الشروط للقوانين والأنظمة المعمول بها في <strong>الجمهورية اليمنية</strong>.
              أي نزاعات تنشأ عن استخدام هذا الموقع ستُحل أمام المحاكم المختصة في محافظة ذمار.
            </p>
          </section>

          {/* الاتصال */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">تواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى التواصل معنا:
            </p>
            <div className="mt-4 space-y-2 text-gray-600">
              <p>
                <strong>البريد الإلكتروني:</strong> info@thamar-ashgal.gov.ye
              </p>
              <p>
                <strong>الهاتف:</strong> 777-888-198
              </p>
              <p className="text-sm text-gray-500 mt-4">
                تم إعداد شروط الاستخدام هذه وفقاً للممارسات المعمول بها في المواقع الحكومية اليمنية.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
