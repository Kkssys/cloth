import React from 'react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const ProductSort = ({ currentSort, onSortChange }) => {
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    select: {
      padding: '0.375rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>Sort by:</label>
      <select
        value={currentSort}
        onChange={(e) => onSortChange({ sort: e.target.value })}
        style={styles.select}
      >
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSort;