from django.contrib import admin
from .models import Mandate


@admin.register(Mandate)
class MandateAdmin(admin.ModelAdmin):

    list_display = (
        "application_id",
        "bank_name",
        "penny_drop_status",
        "enach_status",
        "action",
    )

    list_select_related = ("loan_application",)

    @admin.display(description="Application ID")
    def application_id(self, obj):
        return getattr(obj.loan_application, "id", None)
