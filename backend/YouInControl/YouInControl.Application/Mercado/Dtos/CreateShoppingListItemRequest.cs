namespace YouInControl.Application.Mercado.Dtos;

public sealed record CreateShoppingListItemRequest(
    string Name,
    decimal? Quantity,
    string? Unit);
