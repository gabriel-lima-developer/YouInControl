import { Check, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Toast = {
  id: number;
  message: string;
};

type ToastContextValue = {
  showSuccess: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const toastDurationMs = 3500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      const id = Date.now();

      setToasts((currentToasts) => [...currentToasts, { id, message }]);
      window.setTimeout(() => dismissToast(id), toastDurationMs);
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showSuccess }), [showSuccess]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[60] flex flex-col gap-2 sm:left-auto sm:w-80">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-primary/20 bg-card px-4 py-3 text-sm text-foreground shadow-xl"
            role="status"
            aria-live="polite"
          >
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 leading-relaxed">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-lg p-1 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
              aria-label="Fechar mensagem"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
}
