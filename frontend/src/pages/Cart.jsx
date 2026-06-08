import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
    }
  }, [dispatch, userInfo]);

  const handleUpdateQuantity = (itemId, quantity, stock) => {
    if (quantity < 1) {
      dispatch(removeFromCart(itemId));
      toast.success('Item removed from cart');
      return;
    }
    if (quantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }
    dispatch(updateCartItem({ itemId, quantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart');
  };

  if (loading) {
    return <Loader />;
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Your cart is empty
        </h2>
        <p style={{ marginBottom: '2rem' }}>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Check for out of stock items
  const hasOutOfStock = cart.items.some(item => item.product?.stock === 0);
  const subtotal = cart.totalPrice || 0;
  
  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 1500;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  
  const shipping = isFreeShipping ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const styles = {
    container: {
      maxWidth: '1280px',
      margin: '2rem auto',
      padding: '0 1rem',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
    },
    warningBox: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    freeShippingCard: {
      backgroundColor: '#d1fae5',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    freeShippingText: {
      color: '#065f46',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    freeShippingProgress: {
      marginTop: '0.75rem',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    freeShippingProgressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
    },
    freeShippingAmount: {
      fontSize: '0.75rem',
      color: '#065f46',
      marginTop: '0.5rem',
    },
    congratulationsText: {
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '0.25rem',
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    itemsSection: {
      flex: 2,
    },
    summarySection: {
      flex: 1,
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>

      {hasOutOfStock && (
        <div style={styles.warningBox}>
          ⚠️ Some items in your cart are out of stock. Please remove them to proceed with checkout.
        </div>
      )}

      {/* Free Shipping Progress Card */}
      {!isFreeShipping && amountNeededForFreeShipping > 0 && (
        <div style={styles.freeShippingCard}>
          <div style={styles.freeShippingText}>
            🚚 Add ₹{amountNeededForFreeShipping.toLocaleString()} more to get FREE Shipping!
          </div>
          <div style={styles.freeShippingProgress}>
            <div style={{ ...styles.freeShippingProgressFill, width: `${freeShippingProgress}%` }} />
          </div>
          <div style={styles.freeShippingAmount}>
            ₹{subtotal.toLocaleString()} / ₹{FREE_SHIPPING_THRESHOLD.toLocaleString()}
          </div>
        </div>
      )}

      {isFreeShipping && (
        <div style={styles.freeShippingCard}>
          <div style={styles.freeShippingText}>
            <span style={styles.congratulationsText}>🎉 Congratulations! 🎉</span>
            <br />
            You've qualified for FREE Shipping on this order!
          </div>
        </div>
      )}

      <div style={{ ...styles.grid, flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={styles.itemsSection}>
          {cart.items.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <div style={styles.summarySection}>
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            hasOutOfStock={hasOutOfStock}
            isFreeShipping={isFreeShipping}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;