FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "backend/backend.csproj"
COPY . .
WORKDIR "/src/backend"
RUN dotnet build "backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

# Build migration bundle
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet ef migrations bundle --configuration Release -o /app/efbundle

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=publish /app/efbundle ./efbundle

# Install PostgreSQL client and jq for JSON processing
RUN apt-get update && \
    apt-get install -y postgresql-client jq && \
    chmod +x ./efbundle

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5232
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ConnectionStrings__DefaultConnection="Host=postgres-db;Port=5432;Database=regiondb;Username=postgres;Password=postgres"

EXPOSE 5232

# Create and setup entrypoint script
RUN echo '#!/bin/sh\n\
./efbundle\n\
dotnet backend.dll' > /app/entrypoint.sh && \
chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]