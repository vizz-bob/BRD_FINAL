from django.contrib import admin
from .models import Contact, Account, Lead, Activity, Meeting

# -------------------------------
# Contact Admin
# -------------------------------
@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'mobile_number', 'email', 'assigned_to', 'created_at')
    list_filter = ('gender', 'source', 'assigned_to')
    search_fields = ('full_name', 'email', 'mobile_number')


# -------------------------------
# Account Admin
# -------------------------------
@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'company_name', 'account_type', 'industry', 'status', 'assigned_to', 'created_at')
    list_filter = ('account_type', 'industry', 'status')
    search_fields = ('company_name', 'gst_number', 'pan_number')


# # -------------------------------
# # Lead Admin
# # -------------------------------
# @admin.register(Lead)
# class LeadAdmin(admin.ModelAdmin):
#     list_display = ('id', 'name')
#     search_fields = ('name',)


# -------------------------------
# Activity (Task/Meeting) Admin
# -------------------------------
@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'task_title', 'activity_type', 'priority', 'due_datetime', 'assigned_to')
    list_filter = ('activity_type', 'task_type', 'priority', 'assigned_to')
    search_fields = ('task_title', 'lead__name', 'notes')


# -------------------------------
# Meeting Admin
# -------------------------------
@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'lead', 'meeting_type', 'meeting_mode', 'datetime', 'duration', 'assigned_to', 'priority')
    list_filter = ('meeting_type', 'meeting_mode', 'priority', 'assigned_to')
    search_fields = ('title', 'lead__name', 'agenda')
