import React from 'react';

function FilterBar({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', featured: false });
  };

  const styles = {
    sidebar: {
      width: '250px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      height: 'fit-content'
    },
    section: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      boxSizing: 'border-box'
    },
    checkbox: {
      marginRight: '8px'
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }
  };

  return (
    <aside style={styles.sidebar}>
      <h3>Filters</h3>

      <div style={styles.section}>
        <label style={styles.label}>Price Range</label>
        <input
          type="number"
          placeholder="Min Price"
          style={styles.input}
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          style={{ ...styles.input, marginTop: '8px' }}
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        />
      </div>

      <div style={styles.section}>
        <label>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={filters.featured}
            onChange={(e) => handleFilterChange('featured', e.target.checked)}
          />
          Featured Only
        </label>
      </div>

      <button style={styles.button} onClick={clearFilters}>
        Clear Filters
      </button>
    </aside>
  );
}

export default FilterBar;