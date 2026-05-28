import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { RetryButton, StateView } from '../../../components/StateView';
import { ShoppingListItemForm } from '../components/ShoppingListItemForm';
import { ShoppingListItemRow } from '../components/ShoppingListItemRow';
import {
  useCreateShoppingListItemMutation,
  useDeleteShoppingListItemMutation,
  useReorderShoppingListItemsMutation,
  useToggleShoppingListItemMutation,
  useUpdateShoppingListItemMutation,
} from '../hooks/useShoppingListItems';
import { useShoppingListQuery } from '../hooks/useShoppingLists';
import type { CreateShoppingListItemRequest, ShoppingListItem } from '../types/shoppingListTypes';
import { formatDate } from '../../../utils/date';

export function ShoppingListDetailsPage() {
  const { id = '' } = useParams();
  const shoppingListQuery = useShoppingListQuery(id);
  const createItemMutation = useCreateShoppingListItemMutation(id);
  const updateItemMutation = useUpdateShoppingListItemMutation(id);
  const toggleItemMutation = useToggleShoppingListItemMutation(id);
  const deleteItemMutation = useDeleteShoppingListItemMutation(id);
  const reorderItemsMutation = useReorderShoppingListItemsMutation(id);

  async function handleCreateItem(payload: CreateShoppingListItemRequest) {
    await createItemMutation.mutateAsync(payload);
  }

  async function handleUpdateItem(itemId: string, payload: CreateShoppingListItemRequest) {
    await updateItemMutation.mutateAsync({ itemId, payload });
  }

  function handleToggleItem(item: ShoppingListItem) {
    toggleItemMutation.mutate({ itemId: item.id, isCompleted: item.isCompleted });
  }

  function handleDeleteItem(itemId: string) {
    deleteItemMutation.mutate(itemId);
  }

  function handleMove(itemId: string, direction: 'up' | 'down') {
    const currentItems = sortedItems;
    const currentIndex = currentItems.findIndex((item) => item.id === itemId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= currentItems.length) {
      return;
    }

    const reorderedItems = [...currentItems];
    const [item] = reorderedItems.splice(currentIndex, 1);
    reorderedItems.splice(targetIndex, 0, item);

    reorderItemsMutation.mutate({
      items: reorderedItems.map((reorderedItem, index) => ({
        itemId: reorderedItem.id,
        order: index + 1,
      })),
    });
  }

  if (shoppingListQuery.isLoading) {
    return <StateView message="Buscando os dados da lista." title="Carregando lista" type="loading" />;
  }

  if (shoppingListQuery.isError) {
    return (
      <StateView
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-stone-300 bg-white px-4 text-sm font-medium text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
              to="/shopping-lists"
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
  const sortedItems = [...(list?.items ?? [])].sort((first, second) => first.order - second.order);
  const completedItems = sortedItems.filter((item) => item.isCompleted).length;
  const pendingItems = sortedItems.length - completedItems;
  const progress = sortedItems.length > 0 ? Math.round((completedItems / sortedItems.length) * 100) : 0;
  const isAnyItemActionPending =
    createItemMutation.isPending ||
    updateItemMutation.isPending ||
    toggleItemMutation.isPending ||
    deleteItemMutation.isPending ||
    reorderItemsMutation.isPending;

  return (
    <div className="grid gap-6">
      <Link className="inline-flex w-fit items-center gap-2 text-sm font-medium text-stone-600 hover:text-emerald-700" to="/shopping-lists">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para listas
      </Link>

      <section className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="text-sm font-medium text-emerald-700">{list?.status}</p>
            <h2 className="truncate text-2xl font-semibold text-stone-950 sm:text-3xl">{list?.name}</h2>
            <p className="mt-1 text-sm text-stone-500">Criada em {formatDate(list?.createdAt ?? null)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-64">
            <Metric label="Itens" value={sortedItems.length} />
            <Metric label="Pendentes" value={pendingItems} />
            <Metric label="Concluidos" value={completedItems} />
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full rounded-full bg-emerald-700 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <ShoppingListItemForm disabled={createItemMutation.isPending} onSubmit={handleCreateItem} />
      {createItemMutation.isError ? <ErrorMessage message={createItemMutation.error.message} /> : null}
      {updateItemMutation.isError ? <ErrorMessage message={updateItemMutation.error.message} /> : null}
      {toggleItemMutation.isError ? <ErrorMessage message={toggleItemMutation.error.message} /> : null}
      {deleteItemMutation.isError ? <ErrorMessage message={deleteItemMutation.error.message} /> : null}
      {reorderItemsMutation.isError ? <ErrorMessage message={reorderItemsMutation.error.message} /> : null}

      {sortedItems.length === 0 ? (
        <StateView message="Adicione os itens que deseja comprar." title="Lista sem itens" type="empty" />
      ) : (
        <section className="grid gap-3" aria-label="Itens da lista">
          <ul className="grid gap-2">
            {sortedItems.map((item, index) => (
              <ShoppingListItemRow
                canMoveDown={index < sortedItems.length - 1}
                canMoveUp={index > 0}
                isBusy={isAnyItemActionPending}
                item={item}
                key={item.id}
                onDelete={handleDeleteItem}
                onMoveDown={(itemId) => handleMove(itemId, 'down')}
                onMoveUp={(itemId) => handleMove(itemId, 'up')}
                onToggle={handleToggleItem}
                onUpdate={handleUpdateItem}
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

function ErrorMessage({ message }: { message: string }) {
  return <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</p>;
}
