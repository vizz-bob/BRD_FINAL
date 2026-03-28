# app/forms.py
from django import forms
from .models import Lead

class LeadForm(forms.ModelForm):
    class Meta:
        model = Lead
        fields = [
            "tenant", "lead_name", "email", "phone",
            "source_type", "event_name_or_referral_by", "assigned_team","product_category",
            "assigned_user", "lead_status", "notes", "image"
        ]
        widgets = {
            "product_category": forms.CheckboxSelectMultiple,
            "notes": forms.Textarea(attrs={"rows": 4}),
        }
