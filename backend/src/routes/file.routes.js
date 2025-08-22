import express from 'express';
import { verifyToken as auth } from '../middleware/auth.middleware.js';
import * as fileController from '../controllers/file.controller.js';

const router = express.Router();

// File upload operations
router.post('/upload-url', auth, fileController.getUploadUrl);
router.post('/:fileId/confirm', auth, fileController.confirmUpload);
router.delete('/:fileId', auth, fileController.deleteFile);

// File retrieval
router.get('/', auth, fileController.getFiles);

export default router;