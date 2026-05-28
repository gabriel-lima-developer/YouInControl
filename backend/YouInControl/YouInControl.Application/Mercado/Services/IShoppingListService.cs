using YouInControl.Application.Common;
using YouInControl.Application.Mercado.Dtos;

namespace YouInControl.Application.Mercado.Services;

public interface IShoppingListService
{
    Task<AppResult<ShoppingListResponse>> CreateAsync(
        CreateShoppingListRequest request,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<ShoppingListResponse>> GetAllAsync(CancellationToken cancellationToken);

    Task<AppResult<ShoppingListDetailsResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<AppResult<ShoppingListResponse>> UpdateAsync(
        Guid id,
        UpdateShoppingListRequest request,
        CancellationToken cancellationToken);

    Task<AppResult> DeleteAsync(Guid id, CancellationToken cancellationToken);

    Task<AppResult<IReadOnlyCollection<ShoppingListItemResponse>>> GetItemsAsync(
        Guid shoppingListId,
        CancellationToken cancellationToken);

    Task<AppResult<ShoppingListItemResponse>> GetItemByIdAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken);

    Task<AppResult<ShoppingListItemResponse>> AddItemAsync(
        Guid shoppingListId,
        CreateShoppingListItemRequest request,
        CancellationToken cancellationToken);

    Task<AppResult<ShoppingListItemResponse>> UpdateItemAsync(
        Guid shoppingListId,
        Guid itemId,
        UpdateShoppingListItemRequest request,
        CancellationToken cancellationToken);

    Task<AppResult<ShoppingListItemResponse>> CompleteItemAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken);

    Task<AppResult<ShoppingListItemResponse>> UncompleteItemAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken);

    Task<AppResult> DeleteItemAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken);

    Task<AppResult<IReadOnlyCollection<ShoppingListItemResponse>>> ReorderItemsAsync(
        Guid shoppingListId,
        ReorderShoppingListItemsRequest request,
        CancellationToken cancellationToken);
}
