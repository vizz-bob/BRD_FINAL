from django import forms
from .models import ContactLead


# class ContactLeadForm(forms.ModelForm):
#     class Meta:
#         model = ContactLead
#         fields = ["lead_name", "phone_number", "email", "city", "follow_up_date"]
#         widgets = {
#             "follow_up_date": forms.DateInput(attrs={"type": "date"}),
#         }


class ContactLeadForm(forms.ModelForm):
    class Meta:
        model = ContactLead
        fields = [
            "lead_name",
            "phone_number",
            "email",
            "city",
            "interest_area",
            "expected_loan_amount",
            "next_follow_up_date",
            "next_action",
            "qualification_notes",
        ]
        widgets = {
            "next_follow_up_date": forms.DateInput(attrs={"type": "date"}),
        }

# from django import forms
from .models import DocumentCollection


class DocumentUploadForm(forms.ModelForm):
    class Meta:
        model = DocumentCollection
        fields = "__all__"