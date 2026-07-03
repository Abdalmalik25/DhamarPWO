// ============================================================
// FormModal.tsx - modal منبثق للنماذج مع تكبير/تصغير وسحب
// ============================================================
import { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Square, Maximize2, Minimize2, Move, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  formRef?: string;
  mode?: 'overlay' | 'panel' | 'inline';
}

type ModalSize = 'normal' | 'large' | 'fullscreen';

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  formRef,
  mode = 'overlay',
}: FormModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<ModalSize>('large');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const modalStartPos = useRef({ x: 0, y: 0 });

  // إغلاق عند الضغط على Escape - must be before conditional return
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMaximized) {
          setIsMaximized(false);
        } else if (isMinimized) {
          setIsMinimized(false);
        } else {
          onClose();
        }
      }
      // تكبير/تصغير مع F11 أو F
      if (e.key === 'F11' || (e.ctrlKey && e.key === 'f')) {
        e.preventDefault();
        setIsMaximized(!isMaximized);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isMaximized, isMinimized, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    modalStartPos.current = position;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && modalRef.current) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setPosition({
        x: modalStartPos.current.x + dx,
        y: modalStartPos.current.y + dy,
      });
    }
    if (isResizing && modalRef.current) {
      // منطق تغيير الحجم
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const resetSize = () => {
    setSize('normal');
    setIsMaximized(false);
    setIsMinimized(false);
    setPosition({ x: 0, y: 0 });
  };

  // منع التمرير في الصفحة الخلفية فقط في وضع overlay
  useEffect(() => {
    if (mode === 'overlay' && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, mode]);

  const sizeClasses: Record<ModalSize, string> = {
    normal: 'w-[90vw] max-w-4xl h-[85vh]',
    large: 'w-[95vw] max-w-6xl h-[90vh]',
    fullscreen: 'w-screen h-screen',
  };

  const getModalStyle = (): React.CSSProperties => {
    if (isMaximized) {
      return {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: 'none',
        maxWidth: '100vw',
        maxHeight: '100vh',
      };
    }
    if (isMinimized) {
      return { bottom: '20px', right: '20px', width: '400px', height: 'auto', maxHeight: '200px' };
    }
    if (mode === 'panel') {
      return {
        top: 0,
        left: 'auto',
        right: 0,
        bottom: 0,
        transform: 'none',
        maxWidth: '45vw',
        maxHeight: '100vh',
        borderRadius: 0,
      };
    }
    return {
      top: `${50 + position.y}px`,
      left: `calc(50% + ${position.x}px)`,
      transform: 'translate(-50%, -50%)',
      ...(size === 'large' && { maxWidth: '90vw', maxHeight: '90vh' }),
    };
  };

  const modalStyle = getModalStyle();

  if (isMinimized) {
    return createPortal(
      <div
        className="fixed bottom-6 left-6 z-[200] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-glow transition-shadow"
        style={{ width: '400px' }}
      >
        <div
          className="flex items-center justify-between p-3 bg-gov-800 text-white cursor-pointer"
          onClick={toggleMinimize}
        >
          <div className="flex items-center gap-2 flex-1">
            <FileText
              size={14}
              className="text-gold-400"
            />
            <span className="font-semibold text-sm truncate">{title}</span>
            {formRef && (
              <span className="text-xs bg-gold-500 text-white px-2 py-0.5 rounded shrink-0">
                {formRef}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(true);
              }}
              className="p-1 hover:bg-white/10 rounded"
              title="فتح كامل"
            >
              <Maximize2 size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-red-500 rounded"
              title="إغلاق"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  // inline mode - no portal
  if (mode === 'inline') {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {children}
      </div>
    );
  }

  // overlay or panel mode
  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex ${mode === 'panel' ? 'items-stretch justify-end' : 'items-center justify-center p-4'}`}
    >
      {/* Backdrop only for overlay mode */}
      {mode === 'overlay' && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Modal Window */}
      <div
        ref={modalRef}
        onMouseDown={handleMouseDown}
        className={`relative bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          mode === 'panel' ? 'rounded-none border-r border-gray-200' : 'rounded-2xl'
        } ${sizeClasses[size]}`}
        style={{
          ...modalStyle,
          ...(isMaximized && { borderRadius: mode === 'panel' ? 0 : 0 }),
        }}
      >
        {/* Custom Scrollbar */}
        <style>{`
          .form-modal-scroll::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .form-modal-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .form-modal-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .form-modal-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .form-modal-scroll {
            scroll-behavior: smooth;
            overscroll-behavior: contain;
          }
        `}</style>

        {/* Title Bar - Draggable */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-gov-700 to-gov-600 text-white select-none flex-shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            {mode === 'panel' && (
              <ExternalLink
                size={14}
                className="text-gold-400"
              />
            )}
            <FileText
              size={18}
              className="text-gold-400"
            />
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              {formRef && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{formRef}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {mode === 'overlay' && (
              <>
                <button
                  onClick={resetSize}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="الحجم الأصلي"
                >
                  <Square size={16} />
                </button>
                <button
                  onClick={toggleMinimize}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="تصغير"
                >
                  <Minimize2 size={16} />
                </button>
              </>
            )}
            <button
              onClick={toggleMaximize}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={isMaximized ? 'تصغير' : 'تكبير'}
            >
              {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500 rounded-lg transition-colors"
              title="إغلاق"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Move size={12} />
            <span>اسحب الشريط العلوي لنقل النموذج</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSize('normal')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${size === 'normal' ? 'bg-gov-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              100%
            </button>
            <button
              onClick={() => setSize('large')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${size === 'large' ? 'bg-gov-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              150%
            </button>
            <button
              onClick={toggleMaximize}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${isMaximized ? 'bg-gov-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              {isMaximized ? '⊗ خروج' : '⛶ ملء الشاشة'}
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-auto form-modal-scroll bg-gray-50 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
            {children}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-t border-gray-200 text-xs text-gray-500 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span>F11: تكبير</span>
            <span>Esc: إغلاق</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>جاهز للطباعة</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function FileText({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
      ></line>
      <line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
      ></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}
