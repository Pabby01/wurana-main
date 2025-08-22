import express from 'express';
import { verifyToken as auth } from '../middleware/auth.middleware.js';
import * as walletController from '../controllers/wallet.controller.js';

const router = express.Router();

// Wallet management
router.get('/', auth, walletController.getWallet);
router.post('/', auth, walletController.createWallet);
router.get('/transactions', auth, walletController.getTransactions);
router.post('/sync', auth, walletController.syncWallet);

// Escrow operations
router.post('/escrow', auth, walletController.createEscrow);
router.post('/escrow/release', auth, walletController.releaseEscrow);
router.post('/escrow/refund', auth, walletController.refundEscrow);

export default router;