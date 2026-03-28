from rest_framework import serializers
from .models import EmploymentTypeMaster

class EmploymentTypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentTypeMaster
        fields = "__all__"
