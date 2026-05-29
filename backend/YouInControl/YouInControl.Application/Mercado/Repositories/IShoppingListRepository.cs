using YouInControl.Domain.Mercado;

namespace YouInControl.Application.Mercado.Repositories;

public interface IShoppingListRepository {
    Task AddAsync(ShoppingList shoppingList, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<ShoppingList>> GetAllAsync(CancellationToken cancellationToken);
    Task<ShoppingList?> GetByIdAsync(Guid id, bool includeItems, CancellationToken cancellationToken);
    void Delete(ShoppingList shoppingList);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
