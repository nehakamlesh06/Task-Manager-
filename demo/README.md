# Task Manager REST API

A secure, multi-user task management backend built with Spring Boot, featuring JWT-based authentication and MySQL persistence.

## Tech Stack

- **Java 17**
- **Spring Boot 4.1**
- **Spring Data JPA** (Hibernate) — database ORM
- **Spring Security** — authentication & authorization
- **JWT (JSON Web Tokens)** — stateless auth via `jjwt` library
- **MySQL** — persistent relational database
- **BCrypt** — password hashing
- **Maven** — dependency management
- **Postman** — API testing

## Features

- User registration with encrypted (bcrypt) passwords
- Login endpoint issuing signed JWT tokens
- Stateless authentication — no server-side sessions
- Full CRUD operations on tasks (Create, Read, Update, Delete)
- Tasks are scoped per user — users can only access their own data
- Ownership checks prevent unauthorized access to other users' tasks
- Centralized exception handling with proper HTTP status codes
- One-to-many relationship between User and Task entities

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in, returns a JWT token |

### Tasks (Requires Authentication — `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/tasks` | Get all tasks for the logged-in user |
| GET | `/api/tasks/{id}` | Get a specific task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update an existing task |
| DELETE | `/api/tasks/{id}` | Delete a task |

## Security Implementation

- **Password storage:** Passwords are never stored in plain text. `BCryptPasswordEncoder` hashes passwords one-way before saving, and login verification compares hashes rather than decrypting.
- **Stateless JWT auth:** On successful login, the server issues a signed JWT containing the username and an expiration timestamp. The client includes this token in the `Authorization` header (`Bearer <token>`) on every subsequent request.
- **Custom filter chain:** A `JwtAuthFilter` (extending `OncePerRequestFilter`) intercepts every request, validates the token, and populates Spring Security's context so downstream code knows who's making the request.
- **Route protection:** `SecurityConfig` explicitly permits `/api/auth/**` (registration/login) while requiring authentication for all other routes.
- **Data isolation:** Each task is linked to its owning `User` via a `@ManyToOne` relationship. Controller logic checks ownership before allowing read/update/delete on any task, preventing users from accessing others' data even if they know a task's ID.

## How to Run Locally

1. Clone the repository
2. Create a MySQL database:
```sql
   CREATE DATABASE taskmanager;
```
3. Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
```
4. Run the application:
mvn spring-boot:run

5. The API will be available at `http://localhost:8080`

## Example Usage (Postman)

**Register:**
```json
POST /api/auth/register
{
  "username": "neha",
  "password": "test123",
  "email": "neha@example.com"
}
```

**Login:**
```json
POST /api/auth/login
{
  "username": "neha",
  "password": "test123"
}
```
Response:
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

**Create a task** (include `Authorization: Bearer <token>` header):
```json
POST /api/tasks
{
  "title": "Learn Spring Security",
  "description": "Understand JWT-based auth",
  "completed": false
}
```

## Future Improvements

- Input validation (e.g., reject empty titles)
- Refresh token support
- Role-based access control (admin vs. regular user)
- Pagination for task listing
- Unit and integration tests

## Author

Neha Kamlesh — Full-Stack Developer (MERN) | Backend project built to strengthen Java/Spring Boot skills
