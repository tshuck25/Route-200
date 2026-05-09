
from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.search_destination, name='search-destination'),
    path('<int:destination_id>/details/', views.destination_details, name='destination-details'),
]