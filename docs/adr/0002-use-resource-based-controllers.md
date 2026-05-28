# 0002 - Usar controllers por recurso

## Status

Aceita

## Contexto

A API tinha concentracao de endpoints em um controller e precisava de um padrao simples para crescer.

## Decisao

Organizar controllers por recurso, como `ShoppingListsController` e `ShoppingListItemsController`.

## Consequencias

- Rotas ficam mais idiomaticas para ASP.NET Core Web API.
- Metodos HTTP ficam agrupados pelo recurso.
- Nao serao criados controllers por verbo, comando ou query.

## Alternativas consideradas

- Controllers por verbo HTTP: rejeitado por fragmentar demais a API.
- Controller unico por modulo: rejeitado para evitar crescimento excessivo.
