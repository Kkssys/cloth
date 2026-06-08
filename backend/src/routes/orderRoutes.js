import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  createRazorpayOrder,
  cancelOrder,
  updateShippingDetails,
  getShippingDetails,
  getOrdersByDateRange,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require login)
router.post('/', protect, createOrder);  // Add 'protect' here
router.get('/myorders', protect, getMyOrders);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id/shipping', protect, getShippingDetails);
router.get('/:id', protect, getOrderById);
router.get('/report', protect, admin, getOrdersByDateRange);

// Admin only routes
router.get('/', protect, admin, getAllOrders);
router.post('/razorpay', protect, admin, createRazorpayOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/shipping', protect, admin, updateShippingDetails);

export default router;