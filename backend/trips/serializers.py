from rest_framework import serializers
from .models import Trip, Expense
from django.db.models import Sum
from django.contrib.auth.models import User


# --- AUTH SERIALIZERS ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

# --- LEAD 3 SERIALIZERS ---

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        # 'trip' is included so the frontend can send the trip ID
        fields = ['id', 'trip', 'item_name', 'amount', 'category', 'description']

class TripSerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True, read_only=True)
    
    # These use the @property methods defined in your Trip model
    total_spent = serializers.ReadOnlyField()
    remaining_budget = serializers.ReadOnlyField()

    class Meta:
        model = Trip
        fields = [
            'id', 
            'destination', 
            'total_budget', 
            'start_date', 
            'end_date', 
            'expenses', 
            'total_spent', 
            'remaining_budget'
        ]

class TripWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['destination', 'total_budget', 'start_date', 'end_date']

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'name', 'description', 'is_featured', 'is_suggested', 'image_url', 'price']