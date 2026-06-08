import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
  markReviewHelpful,
  getRelatedProducts,
  getProductStats,
  getSearchSuggestions,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getProductReviews);

// Protected routes (require authentication)
router.post('/:id/reviews', protect, uploadMultiple, addProductReview);
router.put('/:id/reviews/:reviewId/helpful', protect, markReviewHelpful);

// Admin only routes
router.post('/', protect, admin, uploadMultiple, createProduct);
router.put('/:id', protect, admin, uploadMultiple, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.get('/stats/count', protect, admin, getProductStats);

export default router;