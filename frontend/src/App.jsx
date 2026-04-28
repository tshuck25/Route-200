import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [view, setView] = useState("home");
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);

  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(0);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [message, setMessage] = useState("");

  // ---------------- AUTH ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? "token/" : "signup/";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      console.log("AUTH RESPONSE:", data);

      if (response.ok) {
        if (isLoginView) {
          localStorage.setItem("access_token", data.access);
          setToken(data.access);
        } else {
          setMessage("Account created. Please login.");
          setIsLoginView(true);
        }
      } else {
        setMessage(data.error || data.detail || "Error");
      }
    } catch {
      setMessage("Server connection failed.");
    }
  };

  // ---------------- FETCH TRIPS ----------------

  useEffect(() => {
    if (!token) return;

    console.log("FETCHING TRIPS WITH TOKEN:", token);

    fetch(`${import.meta.env.VITE_API_URL}/api/trips/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("TRIPS RESPONSE:", data);
        setTrips(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("TRIPS ERROR:", err));
  }, [token]);

  // ---------------- CREATE TRIP ----------------

  const createTrip = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/trips/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        title,
        destination,
        budget,
        start_date: startDate,
        end_date: endDate,
      }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTrips((prev) => [...prev, data]);
      setTitle("");
      setDestination("");
    }
  };

  // ---------------- LOGOUT ----------------

  const handleSignOut = () => {
    localStorage.clear();
    setToken(null);
    setTrips([]);
  };

  // ---------------- LOGIN SCREEN ----------------

  if (!token) {
    return (
      <main className="auth-page">
        <motion.section
          className="auth-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <img src="/logo.png" alt="Route 200 logo" style={{ height: 125 }} />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              {isLoginView ? "Login" : "Sign Up"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <button
            type="button"
            className="text-button"
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView
              ? "Don't have an account? Sign up free."
              : "Already have an account? Login"}
          </button>
        </motion.section>
      </main>
    );
  }

  // ---------------- MAIN APP ----------------

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        setView={setView}
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        onSignOut={handleSignOut}
      />

      <main className="dashboard">
        <section className="hero">
          <div>
            <p className="eyebrow">Plan smarter. Spend better.</p>
            <h2>Build your next trip with confidence.</h2>
          </div>
        </section>

        <input className="search-input" placeholder="Search destinations..." />

        {/* TEST BUTTON ALWAYS VISIBLE */}
        <div className="trip-form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <button onClick={createTrip}>
            Save Trip
          </button>
        </div>

        {view === "home" ? (
          <>
            <section className="featured-card">
              <div>
                <p className="eyebrow">Featured Destination</p>
                <h2>Explore affordable travel options</h2>
              </div>
            </section>
          </>
        ) : (
          <section>
            <h2>Saved Destinations</h2>

            <div className="saved-list">
              {trips.length === 0 ? (
                <p className="empty-state">No saved trips yet.</p>
              ) : (
                trips.map((trip) => (
                  <article key={trip.id} className="trip-card">
                    <h4>{trip.title}</h4>
                    <p>{trip.start_date}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;