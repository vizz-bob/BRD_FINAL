#---------------------------
# New Offer Details
#---------------------------
from rest_framework import serializers
from .models import New_Offer_Details


class NewOfferDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = New_Offer_Details
        fields = "__all__"

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if start_date and end_date:
            if end_date < start_date:
                raise serializers.ValidationError(
                    {"end_date": "End date cannot be before start date."}
                )
        return data
#-----------------------
# New Target
#------------------------
from rest_framework import serializers
from .models import New_Targetting


class NewTargettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = New_Targetting
        fields = "__all__"
#-----------------------
# dashboard
#-----------------------
from rest_framework import serializers
from .models import Dashboard


class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = "__all__"