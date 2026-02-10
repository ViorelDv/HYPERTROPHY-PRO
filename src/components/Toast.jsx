import React, { useState, useCallback } from 'react';
import { X, Check, Info, AlertTriangle } from 'lucide-react';

const TOAST_TYPES = {
  success: { bg: 'bg-green-500', icon: Check },
  error: { bg: 'bg-red-500', icon: AlertTriangle },
  info: { bg: 'bg-blue-500', icon: Info },
  warning: { bg: 'bg-yellow-500', icon: AlertTriangle },
};

/**
 * Custom hook for managing toast notifications.
 * @returns {{ toasts: Array, showToast: Function, dismissToast: Function }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}

/**
 * Renders a stack of toast notifications.
 * @param {{ toasts: Array, onDismiss: Function }} props
 */
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm" data-testid="toast-container">
      {toasts.map(toast => {
        const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            role="alert"
            className={`${config.bg} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in`}
            data-testid={`toast-${toast.type}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-white/20 rounded"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
