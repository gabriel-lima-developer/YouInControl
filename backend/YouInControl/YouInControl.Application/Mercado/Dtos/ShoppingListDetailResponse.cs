using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Dtos;

public sealed record ShoppingListDetailResponse(
    Guid Id,
    string Title,
    ShoppingListStatus Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IReadOnlyCollection<ShoppingListItemResponse> Items);
