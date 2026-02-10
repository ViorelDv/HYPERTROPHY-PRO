import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * A mobile-friendly confirmation modal to replace native confirm() dialogs.
 * @param {{ isOpen: boolean, title: string, message: string, confirmLabel?: string, cancelLabel?: string, variant?: 'danger'|'warning'|'info', onConfirm: Function, onCancel: Function }} props
 */
export default function ConfirmModal({
  isOpen,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      button: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon: 'bg-yellow-100 text-yellow-600',
      button: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    },
    info: {
      icon: 'bg-blue-100 text-blue-600',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4"
      data-testid="confirm-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl overflow-hidden animate-scale-in">
        <div className="p-6 text-center">
          <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${styles.icon}`}>
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 id="confirm-title" className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p id="confirm-message" className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 py-4 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            data-testid="confirm-cancel"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 font-semibold transition-colors border-l border-gray-200 ${styles.button}`}
            data-testid="confirm-ok"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
