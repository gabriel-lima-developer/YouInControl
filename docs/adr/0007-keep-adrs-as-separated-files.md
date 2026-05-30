# 0007 - Manter ADRs em arquivos separados

## Status

Aceita

## Contexto

O projeto ja possui varios ADRs pequenos em `docs/adr/`. Foi avaliada a possibilidade de unificar todos em um unico arquivo para facilitar navegacao.

## Decisao

Manter um arquivo por ADR e criar um indice em `docs/adr/README.md`. Cada ADR deve registrar uma decisao principal, seguir o template padrao e ser referenciado pelo numero sequencial.

## Consequencias

- O historico de decisoes permanece granular e facil de revisar em commits.
- O indice centraliza a navegacao sem transformar o log em um documento grande.
- Quando uma decisao mudar, um novo ADR deve substituir ou complementar o anterior em vez de reescrever o historico aceito.

## Alternativas consideradas

- Unificar todos os ADRs em um arquivo unico: rejeitado por dificultar revisao, historico granular e substituicao explicita de decisoes.
- Manter apenas arquivos avulsos sem indice: rejeitado porque a navegacao piora conforme o numero de ADRs cresce.
