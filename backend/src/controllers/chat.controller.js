import Chat from '../models/chat.model.js';
import Job from '../models/job.model.js';

// Initialize or get chat
export const initializeChat = async (req, res) => {
  try {
    const { participantId, jobId } = req.body;
    
    // Verify job exists and participant is involved
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Ensure the requesting user is either the job creator or the participant
    if (job.creator.toString() !== req.user.id && participantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to initialize this chat'
      });
    }

    // Check for existing chat
    const participantIds = [req.user.id, participantId];
    let chat = await Chat.findExistingChat(participantIds, jobId);

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: participantIds,
        job: jobId
      });
      await chat.save();
    }

    await chat.populate('participants', 'username profile');
    await chat.populate('job', 'title status');

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initializing chat',
      error: error.message
    });
  }
};

// Get user's chats
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.findByParticipant(req.user.id);

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chats',
      error: error.message
    });
  }
};

// Get chat by ID
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'username profile')
      .populate('job', 'title status');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is a participant
    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    // Mark messages as read
    await chat.markAsRead(req.user.id);

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chat',
      error: error.message
    });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { content, attachments } = req.body;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is a participant
    if (!chat.participants.some(p => p.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this chat'
      });
    }

    const messageData = {
      sender: req.user.id,
      content,
      attachments: attachments || []
    };

    await chat.addMessage(messageData);
    await chat.populate('participants', 'username profile');
    await chat.populate('job', 'title status');

    // Emit socket event for real-time updates
    req.io.to(chatId).emit('new_message', {
      chat: chat._id,
      message: chat.lastMessage
    });

    res.json({
      success: true,
      message: chat.lastMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Archive chat
export const archiveChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is a participant
    if (!chat.participants.some(p => p.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to archive this chat'
      });
    }

    await chat.archive();

    res.json({
      success: true,
      message: 'Chat archived successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error archiving chat',
      error: error.message
    });
  }
};