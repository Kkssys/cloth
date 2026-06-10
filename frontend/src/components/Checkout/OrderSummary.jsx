import React from 'react';

const OrderSummary = ({ cart, shippingAddress, subtotal, shipping, tax, total, onNext, onBack }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate estimated delivery based on state
  const calculateEstimatedDelivery = () => {
    const state = shippingAddress.state?.toLowerCase().trim();
    const today = new Date();
    const deliveryDate = new Date(today);
    
    // Check if state is Tamil Nadu
    const isTamilNadu = state === 'tamil nadu' || 
                        state === 'tn' || 
                        state?.includes('tamilnadu');
    
    if (isTamilNadu) {
      // Tamil Nadu: 3 days delivery
      deliveryDate.setDate(today.getDate() + 3);
      return {
        days: 3,
        date: deliveryDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        isTamilNadu: true,
        message: 'Fast Delivery within Tamil Nadu'
      };
    } else {
      // Other states: 7-10 days delivery
      const randomDays = 7 + Math.floor(Math.random() * 4);
      deliveryDate.setDate(today.getDate() + randomDays);
      return {
        days: randomDays,
        date: deliveryDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        isTamilNadu: false,
        message: 'Standard Delivery'
      };
    }
  };

  const deliveryInfo = calculateEstimatedDelivery();

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isMobile ? '16px' : '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: isMobile ? '18px' : '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '2px solid #4f46e5',
    },
    section: {
      marginBottom: isMobile ? '20px' : '24px',
    },
    sectionTitle: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#374151',
    },
    addressCard: {
      backgroundColor: '#f9fafb',
      padding: isMobile ? '12px' : '16px',
      borderRadius: '8px',
      marginBottom: '16px',
    },
    addressText: {
      fontSize: isMobile ? '12px' : '14px',
      color: '#4b5563',
      marginBottom: '4px',
      wordBreak: 'break-word',
    },
    deliveryCard: {
      backgroundColor: deliveryInfo.isTamilNadu ? '#d1fae5' : '#fed7aa',
      padding: isMobile ? '12px' : '16px',
      borderRadius: '8px',
      marginBottom: '16px',
      border: `1px solid ${deliveryInfo.isTamilNadu ? '#10b981' : '#f59e0b'}`,
    },
    deliveryTitle: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 'bold',
      color: deliveryInfo.isTamilNadu ? '#065f46' : '#92400e',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    },
    deliveryIcon: {
      fontSize: isMobile ? '20px' : '24px',
    },
    deliveryDate: {
      fontSize: isMobile ? '13px' : '15px',
      fontWeight: 'bold',
      color: deliveryInfo.isTamilNadu ? '#065f46' : '#92400e',
      marginBottom: '6px',
    },
    deliveryNote: {
      fontSize: isMobile ? '11px' : '12px',
      color: deliveryInfo.isTamilNadu ? '#065f46' : '#92400e',
    },
    itemsContainer: {
      maxHeight: '300px',
      overflowY: 'auto',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
    },
    itemRow: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      padding: '12px',
      borderBottom: '1px solid #e5e7eb',
      gap: '12px',
    },
    itemImage: {
      width: isMobile ? '60px' : '50px',
      height: isMobile ? '60px' : '50px',
      objectFit: 'cover',
      borderRadius: '6px',
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      marginBottom: '4px',
    },
    itemMeta: {
      fontSize: '11px',
      color: '#6b7280',
    },
    itemPrice: {
      fontWeight: 'bold',
      color: '#4f46e5',
      fontSize: isMobile ? '13px' : '14px',
    },
    summaryCard: {
      backgroundColor: '#f9fafb',
      padding: isMobile ? '12px' : '16px',
      borderRadius: '8px',
      marginTop: '16px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      fontSize: isMobile ? '13px' : '14px',
    },
    summaryTotal: {
      borderTop: '2px solid #e5e7eb',
      paddingTop: '10px',
      marginTop: '10px',
      fontWeight: 'bold',
      fontSize: isMobile ? '16px' : '18px',
    },
    freeShippingBadge: {
      display: 'inline-block',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '10px',
      fontWeight: 'bold',
      marginLeft: '8px',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      marginTop: '24px',
      gap: '12px',
    },
    backBtn: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
      padding: isMobile ? '12px' : '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      width: isMobile ? '100%' : 'auto',
    },
    nextBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: isMobile ? '12px' : '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      width: isMobile ? '100%' : 'auto',
    },
  };

  const freeShipping = shipping === 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Order Summary</h2>

      {/* Shipping Address */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>📮 Shipping Address</div>
        <div style={styles.addressCard}>
          <div style={styles.addressText}><strong>{shippingAddress.fullName}</strong></div>
          <div style={styles.addressText}>{shippingAddress.street}</div>
          <div style={styles.addressText}>{shippingAddress.city}, {shippingAddress.district}</div>
          <div style={styles.addressText}>{shippingAddress.state} - {shippingAddress.zipCode}</div>
          <div style={styles.addressText}>{shippingAddress.country}</div>
          <div style={styles.addressText}>📞 {shippingAddress.phone}</div>
          <div style={styles.addressText}>✉️ {shippingAddress.email}</div>
        </div>
      </div>

      {/* Estimated Delivery Card */}
      <div style={styles.section}>
        <div style={styles.deliveryCard}>
          <div style={styles.deliveryTitle}>
            <span style={styles.deliveryIcon}>🚚</span>
            <span>{deliveryInfo.message}</span>
            {freeShipping && (
              <span style={styles.freeShippingBadge}>Free Shipping</span>
            )}
          </div>
          <div style={styles.deliveryDate}>
            Estimated Delivery: {deliveryInfo.date}
          </div>
          <div style={styles.deliveryNote}>
            {deliveryInfo.isTamilNadu 
              ? `✨ Delivered within 3 days of order confirmation (Tamil Nadu)` 
              : `📦 Delivered within 7-10 days (Standard delivery for your location)`}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🛍️ Order Items ({cart?.items?.length || 0})</div>
        <div style={styles.itemsContainer}>
          {cart?.items?.map((item, idx) => {
            const price = item.product.discount > 0
              ? item.product.price * (1 - item.product.discount / 100)
              : item.product.price;
            const itemTotal = price * item.quantity;
            
            return (
              <div key={idx} style={styles.itemRow}>
                <img src={item.product.images?.[0]?.url} alt={item.product.name} style={styles.itemImage} />
                <div style={styles.itemDetails}>
                  <div style={styles.itemName}>{item.product.name}</div>
                  <div style={styles.itemMeta}>
                    Qty: {item.quantity} | Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                  </div>
                  <div style={styles.itemPrice}>₹{itemTotal.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryRow}>
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Shipping</span>
          <span>{freeShipping ? 'Free 🎉' : `₹${shipping}`}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Tax (5%)</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
          <span>Total</span>
          <span style={{ color: '#4f46e5' }}>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={onBack} style={styles.backBtn}>
          ← Back
        </button>
        <button onClick={onNext} style={styles.nextBtn}>
          Continue to Payment →
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;