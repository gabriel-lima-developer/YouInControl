namespace YouInControl.Application.Mercado.Dtos;

public sealed record ReorderShoppingListItemRequest(
    Guid ItemId,
    int Order);
