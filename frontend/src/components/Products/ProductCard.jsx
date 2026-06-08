import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist } from '../../redux/slices/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [showSizeColorModal, setShowSizeColorModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [hoveredColor, setHoveredColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const productStock = Number(product.stock) || 0;
  const isOutOfStock = productStock === 0;
  const hasSizes = product.size && product.size.length > 0;
  const hasColors = product.color && product.color.length > 0;
  const needsSelection = hasSizes || hasColors;
  
  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // Get all images
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: 'https://picsum.photos/id/20/500/500', publicId: 'placeholder' }];
  
  const hasMultipleImages = allImages.length > 1;

  // Auto-change image every 3 seconds if multiple images
  React.useEffect(() => {
    if (!hasMultipleImages) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [allImages.length, hasMultipleImages]);

  const goToNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const goToPrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const getColorStyle = (color) => {
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
      'Grey': '#9ca3af',
      'Beige': '#f5f5dc',
      'Maroon': '#800000',
      'Cyan': '#06b6d4',
      'Lime': '#84cc16',
      'Indigo': '#6366f1',
      'Violet': '#8b5cf6',
      'Gold': '#fbbf24',
      'Silver': '#cbd5e1'
    };
    return colorMap[color] || '#cbd5e1';
  };

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }
    
    if (needsSelection) {
      setShowSizeColorModal(true);
    } else {
      dispatch(addToCart({ productId: product._id, quantity: 1 }));
      toast.success('Added to cart');
    }
  };

  const handleConfirmAddToCart = () => {
    if (hasSizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (hasColors && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    
    dispatch(addToCart({ 
      productId: product._id, 
      quantity: 1,
      size: selectedSize,
      color: selectedColor
    }));
    toast.success('Added to cart');
    setShowSizeColorModal(false);
    setSelectedSize('');
    setSelectedColor('');
  };

  const handleAddToWishlist = () => {
    if (!userInfo) {
      toast.error('Please login to add to wishlist');
      return;
    }
    dispatch(addToWishlist(product._id));
    toast.success('Added to wishlist');
  };

  const colorSwatches = hasColors ? product.color.slice(0, 5) : [];

  const styles = {
    modalOverlay: { 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000,
      padding: '16px',
    },
    modalContent: { 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      padding: '20px', 
      maxWidth: '90%', 
      width: '400px', 
      maxHeight: '90vh', 
      overflowY: 'auto' 
    },
    modalTitle: { 
      fontSize: '18px', 
      fontWeight: 'bold', 
      marginBottom: '16px', 
      borderBottom: '1px solid #e5e7eb', 
      paddingBottom: '12px' 
    },
    modalSection: { marginBottom: '16px' },
    modalLabel: { fontWeight: 600, marginBottom: '8px', display: 'block', fontSize: '14px' },
    sizeButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    sizeBtn: { 
      padding: '8px 16px', 
      border: '1px solid #d1d5db', 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      cursor: 'pointer',
      fontSize: '14px',
      minWidth: '44px',
      minHeight: '44px',
    },
    activeSizeBtn: { backgroundColor: '#4f46e5', color: 'white', borderColor: '#4f46e5' },
    colorButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    colorBtn: { 
      width: '40px', 
      height: '40px', 
      borderRadius: '50%', 
      border: '2px solid #d1d5db', 
      cursor: 'pointer',
      minWidth: '40px',
      minHeight: '40px',
    },
    activeColorBtn: { borderColor: '#4f46e5', boxShadow: '0 0 0 2px rgba(79,70,229,0.5)' },
    modalActions: { display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' },
    confirmBtn: { 
      flex: 1, 
      backgroundColor: '#4f46e5', 
      color: 'white', 
      padding: '12px', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      minHeight: '44px',
    },
    cancelBtn: { 
      flex: 1, 
      backgroundColor: '#e5e7eb', 
      color: '#374151', 
      padding: '12px', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      minHeight: '44px',
    },
    card: { 
      backgroundColor: 'white', 
      borderRadius: isMobile ? '8px' : '12px', 
      overflow: 'hidden', 
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', 
      transition: 'box-shadow 0.3s, transform 0.3s', 
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    outOfStockOverlay: { 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.7)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 10, 
      borderRadius: '12px' 
    },
    outOfStockText: { 
      backgroundColor: '#ef4444', 
      color: 'white', 
      padding: '8px 16px', 
      borderRadius: '8px', 
      fontWeight: 'bold', 
      transform: 'rotate(-15deg)', 
      fontSize: isMobile ? '14px' : '18px' 
    },
    imageContainer: { 
      position: 'relative', 
      height: isMobile ? '180px' : '250px', 
      overflow: 'hidden',
      backgroundColor: '#f3f4f6',
    },
    image: { 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover', 
      transition: 'transform 0.3s' 
    },
    navButton: { 
      position: 'absolute', 
      top: '50%', 
      transform: 'translateY(-50%)', 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      color: 'white', 
      border: 'none', 
      borderRadius: '50%', 
      width: isMobile ? '28px' : '32px', 
      height: isMobile ? '28px' : '32px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      cursor: 'pointer', 
      zIndex: 10,
      fontSize: isMobile ? '16px' : '18px',
    },
    navButtonPrev: { left: '8px' },
    navButtonNext: { right: '8px' },
    dotsContainer: { 
      position: 'absolute', 
      bottom: '8px', 
      left: 0, 
      right: 0, 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '6px', 
      zIndex: 10 
    },
    dot: { 
      width: isMobile ? '6px' : '8px', 
      height: isMobile ? '6px' : '8px', 
      borderRadius: '50%', 
      backgroundColor: 'rgba(255,255,255,0.5)', 
      cursor: 'pointer' 
    },
    activeDot: { backgroundColor: 'white', width: isMobile ? '8px' : '10px', height: isMobile ? '8px' : '10px' },
    discountBadge: { 
      position: 'absolute', 
      top: '8px', 
      right: '8px', 
      backgroundColor: '#ef4444', 
      color: 'white', 
      padding: '4px 8px', 
      borderRadius: '6px', 
      fontSize: isMobile ? '10px' : '12px', 
      fontWeight: 600, 
      zIndex: 5 
    },
    lowStockBadge: { 
      position: 'absolute', 
      bottom: '8px', 
      left: '8px', 
      backgroundColor: '#f59e0b', 
      color: 'white', 
      padding: '4px 8px', 
      borderRadius: '6px', 
      fontSize: isMobile ? '9px' : '11px', 
      fontWeight: 600, 
      zIndex: 5 
    },
    info: { padding: isMobile ? '10px' : '12px', flex: 1 },
    title: { 
      fontSize: isMobile ? '13px' : '16px', 
      fontWeight: 600, 
      color: '#1f2937', 
      marginBottom: '6px', 
      textDecoration: 'none', 
      display: 'block',
      lineHeight: '1.4',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    price: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' },
    currentPrice: { fontSize: isMobile ? '14px' : '18px', fontWeight: 'bold', color: '#4f46e5' },
    originalPrice: { fontSize: isMobile ? '11px' : '14px', color: '#9ca3af', textDecoration: 'line-through' },
    rating: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' },
    stars: { color: '#fbbf24', fontSize: isMobile ? '11px' : '14px' },
    ratingCount: { fontSize: isMobile ? '10px' : '12px', color: '#6b7280' },
    colorSwatchesContainer: { 
      display: 'flex', 
      gap: isMobile ? '6px' : '8px', 
      marginBottom: '10px', 
      flexWrap: 'wrap', 
      alignItems: 'center' 
    },
    colorSwatch: { 
      width: isMobile ? '20px' : '24px', 
      height: isMobile ? '20px' : '24px', 
      borderRadius: '50%', 
      border: '2px solid #e5e7eb', 
      cursor: 'pointer', 
      transition: 'transform 0.2s, border-color 0.2s' 
    },
    moreColorsText: { fontSize: isMobile ? '10px' : '11px', color: '#6b7280', cursor: 'pointer' },
    actions: { display: 'flex', gap: '8px', marginTop: '8px' },
    addToCartBtn: { 
      flex: 1, 
      backgroundColor: '#4f46e5', 
      color: 'white', 
      padding: isMobile ? '8px' : '10px', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      fontSize: isMobile ? '11px' : '14px', 
      fontWeight: '500',
      minHeight: '40px',
      transition: 'background-color 0.3s',
    },
    addToCartBtnDisabled: { 
      flex: 1, 
      backgroundColor: '#9ca3af', 
      color: '#e5e7eb', 
      padding: isMobile ? '8px' : '10px', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'not-allowed', 
      fontSize: isMobile ? '11px' : '14px', 
      fontWeight: '500',
      minHeight: '40px',
    },
    wishlistBtn: { 
      padding: isMobile ? '8px 12px' : '10px', 
      backgroundColor: '#f3f4f6', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      fontSize: isMobile ? '14px' : '16px',
      minWidth: '40px',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    stockWarning: { fontSize: isMobile ? '10px' : '11px', marginTop: '8px', color: '#f97316' },
    outOfStockTextSmall: { color: '#ef4444', fontSize: isMobile ? '10px' : '11px', marginTop: '8px', fontWeight: 'bold' },
  };

  return (
    <>
      <div style={styles.card}>
        {isOutOfStock && (
          <div style={styles.outOfStockOverlay}>
            <div style={styles.outOfStockText}>OUT OF STOCK</div>
          </div>
        )}
        
        <Link to={`/product/${product._id}`} style={{ display: 'block' }}>
          <div style={styles.imageContainer}>
            <img
              src={allImages[currentImageIndex]?.url}
              alt={product.name}
              style={styles.image}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onError={(e) => { e.target.src = 'https://picsum.photos/id/20/500/500'; }}
            />
            
            {hasMultipleImages && (
              <>
                <button onClick={goToPrevImage} style={{ ...styles.navButton, ...styles.navButtonPrev }}>‹</button>
                <button onClick={goToNextImage} style={{ ...styles.navButton, ...styles.navButtonNext }}>›</button>
              </>
            )}
            
            {hasMultipleImages && (
              <div style={styles.dotsContainer}>
                {allImages.map((_, index) => (
                  <div 
                    key={index} 
                    onClick={(e) => goToImage(index, e)} 
                    style={{ ...styles.dot, ...(currentImageIndex === index ? styles.activeDot : {}) }} 
                  />
                ))}
              </div>
            )}
            
            {product.discount > 0 && <div style={styles.discountBadge}>{product.discount}% OFF</div>}
            {!isOutOfStock && productStock <= 5 && productStock > 0 && (
              <div style={styles.lowStockBadge}>Only {productStock} left!</div>
            )}
          </div>
        </Link>

        <div style={styles.info}>
          <Link to={`/product/${product._id}`} style={styles.title}>{product.name}</Link>
          
          <div style={styles.price}>
            <span style={styles.currentPrice}>₹{discountedPrice.toLocaleString()}</span>
            {product.discount > 0 && <span style={styles.originalPrice}>₹{product.price.toLocaleString()}</span>}
          </div>

          <div style={styles.rating}>
            <div style={styles.stars}>
              {'★'.repeat(Math.floor(product.averageRating || 0))}
              {'☆'.repeat(5 - Math.floor(product.averageRating || 0))}
            </div>
            <span style={styles.ratingCount}>({product.numReviews || 0})</span>
          </div>

          {colorSwatches.length > 0 && (
            <div style={styles.colorSwatchesContainer}>
              {colorSwatches.map((color) => (
                <div
                  key={color}
                  style={{
                    ...styles.colorSwatch,
                    backgroundColor: getColorStyle(color),
                    border: hoveredColor === color ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                    transform: hoveredColor === color ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredColor(color)}
                  onMouseLeave={() => setHoveredColor(null)}
                  title={color}
                />
              ))}
              {product.color && product.color.length > 5 && (
                <span style={styles.moreColorsText} onClick={() => setShowSizeColorModal(true)}>
                  +{product.color.length - 5} more
                </span>
              )}
            </div>
          )}

          <div style={styles.actions}>
            <button onClick={handleAddToCart} style={isOutOfStock ? styles.addToCartBtnDisabled : styles.addToCartBtn} disabled={isOutOfStock}>
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button onClick={handleAddToWishlist} style={styles.wishlistBtn}>♥</button>
          </div>
          
          {!isOutOfStock && productStock <= 5 && productStock > 0 && (
            <div style={styles.stockWarning}>⚠️ Only {productStock} left! Order soon.</div>
          )}
          {isOutOfStock && <div style={styles.outOfStockTextSmall}>Currently unavailable</div>}
        </div>
      </div>

      {/* Size/Color Selection Modal */}
      {showSizeColorModal && (
        <div style={styles.modalOverlay} onClick={() => setShowSizeColorModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Select Options for {product.name}</h3>
            {hasSizes && (
              <div style={styles.modalSection}>
                <label style={styles.modalLabel}>Select Size <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={styles.sizeButtons}>
                  {product.size.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{ ...styles.sizeBtn, ...(selectedSize === size ? styles.activeSizeBtn : {}) }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {hasColors && (
              <div style={styles.modalSection}>
                <label style={styles.modalLabel}>Select Color <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={styles.colorButtons}>
                  {product.color.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ ...styles.colorBtn, backgroundColor: getColorStyle(color), ...(selectedColor === color ? styles.activeColorBtn : {}) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            <div style={styles.modalActions}>
              <button onClick={() => setShowSizeColorModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleConfirmAddToCart} style={styles.confirmBtn}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;