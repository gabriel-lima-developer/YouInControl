# Revisao da integracao BFF e frontend

## Contexto

Esta revisao documenta como as telas de listas de compras consomem o BFF apos a refatoracao visual. Nenhum contrato de API foi alterado neste ciclo; a UI passou a consumir os dados existentes com novos componentes visuais e alguns calculos locais.

## Endpoints consumidos

Listas de compras:

- `GET /api/shopping-lists`: lista as listas cadastradas.
- `POST /api/shopping-lists`: cria uma lista.
- `GET /api/shopping-lists/{id}`: consulta uma lista com seus itens.
- `PUT /api/shopping-lists/{id}`: atualiza o nome da lista.
- `DELETE /api/shopping-lists/{id}`: exclui uma lista e seus itens.

Itens:

- `GET /api/shopping-lists/{shoppingListId}/items`: lista itens de uma lista.
- `GET /api/shopping-lists/{shoppingListId}/items/{itemId}`: consulta item especifico.
- `POST /api/shopping-lists/{shoppingListId}/items`: cria item.
- `PUT /api/shopping-lists/{shoppingListId}/items/{itemId}`: atualiza descricao e quantidade.
- `DELETE /api/shopping-lists/{shoppingListId}/items/{itemId}`: exclui item.
- `PATCH /api/shopping-lists/{shoppingListId}/items/{itemId}/complete`: marca item como concluido.
- `PATCH /api/shopping-lists/{shoppingListId}/items/{itemId}/uncomplete`: marca item como nao concluido.
- `PATCH /api/shopping-lists/{shoppingListId}/items/reorder`: reordena itens.

## Operacoes existentes no frontend

- Listar listas.
- Criar lista.
- Editar titulo da lista.
- Excluir lista.
- Abrir detalhe da lista.
- Listar itens no detalhe.
- Criar item.
- Editar item.
- Excluir item.
- Marcar e desmarcar item como concluido.
- Ordenar itens por drag-and-drop no detalhe.

## Campos usados pela UI

Campos vindos diretamente da API:

- `id`
- `name`
- `status`
- `createdAt`
- `updatedAt`
- `items`
- `shoppingListId`
- `description`
- `quantity`
- `order`
- `isCompleted`
- `completedAt`

Campos calculados no frontend:

- Total de itens por lista.
- Quantidade concluida.
- Quantidade pendente.
- Percentual de progresso.
- Ordenacao visual dos itens no detalhe, a partir de `order`.

## Adequacao atual dos contratos

O detalhe da lista esta bem atendido por `GET /api/shopping-lists/{id}`, pois a resposta ja inclui `items`. Isso permite renderizar resumo, progresso e itens com uma chamada principal.

A listagem tem uma limitacao tecnica: `GET /api/shopping-lists` retorna apenas dados da lista, sem totalizadores. Para renderizar total, concluidos, pendentes e progresso em cada card, `ShoppingListsPage` usa `useQueries` e executa uma chamada adicional de itens por lista.

Esse comportamento funciona, mas pode gerar N chamadas extras conforme a quantidade de listas cresce.

## Regressao e impacto funcional

Funcionalidades que continuam funcionando:

- Criacao, edicao e exclusao de lista.
- Abertura do detalhe da lista.
- Criacao, edicao e exclusao de item.
- Marcar e desmarcar item como concluido.
- Reordenacao de itens, agora por drag-and-drop.
- Exibicao de datas.
- Exibicao de totalizadores e progresso.
- Consumo real da API via services e TanStack React Query.
- Tratamento de loading, erro e estados vazios.
- Layout responsivo.

Possiveis regressoes ou limitacoes:

- `ShoppingListItemRow.tsx`: a UI atual nao exibe `quantity`, embora o campo continue no contrato e fosse exibido antes.
- `ShoppingListDetailsPage.tsx` e `QuickCreateForm`: a criacao rapida de item fixa `quantity: 1`, sem campo visual para informar quantidade.
- `ShoppingListItemRow.tsx`: a edicao inline altera apenas `description` e preserva a `quantity`, sem permitir editar a quantidade.
- `ShoppingListCard.tsx` e `ShoppingListsPage.tsx`: `status` deixou de ser exibido na listagem; isso deve ser confirmado como decisao visual ou limitacao temporaria.
- `ShoppingListsPage.tsx`: totalizadores dependem de chamadas adicionais para itens de cada lista; e uma limitacao tecnica atual, nao um bug funcional.
- Exclusoes de lista e item ainda nao pedem confirmacao; melhoria de UX de curto prazo.

## Oportunidades de melhoria no BFF

Melhorias simples:

- Padronizar response models para listagem e detalhe com nomes claros para campos derivados.
- Documentar melhor payloads de atualizacao parcial, caso o produto evolua para `PATCH`.
- Manter endpoints especificos de concluir/desconcluir como contrato explicito de intencao.

Melhorias medias:

- Fazer `GET /api/shopping-lists` retornar totalizadores por lista: `itemsCount`, `completedItemsCount`, `pendingItemsCount` e `progressPercentage`.
- Fazer `GET /api/shopping-lists/{id}` retornar resumo consolidado alem de `items`.
- Evitar multiplas chamadas na listagem quando a UI precisar apenas dos totalizadores.
- Avaliar payload parcial para edicao de item quando a UI alterar somente `description` ou somente `quantity`.

Melhorias futuras:

- Criar endpoint otimizado de dashboard para visao inicial.
- Evoluir contratos para usuario autenticado quando JWT estiver implementado.
- Avaliar endpoint especifico para reordenacao com resposta resumida quando a UI nao precisar recarregar todos os itens.
- Preparar modelos para categorias, historico, recorrencia e sugestoes inteligentes.

## Dependencias de backend

Dependem de alteracao no BFF:

- Totalizadores retornados na listagem.
- Resumo consolidado no detalhe.
- Payloads parciais de edicao.
- Novos endpoints de dashboard.
- Contratos por usuario autenticado.
- Campos futuros de categoria, historico, recorrencia e inteligencia.

Podem ser feitos apenas no frontend:

- Melhorar mensagens de erro e sucesso.
- Adicionar confirmacao antes de excluir.
- Separar visualmente itens pendentes e concluidos usando os campos atuais.
- Melhorar estados vazios e loading.
- Voltar a exibir `quantity` usando o contrato atual.
