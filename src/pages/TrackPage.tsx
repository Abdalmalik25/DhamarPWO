// ============================================================
// TrackPage.tsx - صفحة تتبع المعاملات (النسخة الرسمية)
// ============================================================

import { useState, useCallback, useMemo } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  FileText,
  X,
  User,
} from 'lucide-react';
import PageHeader from '../shared/components/PageHeader';

interface Submission {
  id: string;
  ref: string;
  type: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  date: string;
  applicant: string;
  phone: string;
  lastUpdate: string;
  notes?: string;
}

const TrackPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const mockSubmissions = useMemo<Submission[]>(
    () => [
      {
        id: '1',
        ref: 'TRK-2026-001',
        type: 'طلب ترخيص بناء',
        status: 'processing',
        date: '2026-06-15',
        applicant: 'أحمد محمد علي',
        phone: '777-888-200',
        lastUpdate: '2026-06-20',
        notes: 'جاري المراجعة من قبل اللجنة الفنية',
      },
      {
        id: '2',
        ref: 'TRK-2026-002',
        type: 'طلب اعتماد مخططات',
        status: 'approved',
        date: '2026-06-10',
        applicant: 'محمد سالم عبدالله',
        phone: '777-888-201',
        lastUpdate: '2026-06-18',
        notes: 'تم الاعتماد النهائي',
      },
      {
        id: '3',
        ref: 'TRK-2026-003',
        type: 'طلب إفادة فنية',
        status: 'pending',
        date: '2026-06-25',
        applicant: 'علي حسن أحمد',
        phone: '777-888-202',
        lastUpdate: '2026-06-25',
        notes: 'في قيد الانتظار',
      },
    ],
    [],
  );

  const getStatusConfig = useCallback((status: Submission['status']) => {
    const configs = {
      pending: {
        label: 'قيد الانتظار',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: Clock,
        bgIcon: 'bg-yellow-500',
      },
      processing: {
        label: 'قيد المعالجة',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Loader2,
        bgIcon: 'bg-blue-500',
      },
      approved: {
        label: 'معتمد',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle2,
        bgIcon: 'bg-green-500',
      },
      rejected: {
        label: 'مرفوض',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle,
        bgIcon: 'bg-red-500',
      },
      completed: {
        label: 'منتهي',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: CheckCircle2,
        bgIcon: 'bg-gray-500',
      },
    };
    return configs[status];
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      setIsSearching(true);
      // محاكاة البحث
      setTimeout(() => {
        const found = mockSubmissions.find(
          (s) =>
            s.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.applicant.includes(searchQuery),
        );
        setSelectedSubmission(found || null);
        setIsSearching(false);
      }, 800);
    },
    [searchQuery, mockSubmissions],
  );

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setSelectedSubmission(null);
  }, []);

  return (
    <div
      className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
      dir="rtl"
    >
      <PageHeader
        title="تتبع المعاملة"
        subtitle="ابحث عن حالة المعاملة باستخدام رقم التتبع أو اسم مقدم الطلب."
        badge="خدمة إلكترونية"
        badgeIcon={Search}
      >
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-sm">
            <div className="text-white/70">البحث السريع</div>
            <div className="mt-2 text-white font-semibold">رقم التتبع أو اسم مقدم الطلب</div>
          </div>
          <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-sm">
            <div className="text-white/70">المخرجات</div>
            <div className="mt-2 text-white font-semibold">عرض النتائج فوراً بعد البحث</div>
          </div>
          <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-sm">
            <div className="text-white/70">استعلام آمن</div>
            <div className="mt-2 text-white font-semibold">المعلومات الرسمية محمية</div>
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 -mt-4 relative z-10">
        {/* نموذج البحث */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 mb-6">
          <form
            onSubmit={handleSearch}
            className="space-y-4"
          >
            <div className="relative">
              <Search
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="أدخل رقم التتبع (مثال: TRK-2026-001) أو اسم مقدم الطلب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-gov-600 focus:ring-2 focus:ring-gov-100 outline-none transition-all"
                dir="rtl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="w-full bg-gradient-to-l from-gov-600 to-gov-700 hover:from-gov-700 hover:to-gov-800 text-white rounded-xl py-3 font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Search size={18} />
                  بحث
                </>
              )}
            </button>
          </form>

          {/* اقتراحات سريعة */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">تجربة سريعة:</span>
            {mockSubmissions.slice(0, 3).map((submission) => (
              <button
                key={submission.id}
                onClick={() => setSearchQuery(submission.ref)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gov-100 text-gray-600 hover:text-gov-700 rounded-full transition-all"
              >
                {submission.ref}
              </button>
            ))}
          </div>
        </div>

        {/* نتائج البحث */}
        {selectedSubmission && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 animate-fade-in">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-800 mb-2">نتيجة البحث</h2>
                <p className="text-sm text-gray-500">تم العثور على المعاملة</p>
              </div>
              <span className="text-xs font-mono text-gray-500">{selectedSubmission.ref}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* معلومات المعاملة */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    معلومات المعاملة
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">النوع:</span>
                      <span className="font-bold text-blue-900">{selectedSubmission.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">الحالة:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          getStatusConfig(selectedSubmission.status).color
                        }`}
                      >
                        {getStatusConfig(selectedSubmission.status).label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">التاريخ:</span>
                      <span className="font-mono text-blue-900">{selectedSubmission.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">آخر تحديث:</span>
                      <span className="font-mono text-blue-900">
                        {selectedSubmission.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <User size={16} />
                    مقدم الطلب
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">الاسم:</span>
                      <span className="font-bold text-purple-900">
                        {selectedSubmission.applicant}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">الهاتف:</span>
                      <a
                        href={`tel:+967${selectedSubmission.phone.replace(/-/g, '')}`}
                        className="font-bold text-purple-900 hover:underline"
                        dir="ltr"
                      >
                        {selectedSubmission.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ملاحظات وحالة */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-5 border border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <AlertCircle size={16} />
                    ملاحظات
                  </h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {selectedSubmission.notes || 'لا توجد ملاحظات إضافية'}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-5 border border-green-200">
                  <h3 className="font-bold text-green-900 mb-3">الخطوات التالية</h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>• يرجى الاحتفاظ برقم التتبع للمتابعة المستقبلية</p>
                    <p>• يمكنك الاتصال بمركز خدمة الجمهور للاستفسار</p>
                    <p>• سيتم إشعارك عند أي تحديث في حالة المعاملة</p>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              <a
                href={`tel:+967777888198`}
                className="flex-1 min-w-[200px] px-4 py-3 bg-gov-600 hover:bg-gov-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                اتصل بنا
              </a>
              <a
                href="mailto:info@pwo-dhamar.gov.ye"
                className="flex-1 min-w-[200px] px-4 py-3 bg-white border-2 border-gov-600 text-gov-600 hover:bg-gov-50 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                راسلنا
              </a>
            </div>
          </div>
        )}

        {/* لا توجد نتائج */}
        {searchQuery && !selectedSubmission && !isSearching && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search
                className="text-gray-400"
                size={40}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-sm text-gray-500 mb-4">تأكد من صحة رقم التتبع أو اسم مقدم الطلب</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gov-600 hover:bg-gov-700 text-white rounded-xl font-bold text-sm transition-all"
            >
              إعادة البحث
            </button>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle
                className="text-white"
                size={24}
              />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">معلومات هامة</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• يمكنك تتبع معاملتك باستخدام رقم التتبع المقدم عند تقديم الطلب</li>
                <li>• مدة المعالجة تختلف حسب نوع الخدمة، عادة من 5 إلى 15 يوم عمل</li>
                <li>• لاستفسارات عاجلة، يرجى الاتصال بمركز خدمة الجمهور</li>
                <li>• أوقات العمل: السبت - الأربعاء من 8:00 صباحاً إلى 2:00 مساءً</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
