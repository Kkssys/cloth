import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
export const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [],
    });
  }
  
  res.json(wishlist);
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [],
    });
  }
  
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  // Check if product already in wishlist
  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }
  
  await wishlist.populate('products');
  res.json(wishlist);
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      product => product.toString() !== req.params.productId
    );
    await wishlist.save();
    await wishlist.populate('products');
    res.json(wishlist);
  } else {
    res.status(404).json({ message: 'Wishlist not found' });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
export const checkInWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (wishlist) {
    const isInWishlist = wishlist.products.includes(req.params.productId);
    res.json({ isInWishlist });
  } else {
    res.json({ isInWishlist: false });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
export const clearWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (wishlist) {
    wishlist.products = [];
    await wishlist.save();
    res.json({ message: 'Wishlist cleared' });
  } else {
    res.status(404).json({ message: 'Wishlist not found' });
  }
};