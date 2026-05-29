using System.Diagnostics;
using System.Reflection;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Serilog;
using YouInControl.Application;
using YouInControl.Infrastructure;
using YouInControl.Infrastructure.Persistence;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    const string FrontendCorsPolicy = "Frontend";

    builder.Host.UseSerilog((context, services, configuration) =>
    {
        var logFilePath = Path.Combine(context.HostingEnvironment.ContentRootPath, "logs", "youincontrol-.log");

        configuration
            .ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Application", "YouInControl.Api")
            .WriteTo.Console()
            .WriteTo.File(
                logFilePath,
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 14,
                shared: true);
    });

    builder.Services
        .AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        var xmlFileName = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlFilePath = Path.Combine(AppContext.BaseDirectory, xmlFileName);

        if (File.Exists(xmlFilePath))
        {
            options.IncludeXmlComments(xmlFilePath);
        }
    });

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(FrontendCorsPolicy, policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });

    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    var app = builder.Build();

    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            var exceptionFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
            var exception = exceptionFeature?.Error;
            var traceId = Activity.Current?.Id ?? context.TraceIdentifier;

            if (exception is not null)
            {
                var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError(
                    exception,
                    "Unhandled exception while processing {Method} {Path}. TraceId: {TraceId}",
                    context.Request.Method,
                    context.Request.Path,
                    traceId);
            }

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new
            {
                message = "Erro inesperado no servidor.",
                traceId,
                detail = app.Environment.IsDevelopment() ? exception?.ToString() : null
            };

            await context.Response.WriteAsJsonAsync(response);
        });
    });

    app.UseSerilogRequestLogging();

    if (app.Configuration.GetValue<bool>("Database:ApplyMigrationsOnStartup")) {

        var connectionString = app.Configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString)) {
            var logger = app.Services.GetRequiredService<ILogger<Program>>();
            logger.LogWarning("Database migration skipped because DefaultConnection is not configured.");
        } else {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<YouInControlDbContext>();

            await dbContext.Database.MigrateAsync();
        }
    }

    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors(FrontendCorsPolicy);

    app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }))
        .WithName("GetHealth")
        .WithTags("Health")
        .WithSummary("Checks whether the BFF process is running.")
        .Produces(StatusCodes.Status200OK);

    app.MapControllers();

    await app.RunAsync();
}
catch (Exception ex)
{
    if (ex.GetType().Name == "HostAbortedException")
    {
        return;
    }

    Log.Fatal(ex, "Application terminated unexpectedly.");
    Environment.ExitCode = 1;
}
finally
{
    await Log.CloseAndFlushAsync();
}
