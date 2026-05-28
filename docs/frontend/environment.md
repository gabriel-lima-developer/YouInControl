# Ambiente do frontend

## Variaveis

O frontend usa variaveis Vite, sempre com prefixo `VITE_`.

```env
VITE_API_BASE_URL=http://localhost:5080
```

## Arquivo de exemplo

O arquivo versionado e:

```text
frontend/youincontrol-web/.env.example
```

Para desenvolvimento local, crie um `.env` local com base nesse exemplo. O `.env` nao deve ser versionado.

## Backend local

Quando o BFF roda por `dotnet run`, use:

```env
VITE_API_BASE_URL=http://localhost:5080
```

Quando o BFF roda via Docker Compose expondo a API, use:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Producao

Em producao, a variavel deve ser configurada no ambiente de build/deploy. Nao inclua URLs sensiveis, tokens, secrets ou credenciais em arquivos versionados.
