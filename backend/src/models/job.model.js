import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Development', 'Design', 'Marketing', 'Writing', 'Other']
  },
  skills: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bids: [{
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    proposal: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending'
    }
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'in_escrow', 'released', 'disputed'],
    default: 'pending'
  },
  completionDetails: {
    completedAt: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
jobSchema.methods.updateStatus = async function(status) {
  this.status = status;
  this.updatedAt = new Date();
  return this.save();
};

jobSchema.methods.addBid = async function(bid) {
  this.bids.push(bid);
  this.updatedAt = new Date();
  return this.save();
};

jobSchema.methods.updateBidStatus = async function(bidId, status) {
  const bid = this.bids.id(bidId);
  if (bid) {
    bid.status = status;
    this.updatedAt = new Date();
    return this.save();
  }
  throw new Error('Bid not found');
};

jobSchema.methods.addMilestone = async function(milestone) {
  this.milestones.push(milestone);
  this.updatedAt = new Date();
  return this.save();
};

jobSchema.methods.updateMilestoneStatus = async function(milestoneId, status) {
  const milestone = this.milestones.id(milestoneId);
  if (milestone) {
    milestone.status = status;
    this.updatedAt = new Date();
    return this.save();
  }
  throw new Error('Milestone not found');
};

// Static methods
jobSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

jobSchema.statics.findBySkills = function(skills) {
  return this.find({ skills: { $in: skills } });
};

jobSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

const Job = mongoose.model('Job', jobSchema);

export default Job;