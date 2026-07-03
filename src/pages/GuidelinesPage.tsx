// ============================================================
// GuidelinesPage.tsx - النظام المتكامل لإدارة المعرفة المؤسسية
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo, memo, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  BookOpen,
  Download,
  Eye,
  Search,
  ArrowLeft,
  Phone,
  Shield,
  Layers,
  Calendar,
  MessageCircle,
  Info,
  Bookmark,
  FolderOpen,
  Grid3X3,
  List,
  X,
  FileCheck,
  Database,
  Clock,
  CheckCircle2,
  HardHat,
  MapPin,
  User,
  FileOutput,
  Camera,
  Building2,
  Gavel,
  PenTool,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react';
import { useNavigation } from '../components/NavigationHistory';

// ============================================================
// 1. نظام إدارة المعرفة المؤسسية (نموذج البيانات المتقدم)
// ============================================================
type DocumentCategory =
  | 'دليل شامل'
  | 'فصل تقني'
  | 'نموذج رسمي'
  | 'صورة هندسية'
  | 'مرجع قانوني'
  | 'تعميم إداري'
  | 'عقد نموذجي'
  | 'تقرير فني'
  | 'خريطة تنظيمية';

type DocumentType = 'pdf' | 'image' | 'doc' | 'xlsx' | 'zip' | 'folder';

type GuidelineItem = {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  subCategory?: string; // للتصنيف الداخلي (مثلاً: إنشائي، معماري، طرق)
  type: DocumentType;
  url: string;
  pages?: number;
  size?: string;
  updatedAt?: string;
  featured?: boolean;
  icon?: LucideIcon;

  // حقول حقيقية لتشغيل مكتب الأشغال
  department: string; // القسم المختص
  responsibleEngineer?: string; // المهندس المشرف
  projectCode?: string; // كود المشروع (إن وجد)
  classification: 'عام' | 'داخلي' | 'سري'; // تصنيف الوثيقة
  keywords: string[];
  version: string;
  status: 'نشط' | 'محدث' | 'منتهي';
  views: number;
  downloads: number;
  lastDownloadAt?: string;
};

