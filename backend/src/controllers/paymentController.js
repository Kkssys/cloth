import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

// Check if Razorpay keys are available
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

console.log('Razorpay Key ID exists:', !!RAZORPAY_KEY_ID);
console.log('Razorpay Key Secret exists:', !!RAZORPAY_KEY_SECRET);

// Initialize Razorpay instance only if keys exist
let razorpayInstance = null;

if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  } catch (error) {
    console.error('❌ Razorpay initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ Razorpay keys not found. Payment will not work.');
}

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
export const createRazorpayOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpayInstance) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay is not configured. Please check API keys.',
      });
    }

    const { amount, orderId } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      payment_capture: 1,
      notes: {
        orderId: orderId,
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpayInstance.orders.create(options);
    
    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify-payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Create signature to verify
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Verify signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature. Payment verification failed!',
      });
    }

    // Update order status in database
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'Completed',
        update_time: new Date().toISOString(),
        email_address: req.user?.email || '',
      };
      await order.save();
    }

    res.json({
      success: true,
      message: 'Payment verified successfully!',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};