#--------------------------------
# Property status pending
#---------------------------------
from rest_framework import serializers
from .models import PropertyPending
class PropertyPendingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyPending
        fields = "__all__"
#-------------------------
# In progress
#-------------------------
from rest_framework import serializers
from .models import PropertyInProgress


class PropertyInProgressSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyInProgress
        fields = "__all__"
#---------------------------------
# Property status Completed
#---------------------------------
from rest_framework import serializers
from .models import PropertyCompleted


class PropertyCompletedSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyCompleted
        fields = "__all__"
#-----------------------------
# status and search
#----------------------------
from rest_framework import serializers
from .models import StatusSearch


class StatusSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = StatusSearch
        fields = "__all__"