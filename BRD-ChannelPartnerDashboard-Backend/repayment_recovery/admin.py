#-----------------------------
# add record
#-----------------------------
from django.contrib import admin
from .models import RecoveryRecord


@admin.register(RecoveryRecord)
class RecoveryRecordAdmin(admin.ModelAdmin):
    list_display = (
        "agent_name",
        "agent_id",
        "agent_type",
        "total_amount_owed",
        "already_recovered",
        "emi_amount",
        "status",
        "start_date",
        "due_date",
    )

    list_filter = ("agent_type", "status", "deduction_day")
    search_fields = ("agent_name", "agent_id")
#--------------------
# Dashboard
#----------------------
from django.contrib import admin
from .models import Dashboard


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = (
        "total_owed",
        "recovered",
        "pending",
        "overall_recovery",
        "created_at",
    )
    search_fields = ("total_owed",)
    list_filter = ("created_at",)
#---------------------------
# search
#---------------------------
from django.contrib import admin
from .models import Recovery_Search
@admin.register(Recovery_Search)
class RecoverySearchAdmin(admin.ModelAdmin):
    list_display = ("search", "type", "created_at")
    list_filter = ("type", "created_at")
    search_fields = ("search",)
#----------------------------------
# Recovery payment main edit
#-----------------------------------
from django.contrib import admin
from .models import EditRecovery


@admin.register(EditRecovery)
class EditRecoveryAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "agent_id",
        "total_owed",
        "recovered",
        "emi_amount",
        "deduction_day",
        "status",
        "start_date",
        "due_date",
        "cancel",
        "save_changes",
    )

    list_filter = ("status", "deduction_day", "reason")
    search_fields = ("name", "agent_id")

    # 👇 Normal text show karega
    def cancel(self, obj):
        return "Cancel"

    cancel.short_description = "Cancel"

    def save_changes(self, obj):
        return "Save"

    save_changes.short_description = "Save"