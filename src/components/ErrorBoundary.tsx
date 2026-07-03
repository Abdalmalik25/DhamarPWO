import React, { Component, type ReactNode } from 'react';
import type { ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  renderKey: number;
}

export default class ErrorBoundary extends Component<
  Readonly<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  state: ErrorBoundaryState = { hasError: false, error: null, errorInfo: null, renderKey: 0 };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // تسجيل الخطأ للتحليل لكن بطريقة آمنة
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error.message);
    }
    // إرسال الخطأ إلى خدمة المراقبة في الإنتاج
    if (import.meta.env.PROD && typeof window !== 'undefined') {
      try {
        window.dispatchEvent(
          new CustomEvent('app-error', {
            detail: {
              error: error.message,
              stack: error.stack,
              componentStack: errorInfo.componentStack,
            },
          }),
        );
      } catch {
        /* silent */
      }
    }
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      renderKey: prevState.renderKey + 1,
    }));
  };

  handleGoHome = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      renderKey: prevState.renderKey + 1,
    }));
    if (typeof window !== 'undefined') {
      window.location.hash = '#/';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  render() {
    if (this.state.hasError) {
      // إذا كان هناك fallback مخصص من الخارج
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // واجهة الخطأ الاحترافية
      return (
        <div
          className="min-h-[400px] flex items-center justify-center p-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
            {/* رأس الخطأ */}
            <div className="bg-gradient-to-l from-red-500 to-red-600 p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle
                  size={36}
                  className="text-white"
                />
              </div>
              <h2 className="text-xl font-bold text-white">عذراً، حدث خطأ غير متوقع</h2>
              <p className="text-red-100 text-sm mt-1">نحن نعمل على حل المشكلة</p>
            </div>

            {/* المحتوى */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-red-800 text-sm font-semibold mb-1">تفاصيل الخطأ:</p>
                <p
                  className="text-red-600 text-xs font-mono break-all"
                  dir="ltr"
                >
                  {this.state.error?.message || 'خطأ غير معروف'}
                </p>
              </div>

              {/* إجراءات */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gov-600 hover:bg-gov-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <RefreshCw size={18} />
                  إعادة المحاولة
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all active:scale-95"
                >
                  <Home size={18} />
                  العودة للرئيسية
                </button>
              </div>

              {/* دعم */}
              <p className="text-xs text-gray-400 text-center">
                إذا استمرت المشكلة، يرجى التواصل عبر info@pwo-dhamar.gov.ye
              </p>
            </div>
          </div>
        </div>
      );
    }
    return <div key={this.state.renderKey}>{this.props.children}</div>;
  }
}
