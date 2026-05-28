namespace YouInControl.Application.Mercado.Dtos;

public sealed record ReorderShoppingListItemsRequest(
    IReadOnlyCollection<ReorderShoppingListItemRequest> Items);
