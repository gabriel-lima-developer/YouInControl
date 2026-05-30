# YouInControl

YouInControl e um projeto pessoal para organizar rotinas da vida. O BFF atual implementa o piloto do modulo Mercado, com foco em listas de compras.

## Stack

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Swagger/OpenAPI
- Docker e Docker Compose
- React, TypeScript e Vite no frontend
- Azure Static Web Apps, Azure Container Apps, Azure Container Registry e Azure Database for PostgreSQL

## Estrutura

```text
.github/workflows/
  azure-static-web-apps-proud-ocean-0ff51260f.yml
  bff-docker-publish.yml
backend/YouInControl/
  YouInControl.sln
  YouInControl.Api/
    Dockerfile
  YouInControl.Application/
  YouInControl.Domain/
  YouInControl.Infrastructure/
  docker-compose.yml
frontend/youincontrol-web/
  package.json
  vite.config.ts
  public/staticwebapp.config.json
docs/
```

O backend segue Clean Architecture:

- `YouInControl.Api`: controllers, Swagger, CORS, exception handling e bootstrap HTTP.
- `YouInControl.Application`: DTOs, casos de uso, validacoes de aplicacao e contratos.
- `YouInControl.Domain`: entidades, enums e regras de dominio.
- `YouInControl.Infrastructure`: EF Core, PostgreSQL, migrations e repositorios concretos.

## Infraestrutura e Deploy

O ambiente publicado usa Azure para hospedar a UI, o BFF e o banco de dados:

- Frontend React/Vite: Azure Static Web Apps.
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

### Deploy do backend

O workflow `.github/workflows/bff-docker-publish.yml` publica o BFF quando ha push na branch `main` alterando `backend/YouInControl/**` ou o proprio workflow. Ele tambem pode ser executado manualmente por `workflow_dispatch`.

Fluxo:

1. Faz login no Azure e no Azure Container Registry usando secrets do GitHub Actions.
2. Builda a imagem Docker com:
   - Dockerfile: `backend/YouInControl/YouInControl.Api/Dockerfile`
   - Contexto: `backend/YouInControl`
   - Nome logico da imagem: `youincontrol-bff`
   - Tags: `${{ github.sha }}` e `latest`
3. Publica as tags no Azure Container Registry.
4. Atualiza o Azure Container App `youincontrol-bff` com a imagem da revision atual.

Secrets como `AZURE_CREDENTIALS`, `ACR_NAME` e `ACR_LOGIN_SERVER` devem ficar apenas no GitHub Actions/Azure, nunca em arquivos versionados.

### Deploy do frontend

O workflow `.github/workflows/azure-static-web-apps-proud-ocean-0ff51260f.yml` publica o React/Vite no Azure Static Web Apps em push na `main`. Para pull requests, o workflow cria/atualiza ambientes de preview e executa o fechamento quando o PR e encerrado.

Configuracao real do workflow:

- `app_location`: `./frontend/youincontrol-web`
- `api_location`: vazio
- `output_location`: `dist`
- Build do Vite: `npm run build`, gerando a pasta `dist`
- `VITE_API_BASE_URL`: `https://youincontrol-bff.agreeabledesert-d911b356.eastus.azurecontainerapps.io`

Detalhes operacionais estao em `docs/infraestrutura-azure.md`.

## Como rodar localmente

### Backend

Suba o PostgreSQL local com Docker Compose e execute a API:

```bash
cd backend/YouInControl
docker compose up -d postgres
dotnet restore
dotnet run --project YouInControl.Api/YouInControl.Api.csproj
```

- API por execucao direta: `http://localhost:5080`
- Swagger: `http://localhost:5080/swagger`
- Health: `http://localhost:5080/health`

### Frontend

Configure `frontend/youincontrol-web/.env` com a URL local do BFF:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Depois execute:

```bash
cd frontend/youincontrol-web
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- BFF local padrao para integracao com Docker: `http://localhost:8080`

Build do frontend:

```bash
cd frontend/youincontrol-web
npm run build
```

O frontend ainda nao possui scripts de lint ou testes automatizados no `package.json`.

## Como rodar com Docker

```bash
cd backend/YouInControl
docker compose up --build
```

- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger`
- Health: `http://localhost:8080/health`

Para parar:

```bash
docker compose down
```

## Variaveis de ambiente

Frontend:

- `VITE_API_BASE_URL`: URL base do BFF consumida pelo frontend Vite.

BFF:

- `ASPNETCORE_ENVIRONMENT`: define o ambiente ASP.NET Core.
- `ASPNETCORE_URLS`: define o binding HTTP do container, por exemplo `http://+:8080`.
- `ConnectionStrings__DefaultConnection`: connection string PostgreSQL. Use valor mascarado em documentacao, por exemplo `Host=<host>;Port=5432;Database=<db>;Username=<user>;Password=<password>`.
- `Database__ApplyMigrationsOnStartup`: quando `true`, aplica migrations no startup.
- `Cors__AllowedOrigins__0`: origem local permitida, por exemplo `http://localhost:5173`.
- `Cors__AllowedOrigins__1`: origem publicada permitida, por exemplo a URL do Azure Static Web Apps.

O BFF aceita chamadas do frontend publicado via `Cors:AllowedOrigins`. Em producao, configure explicitamente a URL do Azure Static Web Apps no Azure Container App e nao use `AllowAnyOrigin`.

## Banco de dados

No ambiente local, o projeto usa PostgreSQL em Docker Compose com volume local `postgres_data`. No ambiente publicado, o BFF usa Azure Database for PostgreSQL Flexible Server.

Os dados do banco local nao sao compartilhados automaticamente com o banco da Azure. Sao ambientes separados.

As migrations podem ser aplicadas no startup quando `Database__ApplyMigrationsOnStartup=true`. Essa abordagem e aceitavel para este projeto/laboratorio; em ambientes profissionais, migrations geralmente sao controladas por pipeline, job ou processo operacional especifico.

## Endpoints uteis

- `GET /health`: valida se o processo do BFF esta respondendo.
- `GET/POST /api/shopping-lists`: lista ou cria listas de compras.
- `GET/PUT/DELETE /api/shopping-lists/{id}`: consulta, atualiza ou remove uma lista.
- `GET/POST /api/shopping-lists/{shoppingListId}/items`: lista ou cria itens.
- `GET/PUT/DELETE /api/shopping-lists/{shoppingListId}/items/{itemId}`: consulta, atualiza ou remove item.
- `PATCH /api/shopping-lists/{shoppingListId}/items/{itemId}/complete`: marca item como concluido.
- `PATCH /api/shopping-lists/{shoppingListId}/items/{itemId}/uncomplete`: marca item como nao concluido.
- `PATCH /api/shopping-lists/{shoppingListId}/items/reorder`: reordena itens.

Contrato completo: `docs/api/shopping-lists.md`.

## Migrations

```bash
cd backend/YouInControl
dotnet tool restore
```

Criar migration:

```bash
dotnet dotnet-ef migrations add NomeDaMigration --project YouInControl.Infrastructure/YouInControl.Infrastructure.csproj --startup-project YouInControl.Api/YouInControl.Api.csproj --context YouInControlDbContext --output-dir Persistence/Migrations
```

Aplicar migrations:

```bash
dotnet dotnet-ef database update --project YouInControl.Infrastructure/YouInControl.Infrastructure.csproj --startup-project YouInControl.Api/YouInControl.Api.csproj --context YouInControlDbContext
```

No Docker Compose, a API aplica migrations automaticamente quando `Database__ApplyMigrationsOnStartup=true`.

## Testes

Ainda nao ha projeto de testes automatizados na solution.

Comandos de validacao:

```bash
cd backend/YouInControl
dotnet restore
dotnet build
dotnet test
```

## Documentacao

- Infraestrutura Azure e deploy: `docs/infraestrutura-azure.md`
- Arquitetura: `docs/architecture.md`
- Endpoints de listas de compras: `docs/api/shopping-lists.md`
- Decisoes arquiteturais: `docs/adr/README.md`
- Arquitetura do frontend: `docs/frontend/architecture.md`
- Integracao frontend/BFF: `docs/frontend/api-integration.md`
- Feature de listas no frontend: `docs/frontend/shopping-lists-feature.md`
- Ambiente do frontend: `docs/frontend/environment.md`
- Testes do frontend: `docs/frontend/testing.md`

## Autenticacao

JWT Bearer foi registrado como decisao arquitetural pendente. Os endpoints atuais ainda nao exigem token porque nao ha mecanismo de emissao/autenticacao implementado neste ciclo.
