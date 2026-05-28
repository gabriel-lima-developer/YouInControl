# 0001 - Usar Clean Architecture

## Status

Aceita

## Contexto

O BFF deve crescer com novas funcionalidades sem misturar entrada HTTP, regras de negocio e persistencia.

## Decisao

Usar Clean Architecture com projetos separados para API, Application, Domain e Infrastructure.

## Consequencias

- Domain nao depende de outras camadas.
- Application concentra casos de uso, DTOs e contratos.
- Infrastructure implementa persistencia e integracoes.
- API recebe requests e traduz resultados para HTTP.

## Alternativas consideradas

- Colocar regras diretamente nos controllers: rejeitado por dificultar manutencao e testes.
