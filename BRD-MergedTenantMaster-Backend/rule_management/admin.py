from django.contrib import admin
from .models import (
    RuleIdentification,
    ClientProfileRule,
    FinancialEligibilityRule,
    CollateralQualityRule,
    AutomatedScorecard,
    AgencyVerificationRule
)


# ---------------- RULE IDENTIFICATION ----------------
@admin.register(RuleIdentification)
class RuleIdentificationAdmin(admin.ModelAdmin):
    list_display = ("rule_name", "rule_type", "applicable_product", "borrower_segment", "created_at")
    list_filter = ("rule_type", "applicable_product", "borrower_segment")
    search_fields = ("rule_name", "impact")
    ordering = ("-created_at",)


# ---------------- CLIENT PROFILE RULE ----------------
@admin.register(ClientProfileRule)
class ClientProfileRuleAdmin(admin.ModelAdmin):
    list_display = ("pincode", "applicant_min_age", "applicant_max_age", "address_criteria")
    search_fields = ("pincode",)
    list_filter = ("address_criteria",)


# ---------------- FINANCIAL ELIGIBILITY ----------------
@admin.register(FinancialEligibilityRule)
class FinancialEligibilityRuleAdmin(admin.ModelAdmin):
    list_display = (
        "min_monthly_income",
        "max_emi_ratio",
        "foir_limit",
        "itr_required",
        "financial_compliance_check"
    )
    list_filter = ("itr_required", "cash_flow_eligibility_check", "financial_compliance_check")


# ---------------- COLLATERAL QUALITY ----------------
@admin.register(CollateralQualityRule)
class CollateralQualityRuleAdmin(admin.ModelAdmin):
    list_display = (
        "risk_type",
        "collateral_relevance",
        "ownership_verification",
        "max_ltv_ratio"
    )
    list_filter = ("risk_type", "collateral_relevance", "ownership_verification")


# ---------------- CREDIT SCORECARD ----------------
@admin.register(AutomatedScorecard)
class AutomatedScorecardAdmin(admin.ModelAdmin):
    list_display = ("bureau", "min_credit_score", "max_dpd_days", "max_enquiries")
    list_filter = ("bureau",)
    search_fields = ("bureau",)


# ---------------- AGENCY VERIFICATION ----------------
@admin.register(AgencyVerificationRule)
class AgencyVerificationRuleAdmin(admin.ModelAdmin):
    list_display = (
        "agency_name",
        "verification_type",
        "verification_level",
        "mandatory_for_all_applications",
        "enable_agency_verification"
    )
    list_filter = (
        "verification_type",
        "verification_level",
        "mandatory_for_all_applications"
    )
    search_fields = ("agency_name",)