import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: isOpen ? 'block' : 'none',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '280px',
      backgroundColor: 'white',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 1001,
      overflowY: 'auto',
    },
    header: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6b7280',
    },
    nav: {
      padding: '1rem',
    },
    navItem: {
      display: 'block',
      padding: '0.75rem',
      color: '#4b5563',
      textDecoration: 'none',
      borderRadius: '0.375rem',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <>
      <div style={sidebarStyles.overlay} onClick={onClose} />
      <div style={sidebarStyles.sidebar}>
        <div style={sidebarStyles.header}>
          <h3 style={{ margin: 0 }}>Menu</h3>
          <button onClick={onClose} style={sidebarStyles.closeButton}>×</button>
        </div>
        <div style={sidebarStyles.nav}>
          <Link to="/" style={sidebarStyles.navItem} onClick={onClose}>Home</Link>
          <Link to="/products" style={sidebarStyles.navItem} onClick={onClose}>Shop</Link>
          <Link to="/cart" style={sidebarStyles.navItem} onClick={onClose}>Cart</Link>
          <Link to="/wishlist" style={sidebarStyles.navItem} onClick={onClose}>Wishlist</Link>
          <Link to="/orders" style={sidebarStyles.navItem} onClick={onClose}>Orders</Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;