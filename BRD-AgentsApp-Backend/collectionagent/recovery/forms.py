from django import forms
from .models import VehicleScan

class VehicleScanForm(forms.ModelForm):
    class Meta:
        model = VehicleScan
        fields = ['vehicle_number', 'file']  # 'file' is the FileField in VehicleScan
