import { ArrowRight, CalendarDays, Edit3, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/Button';
import type { ShoppingList } from '../types/shoppingListTypes';
import { formatDate } from '../../../utils/date';
import { ShoppingListForm } from './ShoppingListForm';

type ShoppingListCardProps = {
  isDeleting?: boolean;
  isUpdating?: boolean;
  list: ShoppingList;
  onDelete: (id: string) => void;
  onUpdate: (id: string, name: string) => Promise<void>;
};

export function ShoppingListCard({
  isDeleting = false,
  isUpdating = false,
  list,
  onDelete,
  onUpdate,
}: ShoppingListCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isBusy = isDeleting || isUpdating;

  if (isEditing) {
    return (
      <ShoppingListForm
        disabled={isBusy}
        initialName={list.name}
        onCancel={() => setIsEditing(false)}
        onSubmit={async (name) => {
          await onUpdate(list.id, name);
          setIsEditing(false);
        }}
        submitLabel="Salvar"
      />
    );
  }

  return (
    <article className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-stone-950">{list.name}</h2>
          <p className="mt-1 text-sm text-stone-500">Status {list.status}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Criada em {formatDate(list.createdAt)}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          to={`/shopping-lists/${list.id}`}
        >
          Abrir
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Button disabled={isBusy} onClick={() => setIsEditing(true)} variant="secondary">
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Editar
        </Button>
        <Button disabled={isBusy} onClick={() => onDelete(list.id)} variant="danger">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Excluir
        </Button>
      </div>
    </article>
  );
}
