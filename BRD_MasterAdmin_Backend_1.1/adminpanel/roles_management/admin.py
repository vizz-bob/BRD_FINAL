from django.contrib import admin
from django.contrib.auth.models import Group

# Safe unregister (prevents crash if already unregistered)
try:
    admin.site.unregister(Group)
except admin.sites.NotRegistered:
    pass

@admin.register(Group)
class RoleAdmin(admin.ModelAdmin):
    verbose_name = "Role"
    verbose_name_plural = "Roles"
    filter_horizontal = ("permissions",)
##
