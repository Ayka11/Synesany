import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from '../components/ui/Toast';
import { ColorSelectionToast } from '../components/ui/Toast/ColorSelectionToast';

let toastId = 0;

export const useNotifications = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = ++toastId;
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 3000);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showColorSelection = useCallback((color) => {
    return addToast({
      type: 'color-selection',
      color,
      duration: 3000
    });
  }, [addToast]);

  const showSuccess = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      title: 'Success',
      message,
      ...options
    });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      title: 'Error',
      message,
      duration: 5000,
      ...options
    });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      title: 'Info',
      message,
      ...options
    });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    showColorSelection,
    showSuccess,
    showError,
    showInfo,
    clearAll
  };
};

export const NotificationProvider = ({ children }) => {
  const { toasts, removeToast } = useNotifications();

  return (
    <>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => {
            if (toast.type === 'color-selection') {
              return (
                <ColorSelectionToast
                  key={toast.id}
                  color={toast.color}
                  id={toast.id}
                  onClose={removeToast}
                  duration={toast.duration}
                />
              );
            }
            
            return (
              <Toast
                key={toast.id}
                {...toast}
                onClose={removeToast}
              />
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
};
