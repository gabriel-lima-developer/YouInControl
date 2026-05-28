# 0003 - Usar JWT Bearer Authentication

## Status

Proposta

## Contexto

O BFF precisara proteger endpoints quando houver autenticacao real de usuarios.

## Decisao

A direcao arquitetural e usar JWT Bearer no ASP.NET Core, com secrets fora do codigo e suporte no Swagger.

## Consequencias

- Os endpoints ainda nao usam `[Authorize]` neste ciclo.
- E necessario definir emissao de token, issuer, audience, expiracao e estrategia de usuarios.
- Nao deve haver secret hardcoded em codigo ou repositorio.

## Alternativas consideradas

- Login fake local: adiado para evitar criar comportamento temporario sem necessidade imediata.
- Sem autenticacao: rejeitado como direcao de longo prazo.
