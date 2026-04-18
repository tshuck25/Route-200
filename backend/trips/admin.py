from django.contrib import admin
from .models import Trip, Destination

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'start_date', 'end_date')

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'trip', 'is_featured', 'is_suggested')
