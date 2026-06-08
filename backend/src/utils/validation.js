import { body, validationResult } from 'express-validator';

// Product validation rules
export const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['Men', 'Women', 'Kids', 'Accessories', 'Footwear'])
    .withMessage('Invalid category'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }),
  body('discount').optional().isNumeric().isFloat({ min: 0, max: 100 }),
  body('stock').isNumeric().withMessage('Stock must be a number').isInt({ min: 0 }),
  body('size').optional().isArray(),
  body('color').optional().isArray(),
];

// Order validation rules
export const validateOrder = [
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  body('paymentMethod').isIn(['razorpay', 'cod']).withMessage('Invalid payment method'),
];

// Review validation rules
export const validateReview = [
  body('rating').isNumeric().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }),
];

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  next();
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 1000); // Limit length
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Validate price range
export const isValidPriceRange = (minPrice, maxPrice) => {
  if (minPrice && maxPrice && minPrice > maxPrice) {
    return false;
  }
  return true;
};

// Pagination helper
export const getPagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};