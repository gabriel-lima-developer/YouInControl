import { useState } from 'react';
import { ShoppingListCard } from '../components/ShoppingListCard';
import { ShoppingListForm } from '../components/ShoppingListForm';
import { RetryButton, StateView } from '../components/StateView';
import { useCreateShoppingListMutation, useShoppingListsQuery } from '../hooks/useShoppingLists';

export function HomePage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const shoppingListsQuery = useShoppingListsQuery();
  const createShoppingListMutation = useCreateShoppingListMutation();

  async function handleCreateList(title: string) {
    setFeedback(null);
    await createShoppingListMutation.mutateAsync({ title });
    setFeedback('Lista criada com sucesso.');
  }

  const lists = shoppingListsQuery.data ?? [];

  return (
    <div className="grid gap-6">
      <section className="grid gap-2">
        <h2 className="text-2xl font-semibold text-stone-950 sm:text-3xl">Suas listas</h2>
        <p className="max-w-2xl text-sm text-stone-600">
          Organize o que precisa comprar, acompanhe os itens pendentes e marque tudo quando passar pelo carrinho.
        </p>
      </section>

      <ShoppingListForm disabled={createShoppingListMutation.isPending} onSubmit={handleCreateList} />

      {feedback ? <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{feedback}</p> : null}
      {createShoppingListMutation.isError ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{createShoppingListMutation.error.message}</p> : null}

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
        <StateView message="Crie sua primeira lista para comecar." title="Nenhuma lista por aqui" type="empty" />
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Listas de compras">
          {lists.map((list) => (
            <ShoppingListCard key={list.id} list={list} />
          ))}
        </section>
      )}
    </div>
  );
}
