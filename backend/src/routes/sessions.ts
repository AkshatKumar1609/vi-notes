import express, { Router } from 'express';
import {
  createSession,
  updateSession,
  recordKeystroke,
  recordPaste,
  completeSession,
  getSession,
  getUserSessions,
} from '../controllers/sessionController';
import { protect } from '../middleware/auth';

const router: Router = express.Router();

// All session routes require authentication
router.use(protect);

/**
 * POST /api/sessions
 * Create a new writing session
 * Requires: Authorization Bearer token
 */
router.post('/', createSession);

/**
 * GET /api/sessions
 * Get all writing sessions for current user
 * Requires: Authorization Bearer token
 */
router.get('/', getUserSessions);

/**
 * GET /api/sessions/:sessionId
 * Get a specific writing session
 * Requires: Authorization Bearer token
 */
router.get('/:sessionId', getSession);

/**
 * PATCH /api/sessions/:sessionId
 * Update a writing session with keystroke and paste events
 * Requires: Authorization Bearer token
 * Body: { content?, keystrokeEvents?, pasteEvents?, contentLength? }
 */
router.patch('/:sessionId', updateSession);

/**
 * POST /api/sessions/:sessionId/keystroke
 * Record a keystroke event
 * Requires: Authorization Bearer token
 * Body: { timestamp, keyCode, duration }
 */
router.post('/:sessionId/keystroke', recordKeystroke);

/**
 * POST /api/sessions/:sessionId/paste
 * Record a paste event
 * Requires: Authorization Bearer token
 * Body: { timestamp, textLength, position }
 */
router.post('/:sessionId/paste', recordPaste);

/**
 * POST /api/sessions/:sessionId/complete
 * Mark a session as complete
 * Requires: Authorization Bearer token
 * Body: { content?, contentLength? }
 */
router.post('/:sessionId/complete', completeSession);

export default router;
