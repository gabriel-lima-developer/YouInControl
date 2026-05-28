using Microsoft.AspNetCore.Mvc;
using YouInControl.Application.Mercado.Dtos;
using YouInControl.Application.Mercado.Services;

namespace YouInControl.Api.Controllers;

[ApiController]
[Route("api/shopping-lists")]
public sealed class ShoppingListsController : ApiControllerBase
{
    private readonly IShoppingListService _shoppingListService;

    public ShoppingListsController(IShoppingListService shoppingListService)
    {
        _shoppingListService = shoppingListService;
    }

    /// <summary>Cria uma lista de compras.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ShoppingListResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ShoppingListResponse>> Create(
        [FromBody] CreateShoppingListRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.CreateAsync(request, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
    }

    /// <summary>Lista as listas de compras cadastradas.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<ShoppingListResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<ShoppingListResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var shoppingLists = await _shoppingListService.GetAllAsync(cancellationToken);

        return Ok(shoppingLists);
    }

    /// <summary>Consulta uma lista de compras com seus itens.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ShoppingListDetailsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListDetailsResponse>> GetById(
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

    /// <summary>Atualiza o nome de uma lista de compras.</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ShoppingListResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ShoppingListResponse>> Update(
        Guid id,
        [FromBody] UpdateShoppingListRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.UpdateAsync(id, request, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    /// <summary>Exclui uma lista de compras e seus itens.</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _shoppingListService.DeleteAsync(id, cancellationToken);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return NoContent();
    }
}
