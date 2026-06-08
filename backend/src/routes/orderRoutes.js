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

// SPECIFIC ROUTES (no parameters) - MUST come first
router.get('/report', protect, admin, getOrdersByDateRange);
router.get('/myorders', protect, getMyOrders);
router.post('/razorpay', protect, admin, createRazorpayOrder);

// GENERAL ROUTES
router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

// PARAMETER ROUTES (with :id) - MUST come last
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/shipping', protect, admin, updateShippingDetails);
router.get('/:id/shipping', protect, getShippingDetails);
router.get('/:id', protect, getOrderById);

export default router;