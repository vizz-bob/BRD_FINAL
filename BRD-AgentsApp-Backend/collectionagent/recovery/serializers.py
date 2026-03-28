from rest_framework import serializers
from .models import Payment
from .models import RecoveryFollowUp
from .models import RecoveryRepossessionHistory
from django import forms
from .models import VehicleScan
from .models import YardEntry, YardPhoto, Vehicle, RecoveryActivity


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('created_at', 'collection_date')

class FollowUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryFollowUp
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    vehicle_number = serializers.CharField(source='vehicle.vehicle_number')

    class Meta:
        model = RecoveryActivity
        # fields = ['id', 'vehicle_number', 'action', 'timestamp']
        fields = '__all__'



class YardPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = YardPhoto
        fields = ["id", "image"]


class YardEntrySerializer(serializers.ModelSerializer):
    photos = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=True
    )

    class Meta:
        model = YardEntry
        fields = [
            "id",
            "vehicle",
            "odometer_reading",
            "fuel_level",
            "vehicle_condition",
            "tyres_condition",
            "spare_tyre",
            "jack",
            "toolkit",
            "floor_mats",
            "music_system",
            "rc_available",
            "insurance_available",
            "pollution_available",
            "servicebook_available",
            "damages",
            "photos",
        ]

    def validate_photos(self, photos):
        if len(photos) < 4:
            raise serializers.ValidationError("Minimum 4 photos are required.")
        return photos


class RecoveryRepossessionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryRepossessionHistory
        fields = '__all__'



class VehicleScanForm(forms.ModelForm):
    class Meta:
        model = VehicleScan
        fields = ['vehicle_number', 'file']