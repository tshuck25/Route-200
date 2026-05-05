import requests
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Destination
from .serializers import DestinationSerializer
from rest_framework import generics, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Trip, Expense
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    TripSerializer,
    TripWriteSerializer,
    ExpenseSerializer,
)
from . import services


# --- AUTH VIEWS ---

class ProfileView(generics.RetrieveAPIView):
    """
    Returns the profile data of the currently authenticated user.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# --- TRIP VIEWS ---

class TripListCreateView(generics.ListCreateAPIView):
    """
    List all trips for the user or create a new trip.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return TripSerializer
        return TripWriteSerializer

    def perform_create(self, serializer):
        # Automatically associate the trip with the logged-in user
        serializer.save(user=self.request.user)

class DestinationSearchView(generics.ListAPIView):
    #Search and filter suggested destinations#
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['is_featured']

    def get_queryset(self):
        queryset = Destination.objects.filter(is_suggested=True)
        
        # Filter by price range if provided
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset


class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific trip.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return TripSerializer
        return TripWriteSerializer


# --- EXPENSE VIEWS ---

class ExpenseListCreateView(generics.ListCreateAPIView):
    """
    List all expenses across user trips or create a new expense for a trip.
    """
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only returns expenses for trips owned by the current user
        return Expense.objects.filter(trip__user=self.request.user)

    def perform_create(self, serializer):
        # The trip ID comes from the frontend; the serializer handles the link.
        serializer.save()


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, Update (PATCH), or Delete an individual expense.
    Enabled 'Update' by switching to RetrieveUpdateDestroyAPIView.
    """
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only modify expenses belonging to their own trips
        return Expense.objects.filter(trip__user=self.request.user)


# --- EXTERNAL API PROXY VIEWS ---

class WeatherView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        city = request.query_params.get("city")
        if not city:
            return Response(
                {"error": "city param required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            data = services.get_weather(city)
            return Response(data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )


class FlightsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        origin = request.query_params.get("origin")
        destination = request.query_params.get("destination")
        date = request.query_params.get("date")

        if not all([origin, destination, date]):
            return Response(
                {"error": "origin, destination, and date are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            data = services.get_flights(origin, destination, date)
            return Response(data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )