import { AlertCircle, Loader2, ShoppingBasket } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

type StateViewProps = {
  action?: ReactNode;
  message: string;
  title: string;
  type: 'loading' | 'empty' | 'error';
};

export function StateView({ action, message, title, type }: StateViewProps) {
  const icon =
    type === 'loading' ? (
      <Loader2 className="h-6 w-6 animate-spin text-emerald-700" aria-hidden="true" />
    ) : type === 'error' ? (
      <AlertCircle className="h-6 w-6 text-red-700" aria-hidden="true" />
    ) : (
      <ShoppingBasket className="h-6 w-6 text-emerald-700" aria-hidden="true" />
    );

  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-stone-300 bg-white/70 p-8 text-center">
      <div className="grid max-w-sm justify-items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-stone-100">{icon}</div>
        <div>
          <h2 className="text-base font-semibold text-stone-950">{title}</h2>
          <p className="mt-1 text-sm text-stone-600">{message}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} variant="secondary">
      Tentar novamente
    </Button>
  );
}
