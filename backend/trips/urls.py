from django.urls import path
from .views import TripListCreateView  # Updated this name

urlpatterns = [
    path('', TripListCreateView.as_view(), name='trip-list-create'), # Updated this name
]
