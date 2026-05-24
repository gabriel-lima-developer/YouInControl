using YouInControl.Application.Common;
using YouInControl.Application.Mercado.Dtos;
using YouInControl.Application.Mercado.Repositories;
using YouInControl.Domain.Common;
using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Services;

public sealed class ShoppingListService : IShoppingListService
{
    private const string ListNotFoundMessage = "Shopping list was not found.";
    private const string ItemNotFoundInListMessage = "Shopping list item was not found in the informed list.";

    private readonly IShoppingListRepository _repository;

    public ShoppingListService(IShoppingListRepository repository)
    {
        _repository = repository;
    }

    public async Task<AppResult<ShoppingListSummaryResponse>> CreateAsync(
        CreateShoppingListRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var shoppingList = new ShoppingList(request.Title);

            await _repository.AddAsync(shoppingList, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            return AppResult<ShoppingListSummaryResponse>.Success(ToSummaryResponse(shoppingList));
        }
        catch (DomainException ex)
        {
            return AppResult<ShoppingListSummaryResponse>.Validation(ex.Message);
        }
    }

    public async Task<IReadOnlyCollection<ShoppingListSummaryResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var shoppingLists = await _repository.GetAllAsync(cancellationToken);

        return shoppingLists
            .Select(ToSummaryResponse)
            .ToList();
    }

    public async Task<AppResult<ShoppingListDetailResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(id, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<ShoppingListDetailResponse>.NotFound(ListNotFoundMessage);
        }

        return AppResult<ShoppingListDetailResponse>.Success(ToDetailResponse(shoppingList));
    }

    public async Task<AppResult<ShoppingListItemResponse>> AddItemAsync(
        Guid shoppingListId,
        CreateShoppingListItemRequest request,
        CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(shoppingListId, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<ShoppingListItemResponse>.NotFound(ListNotFoundMessage);
        }

        try
        {
            var item = shoppingList.AddItem(request.Name, request.Quantity, request.Unit);

            await _repository.SaveChangesAsync(cancellationToken);

            return AppResult<ShoppingListItemResponse>.Success(ToItemResponse(item));
        }
        catch (DomainException ex)
        {
            return AppResult<ShoppingListItemResponse>.Validation(ex.Message);
        }
    }

    public async Task<AppResult<ShoppingListItemResponse>> CompleteItemAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(shoppingListId, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<ShoppingListItemResponse>.NotFound(ListNotFoundMessage);
        }

        if (!shoppingList.Items.Any(item => item.Id == itemId))
        {
            return AppResult<ShoppingListItemResponse>.NotFound(ItemNotFoundInListMessage);
        }

        var completedItem = shoppingList.CompleteItem(itemId);
        await _repository.SaveChangesAsync(cancellationToken);

        return AppResult<ShoppingListItemResponse>.Success(ToItemResponse(completedItem));
    }

    public async Task<AppResult<ShoppingListItemResponse>> UncompleteItemAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(shoppingListId, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<ShoppingListItemResponse>.NotFound(ListNotFoundMessage);
        }

        if (!shoppingList.Items.Any(item => item.Id == itemId))
        {
            return AppResult<ShoppingListItemResponse>.NotFound(ItemNotFoundInListMessage);
        }

        var uncompletedItem = shoppingList.UncompleteItem(itemId);
        await _repository.SaveChangesAsync(cancellationToken);

        return AppResult<ShoppingListItemResponse>.Success(ToItemResponse(uncompletedItem));
    }

    public async Task<AppResult> DeleteItemAsync(Guid shoppingListId, Guid itemId, CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(shoppingListId, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult.NotFound(ListNotFoundMessage);
        }

        if (!shoppingList.Items.Any(item => item.Id == itemId))
        {
            return AppResult.NotFound(ItemNotFoundInListMessage);
        }

        shoppingList.RemoveItem(itemId);
        await _repository.SaveChangesAsync(cancellationToken);

        return AppResult.Success();
    }

    private static ShoppingListSummaryResponse ToSummaryResponse(ShoppingList shoppingList)
    {
        return new ShoppingListSummaryResponse(
            shoppingList.Id,
            shoppingList.Title,
            shoppingList.Status,
            shoppingList.CreatedAt,
            shoppingList.UpdatedAt);
    }

    private static ShoppingListDetailResponse ToDetailResponse(ShoppingList shoppingList)
    {
        return new ShoppingListDetailResponse(
            shoppingList.Id,
            shoppingList.Title,
            shoppingList.Status,
            shoppingList.CreatedAt,
            shoppingList.UpdatedAt,
            shoppingList.Items
                .OrderBy(item => item.CreatedAt)
                .Select(ToItemResponse)
                .ToList());
    }

    private static ShoppingListItemResponse ToItemResponse(ShoppingListItem item)
    {
        return new ShoppingListItemResponse(
            item.Id,
            item.ShoppingListId,
            item.Name,
            item.Quantity,
            item.Unit,
            item.IsCompleted,
            item.CreatedAt,
            item.UpdatedAt,
            item.CompletedAt);
    }
}
