import express, { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router: Router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, passwordConfirm }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login a user
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Get current user (protected route)
 * Requires: Authorization Bearer token
 */
router.get('/me', protect, getMe);

export default router;
