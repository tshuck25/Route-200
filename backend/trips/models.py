from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Added for detail bar [cite: 30]

    def __str__(self):
        return self.title

class Destination(models.Model):
    # Links to a trip OR can be a standalone "Suggested" destination
    trip = models.ForeignKey(Trip, related_name='destinations', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False) # For Page 2 [cite: 11]
    is_suggested = models.BooleanField(default=False) # For Page 2 [cite: 10]
    image_url = models.URLField(blank=True) # For Picture placeholders [cite: 43]

    def __str__(self):
        return self.name
