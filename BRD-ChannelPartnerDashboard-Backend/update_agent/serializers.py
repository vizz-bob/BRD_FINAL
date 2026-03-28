#---------------------------------
# update agent
#--------------------------------
from rest_framework import serializers
from .models import UpdateAgent

class UpdateAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpdateAgent
        fields = "__all__"
#------------------------------
# Identity Documents
#-------------------------------
from rest_framework import serializers
from .models import AgentKYC

class AgentKYCSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentKYC
        fields = "__all__"
#---------------------------
# Address
#----------------------------
from rest_framework import serializers
from .models import Address

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
#--------------------------
# Setting
#---------------------------
from .models import Setting
from rest_framework import serializers

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = "__all__"