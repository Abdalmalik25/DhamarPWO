// ============================================================
// useImageOptimization.ts - نظام تحسين الصور المتقدم
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ImageOptions {
  width?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  priority?: boolean;
  alt?: string;
  fallbackSrc?: string;
  retryCount?: number;
}

export interface ImageState {
  src: string | null;
  isLoading: boolean;
  error: boolean;
  aspectRatio?: number;
  alt?: string;
}

export interface PreviewControls {
  openPreview: () => void;
  closePreview: () => void;
  isPreviewOpen: boolean;
}

export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {},
): string {
  const { width, quality = 80, format = 'webp' } = options;

  if (src.startsWith('data:')) return src;

  if (
    src.includes('pexels.com') ||
    src.includes('unsplash.com') ||
    src.includes('cloudinary.com')
  ) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('q', quality.toString());
    params.set('fm', format);
    return `${src}?${params.toString()}`;
  }

  return src;
}

export function getAspectRatio(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img.width / img.height);
    img.onerror = reject;
    img.src = url;
  });
}

export function useImageOptimization(
  src: string,
  options: ImageOptions = {},
): ImageState & { preview: PreviewControls } {
  const {
    width,
    quality = 80,
    format = 'webp',
    priority = false,
    alt = 'صورة',
    fallbackSrc,
    retryCount = 3,
  } = options;

  const [state, setState] = useState<ImageState>({
    src: null,
    isLoading: true,
    error: false,
    alt,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const retryAttemptRef = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const loadImage = useCallback(
    (currentSrc: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: false }));

      const img = new Image();
      imageRef.current = img;

      if (priority) {
        img.fetchPriority = 'high';
      } else {
        img.loading = 'lazy';
        img.decoding = 'async';
      }

      img.onload = async () => {
        let aspectRatio: number | undefined;
        try {
          aspectRatio = img.width / img.height;
        } catch {
          // ignore
        }

        setState({
          src: currentSrc,
          isLoading: false,
          error: false,
          aspectRatio,
          alt,
        });
        retryAttemptRef.current = 0;
      };

      img.onerror = () => {
        retryAttemptRef.current += 1;

        if (retryAttemptRef.current < retryCount) {
          setTimeout(() => {
            if (imageRef.current === img) {
              img.src = currentSrc;
            }
          }, 1000 * retryAttemptRef.current);
          return;
        }

        if (fallbackSrc) {
          loadImage(fallbackSrc);
          return;
        }

        setState({
          src: null,
          isLoading: false,
          error: true,
          alt,
        });
      };

      img.src = currentSrc;
    },
    [retryCount, fallbackSrc, priority, alt],
  );

  useEffect(() => {
    if (!src) {
      setState((prev) => ({ ...prev, isLoading: false, error: true }));
      return;
    }

    const optimizedSrc = getOptimizedImageUrl(src, { width, quality, format });
    loadImage(optimizedSrc);

    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
        imageRef.current = null;
      }
    };
  }, [src, width, quality, format, loadImage]);

  const openPreview = useCallback(() => {
    setIsPreviewOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return {
    ...state,
    preview: {
      openPreview,
      closePreview,
      isPreviewOpen,
    },
  };
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  quality?: number;
  format?: 'webp' | 'avif';
  priority?: boolean;
  fallbackSrc?: string;
  className?: string;
  enablePreview?: boolean;
  isSvg?: boolean;
  [key: string]: any;
}

export function OptimizedImage({
  src,
  alt,
  width,
  quality = 80,
  format = 'webp',
  priority = false,
  fallbackSrc,
  className = '',
  enablePreview = false,
  isSvg = false,
  ...props
}: OptimizedImageProps) {
  const {
    src: optimizedSrc,
    isLoading,
    error,
    aspectRatio,
    preview,
  } = useImageOptimization(src, { width, quality, format, priority, alt, fallbackSrc });

  if (isSvg) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    );
  }

  const handleClick = () => {
    if (enablePreview && optimizedSrc) {
      preview.openPreview();
    }
  };

  return (
    <>
      <div
        className={`relative ${className}`}
        style={{ aspectRatio: aspectRatio || 'auto' }}
      >
        {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />}

        {!error && optimizedSrc && (
          <img
            src={optimizedSrc}
            alt={alt}
            className={`w-full h-full object-cover ${enablePreview ? 'cursor-zoom-in hover:opacity-90 transition-opacity' : ''}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onClick={handleClick}
            {...props}
          />
        )}

        {error && (
          <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
            <span>الصورة غير متاحة</span>
          </div>
        )}
      </div>

      {enablePreview && preview.isPreviewOpen && optimizedSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={preview.closePreview}
        >
          <button
            onClick={preview.closePreview}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="إغلاق المعاينة"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
              />
            </svg>
          </button>

          <img
            src={optimizedSrc}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default useImageOptimization;
