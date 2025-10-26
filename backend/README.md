# Region Management API

A .NET 9.0 Web API project for managing regions and states. This backend service provides RESTful endpoints for creating, reading, updating, and deleting region information.

## Technologies Used

- .NET 9.0
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Swagger/OpenAPI
- xUnit (for testing)

## Prerequisites

- .NET 9.0 SDK
- PostgreSQL database server
- An IDE (Visual Studio, VS Code, etc.)

## Project Structure

```
backend/
├── Controllers/         # API controllers
├── Data/               # Database context and migrations
├── DTOs/               # Data Transfer Objects
├── Middleware/         # Custom middleware components
├── Models/             # Domain models
├── Services/           # Business logic services
└── Properties/         # Application settings
```

## Features

- Complete CRUD operations for regions
- Error handling middleware
- Swagger documentation
- Database migrations
- Dependency injection
- CORS support
- Unit tests

## Getting Started

1. Clone the repository
2. Update the connection string in `appsettings.json`
3. Run database migrations:
   ```
   dotnet ef database update
   ```
4. Run the application:
   ```
   dotnet run
   ```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:5232/swagger
```

## Testing

The project includes comprehensive unit tests. To run the tests:

```bash
dotnet test
```

## Configuration

The application can be configured through `appsettings.json` and `appsettings.Development.json`. Key configuration items include:

- Database connection string
- CORS settings
- Logging configuration

## Error Handling

The application includes a global error handling middleware that provides consistent error responses across the API.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For more information, visit the [GitHub repository](https://github.com/richardags/dotnet-vue-region-system).