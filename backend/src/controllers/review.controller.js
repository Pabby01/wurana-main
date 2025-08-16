const Review = require('../models/review.model');
const Order = require('../models/order.model');
const Gig = require('../models/gig.model');
const createError = require('http-errors');

exports.createReview = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.body.order,
      buyer: req.user.id,
      status: 'completed'
    });
    if (!order) throw createError(404, 'Order not found or not eligible for review');

    const existingReview = await Review.findOne({ order: order._id });
    if (existingReview) throw createError(400, 'Review already exists for this order');

    const reviewData = {
      ...req.body,
      reviewer: req.user.id,
      seller: order.seller,
      gig: order.gig
    };

    const review = new Review(reviewData);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user.id,
      status: 'published'
    });
    if (!review) throw createError(404, 'Review not found');

    const allowedUpdates = ['rating', 'communication', 'serviceAsDescribed', 'content'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) throw createError(400, 'Invalid updates');

    updates.forEach(update => review[update] = req.body[update]);
    await review.save();
    res.json(review);
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user.id,
      status: 'published'
    });
    if (!review) throw createError(404, 'Review not found');

    review.status = 'removed';
    await review.save();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.respondToReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      seller: req.user.id,
      status: 'published'
    });
    if (!review) throw createError(404, 'Review not found');

    if (review.response) throw createError(400, 'Response already exists');

    review.response = {
      content: req.body.content,
      createdAt: Date.now()
    };
    await review.save();
    res.json(review);
  } catch (error) {
    next(error);
  }
};

exports.getGigReviews = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      rating
    } = req.query;

    const query = { gig: req.params.gigId, status: 'published' };
    if (rating) query.rating = Number(rating);

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(query)
      .populate('reviewer', 'username avatar')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getSellerReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      seller: req.params.sellerId,
      status: 'published'
    })
      .populate('reviewer', 'username avatar')
      .populate('gig', 'title')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.markReviewHelpful = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      status: 'published'
    });
    if (!review) throw createError(404, 'Review not found');

    const userId = req.user.id;
    const hasMarked = review.helpful.users.includes(userId);

    if (hasMarked) {
      review.helpful.users.pull(userId);
      review.helpful.count -= 1;
    } else {
      review.helpful.users.push(userId);
      review.helpful.count += 1;
    }

    await review.save();
    res.json(review);
  } catch (error) {
    next(error);
  }
};

exports.reportReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      status: 'published'
    });
    if (!review) throw createError(404, 'Review not found');

    const userId = req.user.id;
    if (review.reported.reportedBy.includes(userId)) {
      throw createError(400, 'You have already reported this review');
    }

    review.reported.status = true;
    review.reported.reason = req.body.reason;
    review.reported.reportedBy.push(userId);

    await review.save();
    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    next(error);
  }
};