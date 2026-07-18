import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Render Toast container floating in viewport */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              pointerEvents: 'auto',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              minWidth: '250px',
              maxWidth: '350px',
              border: '1px solid',
              transition: 'all 0.3s ease',
              backgroundColor:
                toast.type === 'success'
                  ? 'var(--color-bg-secondary)'
                  : toast.type === 'error'
                  ? 'var(--color-bg-secondary)'
                  : 'var(--color-bg-secondary)',
              borderColor:
                toast.type === 'success'
                  ? 'var(--color-success)'
                  : toast.type === 'error'
                  ? 'var(--color-danger)'
                  : 'var(--color-info)',
              color: 'var(--color-text-primary)',
            }}
            className="animate-slide-up"
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                marginRight: '12px',
                backgroundColor:
                  toast.type === 'success'
                    ? 'var(--color-success)'
                    : toast.type === 'error'
                    ? 'var(--color-danger)'
                    : 'var(--color-info)',
              }}
            />
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
