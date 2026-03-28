#-----------------------------
# add record
#-----------------------------
from rest_framework import serializers
from .models import RecoveryRecord
class RecoveryRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryRecord
        fields = "__all__"
#----------------------------------
# Dashboard
#---------------------------------
from rest_framework import serializers
from .models import Dashboard
class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = "__all__"
#---------------------------
# search
#---------------------------
from rest_framework import serializers
from .models import Recovery_Search
class RecoverySearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recovery_Search
        fields = "__all__"
#----------------------------------
# Recovery payment main edit
#-----------------------------------
from rest_framework import serializers
from .models import EditRecovery


class EditRecoverySerializer(serializers.ModelSerializer):
    class Meta:
        model = EditRecovery
        fields = "__all__"