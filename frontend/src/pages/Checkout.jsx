import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import AddressManager from '../components/User/AddressManager';
import { clearCart } from '../redux/slices/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: userInfo?.name || '',
    street: '',
    city: '',
    district: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    email: userInfo?.email || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const subtotal = cart?.totalPrice || 0;
  const FREE_SHIPPING_THRESHOLD = 1500;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // Fetch saved addresses
  useEffect(() => {
    if (userInfo) {
      fetchSavedAddresses();
    }
  }, [userInfo]);

  const fetchSavedAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const { data } = await axios.get('/addresses');
      setSavedAddresses(data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const calculateEstimatedDelivery = (state) => {
    if (!state) return null;
    
    const today = new Date();
    let deliveryDate = new Date(today);
    
    const isTamilNadu = state.toLowerCase().trim() === 'tamil nadu' || 
                        state.toLowerCase().trim() === 'tn' ||
                        state.toLowerCase().includes('tamilnadu');
    
    if (isTamilNadu) {
      deliveryDate.setDate(today.getDate() + 3);
    } else {
      const randomDays = 7 + Math.floor(Math.random() * 4);
      deliveryDate.setDate(today.getDate() + randomDays);
    }
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return {
      date: deliveryDate.toLocaleDateString('en-US', options),
      daysUntil: Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24)),
      isTamilNadu: isTamilNadu,
      state: state
    };
  };

  useEffect(() => {
    if (shippingAddress.state) {
      const delivery = calculateEstimatedDelivery(shippingAddress.state);
      setEstimatedDelivery(delivery);
    } else {
      setEstimatedDelivery(null);
    }
  }, [shippingAddress.state]);

  const handleAddressSelect = (address) => {
    setShippingAddress({
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      district: address.district || '',
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      email: shippingAddress.email,
    });
    toast.success('Address loaded successfully!');
    setShowAddressSelector(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.district.trim()) newErrors.district = 'District is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5,6}$/.test(shippingAddress.zipCode)) {
      newErrors.zipCode = 'Please enter a valid zip code (5-6 digits)';
    }
    if (!shippingAddress.country.trim()) newErrors.country = 'Country is required';
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!shippingAddress.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (!cart || cart.items?.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const outOfStockItems = cart.items.filter(item => item.product?.stock === 0);
    if (outOfStockItems.length > 0) {
      toast.error('Some items in your cart are out of stock. Please remove them.');
      return;
    }

    setLoading(true);

    const orderData = {
      orderItems: cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0]?.url,
        price: item.product.discount > 0
          ? item.product.price * (1 - item.product.discount / 100)
          : item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: total,
      estimatedDelivery: estimatedDelivery?.date,
    };

    try {
      const response = await axios.post('/orders', orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        dispatch(clearCart());
        navigate('/orders');
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '1280px', margin: '2rem auto', padding: '0 1rem' },
    title: { fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' },
    grid: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '2rem' },
    formSection: { flex: 2 },
    summarySection: { flex: 1 },
    card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', marginBottom: '1.5rem' },
    cardTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #4f46e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
    useSavedBtn: { backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' },
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' },
    requiredStar: { color: '#ef4444', marginLeft: '0.25rem' },
    input: { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem' },
    inputError: { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #ef4444', borderRadius: '0.375rem', fontSize: '1rem', backgroundColor: '#fef2f2' },
    errorMessage: { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' },
    row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
    radioGroup: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: '#f9fafb' },
    radioLabelSelected: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: '2px solid #4f46e5', borderRadius: '0.375rem', backgroundColor: '#eef2ff' },
    summary: { backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1.5rem', position: 'sticky', top: '5rem' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' },
    summaryTotal: { borderTop: '1px solid #e5e7eb', marginTop: '0.75rem', paddingTop: '0.75rem', fontWeight: 'bold', fontSize: '1.125rem' },
    submitBtn: { width: '100%', backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
    submitBtnDisabled: { width: '100%', backgroundColor: '#9ca3af', color: '#e5e7eb', padding: '0.75rem', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '1rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
    modalClose: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' },
    deliveryCard: { backgroundColor: estimatedDelivery?.isTamilNadu ? '#d1fae5' : '#fed7aa', borderRadius: '0.5rem', padding: '1rem', marginTop: '1rem', textAlign: 'center' },
    deliveryTitle: { fontSize: '0.875rem', color: estimatedDelivery?.isTamilNadu ? '#065f46' : '#92400e', marginBottom: '0.25rem' },
    deliveryDate: { fontSize: '1.125rem', fontWeight: 'bold', color: estimatedDelivery?.isTamilNadu ? '#065f46' : '#92400e' },
    deliveryNote: { fontSize: '0.7rem', color: estimatedDelivery?.isTamilNadu ? '#065f46' : '#92400e', marginTop: '0.25rem' },
    infoText: { fontSize: '0.7rem', color: '#6b7280', marginTop: '0.25rem' },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      <div style={styles.grid}>
        <div style={styles.formSection}>
          <form onSubmit={handleSubmit}>
            {/* Shipping Address Section */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>📮 Shipping Address</span>
                <button 
                  type="button" 
                  onClick={() => setShowAddressSelector(true)} 
                  style={styles.useSavedBtn}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  📚 Use Saved Address
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name <span style={styles.requiredStar}>*</span></label>
                <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} style={errors.fullName ? styles.inputError : styles.input} placeholder="Enter your full name" />
                {errors.fullName && <div style={styles.errorMessage}>{errors.fullName}</div>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Street Address <span style={styles.requiredStar}>*</span></label>
                <input type="text" name="street" value={shippingAddress.street} onChange={handleInputChange} style={errors.street ? styles.inputError : styles.input} placeholder="House number, street name" />
                {errors.street && <div style={styles.errorMessage}>{errors.street}</div>}
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>City <span style={styles.requiredStar}>*</span></label>
                  <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} style={errors.city ? styles.inputError : styles.input} placeholder="Enter city" />
                  {errors.city && <div style={styles.errorMessage}>{errors.city}</div>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>District <span style={styles.requiredStar}>*</span></label>
                  <input type="text" name="district" value={shippingAddress.district} onChange={handleInputChange} style={errors.district ? styles.inputError : styles.input} placeholder="Enter district" />
                  {errors.district && <div style={styles.errorMessage}>{errors.district}</div>}
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>State <span style={styles.requiredStar}>*</span></label>
                  <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} style={errors.state ? styles.inputError : styles.input} placeholder="Enter state" />
                  {errors.state && <div style={styles.errorMessage}>{errors.state}</div>}
                  <div style={styles.infoText}>💡 Delivery time is calculated based on State - 3 days for Tamil Nadu, 7-10 days for other states</div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Zip Code <span style={styles.requiredStar}>*</span></label>
                  <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} style={errors.zipCode ? styles.inputError : styles.input} placeholder="Enter zip code" />
                  {errors.zipCode && <div style={styles.errorMessage}>{errors.zipCode}</div>}
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Country <span style={styles.requiredStar}>*</span></label>
                  <input type="text" name="country" value={shippingAddress.country} onChange={handleInputChange} style={errors.country ? styles.inputError : styles.input} placeholder="Enter country" />
                  {errors.country && <div style={styles.errorMessage}>{errors.country}</div>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number <span style={styles.requiredStar}>*</span></label>
                  <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleInputChange} style={errors.phone ? styles.inputError : styles.input} placeholder="10-digit mobile number" />
                  {errors.phone && <div style={styles.errorMessage}>{errors.phone}</div>}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address <span style={styles.requiredStar}>*</span></label>
                <input type="email" name="email" value={shippingAddress.email} onChange={handleInputChange} style={errors.email ? styles.inputError : styles.input} placeholder="your@email.com" />
                {errors.email && <div style={styles.errorMessage}>{errors.email}</div>}
              </div>

              {estimatedDelivery && (
                <div style={styles.deliveryCard}>
                  <div style={styles.deliveryTitle}>
                    {estimatedDelivery.isTamilNadu ? '🚚 Fast Delivery' : '🚚 Standard Delivery'}
                  </div>
                  <div style={styles.deliveryDate}>
                    Estimated Delivery: {estimatedDelivery.date}
                  </div>
                  <div style={styles.deliveryNote}>
                    {estimatedDelivery.isTamilNadu 
                      ? '✨ Delivered within 3 days of order confirmation (Tamil Nadu)' 
                      : `📦 Delivered within ${estimatedDelivery.daysUntil} days (7-10 days for your state)`}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>💳 Payment Method</h2>
              <div style={styles.radioGroup}>
                <label style={paymentMethod === 'cod' ? styles.radioLabelSelected : styles.radioLabel}>
                  <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  💵 Cash on Delivery (COD)
                </label>
                <label style={paymentMethod === 'razorpay' ? styles.radioLabelSelected : styles.radioLabel}>
                  <input type="radio" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  💳 Online Payment (Razorpay)
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div style={styles.summarySection}>
          <div style={styles.summary}>
            <h2 style={styles.cardTitle}>Order Summary</h2>

            <div>
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
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

            <button onClick={handleSubmit} disabled={loading} style={loading ? styles.submitBtnDisabled : styles.submitBtn}>
              {loading ? '⏳ Placing Order...' : '✅ Place Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Address Selector Modal */}
      {showAddressSelector && (
        <div style={styles.modalOverlay} onClick={() => setShowAddressSelector(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAddressSelector(false)} style={styles.modalClose}>×</button>
            <AddressManager 
              onAddressSelect={handleAddressSelect} 
              onClose={() => setShowAddressSelector(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;