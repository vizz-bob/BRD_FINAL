from django import forms
from django.contrib.auth import get_user_model
from .models import ThirdPartyLead, InternalLead, OnlineLead

User = get_user_model()


class ManualLeadForm(forms.ModelForm):
    """
    Form for manually adding a single lead
    """

    CONSENT_CHOICES = (
        (True, "I confirm the customer has given consent"),
    )

    consent = forms.BooleanField(
        required=True,
        label="Customer Consent",
        error_messages={
            "required": "Customer consent is mandatory to create a lead."
        }
    )

    class Meta:
        model = Lead
        fields = [
            "vendor",
            "source",
            "product",
            "third_party_lead_id",
            "assigned_user",
            "name",
            "email",
            "contact_number",
            "lead_quality",
        ]

        widgets = {
            "vendor": forms.Select(attrs={"class": "form-control"}),
            "source": forms.Select(attrs={"class": "form-control"}),
            "product": forms.Select(attrs={"class": "form-control"}),
            "third_party_lead_id": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "External Lead ID (if any)"
            }),
            "assigned_user": forms.Select(attrs={"class": "form-control"}),
            "name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Full Name"
            }),
            "email": forms.EmailInput(attrs={
                "class": "form-control",
                "placeholder": "Email Address"
            }),
            "contact_number": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Contact Number"
            }),
            "lead_quality": forms.Select(attrs={"class": "form-control"}),
        }

    def clean_contact_number(self):
        contact_number = self.cleaned_data.get("contact_number")

        if not contact_number.isdigit():
            raise forms.ValidationError("Contact number must contain only digits.")

        if len(contact_number) < 10:
            raise forms.ValidationError("Contact number must be at least 10 digits.")

        return contact_number

    def clean_email(self):
        email = self.cleaned_data.get("email")

        if Lead.objects.filter(email=email).exists():
            raise forms.ValidationError("A lead with this email already exists.")

        return email

    def save(self, commit=True):
        lead = super().save(commit=False)
        lead.source_type = "manual"  # or lead.source = "manual" depending on model

        if commit:
            lead.save()

        return lead

class EmployeeReferralForm(forms.ModelForm):
    class Meta:
        model = InternalLead
        fields = [
            "source_department",
            "product",
            "campaign_name",
            "lead_status",
            "contact_name",
            "contact_email",
            "contact_phone",
        ]

        widgets = {
            "source_department": forms.Select(attrs={"class": "form-control"}),
            "product": forms.Select(attrs={"class": "form-control"}),
            "campaign_name": forms.TextInput(attrs={"class": "form-control"}),
            "lead_status": forms.Select(attrs={"class": "form-control"}),
            "contact_name": forms.TextInput(attrs={"class": "form-control"}),
            "contact_email": forms.EmailInput(attrs={"class": "form-control"}),
            "contact_phone": forms.TextInput(attrs={"class": "form-control"}),
        }

    def save(self, commit=True):
        lead = super().save(commit=False)
        lead.source_type = "employee_referral"
        if commit:
            lead.save()
        return lead

class ManualInternalLeadForm(forms.ModelForm):
    class Meta:
        model = InternalLead
        fields = [
            "product",
            "campaign_name",
            "lead_status",
            "contact_name",
            "contact_email",
            "contact_phone",
        ]

        widgets = {
            "product": forms.Select(attrs={"class": "form-control"}),
            "campaign_name": forms.TextInput(attrs={"class": "form-control"}),
            "lead_status": forms.Select(attrs={"class": "form-control"}),
            "contact_name": forms.TextInput(attrs={"class": "form-control"}),
            "contact_email": forms.EmailInput(attrs={"class": "form-control"}),
            "contact_phone": forms.TextInput(attrs={"class": "form-control"}),
        }

    def save(self, commit=True):
        lead = super().save(commit=False)
        lead.source_type = "manual"
        if commit:
            lead.save()
        return lead


class OnlineLeadManualForm(forms.ModelForm):
    """
    Manual entry form for Online Leads
    """

    consent = forms.BooleanField(
        required=True,
        label="Customer consent obtained",
        error_messages={
            "required": "Customer consent is mandatory to create an online lead."
        }
    )

    class Meta:
        model = OnlineLead
        fields = [
            "lead_source",
            "product",
            "campaign_name",
            "lead_status",
            "lead_quality",
            "contact_name",
            "contact_email",
            "contact_phone",
            "assigned_to",
        ]

        widgets = {
            "lead_source": forms.Select(attrs={"class": "form-control"}),
            "product": forms.Select(attrs={"class": "form-control"}),
            "campaign_name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Campaign / Landing Page Name"
            }),
            "lead_status": forms.Select(attrs={"class": "form-control"}),
            "lead_quality": forms.Select(attrs={"class": "form-control"}),
            "contact_name": forms.TextInput(attrs={"class": "form-control"}),
            "contact_email": forms.EmailInput(attrs={"class": "form-control"}),
            "contact_phone": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "10 digit mobile number"
            }),
            "assigned_to": forms.Select(attrs={"class": "form-control"}),
        }

    def clean_contact_phone(self):
        phone = self.cleaned_data.get("contact_phone")

        if not phone.isdigit():
            raise forms.ValidationError("Contact number must contain only digits.")

        if len(phone) < 10:
            raise forms.ValidationError("Contact number must be at least 10 digits.")

        return phone

    def clean_contact_email(self):
        email = self.cleaned_data.get("contact_email")

        if email and OnlineLead.objects.filter(contact_email=email).exists():
            raise forms.ValidationError(
                "An online lead with this email already exists."
            )

        return email

    def save(self, commit=True):
        lead = super().save(commit=False)
        lead.entry_type = "manual"   # mark source explicitly

        if commit:
            lead.save()
        return lead
