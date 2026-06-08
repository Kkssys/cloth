import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import InvoicePDF from '../components/Orders/InvoicePDF';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    fetchOrders();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      await axios.put(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully!');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(null);
    }
  };

  const getOrderProgress = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(status);
    if (currentIndex === -1) return 0;
    return (currentIndex + 1) / steps.length * 100;
  };

  const getEstimatedDelivery = (orderDate, status) => {
    if (status === 'Delivered') return 'Delivered';
    if (status === 'Cancelled') return 'Cancelled';
    
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const statusColors = {
    Pending: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    Processing: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
    Shipped: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
    Delivered: { bg: '#a7f3d0', text: '#065f46', border: '#6ee7b7' },
    Cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  };

  const canCancel = (status) => {
    return status === 'Pending' || status === 'Processing';
  };

  // Common button style for ALL buttons (same for mobile and desktop)
  const getButtonStyle = () => ({
    padding: isMobile ? '10px 12px' : '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    minWidth: isMobile ? '70px' : '95px',
    height: isMobile ? '40px' : '44px',
    lineHeight: '1',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  });

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
      color: '#1f2937',
    },
    orderCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    orderInfo: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    orderId: {
      fontWeight: 'bold',
      color: '#4f46e5',
    },
    orderDate: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    orderBody: {
      padding: '1.5rem',
    },
    itemsSection: {
      marginBottom: '1.5rem',
    },
    itemsTitle: {
      fontWeight: '600',
      marginBottom: '0.75rem',
      fontSize: '1rem',
    },
    itemRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: '1px solid #f3f4f6',
    },
    orderFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e5e7eb',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    totalAmount: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#4f46e5',
    },
    actionButtons: {
      display: 'flex',
      gap: isMobile ? '8px' : '12px',
      flexWrap: 'nowrap',
      alignItems: 'center',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      maxWidth: '650px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      padding: '1.5rem',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid #e5e7eb',
    },
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6b7280',
    },
    trackingContainer: {
      padding: '0.5rem',
    },
    trackingHeader: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    orderIdDisplay: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '0.25rem',
    },
    progressContainer: {
      marginBottom: '2rem',
    },
    progressBar: {
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '1rem',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#4f46e5',
      borderRadius: '4px',
      transition: 'width 0.5s ease',
    },
    stepsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '2rem',
      flexWrap: 'wrap',
    },
    step: {
      textAlign: 'center',
      flex: 1,
      minWidth: '70px',
    },
    stepIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
    },
    stepName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.25rem',
    },
    stepActive: {
      fontWeight: 'bold',
      color: '#4f46e5',
    },
    infoCard: {
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    infoLabel: {
      fontWeight: '500',
      color: '#6b7280',
    },
    infoValue: {
      fontWeight: '500',
      color: '#1f2937',
    },
    trackingLink: {
      color: '#4f46e5',
      textDecoration: 'none',
      wordBreak: 'break-all',
    },
    deliveryCard: {
      borderRadius: '0.5rem',
      padding: '1rem',
      textAlign: 'center',
      marginTop: '1rem',
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No Orders Yet</h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>You haven't placed any orders yet.</p>
        <Link to="/products" style={{ display: 'inline-block', backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
          Start Shopping →
        </Link>
      </div>
    );
  }

  const baseButtonStyle = getButtonStyle();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>

      {orders.map(order => {
        const statusColor = statusColors[order.orderStatus] || { bg: '#e5e7eb', text: '#374151', border: '#e5e7eb' };
        const showCancelButton = canCancel(order.orderStatus);

        return (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div style={styles.orderInfo}>
                <div>
                  <span style={styles.orderId}>Order #{order._id?.slice(-8)}</span>
                  <div style={styles.orderDate}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <span style={{ ...styles.statusBadge, backgroundColor: statusColor.bg, color: statusColor.text }}>
                  {order.orderStatus}
                </span>
              </div>
              
              {/* ALL BUTTONS USE THE SAME BASE STYLE */}
              <div style={styles.actionButtons}>
                <button
                  onClick={() => setSelectedOrderForTracking(order)}
                  style={{
                    ...baseButtonStyle,
                    backgroundColor: '#10b981',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  📍 Track
                </button>
                
                <Link
                  to={`/product/${order.orderItems?.[0]?.product}`}
                  style={{
                    ...baseButtonStyle,
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                >
                  📄 View
                </Link>
                
                <InvoicePDF order={order} />
                
                {showCancelButton && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={cancellingOrder === order._id}
                    style={{
                      ...baseButtonStyle,
                      backgroundColor: cancellingOrder === order._id ? '#9ca3af' : '#ef4444',
                      color: 'white',
                      cursor: cancellingOrder === order._id ? 'not-allowed' : 'pointer',
                      opacity: cancellingOrder === order._id ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!cancellingOrder) e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      if (!cancellingOrder) e.currentTarget.style.backgroundColor = '#ef4444';
                    }}
                  >
                    {cancellingOrder === order._id ? '...' : '❌ Cancel'}
                  </button>
                )}
              </div>
            </div>

            <div style={styles.orderBody}>
              <div style={styles.itemsSection}>
                <div style={styles.itemsTitle}>Items:</div>
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <div>
                      {item.name} x {item.quantity}
                      {item.size && <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>(Size: {item.size})</span>}
                      {item.color && <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>(Color: {item.color})</span>}
                    </div>
                    <div>₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={styles.orderFooter}>
                <div>
                  <strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  {order.isPaid && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✓ Paid</span>}
                </div>
                <div style={styles.totalAmount}>
                  Total: ₹{(order.totalPrice || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Order Tracking Modal */}
      {selectedOrderForTracking && (
        <div style={styles.modalOverlay} onClick={() => setSelectedOrderForTracking(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Order Tracking Dashboard</h2>
              <button onClick={() => setSelectedOrderForTracking(null)} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.trackingContainer}>
              <div style={styles.trackingHeader}>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                  Order #{selectedOrderForTracking._id?.slice(-8)}
                </div>
                <div style={styles.orderIdDisplay}>
                  Placed on {new Date(selectedOrderForTracking.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${getOrderProgress(selectedOrderForTracking.orderStatus)}%` }} />
                </div>
                <div style={styles.stepsContainer}>
                  <div style={styles.step}>
                    <div style={styles.stepIcon}>📦</div>
                    <div style={{ ...styles.stepName, ...(selectedOrderForTracking.orderStatus === 'Pending' ? styles.stepActive : {}) }}>
                      Pending
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepIcon}>⚙️</div>
                    <div style={{ ...styles.stepName, ...(selectedOrderForTracking.orderStatus === 'Processing' ? styles.stepActive : {}) }}>
                      Processing
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepIcon}>🚚</div>
                    <div style={{ ...styles.stepName, ...(selectedOrderForTracking.orderStatus === 'Shipped' ? styles.stepActive : {}) }}>
                      Shipped
                    </div>
                  </div>
                  <div style={styles.step}>
                    <div style={styles.stepIcon}>🏠</div>
                    <div style={{ ...styles.stepName, ...(selectedOrderForTracking.orderStatus === 'Delivered' ? styles.stepActive : {}) }}>
                      Delivered
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Order Status:</span>
                  <span style={{ color: statusColors[selectedOrderForTracking.orderStatus]?.text }}>
                    {selectedOrderForTracking.orderStatus}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Payment Method:</span>
                  <span>{selectedOrderForTracking.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Payment Status:</span>
                  <span style={{ color: selectedOrderForTracking.isPaid ? '#10b981' : '#f59e0b' }}>
                    {selectedOrderForTracking.isPaid ? 'Paid ✓' : 'Pending'}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Total Amount:</span>
                  <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>
                    ₹{(selectedOrderForTracking.totalPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {(selectedOrderForTracking.orderStatus === 'Shipped' || selectedOrderForTracking.orderStatus === 'Delivered') && (
                <div style={styles.infoCard}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.75rem', color: '#1f2937' }}>📮 Shipping Details</div>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Tracking Number:</span>
                    <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>
                      {selectedOrderForTracking.shippingDetails?.trackingNumber || 'Not available'}
                    </span>
                  </div>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Courier Service:</span>
                    <span>{selectedOrderForTracking.shippingDetails?.courierService || 'Not assigned'}</span>
                  </div>
                  
                  {selectedOrderForTracking.shippingDetails?.trackingUrl && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Track Order:</span>
                      <a href={selectedOrderForTracking.shippingDetails.trackingUrl} target="_blank" rel="noopener noreferrer" style={styles.trackingLink}>
                        Click here to track →
                      </a>
                    </div>
                  )}
                  
                  {selectedOrderForTracking.shippingDetails?.shippedDate && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Shipped Date:</span>
                      <span>{new Date(selectedOrderForTracking.shippingDetails.shippedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {selectedOrderForTracking.shippingDetails?.expectedDeliveryDate && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Expected Delivery:</span>
                      <span>{new Date(selectedOrderForTracking.shippingDetails.expectedDeliveryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedOrderForTracking.shippingAddress && (
                <div style={styles.infoCard}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📮 Shipping Address</div>
                  <div>{selectedOrderForTracking.shippingAddress.fullName}</div>
                  <div>{selectedOrderForTracking.shippingAddress.street}</div>
                  <div>{selectedOrderForTracking.shippingAddress.city}, {selectedOrderForTracking.shippingAddress.district} - {selectedOrderForTracking.shippingAddress.zipCode}</div>
                  <div>{selectedOrderForTracking.shippingAddress.state}, {selectedOrderForTracking.shippingAddress.country}</div>
                  <div>📞 {selectedOrderForTracking.shippingAddress.phone}</div>
                </div>
              )}

              {selectedOrderForTracking.orderStatus !== 'Delivered' && selectedOrderForTracking.orderStatus !== 'Cancelled' && (
                <div style={{ ...styles.deliveryCard, backgroundColor: '#d1fae5' }}>
                  <div style={{ color: '#065f46', fontSize: '0.875rem' }}>🚚 Estimated Delivery Date</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#065f46', marginTop: '0.25rem' }}>
                    {getEstimatedDelivery(selectedOrderForTracking.createdAt, selectedOrderForTracking.orderStatus)}
                  </div>
                </div>
              )}

              {selectedOrderForTracking.orderStatus === 'Delivered' && (
                <div style={{ ...styles.deliveryCard, backgroundColor: '#a7f3d0' }}>
                  <div style={{ color: '#065f46', fontSize: '0.875rem' }}>✅ Order Delivered</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem', color: '#065f46' }}>Thank you for shopping with us!</div>
                </div>
              )}

              {selectedOrderForTracking.orderStatus === 'Cancelled' && (
                <div style={{ ...styles.deliveryCard, backgroundColor: '#fee2e2' }}>
                  <div style={{ color: '#991b1b', fontSize: '0.875rem' }}>❌ Order Cancelled</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem', color: '#991b1b' }}>This order has been cancelled</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;