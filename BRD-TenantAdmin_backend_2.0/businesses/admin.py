from django.contrib import admin
from .models import Business


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):

    # -------------------- LIST VIEW --------------------
    list_display = (
        "business_name",
        "pan_number",
        "gstin",
        "status",
        "created_at",
    )

    list_display_links = ("business_name",)
    ordering = ("-created_at",)

    # -------------------- SEARCH & FILTER --------------------
    search_fields = (
        "business_name",
        "pan_number",
        "gstin",
    )

    list_filter = (
        "status",
        "created_at",
    )

    date_hierarchy = "created_at"

    # -------------------- READ ONLY --------------------
    readonly_fields = (
        "created_at",
    )

    # -------------------- MANY TO MANY UX --------------------
    filter_horizontal = ("mapped_products",)

    # -------------------- FORM LAYOUT --------------------
    fieldsets = (
        ("Business Details", {
            "fields": (
                "business_name",
                "pan_number",
                "cin",
                "gstin",
                "registered_address",
                "status",
            )
        }),
        ("Mapped Loan Products", {
            "fields": (
                "mapped_products",
            )
        }),
        ("System Information", {
            "fields": (
                "created_at",
            )
        }),
    )
