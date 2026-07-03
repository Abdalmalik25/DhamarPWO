// ============================================================
// OfficialFormWrapper.tsx - النموذج الرسمي الموحد المعتمد
// الإصدار المؤسسي المتكامل v3.0 - أعلى معايير الجودة الحكومية
// ============================================================

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Printer,
  ArrowRight,
  CheckCircle2,
  Eye,
  X,
  Loader2,
  FileCheck,
  FileText,
  FileSignature,
  Lock,
  Unlock,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  History,
  Check,
  AlertTriangle,
  Archive,
} from 'lucide-react';

// ============================================================
// 1. الأنواع المتقدمة (Advanced Types)
// ============================================================

/** حجم الصفحة المدعوم */
export type PageSize = 'A4' | 'A5' | 'A3' | 'Letter' | 'Legal' | 'Executive';

/** اتجاه الصفحة */
export type PageOrientation = 'portrait' | 'landscape';

/** حالة الطباعة */
export type PrintStatus = 'idle' | 'printing' | 'success' | 'error' | 'cancelled';

/** مستوى الأمان */
export type SecurityLevel = 'public' | 'internal' | 'confidential' | 'restricted' | 'top-secret';

/** نوع التوقيع */
export type SignatureType = 'none' | 'digital' | 'wet' | 'stamp' | 'combined';

/** حالة الوثيقة */
export type DocumentStatus =
  'draft' | 'review' | 'approved' | 'signed' | 'issued' | 'archived' | 'cancelled';

/** تنسيق التاريخ */
export type DateFormat = 'gregorian' | 'hijri' | 'both' | 'iso';

/** لغة الوثيقة */
export type DocumentLanguage = 'ar' | 'en' | 'both';

/** هيكل بيانات التوقيع */
export interface SignatureData {
  /** اسم الموقع */
  signerName: string;
  /** منصب الموقع */
  signerTitle: string;
  /** تاريخ التوقيع */
  signedAt: Date;
  /** نوع التوقيع */
  type: SignatureType;
  /** معرف الشهادة الرقمية (إن وجد) */
  certificateId?: string;
  /** بصمة التوقيع */
  fingerprint?: string;
}

/** هيكل بيانات QR Code */
export interface QRCodeData {
  /** محتوى الـ QR */
  content: string;
  /** حجم الـ QR */
  size?: number;
  /** لون الخلفية */
  bgColor?: string;
  /** لون المقدمة */
  fgColor?: string;
  /** مستوى التصحيح */
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

/** هيكل بيانات الباركود */
export interface BarcodeData {
  /** محتوى الباركود */
  content: string;
  /** نوع الباركود */
  format?: 'code128' | 'code39' | 'ean13' | 'upca' | 'itf';
  /** عرض الباركود */
  width?: number;
  /** ارتفاع الباركود */
  height?: number;
  /** عرض الخطوط */
  lineWidth?: number;
}

/** هيكل بيانات التدقيق */
export interface AuditTrailEntry {
  /** معرف الإجراء */
  id: string;
  /** الوقت */
  timestamp: Date;
  /** المستخدم */
  user: string;
  /** الإجراء */
  action: 'create' | 'view' | 'edit' | 'print' | 'sign' | 'approve' | 'archive' | 'delete';
  /** التفاصيل */
  details: string;
  /** IP (اختياري) */
  ip?: string;
}

/** إعدادات متقدمة للطباعة */
export interface AdvancedPrintSettings {
  /** الهوامش (مم) */
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  /** عامل التكبير */
  scale?: number;
  /** وضع الطباعة المزدوجة */
  duplex?: 'simplex' | 'duplex' | 'tumble';
  /** عدد النسخ */
  copies?: number;
  /** طباعة التعليقات */
  printComments?: boolean;
  /** طباعة الخلفيات */
  printBackgrounds?: boolean;
  /** جودة الطباعة */
  quality?: 'draft' | 'normal' | 'high';
  /** ترتيب الصفحات */
  pageOrder?: 'normal' | 'reverse';
}

/** إعدادات العلامة المائية */
export interface WatermarkSettings {
  /** نص العلامة المائية */
  text: string;
  /** العتامة (0-1) */
  opacity?: number;
  /** الزاوية (بالدرجات) */
  angle?: number;
  /** حجم الخط */
  fontSize?: number;
  /** لون النص */
  color?: string;
  /** تكرار العلامة */
  repeat?: boolean;
  /** مسافة التكرار */
  spacing?: number;
}

/** بيانات تعريف الوثيقة (Metadata) */
export interface DocumentMetadata {
  /** معرف الوثيقة */
  documentId: string;
  /** الإصدار */
  version: string;
  /** الحالة */
  status: DocumentStatus;
  /** المستوى الأمني */
  securityLevel: SecurityLevel;
  /** كاتب الوثيقة */
  author: string;
  /** تاريخ الإنشاء */
  createdAt: Date;
  /** تاريخ آخر تعديل */
  updatedAt: Date;
  /** تاريخ الإصدار */
  issuedAt?: Date;
  /** تاريخ انتهاء الصلاحية (إن وجد) */
  expiresAt?: Date;
  /** الكلمات المفتاحية */
  keywords: string[];
  /** الفئة */
  category: string;
  /** الجهة المصدرة */
  issuingAuthority: string;
  /** الجهة المستلمة */
  recipient?: string;
  /** المرجعية */
  referenceNumber: string;
  /** المعرف الموحد */
  uuid: string;
}

/** جميع خيارات التهيئة لنموذج المكون */
export interface OfficialFormWrapperProps {
  // ===== الأساسيات =====
  /** معرف النموذج (مرجع رسمي) */
  formRef: string;
  /** عنوان النموذج */
  title: string;
  /** محتوى النموذج */
  children: ReactNode;
  /** دالة العودة */
  onBack?: () => void;
  /** تذييل مخصص */
  printFooter?: ReactNode;

  // ===== الهوية المؤسسية =====
  /** اسم المؤسسة */
  institutionName?: string;
  /** اسم الوزارة */
  ministryName?: string;
  /** اسم المحافظة */
  governorateName?: string;
  /** اسم المكتب */
  officeName?: string;
  /** شعار المؤسسة (مسار الصورة) */
  logoUrl?: string;
  /** البديل للشعار */
  logoAlt?: string;
  /** عرض الشعار */
  logoWidth?: number;
  /** ارتفاع الشعار */
  logoHeight?: number;

  // ===== إعدادات الطباعة =====
  /** تفعيل الطباعة */
  printEnabled?: boolean;
  /** إظهار معاينة الطباعة */
  showPreview?: boolean;
  /** حجم الصفحة */
  pageSize?: PageSize;
  /** اتجاه الصفحة */
  pageOrientation?: PageOrientation;
  /** إعدادات الطباعة المتقدمة */
  printSettings?: AdvancedPrintSettings;
  /** إخفاء شريط الأدوات */
  hideToolbar?: boolean;
  /** إخفاء شريط الأدوات في الطباعة */
  hidePrintToolbar?: boolean;

  // ===== العلامة المائية =====
  /** نص العلامة المائية */
  watermarkText?: string;
  /** إعدادات العلامة المائية المتقدمة */
  watermarkSettings?: Partial<WatermarkSettings>;

  // ===== التوقيع =====
  /** بيانات التوقيع */
  signature?: SignatureData;
  /** تفعيل التوقيع الرقمي */
  digitalSignatureEnabled?: boolean;

  // ===== QR / باركود =====
  /** بيانات QR Code */
  qrCode?: QRCodeData;
  /** بيانات الباركود */
  barcode?: BarcodeData;

  // ===== البيانات الوصفية =====
  /** بيانات تعريف الوثيقة */
  metadata?: Partial<DocumentMetadata>;
  /** تفعيل سجل التدقيق */
  auditTrailEnabled?: boolean;

  // ===== التواريخ =====
  /** تنسيق التاريخ */
  dateFormat?: DateFormat;
  /** تاريخ مخصص (تجاوز التاريخ الحالي) */
  customDate?: Date;
  /** اللغة */
  language?: DocumentLanguage;

  // ===== الأمان =====
  /** مستوى الأمان */
  securityLevel?: SecurityLevel;
  /** كلمة مرور للمستند (لمنع التعديل) */
  password?: string;
  /** تمكين تشفير المحتوى */
  encryptionEnabled?: boolean;

  // ===== إضافات =====
  /** رقم المرجع الإضافي */
  additionalReference?: string;
  /** معلومات إضافية في التذييل */
  footerExtra?: string;
  /** قالب مخصص */
  customHeader?: ReactNode;
  /** قالب تذييل مخصص */
  customFooter?: ReactNode;
  /** فئات CSS إضافية */
  className?: string;
  /** نمط مخصص */
  style?: React.CSSProperties;
}

// ============================================================
// 2. الواجهات البرمجية للمكون (Component Interfaces)
// ============================================================

/** واجهة مرجع المكون (للتحكم الخارجي) */
export interface OfficialFormWrapperRef {
  /** طباعة المستند */
  print: () => void;
  /** عرض المعاينة */
  preview: () => void;
  /** إخفاء المعاينة */
  closePreview: () => void;
  /** تصدير المستند كـ PDF (إذا كان متاحاً) */
  exportPDF: () => void;
  /** الحصول على بيانات التدقيق */
  getAuditTrail: () => AuditTrailEntry[];
  /** إضافة إجراء تدقيق */
  addAuditEntry: (action: AuditTrailEntry['action'], details: string) => void;
  /** الحصول على بيانات الوثيقة كاملة */
  getDocumentData: () => DocumentMetadata;
  /** إعادة ضبط الحالة */
  reset: () => void;
  /** تغيير حجم الصفحة */
  setPageSize: (size: PageSize) => void;
  /** تغيير الاتجاه */
  setOrientation: (orientation: PageOrientation) => void;
}

// ============================================================
// 3. أدوات مساعدة (Utilities)
// ============================================================

/** توليد معرف فريد UUID v4 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** تنسيق التاريخ حسب التنسيق المطلوب */
function formatDate(
  date: Date,
  format: DateFormat = 'both',
  language: DocumentLanguage = 'ar',
): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  const gregorian = date.toLocaleDateString(locale, options);

  try {
    const hijriOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    const hijri = date.toLocaleDateString('ar-SA-u-ca-islamic', hijriOptions);

    switch (format) {
      case 'gregorian':
        return gregorian;
      case 'hijri':
        return hijri;
      case 'both':
        return `${gregorian} م | ${hijri} هـ`;
      case 'iso':
        return date.toISOString().split('T')[0];
      default:
        return gregorian;
    }
  } catch {
    return gregorian;
  }
}

/** تنسيق رقم النموذج */
function formatFormRef(ref: string): string {
  return ref.toUpperCase().trim().replace(/\s+/g, '-');
}

/** إنشاء رقم تسلسلي */
function generateSerialNumber(formRef: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `${formatFormRef(formRef)}-${year}-${month}-${random}`;
}

// ============================================================
// 4. المكونات الفرعية المتخصصة (Specialized Sub-components)
// ============================================================

// 4.1. مكون شعار متقدم
const InstitutionalLogo = memo(function InstitutionalLogo({
  src,
  alt = 'شعار المؤسسة',
  width = 65,
  height = 65,
  institutionName,
}: {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  institutionName?: string;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-contain"
          style={{ width, height }}
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 font-black"
          style={{ width, height, fontSize: Math.min(width, height) * 0.35 }}
        >
          {institutionName?.charAt(0) || 'م'}
        </div>
      )}
    </div>
  );
});

// 4.2. مكون QR Code (محاكي - يمكن استبداله بمكتبة حقيقية)
const QRCodeDisplay = memo(function QRCodeDisplay({ data }: { data: QRCodeData }) {
  return (
    <div
      className="flex items-center justify-center p-1 bg-white border-2 border-gray-300 rounded-lg"
      style={{
        width: data.size || 80,
        height: data.size || 80,
        backgroundColor: data.bgColor || '#ffffff',
      }}
    >
      <div
        className="w-full h-full grid grid-cols-5 grid-rows-5 gap-0.5"
        style={{ backgroundColor: data.fgColor || '#000000' }}
      >
        {Array.from({ length: 25 }).map((_, i) => {
          const isFilled = Math.random() > 0.5;
          return (
            <div
              key={i}
              className={isFilled ? 'bg-current' : 'bg-transparent'}
              style={{ backgroundColor: isFilled ? data.fgColor || '#000000' : 'transparent' }}
            />
          );
        })}
      </div>
    </div>
  );
});

