using Microsoft.EntityFrameworkCore;
using YouInControl.Application.Mercado.Repositories;
using YouInControl.Domain.Mercado;
using YouInControl.Infrastructure.Persistence;

namespace YouInControl.Infrastructure.Mercado.Repositories;

public sealed class ShoppingListRepository : IShoppingListRepository
{
    private readonly YouInControlDbContext _dbContext;

    public ShoppingListRepository(YouInControlDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(ShoppingList shoppingList, CancellationToken cancellationToken)
    {
        await _dbContext.ShoppingLists.AddAsync(shoppingList, cancellationToken);
    }

    public async Task<IReadOnlyCollection<ShoppingList>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.ShoppingLists
            .AsNoTracking()
            .OrderByDescending(shoppingList => shoppingList.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<ShoppingList?> GetByIdAsync(
        Guid id,
        bool includeItems,
        CancellationToken cancellationToken)
    {
        var query = _dbContext.ShoppingLists.AsQueryable();

        if (includeItems)
        {
            query = query.Include(shoppingList => shoppingList.Items);
        }

        return await query.SingleOrDefaultAsync(shoppingList => shoppingList.Id == id, cancellationToken);
    }

    public void Delete(ShoppingList shoppingList)
    {
        _dbContext.ShoppingLists.Remove(shoppingList);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
