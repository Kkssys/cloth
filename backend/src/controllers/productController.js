import Product from '../models/Product.js';

// @desc    Create a product with images
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      discount,
      stock,
      size,
      colorVariants,
    } = req.body;

    // Parse color variants if provided
    let parsedColorVariants = [];
    if (colorVariants) {
      try {
        parsedColorVariants = typeof colorVariants === 'string' 
          ? JSON.parse(colorVariants) 
          : colorVariants;
      } catch (e) {
        parsedColorVariants = [];
      }
    }

    // Handle main product images (fallback)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        url: `http://localhost:5000/uploads/${file.filename}`,
        publicId: file.filename,
      }));
    } else {
      images = [{
        url: 'https://picsum.photos/id/20/500/500',
        publicId: 'placeholder',
      }];
    }

    // Parse size
    let parsedSize = [];
    if (size) {
      try {
        parsedSize = typeof size === 'string' ? JSON.parse(size) : size;
      } catch (e) {
        parsedSize = Array.isArray(size) ? size : [];
      }
    }

    // Parse color
    let parsedColor = [];
    if (req.body.color) {
      try {
        parsedColor = typeof req.body.color === 'string' ? JSON.parse(req.body.color) : req.body.color;
      } catch (e) {
        parsedColor = Array.isArray(req.body.color) ? req.body.color : [];
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      price: Number(price),
      discount: Number(discount) || 0,
      stock: Number(stock),
      size: parsedSize,
      color: parsedColor,
      colorVariants: parsedColorVariants,
      images,
    });

    res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all products with filtering
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Category Filter
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Brand Filter
    if (req.query.brand) {
      query.brand = req.query.brand;
    }
    
    // Price Range Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Size Filter
    if (req.query.size) {
      query.size = { $in: [req.query.size] };
    }
    
    // Availability Filter
    if (req.query.availability === 'inStock') {
      query.stock = { $gt: 0 };
    } else if (req.query.availability === 'outOfStock') {
      query.stock = 0;
    }

    // Search Filter
    if (req.query.search && req.query.search.trim() !== '') {
      const searchTerm = req.query.search.trim();
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.discount = req.body.discount || product.discount;
    product.stock = req.body.stock || product.stock;
    
    if (req.body.size) {
      try {
        product.size = typeof req.body.size === 'string' ? JSON.parse(req.body.size) : req.body.size;
      } catch (e) {
        product.size = [];
      }
    }
    
    if (req.body.color) {
      try {
        product.color = typeof req.body.color === 'string' ? JSON.parse(req.body.color) : req.body.color;
      } catch (e) {
        product.color = [];
      }
    }
    
    if (req.body.colorVariants) {
      try {
        product.colorVariants = typeof req.body.colorVariants === 'string' 
          ? JSON.parse(req.body.colorVariants) 
          : req.body.colorVariants;
      } catch (e) {
        product.colorVariants = [];
      }
    }
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `http://localhost:5000/uploads/${file.filename}`,
        publicId: file.filename,
      }));
      product.images = [...product.images, ...newImages];
    }

    const updatedProduct = await product.save();
    
    res.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Product removed successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats/count
export const getProductStats = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lt: 10, $gt: 0 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    
    res.json({
      success: true,
      count,
      lowStock,
      outOfStock,
      categories: categories.length,
      brands: brands.length,
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get search suggestions
// @route   GET /api/products/search/suggestions
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ]
    }).limit(20);

    const suggestions = [];
    const seen = new Set();

    products.forEach(product => {
      if (product.name && !seen.has(product.name) && product.name.toLowerCase().includes(q.toLowerCase())) {
        seen.add(product.name);
        suggestions.push(product.name);
      }
    });

    products.forEach(product => {
      if (product.category && !seen.has(product.category) && product.category.toLowerCase().includes(q.toLowerCase())) {
        seen.add(product.category);
        suggestions.push(product.category);
      }
    });

    products.forEach(product => {
      if (product.brand && !seen.has(product.brand) && product.brand.toLowerCase().includes(q.toLowerCase())) {
        seen.add(product.brand);
        suggestions.push(product.brand);
      }
    });

    res.json({ suggestions: suggestions.slice(0, 10) });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({ suggestions: [] });
  }
};

// @desc    Add product review with media
// @route   POST /api/products/:id/reviews
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    const alreadyReviewed = product.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already reviewed this product' 
      });
    }

    let media = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
        media.push({
          type: fileType,
          url: `http://localhost:5000/uploads/${file.filename}`,
          publicId: file.filename,
        });
      }
    }

    const review = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment,
      media,
      helpful: [],
      createdAt: Date.now(),
    };

    product.ratings.push(review);
    
    if (product.ratings.length === 0) {
      product.averageRating = 0;
      product.numReviews = 0;
    } else {
      const sum = product.ratings.reduce((acc, item) => acc + item.rating, 0);
      product.averageRating = (sum / product.ratings.length).toFixed(1);
      product.numReviews = product.ratings.length;
    }
    
    await product.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    const reviews = [...product.ratings].sort((a, b) => b.createdAt - a.createdAt);
    
    res.json({
      success: true,
      reviews,
      averageRating: product.averageRating,
      totalReviews: product.numReviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/products/:id/reviews/:reviewId/helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    const review = product.ratings.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Review not found' 
      });
    }
    
    const alreadyHelpful = review.helpful.includes(req.user._id);
    
    if (!alreadyHelpful) {
      review.helpful.push(req.user._id);
      await product.save();
    }
    
    res.json({ 
      success: true, 
      helpfulCount: review.helpful.length,
      message: 'Review marked as helpful'
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(4);
    
    res.json({
      success: true,
      products: relatedProducts
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};