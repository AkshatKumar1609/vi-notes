# Backend - Vi-Notes Authentication Server

## Overview

The backend provides RESTful APIs for user authentication, including registration, login, and user management. It uses Node.js with Express.js, MongoDB for data persistence, and JWT for secure session management.

## Features

- **User Registration**: Create new accounts with email and password
- **User Login**: Authenticate users and issue JWT tokens
- **Password Security**: Passwords are hashed using bcryptjs before storage
- **JWT Authentication**: Stateless authentication using JWT tokens
- **Protected Routes**: API endpoints protected with authentication middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Language**: TypeScript

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Business logic for routes
│   │   └── authController.ts
│   ├── middleware/       # Express middleware
│   │   └── auth.ts
│   ├── models/          # MongoDB schemas
│   │   └── User.ts
│   ├── routes/          # API routes
│   │   └── auth.ts
│   └── server.ts        # Main application file
├── .env                 # Environment variables (local)
├── .env.example         # Environment variable template
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

### Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values as needed:
     ```
     MONGODB_URI=mongodb://localhost:27017/vi-notes
     JWT_SECRET=your_secure_secret_key
     JWT_EXPIRE=7d
     PORT=5000
     NODE_ENV=development
     FRONTEND_URL=http://localhost:3000
     ```

4. **Ensure MongoDB is running**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Ensure your connection string is in `.env`

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

**Validation Errors:**
- Email required and must be valid
- Password must be at least 6 characters
- Password and password confirmation must match
- Email must be unique

#### POST `/api/auth/login`
Login an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

**Error Responses:**
- 401: Invalid email or password

#### GET `/api/auth/me`
Get current authenticated user's information.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- 401: Token invalid or expired
- 404: User not found

### Health Check

#### GET `/api/health`
Check if the server is running.

**Response (200):**
```json
{
  "success": true,
  "message": "Server is running"
}
```

## User Model

The User collection in MongoDB stores the following fields:

```typescript
{
  _id: ObjectId,
  email: string,           // Unique, lowercase, validated
  password: string,        // Hashed with bcryptjs
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs with a salt of 10
- **JWT Tokens**: Stateless authentication with configurable expiration
- **CORS**: Restricted to frontend origin
- **Input Validation**: Email format validation and password requirements
- **Protected Routes**: Endpoints requiring authentication are protected by the `protect` middleware

## Authentication Flow

1. User registers or logs in
2. Backend validates credentials and creates a JWT token
3. Client stores token in localStorage
4. Client includes token in Authorization header for protected requests
5. Server verifies token and grants access

## Scripts

- `npm run dev` - Start development server with auto-reload (ts-node)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build
- `npm test` - Run tests (if configured)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/vi-notes` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key_12345` |
| `JWT_EXPIRE` | JWT token expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:3000` |

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod` (local) or check Atlas credentials
- Verify `MONGODB_URI` in `.env` file

### CORS Errors
- Check that `FRONTEND_URL` in `.env` matches your frontend's URL
- Default is `http://localhost:3000`

### JWT Errors
- Ensure `JWT_SECRET` is set and consistent
- Check token expiration time with `JWT_EXPIRE`

## Future Enhancements

- Password reset functionality
- Email verification
- User profile management
- Role-based access control
- Session management for writing sessions
- API rate limiting
