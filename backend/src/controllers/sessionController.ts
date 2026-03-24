import { Response } from 'express';
import WritingSession, { IKeystrokeEvent, IPasteEvent } from '../models/WritingSession';
import { AuthRequest } from '../middleware/auth';

/**
 * POST /api/sessions
 * Create a new writing session
 */
export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = typeof req.user === 'string' ? req.user : req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const session = await WritingSession.create({
      userId,
      sessionStartTime: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Writing session created',
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create session',
    });
  }
};

/**
 * PATCH /api/sessions/:sessionId
 * Update session with keystroke and paste events
 */
export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = typeof req.user === 'string' ? req.user : req.user?.id;
    const {
      content,
      keystrokeEvents,
      pasteEvents,
      contentLength,
    } = req.body;

    // Verify session belongs to user
    const session = await WritingSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session',
      });
    }

    // Update session data
    if (content !== undefined) {
      session.content = content;
    }

    if (keystrokeEvents && Array.isArray(keystrokeEvents)) {
      session.keystrokeEvents = keystrokeEvents;
      session.totalKeystrokes = keystrokeEvents.length;
    }

    if (pasteEvents && Array.isArray(pasteEvents)) {
      session.pasteEvents = pasteEvents;
      session.totalPastes = pasteEvents.length;
    }

    if (contentLength !== undefined) {
      session.contentLength = contentLength;
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message: 'Session updated',
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update session',
    });
  }
};

/**
 * POST /api/sessions/:sessionId/keystroke
 * Record a keystroke event
 */
export const recordKeystroke = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = typeof req.user === 'string' ? req.user : req.user?.id;
    const keystrokeEvent: IKeystrokeEvent = req.body;

    const session = await WritingSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    session.keystrokeEvents.push(keystrokeEvent);
    session.totalKeystrokes = session.keystrokeEvents.length;

    await session.save();

    return res.status(200).json({
      success: true,
      message: 'Keystroke recorded',
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to record keystroke',
    });
  }
};

/**
 * POST /api/sessions/:sessionId/paste
 * Record a paste event
 */
export const recordPaste = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = typeof req.user === 'string' ? req.user : req.user?.id;
    const pasteEvent: IPasteEvent = req.body;

    const session = await WritingSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    session.pasteEvents.push(pasteEvent);
    session.totalPastes = session.pasteEvents.length;

    await session.save();

    return res.status(200).json({
      success: true,
      message: 'Paste event recorded',
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to record paste',
    });
  }
};

/**
 * POST /api/sessions/:sessionId/complete
 * Mark session as complete with final content and metadata
 */
export const completeSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = typeof req.user === 'string' ? req.user : req.user?.id;
    const {
      content,
      contentLength,
      keystrokeEvents,
      pasteEvents,
    } = req.body;

    const session = await WritingSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Mark session as complete with end time
    const endTime = new Date();
    session.sessionEndTime = endTime;
    session.totalDuration = endTime.getTime() - session.sessionStartTime.getTime();

    // Update content if provided
    if (content !== undefined) {
      session.content = content;
    }

    // Update content length if provided
    if (contentLength !== undefined) {
      session.contentLength = contentLength;
    }

    // Update keystroke events if provided
    if (keystrokeEvents && Array.isArray(keystrokeEvents)) {
      session.keystrokeEvents = keystrokeEvents;
      session.totalKeystrokes = keystrokeEvents.length;
    }

    // Update paste events if provided
    if (pasteEvents && Array.isArray(pasteEvents)) {
      session.pasteEvents = pasteEvents;
      session.totalPastes = pasteEvents.length;
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message: 'Session completed and saved',
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete session',
    });
  }
};

/**
 * GET /api/sessions/:sessionId
 * Get a specific session
 */
export const getSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = typeof req.user === 'string' ? req.user : req.user?.id;

    const session = await WritingSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get session',
    });
  }
};

/**
 * GET /api/sessions
 * Get all sessions for current user
 */
export const getUserSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = typeof req.user === 'string' ? req.user : req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const sessions = await WritingSession.find({ userId }).sort({
      sessionStartTime: -1,
    });

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get sessions',
    });
  }
};
