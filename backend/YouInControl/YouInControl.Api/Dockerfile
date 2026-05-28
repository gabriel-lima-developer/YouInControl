FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["YouInControl.Api/YouInControl.Api.csproj", "YouInControl.Api/"]
COPY ["YouInControl.Application/YouInControl.Application.csproj", "YouInControl.Application/"]
COPY ["YouInControl.Domain/YouInControl.Domain.csproj", "YouInControl.Domain/"]
COPY ["YouInControl.Infrastructure/YouInControl.Infrastructure.csproj", "YouInControl.Infrastructure/"]
RUN dotnet restore "YouInControl.Api/YouInControl.Api.csproj"

COPY . .
WORKDIR "/src/YouInControl.Api"
RUN dotnet publish "YouInControl.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "YouInControl.Api.dll"]
