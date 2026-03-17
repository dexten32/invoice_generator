import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LuCircleAlert } from 'react-icons/lu';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = useCallback((message) => {
    console.log('Toast triggered:', message);
    setToast({ message: '', visible: false });
    
    setTimeout(() => {
      setToast({ message, visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3100);
    }, 10);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && createPortal(
        <div className="ie-toast-container">
          <div className="ie-toast">
            <LuCircleAlert size={20} color="#fbbf24" />
            <span>{toast.message}</span>
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
