using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace YouInControl.Infrastructure.Persistence;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<YouInControlDbContext> {
    public YouInControlDbContext CreateDbContext(string[] args) {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=youincontrol;Username=youincontrol;Password=youincontrol";

        var options = new DbContextOptionsBuilder<YouInControlDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new YouInControlDbContext(options);
    }
}
