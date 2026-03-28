from rest_framework import serializers
from .models import Training
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class TrainingSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Training
        fields = '__all__'
