import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const AddressManager = ({ onAddressSelect, onClose }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    district: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    label: 'Home',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get('/addresses');
      setAddresses(data.addresses || []);
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await axios.put(`/addresses/${editingAddress._id}`, formData);
        toast.success('Address updated successfully');
      } else {
        await axios.post('/addresses', formData);
        toast.success('Address added successfully');
      }
      fetchAddresses();
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        fullName: '',
        street: '',
        city: '',
        district: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        label: 'Home',
        isDefault: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleSelectAddress = (address) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
    if (onClose) onClose();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading addresses...</div>;
  }

  const styles = {
    container: { padding: '1rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
    title: { fontSize: '1.25rem', fontWeight: 'bold' },
    addBtn: { backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
    addressCard: { border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', position: 'relative' },
    defaultBadge: { position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#10b981', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem' },
    addressLabel: { display: 'inline-block', backgroundColor: '#e5e7eb', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem', marginBottom: '0.5rem' },
    addressText: { fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' },
    selectBtn: { backgroundColor: '#4f46e5', color: 'white', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem', marginRight: '0.5rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' },
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', fontWeight: '500', marginBottom: '0.25rem' },
    input: { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' },
    row: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
    halfWidth: { flex: 1, minWidth: '120px' },
    modalActions: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
    cancelBtn: { backgroundColor: '#9ca3af', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>My Saved Addresses</h3>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>+ Add New Address</button>
      </div>

      {addresses.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No saved addresses. Add your first address!</p>
      ) : (
        addresses.map(address => (
          <div key={address._id} style={styles.addressCard}>
            {address.isDefault && <span style={styles.defaultBadge}>Default</span>}
            <span style={styles.addressLabel}>{address.label}</span>
            <div style={styles.addressText}>{address.fullName}</div>
            <div style={styles.addressText}>{address.street}</div>
            <div style={styles.addressText}>{address.city}, {address.district} - {address.zipCode}</div>
            <div style={styles.addressText}>{address.state}, {address.country}</div>
            <div style={styles.addressText}>📞 {address.phone}</div>
            <button onClick={() => handleSelectAddress(address)} style={styles.selectBtn}>Use This Address</button>
          </div>
        ))
      )}

      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Add New Address</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}><label style={styles.label}>Full Name *</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} style={styles.input} required /></div>
              <div style={styles.formGroup}><label style={styles.label}>Street Address *</label><input type="text" name="street" value={formData.street} onChange={handleInputChange} style={styles.input} required /></div>
              <div style={styles.row}>
                <div style={styles.halfWidth}><label style={styles.label}>City *</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} style={styles.input} required /></div>
                <div style={styles.halfWidth}><label style={styles.label}>District *</label><input type="text" name="district" value={formData.district} onChange={handleInputChange} style={styles.input} required /></div>
              </div>
              <div style={styles.row}>
                <div style={styles.halfWidth}><label style={styles.label}>State *</label><input type="text" name="state" value={formData.state} onChange={handleInputChange} style={styles.input} required /></div>
                <div style={styles.halfWidth}><label style={styles.label}>Zip Code *</label><input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} style={styles.input} required /></div>
              </div>
              <div style={styles.row}>
                <div style={styles.halfWidth}><label style={styles.label}>Country *</label><input type="text" name="country" value={formData.country} onChange={handleInputChange} style={styles.input} required /></div>
                <div style={styles.halfWidth}><label style={styles.label}>Phone Number *</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={styles.input} required /></div>
              </div>
              <div style={styles.modalActions}>
                <button type="submit" style={styles.selectBtn}>Save Address</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;