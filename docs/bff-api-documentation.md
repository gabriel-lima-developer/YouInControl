# Documentacao tecnica do BFF YouInControl

Este documento descreve a estrutura atual da API/BFF do YouInControl para orientar a integracao do frontend React com os endpoints existentes. A analise foi feita sobre o codigo em `backend/YouInControl`.

## 1. Estrutura geral do projeto

O repositorio e um monorepo simples com backend .NET e frontend React.

```text
backend/YouInControl/
  YouInControl.sln
  docker-compose.yml
  dotnet-tools.json
  YouInControl.Api/
  YouInControl.Application/
  YouInControl.Domain/
  YouInControl.Infrastructure/
frontend/youincontrol-web/
docs/
```

### Camadas do backend

| Camada | Responsabilidade |
| --- | --- |
| `YouInControl.Api` | Entrada HTTP da aplicacao. Contem controllers, Swagger/OpenAPI, CORS, configuracao JSON, bootstrap e Dockerfile. |
| `YouInControl.Application` | Casos de uso, DTOs, contratos de repositorio e resultados de aplicacao. Nao acessa EF Core diretamente. |
| `YouInControl.Domain` | Entidades, enum e regras de dominio do modulo Mercado. Lanca `DomainException` para validacoes de negocio. |
| `YouInControl.Infrastructure` | Persistencia com EF Core/PostgreSQL, migrations, configuracao das entidades e implementacao dos repositorios. |

### Principais arquivos de configuracao

| Arquivo | Finalidade |
| --- | --- |
| `backend/YouInControl/YouInControl.sln` | Solution .NET do backend. |
| `backend/YouInControl/YouInControl.Api/Program.cs` | Configura controllers, JSON enum como string, Swagger, CORS, DI e migrations no startup. |
| `backend/YouInControl/YouInControl.Api/appsettings.json` | Connection string, flag de migrations e logging padrao. |
| `backend/YouInControl/YouInControl.Api/appsettings.Development.json` | Logging especifico de desenvolvimento. |
| `backend/YouInControl/YouInControl.Api/Properties/launchSettings.json` | Perfil local HTTP em `http://localhost:5080`. |
| `backend/YouInControl/docker-compose.yml` | Sobe PostgreSQL e API em Docker. |
| `backend/YouInControl/YouInControl.Api/Dockerfile` | Build multi-stage da API. |
| `backend/YouInControl/dotnet-tools.json` | Ferramenta local `dotnet-ef` versao `8.0.0`. |

### Como subir localmente

Requisitos: .NET 8 SDK e PostgreSQL disponivel.

```bash
cd backend/YouInControl
docker compose up -d postgres
dotnet restore
dotnet run --project YouInControl.Api/YouInControl.Api.csproj
```

URLs locais:

| Recurso | URL |
| --- | --- |
| API base | `http://localhost:5080` |
| Swagger | `http://localhost:5080/swagger` |

Por padrao, `Database:ApplyMigrationsOnStartup` esta `false` em `appsettings.json`. Para aplicar migrations manualmente:

```bash
cd backend/YouInControl
dotnet tool restore
dotnet dotnet-ef database update --project YouInControl.Infrastructure/YouInControl.Infrastructure.csproj --startup-project YouInControl.Api/YouInControl.Api.csproj --context YouInControlDbContext
```

### Como subir via Docker

```bash
cd backend/YouInControl
docker compose up --build
```

URLs via Docker Compose:

| Recurso | URL |
| --- | --- |
| API base | `http://localhost:8080` |
| Swagger | `http://localhost:8080/swagger` |
| PostgreSQL | `localhost:5432` |

No Docker Compose, a API recebe `Database__ApplyMigrationsOnStartup=true`, entao executa migrations automaticamente ao iniciar.

## 2. Endpoints disponiveis

Controller principal: `backend/YouInControl/YouInControl.Api/Controllers/ShoppingListsController.cs`

Base path: `/api/shopping-lists`

Observacoes gerais:

- Todos os exemplos assumem `baseUrl = http://localhost:5080` em execucao local.
- Datas sao retornadas em formato JSON ISO 8601.
- O enum `ShoppingListStatus` e serializado como string por `JsonStringEnumConverter`.
- Erros tratados pela aplicacao retornam objeto `{ "message": "..." }`.
- IDs sao `Guid`.
- Nao ha autenticacao/autorizacao implementada.

### POST `/api/shopping-lists`

Cria uma nova lista de compras.

| Campo | Valor |
| --- | --- |
| Metodo | `POST` |
| Rota completa | `/api/shopping-lists` |
| Controller | `ShoppingListsController.Create` |
| Request DTO | `CreateShoppingListRequest` |
| Response DTO | `ShoppingListSummaryResponse` |

Parametros de rota: nenhum.

Query params: nenhum.

