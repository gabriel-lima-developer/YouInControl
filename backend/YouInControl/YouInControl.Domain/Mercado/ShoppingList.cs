using YouInControl.Domain.Common;

namespace YouInControl.Domain.Mercado;

public sealed class ShoppingList
{
    private readonly List<ShoppingListItem> _items = [];

    private ShoppingList()
    {
    }

    public ShoppingList(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new DomainException("Shopping list title is required.");
        }

        Id = Guid.NewGuid();
        Title = title.Trim();
        Status = ShoppingListStatus.Active;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public ShoppingListStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public IReadOnlyCollection<ShoppingListItem> Items => _items;

    public ShoppingListItem AddItem(string name, decimal? quantity, string? unit)
    {
        var item = new ShoppingListItem(Id, name, quantity, unit);

        _items.Add(item);
        Touch();

        return item;
    }

    public ShoppingListItem CompleteItem(Guid itemId)
    {
        var item = GetItem(itemId);
        item.Complete();
        Touch();

        return item;
    }

    public ShoppingListItem UncompleteItem(Guid itemId)
    {
        var item = GetItem(itemId);
        item.Uncomplete();
        Touch();

        return item;
    }

    public void RemoveItem(Guid itemId)
    {
        var item = GetItem(itemId);

        _items.Remove(item);
        Touch();
    }

    private ShoppingListItem GetItem(Guid itemId)
    {
        return _items.SingleOrDefault(item => item.Id == itemId)
            ?? throw new DomainException("Shopping list item was not found in the informed list.");
    }

    private void Touch()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}
