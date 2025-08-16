const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true, unique: true },
  network: { type: String, default: 'solana' },
  balance: { type: Number, default: 0 },
  escrowAccounts: [{
    address: { type: String, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'locked', 'released', 'refunded'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
  }],
  transactions: [{
    hash: { type: String, required: true },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'escrow_lock', 'escrow_release', 'escrow_refund', 'payment'],
      required: true
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending'
    },
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    description: String,
    createdAt: { type: Date, default: Date.now }
  }],
  settings: {
    autoAcceptPayments: { type: Boolean, default: true },
    notifyOnTransactions: { type: Boolean, default: true },
    defaultCurrency: { type: String, default: 'USD' }
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  lastSynced: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

walletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

walletSchema.methods.updateBalance = async function(amount, type) {
  if (type === 'deposit' || type === 'escrow_release') {
    this.balance += amount;
  } else if (type === 'withdrawal' || type === 'escrow_lock') {
    this.balance -= amount;
  }
  return this.save();
};

walletSchema.methods.addTransaction = function(transactionData) {
  this.transactions.push({
    ...transactionData,
    createdAt: Date.now()
  });
  return this.save();
};

walletSchema.methods.createEscrowAccount = function(orderData) {
  this.escrowAccounts.push({
    ...orderData,
    createdAt: Date.now()
  });
  return this.save();
};

module.exports = mongoose.model('Wallet', walletSchema);