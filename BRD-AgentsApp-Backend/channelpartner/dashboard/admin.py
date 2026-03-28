# from django.contrib import admin

# # Dashboard app doesn't have models to register
# # This app only provides API views for statistics

# # If you want to add custom admin actions or views in the future,
# # you can extend the admin site here.

# # Example: Custom admin site configuration
# admin.site.site_header = "Lead Channel Partner Admin"
# admin.site.site_title = "LCP Admin Portal"
# admin.site.index_title = "Welcome to Lead Channel Partner Management System"
from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from .models import DashboardLead, DashboardPayout


class DashboardAdmin(admin.ModelAdmin):
    # change_list_template = "admin/dashboard.html"
    pass

    # def get_urls(self):
    #     urls = super().get_urls()
    #     custom_urls = [
    #         path('dashboard/', self.admin_site.admin_view(self.dashboard_view))
    #     ]
    #     return custom_urls + urls

    # def dashboard_view(self, request):
    #     total_leads = Lead.objects.count()
    #     total_payout = Payout.objects.count()

    #     context = dict(
    #         self.admin_site.each_context(request),
    #         total_leads=total_leads,
    #         total_payout=total_payout,
    #     )

    #     return TemplateResponse(request, "admin/dashboard.html", context)


admin.site.register(DashboardLead, DashboardAdmin)
