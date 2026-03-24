import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = null;

  // Check for token in Authorization header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your_secret_key_here_change_in_production';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

export const optional = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = null;

  // Check for token in Authorization header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'your_secret_key_here_change_in_production';
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
    } catch (error: any) {
      // Token is invalid but we continue anyway
    }
  }

  next();
};
