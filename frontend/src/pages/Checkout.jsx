import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { clearCart } from '../redux/slices/cartSlice';
import CheckoutSteps from '../components/Checkout/CheckoutSteps';
import AddressForm from '../components/Checkout/AddressForm';
import OrderSummary from '../components/Checkout/OrderSummary';
import PaymentComponent from '../components/Checkout/PaymentComponent';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Changed default to razorpay

  const subtotal = cart?.totalPrice || 0;
  const FREE_SHIPPING_THRESHOLD = 1500;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // Calculate estimated delivery based on state
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

  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  useEffect(() => {
    if (shippingAddress.state) {
      const delivery = calculateEstimatedDelivery(shippingAddress.state);
      setEstimatedDelivery(delivery);
    }
  }, [shippingAddress.state]);

  const validateAddressForm = () => {
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

  const handleNext = () => {
    if (currentStep === 1 && validateAddressForm()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items?.length === 0) {
      toast.error('Your cart is empty');
      navigate('/products');
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
      paymentMethod: paymentMethod === 'razorpay' ? 'razorpay' : 'cod',
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: total,
      estimatedDelivery: estimatedDelivery?.date,
    };

    try {
      // First, create the order in database
      const orderResponse = await axios.post('/orders', orderData);
      
      if (!orderResponse.data.success) {
        toast.error(orderResponse.data.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      const savedOrder = orderResponse.data.order;

      // If COD, just redirect to orders page
      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully!');
        dispatch(clearCart());
        navigate('/orders');
        setLoading(false);
        return;
      }

      // For Razorpay - Create payment order
      const razorpayOrderResponse = await axios.post('/payments/create-order', {
        amount: total,
        orderId: savedOrder._id,
      });

      if (!razorpayOrderResponse.data.success) {
        toast.error('Failed to initialize payment');
        setLoading(false);
        return;
      }

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // Enhanced Razorpay options with better UPI and wallet support
      const options = {
        key: razorpayOrderResponse.data.key,
        amount: razorpayOrderResponse.data.amount,
        currency: razorpayOrderResponse.data.currency,
        name: 'FashionStore',
        description: `Order #${savedOrder._id.slice(-8)}`,
        order_id: razorpayOrderResponse.data.id,
        prefill: {
          name: userInfo?.name || shippingAddress.fullName,
          email: userInfo?.email || shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: { 
          color: '#4f46e5',
          hide_topbar: false
        },
        // Enable all payment methods including UPI and wallets
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true
        },
        // Configure UPI options
        upi: {
          flow: 'collect', // 'collect' or 'intent'
          mode: 'embedded' // 'embedded' or 'popup'
        },
        // Enable external wallets
        external: {
          wallets: ['googlepay', 'phonepe', 'paytm', 'amazonpay']
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setLoading(false);
          },
          escape: false,
          backdropclose: false,
          confirm_close: {
            enable: true,
            message: 'Are you sure you want to cancel the payment?'
          }
        },
        // Add handler for UPI intent
        handler: function(response) {
          // This is for backward compatibility
          console.log('Payment response:', response);
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response);
        const errorMessage = response.error?.description || 'Payment failed. Please try again.';
        toast.error(errorMessage);
        setLoading(false);
      });

      rzp.on('payment.success', async (response) => {
        // Verify payment
        try {
          const verifyResponse = await axios.post('/payments/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: savedOrder._id,
          });

          if (verifyResponse.data.success) {
            toast.success('Payment successful! Order placed successfully!');
            dispatch(clearCart());
            navigate('/orders');
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Verification error:', error);
          toast.error('Payment verification failed. Please contact support.');
        }
        setLoading(false);
      });

      // Handle UPI intent redirection
      rzp.on('upi.intent', (event) => {
        console.log('UPI Intent triggered:', event);
        toast.loading('Redirecting to UPI app...', { duration: 2000 });
      });

      rzp.open();

    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: isMobile ? '100%' : '900px',
      margin: isMobile ? '1rem auto' : '2rem auto',
      padding: isMobile ? '0 12px' : '0 1rem',
    },
    title: {
      fontSize: isMobile ? '24px' : '30px',
      fontWeight: 'bold',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>
      
      <CheckoutSteps currentStep={currentStep} />
      
      {currentStep === 1 && (
        <AddressForm
          formData={shippingAddress}
          setFormData={setShippingAddress}
          errors={errors}
          onNext={handleNext}
        />
      )}
      
      {currentStep === 2 && (
        <OrderSummary
          cart={cart}
          shippingAddress={shippingAddress}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          estimatedDelivery={estimatedDelivery}
          onNext={() => setCurrentStep(3)}
          onBack={handleBack}
        />
      )}
      
      {currentStep === 3 && (
        <PaymentComponent
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onBack={handleBack}
          onSubmit={handlePlaceOrder}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Checkout;