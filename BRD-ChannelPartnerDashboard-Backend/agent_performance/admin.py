#--------------------------
# New Agent 
#-------------------------
from django.contrib import admin
from .models import New_agent


@admin.register(New_agent)
class NewAgentAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'agent_type',
        'status',
        'total_leads',
        'converted',
        'payout',
        'score',
        'cancel',
        'add_agent',
    )

    list_filter = ('agent_type', 'status', 'cancel', 'add_agent')
    search_fields = ('full_name',)
#----------------------------
# Dashboard
#-----------------------------
from django.contrib import admin
from .models import Dashboard


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = (
        'total_agents',
        'active_agents',
        'total_payouts',
        'lead_generated',
        'created_at',
    )

    list_filter = ('created_at',)
#---------------------------------
# all agent
#---------------------------------
from django.contrib import admin
from .models import All_Agent
@admin.register(All_Agent)
class AllAgentAdmin(admin.ModelAdmin):
    list_display = (
        'search',
        'all_agent_status',
        'agent_id',
        'name',
        'type',
        'leads',
        'converted',
        'payout',
        'score',
        'status',
    )

    list_filter = ('type', 'status')
    search_fields = ('name', 'agent_id')
#------------------------------
# Edit Agent
#------------------------------
from django.contrib import admin
from .models import Edit_Agent


@admin.register(Edit_Agent)
class EditAgentAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'agent_type',
        'status',
        'total_leads',
        'converted',
        'payout',
        'score',
        'cancel',
        'save_changes',
    )

    list_filter = ('agent_type', 'status')
    search_fields = ('full_name',)
#------------------------- 
# View agent
#-------------------------
from django.contrib import admin
from .models import View_Agent


@admin.register(View_Agent)
class ViewAgentAdmin(admin.ModelAdmin):

    list_display = (
        'agent_id',
        'name',
        'type',
        'status',
        'total_leads',
        'converted',
        'get_conversion_rate',
        'payout',
        'performance_score',
        'get_performance_remark',
        'edit_agent',
        'close',
    )

    list_filter = ('type', 'status')
    search_fields = ('name', 'agent_id')
    ordering = ('-performance_score',)

    def get_conversion_rate(self, obj):
        return obj.conversion_rate()
    get_conversion_rate.short_description = "Conv. Rate (%)"

    def get_performance_remark(self, obj):
        return obj.performance_remark()
    get_performance_remark.short_description = "Performance"
#-----------------------
# Remove Agent
#------------------------
from django.contrib import admin
from .models import Remove_Agent


@admin.register(Remove_Agent)
class RemoveAgentAdmin(admin.ModelAdmin):

    list_display = (
        'agent_name',
        'agent_id',
        'yes_remove_agent',
        'cancel',
        'removed_at',
    )

    list_filter = ('yes_remove_agent', 'removed_at')
    search_fields = ('agent_name', 'agent_id')

    readonly_fields = ('removed_at',)