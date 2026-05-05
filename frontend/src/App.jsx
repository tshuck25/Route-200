import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import "./App.css";
import BudgetProgressBar from "./components/BudgetProgressBar";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState({ weather: null, flights: null });
  const [isSearching, setIsSearching] = useState(false);

  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editExpenseData, setEditExpenseData] = useState({ item_name: "", amount: "" });

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
    // Only trigger if it's a form submit or Enter key
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    if (e.preventDefault) e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    setView("search-results");

    try {
      const weatherRes = await fetch(`${import.meta.env.VITE_API_URL}/api/weather/?city=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (weatherRes.status === 502) {
        setSearchData(prev => ({ ...prev, weather: { error: "Weather service unavailable" } }));
      } else {
        const weather = await weatherRes.json();
        setSearchData(prev => ({ ...prev, weather }));
      }

      const flightRes = await fetch(`${import.meta.env.VITE_API_URL}/api/flights/?origin=NYC&destination=${searchQuery}&date=2026-06-01`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (flightRes.ok) {
        const flights = await flightRes.json();
        setSearchData(prev => ({ ...prev, flights }));
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
    if (!window.confirm("Delete this trip?")) return;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) setTrips(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = async (id, newBudget) => {
    if (!newBudget) return;
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
      body: JSON.stringify({ item_name: nameEl.value, amount: parseFloat(amtEl.value), trip: tripId }),
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
      body: JSON.stringify(editExpenseData),
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
      <Sidebar view={view} setView={setView} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} onSignOut={handleSignOut} />        
      
      <main className="dashboard">
        {/* Global Search Bar (Only shows when not in results) */}
        {view !== "search-results" && (
          <form onSubmit={handleSearch} className="search-container">
            <input 
              className="search-input-main"
              placeholder="Search destinations (e.g. Tokyo)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        )}
        
        {view === "home" && (
          <>
            <section className="hero">
              <p className="eyebrow">Trip Dashboard</p>
              <h2>Track every mile and every dollar.</h2>
            </section>

            <div className="trip-form">
              <h3>Create New Trip</h3>
              <input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
              <div className="date-row">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <input type="number" placeholder="Budget (USD)" value={budget} onChange={(e) => setBudget(e.target.value)} />
              <button onClick={createTrip}>Save Trip</button>
            </div>

            <section>
              <h3>My Trips</h3>
              <div className="saved-list">
                {trips.map(trip => (
                  <article key={trip.id} className="trip-card">
                    <h4>{trip.destination}</h4>
                    <BudgetProgressBar spent={trip.total_spent} budget={trip.total_budget} />
                    <div className="card-actions">
                      <button onClick={() => updateBudget(trip.id, prompt("New Budget:", trip.total_budget))}>Edit Budget</button>
                      <button className="danger-btn" onClick={() => deleteTrip(trip.id)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {view === "search-results" && (
          <section>
            <button onClick={() => setView("home")} className="text-button">← Back to Dashboard</button>
            <h2>Results for: {searchQuery}</h2>
            {isSearching ? <p>Loading data...</p> : (
              <div className="destination-grid">
                <div className="trip-card">
                  <p className="eyebrow">Weather</p>
                  {searchData.weather?.main ? (
                    <div>
                      <h4>{searchData.weather.main.temp}°C</h4>
                      <p>{searchData.weather.weather[0].description}</p>
                    </div>
                  ) : <p>Weather unavailable.</p>}
                </div>
                <div className="trip-card">
                  <p className="eyebrow">Flights</p>
                  {searchData.flights?.slice(0, 3).map((f, i) => (
                    <p key={i}><strong>{f.airline}</strong>: ${f.price}</p>
                  )) || <p>No flights found.</p>}
                </div>
              </div>
            )}
          </section>
        )}

        {view === "expenses" && (
          <section>
            <h2>Expense Tracker</h2>
            {trips.map(trip => (
              <div key={trip.id} className="expense-group">
                <h3>{trip.destination}</h3>
                <div className="add-expense-row">
                  <input id={`name-${trip.id}`} placeholder="Item" />
                  <input id={`amt-${trip.id}`} type="number" placeholder="Amount" />
                  <button onClick={() => addExpense(trip.id)}>Add</button>
                </div>
                {trip.expenses?.map(exp => (
                  <div key={exp.id} className="expense-item">
                    {editingExpenseId === exp.id ? (
                      <>
                        <input value={editExpenseData.item_name} onChange={(e) => setEditExpenseData({...editExpenseData, item_name: e.target.value})} />
                        <input type="number" value={editExpenseData.amount} onChange={(e) => setEditExpenseData({...editExpenseData, amount: e.target.value})} />
                        <button onClick={() => updateExpense(exp.id)}>Save</button>
                      </>
                    ) : (
                      <>
                        <span>{exp.item_name} - ${exp.amount}</span>
                        <button onClick={() => {setEditingExpenseId(exp.id); setEditExpenseData({item_name: exp.item_name, amount: exp.amount})}}>✎</button>
                        <button onClick={() => deleteExpense(exp.id)}>✕</button>
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