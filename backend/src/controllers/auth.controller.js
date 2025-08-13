import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { Connection, PublicKey } from '@solana/web3.js';

// JWT token generation
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Register new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        civicVerified: user.civicVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        civicVerified: user.civicVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Connect wallet
export const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const userId = req.user.id;

    // Validate wallet address
    try {
      new PublicKey(walletAddress);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address'
      });
    }

    // Update user's wallet address
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.updateWalletAddress(walletAddress);

    res.json({
      success: true,
      message: 'Wallet connected successfully',
      walletAddress: user.walletAddress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error connecting wallet',
      error: error.message
    });
  }
};

// Verify Civic identity
export const verifyCivic = async (req, res) => {
  try {
    const { civicToken } = req.body;
    const userId = req.user.id;

    // Update user's Civic verification status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.updateCivicVerification(civicToken);

    res.json({
      success: true,
      message: 'Civic verification successful',
      civicVerified: user.civicVerified
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying Civic identity',
      error: error.message
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};