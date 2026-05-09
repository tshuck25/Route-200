import React from "react";

import {
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

function DestinationCard({
  destination,
  restaurants = [],
  events = [],
  weather = {},
  flights = [],
  savedItems = [],
  toggleSaveItem,
}) {
  return (
    <div className="results-layout">

      {/* DESTINATION HEADER */}
      <div className="results-hero">
        <h1>{destination.name}</h1>

        <p>
          Explore restaurants and live events in{" "}
          {destination.city}
        </p>
      </div>

      {/* WEATHER */}
      <section className="results-section">
        <div className="section-header">
          <h2>Weather</h2>
        </div>

        {weather.main ? (
          <div className="weather-card">
            <h3>
              {Math.round(weather.main.temp)}°F
            </h3>

            <p>
              {weather.weather?.[0]?.description}
            </p>

            <div className="weather-meta">
              <span>
                Humidity: {weather.main.humidity}%
              </span>

              <span>
                Wind: {weather.wind?.speed} mph
              </span>
            </div>
          </div>
        ) : (
          <p>No weather data found.</p>
        )}
      </section>

      {/* RESTAURANTS */}
      <section className="results-section">
        <div className="section-header">
          <h2>Restaurants</h2>
        </div>

        {restaurants.length > 0 ? (
          <div className="results-grid">

            {restaurants.slice(0, 8).map((restaurant) => {

              const isSaved = savedItems.some(
                (item) => item.id === restaurant.id
              );

              return (
                <article
                  key={restaurant.id}
                  className="result-card"
                >
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="result-image"
                  />

                  <div className="result-content">

                    <div className="card-top-row">
                      <h3>{restaurant.name}</h3>

                      <button
                        className="save-btn"
                        onClick={() =>
                          toggleSaveItem({
                            id: restaurant.id,
                            type: "restaurant",
                            name: restaurant.name,
                            image: restaurant.image_url,
                            address:
                              restaurant.location?.display_address?.join(", "),
                            url: restaurant.url,
                          })
                        }
                      >
                        {isSaved ? (
                          <BookmarkCheck size={20} />
                        ) : (
                          <Bookmark size={20} />
                        )}
                      </button>
                    </div>

                    <div className="result-meta">
                      <span>
                        ⭐ {restaurant.rating}
                      </span>

                      {restaurant.price && (
                        <span>
                          {restaurant.price}
                        </span>
                      )}
                    </div>

                    <p className="result-address">
                      {
                        restaurant.location
                          ?.display_address?.join(", ")
                      }
                    </p>

                    <div className="result-tags">
                      {restaurant.categories
                        ?.slice(0, 3)
                        .map((cat) => (
                          <span
                            key={cat.alias}
                            className="tag"
                          >
                            {cat.title}
                          </span>
                        ))}
                    </div>

                    <a
                      href={restaurant.url}
                      target="_blank"
                      rel="noreferrer"
                      className="result-link"
                    >
                      View on Yelp
                    </a>

                  </div>
                </article>
              );
            })}

          </div>
        ) : (
          <p>No restaurants found.</p>
        )}
      </section>

      {/* EVENTS */}
      <section className="results-section">
        <div className="section-header">
          <h2>Events</h2>
        </div>

        {events.length > 0 ? (
          <div className="results-grid">

            {events.slice(0, 8).map((event) => {

              const image =
                event.images?.find(
                  (img) => img.ratio === "16_9"
                )?.url ||
                event.images?.[0]?.url ||
                "/placeholder.jpg";

              const venue =
                event._embedded?.venues?.[0]
                  ?.name || "Venue TBA";

              const date =
                event.dates?.start?.localDate ||
                "Date TBA";

              const isSaved = savedItems.some(
                (item) => item.id === event.id
              );

              return (
                <article
                  key={event.id}
                  className="result-card"
                >
                  <img
                    src={image}
                    alt={event.name}
                    className="result-image"
                  />

                  <div className="result-content">

                    <div className="card-top-row">
                      <h3>{event.name}</h3>

                      <button
                        className="save-btn"
                        onClick={() =>
                          toggleSaveItem({
                            id: event.id,
                            type: "event",
                            name: event.name,
                            image,
                            venue,
                            date,
                            url: event.url,
                          })
                        }
                      >
                        {isSaved ? (
                          <BookmarkCheck size={20} />
                        ) : (
                          <Bookmark size={20} />
                        )}
                      </button>
                    </div>

                    <p className="result-date">
                      {date}
                    </p>

                    <p className="result-address">
                      {venue}
                    </p>

                    <a
                      href={event.url}
                      target="_blank"
                      rel="noreferrer"
                      className="result-link"
                    >
                      View Event
                    </a>

                  </div>
                </article>
              );
            })}

          </div>
        ) : (
          <p>No events found.</p>
        )}
      </section>

      {/* FLIGHTS */}
      <section className="results-section">
        <div className="section-header">
          <h2>Flights</h2>
        </div>

        {flights.length > 0 ? (
          <div className="results-grid">
            {flights.slice(0, 8).map((flight, index) => (
              <article
                key={index}
                className="result-card"
              >
                <div className="result-content">

                  <h3>
                    {flight.airline?.name ||
                      "Unknown Airline"}
                  </h3>

                  <p className="result-address">
                    {flight.departure?.iata} →
                    {" "}
                    {flight.arrival?.iata}
                  </p>

                  <p className="result-date">
                    Status:
                    {" "}
                    {flight.flight_status ||
                      "Unknown"}
                  </p>

                  <a
                    href={`https://www.google.com/travel/flights?q=Flights%20from%20${flight.departure?.iata}%20to%20${flight.arrival?.iata}`}
                    target="_blank"
                    rel="noreferrer"
                    className="result-link"
                  >
                    Search Flights
                  </a>

                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No flights found.</p>
        )}
      </section>

    </div>
  );
}

export default DestinationCard;