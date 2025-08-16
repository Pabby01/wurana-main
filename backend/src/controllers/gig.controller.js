import Gig from '../models/gig.model.js';
import Order from '../models/order.model.js';
import File from '../models/file.model.js';
import createError from 'http-errors';

export const createGig = async (req, res, next) => {
  try {
    const gigData = { ...req.body, seller: req.user.id };
    const gig = new Gig(gigData);
    await gig.save();
    res.status(201).json(gig);
  } catch (error) {
    next(error);
  }
};

export const updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, seller: req.user.id });
    if (!gig) throw createError(404, 'Gig not found');

    Object.assign(gig, req.body);
    await gig.save();
    res.json(gig);
  } catch (error) {
    next(error);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, seller: req.user.id });
    if (!gig) throw createError(404, 'Gig not found');

    gig.status = 'deleted';
    await gig.save();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, status: 'published' })
      .populate('seller', 'username avatar stats');
    if (!gig) throw createError(404, 'Gig not found');

    gig.stats.views += 1;
    await gig.save();
    res.json(gig);
  } catch (error) {
    next(error);
  }
};

export const listGigs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      subcategory,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const query = { status: 'published' };
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice || maxPrice) {
      query['packages.price'] = {};
      if (minPrice) query['packages.price'].$gte = Number(minPrice);
      if (maxPrice) query['packages.price'].$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const gigs = await Gig.find(query)
      .populate('seller', 'username avatar stats')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Gig.countDocuments(query);

    res.json({
      gigs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ seller: req.user.id }).sort('-createdAt');
    res.json(gigs);
  } catch (error) {
    next(error);
  }
};

export const toggleGigStatus = async (req, res, next) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, seller: req.user.id });
    if (!gig) throw createError(404, 'Gig not found');

    gig.status = req.body.status;
    await gig.save();
    res.json(gig);
  } catch (error) {
    next(error);
  }
};

export const uploadGigImages = async (req, res, next) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, seller: req.user.id });
    if (!gig) throw createError(404, 'Gig not found');

    const files = req.files.map(file => ({
      url: file.location,
      key: file.key
    }));

    gig.images.push(...files);
    await gig.save();
    res.json(gig);
  } catch (error) {
    next(error);
  }
};

export const removeGigImage = async (req, res, next) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, seller: req.user.id });
    if (!gig) throw createError(404, 'Gig not found');

    const imageIndex = gig.images.findIndex(img => img.key === req.params.key);
    if (imageIndex === -1) throw createError(404, 'Image not found');

    gig.images.splice(imageIndex, 1);
    await gig.save();
    res.json(gig);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ status: 'published' })
      .sort('-stats.orders -stats.avgRating')
      .limit(6)
      .populate('seller', 'username avatar stats');
    res.json(gigs);
  } catch (error) {
    next(error);
  }
};

export const getSimilarGigs = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) throw createError(404, 'Gig not found');

    const similarGigs = await Gig.find({
      _id: { $ne: gig._id },
      category: gig.category,
      status: 'published'
    })
      .limit(4)
      .populate('seller', 'username avatar stats');

    res.json(similarGigs);
  } catch (error) {
    next(error);
  }
};