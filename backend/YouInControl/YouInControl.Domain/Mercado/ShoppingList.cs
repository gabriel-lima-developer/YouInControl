using YouInControl.Domain.Common;

namespace YouInControl.Domain.Mercado;

public sealed class ShoppingList {
    private readonly List<ShoppingListItem> _items = [];
    private const int MaxTitleLength = 200;

    private ShoppingList() {
    }

    public ShoppingList(string title) {
        if (string.IsNullOrWhiteSpace(title)) {
            throw new DomainException("Shopping list title is required.");
        }

        if (title.Trim().Length > MaxTitleLength) {
            throw new DomainException($"Shopping list title must have at most {MaxTitleLength} characters.");
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

    public void Update(string title) {
        if (string.IsNullOrWhiteSpace(title)) {
            throw new DomainException("Shopping list title is required.");
        }

        if (title.Trim().Length > MaxTitleLength) {
            throw new DomainException($"Shopping list title must have at most {MaxTitleLength} characters.");
        }

        Title = title.Trim();
        Touch();
    }

    public ShoppingListItem AddItem(string description, decimal quantity) {
        var nextOrder = _items.Count == 0 ? 1 : _items.Max(item => item.Order) + 1;
        var item = new ShoppingListItem(Id, description, quantity, nextOrder);

        _items.Add(item);
        Touch();

        return item;
    }

    public ShoppingListItem UpdateItem(Guid itemId, string description, decimal quantity) {
        var item = GetItem(itemId);
        item.Update(description, quantity);
        Touch();

        return item;
    }

    public ShoppingListItem CompleteItem(Guid itemId) {
        var item = GetItem(itemId);
        item.Complete();
        Touch();

        return item;
    }

    public ShoppingListItem UncompleteItem(Guid itemId) {
        var item = GetItem(itemId);
        item.Uncomplete();
        Touch();

        return item;
    }

    public void RemoveItem(Guid itemId) {
        var item = GetItem(itemId);

        _items.Remove(item);
        Touch();
    }

    public void ReorderItems(IReadOnlyCollection<(Guid ItemId, int Order)> itemOrders) {
        if (itemOrders.Count == 0) {
            throw new DomainException("At least one item must be informed to reorder shopping list items.");
        }

        if (itemOrders.Any(itemOrder => itemOrder.Order <= 0)) {
            throw new DomainException("Shopping list item order must be greater than zero.");
        }

        if (itemOrders.Select(itemOrder => itemOrder.ItemId).Distinct().Count() != itemOrders.Count) {
            throw new DomainException("Shopping list item reorder request contains duplicated item ids.");
        }

        if (itemOrders.Select(itemOrder => itemOrder.Order).Distinct().Count() != itemOrders.Count) {
            throw new DomainException("Shopping list item reorder request contains duplicated orders.");
        }

        foreach (var itemOrder in itemOrders) {
            var item = GetItem(itemOrder.ItemId);
            item.UpdateOrder(itemOrder.Order);
        }

        Touch();
    }

    private ShoppingListItem GetItem(Guid itemId) {
        return _items.SingleOrDefault(item => item.Id == itemId)
            ?? throw new DomainException("Shopping list item was not found in the informed list.");
    }

    private void Touch() {
        UpdatedAt = DateTime.UtcNow;
    }
}
