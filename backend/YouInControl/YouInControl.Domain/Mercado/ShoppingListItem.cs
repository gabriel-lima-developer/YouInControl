using YouInControl.Domain.Common;

namespace YouInControl.Domain.Mercado;

public sealed class ShoppingListItem {
    private const int MaxDescriptionLength = 200;

    private ShoppingListItem() {
    }

    internal ShoppingListItem(Guid shoppingListId, string description, decimal quantity, int order) {
        Id = Guid.NewGuid();
        ShoppingListId = shoppingListId;
        Description = NormalizeDescription(description);
        Quantity = NormalizeQuantity(quantity);
        Order = NormalizeOrder(order);
        IsCompleted = false;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public Guid ShoppingListId { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public decimal Quantity { get; private set; }
    public int Order { get; private set; }
    public bool IsCompleted { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }

    public void Update(string description, decimal quantity) {
        Description = NormalizeDescription(description);
        Quantity = NormalizeQuantity(quantity);
        Touch();
    }

    public void UpdateOrder(int order) {
        Order = NormalizeOrder(order);
        Touch();
    }

    public void Complete() {
        if (IsCompleted) {
            return;
        }

        IsCompleted = true;
        CompletedAt = DateTime.UtcNow;
        Touch();
    }

    public void Uncomplete() {
        if (!IsCompleted) {
            return;
        }

        IsCompleted = false;
        CompletedAt = null;
        Touch();
    }

    private void Touch() {
        UpdatedAt = DateTime.UtcNow;
    }

    private static string NormalizeDescription(string description) {
        if (string.IsNullOrWhiteSpace(description)) {
            throw new DomainException("Item description is required.");
        }

        var normalizedDescription = description.Trim();

        if (normalizedDescription.Length > MaxDescriptionLength) {
            throw new DomainException($"Item description must have at most {MaxDescriptionLength} characters.");
        }

        return normalizedDescription;
    }

    private static decimal NormalizeQuantity(decimal quantity) {
        if (quantity <= 0) {
            throw new DomainException("Item quantity must be greater than zero.");
        }

        return quantity;
    }

    private static int NormalizeOrder(int order) {
        if (order <= 0) {
            throw new DomainException("Item order must be greater than zero.");
        }

        return order;
    }
}
