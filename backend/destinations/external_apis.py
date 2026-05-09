import requests
import os

YELP_API_KEY = os.getenv("YELP_API_KEY")
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")
AVIATIONSTACK_API_KEY = os.getenv("AVIATIONSTACK_API_KEY")


# ---------------- YELP RESTAURANTS ----------------

def get_restaurants_by_city(city, limit=10):
    url = "https://api.yelp.com/v3/businesses/search"

    headers = {
        "Authorization": f"Bearer {YELP_API_KEY}"
    }

    params = {
        "term": "restaurants",
        "location": city,
        "limit": limit
    }

    try:
        response = requests.get(
            url,
            headers=headers,
            params=params
        )

        print("========== YELP ==========")
        print("STATUS:", response.status_code)
        print("BODY:", response.text[:1000])

        if response.status_code == 200:
            data = response.json()

            return data.get("businesses", [])

    except Exception as e:
        print("YELP ERROR:", e)

    return []


# ---------------- TICKETMASTER EVENTS ----------------

def get_events(city, limit=10):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"

    params = {
        "city": city,
        "apikey": TICKETMASTER_API_KEY,
        "size": limit
    }

    try:
        response = requests.get(
            url,
            params=params
        )

        print("========== TICKETMASTER ==========")
        print("STATUS:", response.status_code)
        print("BODY:", response.text[:1000])

        if response.status_code == 200:
            data = response.json()

            return data.get(
                "_embedded",
                {}
            ).get("events", [])

    except Exception as e:
        print("EVENT ERROR:", e)

    return []


def get_restaurants(lat, lng, limit=10):
    url = "https://api.yelp.com/v3/businesses/search"

    headers = {
        "Authorization": f"Bearer {YELP_API_KEY}"
    }

    params = {
        "term": "restaurants",
        "latitude": lat,
        "longitude": lng,
        "limit": limit
    }

    try:
        response = requests.get(
            url,
            headers=headers,
            params=params
        )

        if response.status_code == 200:
            data = response.json()

            return data.get("businesses", [])

    except Exception as e:
        print("YELP LAT/LNG ERROR:", e)

    return []


# ---------------- FLIGHTS ----------------

def get_flights(origin, destination):
    url = "http://api.aviationstack.com/v1/flights"

    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "dep_iata": origin,
        "arr_iata": destination
    }

    try:
        response = requests.get(
            url,
            params=params
        )

        print("========== FLIGHTS ==========")
        print("STATUS:", response.status_code)
        print("BODY:", response.text[:1000])

        if response.status_code == 200:
            return response.json().get("data", [])

    except Exception as e:
        print("FLIGHT ERROR:", e)

    return []

# ---------------- WEATHER ----------------

def get_weather(city):
    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": city,
        "appid": os.getenv("OPENWEATHER_API_KEY"),
        "units": "imperial"
    }

    try:
        response = requests.get(
            url,
            params=params
        )

        print("========== WEATHER ==========")
        print("STATUS:", response.status_code)
        print("BODY:", response.text[:1000])

        if response.status_code == 200:
            return response.json()

    except Exception as e:
        print("WEATHER ERROR:", e)

    return {}