from rest_framework import serializers
<<<<<<< HEAD
<<<<<<< HEAD
from .models import Trip, Expense, Destination
=======
from .models import Trip, Expense
>>>>>>> 27ea0bca8d1fe8f23d1af39613ad4c675312a6bf
from django.db.models import Sum
=======
from .models import Trip, Expense
>>>>>>> 4900bda (Expense bar fixes)
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
<<<<<<< HEAD
<<<<<<< HEAD
        # REMOVED 'title' here as well to match the model
=======
>>>>>>> 27ea0bca8d1fe8f23d1af39613ad4c675312a6bf
        fields = ['destination', 'total_budget', 'start_date', 'end_date']

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'name', 'description', 'is_featured', 'is_suggested', 'image_url', 'price']
=======
        fields = ['destination', 'total_budget', 'start_date', 'end_date']
>>>>>>> 4900bda (Expense bar fixes)