Body esperado:

```json
{
  "title": "Compras da semana"
}
```

Exemplo de request:

```bash
curl -X POST http://localhost:5080/api/shopping-lists \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Compras da semana\"}"
```

Exemplo de response `201 Created`:

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "title": "Compras da semana",
  "status": "Active",
  "createdAt": "2026-05-27T12:00:00Z",
  "updatedAt": null
}
```

Possiveis status codes:

| Status | Quando ocorre |
| --- | --- |
| `201 Created` | Lista criada com sucesso. |
| `400 Bad Request` | Titulo vazio/nulo/espacos ou body invalido. |
| `500 Internal Server Error` | Erro inesperado. |

Regras de validacao conhecidas:

- `title` e obrigatorio.
- `title` nao pode ser vazio ou apenas espacos.
- `title` e salvo com `Trim()`.
- Banco limita `title` a 200 caracteres.

Observacoes para o frontend:

- A resposta nao inclui `items`; para detalhe com itens, use `GET /api/shopping-lists/{id}`.
- O header `Location` aponta para `GET /api/shopping-lists/{id}` via `CreatedAtAction`.

### GET `/api/shopping-lists`

Lista todas as listas de compras em ordem decrescente de criacao.

| Campo | Valor |
| --- | --- |
| Metodo | `GET` |
| Rota completa | `/api/shopping-lists` |
| Controller | `ShoppingListsController.GetAll` |
| Response DTO | `IReadOnlyCollection<ShoppingListSummaryResponse>` |

Parametros de rota: nenhum.

Query params: nenhum.

Body esperado: nenhum.

Exemplo de request:

```bash
curl http://localhost:5080/api/shopping-lists
```

Exemplo de response `200 OK`:

```json
[
  {
    "id": "11111111-1111-1111-1111-111111111111",
    "title": "Compras da semana",
    "status": "Active",
    "createdAt": "2026-05-27T12:00:00Z",
    "updatedAt": null
  }
]
```

Possiveis status codes:

| Status | Quando ocorre |
| --- | --- |
| `200 OK` | Retorna lista, possivelmente vazia. |
| `500 Internal Server Error` | Erro inesperado. |

Regras de validacao conhecidas: nenhuma.

Observacoes para o frontend:

- Este endpoint nao retorna os itens das listas.
- Use para tela inicial/resumo; busque detalhes ao abrir uma lista.

### GET `/api/shopping-lists/{id}`

Busca uma lista de compras por ID, incluindo seus itens.

| Campo | Valor |
| --- | --- |
| Metodo | `GET` |
| Rota completa | `/api/shopping-lists/{id}` |
| Controller | `ShoppingListsController.GetById` |
| Response DTO | `ShoppingListDetailResponse` |

Parametros de rota:

| Nome | Tipo | Obrigatorio | Exemplo |
| --- | --- | --- | --- |
| `id` | `Guid` | Sim | `11111111-1111-1111-1111-111111111111` |

Query params: nenhum.

Body esperado: nenhum.

Exemplo de request:

```bash
curl http://localhost:5080/api/shopping-lists/11111111-1111-1111-1111-111111111111
```

Exemplo de response `200 OK`:

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "title": "Compras da semana",
  "status": "Active",
  "createdAt": "2026-05-27T12:00:00Z",
  "updatedAt": "2026-05-27T12:05:00Z",
  "items": [
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "shoppingListId": "11111111-1111-1111-1111-111111111111",
      "name": "Arroz",
      "quantity": 2,
      "unit": "kg",
      "isCompleted": false,
      "createdAt": "2026-05-27T12:05:00Z",
      "updatedAt": null,
      "completedAt": null
    }
  ]
}
```

Possiveis status codes:

| Status | Quando ocorre |
| --- | --- |
| `200 OK` | Lista encontrada. |
| `404 Not Found` | Lista nao encontrada. |
| `500 Internal Server Error` | Erro inesperado. |

Regras de validacao conhecidas:

- `id` precisa ser um `Guid` valido por causa da rota `{id:guid}`.

Observacoes para o frontend:

- Os itens sao ordenados por `createdAt` crescente.
- Se o ID nao for Guid valido, a rota nao casa; comportamento exato do status deve ser verificado no ASP.NET Core.

### POST `/api/shopping-lists/{id}/items`

Adiciona um item a uma lista existente.

| Campo | Valor |
| --- | --- |
| Metodo | `POST` |
| Rota completa | `/api/shopping-lists/{id}/items` |
| Controller | `ShoppingListsController.AddItem` |
| Request DTO | `CreateShoppingListItemRequest` |
| Response DTO | `ShoppingListItemResponse` |

Parametros de rota:

| Nome | Tipo | Obrigatorio | Exemplo |
| --- | --- | --- | --- |
| `id` | `Guid` | Sim | `11111111-1111-1111-1111-111111111111` |

