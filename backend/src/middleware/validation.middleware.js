import { body, param, query, validationResult } from 'express-validator';
import { APIError } from './error.middleware.js';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new APIError('Validation failed', 400, { errors: errorMessages });
  }
  next();
};

// User validation rules
export const userValidationRules = {
  register: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores and hyphens'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  ],
  updateProfile: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('skills.*').optional().trim().notEmpty().withMessage('Skill cannot be empty'),
  ],
};

// Gig validation rules
export const gigValidationRules = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 10, max: 100 })
      .withMessage('Title must be between 10 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Description must be between 50 and 2000 characters'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required'),
    body('subcategory')
      .trim()
      .notEmpty()
      .withMessage('Subcategory is required'),
    body('packages')
      .isArray({ min: 1 })
      .withMessage('At least one package is required'),
    body('packages.*.name')
      .trim()
      .notEmpty()
      .withMessage('Package name is required'),
    body('packages.*.price')
      .isFloat({ min: 0 })
      .withMessage('Package price must be a positive number'),
    body('packages.*.deliveryTime')
      .isInt({ min: 1 })
      .withMessage('Delivery time must be at least 1 day'),
  ],
};

// Job validation rules
export const jobValidationRules = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 10, max: 100 })
      .withMessage('Title must be between 10 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Description must be between 50 and 2000 characters'),
    body('budget')
      .isFloat({ min: 0 })
      .withMessage('Budget must be a positive number'),
    body('deadline')
      .isISO8601()
      .withMessage('Deadline must be a valid date')
      .custom((value) => new Date(value) > new Date())
      .withMessage('Deadline must be in the future'),
    body('skills')
      .isArray({ min: 1 })
      .withMessage('At least one skill is required'),
    body('skills.*')
      .trim()
      .notEmpty()
      .withMessage('Skill cannot be empty'),
  ],
  submitBid: [
    body('amount')
      .isFloat({ min: 0 })
      .withMessage('Bid amount must be a positive number'),
    body('proposal')
      .trim()
      .isLength({ min: 50, max: 1000 })
      .withMessage('Proposal must be between 50 and 1000 characters'),
    body('deliveryTime')
      .isInt({ min: 1 })
      .withMessage('Delivery time must be at least 1 day'),
  ],
};

// Order validation rules
export const orderValidationRules = {
  create: [
    body('gig')
      .isMongoId()
      .withMessage('Invalid gig ID'),
    body('package')
      .trim()
      .notEmpty()
      .withMessage('Package name is required'),
    body('requirements')
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Requirements cannot exceed 1000 characters'),
  ],
  updateStatus: [
    body('status')
      .isIn(['in_progress', 'completed', 'cancelled', 'under_review'])
      .withMessage('Invalid order status'),
  ],
};

// Review validation rules
export const reviewValidationRules = {
  create: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('content')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Review content must be between 10 and 500 characters'),
    body('communication')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Communication rating must be between 1 and 5'),
    body('serviceDescription')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Service description rating must be between 1 and 5'),
  ],
};

// Wallet validation rules
export const walletValidationRules = {
  connect: [
    body('walletAddress')
      .trim()
      .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)
      .withMessage('Invalid Solana wallet address'),
  ],
  withdraw: [
    body('amount')
      .isFloat({ min: 0.000001 })
      .withMessage('Amount must be greater than 0.000001 SOL'),
    body('destinationAddress')
      .trim()
      .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)
      .withMessage('Invalid Solana wallet address'),
  ],
};

// Chat validation rules
export const chatValidationRules = {
  sendMessage: [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Message content cannot be empty')
      .isLength({ max: 1000 })
      .withMessage('Message cannot exceed 1000 characters'),
    body('attachments')
      .optional()
      .isArray()
      .withMessage('Attachments must be an array'),
    body('attachments.*')
      .optional()
      .isURL()
      .withMessage('Invalid attachment URL'),
  ],
};

// Common validation rules
export const commonValidationRules = {
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format'),
  ],
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
  search: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters long'),
  ],
};