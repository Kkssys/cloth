import React, { useState, useRef, useEffect } from 'react';
import { 
  FiMail, 
  FiLink, 
  FiCheck, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram,
  FiMessageCircle 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const SocialShare = ({ product }) => {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const productUrl = `${window.location.origin}/product/${product._id}`;
  const encodedUrl = encodeURIComponent(productUrl);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareOptions && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareOptions]);

  // Close on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showShareOptions) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showShareOptions]);

  // Share via Email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this product: ${product.name}`);
    const body = encodeURIComponent(
      `Hi,\n\nI thought you might be interested in this product:\n\n` +
      `${product.name}\n` +
      `Price: ₹${product.price}\n` +
      `Description: ${product.description?.slice(0, 150)}...\n\n` +
      `View product: ${productUrl}\n\n` +
      `Regards,\nFashionStore`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
    toast.success('Opening email client...');
    setShowShareOptions(false);
  };

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this amazing product!\n\n` +
      `${product.name}\n` +
      `Price: ₹${product.price}\n` +
      `View product: ${productUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    toast.success('Opening WhatsApp...');
    setShowShareOptions(false);
  };

  // Share via Facebook
  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
    toast.success('Opening Facebook...');
    setShowShareOptions(false);
  };

  // Share via Twitter
  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Check out ${product.name} on FashionStore!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank');
    toast.success('Opening Twitter...');
    setShowShareOptions(false);
  };

  // Share via Instagram
  const shareViaInstagram = () => {
    copyToClipboard();
    toast.success('Link copied! Open Instagram and share in your story or post.');
    setShowShareOptions(false);
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
    setShowShareOptions(false);
  };

  const styles = {
    shareContainer: {
      position: 'relative',
      display: 'inline-block',
    },
    shareButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.3s',
      whiteSpace: 'nowrap',
    },
    dropdown: {
      position: 'absolute',
      top: '50%',
      left: '100%',
      transform: 'translateY(-50%)',
      marginLeft: '8px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
      minWidth: '200px',
      zIndex: 1000,
      overflow: 'hidden',
      animation: 'fadeInRight 0.2s ease',
    },
    shareOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      width: '100%',
      border: 'none',
      background: 'none',
      fontSize: '14px',
      color: '#374151',
      textAlign: 'left',
    },
    divider: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '4px 0',
    },
    icon: {
      fontSize: '18px',
    },
    emailIcon: { color: '#ea4335' },
    whatsappIcon: { color: '#25D366' },
    facebookIcon: { color: '#1877f2' },
    twitterIcon: { color: '#1da1f2' },
    instagramIcon: { color: '#e4405f' },
    linkIcon: { color: '#6b7280' },
  };

  // Add animation keyframes
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateY(-50%) translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
    }
  `;
  document.head.appendChild(styleSheet);

  return (
    <div style={styles.shareContainer}>
      <button
        ref={buttonRef}
        onClick={() => setShowShareOptions(!showShareOptions)}
        style={styles.shareButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e5e7eb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
      >
        📤 Share
      </button>

      {showShareOptions && (
        <div ref={dropdownRef} style={styles.dropdown}>
          <button 
            onClick={shareViaEmail} 
            style={styles.shareOption}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FiMail style={{ ...styles.icon, ...styles.emailIcon }} />
            <span>Email</span>
          </button>

          <button 
            onClick={shareViaWhatsApp} 
            style={styles.shareOption}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FiMessageCircle style={{ ...styles.icon, ...styles.whatsappIcon }} />
            <span>WhatsApp</span>
          </button>

          <button 
            onClick={shareViaFacebook} 
            style={styles.shareOption}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FiFacebook style={{ ...styles.icon, ...styles.facebookIcon }} />
            <span>Facebook</span>
          </button>

          <button 
            onClick={shareViaTwitter} 
            style={styles.shareOption}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FiTwitter style={{ ...styles.icon, ...styles.twitterIcon }} />
            <span>Twitter</span>
          </button>

          <button 
            onClick={shareViaInstagram} 
            style={styles.shareOption}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FiInstagram style={{ ...styles.icon, ...styles.instagramIcon }} />
            <span>Instagram</span>
          </button>

          <div style={styles.divider} />

          <button 
            onClick={copyToClipboard} 
            style={styles.shareOption}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {copied ? (
              <FiCheck style={{ ...styles.icon, color: '#10b981' }} />
            ) : (
              <FiLink style={{ ...styles.icon, ...styles.linkIcon }} />
            )}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialShare;