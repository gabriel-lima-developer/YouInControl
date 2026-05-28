using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Dtos;

public sealed record ShoppingListResponse(
    Guid Id,
    string Name,
    ShoppingListStatus Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
