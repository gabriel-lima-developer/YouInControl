using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Dtos;

public sealed record CreateShoppingListItemRequest(
    string Description,
    decimal? Quantity,
    ShoppingListItemUnitOfMeasure? UnitOfMeasure);
