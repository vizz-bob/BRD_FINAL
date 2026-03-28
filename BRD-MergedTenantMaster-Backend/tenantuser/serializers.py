from rest_framework import serializers
from .models import TenantUser

class TenantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantUser
        fields = '__all__'
