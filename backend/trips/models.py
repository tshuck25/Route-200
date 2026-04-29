from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    # Links the trip to a specific user
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    destination = models.CharField(max_length=255)
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.destination} ({self.user.username})"

class Expense(models.Model):
    # Category choices for a cleaner UI/UX
    CATEGORY_CHOICES = [
        ('food', 'Food & Dining'),
        ('transport', 'Transportation'),
        ('lodging', 'Lodging'),
        ('entertainment', 'Entertainment'),
        ('other', 'Other'),
    ]

    # The Relationship: One Trip -> Many Expenses
    trip = models.ForeignKey(Trip, related_name='expenses', on_delete=models.CASCADE)
    item_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_name}: ${self.amount} ({self.trip.destination})"