from django.contrib import admin
from .models import Agreement, NewAgreement, BulkAssign, DashboardStats


class AgreementAdmin(admin.ModelAdmin):
    list_display = (
        "agreement_id",
        "agreement_type",
        "client_name",
        "amount",
        "priority",
        "assigned_to",
        "status",
        "submitted_date",
    )


class NewAgreementAdmin(admin.ModelAdmin):

    # hide agreement_id and status
    exclude = ("agreement_id", "status")

    list_display = (
        "agreement_type",
        "client_name",
        "amount",
        "priority",
        "assigned_to",
        "submitted_date",
    )


# BULK ASSIGN
class BulkAssignAdmin(admin.ModelAdmin):

    fields = ("assigned_to", "agreements")
    filter_horizontal = ("agreements",)
    list_display = ("assigned_to",)


# DASHBOARD STATS@admin.register(DashboardStats)
class DashboardStatsAdmin(admin.ModelAdmin):

    list_display = (
        "total_agreements",
        "pending_review",
        "approved_agreements",
        "high_priority",
    )

    def total_agreements(self, obj):
        return Agreement.objects.count()

    def pending_review(self, obj):
        return Agreement.objects.filter(status="Pending").count()

    def approved_agreements(self, obj):
        return Agreement.objects.filter(status="Approved").count()

    def high_priority(self, obj):
        return Agreement.objects.filter(priority="High").count()

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

admin.site.register(Agreement, AgreementAdmin)
admin.site.register(NewAgreement, NewAgreementAdmin)
admin.site.register(BulkAssign, BulkAssignAdmin)
