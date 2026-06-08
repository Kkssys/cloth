import Coupon from '../models/Coupon.js';

// @desc    Create a coupon
// @route   POST /api/coupons
export const createCoupon = async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    validFrom,
    validUntil,
    usageLimit,
  } = req.body;

  const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
  if (couponExists) {
    return res.status(400).json({ message: 'Coupon code already exists' });
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    validFrom,
    validUntil,
    usageLimit,
  });

  res.status(201).json(coupon);
};

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
export const getCoupons = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  const query = {};
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  const coupons = await Coupon.find(query)
    .sort('-createdAt')
    .limit(limit)
    .skip(startIndex);

  const total = await Coupon.countDocuments(query);

  res.json({
    coupons,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalCoupons: total,
  });
};

// @desc    Get single coupon
// @route   GET /api/coupons/:code
export const getCouponByCode = async (req, res) => {
  const coupon = await Coupon.findOne({ 
    code: req.params.code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  });

  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found or expired' });
  }

  res.json(coupon);
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ 
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  });

  if (!coupon) {
    return res.status(404).json({ 
      valid: false, 
      message: 'Invalid or expired coupon code' 
    });
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ 
      valid: false, 
      message: 'Coupon usage limit exceeded' 
    });
  }

  if (orderAmount < coupon.minOrderAmount) {
    return res.status(400).json({ 
      valid: false, 
      message: `Minimum order amount of ₹${coupon.minOrderAmount} required` 
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    valid: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    },
  });
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found' });
  }

  const {
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    validFrom,
    validUntil,
    usageLimit,
    isActive,
  } = req.body;

  if (discountType) coupon.discountType = discountType;
  if (discountValue) coupon.discountValue = discountValue;
  if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
  if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
  if (validFrom) coupon.validFrom = validFrom;
  if (validUntil) coupon.validUntil = validUntil;
  if (usageLimit) coupon.usageLimit = usageLimit;
  if (isActive !== undefined) coupon.isActive = isActive;

  const updatedCoupon = await coupon.save();
  res.json(updatedCoupon);
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found' });
  }

  await coupon.deleteOne();
  res.json({ message: 'Coupon removed' });
};