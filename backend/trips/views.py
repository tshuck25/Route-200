from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Trip
from .serializers import TripSerializer

class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # request.user is populated by the JWT token
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically link new trips to the logged-in user
        serializer.save(user=self.request.user)
