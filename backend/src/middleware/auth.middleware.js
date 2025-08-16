import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Verify JWT token middleware
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

// Verify Civic authentication middleware
export const verifyCivicAuth = async (req, res, next) => {
  try {
    if (!req.user.civicVerified) {
      return res.status(403).json({
        success: false,
        message: 'Civic verification required'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying Civic authentication',
      error: error.message
    });
  }
};

// Verify wallet connection middleware
export const verifyWalletConnection = async (req, res, next) => {
  try {
    if (!req.user.walletAddress) {
      return res.status(403).json({
        success: false,
        message: 'Wallet connection required'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying wallet connection',
      error: error.message
    });
  }
};

// Rate limiting middleware
export const rateLimiter = (req, res, next) => {
  // Implement rate limiting logic here if needed
  next();
};