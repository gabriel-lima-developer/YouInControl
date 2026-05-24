using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using YouInControl.Application;
using YouInControl.Infrastructure;
using YouInControl.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Configuration.GetValue<bool>("Database:ApplyMigrationsOnStartup"))
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<YouInControlDbContext>();
    await dbContext.Database.MigrateAsync();
}

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

await app.RunAsync();
