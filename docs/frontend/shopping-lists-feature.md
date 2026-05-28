# Feature - Listas de compras

## Fluxo funcional

A feature permite consultar, criar, editar e excluir listas de compras. Dentro de uma lista, permite consultar, criar, editar, excluir, concluir, desconcluir e reordenar itens.

## Telas

- `/shopping-lists`: lista todas as listas, cria nova lista, edita nome e exclui.
- `/shopping-lists/:id`: exibe detalhes, metricas simples e itens da lista.
- `/`: redireciona para `/shopping-lists`.
- `/lists/:id`: redireciona para `/shopping-lists/:id` por compatibilidade.

## Componentes principais

- `ShoppingListsPage`
- `ShoppingListDetailsPage`
- `ShoppingListForm`
- `ShoppingListCard`
- `ShoppingListItemForm`
- `ShoppingListItemRow`

## Endpoints usados

- `GET /api/shopping-lists`
- `GET /api/shopping-lists/{id}`
- `POST /api/shopping-lists`
- `PUT /api/shopping-lists/{id}`
- `DELETE /api/shopping-lists/{id}`
- `GET /api/shopping-lists/{shoppingListId}/items`
- `GET /api/shopping-lists/{shoppingListId}/items/{itemId}`
- `POST /api/shopping-lists/{shoppingListId}/items`
- `PUT /api/shopping-lists/{shoppingListId}/items/{itemId}`
- `DELETE /api/shopping-lists/{shoppingListId}/items/{itemId}`
- `PATCH /api/shopping-lists/{shoppingListId}/items/{itemId}/complete`
- `PATCH /api/shopping-lists/{shoppingListId}/items/{itemId}/uncomplete`
- `PATCH /api/shopping-lists/{shoppingListId}/items/reorder`

## Tipos

Os tipos ficam em `src/features/shopping-lists/types/shoppingListTypes.ts`:

- `ShoppingList`
- `ShoppingListDetails`
- `ShoppingListItem`
- `CreateShoppingListRequest`
- `UpdateShoppingListRequest`
- `CreateShoppingListItemRequest`
- `UpdateShoppingListItemRequest`
- `ReorderShoppingListItemsRequest`

## Validacoes

- Lista exige `name` preenchido e diferente de apenas espacos.
- Item exige `description` preenchida e diferente de apenas espacos.
- Item exige `quantity` preenchida e maior que zero.

Essas validacoes melhoram a experiencia, mas nao substituem as validacoes do BFF.

## Estados tratados

- Loading inicial de listas.
- Loading da lista selecionada.
- Loading em operacoes de salvar, excluir, concluir e reordenar.
- Erro de API.
- Lista vazia.
- Lista sem itens.
- Feedback simples de sucesso e erro.

## Pendencias futuras

- Adicionar testes automatizados.
- Integrar autenticacao quando o BFF implementar login real.
- Avaliar drag-and-drop para reordenacao se a experiencia exigir.
