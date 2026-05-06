import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import DestinationCard from './DestinationCard';

function SearchResults({ searchQuery, token }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    featured: false
  });

  // Fetch destinations based on search and filters
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        // Build query string
        let queryParams = new URLSearchParams({ search: searchQuery });
        
        if (filters.minPrice) queryParams.append('min_price', filters.minPrice);
        if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice);
        if (filters.featured) queryParams.append('is_featured', 'true');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/trips/destinations/search/?${queryParams}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        const data = await response.json();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [searchQuery, filters, token]);

  const styles = {
    container: { display: 'flex', gap: '20px' },
    resultsSection: { flex: 1 },
    header: { marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }
  };

  return (
    <div style={styles.container}>
      <FilterBar filters={filters} setFilters={setFilters} />
      
      <div style={styles.resultsSection}>
        <div style={styles.header}>
          <h2>Search Results for "{searchQuery}"</h2>
          <p style={{ color: '#666' }}>{destinations.length} destinations found</p>
        </div>

        {loading ? (
          <p>Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p>No destinations found. Try adjusting your search or filters.</p>
        ) : (
          <div style={styles.grid}>
            {destinations.map(destination => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;