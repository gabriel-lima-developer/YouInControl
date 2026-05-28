using Microsoft.AspNetCore.Mvc;
using YouInControl.Application.Mercado.Dtos;
using YouInControl.Application.Mercado.Services;

namespace YouInControl.Api.Controllers;

[ApiController]
[Route("api/shopping-lists/{shoppingListId:guid}/items")]
public sealed class ShoppingListItemsController : ApiControllerBase
{
    private readonly IShoppingListService _shoppingListService;

    public ShoppingListItemsController(IShoppingListService shoppingListService)
    {
        _shoppingListService = shoppingListService;
    }

    /// <summary>Lista os itens de uma lista de compras.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<ShoppingListItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyCollection<ShoppingListItemResponse>>> GetAll(
        Guid shoppingListId,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.GetItemsAsync(shoppingListId, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    /// <summary>Consulta um item de uma lista de compras.</summary>
    [HttpGet("{itemId:guid}")]
    [ProducesResponseType(typeof(ShoppingListItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListItemResponse>> GetById(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.GetItemByIdAsync(shoppingListId, itemId, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    /// <summary>Cria um item em uma lista de compras.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ShoppingListItemResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListItemResponse>> Create(
        Guid shoppingListId,
        [FromBody] CreateShoppingListItemRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.AddItemAsync(shoppingListId, request, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return CreatedAtAction(
            nameof(GetById),
            new { shoppingListId, itemId = result.Value!.Id },
            result.Value);
    }

    /// <summary>Atualiza um item de uma lista de compras.</summary>
    [HttpPut("{itemId:guid}")]
    [ProducesResponseType(typeof(ShoppingListItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListItemResponse>> Update(
        Guid shoppingListId,
        Guid itemId,
        [FromBody] UpdateShoppingListItemRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.UpdateItemAsync(shoppingListId, itemId, request, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    /// <summary>Remove um item de uma lista de compras.</summary>
    [HttpDelete("{itemId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.DeleteItemAsync(shoppingListId, itemId, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return NoContent();
    }

    /// <summary>Marca um item como concluido.</summary>
    [HttpPatch("{itemId:guid}/complete")]
    [ProducesResponseType(typeof(ShoppingListItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListItemResponse>> Complete(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.CompleteItemAsync(shoppingListId, itemId, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    /// <summary>Marca um item como nao concluido.</summary>
    [HttpPatch("{itemId:guid}/uncomplete")]
    [ProducesResponseType(typeof(ShoppingListItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListItemResponse>> Uncomplete(
        Guid shoppingListId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.UncompleteItemAsync(shoppingListId, itemId, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    /// <summary>Reordena itens dentro da lista de compras informada.</summary>
    [HttpPatch("reorder")]
    [ProducesResponseType(typeof(IReadOnlyCollection<ShoppingListItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyCollection<ShoppingListItemResponse>>> Reorder(
        Guid shoppingListId,
        [FromBody] ReorderShoppingListItemsRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.ReorderItemsAsync(shoppingListId, request, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }
}
