# YouInControl

YouInControl e um app pessoal de organizacao da vida. Este primeiro piloto implementa apenas o modulo Mercado, com foco em listas de compras.

## Stack

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Swagger
- Docker e Docker Compose

## Arquitetura

O backend esta em `backend/YouInControl` e segue um monolito modular simples:

- `YouInControl.Api`: controllers, Swagger, configuracao HTTP e bootstrap.
- `YouInControl.Application`: DTOs, casos de uso e contratos de repositorio.
- `YouInControl.Domain`: entidades, enum e regras de dominio.
- `YouInControl.Infrastructure`: EF Core, PostgreSQL, migrations e repositorios.

## Como rodar com Docker

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

## Como rodar localmente

Suba apenas o PostgreSQL pelo Compose ou use uma instancia local compativel com a connection string em `YouInControl.Api/appsettings.json`.

```bash
cd backend/YouInControl
docker compose up -d postgres
dotnet restore
dotnet run --project YouInControl.Api/YouInControl.Api.csproj
```

Swagger local:

- `http://localhost:5080/swagger`

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
- Adicionar testes automatizados para dominio, aplicacao e API.
- Criar frontend para uso pessoal.
- Evoluir a organizacao modular antes de considerar servicos separados.
- Adicionar autenticacao quando houver necessidade real de multiusuario.
