import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '../utils/cn';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} aria-label="Cancelar" />

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex flex-col gap-4 px-6 pb-5 pt-6">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
                variant === 'danger' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary',
              )}
              aria-hidden="true"
            >
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <h2 id="confirm-dialog-title" className="text-base font-semibold leading-snug text-foreground">
                {title}
              </h2>
            </div>
          </div>

          <p id="confirm-dialog-description" className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="flex gap-2 pt-1">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              className="h-10 flex-1 rounded-xl border border-border bg-secondary text-sm font-medium text-foreground transition-all hover:bg-border active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                'h-10 flex-1 rounded-xl text-sm font-medium transition-all hover:opacity-90 active:scale-95',
                variant === 'danger' ? 'bg-destructive text-primary-foreground' : 'bg-primary text-primary-foreground',
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
