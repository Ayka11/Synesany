import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';

export const Toast = ({ 
  id,
  title, 
  message, 
  type = 'info',
  duration = 3000,
  onClose,
  showClose = true,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Auto-dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Wait for exit animation
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
  };

  return createPortal(
    <div
      className={`
        fixed bottom-4 right-4 z-50 max-w-sm p-4 rounded-lg border backdrop-blur-md
        shadow-2xl transition-all duration-300 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        ${getTypeStyles()}
      `}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-semibold text-sm mb-1">{title}</div>
          )}
          {message && (
            <div className="text-xs opacity-90">{message}</div>
          )}
        </div>
        {showClose && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Icons.X size={14} />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  );
};
