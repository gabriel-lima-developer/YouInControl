using Microsoft.Extensions.DependencyInjection;
using YouInControl.Application.Mercado.Services;

namespace YouInControl.Application;

public static class DependencyInjection {
    public static IServiceCollection AddApplication(this IServiceCollection services) {
        services.AddScoped<IShoppingListService, ShoppingListService>();

        return services;
    }
}
