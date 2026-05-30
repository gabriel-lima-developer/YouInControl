# ADRs do YouInControl

Este diretorio registra decisoes arquiteturais e tecnicas relevantes do projeto. Cada ADR deve tratar uma decisao principal e permanecer em arquivo separado para preservar historico, facilitar revisao e permitir substituicoes explicitas.

## Indice

| ADR | Status | Titulo |
| --- | --- | --- |
| [0001](0001-use-clean-architecture.md) | Aceita | Usar Clean Architecture |
| [0002](0002-use-resource-based-controllers.md) | Aceita | Usar controllers por recurso |
| [0003](0003-use-jwt-bearer-authentication.md) | Proposta | Usar JWT Bearer Authentication |
| [0004](0004-use-restful-endpoints-for-shopping-lists.md) | Aceita | Usar endpoints REST para listas de compras |
| [0005](0005-code-style.md) | Aceita | Padrao de formatacao e chaves em C# |
| [0006](0006-use-simple-shopping-list-item-unit-of-measure.md) | Aceita | Usar unidade de medida simples no item |
| [0007](0007-keep-adrs-as-separated-files.md) | Aceita | Manter ADRs em arquivos separados |

## Template

```markdown
# 000N - Titulo

## Status

Proposta | Aceita | Substituida | Rejeitada

## Contexto

Contexto breve da decisao e do problema.

## Decisao

Decisao tomada de forma objetiva.

## Consequencias

- Consequencia relevante.

## Alternativas consideradas

- Alternativa: motivo para aceitar ou rejeitar.
```
