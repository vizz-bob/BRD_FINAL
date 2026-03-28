#---------------------------------
# update agent basic info
#--------------------------------
from django.contrib import admin
from .models import UpdateAgent,AgentKYC,Address

@admin.register(UpdateAgent)
class UpdateAgentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone_number', 'email_address', 'agent_type', 'status', 'created_at')
    list_filter = ('agent_type', 'status')
    search_fields = ('full_name', 'email_address', 'phone_number')
#------------------------------
# Identity Documents
#-------------------------------
@admin.register(AgentKYC)
class AgentKYCAdmin(admin.ModelAdmin):
    list_display = (
        'agent',
        'pan_number',
        'aadhaar_number',
        'bank_name',
        'ifsc_code',
        'account_number',
        'created_at'
    )
    search_fields = ('pan_number', 'aadhaar_number', 'bank_name')
#---------------------------
# Address
#----------------------------
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('agent', 'street_address', 'city', 'state', 'pincode')
    search_fields = ('city', 'state', 'pincode')
#--------------------------
# Setting
#---------------------------
from .models import Setting

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = (
        'tenant',
        'email_notifications',
        'sms_notifications',
        'auto_payout',
        'performance_report_access',
        'action',
        'created_at'
    )
    list_filter = ('tenant',
                   'action',)