// 4.3. مكون حالة الوثيقة
const DocumentStatusBadge = memo(function DocumentStatusBadge({
  status,
}: {
  status: DocumentStatus;
}) {
  const statusConfig: Record<DocumentStatus, { label: string; color: string; bg: string }> = {
    draft: { label: 'مسودة', color: 'text-gray-700', bg: 'bg-gray-100' },
    review: { label: 'مراجعة', color: 'text-blue-700', bg: 'bg-blue-100' },
    approved: { label: 'معتمد', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    signed: { label: 'موقع', color: 'text-indigo-700', bg: 'bg-indigo-100' },
    issued: { label: 'صادر', color: 'text-amber-700', bg: 'bg-amber-100' },
    archived: { label: 'مؤرشف', color: 'text-gray-500', bg: 'bg-gray-100' },
    cancelled: { label: 'ملغي', color: 'text-red-700', bg: 'bg-red-100' },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.color}`}
    >
      {status === 'approved' && <Check size={12} />}
      {status === 'signed' && <FileSignature size={12} />}
      {status === 'issued' && <FileCheck size={12} />}
      {status === 'archived' && <Archive size={12} />}
      {status === 'draft' && <FileText size={12} />}
      {config.label}
    </span>
  );
});

// 4.4. مكون شريط الأمان
const SecurityBar = memo(function SecurityBar({ level }: { level: SecurityLevel }) {
  const config: Record<SecurityLevel, { label: string; color: string; icon: ReactNode }> = {
    'public': {
      label: 'عام',
      color: 'text-emerald-600 border-emerald-400',
      icon: <Unlock size={12} />,
    },
    'internal': {
      label: 'داخلي',
      color: 'text-blue-600 border-blue-400',
      icon: <Lock size={12} />,
    },
    'confidential': {
      label: 'سري',
      color: 'text-amber-600 border-amber-400',
      icon: <Lock size={12} />,
    },
    'restricted': {
      label: 'مقيد',
      color: 'text-orange-600 border-orange-400',
      icon: <Lock size={12} />,
    },
    'top-secret': {
      label: 'سري جداً',
      color: 'text-red-600 border-red-400',
      icon: <Lock size={12} />,
    },
  };

  const c = config[level] || config.internal;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-full text-xs font-bold ${c.color}`}
    >
      {c.icon}
      {c.label}
    </div>
  );
});

