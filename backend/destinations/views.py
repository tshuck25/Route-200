from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import DestinationCatalog
from .external_apis import get_restaurants, get_events

@api_view(['GET'])
@permission_classes([AllowAny])
def destination_details(request, destination_id):
    """Get destination with external API data"""
    try:
        destination = DestinationCatalog.objects.get(id=destination_id)
        
        data = {
            'destination': {
                'id': destination.id,
                'name': f"{destination.city}, {destination.country}",                'city': destination.city,
                'country': destination.country,
                'latitude': destination.latitude,
                'longitude': destination.longitude,
            },
            'restaurants': get_restaurants(destination.latitude, destination.longitude),
            'events': get_events(destination.city),
        }
        
        return Response(data)
    except DestinationCatalog.DoesNotExist:
        return Response({'error': 'Destination not found'}, status=404)