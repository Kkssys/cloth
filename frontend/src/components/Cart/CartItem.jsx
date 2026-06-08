import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const isOutOfStock = item.product?.stock === 0;
  const price = item.product?.discount > 0
    ? item.product.price * (1 - item.product.discount / 100)
    : item.product?.price || 0;
  const itemTotal = price * item.quantity;
  const maxQuantity = item.product?.stock || 0;

  const styles = {
    container: { backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', opacity: isOutOfStock ? 0.6 : 1 },
    content: { display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' },
    image: { width: '6rem', height: '6rem', objectFit: 'cover', borderRadius: '0.375rem' },
    details: { flex: 2 },
    title: { fontWeight: 600, color: '#1f2937', textDecoration: 'none' },
    meta: { fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' },
    price: { fontWeight: 600, color: '#4f46e5' },
    outOfStockText: { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 'bold' },
    quantity: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    quantityBtn: { padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' },
    quantityBtnDisabled: { padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '0.25rem', cursor: 'not-allowed', opacity: 0.5 },
    quantityValue: { minWidth: '2rem', textAlign: 'center' },
    removeBtn: { color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img 
          src={item.product?.images?.[0]?.url || 'https://picsum.photos/id/20/100/100'} 
          alt={item.product?.name} 
          style={styles.image}
          onError={(e) => { e.target.src = 'https://picsum.photos/id/20/100/100'; }}
        />
        <div style={styles.details}>
          <Link to={`/product/${item.product?._id}`} style={styles.title}>{item.product?.name || 'Product'}</Link>
          <div style={styles.meta}>Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}</div>
          <div style={styles.price}>₹{price.toLocaleString()}</div>
          {isOutOfStock && <div style={styles.outOfStockText}>⚠️ Out of stock - Please remove from cart</div>}
        </div>
        <div style={styles.quantity}>
          <button onClick={() => onUpdateQuantity(item._id, item.quantity - 1, maxQuantity)} style={isOutOfStock ? styles.quantityBtnDisabled : styles.quantityBtn} disabled={isOutOfStock}>-</button>
          <span style={styles.quantityValue}>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1, maxQuantity)} style={isOutOfStock || item.quantity >= maxQuantity ? styles.quantityBtnDisabled : styles.quantityBtn} disabled={isOutOfStock || item.quantity >= maxQuantity}>+</button>
        </div>
        <div style={{ fontWeight: 'bold', minWidth: '100px', textAlign: 'right' }}>₹{itemTotal.toLocaleString()}</div>
        <button onClick={() => onRemove(item._id)} style={styles.removeBtn}>🗑️</button>
      </div>
    </div>
  );
};

export default CartItem;