using YouInControl.Domain.Common;

namespace YouInControl.Domain.Mercado;

public sealed class ShoppingListItem
{
    private ShoppingListItem()
    {
    }

    internal ShoppingListItem(Guid shoppingListId, string name, decimal? quantity, string? unit)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Item name is required.");
        }

        Id = Guid.NewGuid();
        ShoppingListId = shoppingListId;
        Name = name.Trim();
        Quantity = quantity;
        Unit = string.IsNullOrWhiteSpace(unit) ? null : unit.Trim();
        IsCompleted = false;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public Guid ShoppingListId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public decimal? Quantity { get; private set; }
    public string? Unit { get; private set; }
    public bool IsCompleted { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }

    public void Complete()
    {
        if (IsCompleted)
        {
            return;
        }

        IsCompleted = true;
        CompletedAt = DateTime.UtcNow;
        Touch();
    }

    public void Uncomplete()
    {
        if (!IsCompleted)
        {
            return;
        }

        IsCompleted = false;
        CompletedAt = null;
        Touch();
    }

    private void Touch()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}