Query params: nenhum.

Body esperado:

```json
{
  "name": "Arroz",
  "quantity": 2,
  "unit": "kg"
}
```

Exemplo de request:

```bash
curl -X POST http://localhost:5080/api/shopping-lists/11111111-1111-1111-1111-111111111111/items \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Arroz\",\"quantity\":2,\"unit\":\"kg\"}"
```

Exemplo de response `201 Created`:

```json
{
  "id": "22222222-2222-2222-2222-222222222222",
  "shoppingListId": "11111111-1111-1111-1111-111111111111",
  "name": "Arroz",
  "quantity": 2,
  "unit": "kg",
  "isCompleted": false,
  "createdAt": "2026-05-27T12:05:00Z",
  "updatedAt": null,
  "completedAt": null
}
```

Possiveis status codes:

| Status | Quando ocorre |
| --- | --- |
| `201 Created` | Item criado com sucesso. |
| `400 Bad Request` | Nome vazio/nulo/espacos ou body invalido. |
| `404 Not Found` | Lista nao encontrada. |
| `500 Internal Server Error` | Erro inesperado. |

Regras de validacao conhecidas:

- `name` e obrigatorio.
- `name` nao pode ser vazio ou apenas espacos.
- `name` e salvo com `Trim()`.
- `unit` e opcional; se vazio/espacos, e salvo como `null`; se informado, e salvo com `Trim()`.
- `quantity` e opcional.
- Banco limita `name` a 200 caracteres, `unit` a 50 caracteres e `quantity` a `numeric(18,2)`.

Observacoes para o frontend:

- O item nasce com `isCompleted=false`.
- A lista tem `updatedAt` atualizado no dominio, mas este endpoint retorna apenas o item criado. Se a UI precisar refletir `updatedAt` da lista, recarregue o detalhe da lista.

### PATCH `/api/shopping-lists/{id}/items/{itemId}/complete`

Marca um item como comprado/concluido.

| Campo | Valor |
| --- | --- |
| Metodo | `PATCH` |
| Rota completa | `/api/shopping-lists/{id}/items/{itemId}/complete` |
| Controller | `ShoppingListsController.CompleteItem` |
| Response DTO | `ShoppingListItemResponse` |

Parametros de rota:

| Nome | Tipo | Obrigatorio | Exemplo |
| --- | --- | --- | --- |
| `id` | `Guid` | Sim | `11111111-1111-1111-1111-111111111111` |
| `itemId` | `Guid` | Sim | `22222222-2222-2222-2222-222222222222` |

Query params: nenhum.

Body esperado: nenhum.

Exemplo de request:

```bash
curl -X PATCH http://localhost:5080/api/shopping-lists/11111111-1111-1111-1111-111111111111/items/22222222-2222-2222-2222-222222222222/complete
```

Exemplo de response `200 OK`:

```json
{
  "id": "22222222-2222-2222-2222-222222222222",
  "shoppingListId": "11111111-1111-1111-1111-111111111111",
  "name": "Arroz",
  "quantity": 2,
  "unit": "kg",
  "isCompleted": true,
  "createdAt": "2026-05-27T12:05:00Z",
  "updatedAt": "2026-05-27T12:10:00Z",
  "completedAt": "2026-05-27T12:10:00Z"
}
```

Possiveis status codes:

| Status | Quando ocorre |
| --- | --- |
| `200 OK` | Item marcado como comprado. |
| `404 Not Found` | Lista nao encontrada ou item nao pertence a lista. |
| `500 Internal Server Error` | Erro inesperado. |

Regras de validacao conhecidas:

- `id` e `itemId` precisam ser `Guid` validos.
- Se o item ja estiver completo, o metodo de dominio retorna sem alterar datas.

Observacoes para o frontend:

- Pode ser usado para checkbox/toggle de item comprado.
- Atualize o item localmente com o objeto retornado.

### PATCH `/api/shopping-lists/{id}/items/{itemId}/uncomplete`

Desmarca um item como comprado/concluido.

| Campo | Valor |
| --- | --- |
| Metodo | `PATCH` |
| Rota completa | `/api/shopping-lists/{id}/items/{itemId}/uncomplete` |
| Controller | `ShoppingListsController.UncompleteItem` |
| Response DTO | `ShoppingListItemResponse` |

Parametros de rota:

| Nome | Tipo | Obrigatorio | Exemplo |
| --- | --- | --- | --- |
| `id` | `Guid` | Sim | `11111111-1111-1111-1111-111111111111` |
| `itemId` | `Guid` | Sim | `22222222-2222-2222-2222-222222222222` |

Query params: nenhum.

Body esperado: nenhum.

Exemplo de request:

