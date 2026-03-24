# Frontend - Vi-Notes React Application

## Overview

The frontend is a React TypeScript application that provides a user interface for the Vi-Notes authenticity verification platform. It includes user authentication (login/registration) and a distraction-free writing editor.

## Features

- **User Registration**: Sign up with email and password validation
- **User Login**: Authenticate with stored credentials
- **Protected Routes**: Editor accessible only to authenticated users
- **Writing Editor**: Clean, distraction-free text editing environment
- **Session Management**: Automatic login persistence with JWT tokens
- **Responsive Design**: Modern UI with gradient styling

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API (AuthContext)
- **Build Tool**: Create React App (react-scripts)
- **Styling**: CSS3

## Project Structure

```
frontend/
├── src/
│   ├── components/                 # Reusable React components
│   │   └── ProtectedRoute.tsx      # Route guard component
│   ├── context/                    # React Context for global state
│   │   └── AuthContext.tsx         # Authentication context & hooks
│   ├── pages/                      # Page components
│   │   ├── Login.tsx               # Login page
│   │   ├── Register.tsx            # Registration page
│   │   └── Editor.tsx              # Main editor page
│   ├── services/                   # API services
│   │   └── api.ts                  # Axios instance and API calls
│   ├── styles/                     # CSS stylesheets
│   │   ├── Auth.css                # Login/Register styles
│   │   └── Editor.css              # Editor page styles
│   ├── App.tsx                     # Main app component with routing
│   ├── App.css                     # Global styles
│   ├── index.tsx                   # React DOM render
│   └── index.css                   # Global CSS
├── public/
│   └── index.html                  # HTML template
├── .env                            # Environment variables (local)
├── .env.example                    # Environment variable template
├── package.json                    # Dependencies and scripts
└── tsconfig.json                   # TypeScript configuration
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running backend server (see backend README)

### Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the API URL if needed:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Application Flow

### Authentication Flow

1. **Unauthenticated User**:
   - Redirected to `/login` page
   - Can log in or navigate to registration

2. **Registration**:
   - User fills email, password, and password confirmation
   - Form validation ensures password length (min 6 chars) and matching
   - API call to backend `/api/auth/register`
   - JWT token stored in localStorage
   - Redirected to editor

3. **Login**:
   - User enters email and password
   - API call to backend `/api/auth/login`
   - JWT token stored in localStorage
   - Redirected to editor

4. **Protected Editor**:
   - `ProtectedRoute` component checks authentication status
   - Loading state displayed while checking auth
   - Unauthenticated users redirected to login
   - Authenticated users see editor

5. **Logout**:
   - Token removed from localStorage
   - User redirected to login page

### Authentication Context

The `AuthContext` provides:

```typescript
{
  user: User | null,           // Current user info
  isLoading: boolean,          // Loading state
  isAuthenticated: boolean,    // Auth status flag
  register(): Promise<void>,   // Registration function
  login(): Promise<void>,      // Login function
  logout(): void               // Logout function
}
```

## Components & Pages

### Pages

#### Login Page (`src/pages/Login.tsx`)
- Email and password input fields
- Form validation and error handling
- Link to registration page
- Loading state during authentication

#### Register Page (`src/pages/Register.tsx`)
- Email input
- Password and password confirmation inputs
- Form validation
- Error messages for failed registrations
- Link to login page

#### Editor Page (`src/pages/Editor.tsx`)
- User greeting with email display
- Full-screen textarea for writing
- Logout button in header
- Placeholder text for guidance

### Components

#### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- Wraps protected pages requiring authentication
- Shows loading indicator during auth check
- Redirects unauthenticated users to login
- Allows authenticated users to proceed

## API Integration

The application uses Axios for HTTP requests with automatic JWT token injection.

### API Service (`src/services/api.ts`)

```typescript
authAPI.register(email, password, passwordConfirm)
authAPI.login(email, password)
authAPI.getMe()  // Get current user (protected)
```

**Token Management:**
- Token automatically added to request headers: `Authorization: Bearer <token>`
- Token retrieved from localStorage on each request
- Token stored in localStorage after successful login

## Styling

### Auth Pages (`src/styles/Auth.css`)
- Gradient background (purple to blue)
- Centered card layout
- Form styling with focus states
- Error message styling
- Button with hover effects

### Editor Page (`src/styles/Editor.css`)
- Header with user info and logout button
- Full-height editor container
- Textarea with focus effects
- Loading indicator styling
- Responsive monospace font

## Scripts

- `npm start` - Start development server (http://localhost:3000)
- `npm run build` - Create production build
- `npm test` - Run tests (if configured)
- `npm run eject` - Eject from Create React App (one-way operation)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

Note: Variables must start with `REACT_APP_` to be accessible in the app.

## Key Features Explained

### Automatic Login Persistence

When the app loads:
1. `AuthContext` checks for token in localStorage
2. If token exists, calls `/api/auth/me` to verify and get user info
3. Sets authenticated state
4. `ProtectedRoute` allows access to editor without re-login

### Error Handling

- API errors caught and displayed to user
- Network errors handled gracefully
- Form validation before submission
- User-friendly error messages

### Loading States

- Button disabled during submission
- Loading text shown on buttons
- Full-page loading indicator on route protection
- Prevents double submissions

## Troubleshooting

### API Connection Errors
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env` file
- Verify CORS settings in backend `.env`

### Token Issues
- Clear localStorage and re-login: `localStorage.clear()`
- Check browser console for error details
- Verify JWT_SECRET is consistent between frontend and backend

### Module Not Found Errors
- Run `npm install` to ensure all dependencies installed
- Clear node_modules: `rm -rf node_modules && npm install`
- Verify all import paths are correct

### Build Errors
- Run `npm run build` to check for TypeScript errors
- Ensure version compatibility: `npm update`

## Best Practices

1. **Never commit `.env` file** with sensitive data
2. **Use `.env.example`** as template for environment setup
3. **Handle loading states** to prevent UI confusion
4. **Clear tokens on logout** to ensure security
5. **Validate forms** before API calls
6. **Show appropriate error messages** to users

## Future Enhancements

- Password reset functionality
- User profile management
- Settings page
- Session history
- Keystroke monitoring
- Text analysis and reports
- Saving writing sessions
- Export/share functionality
