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
import { ArrowLeft, CheckCircle2, Clock, PackageOpen } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ProgressSection } from '../../../components/ProgressSection';
import { RetryButton, StateView } from '../../../components/StateView';
import { SummaryCard } from '../../../components/SummaryCard';
import { useToast } from '../../../components/ToastProvider';
import { formatLongDate } from '../../../utils/date';
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
import type { CreateShoppingListItemRequest, ShoppingListItem, UpdateShoppingListItemRequest } from '../types/shoppingListTypes';

export function ShoppingListDetailsPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
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
    showSuccess('Item adicionado com sucesso.');
  }

  async function handleUpdateItem(item: ShoppingListItem, payload: UpdateShoppingListItemRequest) {
    await updateItemMutation.mutateAsync({
      itemId: item.id,
      payload,
    });
  }

  function handleToggleItem(item: ShoppingListItem) {
    toggleItemMutation.mutate({ itemId: item.id, isCompleted: item.isCompleted });
  }

  function handleConfirmDeleteItem() {
    if (!deleteTarget) {
      return;
    }

    deleteItemMutation.mutate(deleteTarget, {
      onSuccess: () => showSuccess('Item excluido com sucesso.'),
    });
    setDeleteTarget(null);
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
  const pendingItems = sortedItems.filter((item) => !item.isCompleted);
  const completedItems = sortedItems.filter((item) => item.isCompleted);
  const targetItem = deleteTarget ? sortedItems.find((item) => item.id === deleteTarget) : null;
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

    const oldIndex = pendingItems.findIndex((item) => item.id === active.id);
    const newIndex = pendingItems.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reorderedItems = [...arrayMove(pendingItems, oldIndex, newIndex), ...completedItems];
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
          <SummaryCard label="Concluidos" value={completedItems.length} variant="completed" />
          <SummaryCard label="Pendentes" value={pendingItems.length} variant="pending" />
        </div>
      </section>

      <section aria-label="Progresso da lista">
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <ProgressSection completed={completedItems.length} total={sortedItems.length} showLabel />
        </div>
      </section>

      <section aria-label="Adicionar item">
        <ShoppingListItemForm disabled={createItemMutation.isPending} onSubmit={handleCreateItem} />
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
          <div className="flex flex-col gap-6">
            {pendingItems.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Pendentes ({pendingItems.length})
                  </h2>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext items={pendingItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                    <ul className="flex flex-col gap-2" role="list">
                      {pendingItems.map((item) => (
                        <ShoppingListItemRow
                          isBusy={isAnyItemActionPending}
                          item={item}
                          key={item.id}
                          onDelete={setDeleteTarget}
                          onToggle={handleToggleItem}
                          onUpdate={handleUpdateItem}
                        />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              </div>
            ) : null}

            {completedItems.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                    Concluidos ({completedItems.length})
                  </h2>
                </div>

                <ul className="flex flex-col gap-2" role="list">
                  {completedItems.map((item) => (
                    <ShoppingListItemRow
                      isBusy={isAnyItemActionPending}
                      item={item}
                      key={item.id}
                      onDelete={setDeleteTarget}
                      onToggle={handleToggleItem}
                      onUpdate={handleUpdateItem}
                    />
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Excluir item"
        description={`Tem certeza que deseja excluir "${targetItem?.description ?? 'este item'}"? Esta acao nao pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDeleteItem}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p>;
}
