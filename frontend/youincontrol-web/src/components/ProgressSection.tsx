type ProgressSectionProps = {
  completed: number;
  total: number;
  showLabel?: boolean;
};

export function ProgressSection({ completed, total, showLabel = true }: ProgressSectionProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      {showLabel ? (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Progresso</span>
          <span className="font-semibold text-foreground">{percentage}%</span>
        </div>
      ) : null}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percentage}% concluido`}
      >
        <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
