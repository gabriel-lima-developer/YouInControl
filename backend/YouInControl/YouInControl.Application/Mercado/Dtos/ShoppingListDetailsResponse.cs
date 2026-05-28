using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Dtos;

public sealed record ShoppingListDetailsResponse(
    Guid Id,
    string Name,
    ShoppingListStatus Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IReadOnlyCollection<ShoppingListItemResponse> Items);
