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

```bash
cd backend/YouInControl
docker compose up -d postgres
dotnet restore
dotnet run --project YouInControl.Api/YouInControl.Api.csproj
```

- API: `http://localhost:5080`
- Swagger: `http://localhost:5080/swagger`

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

## Autenticacao

JWT Bearer foi registrado como decisao arquitetural pendente. Os endpoints atuais ainda nao exigem token porque nao ha mecanismo de emissao/autenticacao implementado neste ciclo.
