namespace YouInControl.Application.Mercado.Dtos;

public sealed record ShoppingListItemResponse(
    Guid Id,
    Guid ShoppingListId,
    string Description,
    decimal Quantity,
    int Order,
    bool IsCompleted,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime? CompletedAt);
