// ============================================================
// TreeView.tsx - مكون العرض الشجري المتقدم (Ultimate v3.0)
// متوافق مع: React 19 | TypeScript 5.8+ | A11y
// ============================================================

import { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  FileText,
  FolderOpen,
  Folder,
  Search,
  X,
  ArrowRight,
  File,
  FileCheck,
} from 'lucide-react';

// ============================================================
// 1. أنواع البيانات (Types)
// ============================================================

export interface TreeNode {
  /** المعرف الفريد للعقدة */
  id: string;
  /** النص المعروض */
  label: string;
  /** وصف إضافي (اختياري) */
  description?: string;
  /** أيقونة مخصصة للعقدة */
  icon?: React.ElementType;
  /** العقد الفرعية */
  children?: TreeNode[];
  /** إجراء عند النقر على العقدة */
  action?: () => void;
  /** رابط خارجي (اختياري) */
  href?: string;
  /** هل العقدة مختارة افتراضياً؟ */
  defaultExpanded?: boolean;
  /** بيانات إضافية (للاستخدام في التطبيقات) */
  meta?: Record<string, unknown>;
}

export interface TreeViewProps {
  /** بيانات الشجرة */
  data: TreeNode[];
  /** عنوان القسم */
  title?: string;
  /** أيقونة العنوان */
  titleIcon?: React.ElementType;
  /** هل يمكن البحث في الشجرة؟ */
  enableSearch?: boolean;
  /** هل يمكن طي الكل / فتح الكل؟ */
  enableCollapseAll?: boolean;
  /** عدد العقد المفتوحة افتراضياً (من البداية) */
  defaultExpandLevel?: number;
  /** هل العقد قابلة للاختيار (Selection)؟ */
  selectable?: boolean;
  /** عند اختيار عقدة */
  onSelect?: (node: TreeNode) => void;
  /** عقدة محددة افتراضياً */
  selectedId?: string | null;
}

// ============================================================
// 2. مكون فرعي: عقدة الشجرة (TreeNodeComponent)
// ============================================================

