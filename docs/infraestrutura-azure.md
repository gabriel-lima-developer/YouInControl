# Infraestrutura Azure e Deploy

Este documento descreve como o YouInControl esta publicado no Azure, como os workflows de CI/CD funcionam e quais configuracoes sao necessarias para manter frontend, BFF e banco integrados.

## Topologia publicada

- UI React/Vite: Azure Static Web Apps.
- BFF .NET 10: Azure Container Apps.
- Imagem Docker do BFF: Azure Container Registry.
- Banco de dados: Azure Database for PostgreSQL Flexible Server.
- CI/CD: GitHub Actions.

URLs publicas atuais:

- UI: `https://proud-ocean-0ff51260f.7.azurestaticapps.net`
- BFF: `https://youincontrol-bff.agreeabledesert-d911b356.eastus.azurecontainerapps.io`
- Health check: `https://youincontrol-bff.agreeabledesert-d911b356.eastus.azurecontainerapps.io/health`

```text
GitHub Actions
  -> Azure Container Registry
  -> Azure Container Apps: BFF .NET 10
  -> Azure Database for PostgreSQL Flexible Server

Azure Static Web Apps: React/Vite
  -> BFF .NET 10
```

## CI/CD do backend

O backend e publicado pelo workflow `.github/workflows/bff-docker-publish.yml`.

Triggers:

- Push na branch `main` quando houver alteracao em `backend/YouInControl/**`.
- Push na branch `main` quando houver alteracao no proprio workflow `.github/workflows/bff-docker-publish.yml`.
- Execucao manual via `workflow_dispatch`.

Fluxo do workflow:

1. Faz checkout do repositorio.
2. Faz login no Azure usando `AZURE_CREDENTIALS`.
3. Faz login no Azure Container Registry usando `ACR_NAME`.
4. Builda a imagem Docker do BFF.
5. Publica a imagem no Azure Container Registry.
6. Atualiza o Azure Container App `youincontrol-bff`.

Configuracao real do build:

- Dockerfile: `backend/YouInControl/YouInControl.Api/Dockerfile`
- Build context: `backend/YouInControl`
- Nome logico da imagem: `youincontrol-bff`
- Tags publicadas:
  - `${{ github.sha }}`
  - `latest`
- Container App atualizado: `youincontrol-bff`
- Resource group usado no comando de deploy: `YouInControl`

Formato da imagem no workflow:

```text
<ACR_LOGIN_SERVER>/youincontrol-bff:<github.sha>
<ACR_LOGIN_SERVER>/youincontrol-bff:latest
```

`ACR_LOGIN_SERVER`, `ACR_NAME` e `AZURE_CREDENTIALS` sao secrets/configuracoes do GitHub Actions e Azure. Nao devem ser documentados com valores reais nem versionados em arquivos do repositorio.

## CI/CD do frontend

O frontend e publicado pelo workflow `.github/workflows/azure-static-web-apps-proud-ocean-0ff51260f.yml`.

Triggers:

- Push na branch `main`.
- Pull requests abertos, sincronizados, reabertos ou fechados contra `main`.

Comportamento:

- Em push ou PR aberto/sincronizado/reaberto, o workflow faz build e deploy no Azure Static Web Apps.
- Em PR fechado, o workflow executa a acao de fechamento do ambiente de preview.

Configuracao real do workflow:

- `app_location`: `./frontend/youincontrol-web`
- `api_location`: vazio
- `output_location`: `dist`
- Variavel de build:
  - `VITE_API_BASE_URL=https://youincontrol-bff.agreeabledesert-d911b356.eastus.azurecontainerapps.io`

O build do frontend usa o script do `package.json`:

```bash
npm run build
```

Esse script executa TypeScript e Vite, gerando a pasta `dist`, que e a pasta publicada pelo Azure Static Web Apps.

## Variaveis de ambiente

### Frontend

| Variavel | Finalidade | Exemplo |
| --- | --- | --- |
| `VITE_API_BASE_URL` | URL base do BFF consumida pelo frontend Vite. | `http://localhost:8080` ou `https://youincontrol-bff.agreeabledesert-d911b356.eastus.azurecontainerapps.io` |

Variaveis Vite precisam usar o prefixo `VITE_` para ficarem disponiveis no codigo do frontend. Em producao, `VITE_API_BASE_URL` e configurada no workflow do Azure Static Web Apps.

### BFF

