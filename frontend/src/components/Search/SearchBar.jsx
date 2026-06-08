import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';
import { FiSearch, FiX, FiClock, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load search query from URL when on products page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setQuery(searchParam);
    } else {
      setQuery('');
    }
  }, [location.search]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history).slice(0, 10));
    }
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const { data } = await axios.get(`/products/search/suggestions?q=${query}`);
          setSuggestions(data.suggestions || []);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Save search to history
  const saveToHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    let history = localStorage.getItem('searchHistory');
    let historyArray = history ? JSON.parse(history) : [];
    
    historyArray = historyArray.filter(item => item !== searchTerm);
    historyArray.unshift(searchTerm);
    historyArray = historyArray.slice(0, 10);
    
    localStorage.setItem('searchHistory', JSON.stringify(historyArray));
    setSearchHistory(historyArray);
  };

  // Clear search history
  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    setSearchHistory([]);
    toast.success('Search history cleared');
  };

  // Handle search submission
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      navigate('/products');
      setQuery('');
      setShowSuggestions(false);
      return;
    }
    
    saveToHistory(searchTerm);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  // Handle X button click - Clear search and show all products (UNDO functionality)
  const handleClearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    // Navigate to products page without search parameter to show all products
    navigate('/products');
    toast.success('Showing all products');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  // Handle history click
  const handleHistoryClick = (term) => {
    setQuery(term);
    handleSearch(term);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  const styles = {
    searchContainer: {
      position: 'relative',
      width: '100%',
      maxWidth: '500px',
    },
    searchInputWrapper: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '9999px',
      padding: '8px 16px',
      transition: 'all 0.3s',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
    },
    searchInputWrapperFocused: {
      border: '1px solid #4f46e5',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
    },
    searchIcon: {
      color: '#9ca3af',
      marginRight: '8px',
      fontSize: '18px',
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      padding: '8px 0',
      backgroundColor: 'transparent',
    },
    clearButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      display: 'flex',
      alignItems: 'center',
      padding: '4px',
      borderRadius: '50%',
      transition: 'color 0.3s',
    },
    suggestionsDropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: '8px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
      zIndex: 1000,
      maxHeight: '400px',
      overflowY: 'auto',
    },
    suggestionSection: {
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 16px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    clearHistoryBtn: {
      background: 'none',
      border: 'none',
      color: '#4f46e5',
      fontSize: '11px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    suggestionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      cursor: 'pointer',
      transition: 'backgroundColor 0.2s',
    },
    suggestionIcon: {
      color: '#9ca3af',
      fontSize: '16px',
    },
    suggestionText: {
      flex: 1,
      fontSize: '14px',
      color: '#1f2937',
    },
    loadingState: {
      padding: '16px',
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '14px',
    },
    noResults: {
      padding: '16px',
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '14px',
    },
  };

  return (
    <div ref={searchRef} style={styles.searchContainer}>
      <div
        style={{
          ...styles.searchInputWrapper,
          ...(showSuggestions ? styles.searchInputWrapperFocused : {})
        }}
      >
        <FiSearch style={styles.searchIcon} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={handleKeyPress}
          placeholder="Search products..."
          style={styles.searchInput}
        />
        {query && (
          <button 
            onClick={handleClearSearch} 
            style={styles.clearButton}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            title="Clear search"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div style={styles.suggestionsDropdown}>
          {searchHistory.length > 0 && !query && (
            <div style={styles.suggestionSection}>
              <div style={styles.sectionHeader}>
                <span>Recent Searches</span>
                <button onClick={clearHistory} style={styles.clearHistoryBtn}>
                  Clear All
                </button>
              </div>
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.suggestionItem,
                    backgroundColor: hoveredIndex === index ? '#f9fafb' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleHistoryClick(term)}
                >
                  <FiClock style={styles.suggestionIcon} />
                  <span style={styles.suggestionText}>{term}</span>
                </div>
              ))}
            </div>
          )}

          {query.length >= 2 && (
            <div style={styles.suggestionSection}>
              <div style={styles.sectionHeader}>
                <span>Suggestions for "{query}"</span>
                <FiTrendingUp size={12} />
              </div>
              {loading ? (
                <div style={styles.loadingState}>
                  <div className="spinner" style={{ width: '20px', height: '20px', margin: '0 auto 8px' }} />
                  Loading suggestions...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.suggestionItem,
                      backgroundColor: hoveredIndex === index + 100 ? '#f9fafb' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredIndex(index + 100)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FiSearch style={styles.suggestionIcon} />
                    <span 
                      style={styles.suggestionText}
                      dangerouslySetInnerHTML={{ __html: highlightText(suggestion, query) }}
                    />
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>
                  No matching products found
                </div>
              )}
            </div>
          )}

          {!query && searchHistory.length === 0 && (
            <div style={styles.suggestionSection}>
              <div style={styles.sectionHeader}>
                <span>Popular Searches</span>
              </div>
              {['T-Shirt', 'Jeans', 'Shoes', 'Dress', 'Jacket'].map((item, index) => (
                <div
                  key={item}
                  style={{
                    ...styles.suggestionItem,
                    backgroundColor: hoveredIndex === index + 200 ? '#f9fafb' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredIndex(index + 200)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleSearch(item)}
                >
                  <FiTrendingUp style={styles.suggestionIcon} />
                  <span style={styles.suggestionText}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;