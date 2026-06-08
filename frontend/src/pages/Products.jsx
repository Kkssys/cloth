import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/Products/ProductCard';
import ProductFilters from '../components/Products/ProductFilters';
import ProductSort from '../components/Products/ProductSort';
import Pagination from '../components/Common/Pagination';
import Loader from '../components/Common/Loader';
import { fetchProducts } from '../redux/slices/productSlice';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, totalPages, currentPage, totalProducts } = useSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  const getGridColumns = () => {
    if (isMobile) return 'repeat(2, 1fr)';
    if (isTablet) return 'repeat(3, 1fr)';
    return 'repeat(4, 1fr)';
  };

  // Get search from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const brandQuery = searchParams.get('brand') || '';
  const sortQuery = searchParams.get('sort') || 'newest';
  const pageQuery = parseInt(searchParams.get('page')) || 1;

  const [filters, setFilters] = useState({
    category: categoryQuery,
    brand: brandQuery,
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('size') || '',
    availability: searchParams.get('availability') || '',
    sort: sortQuery,
    search: searchQuery,
    page: pageQuery,
  });

  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      size: searchParams.get('size') || '',
      availability: searchParams.get('availability') || '',
      sort: searchParams.get('sort') || 'newest',
      search: searchParams.get('search') || '',
      page: parseInt(searchParams.get('page')) || 1,
    });
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    console.log('Fetching products with filters:', filters);
    dispatch(fetchProducts(filters));
    window.scrollTo(0, 0);
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    const queryParams = {};
    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] && key !== 'page') {
        queryParams[key] = updatedFilters[key];
      }
    });
    queryParams.page = 1;
    setSearchParams(queryParams);
  };

  const handlePageChange = (page) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    
    const queryParams = {};
    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] && key !== 'page') {
        queryParams[key] = updatedFilters[key];
      }
    });
    queryParams.page = page;
    setSearchParams(queryParams);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.size) count++;
    if (filters.availability) count++;
    return count;
  };

  if (loading) {
    return <Loader />;
  }

  const styles = {
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: isMobile ? '12px' : '2rem 1rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '12px' : '1.5rem',
      flexWrap: 'wrap',
      gap: isMobile ? '8px' : '1rem',
    },
    title: {
      fontSize: isMobile ? '14px' : '1.5rem',
      fontWeight: 'bold',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '1rem',
    },
    filterButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: isMobile ? '6px 10px' : '8px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '11px' : '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    filterButtonActive: {
      backgroundColor: '#4338ca',
    },
    activeFilterCount: {
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 5px',
      fontSize: '9px',
      marginLeft: '4px',
    },
    filterDrawer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: showFilters ? 'block' : 'none',
    },
    filterDrawerContent: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: isMobile ? '280px' : '320px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
      transform: showFilters ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 1001,
      overflowY: 'auto',
    },
    filterDrawerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
    },
    filterDrawerTitle: {
      fontSize: isMobile ? '16px' : '1.125rem',
      fontWeight: 'bold',
    },
    closeDrawerBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: getGridColumns(),
      gap: isMobile ? '12px' : '20px',
      marginTop: isMobile ? '12px' : '20px',
    },
    noProducts: {
      textAlign: 'center',
      padding: isMobile ? '2rem' : '3rem',
      fontSize: isMobile ? '14px' : '1.125rem',
      color: '#6b7280',
    },
  };

  const activeFilterCount = getActiveFilterCount();

  const getTitleText = () => {
    if (filters.search) {
      return `Search Results for "${filters.search}" (${totalProducts} products)`;
    }
    return `${totalProducts} Products Found`;
  };

  console.log('Rendering products:', products.length, products);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{getTitleText()}</h2>
        <div style={styles.rightSection}>
          <button 
            onClick={() => setShowFilters(true)} 
            style={{
              ...styles.filterButton,
              ...(activeFilterCount > 0 ? styles.filterButtonActive : {})
            }}
          >
            🔍 Filters
            {activeFilterCount > 0 && (
              <span style={styles.activeFilterCount}>{activeFilterCount}</span>
            )}
          </button>
          <ProductSort currentSort={filters.sort} onSortChange={handleFilterChange} />
        </div>
      </div>

      <div style={styles.filterDrawer} onClick={() => setShowFilters(false)}>
        <div style={styles.filterDrawerContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.filterDrawerHeader}>
            <h3 style={styles.filterDrawerTitle}>Filters</h3>
            <button onClick={() => setShowFilters(false)} style={styles.closeDrawerBtn}>×</button>
          </div>
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </div>

      {products.length === 0 ? (
        <div style={styles.noProducts}>
          <p>No products found.</p>
          {filters.search && (
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              No products match "{filters.search}". Try different keywords.
            </p>
          )}
        </div>
      ) : (
        <>
          <div style={styles.productsGrid}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Products;