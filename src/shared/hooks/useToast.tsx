// ============================================================
// useToast.ts - نظام إشعارات Toast
// ============================================================

import { useState, useCallback, useEffect, createContext, useContext } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ToastOptions {
  duration?: number;
  closable?: boolean;
}

// Toast Context
interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, options?: ToastOptions) => string;
  toast: (message: string, options?: ToastOptions) => string;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (message: string, type: Toast['type'] = 'info', options: ToastOptions = {}): string => {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const duration = options.duration ?? 5000;

      const toast: Toast = {
        id,
        message,
        type,
        duration,
      };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss],
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, 'success', options);
    },
    [addToast],
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, 'error', options);
    },
    [addToast],
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, 'warning', options);
    },
    [addToast],
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, 'info', options);
    },
    [addToast],
  );

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, 'info', options);
    },
    [addToast],
  );

  const toast = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, 'info', options);
    },
    [addToast],
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        toast,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      showToast: () => '',
      toast: () => '',
      success: () => '',
      error: () => '',
      warning: () => '',
      info: () => '',
      dismiss: () => {},
      dismissAll: () => {},
    };
  }
  return context;
}
