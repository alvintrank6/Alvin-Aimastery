import React, { useState, useCallback } from 'react';
import { ToastContext, ToastItem, ToastType } from './ToastContext';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <i className="ri-checkbox-circle-fill text-emerald-500 text-lg" />;
      case 'error':
        return <i className="ri-error-warning-fill text-rose-500 text-lg" />;
      case 'warning':
        return <i className="ri-alert-fill text-amber-500 text-lg" />;
      case 'info':
      default:
        return <i className="ri-information-fill text-blue-500 text-lg" />;
    }
  };

  const getToastBorder = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-100/80 bg-emerald-50/10 text-emerald-900';
      case 'error':
        return 'border-rose-100/80 bg-rose-50/10 text-rose-900';
      case 'warning':
        return 'border-amber-100/80 bg-amber-50/10 text-amber-900';
      case 'info':
      default:
        return 'border-blue-100/80 bg-blue-50/10 text-blue-900';
    }
  };

  const getProgressBarBg = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-rose-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Portal Container */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 bg-white/95 backdrop-blur-md border rounded-2xl p-4 shadow-[0_10px_30px_rgba(44,62,80,0.08)] relative overflow-hidden animate-toast-in ${getToastBorder(
              toast.type
            )}`}
          >
            <div className="shrink-0">{getToastIcon(toast.type)}</div>
            <div className="flex-1 pr-4">
              <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-sm" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100">
              <div className={`h-full animate-toast-progress ${getProgressBarBg(toast.type)}`} />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
