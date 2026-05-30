using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Dtos;

public sealed record UpdateShoppingListItemRequest(
    string Description,
    decimal? Quantity,
    ShoppingListItemUnitOfMeasure? UnitOfMeasure);
