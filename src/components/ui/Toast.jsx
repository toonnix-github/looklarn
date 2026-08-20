import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const { type = 'info', duration = 4000, title } = options;
    const newToast = { id, message, type, title };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, opts) => addToast(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => addToast(msg, { ...opts, type: 'error' }),
    warning: (msg, opts) => addToast(msg, { ...opts, type: 'warning' }),
    info: (msg, opts) => addToast(msg, { ...opts, type: 'info' }),
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: {
        success: () => {},
        error: () => {},
        warning: () => {},
        info: () => {},
        dismiss: () => {},
      },
      addToast: () => {},
      removeToast: () => {},
    };
  }
  return ctx;
}

export function Toast({ message, title, type = 'info', isOpen = true, onClose }) {
  if (!isOpen || !message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
      <ToastItem toast={{ id: '1', message, title, type }} onDismiss={onClose || (() => {})} />
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const typeIcons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const typeBorders = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
    warning: 'border-amber-200 bg-amber-50/90 text-amber-950',
    error: 'border-rose-200 bg-rose-50/90 text-rose-950',
    info: 'border-sky-200 bg-sky-50/90 text-sky-950',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3',
        typeBorders[toast.type] || typeBorders.info
      )}
    >
      {typeIcons[toast.type] || typeIcons.info}
      <div className="flex-1 text-sm">
        {toast.title && <p className="font-semibold">{toast.title}</p>}
        <p className="text-xs sm:text-sm">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-black/5 transition-colors text-slate-500 cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Toast;
