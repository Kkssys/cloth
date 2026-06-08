import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FiMenu, FiX, FiShoppingCart, FiHeart, FiUser, FiSearch } from 'react-icons/fi';
import SearchBar from '../Search/SearchBar';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { userInfo } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItemsCount = cart?.items?.length || 0;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
        setShowMobileSearch(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const styles = {
    navbar: {
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 16px',
    },
    // Desktop Header
    desktopHeader: {
      display: isMobile ? 'none' : 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '70px',
    },
    brand: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#4f46e5',
      textDecoration: 'none',
    },
    desktopNav: {
      display: 'flex',
      gap: '32px',
      alignItems: 'center',
    },
    desktopLink: {
      color: '#4b5563',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'color 0.3s',
    },
    desktopIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    iconButton: {
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#4b5563',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      borderRadius: '8px',
      transition: 'background-color 0.3s',
    },
    cartCount: {
      position: 'absolute',
      top: '-4px',
      right: '-8px',
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: '10px',
      borderRadius: '50%',
      padding: '2px 6px',
      minWidth: '18px',
      textAlign: 'center',
    },
    // Mobile Header
    mobileHeader: {
      display: isMobile ? 'flex' : 'none',
      flexDirection: 'column',
      padding: '12px 0',
    },
    mobileTopRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    mobileBrand: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#4f46e5',
      textDecoration: 'none',
    },
    mobileIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    mobileSearchContainer: {
      width: '100%',
      marginTop: showMobileSearch ? '0' : '-40px',
      opacity: showMobileSearch ? 1 : 0,
      visibility: showMobileSearch ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
    },
    searchButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#4b5563',
      fontSize: '20px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
    },
    menuButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#4b5563',
      fontSize: '24px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
    },
    mobileMenuOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 99,
      display: isMobileMenuOpen ? 'block' : 'none',
    },
    mobileMenu: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '280px',
      backgroundColor: 'white',
      zIndex: 100,
      transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
    },
    mobileMenuHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid #e5e7eb',
    },
    mobileMenuTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
    },
    mobileMenuClose: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '8px',
    },
    mobileNavLinks: {
      flex: 1,
      padding: '16px 0',
    },
    mobileLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      color: '#374151',
      textDecoration: 'none',
      fontSize: '16px',
      transition: 'background-color 0.3s',
      cursor: 'pointer',
      width: '100%',
      background: 'none',
      border: 'none',
      textAlign: 'left',
    },
    mobileUserInfo: {
      padding: '16px 20px',
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
    },
    mobileUserName: {
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#1f2937',
      marginBottom: '4px',
    },
    mobileUserEmail: {
      fontSize: '12px',
      color: '#6b7280',
    },
    userMenuDesktop: {
      position: 'relative',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '8px',
      width: '200px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      zIndex: 10,
    },
    dropdownItem: {
      display: 'block',
      width: '100%',
      padding: '12px 16px',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      color: '#374151',
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.container}>
          {/* Desktop View */}
          {!isMobile && (
            <div style={styles.desktopHeader}>
              <Link to="/" style={styles.brand}>
                🛍️ FashionStore
              </Link>
              <div style={styles.desktopNav}>
                <Link to="/" style={styles.desktopLink}>Home</Link>
                <Link to="/products" style={styles.desktopLink}>Shop</Link>
                {userInfo?.role === 'admin' && (
                  <Link to="/admin/dashboard" style={styles.desktopLink}>Admin</Link>
                )}
              </div>
              <div style={styles.desktopIcons}>
                <SearchBar />
                <Link to="/wishlist" style={styles.iconButton}>
                  <FiHeart />
                </Link>
                <Link to="/cart" style={styles.iconButton}>
                  <FiShoppingCart />
                  {cartItemsCount > 0 && (
                    <span style={styles.cartCount}>{cartItemsCount}</span>
                  )}
                </Link>
                <div style={styles.userMenuDesktop}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={styles.iconButton}
                  >
                    <FiUser />
                  </button>
                  {showUserMenu && (
                    <div style={styles.dropdown}>
                      {userInfo ? (
                        <>
                          <div style={{ ...styles.dropdownItem, fontWeight: 'bold', borderBottom: '1px solid #e5e7eb' }}>
                            {userInfo.name}
                          </div>
                          <Link to="/orders" style={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                            📦 My Orders
                          </Link>
                          <button onClick={handleLogout} style={styles.dropdownItem}>
                            🚪 Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" style={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                            🔑 Login
                          </Link>
                          <Link to="/register" style={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                            📝 Register
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile View */}
          {isMobile && (
            <div style={styles.mobileHeader}>
              <div style={styles.mobileTopRow}>
                <Link to="/" style={styles.mobileBrand}>
                  🛍️ FashionStore
                </Link>
                <div style={styles.mobileIcons}>
                  <button onClick={() => setShowMobileSearch(!showMobileSearch)} style={styles.searchButton}>
                    <FiSearch />
                  </button>
                  <Link to="/wishlist" style={styles.iconButton}>
                    <FiHeart />
                  </Link>
                  <Link to="/cart" style={styles.iconButton}>
                    <FiShoppingCart />
                    {cartItemsCount > 0 && (
                      <span style={styles.cartCount}>{cartItemsCount}</span>
                    )}
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(true)} style={styles.menuButton}>
                    <FiMenu />
                  </button>
                </div>
              </div>
              <div style={styles.mobileSearchContainer}>
                <SearchBar />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div style={styles.mobileMenuOverlay} onClick={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Menu Sidebar */}
      <div style={styles.mobileMenu}>
        <div style={styles.mobileMenuHeader}>
          <span style={styles.mobileMenuTitle}>Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileMenuClose}>
            <FiX />
          </button>
        </div>
        
        <div style={styles.mobileNavLinks}>
          {userInfo && (
            <div style={styles.mobileUserInfo}>
              <div style={styles.mobileUserName}>{userInfo.name}</div>
              <div style={styles.mobileUserEmail}>{userInfo.email}</div>
            </div>
          )}

          <button onClick={() => handleMobileNavClick('/')} style={styles.mobileLink}>
            🏠 Home
          </button>
          <button onClick={() => handleMobileNavClick('/products')} style={styles.mobileLink}>
            🛍️ Shop
          </button>
          <button onClick={() => handleMobileNavClick('/wishlist')} style={styles.mobileLink}>
            ❤️ Wishlist
          </button>
          <button onClick={() => handleMobileNavClick('/cart')} style={styles.mobileLink}>
            🛒 Cart
          </button>
          
          {userInfo?.role === 'admin' && (
            <button onClick={() => handleMobileNavClick('/admin/dashboard')} style={styles.mobileLink}>
              👑 Admin Dashboard
            </button>
          )}
          
          {userInfo ? (
            <>
              <button onClick={() => handleMobileNavClick('/orders')} style={styles.mobileLink}>
                📦 My Orders
              </button>
              <button onClick={handleLogout} style={styles.mobileLink}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleMobileNavClick('/login')} style={styles.mobileLink}>
                🔑 Login
              </button>
              <button onClick={() => handleMobileNavClick('/register')} style={styles.mobileLink}>
                📝 Register
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;