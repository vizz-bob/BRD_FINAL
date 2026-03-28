#---------------------------
# Sign in
#--------------------------
from rest_framework import serializers
from .models import Sign_in
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


class SignInSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sign_in
        fields = "__all__"

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            # Authenticate using username (which is email in our case)
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError(
                    {"error": "Invalid email or password"}
                )
            # Store user info for later use
            data['authenticated_user'] = user
        return data

    def create(self, validated_data):
        # Remove authenticated_user from validated_data before saving
        validated_data.pop('authenticated_user', None)
        # Don't hash password again - just store the record
        return super().create(validated_data)
