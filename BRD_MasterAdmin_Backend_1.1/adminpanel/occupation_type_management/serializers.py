from rest_framework import serializers
from .models import OccupationTypeMaster

class OccupationTypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupationTypeMaster
        fields = "__all__"
