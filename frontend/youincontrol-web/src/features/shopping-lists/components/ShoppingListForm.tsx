import { Plus, Save } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';

type ShoppingListFormProps = {
  disabled?: boolean;
  initialName?: string;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (name: string) => Promise<void> | void;
};

export function ShoppingListForm({
  disabled = false,
  initialName = '',
  submitLabel = 'Criar',
  onCancel,
  onSubmit,
}: ShoppingListFormProps) {
  const [name, setName] = useState(initialName);
  const [validationError, setValidationError] = useState<string | null>(null);
  const isEditing = Boolean(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      setValidationError('Informe um nome para a lista.');
      return;
    }

    setValidationError(null);
    try {
      await onSubmit(normalizedName);
      if (!isEditing) {
        setName('');
      }
    } catch {
      return;
    }
  }

  return (
    <form
      className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-end"
      onSubmit={handleSubmit}
    >
      <TextField
        disabled={disabled}
        label={isEditing ? 'Nome da lista' : 'Nova lista'}
        maxLength={200}
        name={isEditing ? 'edit-list-name' : 'new-list-name'}
        onChange={(event) => setName(event.target.value)}
        placeholder="Compras da semana"
        value={name}
      />
      <div className="flex flex-wrap gap-2">
        <Button disabled={disabled} type="submit">
          {isEditing ? <Save className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button disabled={disabled} onClick={onCancel} type="button" variant="secondary">
            Cancelar
          </Button>
        ) : null}
      </div>
      {validationError ? <p className="text-sm text-red-700 sm:col-span-2">{validationError}</p> : null}
    </form>
  );
}
