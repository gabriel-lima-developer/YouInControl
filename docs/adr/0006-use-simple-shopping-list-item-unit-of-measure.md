# 0006 - Usar unidade de medida simples no item

## Status

Aceita

## Contexto

Itens de lista de compras precisam representar uma unidade de medida inicial para melhorar o contrato do BFF. O projeto ainda esta em uma fase simples do modulo Mercado e nao precisa de cadastro dinamico de unidades.

## Decisao

Representar a unidade de medida do item como enum nullable no dominio e no contrato publico, com os valores `Unit`, `Kg`, `Liter` e `Package`. Persistir o valor como string nullable na coluna `unit_of_measure`.

## Consequencias

- Itens antigos continuam validos com unidade nula.
- A UI pode oferecer opcoes iniciais sem depender de nova tabela.
- O contrato fica simples e suficiente para o curto prazo.
- Uma evolucao futura para unidades dinamicas exigira nova decisao e migration.

## Alternativas consideradas

- String livre: rejeitada por permitir valores inconsistentes logo no primeiro contrato.
- Value object complexo: rejeitado por adicionar estrutura antes de existir necessidade real.
- Tabela de unidades: rejeitada porque nao ha cadastro dinamico de unidades neste ciclo.
