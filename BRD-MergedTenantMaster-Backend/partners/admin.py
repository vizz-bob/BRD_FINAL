from django.contrib import admin
from .models import ThirdPartyUser


@admin.register(ThirdPartyUser)
class ThirdPartyUserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "organization_name",
        "third_party_type",
        "mobile_no",
        "is_active",
        "verification_verified",
    )

    list_filter = ("third_party_type", "is_active", "verification_verified")
    search_fields = ("organization_name", "mobile_no")


    ordering = ("-created_at",)

    readonly_fields = (
        "id",
        "created_at",
    )

    fieldsets = (
        ("User Account", {
            "fields": ("user",)
        }),
        ("Identity & Role", {
            "fields": (
                "first_name",
                "last_name",
                "organization_name",
                "third_party_type",
                "pan_number",
            )
        }),
        ("Contact Details", {
            "fields": (
                "mobile_no",
            )
        }),
        ("Location", {
            "fields": (
                "address_line1",
                "address_line2",
                "country",
                "state",
                "city",
                "pincode",
            )
        }),
        ("Status", {
            "fields": (
                "is_active",
                "verification_verified",
            )
        }),
        ("System Info", {
            "fields": (
                "id",
                "created_at",
            )
        }),
    )

    @admin.display(description="Email")
    def get_email(self, obj):
        return obj.user.email
