from django.contrib import admin
from .models import Incentive, CommissionStatement


@admin.register(Incentive)
class IncentiveAdmin(admin.ModelAdmin):
    list_display = ['team_member', 'month', 'amount', 'disbursed_leads', 'created_at']
    list_filter = ['month']
    search_fields = ['team_member__first_name', 'team_member__last_name']
    date_hierarchy = 'month'


@admin.register(CommissionStatement)
class CommissionStatementAdmin(admin.ModelAdmin):
    list_display = ("user", "month", "year", "total_amount", "status", "generated_at")
    list_filter = ("status", "year", "month")
    search_fields = ("user__username",)
    readonly_fields = ("generated_at",)