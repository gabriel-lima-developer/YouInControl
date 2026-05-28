# 0004 - Usar endpoints REST para listas de compras

## Status

Aceita

## Contexto

O piloto de listas de compras deve servir como referencia para novas funcionalidades do BFF.

## Decisao

Usar rotas REST por recurso:

- `/api/shopping-lists`
- `/api/shopping-lists/{shoppingListId}/items`

Operacoes de estado especificas, como concluir/desconcluir item, usam `PATCH` com sufixos explicitos.

## Consequencias

- CRUD de listas e itens fica previsivel.
- Itens sempre sao acessados dentro do contexto da lista.
- Reordenacao fica restrita a lista informada na rota.

## Alternativas consideradas

- Endpoints RPC para cada acao: rejeitado para manter padrao REST simples.
