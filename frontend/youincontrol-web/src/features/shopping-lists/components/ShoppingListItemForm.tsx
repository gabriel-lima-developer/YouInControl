import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { CreateShoppingListItemRequest, ShoppingListItemUnitOfMeasure } from '../types/shoppingListTypes';
import { parseOptionalQuantity, unitOfMeasureOptions } from '../utils/unitOfMeasure';

type ShoppingListItemFormProps = {
  disabled?: boolean;
  onSubmit: (payload: CreateShoppingListItemRequest) => Promise<void> | void;
};

export function ShoppingListItemForm({ disabled = false, onSubmit }: ShoppingListItemFormProps) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedDescription = description.trim();
    if (!normalizedDescription) {
      setValidationError('Informe a descricao do item.');
      return;
    }

    const parsedQuantity = parseOptionalQuantity(quantity);
    if (parsedQuantity === null) {
      setValidationError('Quantidade precisa ser maior que zero.');
      return;
    }

    setValidationError(null);
    try {
      await onSubmit({
        description: normalizedDescription,
        ...(parsedQuantity === undefined ? {} : { quantity: parsedQuantity }),
        ...(unitOfMeasure ? { unitOfMeasure: unitOfMeasure as ShoppingListItemUnitOfMeasure } : {}),
      });
      setDescription('');
      setQuantity('');
      setUnitOfMeasure('');
    } catch {
      return;
    }
  }

  return (
    <form
      className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3"
      onSubmit={handleSubmit}
      role="form"
      aria-label="Adicionar novo item"
    >
      <div className="min-w-0 flex-1">
        <input
          type="text"
          disabled={disabled}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Adicionar item..."
          className="h-9 w-full min-w-0 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground transition-shadow placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Nome do item"
          name="new-item-description"
          maxLength={200}
        />
        {validationError ? <p className="mt-2 text-xs text-destructive">{validationError}</p> : null}
      </div>
      <input
        type="text"
        inputMode="decimal"
        disabled={disabled}
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        placeholder="Qtd"
        className="h-9 w-14 flex-shrink-0 rounded-lg border border-input bg-secondary px-2 text-center text-sm text-foreground transition-shadow placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Quantidade"
        name="new-item-quantity"
      />
      <select
        disabled={disabled}
        value={unitOfMeasure}
        onChange={(event) => setUnitOfMeasure(event.target.value)}
        className="h-9 w-24 flex-shrink-0 cursor-pointer appearance-none rounded-lg border border-input bg-secondary px-2 text-sm text-foreground transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Unidade de medida"
        name="new-item-unit-of-measure"
      >
        <option value="">Unid.</option>
        {unitOfMeasureOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={disabled || !description.trim()}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        aria-label="Adicionar item"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
