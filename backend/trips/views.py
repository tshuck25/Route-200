import requests
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
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


# Auth Views

class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# Trip Views

class TripListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return TripSerializer
        return TripWriteSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return TripSerializer
        return TripWriteSerializer


# Expense Views (Lead 3 Implementation)

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only returns expenses for trips owned by the current user
        return Expense.objects.filter(trip__user=self.request.user)


class ExpenseDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(trip__user=self.request.user)


# External API Proxy Views

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