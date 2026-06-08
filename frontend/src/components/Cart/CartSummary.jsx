import React from 'react';
import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal, shipping, tax, total, hasOutOfStock, isFreeShipping }) => {
  const styles = {
    container: {
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: '5rem',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
    },
    totalRow: {
      borderTop: '1px solid #e5e7eb',
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      fontWeight: 'bold',
      fontSize: '1.125rem',
    },
    checkoutBtn: {
      width: '100%',
      marginTop: '1rem',
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '0.75rem',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    checkoutBtnDisabled: {
      width: '100%',
      marginTop: '1rem',
      backgroundColor: '#9ca3af',
      color: '#e5e7eb',
      padding: '0.75rem',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'not-allowed',
    },
    warningBox: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
      fontSize: '0.875rem',
      textAlign: 'center',
    },
    freeShippingBadge: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
      fontSize: '0.875rem',
      textAlign: 'center',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Order Summary</h2>

      {hasOutOfStock && (
        <div style={styles.warningBox}>
          ⚠️ Cannot checkout: Some items are out of stock
        </div>
      )}

      {isFreeShipping && !hasOutOfStock && (
        <div style={styles.freeShippingBadge}>
          🎉 Free Shipping Applied! 🎉
        </div>
      )}

      <div>
        <div style={styles.row}>
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div style={styles.row}>
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free 🎉' : `₹${shipping}`}</span>
        </div>
        <div style={styles.row}>
          <span>Tax (5%)</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div style={{ ...styles.row, ...styles.totalRow }}>
          <span>Total</span>
          <span style={{ color: '#4f46e5' }}>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {hasOutOfStock ? (
        <button disabled style={styles.checkoutBtnDisabled}>
          ❌ Remove Out of Stock Items to Checkout
        </button>
      ) : (
        <Link to="/checkout">
          <button style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
        </Link>
      )}
    </div>
  );
};

export default CartSummary;