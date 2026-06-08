import React, { useState } from 'react';

const categories = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
const brands = ['Nike', 'Adidas', 'Zara', 'H&M', "Levi's", 'Puma', 'Under Armour'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductFilters = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const styles = {
    filterButton: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filterIcon: {
      fontSize: '20px',
    },
    sidebar: {
      padding: '1.5rem',
    },
    section: {
      marginBottom: '1.5rem',
    },
    title: {
      fontWeight: 600,
      color: '#1f2937',
      marginBottom: '0.75rem',
    },
    options: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
    },
    priceRange: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
    },
    priceInput: {
      width: '80px',
      padding: '0.375rem 0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
    },
    priceSeparator: {
      color: '#6b7280',
      fontSize: '0.875rem',
    },
    sizeButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    sizeBtn: {
      padding: '0.25rem 0.75rem',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '0.875rem',
    },
    activeSizeBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      borderColor: '#4f46e5',
    },
    availabilityOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    availabilityLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      padding: '0.25rem 0',
    },
    availabilityBadge: {
      display: 'inline-block',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      marginRight: '0.5rem',
    },
    inStockBadge: {
      backgroundColor: '#10b981',
    },
    outOfStockBadge: {
      backgroundColor: '#ef4444',
    },
    clearBtn: {
      background: 'none',
      border: 'none',
      color: '#4f46e5',
      cursor: 'pointer',
      fontSize: '0.875rem',
      marginTop: '1rem',
    },
    activeFilterCount: {
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '12px',
      marginLeft: '8px',
    },
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

  const activeFilterCount = getActiveFilterCount();
  const hasActiveFilters = activeFilterCount > 0;

  const handleClearFilters = () => {
    onFilterChange({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      availability: '',
    });
  };

  return (
    <div>
      {/* Filter Toggle Button */}
      <button onClick={toggleFilters} style={styles.filterButton}>
        <span>
          🔍 Filters
          {hasActiveFilters && (
            <span style={styles.activeFilterCount}>{activeFilterCount}</span>
          )}
        </span>
        <span style={styles.filterIcon}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Filter Content - Only visible when isOpen is true */}
      {isOpen && (
        <div style={styles.sidebar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 'bold' }}>All Filters</h3>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} style={styles.clearBtn}>
                Clear all
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div style={styles.section}>
            <h4 style={styles.title}>Category</h4>
            <div style={styles.options}>
              {categories.map(category => (
                <label key={category} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => onFilterChange({ category: e.target.value })}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div style={styles.section}>
            <h4 style={styles.title}>Brand</h4>
            <div style={styles.options}>
              {brands.map(brand => (
                <label key={brand} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={brand}
                    checked={filters.brand === brand}
                    onChange={(e) => onFilterChange({ brand: e.target.checked ? brand : '' })}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={styles.section}>
            <h4 style={styles.title}>Price Range</h4>
            <div style={styles.priceRange}>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                style={styles.priceInput}
              />
              <span style={styles.priceSeparator}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                style={styles.priceInput}
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div style={styles.section}>
            <h4 style={styles.title}>Availability</h4>
            <div style={styles.availabilityOptions}>
              <label style={styles.availabilityLabel}>
                <input
                  type="radio"
                  name="availability"
                  value="inStock"
                  checked={filters.availability === 'inStock'}
                  onChange={(e) => onFilterChange({ availability: e.target.value })}
                />
                <span>
                  <span style={{ ...styles.availabilityBadge, ...styles.inStockBadge }}></span>
                  In Stock
                </span>
              </label>
              <label style={styles.availabilityLabel}>
                <input
                  type="radio"
                  name="availability"
                  value="outOfStock"
                  checked={filters.availability === 'outOfStock'}
                  onChange={(e) => onFilterChange({ availability: e.target.value })}
                />
                <span>
                  <span style={{ ...styles.availabilityBadge, ...styles.outOfStockBadge }}></span>
                  Out of Stock
                </span>
              </label>
            </div>
          </div>

          {/* Size Filter */}
          <div style={styles.section}>
            <h4 style={styles.title}>Size</h4>
            <div style={styles.sizeButtons}>
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => onFilterChange({ size: filters.size === size ? '' : size })}
                  style={{
                    ...styles.sizeBtn,
                    ...(filters.size === size ? styles.activeSizeBtn : {})
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;