```bash
curl -X PATCH http://localhost:5080/api/shopping-lists/11111111-1111-1111-1111-111111111111/items/22222222-2222-2222-2222-222222222222/uncomplete
```

Exemplo de response `200 OK`:

```json
{
  "id": "22222222-2222-2222-2222-222222222222",
  "shoppingListId": "11111111-1111-1111-1111-111111111111",
  "name": "Arroz",
  "quantity": 2,
  "unit": "kg",
  "isCompleted": false,
  "createdAt": "2026-05-27T12:05:00Z",
  "updatedAt": "2026-05-27T12:15:00Z",
  "completedAt": null
}
```

Possiveis status codes:

| Status | Quando ocorre |
| --- | --- |
| `200 OK` | Item desmarcado como comprado. |
| `404 Not Found` | Lista nao encontrada ou item nao pertence a lista. |
| `500 Internal Server Error` | Erro inesperado. |

Regras de validacao conhecidas:

- `id` e `itemId` precisam ser `Guid` validos.
- Se o item ja estiver incompleto, o metodo de dominio retorna sem alterar datas.

Observacoes para o frontend:

- Use quando um checkbox marcado for desmarcado.
- Atualize o item localmente com o objeto retornado.

### DELETE `/api/shopping-lists/{id}/items/{itemId}`

Remove um item de uma lista.

| Campo | Valor |
| --- | --- |
| Metodo | `DELETE` |
| Rota completa | `/api/shopping-lists/{id}/items/{itemId}` |
| Controller | `ShoppingListsController.DeleteItem` |
| Response DTO | nenhum |

Parametros de rota:

| Nome | Tipo | Obrigatorio | Exemplo |
| --- | --- | --- | --- |
| `id` | `Guid` | Sim | `11111111-1111-1111-1111-111111111111` |
| `itemId` | `Guid` | Sim | `22222222-2222-2222-2222-222222222222` |

Query params: nenhum.

Body esperado: nenhum.

Exemplo de request:

```bash
curl -X DELETE http://localhost:5080/api/shopping-lists/11111111-1111-1111-1111-111111111111/items/22222222-2222-2222-2222-222222222222
```

Exemplo de response `204 No Content`:

```text
sem corpo
```

Possiveis status codes:

| Status | Quando ocorre |
| --- | --- |
| `204 No Content` | Item removido. |
| `404 Not Found` | Lista nao encontrada ou item nao pertence a lista. |
| `500 Internal Server Error` | Erro inesperado. |

Regras de validacao conhecidas:

- `id` e `itemId` precisam ser `Guid` validos.

Observacoes para o frontend:

- Remova o item do estado local ao receber `204`.
- O endpoint nao retorna a lista atualizada.

## 3. DTOs e contratos

Namespace: `YouInControl.Application.Mercado.Dtos`

### `CreateShoppingListRequest`

DTO de request usado por `POST /api/shopping-lists`.

| Propriedade | Tipo C# | Tipo JSON/TS | Obrigatoria | Exemplo | Observacao |
| --- | --- | --- | --- | --- | --- |
| `Title` | `string` | `string` | Sim | `"Compras da semana"` | Frontend deve enviar. Nao pode ser vazio/espacos. |

JSON:

```json
{
  "title": "Compras da semana"
}
```

### `CreateShoppingListItemRequest`

DTO de request usado por `POST /api/shopping-lists/{id}/items`.

| Propriedade | Tipo C# | Tipo JSON/TS | Obrigatoria | Exemplo | Observacao |
| --- | --- | --- | --- | --- | --- |
| `Name` | `string` | `string` | Sim | `"Arroz"` | Frontend deve enviar. Nao pode ser vazio/espacos. |
| `Quantity` | `decimal?` | `number \| null` | Nao | `2` | Frontend pode omitir/enviar `null`. Persistido como `numeric(18,2)`. |
| `Unit` | `string?` | `string \| null` | Nao | `"kg"` | Frontend pode omitir/enviar `null`. Vazio vira `null`. |

JSON:

```json
{
  "name": "Arroz",
  "quantity": 2,
  "unit": "kg"
}
```

### `ShoppingListSummaryResponse`

DTO de response usado por `POST /api/shopping-lists` e `GET /api/shopping-lists`.

| Propriedade | Tipo C# | Tipo JSON/TS | Exemplo | Observacao |
| --- | --- | --- | --- | --- |
| `Id` | `Guid` | `string` | `"11111111-1111-1111-1111-111111111111"` | Apenas retorno da API. |
| `Title` | `string` | `string` | `"Compras da semana"` | Apenas retorno da API neste DTO. |
| `Status` | `ShoppingListStatus` | `"Active" \| "Completed" \| "Archived"` | `"Active"` | Serializado como string. |
| `CreatedAt` | `DateTime` | `string` | `"2026-05-27T12:00:00Z"` | Apenas retorno da API. |
| `UpdatedAt` | `DateTime?` | `string \| null` | `null` | Apenas retorno da API. |

