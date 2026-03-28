from django.contrib import admin
from .models import  ValidationEngineConfiguration
from django.contrib import admin
from django.contrib import admin
from .models import SuppressionList, DataIngestionDashboard
from django.contrib import admin
from .models import RawLeadPool as RawLead

@admin.register(RawLead)
class RawLeadAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'phone_number',
        'email',
        'source',
        'validation_status',
        'ingested_at',
        'assigned_to',
        'created_at',
    )
    list_filter = ('source', 'validation_status', 'assigned_to')
    search_fields = ('name', 'phone_number', 'email')
    
    # Calendar picker for ingested_at
    date_hierarchy = 'ingested_at'


# ---------- ValidationEngineConfiguration Admin ----------
@admin.register(ValidationEngineConfiguration)
class ValidationEngineConfigurationAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'created_at')

#-------------------------------------
# data ingestion dashborad
#---------------------------------
from django.contrib import admin
from .models import DataIngestionDashboard

@admin.register(DataIngestionDashboard)
class DataIngestionDashboardAdmin(admin.ModelAdmin):
    list_display = (
        'total_raw_pool',
        'validation_pass',
        'pending_assignment',
        'suppressed_leads',
    )
#------------------------------
#Suppression list
#-----------------------------
from django.contrib import admin
from .models import SuppressionList

@admin.register(SuppressionList)
class SuppressionListAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'contact',
        'email',
        'suppression_reason',
        'blocked_date',
        'action_delete',
    )
    list_filter = ('suppression_reason', 'blocked_date', 'action_delete')
    search_fields = ('name', 'contact', 'email')
    list_editable = ('action_delete',)

