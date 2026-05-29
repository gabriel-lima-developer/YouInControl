# Ambiente do frontend

## Variaveis

O frontend usa variaveis Vite, sempre com prefixo `VITE_`.

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Arquivo de exemplo

O arquivo versionado e:

```text
frontend/youincontrol-web/.env.example
```

Para desenvolvimento local, crie um `.env` local com base nesse exemplo. O `.env` nao deve ser versionado.

## Backend local

O ambiente local padrao usa:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Se o BFF estiver rodando por outro perfil local, ajuste o valor no `.env` local sem versionar esse arquivo.

## Azure Static Web Apps

Na publicacao do frontend, configure `VITE_API_BASE_URL` no ambiente de build do Azure Static Web Apps:

```env
VITE_API_BASE_URL=https://youincontrol-bff.agreeabledesert-d911b356.eastus.azurecontainerapps.io
```

## Producao

Em producao, a variavel deve ser configurada no ambiente de build/deploy. Nao inclua URLs sensiveis, tokens, secrets ou credenciais em arquivos versionados.
