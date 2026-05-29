using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YouInControl.Domain.Mercado;

namespace YouInControl.Infrastructure.Persistence.Configurations;

internal sealed class ShoppingListConfiguration : IEntityTypeConfiguration<ShoppingList> {
    public void Configure(EntityTypeBuilder<ShoppingList> builder) {
        builder.ToTable("shopping_lists");

        builder.HasKey(shoppingList => shoppingList.Id);

        builder.Property(shoppingList => shoppingList.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(shoppingList => shoppingList.Title)
            .HasColumnName("title")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(shoppingList => shoppingList.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(shoppingList => shoppingList.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(shoppingList => shoppingList.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasMany(shoppingList => shoppingList.Items)
            .WithOne()
            .HasForeignKey(item => item.ShoppingListId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(shoppingList => shoppingList.Items)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
