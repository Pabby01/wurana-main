import Job from '../models/job.model.js';

// Create a new job
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      creator: req.user.id
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

// Get all jobs with filters
export const getJobs = async (req, res) => {
  try {
    const {
      category,
      status,
      skills,
      minBudget,
      maxBudget,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (skills) query.skills = { $in: skills.split(',') };
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('creator', 'username profile')
      .populate('assignedTo', 'username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('creator', 'username profile')
      .populate('assignedTo', 'username profile')
      .populate('bids.bidder', 'username profile');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('creator', 'username profile');

    res.json({
      success: true,
      job: updatedJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// Submit bid
export const submitBid = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Job is not open for bidding'
      });
    }

    const existingBid = job.bids.find(
      bid => bid.bidder.toString() === req.user.id
    );

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this job'
      });
    }

    const bid = {
      bidder: req.user.id,
      amount: req.body.amount,
      proposal: req.body.proposal
    };

    await job.addBid(bid);

    res.json({
      success: true,
      message: 'Bid submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting bid',
      error: error.message
    });
  }
};

// Accept bid
export const acceptBid = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept bids for this job'
      });
    }

    const bid = job.bids.id(req.params.bidId);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    await job.updateBidStatus(req.params.bidId, 'accepted');
    job.status = 'in_progress';
    job.assignedTo = bid.bidder;
    await job.save();

    res.json({
      success: true,
      message: 'Bid accepted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accepting bid',
      error: error.message
    });
  }
};

// Complete job
export const completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this job'
      });
    }

    job.status = 'completed';
    job.completionDetails = {
      completedAt: new Date(),
      rating: req.body.rating,
      review: req.body.review
    };

    await job.save();

    res.json({
      success: true,
      message: 'Job marked as completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing job',
      error: error.message
    });
  }
};