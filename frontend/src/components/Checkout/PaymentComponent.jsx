import React from 'react';

const PaymentComponent = ({ paymentMethod, setPaymentMethod, onBack, onSubmit, loading }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      paddingBottom: '12px',
      borderBottom: '2px solid #4f46e5',
    },
    paymentMethods: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '20px',
    },
    paymentOption: {
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '12px' : '16px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#e5e7eb',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      gap: '12px',
      flexWrap: 'wrap',
    },
    paymentOptionSelected: {
      borderColor: '#4f46e5',
      backgroundColor: '#eef2ff',
    },
    paymentIcon: {
      fontSize: isMobile ? '28px' : '32px',
      flexShrink: 0,
    },
    paymentInfo: {
      flex: 1,
    },
    paymentName: {
      fontWeight: 'bold',
      fontSize: isMobile ? '14px' : '16px',
      marginBottom: '2px',
    },
    paymentDescription: {
      fontSize: isMobile ? '10px' : '12px',
      color: '#6b7280',
    },
    radio: {
      width: '18px',
      height: '18px',
      accentColor: '#4f46e5',
      flexShrink: 0,
    },
    infoBox: {
      marginBottom: '20px',
      padding: '12px',
      borderRadius: '8px',
      fontSize: isMobile ? '11px' : '12px',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      marginTop: '24px',
      gap: '12px',
    },
    backBtn: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
      padding: isMobile ? '12px' : '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      width: isMobile ? '100%' : 'auto',
    },
    submitBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: isMobile ? '12px' : '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      width: isMobile ? '100%' : 'auto',
    },
    submitBtnDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
    secureBadge: {
      textAlign: 'center',
      marginTop: '20px',
      padding: '12px',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      fontSize: isMobile ? '10px' : '12px',
      color: '#6b7280',
    },
  };

  const paymentOptions = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive the order',
      icon: '💵',
      infoBg: '#d1fae5',
      infoColor: '#065f46',
      infoText: 'Pay in cash when your order is delivered. No additional charges.',
    },
    {
      id: 'razorpay',
      name: 'Online Payment',
      description: 'Pay via Credit/Debit Card, UPI, NetBanking',
      icon: '💳',
      infoBg: '#fef3c7',
      infoColor: '#92400e',
      infoText: 'You will be redirected to Razorpay secure payment page. Supported: Cards, UPI, NetBanking, Wallet',
    },
  ];

  const selectedOption = paymentOptions.find(opt => opt.id === paymentMethod);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💳 Payment Method</h2>

      <div style={styles.paymentMethods}>
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            style={{
              ...styles.paymentOption,
              ...(paymentMethod === option.id ? styles.paymentOptionSelected : {}),
            }}
            onClick={() => setPaymentMethod(option.id)}
          >
            <div style={styles.paymentIcon}>{option.icon}</div>
            <div style={styles.paymentInfo}>
              <div style={styles.paymentName}>{option.name}</div>
              <div style={styles.paymentDescription}>{option.description}</div>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              value={option.id}
              checked={paymentMethod === option.id}
              onChange={() => setPaymentMethod(option.id)}
              style={styles.radio}
            />
          </div>
        ))}
      </div>

      {selectedOption && (
        <div style={{ ...styles.infoBox, backgroundColor: selectedOption.infoBg, color: selectedOption.infoColor }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {paymentMethod === 'razorpay' ? '🔐 Secure Payment' : '💰 ' + selectedOption.name}
          </div>
          <div>{selectedOption.infoText}</div>
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button onClick={onBack} style={styles.backBtn}>
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            ...styles.submitBtn,
            ...(loading ? styles.submitBtnDisabled : {}),
          }}
        >
          {loading ? '⏳ Processing...' : '✅ Place Order'}
        </button>
      </div>

      <div style={styles.secureBadge}>
        🔒 100% Secure Checkout • Your information is protected
      </div>
    </div>
  );
};

export default PaymentComponent;