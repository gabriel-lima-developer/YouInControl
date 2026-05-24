namespace YouInControl.Application.Mercado.Dtos;

public sealed record ShoppingListItemResponse(
    Guid Id,
    Guid ShoppingListId,
    string Name,
    decimal? Quantity,
    string? Unit,
    bool IsCompleted,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime? CompletedAt);
