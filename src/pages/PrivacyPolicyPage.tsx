// ============================================================
// PrivacyPolicyPage.tsx - سياسة الخصوصية
// متوافق مع: React 18 | TypeScript 5.5+
// ============================================================

import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import PageHeader from '../shared/components/PageHeader';
import { useNavigation } from '../components/NavigationHistory';

export default function PrivacyPolicyPage() {
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
        title="سياسة الخصوصية"
        subtitle="كيف نحافظ على بياناتك ونحمي خصوصيتك"
        badge="حماية البيانات"
        badgeIcon={Shield}
      >
        {canGoBack && (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all border border-white/20"
          >
            <Eye size={16} />
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

          {/* المقدمة */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Eye
                className="text-gov-600"
                size={24}
              />
              مقدمة
            </h2>
            <p className="text-gray-600 leading-relaxed">
              تلتزم إدارة مكتب الأشغال العامة والطرق بمحافظة ذمار بحماية خصوصية زوار الموقع
              الإلكتروني. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحماية للمعلومات الشخصية
              التي تقدمونها لنا.
            </p>
          </section>

          {/* جمع البيانات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Database
                className="text-gov-600"
                size={24}
              />
              1. جمع البيانات
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              نقوم بجمع الأنواع التالية من البيانات:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>البيانات الشخصية:</strong> الاسم، رقم الهوية الوطنية، رقم الهاتف، والبريد
                الإلكتروني (عند تقديم الطلبات)
              </li>
              <li>
                <strong>بيانات المعاملات:</strong> نوع الخدمة، تاريخ التقديم، حالة المعاملة
              </li>
              <li>
                <strong>البيانات التقنية:</strong> عنوان IP، نوع المتصفح، نظام التشغيل (لأغراض
                أمنية)
              </li>
              <li>
                <strong>التقييمات والتعليقات:</strong> ملاحظاتكم واقتراحاتكم لتحسين الخدمات
              </li>
            </ul>
          </section>

          {/* استخدام البيانات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserCheck
                className="text-gov-600"
                size={24}
              />
              2. استخدام البيانات
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              نستخدم بياناتك للأغراض التالية فقط:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>معالجة وتنفيذ الخدمات المطلوبة</li>
              <li>التواصل معك بخصوص حالة معاملاتك</li>
              <li>تحسين جودة الخدمات المقدمة</li>
              <li>الامتثال للمتطلبات القانونية والتنظيمية</li>
              <li>إرسال إشعارات مهمة متعلقة بخدماتنا</li>
            </ul>
          </section>

          {/* حماية البيانات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lock
                className="text-gov-600"
                size={24}
              />
              3. حماية البيانات
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              نتخذ الإجراءات الأمنية التالية لحماية بياناتك:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>تشفير البيانات أثناء النقل باستخدام TLS/SSL</li>
              <li>تخزين البيانات في خوادم آمنة مع صلاحيات وصول محدودة</li>
              <li>تطبيق سياسات أمان الوصول (Access Controls)</li>
              <li>مراقبة مستمرة للوصول غير المصرح به</li>
              <li>تدريب الموظفين على أفضل practices حماية البيانات</li>
            </ul>
          </section>

          {/* مشاركة البيانات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield
                className="text-gov-600"
                size={24}
              />
              4. مشاركة البيانات
            </h2>
            <p className="text-gray-600 leading-relaxed">
              نحن <strong>لا نبيع أو نؤجر أو نشارك</strong> بياناتك الشخصية مع أي طرف ثالث لأغراض
              تجارية. قد نشارك البيانات فقط في الحالات التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-3">
              <li>عندما يطلب ذلك القانون أو الجهات الرسمية المختصة</li>
              <li>مع مزودي الخدمات الذين يساعدوننا في تشغيل الموقع (ITH ضمان سرية بياناتك)</li>
              <li>لحماية حقوقنا أو سلامة المستخدمين أو سلامة العامة</li>
            </ul>
          </section>

          {/* حقوق المستخدم */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. حقوقك</h2>
            <p className="text-gray-600 leading-relaxed mb-3">لديك الحق في:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>الوصول إلى بياناتك الشخصية</li>
              <li>طلب تصحيح البيانات غير الصحيحة</li>
              <li>طلب حذف بياناتك (مع مراعاة الالتزامات القانونية)</li>
              <li>الاعتراض على معالجة بياناتك في حالات معينة</li>
              <li>سحب موافقتك في أي وقت (حيثما ينطبق)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              لممارسة هذه الحقوق، يرجى التواصل معنا عبر صفحة <strong>تواصل معنا</strong>.
            </p>
          </section>

          {/* ملفات تعريف الارتباط */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. ملفات تعريف الارتباط (Cookies)
            </h2>
            <p className="text-gray-600 leading-relaxed">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. هذه الملفات تساعدنا في:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-3">
              <li>تذكر تفضيلاتك وإعداداتك</li>
              <li>تحليل استخدام الموقع لتحسين الخدمات</li>
              <li>ضمان أمان الموقع ومنع الاحتيال</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح، وقد يؤثر ذلك على بعض وظائف
              الموقع.
            </p>
          </section>

          {/* التعديلات */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. تعديلات سياسة الخصوصية</h2>
            <p className="text-gray-600 leading-relaxed">
              قد نقوم بتحديث هذه السياسة من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب تنظيمية.
              سنقوم بنشر أي تغييرات على هذه الصفحة مع تحديث تاريخ "آخر تحديث".
            </p>
          </section>

          {/* الاتصال */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">تواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية هذه، يرجى التواصل معنا:
            </p>
            <div className="mt-4 space-y-2 text-gray-600">
              <p>
                <strong>البريد الإلكتروني:</strong> info@thamar-ashgal.gov.ye
              </p>
              <p>
                <strong>الهاتف:</strong> 777-888-198
              </p>
              <p>
                <strong>العنوان:</strong> مكتب الأشغال العامة والطرق، محافظة ذمار، الجمهورية اليمنية
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
