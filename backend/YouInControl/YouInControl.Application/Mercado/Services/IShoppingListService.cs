using YouInControl.Application.Common;
using YouInControl.Application.Mercado.Dtos;

namespace YouInControl.Application.Mercado.Services;

public interface IShoppingListService
{
    Task<AppResult<ShoppingListSummaryResponse>> CreateAsync(
        CreateShoppingListRequest request,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<ShoppingListSummaryResponse>> GetAllAsync(CancellationToken cancellationToken);

    Task<AppResult<ShoppingListDetailResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<AppResult<ShoppingListItemResponse>> AddItemAsync(
        Guid shoppingListId,
        CreateShoppingListItemRequest request,
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
}
