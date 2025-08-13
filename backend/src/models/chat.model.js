import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  messages: [messageSchema],
  lastMessage: {
    type: messageSchema,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
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
chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
chatSchema.methods.addMessage = async function(messageData) {
  const message = {
    ...messageData,
    readBy: [messageData.sender]
  };
  
  this.messages.push(message);
  this.lastMessage = message;
  this.updatedAt = new Date();
  
  return this.save();
};

chatSchema.methods.markAsRead = async function(userId) {
  this.messages.forEach(message => {
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
    }
  });
  
  this.updatedAt = new Date();
  return this.save();
};

chatSchema.methods.archive = async function() {
  this.status = 'archived';
  this.updatedAt = new Date();
  return this.save();
};

// Static methods
chatSchema.statics.findByParticipant = function(userId) {
  return this.find({
    participants: userId,
    status: 'active'
  })
    .populate('participants', 'username profile')
    .populate('job', 'title status')
    .sort({ updatedAt: -1 });
};

chatSchema.statics.findByJob = function(jobId) {
  return this.find({
    job: jobId,
    status: 'active'
  })
    .populate('participants', 'username profile')
    .populate('job', 'title status');
};

chatSchema.statics.findExistingChat = async function(participantIds, jobId) {
  return this.findOne({
    participants: { $all: participantIds },
    job: jobId,
    status: 'active'
  });
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;