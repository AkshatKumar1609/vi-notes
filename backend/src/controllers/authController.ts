import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Generate JWT Token
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'your_secret_key_here_change_in_production';
  return jwt.sign(
    { id },
    secret,
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as any
  );
};

// Register User
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, passwordConfirm } = req.body;

    // Validation
    if (!email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email, password, and password confirmation',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Create new user
    user = await User.create({
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// Login User
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// Get Current User
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = typeof req.user === 'string' ? req.user : req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
