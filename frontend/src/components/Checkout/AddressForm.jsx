import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import AddressManager from '../User/AddressManager';

const AddressForm = ({ formData, setFormData, errors, onNext, onUseSavedAddress }) => {
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const { data } = await axios.get('/addresses');
      setSavedAddresses(data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUseSavedAddress = (address) => {
    setFormData({
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      district: address.district || '',
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      email: formData.email,
    });
    setShowAddressSelector(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    },
    useSavedBtn: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: isMobile ? '6px 12px' : '8px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
    },
    formGroup: {
      marginBottom: isMobile ? '12px' : '16px',
    },
    label: {
      display: 'block',
      fontWeight: '500',
      marginBottom: '6px',
      color: '#374151',
      fontSize: isMobile ? '13px' : '14px',
    },
    requiredStar: {
      color: '#ef4444',
      marginLeft: '4px',
    },
    input: {
      width: '100%',
      padding: isMobile ? '10px 12px' : '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: isMobile ? '14px' : '14px',
      transition: 'all 0.3s',
      WebkitAppearance: 'none',
    },
    inputError: {
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2',
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '11px',
      marginTop: '4px',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: isMobile ? '12px' : '16px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '24px',
    },
    nextBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: isMobile ? '12px 20px' : '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      width: isMobile ? '100%' : 'auto',
    },
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
      borderRadius: '12px',
      maxWidth: isMobile ? '95%' : '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
    },
    modalClose: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <span>📮 Shipping Address</span>
        {savedAddresses.length > 0 && (
          <button onClick={() => setShowAddressSelector(true)} style={styles.useSavedBtn}>
            📚 Use Saved
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name <span style={styles.requiredStar}>*</span></label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            style={{ ...styles.input, ...(errors.fullName ? styles.inputError : {}) }}
            placeholder="Enter your full name"
          />
          {errors.fullName && <div style={styles.errorMessage}>{errors.fullName}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Street Address <span style={styles.requiredStar}>*</span></label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            style={{ ...styles.input, ...(errors.street ? styles.inputError : {}) }}
            placeholder="House number, street name"
          />
          {errors.street && <div style={styles.errorMessage}>{errors.street}</div>}
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>City <span style={styles.requiredStar}>*</span></label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              style={{ ...styles.input, ...(errors.city ? styles.inputError : {}) }}
              placeholder="City"
            />
            {errors.city && <div style={styles.errorMessage}>{errors.city}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>District <span style={styles.requiredStar}>*</span></label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              style={{ ...styles.input, ...(errors.district ? styles.inputError : {}) }}
              placeholder="District"
            />
            {errors.district && <div style={styles.errorMessage}>{errors.district}</div>}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>State <span style={styles.requiredStar}>*</span></label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              style={{ ...styles.input, ...(errors.state ? styles.inputError : {}) }}
              placeholder="State"
            />
            {errors.state && <div style={styles.errorMessage}>{errors.state}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Zip Code <span style={styles.requiredStar}>*</span></label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              style={{ ...styles.input, ...(errors.zipCode ? styles.inputError : {}) }}
              placeholder="Zip Code"
            />
            {errors.zipCode && <div style={styles.errorMessage}>{errors.zipCode}</div>}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Country <span style={styles.requiredStar}>*</span></label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              style={{ ...styles.input, ...(errors.country ? styles.inputError : {}) }}
              placeholder="Country"
            />
            {errors.country && <div style={styles.errorMessage}>{errors.country}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number <span style={styles.requiredStar}>*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
              placeholder="10-digit mobile"
            />
            {errors.phone && <div style={styles.errorMessage}>{errors.phone}</div>}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address <span style={styles.requiredStar}>*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
            placeholder="your@email.com"
          />
          {errors.email && <div style={styles.errorMessage}>{errors.email}</div>}
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.nextBtn}>
            Continue to Summary →
          </button>
        </div>
      </form>

      {showAddressSelector && (
        <div style={styles.modalOverlay} onClick={() => setShowAddressSelector(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAddressSelector(false)} style={styles.modalClose}>×</button>
            <AddressManager onAddressSelect={handleUseSavedAddress} onClose={() => setShowAddressSelector(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;