// ============================================================
// 2. قاعدة بيانات الوثائق المؤسسية الحقيقية (Real Data)
// ============================================================
const guidelinesData: GuidelineItem[] = [
  // ========== القسم 1: الأدلة الشاملة ==========
  {
    id: 'guide-full',
    title: 'الدليل الإرشادي للخدمات (خاص بالمستفيد)',
    description:
      'الدليل الرسمي للمستفيدين يشرح جميع الخدمات الهندسية والإدارية يقدمها المكتب للمواطنين، مع بيان الشروط، الوثائق، الرسوم، والمدة الزمنية لكل خدمة.',
    category: 'دليل شامل',
    type: 'pdf',
    url: '/docs/الدليل الإرشادي للخدمات - خاص بالمستفيد.pdf',
    pages: 120,
    size: '4.8 MB',
    updatedAt: '2026-06-20',
    featured: true,
    icon: BookOpen,
    department: 'الإدارة العامة',
    responsibleEngineer: 'م. هايل البحري',
    classification: 'عام',
    keywords: ['دليل', 'إرشادي', 'خدمات', 'إجراءات', 'رسوم', 'مدة'],
    version: 'v3.2',
    status: 'نشط',
    views: 2050,
    downloads: 456,
    lastDownloadAt: '2026-06-28',
  },
  {
    id: 'beneficiary-assessment',
    title: 'استبيان رضا المستفيدين',
    description: 'نموذج تقييم لقياس مدى رضا المستفيدين عن الخدمات الهندسية المقدمة من المكتب.',
    category: 'دليل شامل',
    type: 'pdf',
    url: '/docs/Beneficiary Satisfaction Assessment Form.pdf',
    pages: 45,
    size: '2.1 MB',
    updatedAt: '2026-05-10',
    featured: false,
    icon: Bookmark,
    department: 'إدارة الأرشيف',
    classification: 'داخلي',
    keywords: ['أرشفة', 'توثيق', 'تراخيص', 'سجلات'],
    version: 'v1.1',
    status: 'نشط',
    views: 450,
    downloads: 110,
  },

  // ========== القسم 2: الفصول التقنية والتخصصية ==========
  {
    id: 'chapter3-forms',
    title: 'الفصل الثالث: النماذج الرسمية وضوابط التعبئة',
    description:
      'يتضمن هذا الفصل جميع النماذج التشغيلية المعتمدة (من ن-1 إلى ن-8) مع شرح مفصل لضوابط التعبئة والإجراءات المترتبة عليها.',
    category: 'فصل تقني',
    type: 'pdf',
    url: '/docs/الفصل الثالث النماذج.pdf',
    pages: 180,
    size: '6.5 MB',
    updatedAt: '2026-06-15',
    featured: true,
    icon: FileText,
    department: 'إدارة التراخيص',
    responsibleEngineer: 'م. يحيى القاضي',
    classification: 'عام',
    keywords: ['فصل', 'نموذج', 'ضوابط', 'تعبئة', 'ن-1', 'ن-8'],
    version: 'v2.0',
    status: 'نشط',
    views: 1200,
    downloads: 340,
    lastDownloadAt: '2026-06-25',
  },
  {
    id: 'chapter2-summary',
    title: 'الفصل الثاني: الهيكل التنظيمي والإجراءات التنفيذية',
    description:
      'يشمل الهيكل التنظيمي للمكتب، توزيع الصلاحيات، ودليل الإجراءات التنفيذية للمعاملات الهندسية مع ملخص تنفيذي.',
    category: 'فصل تقني',
    type: 'pdf',
    url: '/docs/الفصل الثاني مع الملخص.pdf',
    pages: 95,
    size: '4.2 MB',
    updatedAt: '2026-06-10',
    featured: false,
    icon: Shield,
    department: 'إدارة التخطيط',
    classification: 'داخلي',
    keywords: ['هيكل', 'تنظيمي', 'إجراءات', 'صلاحيات'],
    version: 'v1.5',
    status: 'محدث',
    views: 540,
    downloads: 102,
  },

  // ========== القسم 3: الصور الهندسية والخرائط ==========
  {
    id: 'street-view',
    title: 'صورة جوية: شارع الثلاثين (ذمار)',
    description:
      'صورة جوية عالية الدقة للشارع الرئيسي بمدينة ذمار، توضح التخطيط العمراني الحالي، شبكة الطرق، ومواقع الخدمات.',
    category: 'صورة هندسية',
    type: 'image',
    url: '/docs/imagemainstreet.png',
    featured: true,
    icon: Camera,
    department: 'إدارة الطرق',
    classification: 'عام',
    keywords: ['شارع', 'الثلاثين', 'ذمار', 'تخطيط', 'جوية'],
    version: 'v1.0',
    status: 'نشط',
    views: 980,
    downloads: 240,
  },
  {
    id: 'parking-map',
    title: 'خريطة تنظيم مواقف السيارات',
    description:
      'خريطة تنظيمية توضح توزيع مواقف السيارات في الأحياء السكنية والتجارية، مع بيان مناطق الحظر والمسارات المحددة.',
    category: 'صورة هندسية',
    type: 'image',
    url: '/docs/تنظيم_المواقف.png',
    featured: false,
    icon: MapPin,
    department: 'إدارة الطرق',
    classification: 'عام',
    keywords: ['خريطة', 'مواقف', 'تنظيم', 'سكني', 'تجاري'],
    version: 'v2.0',
    status: 'نشط',
    views: 480,
    downloads: 110,
  },
  {
    id: 'engineering-works-photo',
    title: 'أعمال الحفر والبنية التحتية (ذمار)',
    description:
      'توثيق عمليات الحفر ومد أنابيب المياه والصرف الصحي في شارع الثلاثين، مع بيان إجراءات السلامة والأمان.',
    category: 'صورة هندسية',
    type: 'image',
    url: '/docs/parkingorgn1.png',
    featured: false,
    icon: HardHat,
    department: 'إدارة الطرق',
    responsibleEngineer: 'م. عبدالله القرشي',
    classification: 'داخلي',
    keywords: ['حفر', 'بنية', 'تحتية', 'مياه', 'صرف'],
    version: 'v1.0',
    status: 'منتهي',
    views: 350,
    downloads: 85,
  },

  // ========== القسم 4: المراجع القانونية ==========
  {
    id: 'expert-review',
    title: 'التقرير الفني: الخبراء والمراجعة',
    description:
      'تقرير فني شامل لمراجعة معايير الجودة والسلامة الهندسية في المشاريع المنفذة في المحافظة.',
    category: 'تقرير فني',
    type: 'pdf',
    url: '/docs/EXPERT_REVIEW_10_10.md',
    pages: 110,
    size: '8.2 MB',
    updatedAt: '2026-05-20',
    featured: false,
    icon: FileCheck,
    department: 'الإدارة الفنية',
    classification: 'عام',
    keywords: ['معايير', 'فنية', 'مواصفات', 'هندسية', 'بناء'],
    version: 'v4.0',
    status: 'نشط',
    views: 1120,
    downloads: 310,
    lastDownloadAt: '2026-06-22',
  },
  {
    id: 'updates-analysis',
    title: 'تقرير التحليل الشامل للتحديثات',
    description: 'تحليل شامل للتحديثات والتحسينات المنفذة في البوابة الإلكترونية والخدمات الرقمية.',
    category: 'تقرير فني',
    type: 'pdf',
    url: '/docs/UPDATES_ANALYSIS.md',
    pages: 200,
    size: '7.8 MB',
    updatedAt: '2026-04-15',
    featured: true,
    icon: Gavel,
    department: 'الشؤون القانونية',
    classification: 'عام',
    keywords: ['قوانين', 'تشريعات', 'يمنية', 'بناء', 'طرق'],
    version: 'v2.2',
    status: 'محدث',
    views: 1850,
    downloads: 455,
    lastDownloadAt: '2026-06-20',
  },

  // ========== القسم 5: التعاميم الإدارية ==========
  {
    id: 'achievement-report',
    title: 'تقرير الإنجاز',
    description: 'تقرير دوري يوثق الإنجازات والمشاريع المنفذة في المحافظة خلال الفترة المحددة.',
    category: 'تقرير فني',
    type: 'pdf',
    url: '/docs/تقرير_الانجاز.md',
    pages: 8,
    size: '0.5 MB',
    updatedAt: '2026-06-01',
    featured: false,
    icon: Building2,
    department: 'الإدارة العامة',
    classification: 'عام',
    keywords: ['تعميم', 'أوقات', 'دوام', 'مراجعين'],
    version: 'v1.0',
    status: 'نشط',
    views: 680,
    downloads: 220,
  },
  {
    id: 'comprehensive-analysis',
    title: 'التقرير التحليلي الشامل',
    description: 'تحليل شامل لأداء الخدمات والعمليات في المكتب مع توصيات للتحسين المستمر.',
    category: 'تقرير فني',
    type: 'pdf',
    url: '/docs/تقرير_التحليل_الشامل.md',
    pages: 12,
    size: '0.8 MB',
    updatedAt: '2026-05-25',
    featured: false,
    icon: FileOutput,
    department: 'الإدارة العامة',
    classification: 'داخلي',
    keywords: ['تعميم', 'استلام', 'تسليم', 'إلكتروني'],
    version: 'v1.2',
    status: 'نشط',
    views: 450,
    downloads: 130,
  },

  // ========== القسم 6: العقود النموذجية ==========
  {
    id: 'governorate-map',
    title: 'خريطة المحافظة الرئيسية',
    description: 'خريطة تفصيلية لمحافظة ذمار تُظهر المناطق الإدارية والطرق الرئيسية والحدود.',
    category: 'خريطة تنظيمية',
    type: 'image',
    url: '/docs/ThamarMapMain.png',
    pages: 25,
    size: '0.9 MB',
    updatedAt: '2026-06-10',
    featured: false,
    icon: PenTool,
    department: 'إدارة الطرق',
    classification: 'داخلي',
    keywords: ['عقد', 'طرق', 'تنفيذ', 'صيانة', 'ضمانات'],
    version: 'v3.0',
    status: 'نشط',
    views: 420,
    downloads: 150,
  },
  {
    id: 'parking-org',
    title: 'تنظيم مواقف السيارات',
    description: 'خريطة وثيقة لتخطيط وتنظيم مواقف السيارات في المناطق السكنية والتجارية.',
    category: 'خريطة تنظيمية',
    type: 'image',
    url: '/docs/parkingorgn1.png',
    pages: 18,
    size: '0.7 MB',
    updatedAt: '2026-06-05',
    featured: false,
    icon: Building2,
    department: 'إدارة التراخيص',
    classification: 'داخلي',
    keywords: ['عقد', 'بناء', 'حكومي', 'جودة', 'سلامة'],
    version: 'v2.5',
    status: 'محدث',
    views: 380,
    downloads: 120,
  },
];

