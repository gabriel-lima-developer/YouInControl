# Arquitetura do frontend

## Objetivo

O frontend do YouInControl entrega a experiencia web do piloto de Lista de Compras e consome o BFF .NET por endpoints REST. Neste ciclo, o foco e ter um fluxo funcional ponta a ponta, com UI simples, responsiva e facil de evoluir.

## Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- TanStack React Query 5
- `fetch` centralizado em `src/api/httpClient.ts`

## Estrutura

O codigo de dominio da lista de compras fica organizado por feature:

```text
src/
  api/
    config.ts
    httpClient.ts
  components/
    Button.tsx
    StateView.tsx
    TextField.tsx
  features/
    shopping-lists/
      components/
      hooks/
      pages/
      services/
      types/
  layouts/
  routes/
  utils/
```

Componentes compartilhados ficam em `src/components`. Componentes, hooks, services e tipos especificos da funcionalidade ficam dentro de `src/features/shopping-lists`.

## Fluxo de dados

1. A pagina React chama hooks da feature.
2. Os hooks usam TanStack React Query para cache, loading, erro e invalidacao.
3. Os hooks chamam services da feature.
4. Os services chamam o `httpClient`.
5. O `httpClient` envia a requisicao para o BFF configurado por `VITE_API_BASE_URL`.

## Padroes

- Paginas coordenam estado visual e mutations.
- Components recebem dados e callbacks por props.
- Hooks encapsulam queries e mutations.
- Services conhecem rotas HTTP e payloads.
- Types representam os contratos publicos do BFF.
- Estados de loading, erro e vazio usam `StateView`.

## Novas features

Novas funcionalidades devem seguir o mesmo formato por feature: `components`, `hooks`, `pages`, `services` e `types`. Bibliotecas novas devem ser adicionadas apenas quando reduzirem complexidade real.
