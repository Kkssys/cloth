import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
      padding: '20px 0',
    },
    mobileGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      padding: '12px 0',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    },
  };

  // Responsive grid based on screen size
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const gridStyle = isMobile ? styles.mobileGrid : styles.grid;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;