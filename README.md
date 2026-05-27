# YouInControl

YouInControl e um app pessoal de organizacao da vida. O piloto atual implementa o modulo Mercado, com foco em listas de compras.

## Estrutura

```text
YouInControl/
  backend/
    YouInControl/
      YouInControl.sln
      YouInControl.Api/
      YouInControl.Application/
      YouInControl.Domain/
      YouInControl.Infrastructure/
      docker-compose.yml
  frontend/
    youincontrol-web/
      package.json
      src/
  README.md
  .gitignore
```

## Stack

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Swagger
- Docker e Docker Compose
- React
- TypeScript
- Vite

## Arquitetura

O repositorio usa uma organizacao de monorepo simples:

- `backend/YouInControl`: BFF/API .NET e solution principal.
- `frontend/youincontrol-web`: app React que consome o BFF por HTTP.

O backend segue um monolito modular simples:

- `YouInControl.Api`: controllers, Swagger, CORS, configuracao HTTP e bootstrap.
- `YouInControl.Application`: DTOs, casos de uso e contratos de repositorio.
- `YouInControl.Domain`: entidades, enum e regras de dominio.
- `YouInControl.Infrastructure`: EF Core, PostgreSQL, migrations e repositorios.

## Como rodar o backend com Docker

```bash
cd backend/YouInControl
docker compose up --build
```

A API fica disponivel em:

- Swagger: `http://localhost:8080/swagger`
- Base URL: `http://localhost:8080`

Para parar os containers:

```bash
docker compose down
```

Para remover tambem o volume do PostgreSQL:

```bash
docker compose down -v
```

## Como rodar o backend localmente

Suba apenas o PostgreSQL pelo Compose ou use uma instancia local compativel com a connection string em `backend/YouInControl/YouInControl.Api/appsettings.json`.

```bash
cd backend/YouInControl
docker compose up -d postgres
dotnet restore
dotnet run --project YouInControl.Api/YouInControl.Api.csproj
```

Swagger local:

- `http://localhost:5080/swagger`

## Como rodar o frontend

```bash
cd frontend/youincontrol-web
npm install
npm run dev
```

O frontend roda em:

- `http://localhost:5173`

O app usa `VITE_API_BASE_URL` para encontrar o BFF. Para o backend local, use:

```env
VITE_API_BASE_URL=http://localhost:5080
```

Para o backend via Docker, use:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Existe um exemplo em `frontend/youincontrol-web/.env.example`.

## Migrations

O projeto usa uma ferramenta local do `dotnet-ef`.

```bash
cd backend/YouInControl
dotnet tool restore
```

Criar uma nova migration:

```bash
dotnet dotnet-ef migrations add NomeDaMigration --project YouInControl.Infrastructure/YouInControl.Infrastructure.csproj --startup-project YouInControl.Api/YouInControl.Api.csproj --context YouInControlDbContext --output-dir Persistence/Migrations
```

Aplicar migrations manualmente:

```bash
dotnet dotnet-ef database update --project YouInControl.Infrastructure/YouInControl.Infrastructure.csproj --startup-project YouInControl.Api/YouInControl.Api.csproj --context YouInControlDbContext
```

No Docker, a API aplica migrations automaticamente no startup via `Database__ApplyMigrationsOnStartup=true`.

## Endpoints

- `POST /api/shopping-lists`
- `GET /api/shopping-lists`
- `GET /api/shopping-lists/{id}`
- `POST /api/shopping-lists/{id}/items`
- `PATCH /api/shopping-lists/{id}/items/{itemId}/complete`
- `PATCH /api/shopping-lists/{id}/items/{itemId}/uncomplete`
- `DELETE /api/shopping-lists/{id}/items/{itemId}`

## Proximos passos planejados

- Expandir o modulo Mercado com categorias, recorrencia e historico de compras.
- Adicionar testes automatizados para dominio, aplicacao, API e frontend.
- Evoluir a organizacao modular antes de considerar servicos separados.
- Adicionar autenticacao quando houver necessidade real de multiusuario.
