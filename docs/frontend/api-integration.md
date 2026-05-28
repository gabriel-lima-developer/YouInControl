# Integracao com API

## Base URL

O frontend usa `VITE_API_BASE_URL` para apontar para o BFF:

```env
VITE_API_BASE_URL=http://localhost:5080
```

O valor e lido em `src/api/config.ts`. URLs de producao nao devem ser hardcoded no codigo.

## HTTP client

`src/api/httpClient.ts` centraliza:

- Montagem da URL final.
- Serializacao JSON.
- Header `Content-Type` quando existe body.
- Tratamento de `204 No Content`.
- Tratamento basico de erros HTTP.
- Ponto futuro para adicionar `Authorization: Bearer`.

## Services

Os services da feature ficam em `src/features/shopping-lists/services`:

- `shoppingListsService.ts`: CRUD de listas.
- `shoppingListItemsService.ts`: CRUD, concluir, desconcluir e reordenar itens.

## Erros

O BFF retorna erros tratados no formato:

```json
{
  "message": "Mensagem do erro"
}
```

Quando o corpo nao pode ser lido, o frontend usa mensagens simples por status:

- `400`: dados invalidos.
- `401`: sessao nao autorizada, reservado para autenticacao futura.
- `404`: recurso nao encontrado.
- `500`: erro inesperado no servidor.

Detalhes tecnicos e stack traces nao devem ser exibidos ao usuario final.

## Autenticacao futura

JWT Bearer esta documentado como direcao arquitetural do BFF, mas nao foi implementado neste ciclo. Quando existir login real, o `httpClient` devera incluir o token em `getAuthHeaders`, sem usar JWT fake e sem persistir secrets no repositorio.

## Execucao local

Backend via `dotnet run`:

```bash
cd backend/YouInControl
docker compose up -d postgres
dotnet run --project YouInControl.Api/YouInControl.Api.csproj
```

Frontend:

```bash
cd frontend/youincontrol-web
npm install
npm run dev
```
