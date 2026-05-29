import { cn } from '../utils/cn';

type SummaryCardProps = {
  label: string;
  value: number;
  variant?: 'default' | 'completed' | 'pending';
};

export function SummaryCard({ label, value, variant = 'default' }: SummaryCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-center',
        variant === 'default' && 'bg-foreground text-primary-foreground',
        variant === 'completed' && 'bg-primary/10 text-primary',
        variant === 'pending' && 'bg-secondary text-foreground',
      )}
    >
      <span
        className={cn(
          'text-2xl font-bold leading-none',
          variant === 'default' && 'text-white',
          variant === 'completed' && 'text-primary',
          variant === 'pending' && 'text-foreground',
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          'text-xs font-medium',
          variant === 'default' && 'text-white/70',
          variant === 'completed' && 'text-primary/80',
          variant === 'pending' && 'text-muted-foreground',
        )}
      >
        {label}
      </span>
    </div>
  );
}
