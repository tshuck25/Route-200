import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import "./App.css";
import BudgetProgressBar from "./components/BudgetProgressBar";
import SearchResults from './SearchResults';

function App() {
  const [view, setView] = useState("home");
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);

  const [trips, setTrips] = useState([]);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(0);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [message, setMessage] = useState("");

  // ---------------- AUTH LOGIC ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? "token/" : "signup/";
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLoginView) {
          localStorage.setItem("access_token", data.access);
          setToken(data.access);
        } else {
          setMessage("Account created. Please login.");
          setIsLoginView(true);
        }
      } else {
        setMessage(data.error || data.detail || "Authentication failed.");
      }
    } catch {
      setMessage("Server connection failed.");
    }
  };
//--------------Handle Search ----------------
  
  const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        setShowResults(true);
        setView('search');
      }
  };
  // ---------------- DATA FETCHING ----------------

  const fetchTrips = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/trips/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => { fetchTrips(); }, [token]);

  // ---------------- SEARCH LOGIC ----------------

  const handleSearch = async (e) => {
    if (e.key !== 'Enter' || !searchQuery) return;
    
    setIsSearching(true);
    setView("search-results");

    try {
      // 1. Fetch Weather
      const weatherRes = await fetch(`${import.meta.env.VITE_API_URL}/api/weather/?city=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle the 502 error gracefully
      if (weatherRes.status === 502) {
        const errorData = await weatherRes.json();
        console.error("Backend Error:", errorData.error);
        setSearchData(prev => ({ ...prev, weather: { error: errorData.error } }));
      } else {
        const weather = await weatherRes.json();
        setSearchData(prev => ({ ...prev, weather: weather }));
      }

      // 2. Fetch Flights
      const flightRes = await fetch(`${import.meta.env.VITE_API_URL}/api/flights/?origin=NYC&destination=${searchQuery}&date=2026-06-01`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (flightRes.ok) {
        const flights = await flightRes.json();
        setSearchData(prev => ({ ...prev, flights: flights }));
      }

    } catch (err) {
      console.error("Search API Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // ---------------- TRIP ACTIONS ----------------

  const createTrip = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ destination, total_budget: budget, start_date: startDate, end_date: endDate }),
    });
    if (response.ok) {
      fetchTrips();
      setDestination(""); setBudget(0); setStartDate(""); setEndDate("");
    }
  };

  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip and all associated expenses?")) return;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) setTrips(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = async (id, newBudget) => {
    if (newBudget === null) return;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ total_budget: parseFloat(newBudget) }),
    });
    if (response.ok) fetchTrips();
  };

  // ---------------- EXPENSE ACTIONS ----------------

  const addExpense = async (tripId) => {
    const nameEl = document.getElementById(`name-${tripId}`);
    const amtEl = document.getElementById(`amt-${tripId}`);
    
    if (!nameEl.value || !amtEl.value) return;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        item_name: nameEl.value, 
        amount: parseFloat(amtEl.value), 
        trip: tripId, 
        category: "other" 
      }),
    });

    if (response.ok) {
      nameEl.value = ""; amtEl.value = "";
      fetchTrips();
    }
  };

  const deleteExpense = async (expenseId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${expenseId}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) fetchTrips();
  };

  const updateExpense = async (expenseId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${expenseId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        item_name: editExpenseData.item_name, 
        amount: parseFloat(editExpenseData.amount) 
      }),
    });

    if (response.ok) {
      setEditingExpenseId(null);
      fetchTrips();
    }
  };

  const handleSignOut = () => {
    localStorage.clear(); setToken(null); setTrips([]);
  };

  // ---------------- RENDER ----------------

  if (!token) {
    return (
      <main className="auth-page">
        <motion.section className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <img src="/logo.png" alt="Route 200" style={{ height: 100, marginBottom: 20 }} />
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">{isLoginView ? "Login" : "Sign Up"}</button>
          </form>
          {message && <p className="message">{message}</p>}
          <button className="text-button" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? "Create an account" : "Back to Login"}
          </button>
        </motion.section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        setView={(newView) => { setView(newView); setShowResults(false); }}
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        onSignOut={handleSignOut}
      />        
      
      <main className="dashboard">
 
 {/* Search Bar */}
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          style={{ flex: 1, padding: '15px', borderRadius: '30px', border: '1px solid #ddd' }}
          placeholder="Search destinations..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" style={{ padding: '15px 30px', backgroundColor: '#1a2a6c', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>
          Search
        </button>
      </form>
        
      {view === 'search' && showResults ? (
          <SearchResults searchQuery={searchQuery} token={token} />
        ) : view === "home" && (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">Lead 3 Milestone</p>
                <h2>Track every mile and every dollar.</h2>
              </div>
            </section>

            {/* INTEGRATED SEARCH BAR */}
            <input 
              className="search-input"
              placeholder="Where to next? (Enter city and press Enter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />

            <div className="trip-form">
              <h3>Create New Trip</h3>
              <input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <input type="number" placeholder="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
              <button onClick={createTrip}>Save Trip</button>
            </div>

            <section>
              <h3>Recent Trips</h3>
              <div className="saved-list">
                {trips.map(trip => (
                  <article key={trip.id} className="trip-card">
                    <h4>{trip.destination}</h4>
                    <BudgetProgressBar 
                      spent={trip.total_spent} 
                      budget={trip.total_budget} 
                    />
                    {/* Action Buttons with Fixed Styling */}
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                          <button 
                            onClick={() => updateBudget(trip.id, prompt("New Budget:", trip.total_budget))} 
                            style={{ 
                              flex: 1, 
                              padding: "10px", 
                              fontSize: "0.8rem", 
                              background: "var(--primary-light)", 
                              color: "white", 
                              borderRadius: "12px", 
                              fontWeight: "700" 
                            }}
                          >
                            Edit Budget
                          </button>
                          
                          <button 
                            onClick={() => deleteTrip(trip.id)} 
                            style={{ 
                              flex: 1, 
                              padding: "10px", 
                              fontSize: "0.8rem", 
                              background: "var(--danger)", 
                              color: "white", 
                              borderRadius: "12px", 
                              fontWeight: "700" 
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
          </>
        )}

        {/* NEW SEARCH RESULTS VIEW */}
        {view === "search-results" && (
          <section>
            <button onClick={() => setView("home")} className="text-button">← Back to Dashboard</button>
            <h2>Exploration: {searchQuery}</h2>
            
            {isSearching ? (
              <p className="message">Searching for flights and weather info...</p>
            ) : (
              <div className="destination-grid">
                {/* Weather Data */}
                <div className="trip-card">
                  <p className="eyebrow">Destination Weather</p>
                  {searchData.weather?.main ? (
                    <>
                      <h4>{searchData.weather.main.temp}°C</h4>
                      <p>{searchData.weather.weather[0].description}</p>
                      <p>Humidity: {searchData.weather.main.humidity}%</p>
                    </>
                  ) : <p>Weather data currently unavailable.</p>}
                </div>

                {/* Flight Data */}
                <div className="trip-card">
                  <p className="eyebrow">Flight Information</p>
                  {searchData.flights?.length > 0 ? (
                    searchData.flights.slice(0, 3).map((f, i) => (
                      <div key={i} style={{borderBottom: '1px solid var(--border)', padding: '5px 0'}}>
                        <p><strong>{f.airline}</strong>: ${f.price}</p>
                        <p style={{fontSize: '0.8rem'}}>{f.departure_time} - {f.arrival_time}</p>
                      </div>
                    ))
                  ) : <p>No flight routes found for this date.</p>}
                </div>
              </div>
            )}
          </section>
        )}

        {view === "expenses" && (
          <section>
            <h2>Expense Tracker</h2>
            {trips.map(trip => (
              <div key={trip.id} style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
                <h3 style={{ color: "var(--primary)" }}>{trip.destination}</h3>
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <input id={`name-${trip.id}`} placeholder="Item Name" style={{ flex: 2 }} />
                  <input id={`amt-${trip.id}`} type="number" placeholder="Amount" style={{ flex: 1 }} />
                  <button onClick={() => addExpense(trip.id)} style={{ padding: "10px 20px", background: "var(--primary)", color: "white", borderRadius: "12px" }}>Add</button>
                </div>
                {trip.expenses && trip.expenses.map(exp => (
                  <div key={exp.id} className="trip-card" style={{ display: "flex", justifyContent: "space-between", padding: "10px", marginBottom: "8px", alignItems: "center" }}>
                    {editingExpenseId === exp.id ? (
                      <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                        <input value={editExpenseData.item_name} onChange={(e) => setEditExpenseData({...editExpenseData, item_name: e.target.value})} style={{ flex: 2 }} />
                        <input type="number" value={editExpenseData.amount} onChange={(e) => setEditExpenseData({...editExpenseData, amount: e.target.value})} style={{ flex: 1 }} />
                        <button onClick={() => updateExpense(exp.id)} style={{ color: "green" }}>Save</button>
                        <button onClick={() => setEditingExpenseId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <span>{exp.item_name}</span>
                        <div>
                          <span style={{ fontWeight: "bold", marginRight: "15px" }}>${exp.amount}</span>
                          <button onClick={() => { setEditingExpenseId(exp.id); setEditExpenseData({ item_name: exp.item_name, amount: exp.amount }); }} style={{marginRight: '10px'}}>✎</button>
                          <button onClick={() => deleteExpense(exp.id)} style={{ color: "var(--danger)" }}>✕</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;