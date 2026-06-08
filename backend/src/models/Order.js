import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String,
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod'],
    required: true,
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  couponCode: String,
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  estimatedDelivery: {
    type: String,
    default: '',
  },
  // Shipping/Tracking Information - All fields optional
  shippingDetails: {
    trackingNumber: {
      type: String,
      default: '',
    },
    courierService: {
      type: String,
      enum: ['BlueDart', 'DTDC', 'Delhivery', 'Ecom Express', 'India Post', 'FedEx', 'DHL', 'Amazon Logistics', 'Other', ''],
      default: '',
    },
    courierServiceOther: {
      type: String,
      default: '',
    },
    shippedDate: {
      type: Date,
      default: null,
    },
    expectedDeliveryDate: {
      type: Date,
      default: null,
    },
    trackingUrl: {
      type: String,
      default: '',
    },
    shippingNote: {
      type: String,
      default: '',
    },
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;