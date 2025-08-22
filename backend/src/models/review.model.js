import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  communication: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  serviceAsDescribed: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  response: {
    content: String,
    createdAt: Date
  },
  attachments: [{
    url: String,
    key: String,
    type: String
  }],
  helpful: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  reported: {
    status: { type: Boolean, default: false },
    reason: String,
    reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'removed'],
    default: 'published'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

reviewSchema.post('save', async function(doc) {
  const Gig = mongoose.model('Gig');
  const gig = await Gig.findById(doc.gig);
  
  if (gig) {
    const reviews = await this.model('Review').find({ gig: gig._id, status: 'published' });
    const totalRatings = reviews.length;
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalRatings;
    
    gig.stats.avgRating = avgRating;
    gig.stats.totalRatings = totalRatings;
    await gig.save();
  }
});

export default mongoose.model('Review', reviewSchema);