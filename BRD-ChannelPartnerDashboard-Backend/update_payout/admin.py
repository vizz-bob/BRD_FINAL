#---------------------------
# Payout Dashbaord
#---------------------------
from django.contrib import admin
from .models import Payout_Dashboard

@admin.register(Payout_Dashboard)
class PayoutDashboardAdmin(admin.ModelAdmin):
    list_display = (
        "active_payouts",
        "Avg_rate",
        "max_pool",
        "payout_modes",
        "date",
        "created_at",
    )
    list_filter = ("date",)
    search_fields = ("date",)
#-----------------------
# Search
#-----------------------
from django.contrib import admin
from .models import Payout_Search
@admin.register(Payout_Search)
class PayoutSearchAdmin(admin.ModelAdmin):
    list_display = ("search", "type", "created_at")
    list_filter = ("type",)  
    search_fields = ("search",)
#------------------------------
# payout updated
#-----------------------------
from django.contrib import admin
from .models import Payout_Agent

@admin.register(Payout_Agent)
class PayoutAgentAdmin(admin.ModelAdmin):

    list_display = (
        "agent",
        "type",
        "flat_fee",
        "percentage_rate",
        "min_amount",
        "max_amount",
        "cycle_day",
        "mode",
        "bonus",
        "status",
        "action_edit",
    )

    list_filter = ("type", "status","mode",)
    search_fields = ("agent",)