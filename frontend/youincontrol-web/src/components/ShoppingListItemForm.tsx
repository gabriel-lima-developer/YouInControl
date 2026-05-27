import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { CreateShoppingListItemRequest } from '../types/shoppingList';
import { Button } from './Button';
import { TextField } from './TextField';

type ShoppingListItemFormProps = {
  disabled?: boolean;
  onSubmit: (payload: CreateShoppingListItemRequest) => Promise<void> | void;
};

export function ShoppingListItemForm({ disabled = false, onSubmit }: ShoppingListItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      setValidationError('Informe o nome do item.');
      return;
    }

    const parsedQuantity = quantity.trim() ? Number(quantity) : null;
    if (parsedQuantity !== null && Number.isNaN(parsedQuantity)) {
      setValidationError('Quantidade precisa ser um numero valido.');
      return;
    }

    setValidationError(null);
    try {
      await onSubmit({
        name: normalizedName,
        quantity: parsedQuantity,
        unit: unit.trim() || null,
      });
      setName('');
      setQuantity('');
      setUnit('');
    } catch {
      return;
    }
  }

  return (
    <form className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_140px_120px_auto] lg:items-end" onSubmit={handleSubmit}>
      <TextField disabled={disabled} label="Item" maxLength={200} name="name" onChange={(event) => setName(event.target.value)} placeholder="Arroz" value={name} />
      <TextField disabled={disabled} inputMode="decimal" label="Qtd." name="quantity" onChange={(event) => setQuantity(event.target.value)} placeholder="2" value={quantity} />
      <TextField disabled={disabled} label="Un." maxLength={50} name="unit" onChange={(event) => setUnit(event.target.value)} placeholder="kg" value={unit} />
      <Button disabled={disabled} type="submit">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Adicionar
      </Button>
      {validationError ? <p className="text-sm text-red-700 lg:col-span-4">{validationError}</p> : null}
    </form>
  );
}
