using Microsoft.AspNetCore.Mvc;
using YouInControl.Application.Common;
using YouInControl.Application.Mercado.Dtos;
using YouInControl.Application.Mercado.Services;

namespace YouInControl.Api.Controllers;

[ApiController]
[Route("api/shopping-lists")]
public sealed class ShoppingListsController : ControllerBase
{
    private readonly IShoppingListService _shoppingListService;

    public ShoppingListsController(IShoppingListService shoppingListService)
    {
        _shoppingListService = shoppingListService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ShoppingListSummaryResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ShoppingListSummaryResponse>> Create(
        CreateShoppingListRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.CreateAsync(request, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<ShoppingListSummaryResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<ShoppingListSummaryResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var shoppingLists = await _shoppingListService.GetAllAsync(cancellationToken);

        return Ok(shoppingLists);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ShoppingListDetailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListDetailResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.GetByIdAsync(id, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    [HttpPost("{id:guid}/items")]
    [ProducesResponseType(typeof(ShoppingListItemResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListItemResponse>> AddItem(
        Guid id,
        CreateShoppingListItemRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.AddItemAsync(id, request, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return CreatedAtAction(nameof(GetById), new { id }, result.Value);
    }

    [HttpPatch("{id:guid}/items/{itemId:guid}/complete")]
    [ProducesResponseType(typeof(ShoppingListItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListItemResponse>> CompleteItem(
        Guid id,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.CompleteItemAsync(id, itemId, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    [HttpPatch("{id:guid}/items/{itemId:guid}/uncomplete")]
    [ProducesResponseType(typeof(ShoppingListItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListItemResponse>> UncompleteItem(
        Guid id,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.UncompleteItemAsync(id, itemId, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}/items/{itemId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteItem(Guid id, Guid itemId, CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.DeleteItemAsync(id, itemId, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return NoContent();
    }

    private ActionResult ToErrorResult<T>(AppResult<T> result)
    {
        return result.ErrorType switch
        {
            AppErrorType.Validation => BadRequest(new { message = result.Error }),
            AppErrorType.NotFound => NotFound(new { message = result.Error }),
            _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = "Unexpected error." })
        };
    }

    private ActionResult ToErrorResult(AppResult result)
    {
        return result.ErrorType switch
        {
            AppErrorType.Validation => BadRequest(new { message = result.Error }),
            AppErrorType.NotFound => NotFound(new { message = result.Error }),
            _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = "Unexpected error." })
        };
    }
}
