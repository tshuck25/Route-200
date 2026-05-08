
from django.urls import path
from . import views

urlpatterns = [
    path('<int:destination_id>/details/', views.destination_details, name='destination-details'),
]