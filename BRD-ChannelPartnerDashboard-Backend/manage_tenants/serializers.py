from rest_framework import serializers
from .models import Dashboard, NewTenant, ShowTenant

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = '__all__'

class NewTenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewTenant
        fields = '__all__'

class ShowTenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowTenant
        fields = '__all__'