from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # Trips
    path('trips/', views.TripListCreateView.as_view(), name='trip-list'),
    path('trips/<int:pk>/', views.TripDetailView.as_view(), name='trip-detail'),
    
    # Expenses
    path('expenses/', views.ExpenseListCreateView.as_view(), name='expense-list'),
    path('expenses/<int:pk>/', views.ExpenseDetailView.as_view(), name='expense-detail'),
    
    # External APIs
    path('weather/', views.WeatherView.as_view(), name='weather'),
    path('flights/', views.FlightsView.as_view(), name='flights'),
]