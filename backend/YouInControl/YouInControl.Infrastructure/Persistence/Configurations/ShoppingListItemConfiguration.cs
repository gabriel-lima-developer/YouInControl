using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YouInControl.Domain.Mercado;

namespace YouInControl.Infrastructure.Persistence.Configurations;

internal sealed class ShoppingListItemConfiguration : IEntityTypeConfiguration<ShoppingListItem>
{
    public void Configure(EntityTypeBuilder<ShoppingListItem> builder)
    {
        builder.ToTable("shopping_list_items");

        builder.HasKey(item => item.Id);

        builder.Property(item => item.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(item => item.ShoppingListId)
            .HasColumnName("shopping_list_id")
            .IsRequired();

        builder.Property(item => item.Description)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(item => item.Quantity)
            .HasColumnName("quantity")
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.Property(item => item.Order)
            .HasColumnName("order")
            .IsRequired();

        builder.Property(item => item.IsCompleted)
            .HasColumnName("is_completed")
            .IsRequired();

        builder.Property(item => item.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(item => item.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(item => item.CompletedAt)
            .HasColumnName("completed_at");
    }
}
