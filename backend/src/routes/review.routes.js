import express from 'express';
import { verifyToken as auth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import * as reviewController from '../controllers/review.controller.js';

const router = express.Router();

// Review CRUD operations
router.post('/', auth, reviewController.createReview);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

// Seller response to review
router.post('/:id/response', auth, reviewController.respondToReview);

// Get reviews
router.get('/gig/:gigId', reviewController.getGigReviews);
router.get('/seller/:sellerId', reviewController.getSellerReviews);

// Review interactions
router.post('/:id/helpful', auth, reviewController.markReviewHelpful);
router.post('/:id/report', auth, reviewController.reportReview);

export default router;