import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ArrowLeft, PackageOpen } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProgressSection } from '../../../components/ProgressSection';
import { QuickCreateForm } from '../../../components/QuickCreateForm';
import { RetryButton, StateView } from '../../../components/StateView';
import { SummaryCard } from '../../../components/SummaryCard';
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
import { formatLongDate } from '../../../utils/date';

export function ShoppingListDetailsPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const shoppingListQuery = useShoppingListQuery(id);
  const createItemMutation = useCreateShoppingListItemMutation(id);
  const updateItemMutation = useUpdateShoppingListItemMutation(id);
  const toggleItemMutation = useToggleShoppingListItemMutation(id);
  const deleteItemMutation = useDeleteShoppingListItemMutation(id);
  const reorderItemsMutation = useReorderShoppingListItemsMutation(id);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleCreateItem(payload: CreateShoppingListItemRequest) {
    await createItemMutation.mutateAsync(payload);
  }

  async function handleQuickCreateItem(description: string) {
    await handleCreateItem({
      description,
      quantity: 1,
    });
  }

  async function handleUpdateItem(item: ShoppingListItem, description: string) {
    await updateItemMutation.mutateAsync({
      itemId: item.id,
      payload: {
        description,
        quantity: item.quantity,
      },
    });
  }

  function handleToggleItem(item: ShoppingListItem) {
    toggleItemMutation.mutate({ itemId: item.id, isCompleted: item.isCompleted });
  }

  function handleDeleteItem(itemId: string) {
    deleteItemMutation.mutate(itemId);
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
  const isAnyItemActionPending =
    createItemMutation.isPending ||
    updateItemMutation.isPending ||
    toggleItemMutation.isPending ||
    deleteItemMutation.isPending ||
    reorderItemsMutation.isPending;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
    const newIndex = sortedItems.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reorderedItems = arrayMove(sortedItems, oldIndex, newIndex);
    reorderItemsMutation.mutate({
      items: reorderedItems.map((reorderedItem, index) => ({
        itemId: reorderedItem.id,
        order: index + 1,
      })),
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/shopping-lists')}
        className="-ml-1 flex self-start items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Voltar para minhas listas"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Minhas listas</span>
      </button>

      <section>
        <h1 className="text-balance text-2xl font-bold leading-snug text-foreground">{list?.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Criada em {formatLongDate(list?.createdAt ?? null)}</p>
      </section>

      <section aria-label="Resumo da lista">
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard label="Total" value={sortedItems.length} variant="default" />
          <SummaryCard label="Concluidos" value={completedItems} variant="completed" />
          <SummaryCard label="Pendentes" value={pendingItems} variant="pending" />
        </div>
      </section>

      <section aria-label="Progresso da lista">
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <ProgressSection completed={completedItems} total={sortedItems.length} showLabel />
        </div>
      </section>

      <section aria-label="Adicionar item">
        <QuickCreateForm
          disabled={createItemMutation.isPending}
          placeholder="Adicionar novo item..."
          onSubmit={handleQuickCreateItem}
        />
      </section>

      {createItemMutation.isError ? <ErrorMessage message={createItemMutation.error.message} /> : null}
      {updateItemMutation.isError ? <ErrorMessage message={updateItemMutation.error.message} /> : null}
      {toggleItemMutation.isError ? <ErrorMessage message={toggleItemMutation.error.message} /> : null}
      {deleteItemMutation.isError ? <ErrorMessage message={deleteItemMutation.error.message} /> : null}
      {reorderItemsMutation.isError ? <ErrorMessage message={reorderItemsMutation.error.message} /> : null}

      {sortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PackageOpen className="h-8 w-8" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Lista vazia</p>
            <p className="mt-1 text-sm text-muted-foreground">Adicione o primeiro item usando o campo acima.</p>
          </div>
        </div>
      ) : (
        <section aria-label="Itens da lista">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={sortedItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <ul className="flex flex-col gap-2" role="list">
                {sortedItems.map((item) => (
                  <ShoppingListItemRow
                    isBusy={isAnyItemActionPending}
                    item={item}
                    key={item.id}
                    onDelete={handleDeleteItem}
                    onToggle={handleToggleItem}
                    onUpdate={handleUpdateItem}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      )}
    </>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p>;
}
