# Production Backend Architecture

Modular and scalable Node.js / Express backend service following production best practices.

## Folder Structure

```
my-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection and lifecycle
│   │   └── env.js               # Centralized environment variable validation
│   ├── modules/
│   │   ├── auth/                # Authentication module (register, login, JWT)
│   │   ├── users/               # Users management module
│   │   └── portfolio/           # Portfolio showcase module
│   ├── middlewares/             # Auth, validation, notFound, errorHandler
│   ├── routes/                  # Centralized API route registration
│   ├── utils/                   # Logger, ApiResponse, AsyncHandler
│   ├── app.js                   # Express application setup & middleware pipeline
│   └── server.js                # Server entry point & graceful shutdown
├── tests/                       # Automated unit and integration tests
├── package.json
├── package-lock.json
├── Dockerfile                   # Multi-stage production container
├── .dockerignore                # Excludes secrets, tests, and node_modules from build context
├── .env                         # Local environment variables (do not commit)
├── .env.example                 # Environment template
└── .gitignore
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` if not already created:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Tests
```bash
npm test
```

## API Endpoints

### System & Health
- `GET /` — API Information
- `GET /health` — Health check status
- `GET /api/v1/health` — API v1 and Database status

### Auth Module (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/v1/auth/login` — Login (`email`, `password`)
- `GET /api/v1/auth/me` — Authenticated profile (requires `Bearer <token>`)

### Users Module (`/api/v1/users`)
- `GET /api/v1/users` — List all users (Protected)
- `GET /api/v1/users/:id` — Get single user (Protected)
- `PUT /api/v1/users/:id` — Update user details (Protected)
- `DELETE /api/v1/users/:id` — Delete user (Admin only)

### Portfolio Module (`/api/v1/portfolio`)
- `GET /api/v1/portfolio` — List portfolio items (Filter by `?category=` or `?search=`)
- `GET /api/v1/portfolio/:id` — Get single portfolio item
- `POST /api/v1/portfolio` — Create item (Admin only)
- `PUT /api/v1/portfolio/:id` — Update item (Admin only)
- `DELETE /api/v1/portfolio/:id` — Delete item (Admin only)

## Docker Setup

Build and run with Docker:
```bash
docker build -t my-backend .
docker run -p 5000:5000 --env-file .env my-backend
```
