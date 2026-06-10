// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if script already exists
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Open Razorpay checkout
export const openRazorpayCheckout = (options) => {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', (response) => {
      reject(response);
    });
    
    rzp.open();
    
    // Resolve when payment is successful
    rzp.on('payment.success', (response) => {
      resolve(response);
    });
  });
};