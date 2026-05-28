import { Plus, Save } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import type { CreateShoppingListItemRequest } from '../types/shoppingListTypes';

type ShoppingListItemFormProps = {
  disabled?: boolean;
  initialDescription?: string;
  initialQuantity?: number;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (payload: CreateShoppingListItemRequest) => Promise<void> | void;
};

export function ShoppingListItemForm({
  disabled = false,
  initialDescription = '',
  initialQuantity,
  submitLabel = 'Adicionar',
  onCancel,
  onSubmit,
}: ShoppingListItemFormProps) {
  const [description, setDescription] = useState(initialDescription);
  const [quantity, setQuantity] = useState(initialQuantity?.toString() ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const isEditing = Boolean(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
    setQuantity(initialQuantity?.toString() ?? '');
  }, [initialDescription, initialQuantity]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedDescription = description.trim();
    if (!normalizedDescription) {
      setValidationError('Informe a descricao do item.');
      return;
    }

    if (!quantity.trim()) {
      setValidationError('Informe a quantidade.');
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setValidationError('Quantidade precisa ser maior que zero.');
      return;
    }

    setValidationError(null);
    try {
      await onSubmit({
        description: normalizedDescription,
        quantity: parsedQuantity,
      });
      if (!isEditing) {
        setDescription('');
        setQuantity('');
      }
    } catch {
      return;
    }
  }

  return (
    <form
      className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_160px_auto] md:items-end"
      onSubmit={handleSubmit}
    >
      <TextField
        disabled={disabled}
        label="Item"
        maxLength={200}
        name={isEditing ? 'edit-item-description' : 'new-item-description'}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Arroz"
        value={description}
      />
      <TextField
        disabled={disabled}
        inputMode="decimal"
        label="Quantidade"
        min="0.01"
        name={isEditing ? 'edit-item-quantity' : 'new-item-quantity'}
        onChange={(event) => setQuantity(event.target.value)}
        placeholder="2"
        step="0.01"
        type="number"
        value={quantity}
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
      {validationError ? <p className="text-sm text-red-700 md:col-span-3">{validationError}</p> : null}
    </form>
  );
}
