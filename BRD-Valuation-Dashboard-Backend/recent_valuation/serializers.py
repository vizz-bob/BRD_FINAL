from rest_framework import serializers
from .models import PropertyInformation,ValuationAssessment
from .models import ClientInformation,Details,Documents,RecentValuation
#-----------------------
# Property Information
#------------------------
class PropertyInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyInformation
        fields = '__all__'
#-----------------------------
# Valuation Assessment
#-----------------------------
class ValuationAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValuationAssessment
        fields = '__all__'
#--------------------------
#Client Information
#--------------------------
class ClientInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientInformation
        fields = '__all__'
#---------------------------
# Details
#---------------------------
class DetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Details
        fields = '__all__'
#----------------------------
# Documents
#--------------------------
class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = '__all__'
#----------------------------
# Recent valuation
#----------------------------
class RecentValuationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentValuation
        fields = '__all__'