// ============================================================
// DocumentsPage.tsx - صفحة الوثائق والدلائل (النسخة الرسمية)
// ============================================================

import { useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Download,
  Eye,
  FolderOpen,
  FileCheck,
  BookOpen,
  Search,
  Grid,
  List,
  X,
  ExternalLink,
  Clock,
  Star,
  Tag,
} from 'lucide-react';
import PageHeader from '../shared/components/PageHeader';

interface Document {
  id: string;
  title: string;
  description: string;
  category: 'دليل' | 'فصل' | 'نموذج' | 'صورة' | 'مرجع' | 'أخرى';
  type: 'pdf' | 'image' | 'doc' | 'folder';
  url: string;
  pages?: number;
  size?: string;
  updatedAt: string;
  featured?: boolean;
  icon?: string;
}

const DocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const documents = useMemo<Document[]>(
    () => [
      {
        id: '1',
        title: 'الدليل الإرشادي للخدمات',
        description: 'دليل شامل لجميع الخدمات المقدمة من المكتب',
        category: 'دليل',
        type: 'pdf',
        url: '/docs/الدليل الإرشادي للخدمات - خاص بالمستفيد.pdf',
        pages: 45,
        size: '2.5 MB',
        updatedAt: '2026-06-01',
        featured: true,
      },
      {
        id: '2',
        title: 'الفصل الثاني - التخطيط العمراني',
        description: 'القوانين واللوائح المتعلقة بالتخطيط العمراني',
        category: 'فصل',
        type: 'pdf',
        url: '/docs/الفصل الثاني مع الملخص.pdf',
        pages: 32,
        size: '1.8 MB',
        updatedAt: '2026-05-15',
      },
      {
        id: '3',
        title: 'الفصل الثالث - النماذج',
        description: 'مجموعة النماذج الرسمية المعتمدة',
        category: 'نموذج',
        type: 'pdf',
        url: '/docs/الفصل الثالث النماذج.pdf',
        pages: 28,
        size: '1.2 MB',
        updatedAt: '2026-05-20',
      },
      {
        id: '4',
        title: 'تقرير الإنجاز 2025',
        description: 'تقرير سنوي عن إنجازات المكتب',
        category: 'مرجع',
        type: 'pdf',
        url: '/docs/تقرير_الانجاز.md',
        pages: 15,
        size: '800 KB',
        updatedAt: '2026-01-01',
      },
      {
        id: '5',
        title: 'خريطة الموقع',
        description: 'خريطة تفاعلية لموقع المكتب',
        category: 'صورة',
        type: 'image',
        url: '/docs/ThamarMapMain.png',
        updatedAt: '2026-04-01',
      },
      {
        id: '6',
        title: 'دليل تقييم رضا المستفيدين',
        description: 'استبيان وتقييم جودة الخدمات',
        category: 'دليل',
        type: 'pdf',
        url: '/docs/Beneficiary Satisfaction Assessment Form.pdf',
        pages: 8,
        size: '500 KB',
        updatedAt: '2026-03-01',
      },
    ],
    [],
  );

  const categories = useMemo(
    () => [
      { id: 'all', label: 'الكل', icon: FolderOpen, count: documents.length },
      {
        id: 'دليل',
        label: 'أدلة',
        icon: BookOpen,
        count: documents.filter((d) => d.category === 'دليل').length,
      },
      {
        id: 'فصل',
        label: 'فصول',
        icon: FileText,
        count: documents.filter((d) => d.category === 'فصل').length,
      },
      {
        id: 'نموذج',
        label: 'نماذج',
        icon: FileCheck,
        count: documents.filter((d) => d.category === 'نموذج').length,
      },
      {
        id: 'مرجع',
        label: 'مراجع',
        icon: BookOpen,
        count: documents.filter((d) => d.category === 'مرجع').length,
      },
      {
        id: 'صورة',
        label: 'صور',
        icon: ExternalLink,
        count: documents.filter((d) => d.category === 'صورة').length,
      },
    ],
    [documents],
  );

  const getCategoryColor = useCallback((category: string) => {
    const colors: Record<string, string> = {
      دليل: 'bg-blue-100 text-blue-700 border-blue-200',
      فصل: 'bg-green-100 text-green-700 border-green-200',
      نموذج: 'bg-purple-100 text-purple-700 border-purple-200',
      مرجع: 'bg-amber-100 text-amber-700 border-amber-200',
      صورة: 'bg-pink-100 text-pink-700 border-pink-200',
      أخرى: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category] || colors['أخرى'];
  }, []);

  const getFileIcon = useCallback((type: string) => {
    const icons: Record<string, React.ElementType> = {
      pdf: FileText,
      image: ExternalLink,
      doc: FileText,
      folder: FolderOpen,
    };
    return icons[type] || FileText;
  }, []);

  const filteredDocuments = useMemo(() => {
    let result = documents;

    if (activeCategory !== 'all') {
      result = result.filter((d) => d.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query),
      );
    }

    return result;
  }, [activeCategory, searchQuery, documents]);

  const handleDownload = useCallback((doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.title;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const renderDocuments = () => {
    if (filteredDocuments.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search
              className="text-gray-400"
              size={40}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
          <p className="text-sm text-gray-500">جرب تغيير كلمة البحث أو التصنيف</p>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const Icon = getFileIcon(doc.type);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:border-gov-300 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gov-100 to-gov-200 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon
                      className="text-gov-600"
                      size={28}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${getCategoryColor(doc.category)}`}
                      >
                        {doc.category}
                      </span>
                      {doc.featured && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star
                            size={10}
                            className="fill-amber-500"
                          />
                          مميز
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{doc.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      {doc.pages && (
                        <span className="flex items-center gap-0.5">
                          <FileText size={10} />
                          {doc.pages} صفحة
                        </span>
                      )}
                      {doc.size && (
                        <span className="flex items-center gap-0.5">
                          <Tag size={10} />
                          {doc.size}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5">
                        <Clock size={10} />
                        {doc.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 px-3 py-2 bg-gov-600 hover:bg-gov-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Download size={12} />
                    تحميل
                  </button>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-gray-200 hover:border-gov-300 text-gray-600 hover:text-gov-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Eye size={12} />
                    معاينة
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {filteredDocuments.map((doc) => {
          const Icon = getFileIcon(doc.type);
          return (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gov-100 to-gov-200 rounded-xl flex items-center justify-center shrink-0">
                <Icon
                  className="text-gov-600"
                  size={24}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-800 text-sm">{doc.title}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${getCategoryColor(doc.category)}`}
                  >
                    {doc.category}
                  </span>
                  {doc.featured && (
                    <Star
                      size={12}
                      className="text-amber-500 fill-amber-500"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{doc.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                  {doc.pages && <span>{doc.pages} صفحة</span>}
                  {doc.size && <span>{doc.size}</span>}
                  <span>{doc.updatedAt}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(doc)}
                  className="px-3 py-2 bg-gov-600 hover:bg-gov-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  تحميل
                </button>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 border border-gray-200 hover:border-gov-300 text-gray-600 hover:text-gov-700 rounded-lg text-xs font-bold transition-all"
                >
                  معاينة
                </a>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
      dir="rtl"
    >
      <PageHeader
        title="الوثائق والدلائل الرسمية"
        subtitle="الوصول الفوري إلى الأدلة، النماذج، والتقارير الحكومية المعتمدة من مكتب الأشغال العامة والطرق."
        badge="مكتبة رسمية"
        badgeIcon={FolderOpen}
      >
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-sm text-white/80">
            <div>عدد الوثائق</div>
            <div className="mt-2 text-white font-semibold text-xl">{documents.length}</div>
          </div>
          <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-sm text-white/80">
            <div>الفئات المتاحة</div>
            <div className="mt-2 text-white font-semibold text-xl">{categories.length}</div>
          </div>
          <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-sm text-white/80">
            <div>مفضلة موثقة</div>
            <div className="mt-2 text-white font-semibold text-xl">
              {documents.filter((doc) => doc.featured).length}
            </div>
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 -mt-4 relative z-10">
        {/* شريط الأدوات */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* البحث */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="ابحث عن وثيقة أو دليل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-gov-600 focus:ring-2 focus:ring-gov-100 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gov-100 text-gov-600 shadow-inner'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title="عرض شبكي"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-gov-100 text-gov-600 shadow-inner'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title="عرض قائمة"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* الفئات */}
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-gov-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={12} />
                  {cat.label}
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* عرض الوثائق */}
        {renderDocuments()}
      </div>
    </div>
  );
};

export default DocumentsPage;
