import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product is in stock
    if (product.stock === 0) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }
    
    // Check if requested quantity is available
    if (quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
    }
    
    // Check if product already in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: `Cannot add more than ${product.stock} items` });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
      });
    }
    
    await cart.save();
    await cart.calculateTotal();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const cartItem = cart.items.id(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Get product to check stock
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if requested quantity is available
    if (quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    } else {
      cartItem.quantity = quantity;
    }
    
    await cart.save();
    await cart.calculateTotal();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.calculateTotal();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};