| Variavel | Finalidade | Exemplo seguro |
| --- | --- | --- |
| `ASPNETCORE_ENVIRONMENT` | Define o ambiente ASP.NET Core. | `Development` ou `Production` |
| `ASPNETCORE_URLS` | Define em qual URL/porta o container escuta. | `http://+:8080` |
| `ConnectionStrings__DefaultConnection` | Connection string do PostgreSQL usada pelo EF Core. | `Host=<host>;Port=5432;Database=<db>;Username=<user>;Password=<password>` |
| `Database__ApplyMigrationsOnStartup` | Controla se migrations sao aplicadas no startup. | `true` ou `false` |
| `Cors__AllowedOrigins__0` | Primeira origem permitida pelo CORS, normalmente frontend local. | `http://localhost:5173` |
| `Cors__AllowedOrigins__1` | Segunda origem permitida pelo CORS, normalmente UI publicada. | `https://proud-ocean-0ff51260f.7.azurestaticapps.net` |

Nunca versionar senha, token, secret ou connection string completa de producao. Use os mecanismos de configuracao do Azure Container Apps e do GitHub Actions.

## CORS

O BFF configura CORS lendo `Cors:AllowedOrigins`. Em variaveis de ambiente, essa lista e representada por chaves indexadas como:

```env
Cors__AllowedOrigins__0=http://localhost:5173
Cors__AllowedOrigins__1=https://proud-ocean-0ff51260f.7.azurestaticapps.net
```

A URL do Azure Static Web Apps precisa estar configurada no Azure Container App para que o navegador aceite chamadas da UI publicada para o BFF.

Nao use `AllowAnyOrigin` em producao. Prefira sempre origens explicitas.

## Banco de dados

O projeto usa PostgreSQL em dois contextos separados:

- Local: PostgreSQL via `backend/YouInControl/docker-compose.yml`, com volume Docker `postgres_data`.
- Publicado: Azure Database for PostgreSQL Flexible Server.

Os dados do banco local nao sao compartilhados automaticamente com o banco da Azure. Criar uma lista de compras localmente nao cria essa lista no ambiente publicado, e vice-versa.

O BFF pode aplicar migrations no startup quando:

```env
Database__ApplyMigrationsOnStartup=true
```

Essa configuracao e pratica para este projeto/laboratorio, especialmente para manter o ambiente publicado simples. Em ambientes profissionais, migrations geralmente sao executadas por pipeline, job controlado ou processo operacional separado, com rollback e auditoria bem definidos.

## Execucao local

### Backend com PostgreSQL local

```bash
cd backend/YouInControl
docker compose up -d postgres
dotnet restore
dotnet run --project YouInControl.Api/YouInControl.Api.csproj
```

Pela execucao direta, a API e documentada localmente em:

- API: `http://localhost:5080`
- Swagger: `http://localhost:5080/swagger`
- Health: `http://localhost:5080/health`

### Backend completo com Docker Compose

```bash
cd backend/YouInControl
docker compose up --build
```

Nesse modo, o compose sobe PostgreSQL e API:

- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger`
- Health: `http://localhost:8080/health`

Para parar:

```bash
docker compose down
```

### Frontend local

Crie um `.env` local em `frontend/youincontrol-web/.env` com:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Depois execute:

```bash
cd frontend/youincontrol-web
npm install
npm run dev
```

O frontend roda em:

```text
http://localhost:5173
```

Se o BFF estiver rodando por execucao direta em `http://localhost:5080`, ajuste `VITE_API_BASE_URL` no `.env` local para essa URL.

## Endpoints uteis

- `GET /health`: valida se o BFF esta respondendo.
- `GET/POST /api/shopping-lists`: lista ou cria listas de compras.
- `GET/PUT/DELETE /api/shopping-lists/{id}`: consulta, atualiza ou remove uma lista.
- `GET/POST /api/shopping-lists/{shoppingListId}/items`: lista ou cria itens.
- `GET/PUT/DELETE /api/shopping-lists/{shoppingListId}/items/{itemId}`: consulta, atualiza ou remove um item.
- `PATCH /api/shopping-lists/{shoppingListId}/items/{itemId}/complete`: marca item como concluido.
- `PATCH /api/shopping-lists/{shoppingListId}/items/{itemId}/uncomplete`: marca item como nao concluido.
- `PATCH /api/shopping-lists/{shoppingListId}/items/reorder`: reordena itens.

O contrato completo dos endpoints de listas de compras esta em `docs/api/shopping-lists.md`.
