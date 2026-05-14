import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Sidebar from "./components/Sidebar";
import BudgetProgressBar from "./components/BudgetProgressBar";
import SearchResults from "./components/SearchResults";

import "./App.css";

function App() {
  const [view, setView] = useState("home");
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);

  const [trips, setTrips] = useState([]);

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [message, setMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [origin, setOrigin] =
    useState("JFK");

  const [
    destinationAirport,
    setDestinationAirport,
  ] = useState("ORD");

  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const [editExpenseData, setEditExpenseData] = useState({
    item_name: "",
    amount: "",
  });

  const [savedItems, setSavedItems] = useState(() => {
    const stored = localStorage.getItem("savedItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "savedItems",
      JSON.stringify(savedItems)
    );
  }, [savedItems]);

  const toggleSaveItem = (item) => {
    const exists = savedItems.find(
      (saved) => saved.id === item.id
    );

    if (exists) {
      setSavedItems((prev) =>
        prev.filter((saved) => saved.id !== item.id)
      );
    } else {
      setSavedItems((prev) => [...prev, item]);
    }
  };

  // ---------------- AUTH ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLoginView
      ? "token/"
      : "signup/";

    try {
      const response = await fetch(
        `http://3.144.125.30:8000/api/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (isLoginView) {
          localStorage.setItem(
            "access_token",
            data.access
          );

          setToken(data.access);
        } else {
          setMessage("Account created. Please login.");
          setIsLoginView(true);
        }
      } else {
        setMessage(
          data.error ||
          data.detail ||
          "Authentication failed."
        );
      }
    } catch {
      setMessage("Server connection failed.");
    }
  };

  // ---------------- FETCH TRIPS ----------------

  const fetchTrips = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [token]);

  // ---------------- SEARCH ----------------

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setView("search-results");
  };

  // ---------------- CREATE TRIP ----------------

  const createTrip = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            destination,
            total_budget: parseFloat(budget),
            start_date: startDate,
            end_date: endDate,
          }),
        }
      );

      if (response.ok) {
        fetchTrips();

        setDestination("");
        setBudget("");
        setStartDate("");
        setEndDate("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- DELETE TRIP ----------------

  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTrips((prev) =>
          prev.filter((trip) => trip.id !== id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- UPDATE BUDGET ----------------

  const updateBudget = async (id, newBudget) => {
    if (!newBudget) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            total_budget: parseFloat(newBudget),
          }),
        }
      );

      if (response.ok) {
        fetchTrips();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- ADD EXPENSE ----------------

  const addExpense = async (tripId) => {
    const nameEl = document.getElementById(
      `name-${tripId}`
    );

    const amtEl = document.getElementById(
      `amt-${tripId}`
    );

    if (!nameEl.value || !amtEl.value) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            item_name: nameEl.value,
            amount: parseFloat(amtEl.value),
            trip: tripId,
          }),
        }
      );

      if (response.ok) {
        nameEl.value = "";
        amtEl.value = "";

        fetchTrips();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- DELETE EXPENSE ----------------

  const deleteExpense = async (expenseId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/${expenseId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchTrips();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- UPDATE EXPENSE ----------------

  const updateExpense = async (expenseId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/${expenseId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editExpenseData),
        }
      );

      if (response.ok) {
        setEditingExpenseId(null);
        fetchTrips();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- SIGN OUT ----------------

  const handleSignOut = () => {
    localStorage.removeItem("access_token");

    setToken(null);
    setTrips([]);
  };

  // ---------------- LOGIN VIEW ----------------

  if (!token) {
    return (
      <main className="auth-page">
        <motion.section
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src="/logo.png"
            alt="Route 200"
            className="auth-logo"
          />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              {isLoginView ? "Login" : "Sign Up"}
            </button>
          </form>

          {message && (
            <p className="message">{message}</p>
          )}

          <button
            className="text-button"
            onClick={() =>
              setIsLoginView(!isLoginView)
            }
          >
            {isLoginView
              ? "Create an account"
              : "Back to Login"}
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

        {view !== "search-results" && (
          <form
            onSubmit={handleSearch}
            className="search-container"
          >
            <input
              className="search-input-main"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

            <button
              type="submit"
              className="search-btn"
            >
              Search
            </button>
          </form>
        )}

        {view === "home" && (
          <>
            <section className="hero">
              <p className="eyebrow">
                Plan Smarter. Spend Better.
              </p>

              <h2>
                Build your next trip with confidence.
              </h2>
            </section>

            <div className="trip-form">
              <h3>Create New Trip</h3>

              <input
                placeholder="Destination"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
              />

              <div className="date-row">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                />
              </div>

              <input
                type="number"
                placeholder="Budget"
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value)
                }
              />

              <button onClick={createTrip}>
                Save Trip
              </button>
            </div>

            <section>
              <h3>My Trips</h3>

              <div className="saved-list">
                {trips.map((trip) => (
                  <article
                    key={trip.id}
                    className="trip-card"
                  >
                    <h4>{trip.destination}</h4>

                    <BudgetProgressBar
                      spent={trip.total_spent}
                      budget={trip.total_budget}
                    />

                    <div className="card-actions">
                      <button
                        onClick={() =>
                          updateBudget(
                            trip.id,
                            prompt(
                              "New Budget:",
                              trip.total_budget
                            )
                          )
                        }
                      >
                        Edit Budget
                      </button>

                      <button
                        className="danger-btn"
                        onClick={() =>
                          deleteTrip(trip.id)
                        }
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

        {view === "search-results" && (
          <section>
            <button
              onClick={() => setView("home")}
              className="home-text-button"
            >
              ← Back to Dashboard
            </button>
            

            <SearchResults
              searchQuery={searchQuery}
              token={token}
              origin={origin}
              destinationAirport={destinationAirport}
              savedItems={savedItems}
              toggleSaveItem={toggleSaveItem}
            />
          </section>
        )}

        {view === "saved" && (
          <section>
            <h2>Saved Items</h2>

            <div className="results-grid">
              {savedItems.map((item) => (
                <article
                  key={item.id}
                  className="result-card"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="result-image"
                  />

                  <div className="result-content">
                    <h3>{item.name}</h3>

                    {item.address && (
                      <p>{item.address}</p>
                    )}

                    {item.venue && (
                      <p>{item.venue}</p>
                    )}

                    {item.date && (
                      <p>{item.date}</p>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="result-link"
                    >
                      Open
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === "expenses" && (
          <section>
            <h2>Expense Tracker</h2>

            {trips.map((trip) => (
              <div
                key={trip.id}
                className="expense-group"
              >
                <h3>{trip.destination}</h3>

                <div className="add-expense-row">
                  <input
                    id={`name-${trip.id}`}
                    placeholder="Item"
                  />

                  <input
                    id={`amt-${trip.id}`}
                    type="number"
                    placeholder="Amount"
                  />

                  <button
                    onClick={() =>
                      addExpense(trip.id)
                    }
                  >
                    Add
                  </button>
                </div>

                {trip.expenses?.map((exp) => (
                  <div
                    key={exp.id}
                    className="expense-item"
                  >
                    {editingExpenseId === exp.id ? (
                      <>
                        <input
                          value={
                            editExpenseData.item_name
                          }
                          onChange={(e) =>
                            setEditExpenseData({
                              ...editExpenseData,
                              item_name:
                                e.target.value,
                            })
                          }
                        />

                        <input
                          type="number"
                          value={
                            editExpenseData.amount
                          }
                          onChange={(e) =>
                            setEditExpenseData({
                              ...editExpenseData,
                              amount:
                                e.target.value,
                            })
                          }
                        />

                        <button
                          onClick={() =>
                            updateExpense(exp.id)
                          }
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <span>
                          {exp.item_name} - $
                          {exp.amount}
                        </span>

                        <button
                          onClick={() => {
                            setEditingExpenseId(
                              exp.id
                            );

                            setEditExpenseData({
                              item_name:
                                exp.item_name,
                              amount: exp.amount,
                            });
                          }}
                        >
                          ✎
                        </button>

                        <button
                          onClick={() =>
                            deleteExpense(exp.id)
                          }
                        >
                          ✕
                        </button>
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