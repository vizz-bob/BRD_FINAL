from rest_framework import serializers
from .models import DashboardLead


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardLead
        fields = '__all__'
