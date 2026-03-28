#--------------------------
# New property check
#---------------------------
from rest_framework import serializers
from .models import PropertyCheck


class PropertyCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyCheck
        fields = "__all__"
#----------------------------------
# Property Check Dashbaord
#----------------------------------
from rest_framework import serializers
from .models import PropertyDashboard


class PropertyDashboardSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyDashboard
        fields = "__all__"