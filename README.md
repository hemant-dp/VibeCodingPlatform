# Vibe Coding Platform

A modern coding platform similar to HackerRank/LeetCode, built with Spring Boot and Angular.

## Features

- User Authentication with JWT
- Problem Listing and Details
- Code Submission and Evaluation
- User Dashboard
- Admin Interface for Problem Management

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.2
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- Angular 17
- Angular Material
- TailwindCSS
- TypeScript

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.8 or higher

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure MySQL database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/vibe_coding_platform
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Build and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The backend server will start on http://localhost:8081

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

The frontend application will be available at http://localhost:4200

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8081/swagger-ui.html
- API Docs: http://localhost:8081/api-docs

## Project Structure

### Backend Structure
```
backend/
├── src/main/java/com/vibe/platform/
│   ├── controller/     # REST controllers
│   ├── model/         # Entity classes
│   ├── repository/    # Data access layer
│   ├── service/       # Business logic
│   ├── security/      # Security configuration
│   └── dto/           # Data transfer objects
```

### Frontend Structure
```
frontend/
├── src/app/
│   ├── components/    # Angular components
│   ├── services/     # Angular services
│   ├── guards/       # Route guards
│   └── shared/       # Shared modules and components
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 