### `ShoppingListDetailResponse`

DTO de response usado por `GET /api/shopping-lists/{id}`.

| Propriedade | Tipo C# | Tipo JSON/TS | Exemplo | Observacao |
| --- | --- | --- | --- | --- |
| `Id` | `Guid` | `string` | `"11111111-1111-1111-1111-111111111111"` | Apenas retorno da API. |
| `Title` | `string` | `string` | `"Compras da semana"` | Apenas retorno da API. |
| `Status` | `ShoppingListStatus` | `"Active" \| "Completed" \| "Archived"` | `"Active"` | Serializado como string. |
| `CreatedAt` | `DateTime` | `string` | `"2026-05-27T12:00:00Z"` | Apenas retorno da API. |
| `UpdatedAt` | `DateTime?` | `string \| null` | `"2026-05-27T12:05:00Z"` | Apenas retorno da API. |
| `Items` | `IReadOnlyCollection<ShoppingListItemResponse>` | `ShoppingListItem[]` | `[]` | Apenas retorno da API. |

### `ShoppingListItemResponse`

DTO de response usado por endpoints de item.

| Propriedade | Tipo C# | Tipo JSON/TS | Exemplo | Observacao |
| --- | --- | --- | --- | --- |
| `Id` | `Guid` | `string` | `"22222222-2222-2222-2222-222222222222"` | Apenas retorno da API. |
| `ShoppingListId` | `Guid` | `string` | `"11111111-1111-1111-1111-111111111111"` | Apenas retorno da API. |
| `Name` | `string` | `string` | `"Arroz"` | Apenas retorno da API neste DTO. |
| `Quantity` | `decimal?` | `number \| null` | `2` | Apenas retorno da API neste DTO. |
| `Unit` | `string?` | `string \| null` | `"kg"` | Apenas retorno da API neste DTO. |
| `IsCompleted` | `bool` | `boolean` | `false` | Apenas retorno da API. |
| `CreatedAt` | `DateTime` | `string` | `"2026-05-27T12:05:00Z"` | Apenas retorno da API. |
| `UpdatedAt` | `DateTime?` | `string \| null` | `null` | Apenas retorno da API. |
| `CompletedAt` | `DateTime?` | `string \| null` | `null` | Apenas retorno da API. |

### Contrato de erro conhecido

Retornado para validacoes de dominio e not found tratados no controller:

```json
{
  "message": "Shopping list was not found."
}
```

Mensagens conhecidas:

| Mensagem | Cenario |
| --- | --- |
| `"Shopping list title is required."` | Criar lista sem titulo valido. |
| `"Item name is required."` | Criar item sem nome valido. |
| `"Shopping list was not found."` | Lista nao encontrada. |
| `"Shopping list item was not found in the informed list."` | Item nao encontrado na lista informada. |

## 4. Fluxos funcionais

### Listar itens da lista de compras

Endpoint usado: `GET /api/shopping-lists/{id}`

Payload: nenhum.

Retorno esperado: `ShoppingListDetailResponse` com `items`.

Impacto na interface React:

- Exibir titulo/status da lista.
- Renderizar `items` ordenados por criacao.
- Usar `isCompleted` para checkbox/estado visual.
- Tratar `404` exibindo estado de lista nao encontrada.

### Criar item

Endpoint usado: `POST /api/shopping-lists/{id}/items`

Payload necessario:

```json
{
  "name": "Arroz",
  "quantity": 2,
  "unit": "kg"
}
```

Retorno esperado: `ShoppingListItemResponse` do item criado.

Impacto na interface React:

- Validar `name` no formulario antes de enviar.
- Enquanto salva, desabilitar submit/loading.
- Ao receber `201`, inserir o item no estado local ou recarregar o detalhe da lista.
- Exibir erro do campo nome se a API retornar `400`.

### Editar item

Endpoint usado: nao existe endpoint de edicao geral de item no codigo atual.

Payload necessario: nao aplicavel.

Retorno esperado: nao aplicavel.

Impacto na interface React:

- Nao implementar edicao de `name`, `quantity` ou `unit` consumindo API, pois nao ha rota `PUT`/`PATCH` para isso.
- Se a UI precisar editar esses campos, sera necessario criar endpoint no BFF antes.
- Marcar/desmarcar comprado e remover item existem como fluxos separados.

### Marcar como comprado

Endpoint usado: `PATCH /api/shopping-lists/{id}/items/{itemId}/complete`

Payload necessario: nenhum.

Retorno esperado: `ShoppingListItemResponse` com `isCompleted=true` e `completedAt` preenchido.

Impacto na interface React:

