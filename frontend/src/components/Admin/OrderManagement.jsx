import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders');
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const statusColors = {
    Pending: '#fef3c7',
    Processing: '#dbeafe',
    Shipped: '#d1fae5',
    Delivered: '#a7f3d0',
    Cancelled: '#e83737',
  };

  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      fontWeight: 600,
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
    },
    statusBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      display: 'inline-block',
    },
    select: {
      padding: '0.25rem 0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      cursor: 'pointer',
    },
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '2rem auto' }}></div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Order Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={styles.td}>{order._id.slice(-8)}</td>
                <td style={styles.td}>{order.user?.name || 'N/A'}</td>
                <td style={styles.td}>₹{order.totalPrice.toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColors[order.orderStatus] || '#e5e7eb'
                  }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;