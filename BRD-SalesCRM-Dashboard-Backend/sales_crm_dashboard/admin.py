from django.contrib import admin
from home.models import Notification

# Store the original index method
original_index = admin.site.index

def custom_index(self, request, extra_context=None):
    # This function will run when you visit the Admin Home
    extra_context = extra_context or {}
    try:
        # Add notifications to the home page context
        extra_context['recent_notifications'] = Notification.objects.select_related('sent_by').prefetch_related('recipients').order_by('-created_at')[:5]
    except Exception:
        extra_context['recent_notifications'] = []
    
    # Call the original index method with our new data
    return original_index(request, extra_context)

# Replace the default index with our custom one
admin.site.index = custom_index.__get__(admin.site, admin.sites.AdminSite)
admin.site.site_header = 'Sales CRM Backend'
admin.site.site_title = 'Sales CRM Admin'
admin.site.index_title = 'Management Dashboard'
