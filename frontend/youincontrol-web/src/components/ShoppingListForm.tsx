import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from './Button';
import { TextField } from './TextField';

type ShoppingListFormProps = {
  disabled?: boolean;
  onSubmit: (title: string) => Promise<void> | void;
};

export function ShoppingListForm({ disabled = false, onSubmit }: ShoppingListFormProps) {
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setValidationError('Informe um titulo para a lista.');
      return;
    }

    setValidationError(null);
    try {
      await onSubmit(normalizedTitle);
      setTitle('');
    } catch {
      return;
    }
  }

  return (
    <form className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-end" onSubmit={handleSubmit}>
      <TextField
        disabled={disabled}
        label="Nova lista"
        maxLength={200}
        name="title"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Compras da semana"
        value={title}
      />
      <Button disabled={disabled} type="submit">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Criar
      </Button>
      {validationError ? <p className="text-sm text-red-700 sm:col-span-2">{validationError}</p> : null}
    </form>
  );
}