- Otimista: pode marcar localmente e reverter em erro, ou aguardar resposta.
- Atualizar o item com o response para preservar `updatedAt` e `completedAt`.

### Desmarcar como comprado

Endpoint usado: `PATCH /api/shopping-lists/{id}/items/{itemId}/uncomplete`

Payload necessario: nenhum.

Retorno esperado: `ShoppingListItemResponse` com `isCompleted=false` e `completedAt=null`.

Impacto na interface React:

- Atualizar checkbox/estado visual.
- Atualizar o item com o response para preservar datas retornadas.

### Remover item

Endpoint usado: `DELETE /api/shopping-lists/{id}/items/{itemId}`

Payload necessario: nenhum.

Retorno esperado: `204 No Content`.

Impacto na interface React:

- Remover o item do estado local ao sucesso.
- Em `404`, informar que o item/lista nao existe mais e considerar recarregar a lista.

## 5. Configuracoes e ambiente

### Variaveis de ambiente utilizadas

| Variavel | Uso | Exemplo |
| --- | --- | --- |
| `ASPNETCORE_ENVIRONMENT` | Define ambiente ASP.NET Core. | `Development` |
| `ASPNETCORE_URLS` | Define URLs em que a API escuta no container. | `http://+:8080` |
| `ConnectionStrings__DefaultConnection` | Sobrescreve a connection string padrao. | `Host=postgres;Port=5432;Database=youincontrol;Username=youincontrol;Password=youincontrol` |
| `Database__ApplyMigrationsOnStartup` | Aplica migrations automaticamente no startup quando `true`. | `"true"` |

### Appsettings relevantes

`appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=youincontrol;Username=youincontrol;Password=youincontrol"
  },
  "Database": {
    "ApplyMigrationsOnStartup": false
  }
}
```

### Portas e URLs

| Contexto | API | Swagger | PostgreSQL |
| --- | --- | --- | --- |
| Local via `dotnet run` | `http://localhost:5080` | `http://localhost:5080/swagger` | `localhost:5432` |
| Docker Compose | `http://localhost:8080` | `http://localhost:8080/swagger` | `localhost:5432` |

### CORS

Politica definida em `Program.cs` com nome `Frontend`.

Origem permitida:

```text
http://localhost:5173
```

Headers e metodos:

- `AllowAnyHeader()`
- `AllowAnyMethod()`

Observacao para React:

- O frontend Vite local em `http://localhost:5173` esta liberado.
- Se o frontend rodar em outra porta/origem, a API atual bloqueara por CORS ate ajustar `Program.cs`.

### Swagger/OpenAPI

Configurado em `Program.cs`:

- `AddEndpointsApiExplorer()`
- `AddSwaggerGen()`
- `UseSwagger()`
- `UseSwaggerUI()`

Swagger fica habilitado sempre no codigo atual, nao apenas em `Development`.

### Dependencias externas

| Dependencia | Onde aparece | Uso |
| --- | --- | --- |
| PostgreSQL | `docker-compose.yml`, `Npgsql.EntityFrameworkCore.PostgreSQL` | Banco relacional. |
| Entity Framework Core 8 | Infrastructure/API | ORM e migrations. |
| Swashbuckle.AspNetCore 6.6.2 | API | Swagger/OpenAPI. |
| Docker Compose | `docker-compose.yml` | Orquestra API e PostgreSQL local. |

## 6. Persistencia de dados

A persistencia usa PostgreSQL com Entity Framework Core.

DbContext: `YouInControl.Infrastructure.Persistence.YouInControlDbContext`

DbSets:

```csharp
public DbSet<ShoppingList> ShoppingLists => Set<ShoppingList>();
public DbSet<ShoppingListItem> ShoppingListItems => Set<ShoppingListItem>();
```

### Entidades/modelos

#### `ShoppingList`

Tabela: `shopping_lists`

| Propriedade | Coluna | Tipo banco | Obrigatoria | Observacao |
| --- | --- | --- | --- | --- |
| `Id` | `id` | `uuid` | Sim | PK. |
| `Title` | `title` | `varchar(200)` | Sim | Trim no dominio. |
| `Status` | `status` | `varchar(30)` | Sim | Enum convertido para string. |
| `CreatedAt` | `created_at` | `timestamp with time zone` | Sim | UTC. |
| `UpdatedAt` | `updated_at` | `timestamp with time zone` | Nao | Atualizado em mudancas de item. |

Status possiveis no dominio:

| Valor | Numero interno |
| --- | --- |
| `Active` | `1` |
| `Completed` | `2` |
| `Archived` | `3` |

No codigo atual, listas novas nascem como `Active`; nao ha endpoint para completar/arquivar lista.

#### `ShoppingListItem`

Tabela: `shopping_list_items`

