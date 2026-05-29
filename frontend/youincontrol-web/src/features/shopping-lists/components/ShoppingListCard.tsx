import { Check, ChevronRight, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ProgressSection } from '../../../components/ProgressSection';
import type { ShoppingList } from '../types/shoppingListTypes';
import { formatDate } from '../../../utils/date';

type ShoppingListCardProps = {
  isDeleting?: boolean;
  isUpdating?: boolean;
  list: ShoppingList;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onUpdate: (id: string, name: string) => Promise<void>;
};

export function ShoppingListCard({
  isDeleting = false,
  isUpdating = false,
  list,
  stats,
  onDelete,
  onOpen,
  onUpdate,
}: ShoppingListCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = isDeleting || isUpdating;

  useEffect(() => {
    setDraft(list.name);
  }, [list.name]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  async function handleSave() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== list.name) {
      await onUpdate(list.id, trimmed);
    } else {
      setDraft(list.name);
    }

    setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      void handleSave();
    }

    if (event.key === 'Escape') {
      setDraft(list.name);
      setEditing(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="px-4 pb-3 pt-4">
        {editing ? (
          <div className="mb-1 flex items-center gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isBusy}
              className="min-w-0 flex-1 rounded-lg border border-primary/30 bg-secondary px-3 py-1.5 text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Editar titulo da lista"
            />
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isBusy}
              className="rounded-lg p-1.5 text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Salvar titulo"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(list.name);
                setEditing(false);
              }}
              disabled={isBusy}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Cancelar edicao"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <h2 className="mb-1 text-balance text-base font-semibold leading-snug text-foreground">{list.name}</h2>
        )}
        <p className="text-xs text-muted-foreground">Criada em {formatDate(list.createdAt)}</p>
      </div>

      <div className="flex items-center gap-4 px-4 pb-3 text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="font-semibold text-foreground">{stats.total}</span> itens
        </span>
        <span className="flex items-center gap-1 text-primary">
          <span className="font-semibold">{stats.completed}</span> concluidos
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="font-semibold text-foreground">{stats.pending}</span> pendentes
        </span>
      </div>

      <div className="px-4 pb-4">
        <ProgressSection completed={stats.completed} total={stats.total} showLabel={false} />
      </div>

      <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-4 py-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={isBusy}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Editar lista ${list.name}`}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Editar</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(list.id)}
            disabled={isBusy}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Excluir lista ${list.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Excluir</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => onOpen(list.id)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95"
          aria-label={`Abrir lista ${list.name}`}
        >
          <span>Ver lista</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
