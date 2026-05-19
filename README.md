# Smart Leads Dashboard

A full-stack MERN lead management platform built with React, TypeScript, Tailwind CSS, Express, and MongoDB.

## Features

- React + TypeScript frontend
- Tailwind CSS styling with dark mode support
- Express backend with TypeScript
- MongoDB via Mongoose
- JWT authentication with `Admin` and `Sales` roles
- Lead CRUD operations with search, filter, sort, and pagination
- Lead update and delete support
- CSV export for filtered leads
- Docker + Docker Compose support for easy deployment

## Prerequisites

- Node.js 20+ (for local development)
- npm
- MongoDB (if running without Docker)
- Docker Desktop (if using Docker Compose)

## Local Development

1. Copy `.env.example` to `.env` in both `server/` and `client/` if needed.
2. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`
3. Start MongoDB locally or connect to a MongoDB URI in `server/.env`.
4. Run the backend:
   ```bash
cd server
npm run dev
```
5. Run the frontend:
   ```bash
cd client
npm run dev
```

### Local access URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

> Note: `localhost` only works on the same machine. If you want access from another device on your network, use the host machine IP and open the ports.

## Docker Setup

1. Copy `.env.example` to `.env` in the `server/` directory.
2. Start the application with Docker Compose:
   ```bash
docker compose up --build
```
3. Open the frontend at:
   - `http://localhost:5173`
4. The backend API is available at:
   - `http://localhost:5000`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Leads
- `GET /api/leads`
- `GET /api/leads/:id`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`
- `GET /api/leads/export`

## Environment Variables

Create `server/.env` with at least:

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/leads
JWT_SECRET=your_jwt_secret_here
```

For local development, point `MONGO_URI` to your local MongoDB instance if Docker is not used.

## Notes

- Docker is optional. The project can run locally with `npm run dev` if the required environment is set up.
- Docker makes it easier to run the app on another machine because the runtime and dependencies are packaged together.
- If using Docker, make sure ports `5173`, `5000`, and `27017` are available.
