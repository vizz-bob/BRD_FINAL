#---------------------------
# Payout Dashbaord
#---------------------------
from rest_framework import serializers
from .models import Payout_Dashboard

class PayoutDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout_Dashboard
        fields = "__all__"
#-----------------------
# Search
#-----------------------
from rest_framework import serializers
from .models import Payout_Search

class PayoutSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout_Search
        fields = "__all__"
#------------------------------
# payout updated
#-----------------------------
from rest_framework import serializers
from .models import Payout_Agent

class PayoutAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout_Agent
        fields = "__all__"