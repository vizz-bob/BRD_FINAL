from rest_framework import serializers
from .models import Contact, Account, Activity, Meeting
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"


#----------------------------
#Account New
#-----------------------------
class AccountSerializer(serializers.ModelSerializer):
    parent_account_name = serializers.CharField(
        source='parent_account.company_name',
        read_only=True
    )

    class Meta:
        model = Account
        fields = '__all__'


#-----------------------------
# Task New
#----------------------------

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class MeetingSerializer(serializers.ModelSerializer):
    lead_name = serializers.ReadOnlyField(source='lead.name')

    class Meta:
        model = Meeting
        fields = '__all__'