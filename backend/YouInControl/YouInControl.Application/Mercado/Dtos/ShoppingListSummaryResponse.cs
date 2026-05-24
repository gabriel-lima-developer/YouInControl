using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Dtos;

public sealed record ShoppingListSummaryResponse(
    Guid Id,
    string Title,
    ShoppingListStatus Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
