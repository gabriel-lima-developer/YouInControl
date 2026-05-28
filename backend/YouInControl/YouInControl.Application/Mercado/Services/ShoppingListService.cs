using Microsoft.Extensions.Logging;
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
    private readonly ILogger<ShoppingListService> _logger;

    public ShoppingListService(
        IShoppingListRepository repository,
        ILogger<ShoppingListService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<AppResult<ShoppingListResponse>> CreateAsync(
        CreateShoppingListRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var shoppingList = new ShoppingList(request.Name);

            await _repository.AddAsync(shoppingList, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            return AppResult<ShoppingListResponse>.Success(ToResponse(shoppingList));
        }
        catch (DomainException ex)
        {
            return AppResult<ShoppingListResponse>.Validation(ex.Message);
        }
    }

    public async Task<IReadOnlyCollection<ShoppingListResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var shoppingLists = await _repository.GetAllAsync(cancellationToken);

        return shoppingLists
            .Select(ToResponse)
            .ToList();
    }

    public async Task<AppResult<ShoppingListDetailsResponse>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(id, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<ShoppingListDetailsResponse>.NotFound(ListNotFoundMessage);
        }

        return AppResult<ShoppingListDetailsResponse>.Success(ToDetailsResponse(shoppingList));
    }

    public async Task<AppResult<ShoppingListResponse>> UpdateAsync(
        Guid id,
        UpdateShoppingListRequest request,
        CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(id, includeItems: false, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<ShoppingListResponse>.NotFound(ListNotFoundMessage);
        }

        try
        {
            shoppingList.Update(request.Name);
            await _repository.SaveChangesAsync(cancellationToken);

            return AppResult<ShoppingListResponse>.Success(ToResponse(shoppingList));
        }
        catch (DomainException ex)
        {
            return AppResult<ShoppingListResponse>.Validation(ex.Message);
        }
    }

    public async Task<AppResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(id, includeItems: false, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult.NotFound(ListNotFoundMessage);
        }

        _repository.Delete(shoppingList);
        await _repository.SaveChangesAsync(cancellationToken);

        return AppResult.Success();
    }

    public async Task<AppResult<IReadOnlyCollection<ShoppingListItemResponse>>> GetItemsAsync(
        Guid shoppingListId,
        CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(shoppingListId, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<IReadOnlyCollection<ShoppingListItemResponse>>.NotFound(ListNotFoundMessage);
        }

        return AppResult<IReadOnlyCollection<ShoppingListItemResponse>>.Success(ToItemResponses(shoppingList));
    }

    public async Task<AppResult<ShoppingListItemResponse>> GetItemByIdAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var shoppingList = await _repository.GetByIdAsync(shoppingListId, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<ShoppingListItemResponse>.NotFound(ListNotFoundMessage);
        }

        var item = shoppingList.Items.SingleOrDefault(item => item.Id == itemId);

        if (item is null)
        {
            return AppResult<ShoppingListItemResponse>.NotFound(ItemNotFoundInListMessage);
        }

        return AppResult<ShoppingListItemResponse>.Success(ToItemResponse(item));
    }

    public async Task<AppResult<ShoppingListItemResponse>> AddItemAsync(
        Guid shoppingListId,
        CreateShoppingListItemRequest request,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Adding shopping list item. ShoppingListId: {ShoppingListId}, Description: {Description}, Quantity: {Quantity}",
            shoppingListId,
            request.Description,
            request.Quantity);

        var shoppingList = await _repository.GetByIdAsync(shoppingListId, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<ShoppingListItemResponse>.NotFound(ListNotFoundMessage);
        }

        try
        {
            var item = shoppingList.AddItem(request.Description, request.Quantity);

            await _repository.SaveChangesAsync(cancellationToken);

            return AppResult<ShoppingListItemResponse>.Success(ToItemResponse(item));
        }
        catch (DomainException ex)
        {
            return AppResult<ShoppingListItemResponse>.Validation(ex.Message);
        }
    }

    public async Task<AppResult<ShoppingListItemResponse>> UpdateItemAsync(
        Guid shoppingListId,
        Guid itemId,
        UpdateShoppingListItemRequest request,
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

        try
        {
            var item = shoppingList.UpdateItem(itemId, request.Description, request.Quantity);
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
        return await ChangeItemCompletionAsync(
            shoppingListId,
            itemId,
            complete: true,
            cancellationToken);
    }

    public async Task<AppResult<ShoppingListItemResponse>> UncompleteItemAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        return await ChangeItemCompletionAsync(
            shoppingListId,
            itemId,
            complete: false,
            cancellationToken);
    }

    public async Task<AppResult> DeleteItemAsync(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
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

    public async Task<AppResult<IReadOnlyCollection<ShoppingListItemResponse>>> ReorderItemsAsync(
        Guid shoppingListId,
        ReorderShoppingListItemsRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Items is null)
        {
            return AppResult<IReadOnlyCollection<ShoppingListItemResponse>>.Validation(
                "Shopping list item reorder request is required.");
        }

        var shoppingList = await _repository.GetByIdAsync(shoppingListId, includeItems: true, cancellationToken);

        if (shoppingList is null)
        {
            return AppResult<IReadOnlyCollection<ShoppingListItemResponse>>.NotFound(ListNotFoundMessage);
        }

        try
        {
            shoppingList.ReorderItems(
                request.Items
                    .Select(item => (item.ItemId, item.Order))
                    .ToList());

            await _repository.SaveChangesAsync(cancellationToken);

            return AppResult<IReadOnlyCollection<ShoppingListItemResponse>>.Success(ToItemResponses(shoppingList));
        }
        catch (DomainException ex)
        {
            return AppResult<IReadOnlyCollection<ShoppingListItemResponse>>.Validation(ex.Message);
        }
    }

    private async Task<AppResult<ShoppingListItemResponse>> ChangeItemCompletionAsync(
        Guid shoppingListId,
        Guid itemId,
        bool complete,
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

        var item = complete
            ? shoppingList.CompleteItem(itemId)
            : shoppingList.UncompleteItem(itemId);

        await _repository.SaveChangesAsync(cancellationToken);

        return AppResult<ShoppingListItemResponse>.Success(ToItemResponse(item));
    }

    private static ShoppingListResponse ToResponse(ShoppingList shoppingList)
    {
        return new ShoppingListResponse(
            shoppingList.Id,
            shoppingList.Title,
            shoppingList.Status,
            shoppingList.CreatedAt,
            shoppingList.UpdatedAt);
    }

    private static ShoppingListDetailsResponse ToDetailsResponse(ShoppingList shoppingList)
    {
        return new ShoppingListDetailsResponse(
            shoppingList.Id,
            shoppingList.Title,
            shoppingList.Status,
            shoppingList.CreatedAt,
            shoppingList.UpdatedAt,
            ToItemResponses(shoppingList));
    }

    private static IReadOnlyCollection<ShoppingListItemResponse> ToItemResponses(ShoppingList shoppingList)
    {
        return shoppingList.Items
            .OrderBy(item => item.Order)
            .ThenBy(item => item.CreatedAt)
            .Select(ToItemResponse)
            .ToList();
    }

    private static ShoppingListItemResponse ToItemResponse(ShoppingListItem item)
    {
        return new ShoppingListItemResponse(
            item.Id,
            item.ShoppingListId,
            item.Description,
            item.Quantity,
            item.Order,
            item.IsCompleted,
            item.CreatedAt,
            item.UpdatedAt,
            item.CompletedAt);
    }
}
