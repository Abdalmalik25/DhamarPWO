// ============================================================
// PageHeader.tsx - رأس الصفحة الموحد لجميع الصفحات
// ============================================================
import { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../../components/NavigationHistory';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  badgeIcon?: React.ElementType;
  children?: React.ReactNode;
}

const PageHeader = memo(function PageHeader({
  title,
  subtitle,
  badge,
  badgeIcon: BadgeIcon,
  children,
}: PageHeaderProps) {
  const { goBack, canGoBack } = useNavigation();

  return (
    <div className="relative bg-gradient-to-br from-gov-700 via-gov-800 to-gov-900 text-white overflow-hidden">
      {/* أنماط الخلفية الرسمية */}
      <div className="hex-pattern absolute inset-0 opacity-20" />

      {/* عناصر دائرية زخرفية */}
      <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-500/10 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 border border-gold-500/10 rounded-full" />

      {/* زر الرجوع */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-4">
        <button
          onClick={() => canGoBack && goBack()}
          disabled={!canGoBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            canGoBack
              ? 'text-gold-300 hover:bg-white/10 hover:text-gold-200'
              : 'text-white/20 cursor-not-allowed'
          }`}
        >
          <ArrowLeft size={16} /> رجوع
        </button>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-3xl">
          {/* الشارة العلوية */}
          {badge && BadgeIcon && (
            <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/30 text-gold-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <BadgeIcon size={14} />
              {badge}
            </div>
          )}

          {/* العنوان والوصف */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">{title}</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">{subtitle}</p>

          {/* محتوى إضافي (إحصائيات سريعة مثلاً) */}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>

      {/* خط ذهبي سفلي */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-gold-500/50 via-gold-400/30 to-transparent" />
    </div>
  );
});

PageHeader.displayName = 'PageHeader';
export default PageHeader;