const TreeNodeComponent = memo(function TreeNodeComponent({
  node,
  level = 0,
  expandedIds,
  toggleNode,
  selectedId,
  onSelect,
  searchTerm = '',
}: {
  node: TreeNode;
  level?: number;
  expandedIds: Set<string>;
  toggleNode: (id: string) => void;
  selectedId?: string | null;
  onSelect?: (node: TreeNode) => void;
  searchTerm?: string;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const Icon = node.icon;

  // تمييز النص إذا كان هناك بحث
  const highlightText = useCallback(
    (text: string) => {
      if (!searchTerm) return text;
      const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark
            key={i}
            className="bg-gold-200/60 text-gov-800 rounded px-0.5 font-bold"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      );
    },
    [searchTerm],
  );

  // معالج النقر (مع دعم لوحة المفاتيح)
  const handleClick = useCallback(() => {
    if (hasChildren) {
      toggleNode(node.id);
    }
    if (onSelect) {
      onSelect(node);
    }
    node.action?.();
  }, [node, hasChildren, toggleNode, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
      if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
        toggleNode(node.id);
      }
      if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
        toggleNode(node.id);
      }
    },
    [handleClick, hasChildren, isExpanded, toggleNode, node.id],
  );

  return (
    <div
      className="select-none"
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={0}
    >
      <div
        className={`
          flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 
          ${
            isSelected
              ? 'bg-gov-600 text-white shadow-md ring-2 ring-gov-400 ring-offset-1'
              : 'hover:bg-gov-50 group'
          }
        `}
        style={{ paddingRight: `${level * 24 + 12}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
      >
        {/* أيقونة التوسيع/الطي */}
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          {hasChildren ? (
            <div
              className={`transition-transform duration-300 ${
                isExpanded ? 'rotate-90' : ''
              } ${isSelected ? 'text-white' : 'text-gov-600'}`}
            >
              <ChevronLeft size={16} />
            </div>
          ) : (
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isSelected ? 'bg-white' : 'bg-gray-300 group-hover:bg-gold-500'
              } transition-colors`}
            />
          )}
        </div>

        {/* أيقونة العقدة */}
        <div
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
            ${
              hasChildren
                ? isExpanded
                  ? isSelected
                    ? 'bg-white/20'
                    : 'bg-gold-500 text-white'
                  : isSelected
                    ? 'bg-white/20'
                    : 'bg-gov-100 text-gov-600'
                : isSelected
                  ? 'bg-white/20'
                  : 'bg-gov-50 text-gov-600'
            }
          `}
        >
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen size={16} />
            ) : (
              <Folder size={16} />
            )
          ) : Icon ? (
            <Icon size={16} />
          ) : (
            <File size={16} />
          )}
        </div>

        {/* التسمية والوصف */}
        <div className="flex-1 min-w-0">
          <span
            className={`block text-sm font-medium truncate ${
              hasChildren && isExpanded ? 'font-bold' : ''
            } ${isSelected ? 'text-white' : 'text-gray-700'}`}
          >
            {highlightText(node.label)}
          </span>
          {node.description && (
            <span
              className={`block text-[10px] truncate ${
                isSelected ? 'text-white/70' : 'text-gray-400'
              }`}
            >
              {highlightText(node.description)}
            </span>
          )}
        </div>

        {/* شارة عدد العقد الفرعية */}
        {hasChildren && (
          <span
            className={`
              text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0
              ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
            `}
          >
            {node.children!.length}
          </span>
        )}

        {/* مؤشر الاختيار */}
        {isSelected && <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse shrink-0" />}
      </div>

      {/* العقد الفرعية */}
      {hasChildren && isExpanded && (
        <div
          className="mt-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200"
          role="group"
        >
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              toggleNode={toggleNode}
              selectedId={selectedId}
              onSelect={onSelect}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================================
// 3. المكون الرئيسي (TreeView)
// ============================================================

const TreeView = memo(function TreeView({
  data,
  title = 'الدليل الإرشادي',
  titleIcon: TitleIcon = FileText,
  enableSearch = true,
  enableCollapseAll = true,
  defaultExpandLevel = 1,
  selectable = false,
  onSelect,
  selectedId = null,
}: TreeViewProps) {
  // حالة التوسيع
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const expandNodes = (nodes: TreeNode[], level: number) => {
      for (const node of nodes) {
        if (level < defaultExpandLevel && node.children?.length) {
          initial.add(node.id);
          expandNodes(node.children, level + 1);
        }
      }
    };
    expandNodes(data, 0);
    return initial;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // 3.1. دوال التحكم في الشجرة
  // ============================================================

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const allIds = new Set<string>();
    const collectIds = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.children?.length) {
          allIds.add(node.id);
          collectIds(node.children);
        }
      }
    };
    collectIds(data);
    setExpandedIds(allIds);
  }, [data]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  // ============================================================
  // 3.2. البحث في الشجرة (فلترة متقدمة)
  // ============================================================

  const filterTree = useCallback((nodes: TreeNode[], term: string): TreeNode[] => {
    if (!term) return nodes;
    const filtered: TreeNode[] = [];
    for (const node of nodes) {
      const matches =
        node.label.toLowerCase().includes(term.toLowerCase()) ||
        node.description?.toLowerCase().includes(term.toLowerCase());
      const filteredChildren = node.children ? filterTree(node.children, term) : [];
      if (matches || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren,
        });
      }
    }
    return filtered;
  }, []);

  const filteredData = useMemo(() => {
    return searchTerm ? filterTree(data, searchTerm) : data;
  }, [data, searchTerm, filterTree]);

  // ============================================================
  // 3.3. إحصاءات الشجرة
  // ============================================================

  const stats = useMemo(() => {
    const countNodes = (nodes: TreeNode[]): number => {
      let count = nodes.length;
      for (const node of nodes) {
        if (node.children) {
          count += countNodes(node.children);
        }
      }
      return count;
    };
    return {
      total: countNodes(data),
      expanded: expandedIds.size,
      filtered: countNodes(filteredData),
    };
  }, [data, expandedIds, filteredData]);

  // ============================================================
  // 3.4. تأثيرات البحث (Focus input on open)
  // ============================================================

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearching]);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
      {/* ===== الرأس (Header) ===== */}
      <div className="bg-gradient-to-l from-gov-600 to-gov-700 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TitleIcon size={20} />
            <h3 className="font-black text-lg">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {enableSearch && (
              <div className="relative">
                {isSearching ? (
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <Search
                      size={14}
                      className="text-white/70 ml-2"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="بحث في الدليل..."
                      className="bg-transparent border-none outline-none text-white text-sm placeholder:text-white/50 w-32"
                    />
                    <button
                      onClick={() => {
                        setIsSearching(false);
                        setSearchTerm('');
                      }}
                      className="text-white/50 hover:text-white transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearching(true)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white/70 hover:text-white"
                    aria-label="بحث في الدليل"
                  >
                    <Search size={16} />
                  </button>
                )}
              </div>
            )}
            {enableCollapseAll && (
              <div className="flex items-center gap-1">
                <button
                  onClick={expandAll}
                  className="px-2 py-1 text-[10px] bg-white/10 hover:bg-white/20 rounded transition"
                >
                  فتح الكل
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2 py-1 text-[10px] bg-white/10 hover:bg-white/20 rounded transition"
                >
                  طي الكل
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-white/70 text-xs mt-1">
          {stats.filtered} عقدة • {stats.expanded} مفتوحة
          {searchTerm && ` • البحث: "${searchTerm}"`}
        </p>
      </div>

      {/* ===== المحتوى (Content) ===== */}
      <div className="p-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FolderOpen
              size={48}
              className="mx-auto mb-4 opacity-50"
            />
            <p className="font-medium">لا توجد نتائج مطابقة</p>
            <p className="text-sm mt-1">حاول تغيير كلمات البحث</p>
          </div>
        ) : (
          <div
            className="space-y-1"
            role="tree"
          >
            {filteredData.map((node) => (
              <TreeNodeComponent
                key={node.id}
                node={node}
                expandedIds={expandedIds}
                toggleNode={toggleNode}
                selectedId={selectedId}
                onSelect={selectable ? onSelect : undefined}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================
// 4. تصدير الكل (Exports)
// ============================================================

export default TreeView;
