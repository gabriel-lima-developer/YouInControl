import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';

type QuickCreateFormProps = {
  disabled?: boolean;
  placeholder: string;
  onSubmit: (value: string) => Promise<void> | void;
};

export function QuickCreateForm({ disabled = false, placeholder, onSubmit }: QuickCreateFormProps) {
  const [value, setValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Informe um valor para continuar.');
      return;
    }

    setValidationError(null);
    await onSubmit(trimmed);
    setValue('');
  }

  return (
    <form className="flex gap-2" role="form" aria-label={placeholder} onSubmit={handleSubmit}>
      <div className="min-w-0 flex-1">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={placeholder}
        />
        {validationError ? <p className="mt-2 text-xs text-destructive">{validationError}</p> : null}
      </div>
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        aria-label="Adicionar"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
}
