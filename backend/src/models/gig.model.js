import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packages: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    deliveryTime: { type: Number, required: true },
    price: { type: Number, required: true },
    revisions: { type: Number, default: 1 },
    features: [String]
  }],
  images: [{
    url: { type: String, required: true },
    key: { type: String, required: true }
  }],
  tags: [String],
  requirements: [{
    question: { type: String, required: true },
    required: { type: Boolean, default: true }
  }],
  stats: {
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    completionRate: { type: Number, default: 100 },
    avgRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'paused', 'deleted'],
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

gigSchema.index({ title: 'text', description: 'text', tags: 'text' });

gigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Gig', gigSchema);