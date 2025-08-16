import express from 'express';
import { body } from 'express-validator';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  submitBid,
  acceptBid,
  completeJob
} from '../controllers/job.controller.js';
import { verifyToken, verifyCivicAuth, verifyWalletConnection } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation middleware
const jobValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required'),
  body('budget')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom(value => value >= 0)
    .withMessage('Budget must be greater than or equal to 0'),
  body('deadline')
    .isISO8601()
    .withMessage('Invalid deadline date')
    .custom(value => new Date(value) > new Date())
    .withMessage('Deadline must be in the future'),
  body('category')
    .isIn(['Development', 'Design', 'Marketing', 'Writing', 'Other'])
    .withMessage('Invalid category'),
  body('skills')
    .isArray()
    .withMessage('Skills must be an array')
];

const bidValidation = [
  body('amount')
    .isNumeric()
    .withMessage('Bid amount must be a number')
    .custom(value => value >= 0)
    .withMessage('Bid amount must be greater than or equal to 0'),
  body('proposal')
    .trim()
    .notEmpty()
    .withMessage('Proposal is required')
];

const completionValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .trim()
    .notEmpty()
    .withMessage('Review is required')
];

// Apply authentication middleware to all routes
router.use(verifyToken);

// Public routes (require only authentication)
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes (require Civic verification and wallet connection)
router.use(verifyCivicAuth);
router.use(verifyWalletConnection);

router.post('/', jobValidation, createJob);
router.put('/:id', jobValidation, updateJob);
router.post('/:id/bid', bidValidation, submitBid);
router.post('/:jobId/bid/:bidId/accept', acceptBid);
router.post('/:id/complete', completionValidation, completeJob);

export default router;