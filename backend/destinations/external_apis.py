import requests
import os

YELP_API_KEY = os.getenv('YELP_API_KEY')
TICKETMASTER_API_KEY = os.getenv('TICKETMASTER_API_KEY')
AVIATIONSTACK_API_KEY = os.getenv('AVIATIONSTACK_API_KEY')
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')



def get_restaurants(lat, lng, limit=10):
    """Fetch restaurants from Yelp"""
    url = "https://api.yelp.com/v3/businesses/search"
    headers = {"Authorization": f"Bearer {YELP_API_KEY}"}
    params = {
        "latitude": lat,
        "longitude": lng,
        "categories": "restaurants",
        "limit": limit
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        print(f"Yelp status: {response.status_code}")
        if response.status_code == 200:
            return response.json().get('businesses', [])
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
        response = requests.get(url, params=params)
        print(f"Ticketmaster status: {response.status_code}")
        print(f"Ticketmaster response: {response.text[:500]}")
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
        print(f"Error fetching flights: {e}")
    return []

def get_weather(lat,lng):
    """Fetch weather from OpenWeather"""
    url= "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lng,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Error getting weather: {e}")
    return {}