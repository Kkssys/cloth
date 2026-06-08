import Razorpay from 'razorpay';

let razorpayInstance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  } else {
    console.warn('⚠️ Razorpay keys not found, payment will not work');
    // Create a mock instance for development
    razorpayInstance = {
      orders: {
        create: (options) => {
          console.log('Mock Razorpay order created:', options);
          return Promise.resolve({
            id: 'mock_order_' + Date.now(),
            amount: options.amount,
            currency: options.currency,
            receipt: options.receipt
          });
        }
      }
    };
  }
} catch (error) {
  console.error('❌ Failed to initialize Razorpay:', error.message);
  // Create mock instance on error
  razorpayInstance = {
    orders: {
      create: (options) => {
        console.log('Mock Razorpay order created (fallback):', options);
        return Promise.resolve({
          id: 'mock_order_' + Date.now(),
          amount: options.amount,
          currency: options.currency,
          receipt: options.receipt
        });
      }
    }
  };
}

export default razorpayInstance;