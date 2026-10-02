# Employee Management API

A scalable Express + Sequelize + MySQL backend for a company employee management system.

## Features
- JWT authentication
- Role-based authorization
- User and employee management
- Department management
- Dashboard endpoints
- Input validation with Joi
- Centralized error handling
- Structured logging with Winston
- MySQL database integration using Sequelize

## Tech Stack
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT
- bcryptjs
- Joi
- dotenv
- cors
- helmet
- winston
- morgan
- cookie-parser

## Project Setup

1. Create project folder and install dependencies:
```bash
npm install
```

2. Create a MySQL database:
```sql
CREATE DATABASE employee_management;
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Update .env values.

5. Start the server:
```bash
npm run dev
```

## Environment Variables
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=employee_management
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_this_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:4200
```

## API Base URL
```text
http://localhost:5000/api
```

## Authentication Flow
1. Register with `/api/auth/register`
2. Login with `/api/auth/login`
3. Store returned JWT in Angular app
4. Send `Authorization: Bearer <token>` on protected requests

## Main Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Employees
- `POST /api/employees`
- `GET /api/employees`
- `GET /api/employees/:id`
- `PUT /api/employees/:id`
- `PATCH /api/employees/:id/status`
- `DELETE /api/employees/:id`

### Users
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/status`
- `PATCH /api/users/:id/role`
- `DELETE /api/users/:id`

### Departments
- `POST /api/departments`
- `GET /api/departments`
- `GET /api/departments/:id`
- `PUT /api/departments/:id`
- `DELETE /api/departments/:id`

### Dashboard
- `GET /api/dashboard/summary`
- `GET /api/dashboard/employee-stats`
- `GET /api/dashboard/recent-employees`
- `GET /api/dashboard/monthly-employees`

### Profile
- `GET /api/profile`
- `PUT /api/profile`
- `PATCH /api/profile/password`

## Roles
- admin
- hr
- manager
- employee

## Example Request
```json
{
  "name": "Yatin Patel",
  "email": "yatin@example.com",
  "password": "Password@123",
  "phone": "9876543210",
  "role": "employee"
}
```

## Example Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "...",
    "user": {
      "id": 1,
      "name": "Yatin Patel",
      "email": "yatin@example.com",
      "role": "employee"
    }
  }
}
```

## Running
```bash
npm run dev
```

## Notes
- Passwords are hashed using bcryptjs.
- JWT secret should never be committed.
- Use a MySQL database for persistence.
