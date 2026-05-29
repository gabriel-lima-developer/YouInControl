using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using YouInControl.Application.Mercado.Repositories;
using YouInControl.Infrastructure.Mercado.Repositories;
using YouInControl.Infrastructure.Persistence;

namespace YouInControl.Infrastructure;

public static class DependencyInjection {
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration) {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not configured.");

        services.AddDbContext<YouInControlDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IShoppingListRepository, ShoppingListRepository>();

        return services;
    }
}
