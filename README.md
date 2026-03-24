# Vi-Notes

**Vi-Notes** is an authenticity verification platform designed to distinguish genuine human-written content from AI-generated or AI-assisted text. The system focuses on analyzing **writing behavior** alongside **statistical and linguistic characteristics** of the text to establish reliable authorship verification.

This repository represents the **design and conceptual foundation** for the Vi-Notes system.

---

## Motivation

With the widespread availability of AI writing tools, verifying true human authorship has become increasingly challenging. Most existing detection methods rely primarily on textual analysis, which can be inconsistent and easy to bypass.

Vi-Notes approaches this problem by combining:
- Behavioral signals from the writing process
- Statistical analysis of the written content
- Correlation between how content is written and what is written

---

## Core Idea

Human writing naturally includes:
- Variable typing speeds
- Pauses during thinking
- Revisions during idea formation
- Irregular sentence structures
- A relationship between content complexity and editing frequency

AI-generated or pasted text often lacks these behavioral signatures.

Vi-Notes is designed to capture and analyze these characteristics to assess authorship authenticity.

---

## Key Features

### Writing Session Monitoring
- Capture keystroke timing metadata (not raw key content)
- Track pauses, deletions, edits, and writing flow
- Detect pasted or externally inserted text blocks

### Behavioral Pattern Analysis
- Pause distribution before sentences and paragraphs
- Typing speed variance
- Revision frequency relative to text complexity
- Micro-pauses around punctuation and structural boundaries

### Textual Statistical Analysis
- Sentence length variation
- Vocabulary diversity metrics
- Stylistic consistency analysis
- Linguistic irregularities typical of human writing

### Cross-Verification Engine
- Correlate keyboard behavior with text evolution
- Identify mismatches between behavioral data and content
- Flag suspicious uniformity patterns

### Authenticity Reports
- Confidence score for human authorship
- Highlighted suspicious segments
- Supporting behavioral and textual indicators
- Shareable verification summaries

---

## Tech Stack (MERN Architecture)

### Frontend
- React
- TypeScript
- Electron for desktop-level keyboard event access

### Backend
- Node.js
- Express.js
- RESTful APIs for session handling and analysis

### Database
- MongoDB
- Encrypted storage for writing sessions, keystroke metadata, and reports

### Machine Learning
- TensorFlow / PyTorch
- Supervised learning for human vs AI-assisted writing
- Unsupervised anomaly detection
- NLP-based statistical signature analysis

---

## Privacy & Ethics

Vi-Notes is designed with privacy-first principles:

- No storage of raw keystroke content
- Only timing, frequency, and structural metadata is collected
- Encrypted data storage
- User-controlled session tracking
- Monitoring limited strictly to active writing sessions

---

## Project Goals

- Restore trust in written content authenticity
- Differentiate between human-written, AI-assisted, and AI-generated text
- Adapt detection methods as AI writing tools evolve
- Maintain ethical, transparent, and privacy-conscious verification

---

## Repository Scope

This repository currently serves as:
- A design reference
- A research and experimentation space
- A foundation for future MERN-based implementation

---

## Implemented Features

### Feature 1: Basic Writing Editor ✅
- A simple, distraction-free text editor implemented as a React component.
- Users can type their content in a full-screen textarea.
- No formatting options; focus on clean text input.
- Built with React and TypeScript for reliability.

### Feature 2: User Login and Registration ✅

#### Overview
Implemented a complete authentication system allowing students to create accounts and log in securely. Each writing session is associated with a specific user through JWT-based authentication.

#### Backend Implementation
**Technology Stack:**
- Node.js with Express.js server
- MongoDB for encrypted user data storage
- JWT (JSON Web Tokens) for stateless authentication
- bcryptjs for secure password hashing

