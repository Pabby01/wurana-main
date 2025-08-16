const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  relatedTo: {
    model: {
      type: String,
      enum: ['Gig', 'Order', 'Review', 'User', 'Message'],
      required: true
    },
    id: { type: mongoose.Schema.Types.ObjectId, required: true }
  },
  purpose: {
    type: String,
    enum: ['profile', 'gig', 'delivery', 'message', 'review'],
    required: true
  },
  status: {
    type: String,
    enum: ['temporary', 'permanent', 'deleted'],
    default: 'permanent'
  },
  metadata: {
    width: Number,
    height: Number,
    duration: Number,
    thumbnail: String,
    pages: Number
  },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

fileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

fileSchema.index({ key: 1 });
fileSchema.index({ uploadedBy: 1 });
fileSchema.index({ 'relatedTo.model': 1, 'relatedTo.id': 1 });

module.exports = mongoose.model('File', fileSchema);