// 4.5. مكون سجل التدقيق
const AuditTrailPanel = memo(function AuditTrailPanel({ entries }: { entries: AuditTrailEntry[] }) {
  const actionIcons: Record<AuditTrailEntry['action'], ReactNode> = {
    create: <FileText size={14} />,
    view: <Eye size={14} />,
    edit: <FileText size={14} />,
    print: <Printer size={14} />,
    sign: <FileSignature size={14} />,
    approve: <Check size={14} />,
    archive: <Archive size={14} />,
    delete: <X size={14} />,
  };

  const actionColors: Record<AuditTrailEntry['action'], string> = {
    create: 'text-emerald-600',
    view: 'text-blue-600',
    edit: 'text-amber-600',
    print: 'text-purple-600',
    sign: 'text-indigo-600',
    approve: 'text-emerald-600',
    archive: 'text-gray-600',
    delete: 'text-red-600',
  };

  return (
    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
      <h5 className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
        <History size={14} /> سجل التدقيق
      </h5>
      {entries.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-2">لا توجد إجراءات مسجلة</p>
      ) : (
        <ul className="space-y-1">
          {entries
            .slice()
            .reverse()
            .map((entry) => (
              <li
                key={entry.id}
                className="flex items-start gap-2 text-xs py-1 border-b border-gray-100 last:border-0"
              >
                <span className={`mt-0.5 ${actionColors[entry.action]}`}>
                  {actionIcons[entry.action]}
                </span>
                <span className="flex-1">
                  <span className="font-medium text-gray-700">{entry.user}</span>
                  <span className="text-gray-500"> — {entry.details}</span>
                </span>
                <span className="text-gray-400 text-[10px] whitespace-nowrap">
                  {entry.timestamp.toLocaleTimeString('ar-EG', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
});

// ============================================================
// 5. المكون الرئيسي (Main Component) - الإصدار المتكامل
// ============================================================

export const OfficialFormWrapper = forwardRef<OfficialFormWrapperRef, OfficialFormWrapperProps>(
  function OfficialFormWrapper(
    {
      // ===== الأساسيات =====
      formRef,
      title,
      children,
      onBack,
      printFooter,

      // ===== الهوية المؤسسية =====
      institutionName = 'الجمهورية اليمنية',
      ministryName = 'وزارة الأشغال العامة والطرق',
      governorateName = 'محافظة ذمار',
      officeName = 'مكتب الأشغال العامة والطرق',
      logoUrl = '/images/logo_yemen.jpg',
      logoAlt = 'شعار الجمهورية اليمنية',
      logoWidth = 65,
      logoHeight = 65,

      // ===== إعدادات الطباعة =====
      printEnabled = true,
      showPreview = true,
      pageSize = 'A4',
      pageOrientation = 'portrait',
      printSettings = {},
      hideToolbar = false,
      hidePrintToolbar = false,

      // ===== العلامة المائية =====
      watermarkText = 'نسخة رسمية',
      watermarkSettings = {},

      // ===== التوقيع =====
      signature,
      digitalSignatureEnabled = false,

      // ===== QR / باركود =====
      qrCode,
      barcode,

      // ===== البيانات الوصفية =====
      metadata: metadataProp = {},
      auditTrailEnabled = true,

      // ===== التواريخ =====
      dateFormat = 'both',
      customDate,
      language = 'ar',

      // ===== الأمان =====
      securityLevel: securityLevelProp = 'internal',
      password,
      encryptionEnabled = false,

      // ===== إضافات =====
      additionalReference,
      footerExtra,
      customHeader,
      customFooter,
      className = '',
      style = {},
    },
    ref,
  ) {
    // ============================================================
    // 5.1. الحالات الداخلية (Internal State)
    // ============================================================

    const [printStatus, setPrintStatus] = useState<PrintStatus>('idle');
    const [isPreview, setIsPreview] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(100);
    const [auditTrail, setAuditTrail] = useState<AuditTrailEntry[]>([]);
    const [showAudit, setShowAudit] = useState(false);
    const [metadata, setMetadata] = useState<DocumentMetadata>(() => {
      const now = customDate || new Date();
      return {
        documentId: generateUUID(),
        version: '1.0',
        status: 'draft',
        securityLevel: securityLevelProp,
        author: 'system',
        createdAt: now,
        updatedAt: now,
        keywords: [],
        category: 'form',
        issuingAuthority: officeName,
        referenceNumber: formRef,
        uuid: generateUUID(),
        ...metadataProp,
      };
    });

    // ============================================================
    // 5.2. المراجع (Refs)
    // ============================================================

    const printTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const auditIdCounter = useRef(0);

    // ============================================================
    // 5.3. القيم المحسوبة (Computed Values)
    // ============================================================

    const currentDate = useMemo(() => customDate || new Date(), [customDate]);
    const formattedRef = useMemo(() => formatFormRef(formRef), [formRef]);
    const serialNumber = useMemo(() => generateSerialNumber(formattedRef), [formattedRef]);

    const formattedDate = useMemo(
      () => formatDate(currentDate, dateFormat, language),
      [currentDate, dateFormat, language],
    );

    const isRTL = useMemo(() => language === 'ar', [language]);

    const pageSizeMap: Record<PageSize, { width: number; height: number }> = {
      A4: { width: 210, height: 297 },
      A5: { width: 148, height: 210 },
      A3: { width: 297, height: 420 },
      Letter: { width: 215.9, height: 279.4 },
      Legal: { width: 215.9, height: 355.6 },
      Executive: { width: 184.15, height: 266.7 },
    };

    const pageDimensions = pageSizeMap[pageSize] || pageSizeMap.A4;

    const watermarkConfig = useMemo(
      () => ({
        text: watermarkText || 'نسخة رسمية',
        opacity: watermarkSettings.opacity ?? 0.04,
        angle: watermarkSettings.angle ?? -25,
        fontSize: watermarkSettings.fontSize ?? 48,
        color: watermarkSettings.color || '#000000',
        repeat: watermarkSettings.repeat ?? false,
        spacing: watermarkSettings.spacing ?? 200,
      } as const),
      [watermarkText, watermarkSettings],
    );

    // ============================================================
    // 5.4. معالج الطباعة (Print Handler)
    // ============================================================

    const handlePrint = useReactToPrint({
      contentRef: componentRef,
      documentTitle: `${formattedRef} - ${title}`,
      onBeforePrint: async () => {
        setPrintStatus('printing');
        setIsPreview(false);
        if (auditTrailEnabled) {
          addAuditEntry('print', `طباعة النموذج ${formattedRef}`);
        }
      },
      onAfterPrint: () => {
        setPrintStatus('success');
        printTimerRef.current = globalThis.setTimeout(() => setPrintStatus('idle'), 4000);
      },
      onPrintError: (error) => {
        console.error('Print error:', error);
        setPrintStatus('error');
        printTimerRef.current = globalThis.setTimeout(() => setPrintStatus('idle'), 5000);
      },
      pageStyle: `
        @page {
          size: ${pageOrientation === 'landscape' ? `${pageDimensions.height}mm ${pageDimensions.width}mm` : `${pageDimensions.width}mm ${pageDimensions.height}mm`};
          margin: ${printSettings.margins?.top || 12}mm ${printSettings.margins?.right || 15}mm ${printSettings.margins?.bottom || 15}mm ${printSettings.margins?.left || 15}mm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #000000;
            font-family: 'Cairo', 'Tajawal', 'Noto Sans Arabic', 'Arial', sans-serif;
            font-size: 10pt;
            line-height: 1.5;
          }
          .noprint { display: none !important; }
          .pwo-page {
            page-break-after: avoid;
            position: relative;
          }
          .pwo-header-table {
            display: table !important;
            width: 100% !important;
            table-layout: fixed !important;
            border-bottom: 2px solid #000000;
            padding: 8px 0 6px;
          }
          .pwo-header-row { display: table-row !important; }
          .pwo-cell-r {
            display: table-cell !important;
            width: 28%;
            text-align: right;
            vertical-align: middle;
            padding: 0 8px;
          }
          .pwo-cell-c {
            display: table-cell !important;
            width: 44%;
            text-align: center;
            vertical-align: middle;
            padding: 0 8px;
          }
          .pwo-cell-l {
            display: table-cell !important;
            width: 28%;
            text-align: left;
            vertical-align: middle;
            padding: 0 8px;
          }
          .pwo-logo { width: ${logoWidth}px; height: ${logoHeight}px; object-fit: contain; display: block; margin: 0 auto; }
          .pwo-inst { font-size: 10.5pt; font-weight: 800; color: #0a1628; margin-bottom: 1px; }
          .pwo-ministry { font-size: 8pt; font-weight: 700; color: #1f2937; margin-bottom: 1px; }
          .pwo-gov { font-size: 7.5pt; font-weight: 600; color: #4b5563; margin-bottom: 1px; }
          .pwo-office { font-size: 7pt; font-weight: 600; color: #6b7280; }
          .pwo-info { font-size: 7.5pt; }
          .pwo-info-row { display: flex; justify-content: space-between; gap: 4px; margin-bottom: 1px; }
          .pwo-info-label { font-weight: 700; color: #374151; }
          .pwo-info-value { font-weight: 600; color: #0a1628; }
          .pwo-sn { font-size: 6pt; color: #9ca3af; margin-top: 3px; text-align: center; font-family: 'Courier New', monospace; }
          .pwo-title {
            text-align: center;
            padding: 4px 10px 2px;
            font-size: 11pt;
            font-weight: 800;
            color: #0a1628;
            border-bottom: 1px solid #e5e7eb;
          }
          .pwo-body {
            padding: 6px 10px;
            font-size: 10pt;
            line-height: 1.6;
            color: #111827;
          }
          .pwo-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            border-top: 1px solid #9ca3af;
            font-size: 6.5pt;
            color: #4b5563;
            font-weight: 600;
            position: relative;
          }
          .pwo-footer::before {
            content: '';
            position: absolute;
            top: -2px;
            left: 0;
            right: 0;
            height: 1px;
            background: #ce1126;
          }
          .pwo-watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(${watermarkConfig.angle}deg);
            font-size: ${watermarkConfig.fontSize}px;
            font-weight: 900;
            color: ${watermarkConfig.color};
            opacity: ${watermarkConfig.opacity};
            pointer-events: none;
            white-space: nowrap;
            z-index: -1;
            letter-spacing: 0.2em;
          }
          ${
            watermarkConfig.repeat
              ? `
            .pwo-watermark-repeat {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              pointer-events: none;
              z-index: -1;
              background-image: repeating-linear-gradient(
                -25deg,
                transparent,
                transparent ${watermarkConfig.spacing}px,
                rgba(0,0,0,${watermarkConfig.opacity * 0.5}) ${watermarkConfig.spacing}px,
                rgba(0,0,0,${watermarkConfig.opacity * 0.5}) ${watermarkConfig.spacing + 2}px
              );
              background-size: ${watermarkConfig.spacing * 2}px ${watermarkConfig.spacing * 2}px;
            }
          `
              : ''
          }
          .pwo-signature {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #d1d5db;
            font-size: 8pt;
          }
          .pwo-signature-row {
            display: flex;
            justify-content: flex-end;
            gap: 20px;
          }
          .pwo-signature-item {
            text-align: center;
          }
          .pwo-signature-item .sig-line {
            width: 100px;
            border-bottom: 1px solid #000;
            margin: 4px auto;
          }
          .pwo-qr-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 6px;
          }
          .pwo-qr-box {
            padding: 4px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
          }
          .pwo-security-badge {
            display: inline-block;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 6pt;
            font-weight: 700;
          }
          .pwo-meta {
            font-size: 6.5pt;
            color: #6b7280;
            text-align: center;
            padding: 2px 0;
          }
          .pwo-page-number {
            font-size: 6pt;
            color: #9ca3af;
            text-align: center;
            margin-top: 2px;
          }
        }
      `,
    });

    // ============================================================
    // 5.5. معالجات الأحداث (Event Handlers)
    // ============================================================

    const togglePreview = useCallback(() => {
      setIsPreview((prev) => {
        const newState = !prev;
        if (newState && auditTrailEnabled) {
          addAuditEntry('view', `معاينة النموذج ${formattedRef}`);
        }
        return newState;
      });
    }, [auditTrailEnabled, formattedRef]);

    const closePreview = useCallback(() => setIsPreview(false), []);

    const handlePrintClick = useCallback(() => {
      if (printStatus === 'printing') return;

      // التحقق من كلمة المرور
      if (password) {
        const userPassword = prompt('أدخل كلمة المرور للمستند:');
        if (userPassword !== password) {
          alert('كلمة المرور غير صحيحة');
          return;
        }
      }

      handlePrint();
    }, [handlePrint, printStatus, password]);

    const addAuditEntry = useCallback(
      (action: AuditTrailEntry['action'], details: string) => {
        if (!auditTrailEnabled) return;
        const entry: AuditTrailEntry = {
          id: String(++auditIdCounter.current),
          timestamp: new Date(),
          user: metadata.author || 'system',
          action,
          details,
        };
        setAuditTrail((prev) => [...prev, entry]);
      },
      [auditTrailEnabled, metadata.author],
    );

    const toggleFullscreen = useCallback(() => {
      setIsFullscreen((prev) => !prev);
    }, []);

    const handleZoomIn = useCallback(() => {
      setZoom((prev) => Math.min(prev + 10, 200));
    }, []);

    const handleZoomOut = useCallback(() => {
      setZoom((prev) => Math.max(prev - 10, 50));
    }, []);

    const handleResetZoom = useCallback(() => {
      setZoom(100);
    }, []);

    const toggleAuditPanel = useCallback(() => {
      setShowAudit((prev) => !prev);
    }, []);

    // ============================================================
    // 5.6. تأثيرات جانبية (Effects)
    // ============================================================

    useEffect(() => {
      return () => {
        if (printTimerRef.current) {
          clearTimeout(printTimerRef.current);
          printTimerRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      if (auditTrailEnabled) {
        addAuditEntry('create', `إنشاء النموذج ${formattedRef}`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      setMetadata((prev) => ({
        ...prev,
        updatedAt: new Date(),
        version: prev.version
          ? prev.version
              .split('.')
              .map((v, i) => (i === 1 ? String(Number(v) + 1) : v))
              .join('.')
          : '1.0',
      }));
    }, [children]);

    // ============================================================
    // 5.7. تصدير الواجهة الخارجية (Exposed Interface)
    // ============================================================

    useImperativeHandle(
      ref,
      () => ({
        print: handlePrintClick,
        preview: togglePreview,
        closePreview,
        exportPDF: () => {
          console.warn('PDF export requires additional library');
          // يمكن إضافة مكتبة مثل jsPDF هنا
        },
        getAuditTrail: () => auditTrail,
        addAuditEntry,
        getDocumentData: () => metadata,
        reset: () => {
          setPrintStatus('idle');
          setIsPreview(false);
          setAuditTrail([]);
        },
        setPageSize: () => {
          console.warn('Page size change requires re-render');
        },
        setOrientation: () => {
          console.warn('Orientation change requires re-render');
        },
      }),
      [handlePrintClick, togglePreview, closePreview, auditTrail, addAuditEntry, metadata],
    );

    // ============================================================
    // 5.8. أنماط CSS المضمنة (Inline Styles)
    // ============================================================

    const headerStyle: React.CSSProperties = {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed',
      borderBottom: '2px solid #000000',
      padding: '8px 0 6px',
    };

    const rowStyle: React.CSSProperties = {
      display: 'table-row',
    };

    const cellRightStyle: React.CSSProperties = {
      display: 'table-cell',
      width: '28%',
      textAlign: isRTL ? 'right' : 'left',
      verticalAlign: 'middle',
      padding: '0 8px',
    };

    const cellCenterStyle: React.CSSProperties = {
      display: 'table-cell',
      width: '44%',
      textAlign: 'center',
      verticalAlign: 'middle',
      padding: '0 8px',
    };

    const cellLeftStyle: React.CSSProperties = {
      display: 'table-cell',
      width: '28%',
      textAlign: isRTL ? 'left' : 'right',
      verticalAlign: 'middle',
      padding: '0 8px',
    };

    // ============================================================
    // 5.9. التصيير (Rendering)
    // ============================================================

    const renderContent = () => (
      <div
        ref={componentRef}
        className={`pwo-page bg-white shadow-xl border border-gray-200 print:border-none print:shadow-none relative ${className}`}
        style={style}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* ===== HEADER ===== */}
        <div
          className="pwo-header-table"
          style={headerStyle}
        >
          <div
            className="pwo-header-row"
            style={rowStyle}
          >
            {/* العمود 1: المؤسسة */}
            <div
              className="pwo-cell-r"
              style={cellRightStyle}
            >
              <div
                className="pwo-inst"
                style={{ fontSize: 10.5, fontWeight: 800, color: '#0a1628', marginBottom: 1 }}
              >
                {institutionName}
              </div>
              <div
                className="pwo-ministry"
                style={{ fontSize: 8, fontWeight: 700, color: '#1f2937', marginBottom: 1 }}
              >
                {ministryName}
              </div>
              <div
                className="pwo-gov"
                style={{ fontSize: 7.5, fontWeight: 600, color: '#4b5563', marginBottom: 1 }}
              >
                {governorateName}
              </div>
              <div
                className="pwo-office"
                style={{ fontSize: 7, fontWeight: 600, color: '#6b7280' }}
              >
                {officeName}
              </div>
            </div>

            {/* العمود 2: الشعار */}
            <div
              className="pwo-cell-c"
              style={cellCenterStyle}
            >
              <InstitutionalLogo
                src={logoUrl}
                alt={logoAlt}
                width={logoWidth}
                height={logoHeight}
                institutionName={institutionName}
              />
            </div>

            {/* العمود 3: بيانات النموذج */}
            <div
              className="pwo-cell-l"
              style={cellLeftStyle}
            >
              <div
                className="pwo-info"
                style={{ fontSize: 7.5 }}
              >
                <div
                  className="pwo-info-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 4,
                    marginBottom: 1,
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#374151' }}>رقم النموذج:</span>
                  <span style={{ fontWeight: 600, color: '#0a1628' }}>{formattedRef}</span>
                </div>
                <div
                  className="pwo-info-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 4,
                    marginBottom: 1,
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#374151' }}>التاريخ:</span>
                  <span style={{ fontWeight: 600, color: '#0a1628' }}>{formattedDate}</span>
                </div>
                <div
                  className="pwo-info-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 4,
                    marginBottom: 1,
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#374151' }}>الحالة:</span>
                  <DocumentStatusBadge status={metadata.status} />
                </div>
                {securityLevelProp && (
                  <div
                    className="pwo-info-row"
                    style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}
                  >
                    <span style={{ fontWeight: 700, color: '#374151' }}>التصنيف:</span>
                    <SecurityBar level={securityLevelProp} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="pwo-sn"
            style={{
              fontSize: 6,
              color: '#9ca3af',
              marginTop: 3,
              textAlign: 'center',
              fontFamily: "'Courier New', monospace",
            }}
          >
            SN: {serialNumber} {additionalReference ? `| REF: ${additionalReference}` : ''} | هذا
            المستند رسمي ومعتمد
          </div>
        </div>

        {/* ===== الفاصل الثلاثي ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
          <div style={{ height: 2, background: '#000' }} />
          <div style={{ height: 1, background: '#fff' }} />
          <div style={{ height: 1.5, background: '#ce1126' }} />
        </div>

        {/* ===== العنوان ===== */}
        <div
          className="pwo-title"
          style={{
            textAlign: 'center',
            padding: '4px 10px 2px',
            fontSize: 11,
            fontWeight: 800,
            color: '#0a1628',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {title}
          {metadata.version && (
            <span className="text-[8pt] font-normal text-gray-400 mr-2">
              (الإصدار {metadata.version})
            </span>
          )}
        </div>

        {/* ===== المحتوى ===== */}
        <div
          className="pwo-body"
          style={{ padding: '6px 10px', fontSize: 10, lineHeight: 1.6, color: '#111827' }}
        >
          {children}
        </div>

        {/* ===== التوقيع ===== */}
        {signature && (
          <div
            className="pwo-signature"
            style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #d1d5db', fontSize: 8 }}
          >
            <div
              className="pwo-signature-row"
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 20 }}
            >
              <div
                className="pwo-signature-item"
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: 7, color: '#6b7280' }}>التوقيع</div>
                <div
                  className="sig-line"
                  style={{ width: 100, borderBottom: '1px solid #000', margin: '4px auto' }}
                />
                <div style={{ fontSize: 7, fontWeight: 600 }}>{signature.signerName}</div>
                <div style={{ fontSize: 6, color: '#6b7280' }}>{signature.signerTitle}</div>
                <div style={{ fontSize: 6, color: '#9ca3af' }}>
                  {formatDate(signature.signedAt, 'gregorian', language)}
                </div>
                {signature.type === 'digital' && digitalSignatureEnabled && (
                  <div style={{ fontSize: 6, color: '#2563eb' }}>✓ توقيع رقمي معتمد</div>
                )}
                {signature.type === 'stamp' && (
                  <div style={{ fontSize: 6, color: '#d97706' }}>◉ مختوم بالختم الرسمي</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== QR Code ===== */}
        {qrCode && (
          <div
            className="pwo-qr-container"
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}
          >
            <div
              className="pwo-qr-box"
              style={{ padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }}
            >
              <QRCodeDisplay data={qrCode} />
            </div>
          </div>
        )}

        {/* ===== البيانات الوصفية المخفية ===== */}
        <div
          className="pwo-meta"
          style={{ fontSize: 6.5, color: '#6b7280', textAlign: 'center', padding: '2px 0' }}
        >
          UUID: {metadata.uuid} | DOC: {metadata.documentId} | V: {metadata.version}
        </div>

        {/* ===== التذييل ===== */}
        <div
          className="pwo-footer"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2px 6px',
            borderTop: '0.5px solid #9ca3af',
            fontSize: 5,
            color: '#4b5563',
            fontWeight: 600,
            position: 'relative',
            lineHeight: '1.2',
            marginTop: '4px',
          }}
        >
          <span style={{ fontSize: 5 }}>
            {officeName} | {governorateName}
          </span>
          <span style={{ fontSize: 5 }}>
            {formattedRef} | {formattedDate} | SN:{serialNumber.slice(-6)}
          </span>
        </div>

        {printFooter && <div className="pwo-print-footer">{printFooter}</div>}

        {/* ===== العلامة المائية ===== */}
        <div
          className="pwo-watermark"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${watermarkConfig.angle}deg)`,
            fontSize: `${watermarkConfig.fontSize}px`,
            fontWeight: 900,
            color: watermarkConfig.color,
            opacity: watermarkConfig.opacity,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: -1,
            letterSpacing: '0.2em',
          }}
        >
          {watermarkConfig.text} — {formattedRef}
        </div>

        {watermarkConfig.repeat && (
          <div
            className="pwo-watermark-repeat"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: -1,
              backgroundImage: `repeating-linear-gradient(
              -25deg,
              transparent,
              transparent ${watermarkConfig.spacing}px,
              rgba(0,0,0,${(watermarkConfig.opacity || 0.04) * 0.5}) ${watermarkConfig.spacing}px,
              rgba(0,0,0,${(watermarkConfig.opacity || 0.04) * 0.5}) ${watermarkConfig.spacing + 2}px
            )`,
              backgroundSize: `${watermarkConfig.spacing * 2}px ${watermarkConfig.spacing * 2}px`,
            }}
          />
        )}
      </div>
    );

    // ============================================================
    // 5.10. التصيير النهائي (Final Render)
    // ============================================================

    return (
      <div
        id="pwo-form-wrapper"
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`min-h-screen bg-gray-50 print:bg-white ${isFullscreen ? 'fixed inset-0 z-[200] bg-white p-4' : ''}`}
      >
        {/* ===== شريط الأدوات ===== */}
        {!hideToolbar && (
          <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-sm noprint">
            {/* المجموعة اليسرى */}
            <div className="flex items-center gap-2 flex-wrap">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 text-xs font-medium text-gov-600 hover:text-gov-800 bg-gov-50 hover:bg-gov-100 px-3 py-1.5 rounded-lg transition-colors"
                  aria-label="عودة"
                >
                  <ArrowRight size={14} />
                  <span className="hidden sm:inline">عودة</span>
                </button>
              )}
              <span className="bg-gov-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                {formattedRef}
              </span>
              <span className="text-xs font-semibold text-gray-500 truncate max-w-[200px]">
                {title}
              </span>
              {metadata.status && <DocumentStatusBadge status={metadata.status} />}
              {securityLevelProp && <SecurityBar level={securityLevelProp} />}
            </div>

            {/* المجموعة اليمنى */}
            <div className="flex items-center gap-1 flex-wrap">
              {/* تدقيق */}
              {auditTrailEnabled && (
                <button
                  onClick={toggleAuditPanel}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="سجل التدقيق"
                >
                  <History size={14} />
                  <span className="hidden sm:inline">تدقيق</span>
                  {auditTrail.length > 0 && (
                    <span className="bg-gray-200 text-gray-600 text-[8px] px-1.5 py-0.5 rounded-full">
                      {auditTrail.length}
                    </span>
                  )}
                </button>
              )}

              {/* تكبير/تصغير */}
              <div className="flex items-center gap-0.5 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-gray-100 transition-colors"
                  aria-label="تصغير"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="text-xs font-mono px-1 min-w-[40px] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-gray-100 transition-colors"
                  aria-label="تكبير"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 hover:bg-gray-100 transition-colors border-l border-gray-200"
                  aria-label="إعادة تعيين التكبير"
                >
                  <RefreshCw size={12} />
                </button>
              </div>

              {/* ملء الشاشة */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="ملء الشاشة"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              {/* معاينة */}
              {showPreview && (
                <button
                  onClick={togglePreview}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                    isPreview
                      ? 'bg-gov-600 text-white hover:bg-gov-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isPreview ? <X size={14} /> : <Eye size={14} />}
                  <span className="hidden sm:inline">{isPreview ? 'إلغاء' : 'معاينة'}</span>
                </button>
              )}

              {/* طباعة */}
              {printEnabled && (
                <button
                  onClick={handlePrintClick}
                  disabled={printStatus === 'printing'}
                  className={`flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg transition-all text-xs shadow-md hover:shadow-lg ${
                    printStatus === 'printing' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  aria-label="طباعة"
                >
                  {printStatus === 'printing' ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Printer size={14} />
                  )}
                  {printStatus === 'printing' ? 'جاري...' : 'طباعة'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== إشعارات ===== */}
        {printStatus === 'success' && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 noprint text-sm font-medium animate-fade-in-up">
            <CheckCircle2
              size={20}
              className="text-emerald-500"
            />
            تمت طباعة النموذج بنجاح
          </div>
        )}
        {printStatus === 'error' && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-red-50 border border-red-200 text-red-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 noprint text-sm font-medium animate-fade-in-up">
            <AlertTriangle
              size={20}
              className="text-red-500"
            />
            تعذرت الطباعة. حاول مرة أخرى.
          </div>
        )}

        {/* ===== لوحة التدقيق ===== */}
        {showAudit && auditTrailEnabled && (
          <div className="fixed top-[72px] right-4 z-[55] w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 noprint animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <History size={16} /> سجل التدقيق
              </h4>
              <button
                onClick={toggleAuditPanel}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <AuditTrailPanel entries={auditTrail} />
          </div>
        )}

        {/* ===== معاينة ===== */}
        {isPreview && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 noprint overflow-auto">
            <div
              ref={previewRef}
              className="bg-white rounded-2xl shadow-3xl w-full max-w-[210mm] max-h-[95vh] overflow-auto relative"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700 text-sm">معاينة: {formattedRef}</span>
                  <span className="text-xs text-gray-400">({zoom}%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== المحتوى الرئيسي ===== */}
        <div
          className="max-w-[210mm] mx-auto py-3 px-2 print:py-0 print:px-0 transition-all duration-300"
          style={{ transform: `scale(${isPreview ? 0.8 : 1})`, transformOrigin: 'top center' }}
        >
          {renderContent()}
        </div>

        {/* ===== أنماط CSS الإضافية ===== */}
        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translate(-50%, 10px) scale(0.95); }
            to { opacity: 1; transform: translate(-50%, 0) scale(1); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
          .shadow-3xl {
            box-shadow: 0 35px 60px -15px rgba(0,0,0,0.4);
          }
          @media print {
            .noprint { display: none !important; }
            body { background: white !important; }
            .pwo-form-wrapper { margin: 0 !important; padding: 0 !important; }
          }
          /* تحسينات للشاشات الصغيرة */
          @media (max-width: 640px) {
            .pwo-cell-r, .pwo-cell-c, .pwo-cell-l {
              display: block !important;
              width: 100% !important;
              text-align: center !important;
              padding: 2px 4px !important;
            }
            .pwo-header-table {
              display: block !important;
            }
            .pwo-header-row {
              display: block !important;
            }
            .pwo-info-row {
              flex-direction: column !important;
              align-items: center !important;
              gap: 0 !important;
            }
            .pwo-footer {
              flex-direction: column !important;
              gap: 4px !important;
              text-align: center !important;
            }
          }
        `}</style>
      </div>
    );
  },
);

// ============================================================
// 6. تصدير المكون مع اسم افتراضي (Default Export)
// ============================================================

export default OfficialFormWrapper;

// ============================================================
// 7. دوال مساعدة إضافية للاستخدام الخارجي
// ============================================================

/** إنشاء بيانات توقيع جديدة */
export function createSignature(
  name: string,
  title: string,
  type: SignatureType = 'wet',
): SignatureData {
  return {
    signerName: name,
    signerTitle: title,
    signedAt: new Date(),
    type,
  };
}

/** إنشاء بيانات QR Code */
export function createQRCode(content: string, size?: number): QRCodeData {
  return {
    content,
    size: size || 80,
    errorCorrection: 'M',
  };
}

/** إنشاء بيانات تعريف الوثيقة */
export function createDocumentMetadata(
  formRef: string,
  author: string,
  status: DocumentStatus = 'draft',
): DocumentMetadata {
  const now = new Date();
  return {
    documentId: generateUUID(),
    version: '1.0',
    status,
    securityLevel: 'internal',
    author,
    createdAt: now,
    updatedAt: now,
    keywords: [],
    category: 'form',
    issuingAuthority: '',
    referenceNumber: formRef,
    uuid: generateUUID(),
  };
}

// ============================================================
// 8. التوثيق الشامل (Comprehensive Documentation)
// ============================================================

/**
 * 📘 دليل استخدام OfficialFormWrapper - الإصدار المؤسسي المتكامل
 *
 * ## المميزات الأساسية
 * - ✅ هيكل احترافي بـ 3 أعمدة + 3 فواصل
 * - ✅ دعم كامل للطباعة عالية الجودة مع تحكم بالهوامش والحجم
 * - ✅ توقيع إلكتروني/رقمي/مختوم
 * - ✅ QR Code وباركود
 * - ✅ علامة مائية قابلة للتخصيص
 * - ✅ سجل تدقيق كامل (Audit Trail)
 * - ✅ بيانات تعريفية متقدمة (Metadata)
 * - ✅ مستويات أمان متعددة
 * - ✅ دعم اللغتين العربية والإنجليزية
 * - ✅ تنسيقات تاريخ متعددة (ميلادي، هجري، كلاهما)
 * - ✅ معاينة تفاعلية مع تكبير/تصغير
 * - ✅ وضع ملء الشاشة
 * - ✅ واجهة برمجية للتحكم الخارجي (Ref)
 * - ✅ متوافق مع متطلبات الوصول (ARIA)
 * - ✅ مُحسَّن للأداء مع memo و useMemo
 *
 * ## مثال استخدام أساسي
 * ```tsx
 * import OfficialFormWrapper, { createSignature, createQRCode } from './OfficialFormWrapper';
 *
 * <OfficialFormWrapper
 *   formRef="F-001"
 *   title="طلب ترخيص بناء"
 *   institutionName="الجمهورية اليمنية"
 *   ministryName="وزارة الأشغال العامة والطرق"
 *   governorateName="محافظة ذمار"
 *   officeName="مكتب الأشغال العامة والطرق"
 *   signature={createSignature('أحمد محمد', 'مدير المكتب', 'stamp')}
 *   qrCode={createQRCode('https://example.com/verify/F-001', 80)}
 *   watermarkText="نسخة رسمية للطباعة"
 *   securityLevel="confidential"
 *   auditTrailEnabled={true}
 *   onBack={() => navigate(-1)}
 * >
 *   <div>
 *     <p>بيانات النموذج هنا...</p>
 *   </div>
 * </OfficialFormWrapper>
 * ```
 *
 * ## مثال استخدام مع Ref للتحكم الخارجي
 * ```tsx
 * const formRef = useRef<OfficialFormWrapperRef>(null);
 *
 * const handlePrint = () => {
 *   formRef.current?.print();
 * };
 *
 * const handleExport = () => {
 *   const data = formRef.current?.getDocumentData();
 *   console.log('Document data:', data);
 * };
 *
 * <OfficialFormWrapper ref={formRef} ... />
 * ```
 *
 * ## مستويات الأمان
 * - public: عام - للاستخدام العام
 * - internal: داخلي - للاستخدام الداخلي فقط
 * - confidential: سري - معلومات سرية
 * - restricted: مقيد - وصول محدود
 * - top-secret: سري جداً - أعلى مستوى أمان
 *
 * ## حالات الوثيقة
 * - draft: مسودة - قيد الإنشاء
 * - review: مراجعة - قيد المراجعة
 * - approved: معتمد - تم الاعتماد
 * - signed: موقع - تم التوقيع
 * - issued: صادر - تم الإصدار
 * - archived: مؤرشف - محفوظ في الأرشيف
 * - cancelled: ملغي - تم الإلغاء
 *
 * ## تنسيقات التاريخ
 * - gregorian: ميلادي فقط
 * - hijri: هجري فقط
 * - both: ميلادي + هجري
 * - iso: بصيغة ISO
 *
 * ## أحجام الصفحات المدعومة
 * - A4 (افتراضي)
 * - A5
 * - A3
 * - Letter
 * - Legal
 * - Executive
 *
 * ## إعدادات الطباعة المتقدمة
 * ```tsx
 * printSettings={{
 *   margins: { top: 15, bottom: 15, left: 20, right: 20 },
 *   scale: 0.95,
 *   duplex: 'duplex',
 *   copies: 2,
 *   quality: 'high',
 * }}
 * ```
 *
 * ## إعدادات العلامة المائية المتقدمة
 * ```tsx
 * watermarkSettings={{
 *   text: 'نسخة رسمية - للاطلاع فقط',
 *   opacity: 0.06,
 *   angle: -30,
 *   fontSize: 56,
 *   color: '#ce1126',
 *   repeat: true,
 *   spacing: 180,
 * }}
 * ```
 *
 * ## متطلبات التشغيل
 * - React 18+
 * - react-to-print ^2.14.0
 * - lucide-react ^0.200.0
 *
 * ## ملاحظات الأداء
 * - استخدام memo لتحسين إعادة التصيير
 * - تحميل كسول للصور (lazy loading)
 * - تقليل إعادة الحسابات باستخدام useMemo
 *
 * ## الإصدار
 * v3.0 - الإصدار المؤسسي المتكامل
 */