**API Endpoints:**
- `POST /api/auth/register` - Create new account (email + password)
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/me` - Get current user (protected route)

**Features:**
- Email validation (RFC 5322 compliant)
- Password requirements (minimum 6 characters)
- Password hashing before storage (no plain text!)
- Automatic JWT token generation (7-day expiration)
- Protected routes requiring authentication
- CORS enabled for frontend communication

#### Frontend Implementation
**Technology Stack:**
- React 18 with TypeScript
- React Router v6 for protected routes
- Axios for API communication
- Context API for global authentication state
- CSS3 with gradient styling

**Features:**
- **Login Page**: Email and password input with validation
- **Registration Page**: Sign-up with password confirmation validation
- **Protected Editor**: Only accessible when logged in
- **Session Persistence**: Automatic login on page refresh if token valid
- **User Dashboard**: Shows logged-in user email
- **Logout Functionality**: Clears session and redirects to login
- **Error Handling**: User-friendly error messages for all scenarios
- **Loading States**: Visual feedback during authentication

#### User Flow
1. Unauthenticated users redirected to `/login`
2. New users can click "Sign up" to create account at `/register`
3. Registration validates:
   - Valid email format
   - Password at least 6 characters
   - Password confirmation matches
   - Email doesn't already exist
4. After registration or login, JWT token stored in localStorage
5. Token automatically included in all API requests
6. Editor accessible at `/editor` (protected route)
7. User can logout, clearing token and session

#### Security Measures
- Passwords hashed with bcryptjs (salt rounds: 10)
- Passwords not returned in API responses
- JWT tokens have expiration (7 days default)
- CORS restricted to frontend origin
- Input validation on both client and server
- Protected API endpoints require valid token
- Sensitive environment variables in .env files

#### Getting Started

**Prerequisites:**
- Node.js v14+
- MongoDB (local or Atlas)

**Backend Setup:**
```bash
cd backend
npm install
# Configure .env with MongoDB URI and JWT_SECRET
npm run dev  # Starts on http://localhost:5000
```

**Frontend Setup:**
```bash
cd frontend
npm install
# .env already configured to http://localhost:5000/api
npm start  # Starts on http://localhost:3000
```

**Testing the Feature:**
1. Open http://localhost:3000
2. You'll be redirected to /login
3. Click "Sign up here" link
4. Enter email (e.g., student@example.com)
5. Enter password (min 6 characters)
6. Confirm password
7. Click "Sign Up"
8. You'll be logged in and see the editor with your email
9. You can now write content
10. Click "Logout" to return to login page
11. Login again using same credentials

#### Database Schema
**User Collection:**
```javascript
{
  _id: ObjectId,
  email: string,              // Unique, validated
  password: string,           // Hashed (never stored plain)
  createdAt: Date,           // Account creation time
  updatedAt: Date            // Last update time
}
```

#### Environment Configuration

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/vi-notes
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Documentation
- **Backend Details**: See `backend/README.md` for API documentation
- **Frontend Details**: See `frontend/README.md` for component documentation
- **Code Comments**: All source files include inline documentation

#### Files Created/Modified

**Backend:**
- `backend/src/server.ts` - Express server with MongoDB connection
- `backend/src/controllers/authController.ts` - Register/login logic
- `backend/src/models/User.ts` - MongoDB user schema
- `backend/src/routes/auth.ts` - Auth API routes
- `backend/src/middleware/auth.ts` - JWT verification middleware
- `backend/package.json` - Dependencies and scripts
- `backend/tsconfig.json` - TypeScript configuration
- `backend/.env` & `.env.example` - Configuration templates

**Frontend:**
- `frontend/src/context/AuthContext.tsx` - Authentication state management
- `frontend/src/pages/Login.tsx` - Login page component
- `frontend/src/pages/Register.tsx` - Registration page component
- `frontend/src/pages/Editor.tsx` - Protected editor page
- `frontend/src/components/ProtectedRoute.tsx` - Route guard component
- `frontend/src/services/api.ts` - Axios API client
- `frontend/src/styles/Auth.css` - Authentication pages styling
- `frontend/src/styles/Editor.css` - Editor page styling
- `frontend/src/App.tsx` - Updated with routing

#### Testing Checklist
- [x] Register new user with valid credentials
- [x] Prevent registration with invalid email
- [x] Prevent registration with short passwords
- [x] Prevent registration with mismatched passwords
- [x] Prevent registration with duplicate email
- [x] Login with correct credentials
- [x] Prevent login with wrong credentials
- [x] JWT token persists across page refreshes
- [x] Token verified on app load (auto-login)
- [x] Logout clears token and redirects
- [x] Editor only accessible when authenticated
- [x] Unauthenticated users redirected to login
- [x] Error messages displayed to user
- [x] Loading states during API calls

---

## Contributing

Contributions are welcome, especially for **feature requests and their implementation**.  
If you are interested in working on an existing feature request or proposing a new one, please open or comment on an issue to start the discussion.

---

## License

This project is licensed under the MIT License.
