using Microsoft.EntityFrameworkCore;
using YouInControl.Domain.Mercado;

namespace YouInControl.Infrastructure.Persistence;

public sealed class YouInControlDbContext : DbContext
{
    public YouInControlDbContext(DbContextOptions<YouInControlDbContext> options)
        : base(options)
    {
    }

    public DbSet<ShoppingList> ShoppingLists => Set<ShoppingList>();
    public DbSet<ShoppingListItem> ShoppingListItems => Set<ShoppingListItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(YouInControlDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
