import { useEffect, useState } from 'react';

function App() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/trips/')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setTrips(data))
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Connection Failed. Check if Django is running!");
      });
  }, []);

  return (
    <div className="App">
      <h1>Route 200 Travel Tracker</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="trip-list">
        {trips.map(trip => (
          <div key={trip.id} className="trip-card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h2>{trip.title}</h2>
            <p><strong>Location:</strong> {trip.location_name}</p>
            <p><strong>Dates:</strong> {trip.start_date} to {trip.end_date}</p>
            <p>{trip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;