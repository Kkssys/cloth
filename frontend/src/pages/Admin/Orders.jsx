import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    trackingNumber: '',
    courierService: '',
    courierServiceOther: '',
    shippedDate: '',
    expectedDeliveryDate: '',
    trackingUrl: '',
    shippingNote: '',
  });

  const courierOptions = ['BlueDart', 'DTDC', 'Delhivery', 'Ecom Express', 'India Post', 'FedEx', 'DHL', 'Amazon Logistics', 'Other'];

  const fetchOrders = useCallback(async () => {
    try {
      const url = filter === 'all' ? '/orders' : `/orders?status=${filter}`;
      const { data } = await axios.get(url);
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const openShippingModal = (order) => {
    setSelectedOrder(order);
    setShippingForm({
      trackingNumber: order.shippingDetails?.trackingNumber || '',
      courierService: order.shippingDetails?.courierService || '',
      courierServiceOther: order.shippingDetails?.courierServiceOther || '',
      shippedDate: order.shippingDetails?.shippedDate ? new Date(order.shippingDetails.shippedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      expectedDeliveryDate: order.shippingDetails?.expectedDeliveryDate || '',
      trackingUrl: order.shippingDetails?.trackingUrl || '',
      shippingNote: order.shippingDetails?.shippingNote || '',
    });
    setShowShippingModal(true);
  };

  const updateShippingDetails = async () => {
    if (!shippingForm.trackingNumber) {
      toast.error('Please enter tracking number');
      return;
    }
    if (!shippingForm.courierService) {
      toast.error('Please select courier service');
      return;
    }

    try {
      await axios.put(`/orders/${selectedOrder._id}/shipping`, shippingForm);
      toast.success('Shipping details updated successfully');
      
      if (selectedOrder.orderStatus !== 'Shipped') {
        await updateOrderStatus(selectedOrder._id, 'Shipped');
      }
      
      setShowShippingModal(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update shipping details');
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm({ ...shippingForm, [name]: value });
  };

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const statusColors = {
    Pending: { bg: '#fef3c7', text: '#92400e' },
    Processing: { bg: '#dbeafe', text: '#1e40af' },
    Shipped: { bg: '#d1fae5', text: '#065f46' },
    Delivered: { bg: '#a7f3d0', text: '#065f46' },
    Cancelled: { bg: '#fee2e2', text: '#991b1b' },
  };

  const styles = {
    container: { padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    title: { fontSize: '24px', fontWeight: 'bold' },
    filterGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    filterBtn: { padding: '6px 12px', border: '1px solid #d1d5db', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' },
    activeFilterBtn: { backgroundColor: '#4f46e5', color: 'white', borderColor: '#4f46e5' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' },
    th: { padding: '12px', textAlign: 'left', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: 600 },
    td: { padding: '12px', borderBottom: '1px solid #f3f4f6' },
    statusBadge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-block' },
    statusSelect: { padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' },
    trackingBtn: { marginLeft: '8px', padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
  };

  const modalStyles = {
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
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
    },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontWeight: '500', marginBottom: '5px', color: '#374151' },
    input: { width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' },
    select: { width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' },
    textarea: { width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '60px', fontSize: '14px' },
    submitBtn: { width: '100%', backgroundColor: '#4f46e5', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Order Management</h1>
        <div style={styles.filterGroup}>
          <button onClick={() => setFilter('all')} style={{ ...styles.filterBtn, ...(filter === 'all' ? styles.activeFilterBtn : {}) }}>All</button>
          {statusOptions.map(status => (
            <button key={status} onClick={() => setFilter(status)} style={{ ...styles.filterBtn, ...(filter === status ? styles.activeFilterBtn : {}) }}>{status}</button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={styles.td}>{order._id?.slice(-8)}</td>
                <td style={styles.td}>{order.user?.name || order.shippingAddress?.fullName}</td>
                <td style={styles.td}>{order.user?.email}</td>
                <td style={styles.td}>₹{(order.totalPrice || 0).toLocaleString()}</td>
                <td style={styles.td}>
                  {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                  {order.isPaid && ' ✓'}
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, backgroundColor: statusColors[order.orderStatus]?.bg, color: statusColors[order.orderStatus]?.text }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      style={styles.statusSelect}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {(order.orderStatus === 'Processing' || order.orderStatus === 'Shipped') && (
                      <button onClick={() => openShippingModal(order)} style={styles.trackingBtn}>
                        ✈️ Add Tracking
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shipping Modal */}
      {showShippingModal && (
        <div style={modalStyles.modalOverlay} onClick={() => setShowShippingModal(false)}>
          <div style={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.modalHeader}>
              <h2>Add Shipping Details - Order #{selectedOrder?._id?.slice(-8)}</h2>
              <button onClick={() => setShowShippingModal(false)} style={modalStyles.closeBtn}>×</button>
            </div>
            
            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Tracking Number *</label>
              <input type="text" name="trackingNumber" value={shippingForm.trackingNumber} onChange={handleShippingChange} style={modalStyles.input} placeholder="Enter tracking number" required />
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Courier Service *</label>
              <select name="courierService" value={shippingForm.courierService} onChange={handleShippingChange} style={modalStyles.select} required>
                <option value="">Select Courier</option>
                {courierOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>

            {shippingForm.courierService === 'Other' && (
              <div style={modalStyles.formGroup}>
                <label style={modalStyles.label}>Other Courier Name</label>
                <input type="text" name="courierServiceOther" value={shippingForm.courierServiceOther} onChange={handleShippingChange} style={modalStyles.input} placeholder="Enter courier name" />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={modalStyles.label}>Shipped Date</label>
                <input type="date" name="shippedDate" value={shippingForm.shippedDate} onChange={handleShippingChange} style={modalStyles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={modalStyles.label}>Expected Delivery Date</label>
                <input type="date" name="expectedDeliveryDate" value={shippingForm.expectedDeliveryDate} onChange={handleShippingChange} style={modalStyles.input} />
              </div>
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Tracking URL (Optional)</label>
              <input type="url" name="trackingUrl" value={shippingForm.trackingUrl} onChange={handleShippingChange} style={modalStyles.input} placeholder="https://track.courier.com/..." />
            </div>

            <div style={modalStyles.formGroup}>
              <label style={modalStyles.label}>Shipping Note (Optional)</label>
              <textarea name="shippingNote" value={shippingForm.shippingNote} onChange={handleShippingChange} style={modalStyles.textarea} placeholder="Additional shipping information..." />
            </div>

            <button onClick={updateShippingDetails} style={modalStyles.submitBtn}>Save & Mark as Shipped</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;