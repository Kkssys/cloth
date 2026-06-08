import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const buttonStyle = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderRadius: '0.375rem',
    margin: '0 0.25rem',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4f46e5',
    color: 'white',
    borderColor: '#4f46e5',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} style={buttonStyle}>1</button>
          {startPage > 2 && <span style={{ padding: '0 0.5rem' }}>...</span>}
        </>
      )}

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          style={currentPage === number ? activeButtonStyle : buttonStyle}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={{ padding: '0 0.5rem' }}>...</span>}
          <button onClick={() => onPageChange(totalPages)} style={buttonStyle}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={currentPage === totalPages ? disabledButtonStyle : buttonStyle}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;