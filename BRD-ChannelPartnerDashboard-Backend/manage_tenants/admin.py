#------------------------
# Dashboard
#------------------------
from django.contrib import admin
from .models import Dashboard
@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = (
        "total_tenants",
        "active",
        "enterprises",
        "total_agents",
        "created_at",
    )
    readonly_fields = ("created_at",)
#------------------------
# Add Tenant
#------------------------
from django.contrib import admin
from .models import NewTenant


@admin.register(NewTenant)
class NewTenantAdmin(admin.ModelAdmin):
    list_display = (
        "organisation_name",
        "city",
        "region",
        "plan",
        "status",
        "add_tenant",
        "cancel",
    )

    list_filter = ("region", "plan", "status")

    search_fields = ("organisation_name", "contact_name", "email")
#----------------------------
# Show Tenant
#----------------------------
from django.contrib import admin
from .models import ShowTenant


@admin.register(ShowTenant)
class ShowTenantAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "plan",
        "region",
        "status",
        "agents",
        "volume",
        "edit_tenant",
        "delete",
        "deactivate",
        "joined",
    )

    list_filter = ("plan", "region", "status")
    search_fields = ("name", "contact_name", "email")
    list_editable = ("status", "edit_tenant", "deactivate")
    date_hierarchy = "joined" 
  