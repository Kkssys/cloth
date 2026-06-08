import React, { useState } from 'react';
import axios from '../../utils/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const OrderReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  const fetchOrdersByDateRange = async () => {
    setError('');
    
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date cannot be after end date');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching orders for:', { startDate, endDate });
      
      const response = await axios.get(`/orders/report`, {
        params: { startDate, endDate }
      });
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
        setSummary(response.data.summary);
        setShowPreview(true);
        toast.success(`Found ${response.data.orders?.length || 0} orders`);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch orders';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!orders.length) {
      toast.error('No orders to generate report');
      return;
    }

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      let yPos = 20;

      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229);
      doc.text('FashionStore - Order Report', 105, yPos, { align: 'center' });
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Report Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 8;
      doc.text(`Generated On: ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
      yPos += 15;

      if (summary) {
        doc.setFontSize(14);
        doc.text('Summary Statistics', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.text(`Total Orders: ${summary.totalOrders || 0}`, 20, yPos);
        doc.text(`Total Revenue: ₹${(summary.totalRevenue || 0).toLocaleString()}`, 80, yPos);
        doc.text(`Paid Orders: ${summary.paidOrders || 0}`, 140, yPos);
        yPos += 6;
        doc.text(`COD Orders: ${summary.codOrders || 0}`, 20, yPos);
        doc.text(`Online Orders: ${summary.onlineOrders || 0}`, 80, yPos);
        doc.text(`Delivered Orders: ${summary.deliveredOrders || 0}`, 140, yPos);
        yPos += 6;
        doc.text(`Processing Orders: ${summary.processingOrders || 0}`, 20, yPos);
        doc.text(`Shipped Orders: ${summary.shippedOrders || 0}`, 80, yPos);
        doc.text(`Pending Orders: ${summary.pendingOrders || 0}`, 140, yPos);
        yPos += 6;
        doc.text(`Cancelled Orders: ${summary.cancelledOrders || 0}`, 20, yPos);
        yPos += 15;
      }

      const tableData = orders.map((order, index) => [
        index + 1,
        order._id?.slice(-8) || 'N/A',
        new Date(order.createdAt).toLocaleDateString(),
        new Date(order.createdAt).toLocaleTimeString(),
        order.user?.name || order.shippingAddress?.fullName || 'N/A',
        order.paymentMethod === 'cod' ? 'COD' : 'Online',
        order.orderStatus || 'N/A',
        order.isPaid ? 'Paid' : 'Unpaid',
        `₹${(order.totalPrice || 0).toLocaleString()}`,
      ]);

      // Use autoTable correctly
      autoTable(doc, {
        startY: yPos,
        head: [['S.No', 'Order ID', 'Date', 'Time', 'Customer', 'Payment', 'Status', 'Paid', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { left: 10, right: 10 },
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
        doc.text('FashionStore - Official Order Report', 105, 292, { align: 'center' });
      }

      doc.save(`order_report_${startDate}_to_${endDate}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF: ' + err.message);
    }
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    dateRangeContainer: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      marginBottom: '20px',
    },
    dateGroup: {
      flex: 1,
      minWidth: '200px',
    },
    label: {
      display: 'block',
      fontWeight: '500',
      marginBottom: '8px',
      color: '#374151',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    fetchBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    downloadBtn: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    previewContainer: {
      marginTop: '20px',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '20px',
    },
    previewTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
    },
    summaryCard: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
    },
    summaryItem: {
      textAlign: 'center',
    },
    summaryValue: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#4f46e5',
    },
    summaryLabel: {
      fontSize: '12px',
      color: '#6b7280',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px',
    },
    th: {
      padding: '8px',
      textAlign: 'left',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
    },
    td: {
      padding: '8px',
      borderBottom: '1px solid #f3f4f6',
    },
    noData: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Order Reports</h2>

      <div style={styles.dateRangeContainer}>
        <div style={styles.dateGroup}>
          <label style={styles.label}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.dateGroup}>
          <label style={styles.label}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={fetchOrdersByDateRange} style={styles.fetchBtn} disabled={loading}>
          {loading ? 'Loading...' : '🔍 Fetch Orders'}
        </button>
        {showPreview && orders.length > 0 && (
          <button onClick={generatePDF} style={styles.downloadBtn}>
            📊 Download Report
          </button>
        )}
      </div>

      {error && (
        <div style={styles.errorMessage}>
          ❌ Error: {error}
        </div>
      )}

      {showPreview && (
        <div style={styles.previewContainer}>
          <h3 style={styles.previewTitle}>Preview - {orders.length} Orders Found</h3>
          
          {summary && (
            <div style={styles.summaryCard}>
              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryValue}>{summary.totalOrders}</div>
                  <div style={styles.summaryLabel}>Total Orders</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryValue}>₹{summary.totalRevenue.toLocaleString()}</div>
                  <div style={styles.summaryLabel}>Total Revenue</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryValue}>{summary.paidOrders}</div>
                  <div style={styles.summaryLabel}>Paid Orders</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryValue}>{summary.deliveredOrders}</div>
                  <div style={styles.summaryLabel}>Delivered</div>
                </div>
              </div>
            </div>
          )}

          {orders.length === 0 ? (
            <div style={styles.noData}>
              No orders found in the selected date range
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Payment</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order._id}>
                      <td style={styles.td}>{order._id?.slice(-8)}</td>
                      <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>{order.user?.name || order.shippingAddress?.fullName}</td>
                      <td style={styles.td}>{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</td>
                      <td style={styles.td}>{order.orderStatus}</td>
                      <td style={styles.td}>₹{(order.totalPrice || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length > 10 && (
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                  Showing 10 of {orders.length} orders. Download PDF for complete list.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderReport;