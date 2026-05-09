import React, {
  useState,
  useEffect,
} from "react";

import DestinationCard from "./DestinationCard";

const airportMap = {
  chicago: "ORD",
  seattle: "SEA",
  miami: "MIA",
  atlanta: "ATL",
  dallas: "DFW",

  "los angeles": "LAX",
  "new york": "JFK",

  hawaii: "HNL",
  honolulu: "HNL",

  "las vegas": "LAS",

  denver: "DEN",
  phoenix: "PHX",
  orlando: "MCO",
};

function SearchResults({
  searchQuery,
  token,
  savedItems,
  toggleSaveItem,
}) {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [origin, setOrigin] =
    useState("JFK");

  const destinationAirport =
    airportMap[
      searchQuery.toLowerCase()
    ] || "LAX";

  useEffect(() => {

    const fetchDestination =
      async () => {

        setLoading(true);
        setError("");

        try {

          const params =
            new URLSearchParams({
              city: searchQuery,
              origin,
              destination_airport:
                destinationAirport,
            });

          const response =
            await fetch(
              `${import.meta.env.VITE_API_URL}/api/destinations/search/?${params}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}`
            );
          }

          const result =
            await response.json();

          setData(result);

        } catch (err) {

          console.error(err);

          setError(
            "Failed to load destination."
          );

        } finally {

          setLoading(false);

        }
      };

    if (searchQuery.trim()) {
      fetchDestination();
    }

  }, [
    searchQuery,
    token,
    origin,
    destinationAirport,
  ]);

  if (loading) {
    return (
      <div className="loading-state">
        Loading destination...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-state">
        No destination data found.
      </div>
    );
  }

  return (
    <>
      <div className="flight-toolbar">

        <div className="flight-toolbar-group">
          <label>
            Flying From
          </label>

          <select
            value={origin}
            onChange={(e) =>
              setOrigin(
                e.target.value
              )
            }
          >
            <option value="JFK">
              New York (JFK)
            </option>

            <option value="LAX">
              Los Angeles (LAX)
            </option>

            <option value="ORD">
              Chicago (ORD)
            </option>

            <option value="SEA">
              Seattle (SEA)
            </option>

            <option value="ATL">
              Atlanta (ATL)
            </option>

            <option value="MIA">
              Miami (MIA)
            </option>
          </select>
        </div>

        <div className="flight-toolbar-group">
          <label>
            Nearest Destination Airport
          </label>

          <div className="airport-display">
            {destinationAirport}
          </div>
        </div>

      </div>

      <DestinationCard
        destination={{
          name: data.city,
          city: data.city,
        }}
        restaurants={
          data.restaurants || []
        }
        events={data.events || []}
        weather={data.weather || {}}
        flights={data.flights || []}
        savedItems={savedItems}
        toggleSaveItem={toggleSaveItem}
      />
    </>
  );
}

export default SearchResults;