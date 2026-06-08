import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const styles = {
    container: {
      display: 'flex',
      minHeight: 'calc(100vh - 8rem)',
    },
    sidebar: {
      width: '250px',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      padding: '1.5rem',
    },
    content: {
      flex: 1,
      padding: '1.5rem',
      backgroundColor: '#f9fafb',
    },
    navItem: {
      display: 'block',
      padding: '0.75rem',
      marginBottom: '0.5rem',
      color: '#4b5563',
      textDecoration: 'none',
      borderRadius: '0.375rem',
      transition: 'background-color 0.3s',
    },
    activeNavItem: {
      backgroundColor: '#4f46e5',
      color: 'white',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #e5e7eb',
    },
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3 style={styles.title}>Admin Panel</h3>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(location.pathname === item.path ? styles.activeNavItem : {})
            }}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;