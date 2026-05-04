import React from 'react';

function DestinationCard({ destination }) {
  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    },
    image: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      backgroundColor: '#e0e0e0'
    },
    content: {
      padding: '15px'
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#1a2a6c'
    },
    description: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px',
      lineHeight: '1.4'
    },
    price: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#2a5298'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: '#ffd700',
      color: '#1a2a6c',
      padding: '4px 8px',
      borderRadius: '5px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '8px'
    }
  };

  return (
    <div style={styles.card}>
      {destination.image_url ? (
        <img src={destination.image_url} alt={destination.name} style={styles.image} />
      ) : (
        <div style={styles.image} />
      )}
      
      <div style={styles.content}>
        {destination.is_featured && <span style={styles.badge}>⭐ Featured</span>}
        <h3 style={styles.title}>{destination.name}</h3>
        <p style={styles.description}>
          {destination.description || 'Explore this amazing destination!'}
        </p>
        {destination.price && (
          <p style={styles.price}>${destination.price}</p>
        )}
      </div>
    </div>
  );
}

export default DestinationCard;