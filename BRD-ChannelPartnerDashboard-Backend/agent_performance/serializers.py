#--------------------------
# New Agent 
#-------------------------
from rest_framework import serializers
from .models import New_agent
class NewAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = New_agent
        fields = "__all__"
#----------------------------
# Dashboard
#-----------------------------
from rest_framework import serializers
from .models import Dashboard
class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = "__all__"
#---------------------------------
# all agent
#---------------------------------
from rest_framework import serializers
from .models import All_Agent


class AllAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = All_Agent
        fields = "__all__"
#------------------------------
# Edit Agent
#------------------------------
from rest_framework import serializers
from .models import Edit_Agent


class EditAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edit_Agent
        fields = "__all__"
#------------------------- 
# View agent
#-------------------------
from rest_framework import serializers
from .models import View_Agent


class ViewAgentSerializer(serializers.ModelSerializer):
    conversion_rate = serializers.SerializerMethodField()
    performance_remark = serializers.SerializerMethodField()

    class Meta:
        model = View_Agent
        fields = "__all__"

    def get_conversion_rate(self, obj):
        return obj.conversion_rate()

    def get_performance_remark(self, obj):
        return obj.performance_remark()
#-----------------------
# Remove Agent
#------------------------
from rest_framework import serializers
from .models import Remove_Agent


class RemoveAgentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Remove_Agent
        fields = "__all__"