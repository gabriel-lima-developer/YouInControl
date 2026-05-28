import { Check, ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/Button';
import { formatQuantity } from '../../../utils/date';
import type { ShoppingListItem } from '../types/shoppingListTypes';
import { ShoppingListItemForm } from './ShoppingListItemForm';

type ShoppingListItemRowProps = {
  canMoveDown: boolean;
  canMoveUp: boolean;
  isBusy?: boolean;
  item: ShoppingListItem;
  onDelete: (itemId: string) => void;
  onMoveDown: (itemId: string) => void;
  onMoveUp: (itemId: string) => void;
  onToggle: (item: ShoppingListItem) => void;
  onUpdate: (itemId: string, payload: { description: string; quantity: number }) => Promise<void>;
};

export function ShoppingListItemRow({
  canMoveDown,
  canMoveUp,
  isBusy = false,
  item,
  onDelete,
  onMoveDown,
  onMoveUp,
  onToggle,
  onUpdate,
}: ShoppingListItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const actionIconProps = {
    absoluteStrokeWidth: true,
    className: 'shrink-0',
    size: 18,
    strokeWidth: 2.25,
  };

  if (isEditing) {
    return (
      <li className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm">
        <ShoppingListItemForm
          disabled={isBusy}
          initialDescription={item.description}
          initialQuantity={item.quantity}
          onCancel={() => setIsEditing(false)}
          onSubmit={async (payload) => {
            await onUpdate(item.id, payload);
            setIsEditing(false);
          }}
          submitLabel="Salvar"
        />
      </li>
    );
  }

  return (
    <li className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm lg:grid-cols-[auto_1fr_auto]">
      <button
        aria-label={item.isCompleted ? 'Marcar item como nao concluido' : 'Marcar item como concluido'}
        className={`grid h-7 w-7 place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:cursor-not-allowed ${
          item.isCompleted ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300 bg-white text-transparent hover:border-emerald-700'
        }`}
        disabled={isBusy}
        onClick={() => onToggle(item)}
        title={item.isCompleted ? 'Marcar como nao concluido' : 'Marcar como concluido'}
        type="button"
      >
        <Check className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="min-w-0">
        <p className={`truncate text-sm font-medium ${item.isCompleted ? 'text-stone-400 line-through' : 'text-stone-950'}`}>
          {item.description}
        </p>
        <p className="mt-0.5 text-xs text-stone-500">
          {formatQuantity(item.quantity)} - Ordem {item.order}
        </p>
      </div>
      <div className="col-span-2 flex flex-wrap justify-end gap-2 lg:col-span-1">
        <Button
          aria-label="Mover item para cima"
          className="h-9 w-9 px-0"
          disabled={isBusy || !canMoveUp}
          onClick={() => onMoveUp(item.id)}
          title="Mover para cima"
          variant="secondary"
        >
          <ChevronUp {...actionIconProps} aria-hidden="true" />
        </Button>
        <Button
          aria-label="Mover item para baixo"
          className="h-9 w-9 px-0"
          disabled={isBusy || !canMoveDown}
          onClick={() => onMoveDown(item.id)}
          title="Mover para baixo"
          variant="secondary"
        >
          <ChevronDown {...actionIconProps} aria-hidden="true" />
        </Button>
        <Button aria-label="Editar item" className="h-9 w-9 px-0" disabled={isBusy} onClick={() => setIsEditing(true)} title="Editar item" variant="secondary">
          <Edit3 {...actionIconProps} aria-hidden="true" />
        </Button>
        <Button aria-label="Remover item" className="h-9 w-9 px-0" disabled={isBusy} onClick={() => onDelete(item.id)} title="Remover item" variant="danger">
          <Trash2 {...actionIconProps} aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
