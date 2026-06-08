import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist } from '../redux/slices/wishlistSlice';
import Loader from '../components/Common/Loader';
import ProductReviews from '../components/Products/ProductReviews';
import SocialShare from '../components/Products/SocialShare';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (!selectedSize && product?.size?.length > 0) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor && product?.color?.length > 0) {
      toast.error('Please select a color');
      return;
    }
    if (product?.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    if (quantity > product?.stock) {
      toast.error(`Only ${product?.stock} items available in stock`);
      return;
    }
    dispatch(addToCart({
      productId: product._id,
      quantity,
      size: selectedSize,
      color: selectedColor
    }));
    toast.success('Added to cart');
  };

  const handleAddToWishlist = () => {
    if (!userInfo) {
      toast.error('Please login to add to wishlist');
      return;
    }
    dispatch(addToWishlist(product._id));
    toast.success('Added to wishlist');
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '4rem' }}>
        <h2>Product not found</h2>
        <Link to="/products" style={{ display: 'inline-block', marginTop: '1rem', backgroundColor: '#4f46e5', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const productName = product.name || 'Product Name';
  const productDescription = product.description || 'No description available';
  const productBrand = product.brand || 'Unknown Brand';
  const productCategory = product.category || 'Uncategorized';
  const productStock = product.stock || 0;
  const productPrice = product.price || 0;
  const productDiscount = product.discount || 0;
  const productRating = product.averageRating || 0;
  const productReviews = product.numReviews || 0;
  const isOutOfStock = productStock === 0;
  
  const discountedPrice = productDiscount > 0
    ? productPrice * (1 - productDiscount / 100)
    : productPrice;
  
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: 'https://picsum.photos/id/20/500/500', publicId: 'placeholder' }];
  const currentImage = productImages[selectedImage]?.url || productImages[0]?.url;

  const styles = {
    container: { maxWidth: '1280px', margin: '2rem auto', padding: '0 1rem' },
    outOfStockOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: '0.5rem' },
    outOfStockBadge: { backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', transform: 'rotate(-15deg)', fontSize: '1.25rem' },
    grid: { display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' },
    gallery: { position: 'relative' },
    mainImage: { width: '100%', height: '24rem', objectFit: 'cover', borderRadius: '0.5rem', backgroundColor: '#f3f4f6' },
    thumbnails: { display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' },
    thumbnail: { width: '5rem', height: '5rem', objectFit: 'cover', borderRadius: '0.375rem', cursor: 'pointer', border: '2px solid transparent', backgroundColor: '#f3f4f6' },
    activeThumbnail: { borderColor: '#4f46e5' },
    info: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' },
    name: { fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' },
    brand: { color: '#6b7280', marginBottom: '1rem' },
    priceSection: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
    currentPrice: { fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' },
    originalPrice: { fontSize: '1.125rem', color: '#9ca3af', textDecoration: 'line-through' },
    discount: { backgroundColor: '#dc2626', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.875rem' },
    rating: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
    stars: { color: '#fbbf24', fontSize: '1.125rem' },
    description: { color: '#4b5563', margin: '1rem 0', lineHeight: '1.625' },
    meta: { margin: '1rem 0' },
    metaRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' },
    metaLabel: { fontWeight: 600, minWidth: '4rem' },
    sizeSelector: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' },
    sizeBtn: { padding: '0.5rem 1rem', border: '1px solid #d1d5db', backgroundColor: 'white', borderRadius: '0.375rem', cursor: 'pointer' },
    activeSizeBtn: { backgroundColor: '#4f46e5', color: 'white', borderColor: '#4f46e5' },
    colorSelector: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' },
    colorBtn: { width: '2.5rem', height: '2.5rem', borderRadius: '9999px', border: '2px solid #d1d5db', cursor: 'pointer' },
    activeColorBtn: { borderColor: '#4f46e5', boxShadow: '0 0 0 2px rgba(79,70,229,0.5)' },
    actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' },
    quantitySelector: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    quantityBtn: { padding: '0.5rem 1rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '1.125rem' },
    quantityBtnDisabled: { padding: '0.5rem 1rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '0.375rem', cursor: 'not-allowed', fontSize: '1.125rem', opacity: 0.5 },
    quantityValue: { minWidth: '2rem', textAlign: 'center', fontSize: '1.125rem', fontWeight: '500' },
    addToCartBtn: { flex: 1, backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' },
    addToCartBtnDisabled: { flex: 1, backgroundColor: '#9ca3af', color: '#e5e7eb', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'not-allowed', fontSize: '1rem', fontWeight: '500' },
    wishlistBtn: { backgroundColor: '#e5e7eb', color: '#374151', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' },
    stockStatus: { marginTop: '1rem', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center' },
    inStock: { backgroundColor: '#d1fae5', color: '#065f46' },
    lowStock: { backgroundColor: '#fed7aa', color: '#92400e' },
    outOfStockStatus: { backgroundColor: '#fee2e2', color: '#991b1b' },
    reviewsSection: {
      marginTop: '3rem',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '2rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Image Gallery */}
        <div style={styles.gallery}>
          {isOutOfStock && (
            <div style={styles.outOfStockOverlay}>
              <div style={styles.outOfStockBadge}>OUT OF STOCK</div>
            </div>
          )}
          <img
            src={currentImage}
            alt={productName}
            style={styles.mainImage}
            onError={(e) => { e.target.src = 'https://picsum.photos/id/20/500/500'; }}
          />
          {productImages.length > 1 && (
            <div style={styles.thumbnails}>
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${productName} ${index + 1}`}
                  style={{ ...styles.thumbnail, ...(selectedImage === index ? styles.activeThumbnail : {}) }}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => { e.target.src = 'https://picsum.photos/id/20/100/100'; }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={styles.info}>
          <h1 style={styles.name}>{productName}</h1>
          <div style={styles.brand}>by {productBrand}</div>

          <div style={styles.priceSection}>
            <span style={styles.currentPrice}>₹{discountedPrice.toLocaleString()}</span>
            {productDiscount > 0 && (
              <>
                <span style={styles.originalPrice}>₹{productPrice.toLocaleString()}</span>
                <span style={styles.discount}>{productDiscount}% OFF</span>
              </>
            )}
          </div>

          <div style={styles.rating}>
            <div style={styles.stars}>
              {'★'.repeat(Math.floor(productRating))}
              {'☆'.repeat(5 - Math.floor(productRating))}
            </div>
            <span>({productReviews} reviews)</span>
          </div>

          <p style={styles.description}>{productDescription}</p>

          <div style={styles.meta}>
            <div style={styles.metaRow}><span style={styles.metaLabel}>Category:</span><span>{productCategory}</span></div>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Stock:</span>
              <span style={{ color: productStock > 0 ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                {productStock > 0 ? `${productStock} items left` : 'Out of stock'}
              </span>
            </div>
          </div>

          {productStock > 0 && productStock <= 5 && (
            <div style={{ ...styles.stockStatus, ...styles.lowStock }}>⚠️ Only {productStock} items left! Order soon.</div>
          )}
          {isOutOfStock && <div style={{ ...styles.stockStatus, ...styles.outOfStockStatus }}>❌ This product is currently out of stock</div>}

          {product.size && product.size.length > 0 && (
            <div>
              <div style={styles.metaLabel}>Select Size:</div>
              <div style={styles.sizeSelector}>
                {product.size.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} disabled={isOutOfStock} style={{ ...styles.sizeBtn, ...(selectedSize === size ? styles.activeSizeBtn : {}), ...(isOutOfStock ? { cursor: 'not-allowed', opacity: 0.5 } : {}) }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.color && product.color.length > 0 && (
            <div>
              <div style={styles.metaLabel}>Select Color:</div>
              <div style={styles.colorSelector}>
                {product.color.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)} disabled={isOutOfStock} style={{ ...styles.colorBtn, backgroundColor: color.toLowerCase(), ...(selectedColor === color ? styles.activeColorBtn : {}), ...(isOutOfStock ? { cursor: 'not-allowed', opacity: 0.5 } : {}) }} title={color} />
                ))}
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <div style={styles.quantitySelector}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={isOutOfStock ? styles.quantityBtnDisabled : styles.quantityBtn} disabled={isOutOfStock}>-</button>
              <span style={styles.quantityValue}>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(productStock, quantity + 1))} style={isOutOfStock || quantity >= productStock ? styles.quantityBtnDisabled : styles.quantityBtn} disabled={isOutOfStock || quantity >= productStock}>+</button>
            </div>
            <button onClick={handleAddToCart} style={isOutOfStock ? styles.addToCartBtnDisabled : styles.addToCartBtn} disabled={isOutOfStock}>
              {isOutOfStock ? '❌ Out of Stock' : '🛒 Add to Cart'}
            </button>
            <button onClick={handleAddToWishlist} style={styles.wishlistBtn}>♥ Wishlist</button>
            <SocialShare product={product} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <ProductReviews productId={product._id} userInfo={userInfo} />
      </div>
    </div>
  );
};

export default ProductDetails;