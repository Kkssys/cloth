import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiHome, FiSearch, FiShoppingCart, FiHeart, FiUser } from 'react-icons/fi';

const MobileBottomNav = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  if (!isMobile) return null;

  const styles = {
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 16px',
      zIndex: 100,
    },
    navItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      textDecoration: 'none',
      color: '#9ca3af',
      fontSize: '12px',
      padding: '8px',
      borderRadius: '8px',
      transition: 'color 0.3s',
      flex: 1,
      maxWidth: '80px',
    },
    activeNavItem: {
      color: '#4f46e5',
    },
    icon: {
      fontSize: '20px',
    },
    label: {
      fontSize: '10px',
    },
  };

  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Home' },
    { path: '/products', icon: <FiSearch />, label: 'Shop' },
    { path: '/cart', icon: <FiShoppingCart />, label: 'Cart' },
    { path: '/wishlist', icon: <FiHeart />, label: 'Wishlist' },
    { path: userInfo ? '/orders' : '/login', icon: <FiUser />, label: userInfo ? 'Orders' : 'Account' },
  ];

  return (
    <div style={styles.container}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            ...styles.navItem,
            ...(location.pathname === item.path || 
               (item.path === '/orders' && location.pathname === '/orders') ||
               (item.path === '/login' && (location.pathname === '/login' || location.pathname === '/register'))
               ? styles.activeNavItem : {}),
          }}
        >
          <span style={styles.icon}>{item.icon}</span>
          <span style={styles.label}>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default MobileBottomNav;