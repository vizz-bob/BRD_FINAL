# checked_lead/serializers.py

from rest_framework import serializers
from .models import CheckedLead

class CheckedLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckedLead
        fields = '__all__'

class CheckedLeadKanbanSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckedLead
        fields = ['id', 'status', 'assigned_to']  # adjust fields as needed

