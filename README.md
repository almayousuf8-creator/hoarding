# Hoarding Leasing Management System

A full-stack web application for managing hoarding leasing operations.

## Technology Stack

- **Frontend**: Angular 18 (Standalone Components)
- **Backend**: Node.js + Express
- **Database**: MySQL

## Prerequisites

- Node.js (v18+)
- MySQL Server (v8.0+)
- Angular CLI (`npm install -g @angular/cli`)

## Setup Instructions

### 1. Database Setup

Ensure MySQL is running locally. By default, the backend connects to `127.0.0.1:3306` with user `root` and password `root`. You can override these in the backend environment variables if needed.

If you have Docker, you can run the included docker-compose file (make sure you install docker-compose first):

```bash
docker compose up -d
```

### 2. Backend Setup

```bash
cd backend
npm install

# Initialize the database schema
npm run init-db

# Seed the database with sample data (Admin and Client users)
npm run seed-db

# Start the development server
npm run dev
```

The backend server will run on `http://localhost:5000`.

**Backend Endpoints Built**:
- `POST /api/auth/login`
- `GET /api/auth/me`
- `CRUD /api/states`
- `CRUD /api/districts`
- `CRUD /api/clients`
- `CRUD /api/locations`
- `CRUD /api/hoardings`
- `POST /api/images/:hoardingId`
- `GET /api/images/:hoardingId`
- `DELETE /api/images/:imageId`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start the Angular development server
ng serve
```

The frontend will run on `http://localhost:4200`.

### Environment Variables

A default `.env` file is located at `backend/.env`.

```
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hoarding_leasing
JWT_SECRET=super_secret_key_123
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Default Credentials

After running `npm run seed-db`, the following credentials are available:

- **Admin**: `admin@hoarding.com` / `admin123`
- **Client**: `client@hoarding.com` / `client123`

## Next Steps for Development

- The backend architecture is fully implemented, including all CRUD operations, authentication middleware, and file uploading via Multer.
- The Angular frontend has been initialized. The next steps are to implement the `AuthService`, `ApiService`, and the Angular standalone components for the Dashboards as outlined in the requirements.
