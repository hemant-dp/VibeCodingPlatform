# VibeCodingPlatform - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Setup Instructions](#setup-instructions)
6. [API Documentation](#api-documentation)
7. [Frontend Components](#frontend-components)
8. [Backend Services](#backend-services)
9. [Database Schema](#database-schema)
10. [Error Handling](#error-handling)
11. [Troubleshooting](#troubleshooting)
12. [Future Enhancements](#future-enhancements)

---

## Project Overview

VibeCodingPlatform is a comprehensive coding practice platform built with Angular and Spring Boot. It provides users with the ability to solve coding problems, execute their solutions, and submit them for automated judging.

### Key Features
- Problem browsing and solving interface
- Multi-language support (Java, C++, Python)
- Real-time code execution
- Automated submission judging
- Error handling and feedback
- User authentication and profiles
- Responsive design

---

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Angular 17)  │◄──►│  (Spring Boot)  │◄──►│    (MySQL)      │
│                 │    │                 │    │                 │
│ - Components    │    │ - Controllers   │    │ - Problems      │
│ - Services      │    │ - Services      │    │ - Users         │
│ - Guards        │    │ - Repositories  │    │ - Submissions   │
│ - Interceptors  │    │ - Security      │    │ - Test Cases    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── landing/
│   │   │   ├── problem/
│   │   │   ├── profile/
│   │   │   ├── selection/
│   │   │   └── submission/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── shared/
│   ├── assets/
│   └── environments/

backend/
├── src/main/java/com/vibe/platform/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── model/
│   ├── repository/
│   ├── security/
│   └── service/
└── src/main/resources/
```

---

## Features

### 1. Problem Solving Interface
- **Monaco Editor Integration**: Syntax highlighting and IntelliSense
- **Language Support**: Java, C++, Python with appropriate templates
- **Line Numbers**: Visual line numbering for better code navigation
- **Auto-save**: Preserves user code during session

### 2. Code Execution
- **Run Code**: Test code against sample inputs
- **Submit Solution**: Submit for comprehensive testing
- **Real-time Feedback**: Immediate execution results
- **Error Display**: Detailed error messages with syntax highlighting

### 3. Submission System
- **Asynchronous Judging**: Background processing of submissions
- **Status Polling**: Real-time updates on submission status
- **Comprehensive Results**: Execution time, memory usage, test case results
- **Error Handling**: Detailed error messages for debugging

### 4. User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Material Design**: Modern UI components using Angular Material
- **Dark/Light Theme**: User preference support
- **Intuitive Navigation**: Easy-to-use interface design

---

## Technology Stack

### Frontend
- **Framework**: Angular 17
- **UI Library**: Angular Material
- **Styling**: Tailwind CSS + Custom CSS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Reactive Forms
- **Icons**: Material Icons

### Backend
- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Security**: Spring Security with JWT
- **Database**: MySQL with JPA/Hibernate
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven
- **Async Processing**: Spring @Async

### Database
- **Engine**: MySQL 8.0
- **ORM**: Hibernate/JPA
- **Connection Pooling**: HikariCP
- **Migration**: Spring Boot Auto-configuration

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### Frontend Setup
```bash
cd frontend
npm install
npm start
# Application runs on http://localhost:4200
```

### Backend Setup
```bash
cd backend
# Configure database in application.properties
mvn spring-boot:run
# Application runs on http://localhost:8081
```

### Database Configuration
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/vibe_coding_platform
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

---

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
POST /api/auth/refresh     - Token refresh
GET  /api/auth/profile     - Get user profile
```

### Problem Endpoints
```
GET    /api/problems           - Get all problems
GET    /api/problems/{id}      - Get problem by ID
POST   /api/problems           - Create new problem (Admin)
PUT    /api/problems/{id}      - Update problem (Admin)
DELETE /api/problems/{id}      - Delete problem (Admin)
```

### Execution Endpoints
```
POST /api/execute             - Execute code against test cases
```

### Submission Endpoints
```
POST /api/submissions         - Submit solution
GET  /api/submissions         - Get all submissions
GET  /api/submissions/{id}    - Get submission by ID
GET  /api/submissions/recent  - Get recent submissions
GET  /api/submissions/my-submissions - Get user submissions
```

---

## Frontend Components

### ProblemDetailComponent
**Location**: `src/app/components/problem/problem-detail/`

**Purpose**: Main interface for solving coding problems

**Key Features**:
- Problem description display
- Code editor with syntax highlighting
- Language selection dropdown
- Run and Submit functionality
- Real-time error feedback
- Submission status polling

**Important Methods**:
```typescript
onSubmit()                    // Handle code submission
onRun()                      // Execute code for testing
startPollingSubmissionStatus() // Poll for submission updates
hasSubmissionError()         // Check for submission errors
getSubmissionErrorMessage()  // Format error messages
```

### AuthService
**Location**: `src/app/services/auth.service.ts`

**Purpose**: Handle user authentication

**Key Methods**:
```typescript
login(credentials)           // User login
register(userData)          // User registration
logout()                    // User logout
getCurrentUser()            // Get current user info
isAuthenticated()           // Check authentication status
```

### ProblemService
**Location**: `src/app/services/problem.service.ts`

**Purpose**: Handle problem-related operations

**Key Methods**:
```typescript
getAllProblems()            // Fetch all problems
getProblemById(id)          // Fetch specific problem
```

### SubmissionService
**Location**: `src/app/services/submission.service.ts`

**Purpose**: Handle submission operations

**Key Methods**:
```typescript
submit(submission)          // Submit code solution
getSubmission(id)          // Get submission details
getSubmissions()           // Get all submissions
getRecentSubmissions()     // Get recent submissions
```

---

## Backend Services

### SubmissionService
**Location**: `src/main/java/com/vibe/platform/service/SubmissionService.java`

**Purpose**: Core submission handling logic

**Key Methods**:
```java
submit(User user, SubmissionRequest request)     // Process submission
getAllSubmissions(Long problemId)               // Get submissions
getSubmission(Long id)                          // Get specific submission
getUserSubmissions(User user)                   // Get user submissions
processSubmissionAsync(Submission submission)   // Async processing
```

### JudgeService
**Location**: `src/main/java/com/vibe/platform/service/JudgeService.java`

**Purpose**: Automated code judging

**Key Features**:
- Asynchronous code execution
- Test case evaluation
- Error detection and reporting
- Performance metrics collection

**Key Methods**:
```java
@Async
judge(Submission submission)                    // Judge code submission
simulateCodeExecution(String code, String input) // Execute code simulation
```

### ProblemService
**Location**: `src/main/java/com/vibe/platform/service/ProblemService.java`

**Purpose**: Problem management

**Key Methods**:
```java
getAllProblems()                               // Get all problems
getProblemById(Long id)                       // Get specific problem
createProblem(ProblemRequest request)         // Create new problem
updateProblem(Long id, ProblemRequest request) // Update problem
```

---

## Database Schema

### Problems Table
```sql
CREATE TABLE problems (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Submissions Table
```sql
CREATE TABLE submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    problem_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    code TEXT NOT NULL,
    language ENUM('JAVA', 'PYTHON', 'CPP') NOT NULL,
    status ENUM('PENDING', 'COMPILING', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 
                'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 
                'RUNTIME_ERROR', 'COMPILATION_ERROR', 'JUDGE_ERROR') NOT NULL,
    execution_time_ms INT,
    memory_used_kb INT,
    judge_output TEXT,
    compile_output TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Test Cases Table
```sql
CREATE TABLE test_cases (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    problem_id BIGINT NOT NULL,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id)
);
```

---

## Error Handling

### Frontend Error Handling

#### Submission Errors
The application provides comprehensive error handling for code submissions:

**Error Detection**:
```typescript
hasSubmissionError(submission: any): boolean {
    const errorStatuses = ['RUNTIME_ERROR', 'COMPILATION_ERROR', 'JUDGE_ERROR', 'WRONG_ANSWER'];
    return errorStatuses.includes(submission.status) || 
           (submission.judgeOutput && submission.judgeOutput.includes('error')) ||
           (submission.compileOutput && submission.compileOutput.includes('error'));
}
```

**Error Message Formatting**:
```typescript
getSubmissionErrorMessage(submission: any): string {
    // Priority: compile errors first, then judge output errors, then generic status errors
    if (submission.status === 'COMPILATION_ERROR' && submission.compileOutput) {
        return `Compilation Error: ${submission.compileOutput}`;
    }
    
    if (submission.judgeOutput && submission.judgeOutput.includes('error')) {
        return `Runtime Error: ${submission.judgeOutput}`;
    }
    
    if (submission.status === 'RUNTIME_ERROR') {
        return submission.judgeOutput || 'Runtime error occurred during code execution.';
    }
    
    // ... additional error handling
}
```

**Error Display**:
- Red alert boxes for critical errors
- Detailed error messages with stack traces
- User-friendly error descriptions
- Syntax highlighting for error content

#### HTTP Error Handling
```typescript
// Service error handling
this.http.post(url, data).pipe(
    catchError(error => {
        console.error('API Error:', error);
        return throwError(error);
    })
);
```

### Backend Error Handling

#### Global Exception Handler
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .message(ex.getReason())
            .status(ex.getStatusCode().value())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(ex.getStatusCode()).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = ErrorResponse.builder()
            .message("Internal server error occurred")
            .status(500)
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(500).body(error);
    }
}
```

#### Service Level Error Handling
```java
@Transactional
public SubmissionResponse submit(User user, SubmissionRequest request) {
    try {
        validateSubmissionRequest(user, request);
        // Process submission...
        return convertToResponse(submission);
    } catch (ResponseStatusException e) {
        throw e;
    } catch (Exception e) {
        log.error("Error processing submission", e);
        throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Failed to process submission"
        );
    }
}
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Configure CORS in Spring Boot
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

#### 2. Database Connection Issues
**Problem**: Can't connect to MySQL database
**Solutions**:
- Check MySQL service is running
- Verify database credentials in `application.properties`
- Ensure database exists
- Check firewall settings

#### 3. Submission Not Found Errors
**Problem**: "Submission not found" in judge output
**Solution**: This was resolved by implementing proper entity management:
```java
// Fixed in JudgeService
@Async
@Transactional
public void judge(Submission submission) {
    try {
        // Use fallback to original submission if fresh lookup fails
        Long submissionId = submission.getId();
        Submission freshSubmission = submissionRepository.findById(submissionId)
            .orElse(submission); // Fallback to original
        
        // Process submission...
    } catch (Exception e) {
        // Error handling...
    }
}
```

#### 4. API Endpoint 404 Errors
**Problem**: Double `/api/` in URLs
**Solution**: Fixed environment configuration:
```typescript
// environment.ts
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8081/api'  // Include /api in base URL
};
```

#### 5. Language Mapping Issues
**Problem**: Frontend and backend language mismatch
**Solution**: Implemented proper language mapping:
```typescript
// For submissions
const languageMapping: { [key: string]: string } = {
    'C++': 'CPP',
    'Java': 'JAVA',
    'Python': 'PYTHON'
};

// For execution
const executionLanguageMapping: { [key: string]: string } = {
    'C++': 'c++',
    'Java': 'java',
    'Python': 'python'
};
```

---

## Future Enhancements

### 1. Advanced Features
- **Contest Mode**: Timed coding contests
- **Discussion Forum**: Problem discussion and solutions
- **Leaderboards**: User rankings and statistics
- **Problem Collections**: Curated problem sets
- **Video Tutorials**: Integrated learning materials

### 2. Technical Improvements
- **Docker Containerization**: Easy deployment
- **Microservices Architecture**: Better scalability
- **Real Code Execution**: Actual code compilation and execution
- **Advanced Security**: Enhanced authentication and authorization
- **Performance Optimization**: Caching and optimization

### 3. User Experience
- **Mobile App**: Native mobile applications
- **Offline Mode**: Work without internet connection
- **Advanced Editor**: More IDE-like features
- **Code Collaboration**: Pair programming support
- **Progress Tracking**: Detailed learning analytics

### 4. Administrative Features
- **Admin Dashboard**: Platform management interface
- **Analytics**: Usage statistics and insights
- **Automated Testing**: Problem validation tools
- **Bulk Operations**: Mass problem import/export
- **Monitoring**: System health and performance monitoring

---

## Development Guidelines

### Code Standards
- Follow Angular and Spring Boot best practices
- Use TypeScript strict mode
- Implement proper error handling
- Write comprehensive tests
- Document complex logic

### Git Workflow
- Use feature branches for development
- Write descriptive commit messages
- Perform code reviews before merging
- Maintain clean commit history

### Testing Strategy
- Unit tests for services and components
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing for scalability

---

## Deployment

### Production Configuration
```bash
# Frontend build
ng build --configuration production

# Backend configuration
# Set production properties
spring.profiles.active=production
```

### Security Considerations
- Use HTTPS in production
- Implement proper authentication
- Secure database connections
- Regular security audits
- Input validation and sanitization

---

## Support and Maintenance

### Logging
- Application logs for debugging
- Error tracking and monitoring
- Performance metrics collection
- User activity logging

### Backup and Recovery
- Regular database backups
- Code repository backups
- Configuration management
- Disaster recovery procedures

---

## License and Credits

This project is developed for educational and demonstration purposes. 

### Technologies Used
- Angular Framework
- Spring Boot Framework
- MySQL Database
- Angular Material UI
- Tailwind CSS
- Maven Build Tool

---

## Contact Information

For questions, issues, or contributions:
- GitHub Repository: [VibeCodingPlatform](https://github.com/hemant-dp/VibeCodingPlatform)
- Branch: feature/errorhandling

---

*This documentation provides a comprehensive overview of the VibeCodingPlatform. For specific implementation details, refer to the source code and inline comments.*
