import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Check, GripVertical, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../../../utils/cn';
import type { ShoppingListItem, ShoppingListItemUnitOfMeasure, UpdateShoppingListItemRequest } from '../types/shoppingListTypes';
import { getUnitOfMeasureQuantityLabel, parseOptionalQuantity, unitOfMeasureOptions } from '../utils/unitOfMeasure';

type ShoppingListItemRowProps = {
  isBusy?: boolean;
  item: ShoppingListItem;
  onDelete: (itemId: string) => void;
  onToggle: (item: ShoppingListItem) => void;
  onUpdate: (item: ShoppingListItem, payload: UpdateShoppingListItemRequest) => Promise<void>;
};

export function ShoppingListItemRow({
  isBusy = false,
  item,
  onDelete,
  onToggle,
  onUpdate,
}: ShoppingListItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [draftDescription, setDraftDescription] = useState(item.description);
  const [draftQuantity, setDraftQuantity] = useState(formatQuantityInput(item.quantity));
  const [draftUnitOfMeasure, setDraftUnitOfMeasure] = useState(item.unitOfMeasure ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const quantityLabel = getQuantityLabel(item.quantity, item.unitOfMeasure);

  useEffect(() => {
    if (!editing) {
      setDraftDescription(item.description);
      setDraftQuantity(formatQuantityInput(item.quantity));
      setDraftUnitOfMeasure(item.unitOfMeasure ?? '');
      setValidationError(null);
    }
  }, [editing, item.description, item.quantity, item.unitOfMeasure]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  async function handleSave() {
    const trimmedDescription = draftDescription.trim();
    if (!trimmedDescription) {
      handleCancel();
      return;
    }

    const parsedQuantity = parseOptionalQuantity(draftQuantity);
    if (parsedQuantity === null) {
      setValidationError('Quantidade precisa ser maior que zero.');
      return;
    }

    await onUpdate(item, {
      description: trimmedDescription,
      ...(parsedQuantity === undefined ? {} : { quantity: parsedQuantity }),
      ...(draftUnitOfMeasure ? { unitOfMeasure: draftUnitOfMeasure as ShoppingListItemUnitOfMeasure } : {}),
    });

    setEditing(false);
  }

  function handleCancel() {
    setDraftDescription(item.description);
    setDraftQuantity(formatQuantityInput(item.quantity));
    setDraftUnitOfMeasure(item.unitOfMeasure ?? '');
    setValidationError(null);
    setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) {
    if (event.key === 'Enter') {
      void handleSave();
    }

    if (event.key === 'Escape') {
      handleCancel();
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex flex-col rounded-xl border border-border bg-card transition-shadow',
        isDragging && 'z-50 border-primary/30 opacity-80 shadow-lg',
        item.isCompleted && !editing && 'opacity-70',
      )}
      aria-label={item.description}
    >
      <div className="flex items-center gap-3 px-3 py-3">
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
            'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
            item.isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary',
          )}
          aria-label={item.isCompleted ? 'Marcar como pendente' : 'Marcar como concluido'}
          aria-pressed={item.isCompleted}
        >
          {item.isCompleted ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
        </button>

        {!editing ? (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={cn(
                  'min-w-0 break-words text-sm leading-relaxed',
                  item.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground',
                )}
              >
                {item.description}
              </span>
              {quantityLabel ? (
                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium leading-none text-primary">
                  {quantityLabel}
                </span>
              ) : null}
            </div>

            <div className="flex flex-shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={isBusy}
                className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                aria-label={`Editar ${item.description}`}
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                disabled={isBusy}
                className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                aria-label={`Excluir ${item.description}`}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </>
        ) : null}
      </div>

      {editing ? (
        <div className="flex items-center gap-2 px-3 pb-3">
          <div className="min-w-0 flex-1">
            <input
              ref={inputRef}
              value={draftDescription}
              onChange={(event) => setDraftDescription(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isBusy}
              placeholder="Nome do item"
              className="h-8 w-full min-w-0 rounded-lg border border-primary/40 bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Nome do item"
            />
            {validationError ? <p className="mt-2 text-xs text-destructive">{validationError}</p> : null}
          </div>
          <input
            value={draftQuantity}
            onChange={(event) => setDraftQuantity(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
            placeholder="Qtd"
            inputMode="decimal"
            className="h-8 w-14 flex-shrink-0 rounded-lg border border-border bg-secondary px-2 text-center text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Quantidade"
          />
          <select
            value={draftUnitOfMeasure}
            onChange={(event) => setDraftUnitOfMeasure(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
            className="h-8 w-24 flex-shrink-0 cursor-pointer appearance-none rounded-lg border border-border bg-secondary px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Unidade de medida"
          >
            <option value="">Unid.</option>
            {unitOfMeasureOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isBusy}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            aria-label="Salvar"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isBusy}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-all hover:bg-border hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            aria-label="Cancelar"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </li>
  );
}

function formatQuantityInput(quantity: number | null) {
  return quantity === null ? '' : String(quantity);
}

function getQuantityLabel(quantity: number | null, unitOfMeasure: ShoppingListItemUnitOfMeasure | null) {
  if (quantity === null || !Number.isFinite(quantity) || quantity <= 0) {
    return '';
  }

  const formattedQuantity = quantity.toLocaleString('pt-BR');
  const unitLabel = getUnitOfMeasureQuantityLabel(unitOfMeasure, quantity);

  return unitLabel ? `${formattedQuantity} ${unitLabel}` : formattedQuantity;
}
