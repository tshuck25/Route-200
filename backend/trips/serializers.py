from rest_framework import serializers
from .models import Trip, Destination

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'name', 'description', 'is_featured', 'is_suggested', 'image_url']

class TripSerializer(serializers.ModelSerializer):
    destinations = DestinationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = ['id', 'title', 'start_date', 'end_date', 'budget', 'destinations']