| Propriedade | Coluna | Tipo banco | Obrigatoria | Observacao |
| --- | --- | --- | --- | --- |
| `Id` | `id` | `uuid` | Sim | PK. |
| `ShoppingListId` | `shopping_list_id` | `uuid` | Sim | FK para `shopping_lists`. |
| `Name` | `name` | `varchar(200)` | Sim | Trim no dominio. |
| `Quantity` | `quantity` | `numeric(18,2)` | Nao | Quantidade opcional. |
| `Unit` | `unit` | `varchar(50)` | Nao | Vazio vira `null`. |
| `IsCompleted` | `is_completed` | `boolean` | Sim | Inicia `false`. |
| `CreatedAt` | `created_at` | `timestamp with time zone` | Sim | UTC. |
| `UpdatedAt` | `updated_at` | `timestamp with time zone` | Nao | Atualizado ao marcar/desmarcar. |
| `CompletedAt` | `completed_at` | `timestamp with time zone` | Nao | Preenchido ao marcar comprado. |

Relacionamento:

- `ShoppingList` possui muitos `ShoppingListItem`.
- Delete cascade: remover uma lista removeria itens, mas nao ha endpoint de remover lista no codigo atual.

### Como os dados sao gravados, lidos, atualizados e removidos

| Operacao | Implementacao |
| --- | --- |
| Criar lista | `ShoppingListService.CreateAsync` cria entidade `ShoppingList`, chama `IShoppingListRepository.AddAsync` e `SaveChangesAsync`. |
| Listar listas | `ShoppingListRepository.GetAllAsync` usa `AsNoTracking()`, ordena por `CreatedAt` descendente. |
| Buscar detalhe | `ShoppingListRepository.GetByIdAsync(..., includeItems: true)` usa `Include(shoppingList => shoppingList.Items)`. |
| Criar item | Serviço busca lista com itens, chama `shoppingList.AddItem(...)` e salva alterações. |
| Marcar/desmarcar item | Serviço busca lista com itens, valida item na lista, chama metodo de dominio e salva. |
| Remover item | Serviço busca lista com itens, chama `shoppingList.RemoveItem(itemId)` e salva. |

### Migrations existentes

| Migration | Finalidade |
| --- | --- |
| `20260518230617_InitialCreate` | Cria tabelas `shopping_lists` e `shopping_list_items`, FK e indice por `shopping_list_id`. |
| `20260524001811_NomeDaMigration` | Migration vazia no codigo atual. |

## 7. Docker

### Dockerfile

Arquivo: `backend/YouInControl/YouInControl.Api/Dockerfile`

Imagem base runtime:

```dockerfile
mcr.microsoft.com/dotnet/aspnet:8.0
```

Imagem base build:

```dockerfile
mcr.microsoft.com/dotnet/sdk:8.0
```

Etapas:

| Stage | Responsabilidade |
| --- | --- |
| `base` | Runtime ASP.NET 8, `WORKDIR /app`, `EXPOSE 8080`. |
| `build` | SDK .NET 8, copia `.csproj`, executa restore, copia codigo e publica Release. |
| `final` | Copia publish para `/app` e executa `dotnet YouInControl.Api.dll`. |

Porta exposta no Dockerfile:

```text
8080
```

### Docker Compose

Arquivo: `backend/YouInControl/docker-compose.yml`

Servicos:

| Servico | Imagem/build | Porta host | Porta container |
| --- | --- | --- | --- |
| `postgres` | `postgres:16-alpine` | `5432` | `5432` |
| `api` | Build local via `YouInControl.Api/Dockerfile` | `8080` | `8080` |

Variaveis do container da API:

```yaml
ASPNETCORE_ENVIRONMENT: Development
ASPNETCORE_URLS: http://+:8080
ConnectionStrings__DefaultConnection: Host=postgres;Port=5432;Database=youincontrol;Username=youincontrol;Password=youincontrol
Database__ApplyMigrationsOnStartup: "true"
```

Comando para build da imagem usando Compose:

```bash
cd backend/YouInControl
docker compose build api
```

Comando para executar localmente com banco:

```bash
cd backend/YouInControl
docker compose up --build
```

Comando para executar somente a imagem da API manualmente:

```bash
cd backend/YouInControl
docker build -f YouInControl.Api/Dockerfile -t youincontrol-api .
docker run --rm -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS=http://+:8080 \
  -e ConnectionStrings__DefaultConnection="Host=host.docker.internal;Port=5432;Database=youincontrol;Username=youincontrol;Password=youincontrol" \
  -e Database__ApplyMigrationsOnStartup=true \
  youincontrol-api
```

## Guia para consumo pelo frontend React

### Base URL recomendada

Use variavel de ambiente no frontend:

```env
VITE_API_BASE_URL=http://localhost:5080
```

Para backend via Docker Compose:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Mapa resumido dos endpoints

