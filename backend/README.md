# Go Backend REST API (CMS Controller Engine)

A secure, performance-optimized REST API built using **Go (Golang)**, the **Gin Web Framework**, and **GORM (SQLite)**. This backend serves as the content management system (CMS) and data source for the developer portfolio website.

---

## 🏗️ Architecture & Directory Structure

The backend strictly follows a layered architecture (Controller-Service-Repository-Model) to isolate concerns:

```
backend/
├── config/         # Database GORM setup and Logrus configurations
├── constant/       # Global constants and error code structures
├── controllers/    # API Request handlers, panic safety, validation, and JSON encoding
├── dtos/           # Input request validation data transfer objects
├── middleware/     # JWT authentication and CORS configurations
├── models/         # GORM database schema definitions
├── repositories/   # Database access layer operations
├── services/       # Core business logic processing
├── utils/          # Standard response encoders and validators
├── main.go         # Application router bootstrap and entrypoint
└── portfolio.db    # SQLite database file
```

---

## ⚡ Core Features & Standards

1. **Strict Controller Templates**:
   - **Panic Recovery**: Every handler uses deferred recovery blocks to log internal panic parameters via `logrus.Errorf` and safely return an internal server error to the client.
   - **Manual Decoders**: Decodes request bodies manually using `json.NewDecoder(ctx.Request.Body).Decode(&req)` instead of automatic bindings.
   - **Request Validation**: Validates inputs using `go-playground/validator/v10` through `utils.ValidateRequest` checks.
   - **Standard Responses**: Wraps payloads into uniform JSON structures (`utils.SuccessResponse`, `utils.BadRequestResponse`, etc.).
2. **JWT Authorization Middleware**: Validates incoming Bearer tokens on protected dashboard administrative endpoints.
3. **Bcrypt Hashing**: Encrypts credentials (password) securely inside the database.
4. **Structured Logging**: Uses Logrus to record routing errors, database panics, and request pipeline warnings.

---

## 🗺️ REST API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/projects` | Fetch all showcase projects |
| **GET** | `/api/skills` | Fetch all technical skills |
| **GET** | `/api/experience`| Fetch work experience timelines |
| **POST**| `/api/contact` | Submit a new contact inquiry |
| **POST**| `/api/auth/login` | Administrator authentication (returns JWT) |
| **POST**| `/api/auth/forgot-password` | Request password reset verification OTP code |
| **POST**| `/api/auth/reset-password` | Verify OTP and reset password details |

### Protected Administrative Endpoints (Requires Bearer JWT)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/dashboard/messages` | Retrieve all submitted contact inquiries |
| **DELETE**| `/api/dashboard/messages/:id` | Delete a specific contact inquiry |
| **POST**| `/api/dashboard/users` | Register a new administrator user |
| **POST**| `/api/dashboard/projects` | Register a new showcase project |
| **PUT** | `/api/dashboard/projects/:id`| Update details of an existing project |
| **DELETE**| `/api/dashboard/projects/:id` | Delete a showcase project |
| **POST**| `/api/dashboard/skills` | Register a new technical skill rating |
| **PUT** | `/api/dashboard/skills/:id` | Update details of an existing skill |
| **DELETE**| `/api/dashboard/skills/:id` | Delete a technical skill rating |
| **POST**| `/api/dashboard/experience` | Register a new work experience timeline |
| **PUT** | `/api/dashboard/experience/:id`| Update details of an existing experience |
| **DELETE**| `/api/dashboard/experience/:id`| Delete an experience timeline entry |

---

## 🚀 Getting Started

### Prerequisites
- Go 1.21+ installed.

### Setup and Running Locally:
1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   go mod tidy
   ```
3. Run the development server:
   ```bash
   go run main.go
   ```
   *The server starts listening on `http://localhost:8081`.*
