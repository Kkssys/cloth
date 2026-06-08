import mongoose from 'mongoose';

// Color Variant Schema - for products with different color options
const colorVariantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
    default: '#000000',
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  price: {
    type: Number,
    default: null, // If null, uses main product price
  },
  discount: {
    type: Number,
    default: 0,
  },
});

// Review Media Schema - for photos/videos in reviews
const reviewMediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    default: '',
  },
  comment: {
    type: String,
    required: true,
  },
  media: [reviewMediaSchema],
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Main Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'],
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  size: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  }],
  // Legacy color array - for backward compatibility
  color: [{
    type: String,
  }],
  // Color variants - for products with different color options and images
  colorVariants: [colorVariantSchema],
  // Main product images
  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  }],
  // Reviews
  ratings: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(1);
    this.numReviews = this.ratings.length;
  }
  return this.save();
};

// Get variant by color
productSchema.methods.getVariantByColor = function(colorName) {
  return this.colorVariants.find(variant => 
    variant.color.toLowerCase() === colorName.toLowerCase()
  );
};

// Get image for specific color
productSchema.methods.getImageForColor = function(colorName) {
  // Check color variants first
  const variant = this.getVariantByColor(colorName);
  if (variant && variant.images && variant.images.length > 0) {
    return variant.images[0].url;
  }
  
  // Return main product image as fallback
  if (this.images && this.images.length > 0) {
    return this.images[0].url;
  }
  
  return null;
};

// Get all available colors with their images
productSchema.virtual('availableColors').get(function() {
  if (this.colorVariants && this.colorVariants.length > 0) {
    return this.colorVariants.map(variant => ({
      color: variant.color,
      colorCode: variant.colorCode,
      image: variant.images?.[0]?.url || null,
      stock: variant.stock,
    }));
  }
  
  // Fallback to legacy color array
  if (this.color && this.color.length > 0) {
    return this.color.map(color => ({
      color: color,
      colorCode: this.getColorCode(color),
      image: this.images?.[0]?.url || null,
      stock: this.stock,
    }));
  }
  
  return [];
});

// Helper method to get color hex code
productSchema.methods.getColorCode = function(colorName) {
  const colorMap = {
    'Black': '#1a1a1a',
    'White': '#ffffff',
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Green': '#10b981',
    'Yellow': '#fbbf24',
    'Pink': '#ec4899',
    'Purple': '#8b5cf6',
    'Orange': '#f97316',
    'Brown': '#78350f',
    'Navy': '#1e3a8a',
    'Gray': '#9ca3af',
    'Beige': '#f5f5dc',
    'Maroon': '#800000',
    'Cyan': '#06b6d4',
    'Lime': '#84cc16',
    'Indigo': '#6366f1',
    'Violet': '#8b5cf6',
    'Gold': '#fbbf24',
    'Silver': '#cbd5e1'
  };
  return colorMap[colorName] || '#000000';
};

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Check if product is in stock
productSchema.methods.isInStock = function(quantity = 1, color = null) {
  if (color) {
    const variant = this.getVariantByColor(color);
    if (variant) {
      return variant.stock >= quantity;
    }
  }
  return this.stock >= quantity;
};

// Reduce stock
productSchema.methods.reduceStock = async function(quantity, color = null) {
  if (color) {
    const variant = this.getVariantByColor(color);
    if (variant && variant.stock >= quantity) {
      variant.stock -= quantity;
      await this.save();
      return true;
    }
    return false;
  }
  
  if (this.stock >= quantity) {
    this.stock -= quantity;
    await this.save();
    return true;
  }
  return false;
};

// Restore stock (for cancellations)
productSchema.methods.restoreStock = async function(quantity, color = null) {
  if (color) {
    const variant = this.getVariantByColor(color);
    if (variant) {
      variant.stock += quantity;
      await this.save();
      return true;
    }
    return false;
  }
  
  this.stock += quantity;
  await this.save();
  return true;
};

const Product = mongoose.model('Product', productSchema);
export default Product;