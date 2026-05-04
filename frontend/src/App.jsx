import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import "./App.css";

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
      body: JSON.stringify({ item_name: nameEl.value, amount: amtEl.value, trip: tripId, category: "Other" }),
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
        {view === "home" && (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">Lead 3 Milestone</p>
                <h2>Track every mile and every dollar.</h2>
              </div>
            </section>

            <div className="trip-form">
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
                    <p style={{ color: "var(--muted)", margin: "4px 0" }}>Budget: ${trip.total_budget} | Spent: ${trip.total_spent}</p>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button onClick={() => updateBudget(trip.id, prompt("New Budget:", trip.total_budget))} style={{ fontSize: "0.7rem", padding: "5px", background: "var(--primary-light)", color: "white", borderRadius: "4px" }}>Edit</button>
                      <button onClick={() => deleteTrip(trip.id)} style={{ fontSize: "0.7rem", padding: "5px", background: "var(--danger)", color: "white", borderRadius: "4px" }}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
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
                {trip.expenses.map(exp => (
                  <div key={exp.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "white", borderRadius: "12px", marginBottom: "8px", border: "1px solid var(--border)" }}>
                    <span>{exp.item_name}</span>
                    <div>
                      <span style={{ fontWeight: "bold", marginRight: "15px" }}>${exp.amount}</span>
                      <button onClick={() => deleteExpense(exp.id)} style={{ color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                    </div>
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