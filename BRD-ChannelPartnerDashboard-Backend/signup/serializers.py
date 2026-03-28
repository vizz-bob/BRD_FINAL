#---------------------------
# create Account
#---------------------------
from rest_framework import serializers
from .models import Create_Account
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


class CreateAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Create_Account
        fields = "__all__"
        read_only_fields = ['user']

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError(
                {"password": "Passwords do not match"}
            )
        # Check if user with this email already exists
        if User.objects.filter(username=data.get('email')).exists():
            raise serializers.ValidationError(
                {"email": "A user with this email already exists"}
            )
        return data

    def create(self, validated_data):
        # Extract email to use as username
        email = validated_data.get('email')
        password = validated_data.get('password')
        full_name = validated_data.get('full_name', '')
        
        # Create Django User first
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,  # create_user will hash it
            first_name=full_name.split()[0] if full_name else '',
            last_name=' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else ''
        )
        
        # Now create the Create_Account instance
        validated_data['user'] = user
        # Password is already hashed by create_user, but we store it in the model field too
        validated_data['password'] = make_password(password)
        
        return super().create(validated_data)
