import requests
import os


def get_weather(city):
    api_key = os.environ.get("OPENWEATHER_API_KEY")
    url = "https://api.openweathermap.org/data/2.5/forecast"

    params = {
        "q": city,
        "appid": api_key,
        "units": "imperial",
        "cnt": 5,
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


def get_flights(origin, destination, date):
    api_key = os.environ.get("RAPIDAPI_KEY")

    url = "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights"

    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com"
    }

    params = {
        "originSkyId": origin,
        "destinationSkyId": destination,
        "originEntityId": origin,
        "destinationEntityId": destination,
        "date": date,
        "adults": "1",
        "currency": "USD",
        "countryCode": "US",
        "market": "en-US",
    }

    response = requests.get(url, headers=headers, params=params, timeout=15)
    response.raise_for_status()
    return response.json()