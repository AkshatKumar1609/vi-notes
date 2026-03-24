# Vi-Notes - Setup & Quick Start Guide

This guide helps you get Vi-Notes running with Feature 1 (Basic Writing Editor) and Feature 2 (User Login and Registration).

## Prerequisites

Before you start, ensure you have:
- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** v6 or higher (comes with Node.js)
- **MongoDB** either:
  - Running locally: [MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
  - Or cloud: [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)

## Project Structure

```
vi-notes/
├── backend/          # Express.js API server
├── frontend/         # React application
└── README.md         # This file
```

## Step-by-Step Setup

### 1. MongoDB Setup

**Option A: Local MongoDB**

```bash
# Windows (assuming MongoDB installed)
# Look for MongoDB Compass in Start Menu or:
mongod

# macOS/Linux
brew services start mongodb-community
# or
mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update backend/.env with connection string

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already has template)
# Update .env with your MongoDB URI if needed:
# MONGODB_URI=mongodb://localhost:27017/vi-notes
# JWT_SECRET=your_secret_key_here

# Start development server
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Environment: development
MongoDB connected successfully
```

### 3. Frontend Setup

**In a NEW terminal window:**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Frontend .env already configured
# If needed, update to match backend URL:
# REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
```

**Expected Behavior:**
- Browser opens automatically at http://localhost:3000
- You see a login page (not the editor)
- Network tab shows requests to http://localhost:5000

## Verification Checklist

### Backend is Working
- [ ] Terminal shows "Server running on port 5000"
- [ ] Terminal shows "MongoDB connected successfully"
- [ ] Visit http://localhost:5000/api/health → See JSON success response

### Frontend is Working
- [ ] Browser shows login page
- [ ] Can type in email and password fields
- [ ] Error messages appear if validation fails (e.g., short password)

### Full Feature 2 Test

1. **Registration:**
   ```
   Email: student@example.com
   Password: password123
   Confirm Password: password123
   ```
   - Click "Sign Up"
   - Should redirect to editor
   - Header shows "Welcome, student@example.com"

2. **Editor:**
   - Can type in textarea
   - Text input captured on page
   - Click "Logout" → Back to login

3. **Login:**
   - Use same email and password
   - Should login successfully

### Troubleshooting

#### Error: "MongoDB connection error"
- **Solution**: Ensure MongoDB is running
  - Windows: Check Services or start `mongod`
  - macOS: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`

#### Error: "ECONNREFUSED 127.0.0.1:5000" (Frontend can't reach backend)
- **Solution**: 
  - Ensure backend server is running (`npm run dev` in backend folder)
  - Check .env: `REACT_APP_API_URL=http://localhost:5000/api`
  - Check backend .env: `PORT=5000`

#### Error: "ENOTFOUND localhost" (Can't reach frontend)
- **Solution**: 
  - Ensure frontend server is running (`npm start` in frontend folder)
  - Check browser: http://localhost:3000

#### Auth token not persisting
- **Solution**: 
  - Check browser localStorage (F12 → Application → Local Storage)
  - Token should be stored after login
  - If missing, check API console errors

#### "Email already exists" error
- **Solution**: 
  - Use a different email for new registrations
  - Or clear MongoDB database and start fresh

## Running Both Servers

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

### Option 2: Using npm concurrently (Advanced)

Install concurrently:
```bash
npm install -g concurrently
```

Then from root directory:
```bash
concurrently "npm --prefix backend run dev" "npm --prefix frontend start"
```

## Important Files to Know

**Backend Configuration:**
- `backend/.env` - Environment variables
- `backend/src/server.ts` - Main server file
- `backend/src/models/User.ts` - Database schema

**Frontend Configuration:**
- `frontend/.env` - Environment variables
- `frontend/src/App.tsx` - Main app with routing
- `frontend/src/context/AuthContext.tsx` - Auth logic

## Default Credentials

After setup, you can create your own accounts through the registration page. Here's how:

1. Click "Sign up here" on login page
2. Enter email (e.g., student1@example.com)
3. Enter password (min 6 chars)
4. Confirm password
5. Click "Sign Up"

## Available Scripts

**Backend:**
```bash
npm run dev      # Start development server
npm run build    # Compile TypeScript
npm start        # Run compiled version
npm test         # Run tests
```

**Frontend:**
```bash
npm start        # Start dev server (auto-reloads)
npm run build    # Create production build
npm test         # Run tests
npm run eject    # Eject from Create React App (irreversible!)
```

## Next Steps

After Feature 2 is working:
- Feature 3: Capture Keystroke Timing
- Feature 4: Detect Pasted Text
- Feature 5: Save Writing Session Data

## Support

For detailed documentation:
- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Main project: See `README.md`

## Common Issues

| Issue | Solution |
|-------|----------|
| "Port 5000 already in use" | Change PORT in backend/.env or kill process |
| "Port 3000 already in use" | Change PORT in frontend package.json or kill process |
| CORS errors | Ensure FRONTEND_URL in backend/.env matches frontend URL |
| "Cannot find module" | Run `npm install` in respective folder |
| TypeScript errors | Run `npm run build` to see detailed errors |
| "Token request failing" | Check JWT_SECRET consistency between frontend and backend |

## Performance Tips

1. **Use MongoDB Atlas** if possible (better than local for development)
2. **Keep dev tools closed** to reduce memory usage
3. **Use npm ci** instead of npm install for exact versions
4. **Clear browser cache** if styles aren't updating

## Security Reminders

⚠️ **IMPORTANT:**
- Never commit `.env` files with sensitive data
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Don't store raw passwords
- Use environment variables for all secrets

Enjoy using Vi-Notes! 🚀
