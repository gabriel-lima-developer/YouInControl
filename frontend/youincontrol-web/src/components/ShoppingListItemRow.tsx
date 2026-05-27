import { Check, Trash2 } from 'lucide-react';
import type { ShoppingListItem } from '../types/shoppingList';
import { formatQuantity } from '../utils/date';
import { Button } from './Button';

type ShoppingListItemRowProps = {
  item: ShoppingListItem;
  isDeleting?: boolean;
  isToggling?: boolean;
  onDelete: (itemId: string) => void;
  onToggle: (item: ShoppingListItem) => void;
};

export function ShoppingListItemRow({ item, isDeleting = false, isToggling = false, onDelete, onToggle }: ShoppingListItemRowProps) {
  const isBusy = isDeleting || isToggling;

  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm">
      <button
        aria-label={item.isCompleted ? 'Desmarcar item comprado' : 'Marcar item comprado'}
        className={`grid h-6 w-6 place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:cursor-not-allowed ${
          item.isCompleted ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300 bg-white text-transparent hover:border-emerald-700'
        }`}
        disabled={isBusy}
        onClick={() => onToggle(item)}
        title={item.isCompleted ? 'Desmarcar item comprado' : 'Marcar item comprado'}
        type="button"
      >
        <Check className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="min-w-0">
        <p className={`truncate text-sm font-medium ${item.isCompleted ? 'text-stone-400 line-through' : 'text-stone-950'}`}>{item.name}</p>
        <p className="mt-0.5 text-xs text-stone-500">{formatQuantity(item.quantity, item.unit)}</p>
      </div>
      <Button aria-label="Remover item" className="h-9 w-9 px-0" disabled={isBusy} onClick={() => onDelete(item.id)} title="Remover item" variant="danger">
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </li>
  );
}
