import React, { useState } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const ShippingDetailsForm = ({ order, onUpdate }) => {
  const [formData, setFormData] = useState({
    trackingNumber: order?.shippingDetails?.trackingNumber || '',
    courierService: order?.shippingDetails?.courierService || '',
    courierServiceOther: order?.shippingDetails?.courierServiceOther || '',
    shippedDate: order?.shippingDetails?.shippedDate ? new Date(order.shippingDetails.shippedDate).toISOString().split('T')[0] : '',
    expectedDeliveryDate: order?.shippingDetails?.expectedDeliveryDate ? new Date(order.shippingDetails.expectedDeliveryDate).toISOString().split('T')[0] : '',
    trackingUrl: order?.shippingDetails?.trackingUrl || '',
    shippingNote: order?.shippingDetails?.shippingNote || '',
  });
  const [loading, setLoading] = useState(false);

  const courierOptions = ['BlueDart', 'DTDC', 'Delhivery', 'Ecom Express', 'India Post', 'FedEx', 'DHL', 'Amazon Logistics', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/orders/${order._id}/shipping`, formData);
      toast.success('Shipping details updated successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to update shipping details');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' },
    input: { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' },
    select: { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' },
    textarea: { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', minHeight: '60px' },
    submitBtn: { backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Tracking Number</label>
        <input
          type="text"
          name="trackingNumber"
          value={formData.trackingNumber}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter tracking number"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Courier Service</label>
        <select
          name="courierService"
          value={formData.courierService}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select Courier Service</option>
          {courierOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {formData.courierService === 'Other' && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Other Courier Name</label>
          <input
            type="text"
            name="courierServiceOther"
            value={formData.courierServiceOther}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter courier name"
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Shipped Date</label>
          <input
            type="date"
            name="shippedDate"
            value={formData.shippedDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Expected Delivery Date</label>
          <input
            type="date"
            name="expectedDeliveryDate"
            value={formData.expectedDeliveryDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Tracking URL</label>
        <input
          type="url"
          name="trackingUrl"
          value={formData.trackingUrl}
          onChange={handleChange}
          style={styles.input}
          placeholder="https://track.courier.com/..."
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Shipping Note (Optional)</label>
        <textarea
          name="shippingNote"
          value={formData.shippingNote}
          onChange={handleChange}
          style={styles.textarea}
          placeholder="Any additional shipping information..."
        />
      </div>

      <button type="submit" style={styles.submitBtn} disabled={loading}>
        {loading ? 'Updating...' : 'Update Shipping Details'}
      </button>
    </form>
  );
};

export default ShippingDetailsForm;