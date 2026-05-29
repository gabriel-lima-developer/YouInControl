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

## Estrutura

```text
backend/YouInControl/
  YouInControl.sln
  YouInControl.Api/
  YouInControl.Application/
  YouInControl.Domain/
  YouInControl.Infrastructure/
  docker-compose.yml
frontend/youincontrol-web/
docs/
```

O backend segue Clean Architecture:

- `YouInControl.Api`: controllers, Swagger, CORS, exception handling e bootstrap HTTP.
- `YouInControl.Application`: DTOs, casos de uso, validacoes de aplicacao e contratos.
- `YouInControl.Domain`: entidades, enums e regras de dominio.
- `YouInControl.Infrastructure`: EF Core, PostgreSQL, migrations e repositorios concretos.

## Como rodar localmente

### Backend

```bash
cd backend/YouInControl
docker compose up -d postgres
dotnet restore
dotnet run --project YouInControl.Api/YouInControl.Api.csproj
```

- API: `http://localhost:5080`
- Swagger: `http://localhost:5080/swagger`

### Frontend

```bash
cd frontend/youincontrol-web
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- BFF local padrao: `http://localhost:8080`

Configure a URL do BFF com `VITE_API_BASE_URL`. Use `frontend/youincontrol-web/.env.example` como referencia:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Build do frontend:

```bash
cd frontend/youincontrol-web
npm run build
```

O frontend ainda nao possui scripts de lint ou testes automatizados no `package.json`.

### Publicacao do frontend no Azure Static Web Apps

O projeto esta preparado para o Azure Static Web Apps com fallback SPA em `frontend/youincontrol-web/public/staticwebapp.config.json`.

Na criacao do Static Web App, use:

- App location: `frontend/youincontrol-web`
- Output location: `dist`

Configure `VITE_API_BASE_URL` no ambiente de build do Azure Static Web Apps:

```env
VITE_API_BASE_URL=https://youincontrol-bff.agreeabledesert-d911b356.eastus.azurecontainerapps.io
```

Apos publicar o Static Web App, adicione a URL final no CORS do BFF via configuracao do Azure Container App:

```env
Cors__AllowedOrigins__0=http://localhost:5173
Cors__AllowedOrigins__1=https://URL_DO_STATIC_WEB_APP
```

Nao crie workflow manualmente se o Azure gerar o arquivo de GitHub Actions na criacao do recurso.

## Como rodar com Docker

```bash
cd backend/YouInControl
docker compose up --build
```

- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger`

Para parar:

```bash
docker compose down
```

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

- Arquitetura: `docs/architecture.md`
- Endpoints de listas de compras: `docs/api/shopping-lists.md`
- Decisoes arquiteturais: `docs/adr/`
- Arquitetura do frontend: `docs/frontend/architecture.md`
- Integracao frontend/BFF: `docs/frontend/api-integration.md`
- Feature de listas no frontend: `docs/frontend/shopping-lists-feature.md`
- Ambiente do frontend: `docs/frontend/environment.md`
- Testes do frontend: `docs/frontend/testing.md`

## Autenticacao

JWT Bearer foi registrado como decisao arquitetural pendente. Os endpoints atuais ainda nao exigem token porque nao ha mecanismo de emissao/autenticacao implementado neste ciclo.
