import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import razorpay from '../config/razorpay.js';
import Coupon from '../models/Coupon.js';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    // Verify authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Please login to place order' 
      });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponCode,
      estimatedDelivery,
    } = req.body;

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No order items provided' 
      });
    }

    if (!shippingAddress || !shippingAddress.fullName) {
      return res.status(400).json({ 
        success: false,
        message: 'Shipping address is incomplete' 
      });
    }

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() },
      });
      
      if (coupon && coupon.usedCount < coupon.usageLimit) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (totalPrice * coupon.discountValue) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else {
          discountAmount = coupon.discountValue;
        }
        
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: (Number(totalPrice) || 0) - discountAmount,
      discountAmount,
      couponCode: couponCode || '',
      estimatedDelivery: estimatedDelivery || '',
    });

    // Clear user's cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    // Update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(limit)
      .skip(startIndex);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot change status of a cancelled order' 
      });
    }

    order.orderStatus = status;
    
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    res.json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order (by user)
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    if (!req.user || order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to cancel this order' 
      });
    }

    if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Processing') {
      return res.status(400).json({ 
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}` 
      });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update shipping/tracking details (admin)
// @route   PUT /api/orders/:id/shipping
export const updateShippingDetails = async (req, res) => {
  try {
    const { 
      trackingNumber, 
      courierService, 
      courierServiceOther,
      shippedDate,
      expectedDeliveryDate,
      trackingUrl,
      shippingNote 
    } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    order.shippingDetails = {
      trackingNumber: trackingNumber || '',
      courierService: courierService || '',
      courierServiceOther: courierServiceOther || '',
      shippedDate: shippedDate ? new Date(shippedDate) : null,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,
      trackingUrl: trackingUrl || '',
      shippingNote: shippingNote || '',
    };

    if (order.orderStatus === 'Shipped' && !order.shippingDetails.shippedDate) {
      order.shippingDetails.shippedDate = new Date();
    }

    await order.save();
    
    res.json({
      success: true,
      shippingDetails: order.shippingDetails,
      message: 'Shipping details updated successfully'
    });
  } catch (error) {
    console.error('Update shipping details error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get shipping details for an order
// @route   GET /api/orders/:id/shipping
export const getShippingDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      shippingDetails: order.shippingDetails || {},
      orderStatus: order.orderStatus,
      estimatedDelivery: order.estimatedDelivery,
    });
  } catch (error) {
    console.error('Get shipping details error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get orders by date range for report (admin)
// @route   GET /api/orders/report
export const getOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false,
        message: 'Start date and end date are required' 
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .populate('user', 'name email')
      .sort('-createdAt');

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.isPaid === true).length;
    const codOrders = orders.filter(o => o.paymentMethod === 'cod').length;
    const onlineOrders = orders.filter(o => o.paymentMethod === 'razorpay').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;
    const processingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
    const shippedOrders = orders.filter(o => o.orderStatus === 'Shipped').length;

    res.json({
      success: true,
      orders,
      summary: {
        totalOrders,
        totalRevenue,
        paidOrders,
        codOrders,
        onlineOrders,
        deliveredOrders,
        pendingOrders,
        cancelledOrders,
        processingOrders,
        shippedOrders,
      },
    });
  } catch (error) {
    console.error('Get orders by date range error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};