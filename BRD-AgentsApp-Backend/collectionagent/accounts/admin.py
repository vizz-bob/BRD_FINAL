
from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError
from .models import CollectionAccount, Recovery, FollowUp, CollectionProfile, RepossessionHistory,VisitRecording,VisitAudioRecording,VisitPhoto

admin.site.register(VisitRecording)
admin.site.register(VisitAudioRecording)
admin.site.register(VisitPhoto)
# =========================
# Collection Account Admin
# =========================
@admin.register(CollectionAccount)
class CollectionAccountAdmin(admin.ModelAdmin):
    list_display = ("id", "account_name", "account_email")
    search_fields = ("id", "account_name")


# =========================
# Recovery Custom Form
# =========================
class RecoveryAdminForm(forms.ModelForm):
    class Meta:
        model = Recovery
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        payment_mode = cleaned_data.get("payment_mode")
        transaction_reference = cleaned_data.get("transaction_reference")
        cheque_number = cleaned_data.get("cheque_number")

        if payment_mode in ["upi", "neft", "rtgs"] and not transaction_reference:
            self.add_error(
                "transaction_reference",
                f"{payment_mode.upper()} reference number is required."
            )

        if payment_mode == "cheque" and not cheque_number:
            self.add_error(
                "cheque_number",
                "Cheque number is required."
            )

        return cleaned_data


# =========================
# Recovery Admin
# =========================
@admin.register(Recovery)
class RecoveryAdmin(admin.ModelAdmin):
    form = RecoveryAdminForm
    list_display = ("account", "amount_collected", "payment_mode", "collected_at")
    list_filter = ("payment_mode", "collected_at")
    search_fields = ("account__account_name",)


# =========================
# Other Models
# =========================
admin.site.register(FollowUp)
admin.site.register(CollectionProfile)
admin.site.register(RepossessionHistory)




