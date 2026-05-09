from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import DestinationCatalog
from .external_apis import get_restaurants, get_events, get_restaurants_by_city, get_weather, get_flights

@api_view(['GET'])
@permission_classes([AllowAny])
def destination_details(request, destination_id):
    """Get destination with external API data"""
    try:
        destination = DestinationCatalog.objects.get(id=destination_id)
        
        data = {
            'destination': {
                'id': destination.id,
                'name': f"{destination.city}, {destination.country}",
                'city': destination.city,
                'country': destination.country,
                'latitude': destination.latitude,
                'longitude': destination.longitude,
            },

            'restaurants': get_restaurants(
                destination.latitude,
                destination.longitude
            ),

            'events': get_events(destination.city),

            'weather': get_weather(destination.city),

            'flights': []
        }
        
        return Response(data)
    except DestinationCatalog.DoesNotExist:
        return Response({'error': 'Destination not found'}, status=404)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def destination_lookup(request):

    city = request.GET.get('search', '')

    destination = DestinationCatalog.objects.filter(
        city__icontains=city
    ).first()

    if not destination:
        return Response(
            {'error': 'Destination not found'},
            status=404
        )

    return Response({
        'id': destination.id,
        'city': destination.city,
        'country': destination.country
    })

@api_view(["GET"])
@permission_classes([AllowAny])
def search_destination(request):
    city = request.GET.get("city", "").strip()
    origin = request.GET.get("origin", "").strip()
    destination_airport = request.GET.get("destination_airport", "").strip()

    if not city:
        return Response({"error": "City is required"}, status=400)

    data = {
        "city": city,
        "restaurants": get_restaurants_by_city(city),
        "events": get_events(city),
        "weather": get_weather(city),
        "flights": [],
    }

    if origin and destination_airport:
        data["flights"] = get_flights(origin, destination_airport)

    return Response(data)

