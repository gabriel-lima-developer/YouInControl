using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Dtos;

public sealed record ShoppingListItemResponse(
    Guid Id,
    Guid ShoppingListId,
    string Description,
    decimal? Quantity,
    ShoppingListItemUnitOfMeasure? UnitOfMeasure,
    int Order,
    bool IsCompleted,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime? CompletedAt);
