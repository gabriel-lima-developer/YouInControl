import { useQueries } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickCreateForm } from '../../../components/QuickCreateForm';
import { RetryButton, StateView } from '../../../components/StateView';
import { ShoppingListCard } from '../components/ShoppingListCard';
import { shoppingListKeys } from '../hooks/queryKeys';
import {
  useCreateShoppingListMutation,
  useDeleteShoppingListMutation,
  useShoppingListsQuery,
  useUpdateShoppingListMutation,
} from '../hooks/useShoppingLists';
import { getShoppingListItems } from '../services/shoppingListItemsService';

export function ShoppingListsPage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const navigate = useNavigate();
  const shoppingListsQuery = useShoppingListsQuery();
  const createShoppingListMutation = useCreateShoppingListMutation();
  const updateShoppingListMutation = useUpdateShoppingListMutation();
  const deleteShoppingListMutation = useDeleteShoppingListMutation();
  const lists = shoppingListsQuery.data ?? [];
  const listItemsQueries = useQueries({
    queries: lists.map((list) => ({
      queryKey: shoppingListKeys.items(list.id),
      queryFn: () => getShoppingListItems(list.id),
      enabled: Boolean(list.id),
      staleTime: 20_000,
    })),
  });

  async function handleCreateList(name: string) {
    setFeedback(null);
    await createShoppingListMutation.mutateAsync({ name });
    setFeedback('Lista criada com sucesso.');
  }

  async function handleUpdateList(id: string, name: string) {
    setFeedback(null);
    await updateShoppingListMutation.mutateAsync({ id, payload: { name } });
    setFeedback('Lista atualizada com sucesso.');
  }

  function handleDeleteList(id: string) {
    setFeedback(null);
    deleteShoppingListMutation.mutate(id, {
      onSuccess: () => setFeedback('Lista excluida com sucesso.'),
    });
  }

  function getStats(index: number) {
    const items = listItemsQueries[index]?.data ?? [];
    const completed = items.filter((item) => item.isCompleted).length;

    return {
      completed,
      pending: items.length - completed,
      total: items.length,
    };
  }

  return (
    <>
      <section>
        <h1 className="text-balance text-2xl font-bold text-foreground">Minhas listas de compras</h1>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Organize suas compras criando e gerenciando listas personalizadas.
        </p>
      </section>

      <section aria-label="Criar nova lista">
        <QuickCreateForm
          disabled={createShoppingListMutation.isPending}
          placeholder="Nome da nova lista..."
          onSubmit={handleCreateList}
        />
      </section>

      {feedback ? <p className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">{feedback}</p> : null}
      {createShoppingListMutation.isError ? <ErrorMessage message={createShoppingListMutation.error.message} /> : null}
      {updateShoppingListMutation.isError ? <ErrorMessage message={updateShoppingListMutation.error.message} /> : null}
      {deleteShoppingListMutation.isError ? <ErrorMessage message={deleteShoppingListMutation.error.message} /> : null}

      {shoppingListsQuery.isLoading ? (
        <StateView message="Buscando suas listas no BFF." title="Carregando listas" type="loading" />
      ) : shoppingListsQuery.isError ? (
        <StateView
          action={<RetryButton onClick={() => void shoppingListsQuery.refetch()} />}
          message={shoppingListsQuery.error.message}
          title="Nao foi possivel carregar"
          type="error"
        />
      ) : lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingCart className="h-8 w-8" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Nenhuma lista ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">Crie sua primeira lista de compras acima.</p>
          </div>
        </div>
      ) : (
        <section aria-label="Suas listas de compras">
          <ul className="flex flex-col gap-4" role="list">
            {lists.map((list, index) => (
              <li key={list.id}>
                <ShoppingListCard
                  isDeleting={deleteShoppingListMutation.isPending && deleteShoppingListMutation.variables === list.id}
                  isUpdating={updateShoppingListMutation.isPending && updateShoppingListMutation.variables?.id === list.id}
                  list={list}
                  stats={getStats(index)}
                  onDelete={handleDeleteList}
                  onOpen={(listId) => navigate(`/shopping-lists/${listId}`)}
                  onUpdate={handleUpdateList}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p>;
}
