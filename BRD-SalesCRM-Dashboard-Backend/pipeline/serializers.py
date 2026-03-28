from rest_framework import serializers
from .models import Lead,CRMTool


class LeadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lead
        fields = '__all__'
class CRMToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = CRMTool
        fields = '__all__'