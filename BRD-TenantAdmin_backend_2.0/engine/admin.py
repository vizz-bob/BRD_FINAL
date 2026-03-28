# from django.contrib import admin
# from .models import (
#     AccessRule,
#     WorkflowRule,
#     ValidationRule,
#     AssignmentRule,
#     SecurityRule,
# )
# # rules/admin.py
# from django.contrib import admin
# from .models import TenantRuleConfig

# @admin.register(TenantRuleConfig)
# class TenantRuleConfigAdmin(admin.ModelAdmin):
#     list_display = ("tenant", "updated_at")
#     search_fields = ("tenant__name", "tenant__id")
#     readonly_fields = ("created_at", "updated_at")

#     fieldsets = (
#         ("Tenant", {
#             "fields": ("tenant",),
#         }),
#         ("Rules Configuration (JSON)", {
#             "fields": ("config",),
#         }),
#         ("Timestamps", {
#             "fields": ("created_at", "updated_at"),
#         }),
#     )


# class BaseRuleAdmin(admin.ModelAdmin):
#     list_display = (
#         "id",
#         "can_view",
#         "can_add",
#         "can_edit",
#         "can_delete",
#         "created_at",
#     )
#     list_filter = (
#         "can_view",
#         "can_add",
#         "can_edit",
#         "can_delete",
#     )
#     readonly_fields = ("created_at",)


# @admin.register(AccessRule)
# class AccessRuleAdmin(BaseRuleAdmin):
#     pass


# @admin.register(WorkflowRule)
# class WorkflowRuleAdmin(BaseRuleAdmin):
#     pass


# @admin.register(ValidationRule)
# class ValidationRuleAdmin(BaseRuleAdmin):
#     pass


# @admin.register(AssignmentRule)
# class AssignmentRuleAdmin(BaseRuleAdmin):
#     pass


# @admin.register(SecurityRule)
# class SecurityRuleAdmin(BaseRuleAdmin):
#     pass


from django.contrib import admin
from .models import TenantRule


@admin.register(TenantRule)
class TenantRuleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "tenant",
        "updated_at",
        "created_at",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    search_fields = (
        "tenant__id",
        "tenant__name",
    )

    ordering = ("-updated_at",)

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        ("Tenant Info", {
            "fields": ("tenant",)
        }),
        ("Rules Configuration (JSON)", {
            "fields": ("config",),
            "description": "Complete rules engine configuration stored as JSON."
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )

    def has_add_permission(self, request):
        """
        Prevent creating multiple rules manually.
        Rules should be created via API or auto-create logic.
        """
        return True

    def has_delete_permission(self, request, obj=None):
        """
        Usually you don't want rules deleted accidentally.
        Disable delete to be safe.
        """
        return False
