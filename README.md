# Region Management System

A full-stack Region Management System built with ASP.NET Core and Vue.js. This application provides a complete CRUD interface for managing regions across U.S. states, allowing users to create, edit, activate, and inactivate regions while ensuring data consistency and validation.

## 🚀 Technology Stack

### Backend
- **.NET 9.0** - Latest version of .NET framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **PostgreSQL** - Database
- **Swagger/OpenAPI** - API documentation
- **xUnit** - Testing framework

### Frontend
- **Vue.js 3.5** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Vite** - Build tool and development server
- **Vitest** - Unit testing framework
- **ESLint & Prettier** - Code quality and formatting

## 🛠 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🏃‍♂️ Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/richardags/dotnet-vue-region-system.git
   cd dotnet-vue-region-system
   ```

2. Start the application using Docker Compose:
   ```bash
   docker compose up --build
   ```

   This will:
   - Build and start the backend API (port 5232)
   - Build and start the frontend application (port 5173)
   - Start a PostgreSQL database (port 5432)

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5232
   - Swagger UI: http://localhost:5232/swagger (only available in Development environment)

### Development Mode

To access Swagger UI and API documentation, you'll need to run the backend in Development mode. You can do this by:

1. Modifying the `docker-compose.yml`:
   ```yaml
   backend:
     environment:
       - ASPNETCORE_ENVIRONMENT=Development
   ```

2. Or running the backend locally:
   ```bash
   cd backend/backend
   dotnet run
   ```

## 🏗 Project Structure

```
.
├── backend/                 # .NET Backend
│   ├── Controllers/        # API endpoints
│   ├── Services/           # Business logic
│   ├── Models/            # Domain models
│   ├── DTOs/              # Data transfer objects
│   ├── Data/              # Database context and migrations
│   └── Middleware/        # Custom middleware
├── frontend/               # Vue.js Frontend
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── views/         # Page components
│   │   ├── stores/        # Pinia stores
│   │   ├── services/      # API services
│   │   ├── composables/   # Vue composables
│   │   └── types/         # TypeScript types
│   └── tests/             # Frontend tests
└── docker-compose.yml      # Docker configuration
```

## 🔧 Configuration

The application uses Docker environment variables for configuration:

### Backend
- Database connection string (PostgreSQL)
- ASPNET environment settings
- API port configuration

### Frontend
- API endpoint configuration
- Development server settings

## 🧪 Testing

Both the backend and frontend include comprehensive test suites:

### Backend Tests
```bash
cd backend
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm run test:unit
```

## 📝 Features

- Complete CRUD operations for regions
- Region activation/deactivation
- Data validation and error handling
- Responsive user interface
- Real-time updates
- Sortable region list
- Confirmation dialogs for critical actions
- Loading indicators for async operations

## 🔒 Security

- Input validation
- Error handling middleware
- Secure database connections
- Production-ready configurations

## 📦 Docker Support

The application is fully containerized with Docker, including:
- Multi-container setup with Docker Compose
- Production-ready Dockerfile configurations
- Volume persistence for database
- Health checks for database
- Container networking
- Environment-specific configurations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

[MIT License](LICENSE)