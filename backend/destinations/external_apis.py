import requests
import os

FOURSQUARE_API_KEY = os.getenv('FOURSQUARE_API_KEY')
TICKETMASTER_API_KEY = os.getenv('TICKETMASTER_API_KEY')
AVIATIONSTACK_API_KEY = os.getenv('AVIATIONSTACK_API_KEY')

def get_restaurants(lat, lng, limit=10):
    """Fetch restaurants from Foursquare"""
    url = "https://api.foursquare.com/v3/places/search"
    headers = {"Authorization": FOURSQUARE_API_KEY}
    params = {
        "ll": f"{lat},{lng}",
        "categories": "13065",  # Restaurant category
        "limit": limit
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return response.json().get('results', [])
    except Exception as e:
        print(f"Error fetching restaurants: {e}")
    return []

def get_events(city, limit=10):
    """Fetch events from Ticketmaster"""
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "city": city,
        "apikey": TICKETMASTER_API_KEY,
        "size": limit
    }
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            return data.get('_embedded', {}).get('events', [])
    except Exception as e:
        print(f"Error fetching events: {e}")
    return []

def get_flights(origin, destination):
    """Fetch flight data from Aviationstack"""
    url = "http://api.aviationstack.com/v1/flights"
    params = {
        "access_key": AVIATIONSTACK_API_KEY,
        "dep_iata": origin,
        "arr_iata": destination
    }
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json().get('data', [])
    except Exception as e:
        print(f"Error fetching flights: {e}")
    return []