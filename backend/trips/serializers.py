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
        fields = ['id', 'item_name', 'amount', 'category', 'description']

class TripSerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True, read_only=True)
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        # REMOVED 'title' as it was causing the crash
        fields = ['id', 'destination', 'total_budget', 'start_date', 'end_date', 'expenses', 'total_spent']

    def get_total_spent(self, obj):
        total = obj.expenses.aggregate(Sum('amount'))['amount__sum']
        return float(total) if total is not None else 0.0

class TripWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        # REMOVED 'title' here as well to match the model
        fields = ['destination', 'total_budget', 'start_date', 'end_date']