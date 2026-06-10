import React from 'react';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, name: 'Address', icon: '📮' },
    { number: 2, name: 'Summary', icon: '📋' },
    { number: 3, name: 'Payment', icon: '💳' },
  ];

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      padding: isMobile ? '0' : '1rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
    },
    stepWrapper: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 2,
    },
    step: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? '4px' : '8px',
      padding: isMobile ? '8px 4px' : '12px',
      borderRadius: '8px',
      transition: 'all 0.3s',
      opacity: 0.5,
      width: '100%',
    },
    activeStep: {
      opacity: 1,
    },
    completedStep: {
      opacity: 1,
    },
    stepNumber: {
      width: isMobile ? '32px' : '40px',
      height: isMobile ? '32px' : '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: isMobile ? '14px' : '18px',
      flexShrink: 0,
      transition: 'all 0.3s',
    },
    stepNumberActive: {
      backgroundColor: '#4f46e5',
      color: 'white',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
    },
    stepNumberCompleted: {
      backgroundColor: '#10b981',
      color: 'white',
      boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
    },
    stepNumberInactive: {
      backgroundColor: '#e5e7eb',
      color: '#6b7280',
    },
    stepIcon: {
      fontSize: isMobile ? '16px' : '18px',
    },
    stepName: {
      fontSize: isMobile ? '10px' : '14px',
      fontWeight: '600',
      color: '#374151',
      whiteSpace: 'nowrap',
    },
    activeStepName: {
      color: '#4f46e5',
    },
    completedStepName: {
      color: '#10b981',
    },
    connector: {
      flex: 1,
      height: '2px',
      backgroundColor: '#e5e7eb',
      margin: isMobile ? '0 4px' : '0 8px',
      position: 'relative',
      zIndex: 1,
    },
    connectorActive: {
      backgroundColor: '#4f46e5',
    },
    connectorCompleted: {
      backgroundColor: '#10b981',
    },
  };

  return (
    <div style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div style={styles.stepWrapper}>
            <div
              style={{
                ...styles.step,
                ...(currentStep === step.number ? styles.activeStep : {}),
                ...(currentStep > step.number ? styles.completedStep : {}),
              }}
            >
              <div
                style={{
                  ...styles.stepNumber,
                  ...(currentStep === step.number ? styles.stepNumberActive : {}),
                  ...(currentStep > step.number ? styles.stepNumberCompleted : {}),
                  ...(currentStep < step.number ? styles.stepNumberInactive : {}),
                }}
              >
                {currentStep > step.number ? (
                  <span style={styles.stepIcon}>✓</span>
                ) : (
                  <span style={styles.stepIcon}>{step.icon}</span>
                )}
              </div>
              {!isMobile && (
                <div
                  style={{
                    ...styles.stepName,
                    ...(currentStep === step.number ? styles.activeStepName : {}),
                    ...(currentStep > step.number ? styles.completedStepName : {}),
                  }}
                >
                  {step.name}
                </div>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              style={{
                ...styles.connector,
                ...(currentStep > step.number ? styles.connectorCompleted : {}),
                ...(currentStep === step.number + 1 ? styles.connectorActive : {}),
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;