// ============================================================
// 3. المكونات المساعدة (Advanced Helpers)
// ============================================================

// نظام الإحصاءات الذكي
function useLibraryStats(data: GuidelineItem[]) {
  return useMemo(
    () => ({
      totalDocuments: data.length,
      featuredDocuments: data.filter((d) => d.featured).length,
      totalDownloads: data.reduce((acc, d) => acc + (d.downloads || 0), 0),
      totalViews: data.reduce((acc, d) => acc + (d.views || 0), 0),
      activeDocuments: data.filter((d) => d.status === 'نشط').length,
      latestUpdate: new Date(
        Math.max(...data.map((d) => new Date(d.updatedAt || '').getTime())),
      ).toLocaleDateString('ar-YE'),
    }),
    [data],
  );
}

type ScrollRevealProps = Readonly<{
  children: ReactNode;
  className?: string;
  delay?: number;
}>;

// مكون الظهور التدريجي (Optimized ScrollReveal)
function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(true);
            observer.disconnect();
          }, delay);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
}

// معاينة الملفات
function useFilePreview() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closePreview = () => {
    setIsOpen(false);
    setPreviewUrl(null);
    document.body.style.overflow = '';
  };

  return { previewUrl, isOpen, openPreview, closePreview };
}

// ============================================================
// 4. مكون عرض الوثيقة (Enterprise Card Component)
// ============================================================
const GuidelineCard = memo(function GuidelineCard({
  item,
  onPreview,
  viewMode,
}: {
  item: GuidelineItem;
  onPreview: (url: string) => void;
  viewMode: 'grid' | 'list';
}) {
  const Icon = item.icon || FileText;
  // ألوان الفئات المؤسسية
  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'دليل شامل': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    'فصل تقني': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    'نموذج رسمي': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    'صورة هندسية': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    'مرجع قانوني': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    'تعميم إداري': { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    'عقد نموذجي': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
    'تقرير فني': { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
    'خريطة تنظيمية': { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  };
  const color = categoryColors[item.category] || categoryColors['دليل شامل'];

  // أيقونات نوع الملف
  const typeIconMap: Record<string, React.ReactNode> = {
    pdf: (
      <FileText
        size={14}
        className="text-red-500"
      />
    ),
    image: (
      <Camera
        size={14}
        className="text-blue-500"
      />
    ),
    doc: (
      <FileCheck
        size={14}
        className="text-blue-600"
      />
    ),
    xlsx: (
      <Layers
        size={14}
        className="text-emerald-500"
      />
    ),
    zip: (
      <FolderOpen
        size={14}
        className="text-amber-500"
      />
    ),
  };

  // وضع عرض القائمة (Enterprise List View)
  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.bg} ${color.text} shrink-0`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}
            >
              {item.category}
            </span>
            {item.featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-700">
                ★ مميز
              </span>
            )}
            <span className="text-[10px] text-gray-400 border-r border-gray-200 pr-2 mr-2 flex items-center gap-1">
              <User size={10} /> {item.department}
            </span>
          </div>
          <h3 className="font-bold text-gray-800 text-base truncate">{item.title}</h3>
          <p className="text-gray-500 text-sm truncate">{item.description}</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-400 shrink-0 w-full md:w-auto justify-end">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {item.updatedAt}
          </span>
          <span className="flex items-center gap-1">
            <Database size={12} /> {item.size}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPreview(item.url)}
              className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-gray-500"
            >
              <Eye size={14} />
            </button>
            <a
              href={item.url}
              download
              className="p-1.5 bg-gov-50 rounded-lg hover:bg-gov-100 transition text-gov-600"
            >
              <Download size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // وضع عرض البطاقات (Grid View)
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 relative ${item.featured ? 'ring-2 ring-gold-400 ring-offset-2' : ''}`}
    >
      {item.featured && (
        <div className="absolute inset-0 bg-gradient-to-br from-gold-200/40 via-transparent to-transparent pointer-events-none" />
      )}
      {item.status === 'منتهي' && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
          منتهي
        </div>
      )}

      <div className={`px-5 py-4 border-b flex items-center justify-between ${color.bg}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Icon
              size={16}
              className="text-gov-700"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-opacity-90">
            {item.category}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {typeIconMap[item.type] || <FileText size={14} />}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>

        {/* ميتا بيانات محسنة */}
        <div className="flex flex-wrap items-center gap-2 text-[9px] text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <User size={10} /> {item.department}
          </span>
          <span className="w-px h-2 bg-gray-200" />
          <span className="flex items-center gap-1">
            <Clock size={10} /> {item.updatedAt}
          </span>
          {item.version && (
            <>
              <span className="w-px h-2 bg-gray-200" />
              <span className="bg-gray-100 px-1.5 rounded">نسخة {item.version}</span>
            </>
          )}
        </div>

        {/* أزرار الإجراءات التفاعلية */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPreview(item.url)}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:border-gov-300 hover:bg-gov-50 text-gov-700 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95"
          >
            <Eye size={16} /> معاينة
          </button>
          <a
            href={item.url}
            download
            className="flex-1 flex items-center justify-center gap-2 bg-gov-600 hover:bg-gov-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-all hover:shadow-lg active:scale-95"
          >
            <Download size={16} /> تحميل
          </a>
        </div>
      </div>

      <div className="px-5 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400">
        <span className="flex items-center gap-1">
          <CheckCircle2
            size={10}
            className="text-emerald-500"
          />{' '}
          {item.classification}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={10} /> {item.views.toLocaleString()}
        </span>
      </div>
    </div>
  );
});

// ============================================================
// 5. الصفحة الرئيسية المتكاملة (Enterprise Knowledge Hub)
// ============================================================
export default function GuidelinesPage() {
  const { goBack, canGoBack } = useNavigation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'الكل'>('الكل');
  const [departmentFilter, setDepartmentFilter] = useState<string>('الكل');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'downloads'>('date');
  const { previewUrl, isOpen, openPreview, closePreview } = useFilePreview();

  // استخراج الفئات والإدارات
  const categories = ['الكل', ...Array.from(new Set(guidelinesData.map((d) => d.category)))];
  const departments = ['الكل', ...Array.from(new Set(guidelinesData.map((d) => d.department)))];

  // الفلترة المتقدمة
  const filteredData = useMemo(() => {
    const data = guidelinesData.filter((item) => {
      const matchSearch =
        item.title.includes(search) ||
        item.description.includes(search) ||
        item.keywords?.some((k) => k.includes(search));
      const matchCategory = categoryFilter === 'الكل' || item.category === categoryFilter;
      const matchDepartment = departmentFilter === 'الكل' || item.department === departmentFilter;
      return matchSearch && matchCategory && matchDepartment;
    });

    // الترتيب المتقدم
    switch (sortBy) {
      case 'date':
        data.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        break;
      case 'title':
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'downloads':
        data.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
    }
    return data;
  }, [search, categoryFilter, departmentFilter, sortBy]);

  const stats = useLibraryStats(guidelinesData);

  const handleBack = useCallback(() => {
    if (canGoBack) goBack();
  }, [canGoBack, goBack]);

  return (
    <div
      className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
      dir="rtl"
    >
      {/* 1. شريط التنقل العلوي */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${canGoBack ? 'text-gov-600 hover:bg-gov-50' : 'text-gray-300 cursor-not-allowed'}`}
          >
            <ArrowLeft size={18} /> رجوع
          </button>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <Building2
              size={14}
              className="text-gov-600"
            />
            <span className="font-bold text-gov-700">المكتبة المؤسسية</span>
            <span className="text-[10px] bg-gov-50 px-2 py-0.5 rounded-full text-gov-600">
              {filteredData.length} وثيقة
            </span>
          </div>
        </div>
      </div>

      {/* 2. قسم البطل الاحترافي (Hero + Dashboard) */}
      <div className="relative bg-gov-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/vite.svg')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-gov-800/90 via-gov-900/90 to-black/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/30 text-gold-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <LayoutDashboard size={14} /> مكتبة المعرفة المؤسسية
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
              الدليل الإرشادي والمرجع الشامل
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6">
              تصفح الأدلة الرسمية والفصول التقنية والنماذج المعتمدة التي توجّه إجراءات المكتب وتدعم
              قرارات الأعمال الهندسية والإدارية في محافظة ذمار.
            </p>
            <div className="max-w-4xl mx-auto grid gap-3 sm:grid-cols-3 mb-10 text-white/80 text-sm">
              <div className="rounded-3xl bg-white/10 border border-white/15 p-4">
                <div className="font-semibold text-white mb-1">مرجع رسمي</div>
                <div>دليل موحّد معتمد لجميع خدمات المكتب.</div>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/15 p-4">
                <div className="font-semibold text-white mb-1">تصنيف دقيق</div>
                <div>وثائق مقسمة إلى أدلة، فصول، نماذج، وصور هندسية.</div>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/15 p-4">
                <div className="font-semibold text-white mb-1">دعم اتخاذ القرار</div>
                <div>مصدر سريع للمهندسين والإداريين وأصحاب المصلحة.</div>
              </div>
            </div>

            {/* لوحة إحصائيات المكتب (Enterprise Dashboard) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:bg-white/15 transition">
                <Database
                  size={20}
                  className="text-gold-400 mx-auto mb-1"
                />
                <div className="text-xl font-bold text-white">{stats.totalDocuments}</div>
                <div className="text-[10px] text-white/50">إجمالي الوثائق</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:bg-white/15 transition">
                <TrendingUp
                  size={20}
                  className="text-gold-400 mx-auto mb-1"
                />
                <div className="text-xl font-bold text-white">{stats.activeDocuments}</div>
                <div className="text-[10px] text-white/50">وثائق نشطة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:bg-white/15 transition">
                <Download
                  size={20}
                  className="text-gold-400 mx-auto mb-1"
                />
                <div className="text-xl font-bold text-white">
                  {stats.totalDownloads.toLocaleString()}
                </div>
                <div className="text-[10px] text-white/50">إجمالي التحميلات</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:bg-white/15 transition">
                <Eye
                  size={20}
                  className="text-gold-400 mx-auto mb-1"
                />
                <div className="text-xl font-bold text-white">
                  {stats.totalViews.toLocaleString()}
                </div>
                <div className="text-[10px] text-white/50">إجمالي المشاهدات</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:bg-white/15 transition">
                <Calendar
                  size={20}
                  className="text-gold-400 mx-auto mb-1"
                />
                <div className="text-xl font-bold text-white text-[14px]">{stats.latestUpdate}</div>
                <div className="text-[10px] text-white/50">آخر تحديث</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 3. المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* أ. أدوات التحكم المتقدمة (Advanced Filters) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* البحث المتقدم */}
            <div className="flex items-center gap-3 flex-1 w-full bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-gov-500 transition">
              <Search
                size={18}
                className="text-gray-400"
              />
              <input
                type="text"
                placeholder="بحث بالعنوان، الوصف، أو كلمة مفتاحية..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-0 outline-none text-sm bg-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* تصفية حسب الفئة */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as DocumentCategory | 'الكل')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200 outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option
                    key={c}
                    value={c}
                  >
                    {c}
                  </option>
                ))}
              </select>

              {/* تصفية حسب القسم */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200 outline-none cursor-pointer"
              >
                {departments.map((d) => (
                  <option
                    key={d}
                    value={d}
                  >
                    {d}
                  </option>
                ))}
              </select>

              {/* الترتيب */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'downloads')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200 outline-none cursor-pointer"
              >
                <option value="date">الأحدث</option>
                <option value="title">حسب العنوان</option>
                <option value="downloads">الأكثر تحميلاً</option>
              </select>

              {/* تبديل العرض */}
              <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-gov-50 text-gov-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-gov-50 text-gov-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ب. عرض النتائج المتقدم */}
        {filteredData.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen
              size={64}
              className="mx-auto text-gray-300 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-500 mb-2">لا توجد وثائق مطابقة</h3>
            <p className="text-gray-400">حاول تعديل معايير البحث أو الفلتر</p>
          </div>
        ) : (
          <div
            className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 space-y-0' : ''}`}
          >
            {filteredData.map((item, index) => (
              <ScrollReveal
                key={item.id}
                delay={Math.min(index * 30, 400)}
              >
                <GuidelineCard
                  item={item}
                  onPreview={openPreview}
                  viewMode={viewMode}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* ج. شريط الدعم المؤسسي */}
        <ScrollReveal>
          <div className="mt-16 bg-gradient-to-br from-gov-700 to-gov-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="geo-pattern absolute inset-0 opacity-5" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center">
                  <Info
                    size={32}
                    className="text-gold-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">تحتاج مساعدة في البحث أو الإرشاد؟</h3>
                  <p className="text-white/70 text-sm">
                    فريق الدعم الفني للمكتبة المؤسسية جاهز لمساعدتك في أي استفسار.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="tel:+967777888198"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-semibold transition border border-white/10"
                >
                  <Phone size={16} /> 777-888-198
                </a>
                <button
                  onClick={() => window.open('/contact', '_self')}
                  className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-gov-900 px-6 py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-gold-500/25"
                >
                  <MessageCircle size={16} /> تواصل معنا
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* 4. نافذة المعاينة المتطورة (Professional Viewer) */}
      {isOpen && previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gov-100 rounded-lg flex items-center justify-center">
                  <Eye
                    size={16}
                    className="text-gov-600"
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">معاينة الوثيقة</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  download
                  className="p-2 rounded-lg bg-gov-50 text-gov-600 hover:bg-gov-100 transition"
                  title="تحميل"
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={closePreview}
                  className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                  title="إغلاق"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 relative overflow-hidden">
              {previewUrl.endsWith('.pdf') ? (
                <iframe
                  src={`${previewUrl}#zoom=fit`}
                  className="w-full h-full"
                  title="معاينة PDF"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <img
                    src={previewUrl}
                    alt="معاينة"
                    className="max-w-full max-h-full object-contain bg-white shadow-2xl"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end p-3 border-t border-gray-100 bg-white text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Shield size={12} /> معاينة آمنة - لا يتم حفظ البيانات
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
