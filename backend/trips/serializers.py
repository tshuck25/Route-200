from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Trip, SavedActivity


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class SavedActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedActivity
        fields = "__all__"
        read_only_fields = ["id", "created_at"]


class TripSerializer(serializers.ModelSerializer):
    activities = SavedActivitySerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Trip
        fields = [
            "id", "user", "title", "destination",
            "budget", "start_date", "end_date",
            "created_at", "activities",
        ]
        read_only_fields = ["id", "user", "created_at"]


class TripWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ["id", "title", "destination", "budget", "start_date", "end_date"]