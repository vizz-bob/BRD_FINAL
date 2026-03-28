from django.contrib import admin
from .models import (
    LoanApplication,
    CreditAssessment,
    PropertyDetail,
    MortgageUnderwriting,
)


# ============================================================
# PROPERTY DETAIL INLINE
# ============================================================
class PropertyDetailInline(admin.StackedInline):
    model = PropertyDetail
    extra = 0
    can_delete = False


# ============================================================
# CREDIT ASSESSMENT INLINE
# ============================================================
class CreditAssessmentInline(admin.StackedInline):
    model = CreditAssessment
    extra = 0
    can_delete = False
    readonly_fields = ("status", "created_at", "updated_at")


# ============================================================
# MORTGAGE UNDERWRITING INLINE
# ============================================================
class MortgageUnderwritingInline(admin.StackedInline):
    model = MortgageUnderwriting
    extra = 0
    can_delete = False
    readonly_fields = (
        "property_market_value",
        "ltv_on_property",
        "final_eligible_amount",
        "approved_at",
    )


# ============================================================
# LOAN APPLICATION ADMIN
# ============================================================
@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):

    list_display = (
        "application_number",
        "full_name",
        "mobile_no",
        "requested_amount",
        "income_type",
        "created_at",
    )

    list_display_links = ("application_number",)

    list_filter = (
        "income_type",
        "employment_type",
        "created_at",
    )

    search_fields = (
        "application_number",
        "first_name",
        "last_name",
        "mobile_no",
        "pan",
    )

    readonly_fields = (
        "application_id",
        "application_number",
        "created_at",
    )

    inlines = [
        CreditAssessmentInline,
        PropertyDetailInline,
        MortgageUnderwritingInline,
    ]

    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = "Applicant Name"

    def save_model(self, request, obj, form, change):
        if not change and not obj.created_by:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


# ============================================================
# CREDIT ASSESSMENT ADMIN
# ============================================================
@admin.register(CreditAssessment)
class CreditAssessmentAdmin(admin.ModelAdmin):

    list_display = ("application", "status", "created_at", "updated_at")

    list_filter = ("status",)

    search_fields = (
        "application__application_number",
        "application__first_name",
        "application__last_name",
    )

    readonly_fields = ("status", "created_at", "updated_at")


# ============================================================
# PROPERTY DETAIL ADMIN
# ============================================================
@admin.register(PropertyDetail)
class PropertyDetailAdmin(admin.ModelAdmin):

    list_display = (
        "loan_application",
        "property_type",
        "city",
        "state",
        "created_at",
    )

    search_fields = (
        "loan_application__application_number",
        "city",
    )

    autocomplete_fields = ("loan_application",)


# ============================================================
# MORTGAGE UNDERWRITING ADMIN
# ============================================================
@admin.register(MortgageUnderwriting)
class MortgageUnderwritingAdmin(admin.ModelAdmin):

    list_display = (
        "loan_application",
        "property_market_value",
        "ltv_on_property",
        "final_eligible_amount",
        "approved_at",
    )

    search_fields = (
        "loan_application__application_number",
        "loan_application__first_name",
    )

    readonly_fields = (
        "property_market_value",
        "ltv_on_property",
        "final_eligible_amount",
        "approved_at",
    )