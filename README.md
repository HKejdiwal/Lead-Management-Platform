# Smart Leads Dashboard

A full-stack MERN internship assignment for lead management with JWT authentication, role-based access control, advanced filtering, pagination, and CSV export.

## Features

- React + TypeScript frontend
- TailwindCSS styling
- Node.js + Express backend with TypeScript
- MongoDB via Mongoose
- JWT authentication with `Admin` and `Sales` roles
- Lead CRUD with filtering, search, sort, and pagination
- CSV export for filtered leads
- Docker + Docker Compose setup

## Setup

1. Copy `.env.example` to `.env`.
2. Start the app with Docker Compose:
   ```bash
docker compose up --build
```
3. Server runs on `http://localhost:5000`
4. Frontend runs on `http://localhost:5173`

## API Documentation

Endpoints are grouped under `/api/auth` and `/api/leads`.

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

## Credentials

Use the registration flow to create Admin and Sales users.

## Notes

- Use strong values in `.env` for `JWT_SECRET`.
- Backend validation and centralized error handling are included.
