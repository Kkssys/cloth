import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: String,
    color: String,
  }],
  totalPrice: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

cartSchema.methods.calculateTotal = async function() {
  await this.populate('items.product');
  this.totalPrice = this.items.reduce((total, item) => {
    const price = item.product.discount > 0 
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;