| Acao | Metodo | Endpoint | Body | Retorno |
| --- | --- | --- | --- | --- |
| Criar lista | `POST` | `/api/shopping-lists` | `{ title }` | `ShoppingListSummary` |
| Listar listas | `GET` | `/api/shopping-lists` | nenhum | `ShoppingListSummary[]` |
| Buscar lista com itens | `GET` | `/api/shopping-lists/{id}` | nenhum | `ShoppingListDetail` |
| Criar item | `POST` | `/api/shopping-lists/{id}/items` | `{ name, quantity?, unit? }` | `ShoppingListItem` |
| Marcar item comprado | `PATCH` | `/api/shopping-lists/{id}/items/{itemId}/complete` | nenhum | `ShoppingListItem` |
| Desmarcar item comprado | `PATCH` | `/api/shopping-lists/{id}/items/{itemId}/uncomplete` | nenhum | `ShoppingListItem` |
| Remover item | `DELETE` | `/api/shopping-lists/{id}/items/{itemId}` | nenhum | `204 No Content` |

Nao existem no codigo atual:

- Endpoint para editar item (`name`, `quantity`, `unit`).
- Endpoint para remover lista.
- Endpoint para editar titulo/status da lista.
- Endpoint para completar/arquivar lista.

### Tipos TypeScript sugeridos

```ts
export type ShoppingListStatus = 'Active' | 'Completed' | 'Archived';

export type ShoppingListSummary = {
  id: string;
  title: string;
  status: ShoppingListStatus;
  createdAt: string;
  updatedAt: string | null;
};

export type ShoppingListDetail = ShoppingListSummary & {
  items: ShoppingListItem[];
};

export type ShoppingListItem = {
  id: string;
  shoppingListId: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  completedAt: string | null;
};

export type CreateShoppingListRequest = {
  title: string;
};

export type CreateShoppingListItemRequest = {
  name: string;
  quantity?: number | null;
  unit?: string | null;
};

export type ApiError = {
  message: string;
};
```

### Funcoes de service/api sugeridas com fetch

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? `Erro HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function listShoppingLists() {
  return request<ShoppingListSummary[]>('/api/shopping-lists');
}

export function getShoppingList(id: string) {
  return request<ShoppingListDetail>(`/api/shopping-lists/${id}`);
}

export function createShoppingList(payload: CreateShoppingListRequest) {
  return request<ShoppingListSummary>('/api/shopping-lists', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createShoppingListItem(listId: string, payload: CreateShoppingListItemRequest) {
  return request<ShoppingListItem>(`/api/shopping-lists/${listId}/items`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function completeShoppingListItem(listId: string, itemId: string) {
  return request<ShoppingListItem>(`/api/shopping-lists/${listId}/items/${itemId}/complete`, {
    method: 'PATCH',
  });
}

export function uncompleteShoppingListItem(listId: string, itemId: string) {
  return request<ShoppingListItem>(`/api/shopping-lists/${listId}/items/${itemId}/uncomplete`, {
    method: 'PATCH',
  });
}

export function deleteShoppingListItem(listId: string, itemId: string) {
  return request<void>(`/api/shopping-lists/${listId}/items/${itemId}`, {
    method: 'DELETE',
  });
}
```

### Exemplo com axios

```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080',
});

export async function getShoppingList(id: string) {
  const { data } = await api.get<ShoppingListDetail>(`/api/shopping-lists/${id}`);
  return data;
}

export async function toggleShoppingListItem(
  listId: string,
  item: ShoppingListItem,
) {
  const action = item.isCompleted ? 'uncomplete' : 'complete';
  const { data } = await api.patch<ShoppingListItem>(
    `/api/shopping-lists/${listId}/items/${item.id}/${action}`,
  );
  return data;
}
```

### Cuidados com loading/error states

- Carregamento inicial: usar loading separado para `GET /api/shopping-lists` e `GET /api/shopping-lists/{id}`.
- Criacao de item: desabilitar formulario durante `POST` para evitar envios duplicados.
- Toggle de comprado: manter loading por item para nao bloquear a tela toda.
- Delete: pode remover otimisticamente e restaurar em caso de erro, ou aguardar `204`.
- Erros de API: ler `message` do corpo quando existir.
- `404` em detalhe: exibir estado de lista nao encontrada e oferecer retorno para tela de listas.
- Campos opcionais: enviar `quantity` e `unit` como `null` ou omitir; evitar string vazia em `unit` se a UI puder normalizar antes.

### Cuidados com CORS

- Em desenvolvimento, a API aceita apenas `http://localhost:5173`.
- Se o Vite subir em outra porta, atualize a origem permitida em `Program.cs`.
- Para Docker da API com frontend local, use `VITE_API_BASE_URL=http://localhost:8080`; a origem do browser continua sendo `http://localhost:5173`, que esta permitida.

