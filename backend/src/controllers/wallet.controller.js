import { Wallet } from '../models/wallet.model.js';
import { Order } from '../models/order.model.js';
import createError from 'http-errors';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Token } from '@solana/spl-token';

const connection = new Connection(process.env.SOLANA_NETWORK);

export const getWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id })
      .populate('escrowAccounts.order')
      .select('-transactions');
    if (!wallet) throw createError(404, 'Wallet not found');

    res.json(wallet);
  } catch (error) {
    next(error);
  }
};

export const createWallet = async (req, res, next) => {
  try {
    const existingWallet = await Wallet.findOne({ user: req.user.id });
    if (existingWallet) throw createError(400, 'Wallet already exists');

    const wallet = new Wallet({
      user: req.user.id,
      address: req.body.address
    });
    await wallet.save();

    res.status(201).json(wallet);
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status
    } = req.query;

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) throw createError(404, 'Wallet not found');

    const query = {};
    if (type) query['transactions.type'] = type;
    if (status) query['transactions.status'] = status;

    const transactions = wallet.transactions
      .filter(tx => {
        if (type && tx.type !== type) return false;
        if (status && tx.status !== status) return false;
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((page - 1) * limit, page * limit);

    const total = wallet.transactions.length;

    res.json({
      transactions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const createEscrow = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    
    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user.id,
      'payment.status': 'pending'
    });
    if (!order) throw createError(404, 'Order not found or not eligible for escrow');

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) throw createError(404, 'Wallet not found');

    if (wallet.balance < amount) {
      throw createError(400, 'Insufficient balance');
    }

    // Create escrow account on Solana
    const escrowAccount = new PublicKey(req.body.escrowAddress);
    
    // Add escrow to wallet
    const escrowData = {
      address: escrowAccount.toString(),
      order: orderId,
      amount,
      status: 'pending'
    };
    
    wallet.escrowAccounts.push(escrowData);
    await wallet.updateBalance(amount, 'escrow_lock');

    // Update order payment status
    order.payment.status = 'completed';
    order.payment.escrowAddress = escrowAccount.toString();
    order.payment.transactionHash = req.body.transactionHash;
    await order.save();

    await wallet.save();
    res.json(wallet);
  } catch (error) {
    next(error);
  }
};

export const releaseEscrow = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user.id,
      status: 'completed'
    });
    if (!order) throw createError(404, 'Order not found or not eligible for release');

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) throw createError(404, 'Wallet not found');

    const escrowIndex = wallet.escrowAccounts.findIndex(
      escrow => escrow.order.toString() === orderId && escrow.status === 'locked'
    );
    if (escrowIndex === -1) throw createError(404, 'Escrow not found');

    const escrow = wallet.escrowAccounts[escrowIndex];
    
    // Release escrow on Solana
    const escrowAccount = new PublicKey(escrow.address);
    // Add your Solana transaction logic here

    // Update escrow status
    escrow.status = 'released';
    wallet.escrowAccounts[escrowIndex] = escrow;

    // Add transaction record
    wallet.transactions.push({
      hash: req.body.transactionHash,
      type: 'escrow_release',
      amount: escrow.amount,
      status: 'confirmed',
      relatedOrder: orderId,
      description: 'Escrow released for completed order'
    });

    await wallet.save();
    res.json(wallet);
  } catch (error) {
    next(error);
  }
};

export const refundEscrow = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findOne({
      _id: orderId,
      seller: req.user.id,
      status: 'cancelled'
    });
    if (!order) throw createError(404, 'Order not found or not eligible for refund');

    const buyerWallet = await Wallet.findOne({ user: order.buyer });
    if (!buyerWallet) throw createError(404, 'Buyer wallet not found');

    const escrowIndex = buyerWallet.escrowAccounts.findIndex(
      escrow => escrow.order.toString() === orderId && escrow.status === 'locked'
    );
    if (escrowIndex === -1) throw createError(404, 'Escrow not found');

    const escrow = buyerWallet.escrowAccounts[escrowIndex];
    
    // Refund escrow on Solana
    const escrowAccount = new PublicKey(escrow.address);
    // Add your Solana transaction logic here

    // Update escrow status
    escrow.status = 'refunded';
    buyerWallet.escrowAccounts[escrowIndex] = escrow;

    // Add transaction record
    buyerWallet.transactions.push({
      hash: req.body.transactionHash,
      type: 'escrow_refund',
      amount: escrow.amount,
      status: 'confirmed',
      relatedOrder: orderId,
      description: 'Escrow refunded for cancelled order'
    });

    await buyerWallet.updateBalance(escrow.amount, 'escrow_refund');
    await buyerWallet.save();
    res.json({ message: 'Escrow refunded successfully' });
  } catch (error) {
    next(error);
  }
};

export const syncWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) throw createError(404, 'Wallet not found');

    const publicKey = new PublicKey(wallet.address);
    const balance = await connection.getBalance(publicKey);
    
    wallet.balance = balance / 1e9; // Convert lamports to SOL
    wallet.lastSynced = Date.now();
    await wallet.save();

    res.json(wallet);
  } catch (error) {
    next(error);
  }
};