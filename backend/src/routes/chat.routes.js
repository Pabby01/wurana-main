import express from 'express';
import { body } from 'express-validator';
import {
  initializeChat,
  getUserChats,
  getChatById,
  sendMessage,
  archiveChat
} from '../controllers/chat.controller.js';
import { verifyToken, verifyCivicAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation middleware
const initializeChatValidation = [
  body('participantId')
    .notEmpty()
    .withMessage('Participant ID is required'),
  body('jobId')
    .notEmpty()
    .withMessage('Job ID is required')
];

const messageValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required'),
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array')
];

// Apply authentication middleware to all routes
router.use(verifyToken);
router.use(verifyCivicAuth);

// Chat routes
router.post('/', initializeChatValidation, initializeChat);
router.get('/', getUserChats);
router.get('/:id', getChatById);
router.post('/:id/messages', messageValidation, sendMessage);
router.post('/:id/archive', archiveChat);

export default router;