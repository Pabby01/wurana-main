import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'escrow_hold', 'escrow_release', 'escrow_refund', 'platform_fee'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['SOL', 'USD'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: function() {
      return ['escrow_hold', 'escrow_release', 'escrow_refund', 'platform_fee'].includes(this.type);
    }
  },
  paymentDetails: {
    provider: {
      type: String,
      enum: ['solana', 'paj_cash'],
      required: true
    },
    transactionHash: String,
    escrowAddress: String,
    paymentId: String,
    bankReference: String,
    failureReason: String
  },
  metadata: {
    description: String,
    notes: String,
    additionalData: mongoose.Schema.Types.Mixed
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  platformFee: {
    amount: Number,
    currency: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  completedAt: Date
});

// Update timestamps pre save
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Method to update status
transactionSchema.methods.updateStatus = async function(status, details = {}) {
  this.status = status;
  
  if (details.failureReason) {
    this.paymentDetails.failureReason = details.failureReason;
  }
  
  if (details.transactionHash) {
    this.paymentDetails.transactionHash = details.transactionHash;
  }
  
  if (status === 'completed') {
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Static method to create a new transaction
transactionSchema.statics.createTransaction = async function(data) {
  const transaction = new this({
    ...data,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return transaction.save();
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;