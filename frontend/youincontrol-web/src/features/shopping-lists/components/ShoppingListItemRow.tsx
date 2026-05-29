import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Check, GripVertical, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../../../utils/cn';
import type { ShoppingListItem } from '../types/shoppingListTypes';

type ShoppingListItemRowProps = {
  isBusy?: boolean;
  item: ShoppingListItem;
  onDelete: (itemId: string) => void;
  onToggle: (item: ShoppingListItem) => void;
  onUpdate: (item: ShoppingListItem, description: string) => Promise<void>;
};

export function ShoppingListItemRow({
  isBusy = false,
  item,
  onDelete,
  onToggle,
  onUpdate,
}: ShoppingListItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.description);
  const inputRef = useRef<HTMLInputElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    setDraft(item.description);
  }, [item.description]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  async function handleSave() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== item.description) {
      await onUpdate(item, trimmed);
    } else {
      setDraft(item.description);
    }

    setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      void handleSave();
    }

    if (event.key === 'Escape') {
      setDraft(item.description);
      setEditing(false);
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 transition-shadow',
        isDragging && 'z-50 border-primary/30 opacity-80 shadow-lg',
      )}
      aria-label={item.description}
    >
      <button
        type="button"
        disabled={isBusy || editing}
        className="flex-shrink-0 cursor-grab touch-none text-muted-foreground/40 transition-colors hover:text-muted-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Reordenar item"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => onToggle(item)}
        disabled={isBusy}
        className={cn(
          'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-50',
          item.isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary',
        )}
        aria-label={item.isCompleted ? 'Marcar como pendente' : 'Marcar como concluido'}
        aria-pressed={item.isCompleted}
      >
        {item.isCompleted ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
      </button>

      {editing ? (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
            className="min-w-0 flex-1 rounded-lg border border-primary/30 bg-secondary px-2.5 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Editar nome do item"
          />
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isBusy}
            className="flex-shrink-0 rounded-lg p-1 text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Salvar"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(item.description);
              setEditing(false);
            }}
            disabled={isBusy}
            className="flex-shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cancelar"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <span
          className={cn(
            'min-w-0 flex-1 break-words text-sm leading-relaxed',
            item.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground',
          )}
        >
          {item.description}
        </span>
      )}

      {!editing ? (
        <div className="flex flex-shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={isBusy}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Editar ${item.description}`}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={isBusy}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Excluir ${item.description}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </li>
  );
}
