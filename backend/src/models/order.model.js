const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: {
    name: { type: String, required: true },
    description: String,
    deliveryTime: Number,
    price: { type: Number, required: true },
    revisions: Number,
    features: [String]
  },
  requirements: [{
    question: String,
    answer: String,
    attachments: [{
      url: String,
      key: String,
      type: String
    }]
  }],
  deliverables: [{
    message: String,
    files: [{
      url: String,
      key: String,
      type: String,
      name: String
    }],
    submittedAt: Date
  }],
  revisions: [{
    request: {
      message: String,
      files: [{
        url: String,
        key: String,
        type: String
      }],
      requestedAt: Date
    },
    delivery: {
      message: String,
      files: [{
        url: String,
        key: String,
        type: String
      }],
      deliveredAt: Date
    }
  }],
  payment: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
    },
    transactionHash: String,
    escrowAddress: String
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered', 'revision_requested', 'completed', 'cancelled'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  dueDate: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isNew) {
    const deliveryTime = this.package.deliveryTime || 0;
    this.dueDate = new Date(Date.now() + deliveryTime * 24 * 60 * 60 * 1000);
    this.timeline.push({
      status: 'pending',
      message: 'Order created'
    });
  }
  next();
});

orderSchema.methods.updateStatus = function(status, message) {
  this.status = status;
  this.timeline.push({
    status,
    message,
    timestamp: Date.now()
  });
  if (status === 'completed') {
    this.completedAt = Date.now();
  }
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);