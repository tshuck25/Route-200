import React, { useState, useEffect } from 'react';

function App() {
  const [view, setView] = useState('home');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);
  const [trips, setTrips] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [message, setMessage] = useState('');

  // --- Auth Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? 'token/' : 'signup/';
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLoginView) {
          localStorage.setItem('access_token', data.access);
          setToken(data.access);
        } else {
          setMessage("Account created! Please login.");
          setIsLoginView(true);
        }
      } else {
        setMessage(data.error || data.detail || "Error");
      }
    } catch (err) {
      setMessage("Server connection failed.");
    }
  };

  // --- Fetch Trips ---
  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/trips/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setTrips(Array.isArray(data) ? data : []))
      .catch(() => console.error("Failed to load trips."));
    }
  }, [token]);

  const styles = {
    layout: { display: 'flex', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' },
    sidebar: { 
      width: isNavOpen ? '240px' : '70px', 
      backgroundColor: '#1a2a6c', 
      color: 'white', 
      transition: '0.3s', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '20px 10px' 
    },
    navItem: { display: 'flex', alignItems: 'center', padding: '12px', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' },
    main: { flex: 1, overflowY: 'auto', padding: '30px' },
    authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' },
    authCard: { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center', width: '320px' },
    input: { width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#1a2a6c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
  };

  // --- Login Page Rendering  ---
  if (!token) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <h1 style={{ color: '#1a2a6c', margin: 0 }}>ROUTE 200</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>Budget Trip Planner</p>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" style={styles.input} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" style={styles.input} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" style={styles.button}>{isLoginView ? "LOGIN" : "SIGN UP"}</button>
          </form>
          {message && <p style={{ fontSize: '14px', color: 'red' }}>{message}</p>}
          <p onClick={() => setIsLoginView(!isLoginView)} style={{ cursor: 'pointer', color: '#1a2a6c', fontSize: '14px', marginTop: '15px' }}>
            {isLoginView ? "Don't have an account? Sign up free." : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  // --- Authenticated Dashboard Rendering ---
  return (
    <div style={styles.layout}>
      {/* Collapsible Nav  */}
      <aside style={styles.sidebar}>
        <button onClick={() => setIsNavOpen(!isNavOpen)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
          {isNavOpen ? '◀' : '☰'}
        </button>
        
        <div style={{ ...styles.navItem, backgroundColor: view === 'home' ? '#2a5298' : 'transparent' }} onClick={() => setView('home')}>
          <span style={{ minWidth: '40px', textAlign: 'center' }}>🏠</span>
          {isNavOpen && <span>HOME</span>}
        </div>

        <div style={{ ...styles.navItem, backgroundColor: view === 'saved' ? '#2a5298' : 'transparent' }} onClick={() => setView('saved')}>
          <span style={{ minWidth: '40px', textAlign: 'center' }}>⭐</span>
          {isNavOpen && <span>SAVED</span>}
        </div>

        <div style={{ marginTop: 'auto', ...styles.navItem }} onClick={() => { localStorage.clear(); setToken(null); }}>
          <span style={{ minWidth: '40px', textAlign: 'center' }}>🚪</span>
          {isNavOpen && <span>SIGN OUT</span>}
        </div>
      </aside>

      <main style={styles.main}>
        {/* Travel Search Bar [cite: 12, 29, 48] */}
        <input style={{ width: '100%', padding: '15px', borderRadius: '30px', border: '1px solid #ddd', marginBottom: '30px' }} placeholder="Search destinations..." />

        {view === 'home' ? (
          <div>
            <div style={{ height: '200px', backgroundColor: '#2a5298', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
              <h2>FEATURED DESTINATION [cite: 11]</h2>
            </div>
            <h3>SUGGESTED DESTINATIONS [cite: 10]</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>Paris, France [cite: 33]</div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>Rome, Italy [cite: 35]</div>
            </div>
          </div>
        ) : (
          <div>
            <h2>SAVED DESTINATIONS </h2>
            {trips.map(trip => (
              <div key={trip.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
                {trip.title} - {trip.start_date}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
