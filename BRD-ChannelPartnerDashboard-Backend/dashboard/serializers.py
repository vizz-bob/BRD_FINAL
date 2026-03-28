from rest_framework import serializers
from .models import Dashboard

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = "__all__"
#------------------------
# Recent agents
#------------------------
from rest_framework import serializers
from .models import RecentAgent

class RecentAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentAgent
        fields = "__all__"