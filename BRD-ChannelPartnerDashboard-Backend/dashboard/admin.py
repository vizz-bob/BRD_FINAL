#------------------------
# Dashboard
#------------------------
from django.contrib import admin
from .models import Dashboard

@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = (
        'total_agents',
        'Active_Agents',
        'Total_payouts',
        'lead_generated',
        'payouts_this_month',
        'pending_approvals',
        'offers_active',
        'Avg_Conversion_Rate',
        'date',
        'created_at'
    )
#------------------------
# Recent agents
#------------------------
from django.contrib import admin
from .models import RecentAgent

@admin.register(RecentAgent)
class RecentAgentAdmin(admin.ModelAdmin):
    list_display = ('agent_id', 'name', 'agent_type', 'payout', 'status', 'created_at')
    list_filter = ('status', 'agent_type')
    search_fields = ('agent_id', 'name')