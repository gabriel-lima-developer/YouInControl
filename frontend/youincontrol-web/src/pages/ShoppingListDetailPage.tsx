import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingListItemForm } from '../components/ShoppingListItemForm';
import { ShoppingListItemRow } from '../components/ShoppingListItemRow';
import { RetryButton, StateView } from '../components/StateView';
import {
  useCreateShoppingListItemMutation,
  useDeleteShoppingListItemMutation,
  useShoppingListQuery,
  useToggleShoppingListItemMutation,
} from '../hooks/useShoppingLists';
import type { CreateShoppingListItemRequest, ShoppingListItem } from '../types/shoppingList';
import { formatDate } from '../utils/date';

export function ShoppingListDetailPage() {
  const { id = '' } = useParams();
  const shoppingListQuery = useShoppingListQuery(id);
  const createItemMutation = useCreateShoppingListItemMutation(id);
  const toggleItemMutation = useToggleShoppingListItemMutation(id);
  const deleteItemMutation = useDeleteShoppingListItemMutation(id);

  async function handleCreateItem(payload: CreateShoppingListItemRequest) {
    await createItemMutation.mutateAsync(payload);
  }

  function handleToggleItem(item: ShoppingListItem) {
    toggleItemMutation.mutate({ itemId: item.id, isCompleted: item.isCompleted });
  }

  function handleDeleteItem(itemId: string) {
    deleteItemMutation.mutate(itemId);
  }

  if (shoppingListQuery.isLoading) {
    return <StateView message="Buscando os itens da lista." title="Carregando lista" type="loading" />;
  }

  if (shoppingListQuery.isError) {
    return (
      <StateView
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-stone-300 bg-white px-4 text-sm font-medium text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
              to="/"
            >
              Voltar
            </Link>
            <RetryButton onClick={() => void shoppingListQuery.refetch()} />
          </div>
        }
        message={shoppingListQuery.error.message}
        title="Lista nao encontrada"
        type="error"
      />
    );
  }

  const list = shoppingListQuery.data;
  const items = list?.items ?? [];
  const completedItems = items.filter((item) => item.isCompleted).length;
  const pendingItems = items.length - completedItems;
  const progress = items.length > 0 ? Math.round((completedItems / items.length) * 100) : 0;

  return (
    <div className="grid gap-6">
      <Link className="inline-flex w-fit items-center gap-2 text-sm font-medium text-stone-600 hover:text-emerald-700" to="/">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para listas
      </Link>

      <section className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="text-sm font-medium text-emerald-700">{list?.status}</p>
            <h2 className="truncate text-2xl font-semibold text-stone-950 sm:text-3xl">{list?.title}</h2>
            <p className="mt-1 text-sm text-stone-500">Criada em {formatDate(list?.createdAt ?? null)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-64">
            <Metric label="Itens" value={items.length} />
            <Metric label="Pendentes" value={pendingItems} />
            <Metric label="Comprados" value={completedItems} />
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full rounded-full bg-emerald-700 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <ShoppingListItemForm disabled={createItemMutation.isPending} onSubmit={handleCreateItem} />
      {createItemMutation.isError ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{createItemMutation.error.message}</p> : null}
      {toggleItemMutation.isError ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{toggleItemMutation.error.message}</p> : null}
      {deleteItemMutation.isError ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{deleteItemMutation.error.message}</p> : null}

      {items.length === 0 ? (
        <StateView message="Adicione os itens que deseja comprar." title="Lista vazia" type="empty" />
      ) : (
        <section className="grid gap-3" aria-label="Itens da lista">
          <ul className="grid gap-2">
            {items.map((item) => (
              <ShoppingListItemRow
                isDeleting={deleteItemMutation.isPending && deleteItemMutation.variables === item.id}
                isToggling={toggleItemMutation.isPending && toggleItemMutation.variables?.itemId === item.id}
                item={item}
                key={item.id}
                onDelete={handleDeleteItem}
                onToggle={handleToggleItem}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-stone-50 px-3 py-2">
      <strong className="block text-lg text-stone-950">{value}</strong>
      <span className="text-xs text-stone-500">{label}</span>
    </div>
  );
}
