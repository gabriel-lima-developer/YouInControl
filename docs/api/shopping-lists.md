# API - Listas de compras

Base path: `/api/shopping-lists`

Autenticacao: os endpoints ainda nao exigem token. JWT Bearer esta documentado como pendencia arquitetural.

Formato de erro tratado:

```json
{
  "message": "Mensagem do erro"
}
```

## Lista de compras

### GET `/api/shopping-lists`

Lista as listas de compras.

Response `200`:

```json
[
  {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Compras da semana",
    "status": "Active",
    "createdAt": "2026-05-28T12:00:00Z",
    "updatedAt": null
  }
]
```

### GET `/api/shopping-lists/{id}`

Consulta uma lista com seus itens ordenados por `order`.

Status codes: `200`, `404`.

Response `200`:

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "name": "Compras da semana",
  "status": "Active",
  "createdAt": "2026-05-28T12:00:00Z",
  "updatedAt": null,
  "items": [
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "shoppingListId": "11111111-1111-1111-1111-111111111111",
      "description": "Arroz",
      "quantity": 1,
      "unitOfMeasure": "Package",
      "order": 1,
      "isCompleted": false,
      "createdAt": "2026-05-28T12:05:00Z",
      "updatedAt": null,
      "completedAt": null
    }
  ]
}
```

### POST `/api/shopping-lists`

Cria uma lista de compras.

Status codes: `201`, `400`.

Request:

```json
{
  "name": "Compras da semana"
}
```

Response `201`: `ShoppingListResponse`.

Regras:

- `name` e obrigatorio.
- `name` nao pode conter apenas espacos.
- `name` tem limite de 200 caracteres.

### PUT `/api/shopping-lists/{id}`

Atualiza o nome da lista.

Status codes: `200`, `400`, `404`.

Request:

```json
{
  "name": "Compras do mes"
}
```

Response `200`: `ShoppingListResponse`.

### DELETE `/api/shopping-lists/{id}`

Exclui a lista e seus itens.

Status codes: `204`, `404`.

Response `204`: sem body.

## Itens da lista

Base path: `/api/shopping-lists/{shoppingListId}/items`

Campos funcionais do item:

- `description`
- `quantity`
- `unitOfMeasure`
- `order`
- `isCompleted`

Nao fazem parte do piloto: preco, categoria e observacao.

### GET `/api/shopping-lists/{shoppingListId}/items`

Lista itens da lista informada.

Status codes: `200`, `404`.

Response `200`: array de `ShoppingListItemResponse`.

### GET `/api/shopping-lists/{shoppingListId}/items/{itemId}`

Consulta um item da lista informada.

Status codes: `200`, `404`.

Regra: o item precisa pertencer a lista da rota.

### POST `/api/shopping-lists/{shoppingListId}/items`

Cria um item na lista informada.

Status codes: `201`, `400`, `404`.

Request:

```json
{
  "description": "Arroz",
  "quantity": 1,
  "unitOfMeasure": "Package"
}
```

Response `201`: `ShoppingListItemResponse`.

Regras:

- `description` e obrigatoria.
- `description` nao pode conter apenas espacos.
- `description` tem limite de 200 caracteres.
- `quantity` e opcional.
- `quantity`, quando informada, deve ser maior que zero.
- `unitOfMeasure` e opcional.
- `unitOfMeasure`, quando informada, aceita `Unit`, `Kg`, `Liter` ou `Package`.
- `order` e definido automaticamente como a proxima posicao da lista.

Exemplo minimo valido:

```json
{
  "description": "Arroz"
}
```

### PUT `/api/shopping-lists/{shoppingListId}/items/{itemId}`

Atualiza descricao e quantidade do item.

Status codes: `200`, `400`, `404`.

Request:

```json
{
  "description": "Arroz integral",
  "quantity": 3,
  "unitOfMeasure": "Unit"
}
```

Regras:

- `description` e obrigatoria.
- `quantity` e opcional.
- `quantity`, quando informada, deve ser maior que zero.
- `unitOfMeasure` e opcional.
- Nao e permitido alterar item de outra lista usando o id da lista atual.

### DELETE `/api/shopping-lists/{shoppingListId}/items/{itemId}`

Remove um item da lista.

Status codes: `204`, `404`.

Response `204`: sem body.

### PATCH `/api/shopping-lists/{shoppingListId}/items/{itemId}/complete`

Marca o item como concluido.

Status codes: `200`, `404`.

Response `200`: `ShoppingListItemResponse` com `isCompleted: true`.

### PATCH `/api/shopping-lists/{shoppingListId}/items/{itemId}/uncomplete`

Marca o item como nao concluido.

Status codes: `200`, `404`.

Response `200`: `ShoppingListItemResponse` com `isCompleted: false`.

### PATCH `/api/shopping-lists/{shoppingListId}/items/reorder`

Reordena itens dentro da lista informada.

Status codes: `200`, `400`, `404`.

Request:

```json
{
  "items": [
    {
      "itemId": "22222222-2222-2222-2222-222222222222",
      "order": 1
    },
    {
      "itemId": "33333333-3333-3333-3333-333333333333",
      "order": 2
    }
  ]
}
```

Response `200`: array de `ShoppingListItemResponse` reordenado.

Regras:

- A reordenacao considera somente itens da lista informada.
- `order` deve ser maior que zero.
- Nao sao aceitos ids de item duplicados.
- Nao sao aceitas posicoes duplicadas.
