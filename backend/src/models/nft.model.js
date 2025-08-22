import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mintAddress: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['review_badge', 'achievement_badge', 'special_badge'],
    required: true
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: function() {
      return this.type === 'review_badge';
    }
  },
  metadata: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    attributes: [{
      trait_type: String,
      value: String
    }],
    external_url: String,
    animation_url: String
  },
  status: {
    type: String,
    enum: ['pending', 'minting', 'minted', 'failed'],
    default: 'pending'
  },
  mintingDetails: {
    transactionHash: String,
    signature: String,
    blockNumber: Number,
    timestamp: Date,
    error: String
  },
  collectionDetails: {
    name: String,
    symbol: String,
    collectionMint: String
  },
  transferHistory: [{
    from: String,
    to: String,
    transactionHash: String,
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Update timestamps pre save
nftSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to update minting status
nftSchema.methods.updateMintingStatus = async function(status, details = {}) {
  this.status = status;
  
  if (status === 'minted') {
    this.mintingDetails = {
      ...this.mintingDetails,
      ...details,
      timestamp: new Date()
    };
  } else if (status === 'failed') {
    this.mintingDetails.error = details.error;
  }
  
  return this.save();
};

// Method to add transfer record
nftSchema.methods.addTransfer = async function(from, to, transactionHash) {
  this.transferHistory.push({
    from,
    to,
    transactionHash,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update metadata
nftSchema.methods.updateMetadata = async function(metadata) {
  this.metadata = {
    ...this.metadata,
    ...metadata
  };
  return this.save();
};

// Static method to find user's NFTs
nftSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId })
    .sort({ createdAt: -1 })
    .populate('review', 'rating content createdAt');
};

// Static method to find NFTs by type
nftSchema.statics.findByType = function(type) {
  return this.find({ type })
    .sort({ createdAt: -1 })
    .populate('owner', 'username profile');
};

const NFT = mongoose.model('NFT', nftSchema);

export default NFT;