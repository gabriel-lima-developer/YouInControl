# Arquitetura do BFF YouInControl

## Visao geral

O YouInControl e um monorepo com frontend React e BFF .NET. O piloto atual do BFF atende o modulo Mercado, oferecendo endpoints REST para listas de compras e itens.

## Objetivo do BFF

O BFF concentra a entrada HTTP do frontend, aplica contratos de API estaveis, chama casos de uso da camada Application e isola o frontend de detalhes de dominio e persistencia.

## Stack tecnica

- .NET 10 e ASP.NET Core Web API
- Entity Framework Core com PostgreSQL
- Swagger/OpenAPI via Swashbuckle
- Docker Compose para ambiente local
- Serilog para logs

## Estrutura da solucao

- `YouInControl.Api`: controllers, Swagger, CORS, exception handling e configuracao HTTP.
- `YouInControl.Application`: DTOs, servicos de aplicacao, validacoes de caso de uso e contratos de repositorio.
- `YouInControl.Domain`: entidades, enums e regras de negocio.
- `YouInControl.Infrastructure`: EF Core, migrations, mapeamentos e repositorios concretos.

## Clean Architecture

A direcao das dependencias e de fora para dentro:

- API depende de Application e Infrastructure para compor a aplicacao.
- Infrastructure depende de Application para implementar contratos e de Domain para mapear entidades.
- Application depende de Domain.
- Domain nao depende de nenhuma outra camada do projeto.

Controllers nao acessam `DbContext`, nao retornam entidades de dominio e nao concentram regras de negocio relevantes.

## Fluxo de uma requisicao

1. Controller recebe rota e body.
2. Controller chama `IShoppingListService`.
3. Application valida o caso de uso e chama o repositorio.
4. Domain executa regras de entidade, como quantidade maior que zero e pertencimento do item a lista.
5. Infrastructure persiste via EF Core/PostgreSQL.
6. Application retorna DTOs de response para a API.

## Controllers por recurso

O padrao adotado e controller por recurso:

- `ShoppingListsController`
- `ShoppingListItemsController`

Nao devem ser criados controllers por verbo HTTP ou por comando/query. Metodos HTTP ficam organizados dentro do controller do recurso correspondente.

## DTOs e servicos

O projeto nao usa MediatR/CQRS neste momento. Novas funcionalidades devem seguir o padrao atual:

- DTOs em Application.
- Interface de service em Application.
- Implementacao de service em Application.
- Contratos de repositorio em Application.
- Repositorios concretos em Infrastructure.

## Validacao e erros

Validacoes de entrada e regras simples de caso de uso ficam na Application/Domain. Controllers apenas traduzem `AppResult` para HTTP.

Padrao atual:

- `400 Bad Request` para validacao.
- `404 Not Found` para recurso inexistente.
- `204 No Content` para exclusoes.
- `500 Internal Server Error` pelo middleware de exception handling.

Erros tratados usam o formato:

```json
{
  "message": "Mensagem do erro"
}
```

## Autenticacao e autorizacao

JWT Bearer e a direcao escolhida, mas ainda nao foi implementado. Enquanto nao houver emissao de tokens e configuracao completa de autorizacao, os endpoints permanecem sem `[Authorize]`. A decisao e as pendencias estao registradas em `docs/adr/0003-use-jwt-bearer-authentication.md`.

## Persistencia

A persistencia usa EF Core e PostgreSQL. Alteracoes estruturais devem ser feitas por migrations controladas, sem recriar banco ou apagar dados manualmente. O piloto mapeia `ShoppingListItem.Description` para a coluna existente `name` para evitar renomeacao desnecessaria.

## Documentacao de endpoints

Endpoints devem ter documentacao em `docs/api/`, incluindo metodo, rota, autenticacao, request, response, status codes, exemplos e regras relevantes. O Swagger deve refletir DTOs publicos e status codes.

## Como criar novas funcionalidades

1. Definir o recurso e suas rotas REST.
2. Criar controller por recurso.
3. Criar DTOs de request/response na Application.
4. Implementar casos de uso em service de Application.
5. Colocar regras de entidade no Domain.
6. Persistir via contratos de repositorio e Infrastructure.
7. Criar migration quando houver mudanca estrutural.
8. Documentar endpoints e ADRs quando houver decisao arquitetural.
