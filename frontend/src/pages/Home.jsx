import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import ProductCard from '../components/Products/ProductCard';
import { fetchProducts } from '../redux/slices/productSlice';
// import Loader from '../components/Common/Loader';
import ContinuousMarquee from '../components/Common/ContinuousMarquee';

const Home = () => {
  const dispatch = useDispatch();
  // const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 8 }));
  }, [dispatch]);

  const categories = [
    { name: 'Men', icon: '👔', color: '#3b82f6', description: 'Latest men\'s fashion' },
    { name: 'Women', icon: '👗', color: '#ec4899', description: 'Trendy women\'s wear' },
    { name: 'Kids', icon: '👕', color: '#10b981', description: 'Cute kids clothing' },
    { name: 'Accessories', icon: '👜', color: '#f59e0b', description: 'Complete your look' },
    { name: 'Footwear', icon: '👟', color: '#8b5cf6', description: 'Stylish footwear' },
  ];

  // Rotating messages for marquee
  const marqueeMessages = [
    '✨ Best Quality Products ✨',
    '🚚 Free Shipping for Orders Above ₹1500 🚚',
    '🔄 30-Day Easy Returns 🔄',
    '⭐ 100% Authentic Products ⭐',
    '🎉 Exclusive Discounts Every Week 🎉',
    '💳 Secure Payment Methods 💳',
    '👕 Premium Clothing Brands 👕',
    '📦 Fast Delivery Across India 📦'
  ];

  // if (loading) {
  //   return <Loader />;
  // }

  const styles = {
    hero: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
    },
    heroTitle: {
      fontSize: '48px',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    heroSubtitle: {
      fontSize: '20px',
      marginBottom: '30px',
      opacity: 0.95,
    },
    marqueeContainer: {
      marginBottom: '40px',
      marginTop: '20px',
    },
    shopNowBtn: {
      backgroundColor: 'white',
      color: '#4f46e5',
      padding: '12px 30px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 'bold',
      display: 'inline-block',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    section: {
      padding: '60px 20px',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '32px',
      marginBottom: '40px',
      fontWeight: 'bold',
    },
    categoriesSection: {
      backgroundColor: '#f3f4f6',
      padding: '60px 20px',
    },
    categoriesContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '30px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryCard: {
      backgroundColor: 'white',
      padding: '40px 20px',
      textAlign: 'center',
      borderRadius: '12px',
      textDecoration: 'none',
      color: '#1f2937',
      transition: 'transform 0.3s, box-shadow 0.3s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    categoryIcon: {
      fontSize: '48px',
      marginBottom: '15px',
    },
    categoryName: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    categoryDescription: {
      fontSize: '12px',
      color: '#6b7280',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    floatingShapes: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1,
    },
    shape: {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
    },
  };

  return (
    <div>
      {/* Hero Section with Marquee Text Rotator */}
      <div style={styles.hero}>
        <div style={styles.floatingShapes}>
          <div style={{ ...styles.shape, width: '300px', height: '300px', top: '-150px', right: '-100px' }} />
          <div style={{ ...styles.shape, width: '200px', height: '200px', bottom: '-100px', left: '-50px' }} />
          <div style={{ ...styles.shape, width: '150px', height: '150px', top: '50%', right: '10%' }} />
        </div>
        
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to FashionStore</h1>
          <p style={styles.heroSubtitle}>
            Discover the latest fashion trends at unbeatable prices
          </p>
          
          <div style={styles.marqueeContainer}>
            <ContinuousMarquee texts={marqueeMessages} />
          </div>
          
          <Link 
            to="/products" 
            style={styles.shopNowBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Shop Now →
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      {/* <div style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No products yet. Add some products to see them here!</p>
              <Link to="/admin/products" className="btn-primary">
                Add Products
              </Link>
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {products.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div> */}

      {/* Shop by Category Section */}
      <div style={styles.categoriesSection}>
        <div style={styles.categoriesContainer}>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <div style={styles.categoriesGrid}>
            {categories.map(category => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.categoryIcon}>{category.icon}</div>
                <h3 style={styles.categoryName}>{category.name}</h3>
                <p style={styles.categoryDescription}>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;