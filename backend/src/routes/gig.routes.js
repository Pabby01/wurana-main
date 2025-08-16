import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import * as gigController from '../controllers/gig.controller.js';

const router = express.Router();

// Gig CRUD operations
router.post('/', auth, gigController.createGig);
router.put('/:id', auth, gigController.updateGig);
router.delete('/:id', auth, gigController.deleteGig);
router.get('/:id', gigController.getGig);
router.get('/', gigController.listGigs);

// Seller gig management
router.get('/seller/gigs', auth, gigController.getSellerGigs);
router.patch('/:id/status', auth, gigController.toggleGigStatus);

// Gig images
router.post('/:id/images', auth, upload.array('images', 5), gigController.uploadGigImages);
router.delete('/:id/images/:key', auth, gigController.removeGigImage);

// Featured and similar gigs
router.get('/featured/list', gigController.getFeaturedGigs);
router.get('/:id/similar', gigController.getSimilarGigs);

export default router;