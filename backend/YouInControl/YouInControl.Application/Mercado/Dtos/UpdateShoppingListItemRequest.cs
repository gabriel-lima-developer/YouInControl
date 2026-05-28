namespace YouInControl.Application.Mercado.Dtos;

public sealed record UpdateShoppingListItemRequest(
    string Description,
    decimal Quantity);
