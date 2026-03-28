from django.contrib import admin
from .models import (
    RuleMaster, ImpactValue,
    ClientProfileRule,
    FinancialEligibilityRule,
    CollateralQualityRule,
    CreditHistoryRule,
    InternalScoreRule,
    GeoLocationRule,
    RiskMitigationRule,
    InternalVerificationRule,
    AgencyVerificationRule,
    TenantRuleConfig,
)

# Debug: Print to verify admin registration
print("Registering rulemanagement admin models...")


@admin.register(RuleMaster)
class RuleMasterAdmin(admin.ModelAdmin):
    list_display = ("rule_name", "rule_code", "rule_type", "product", "segment", "status", "created_at")
    list_filter = ("rule_code", "rule_type", "product", "segment", "status")
    search_fields = ("rule_name",)


@admin.register(ImpactValue)
class ImpactValueAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("label", "value")


@admin.register(ClientProfileRule)
class ClientProfileRuleAdmin(admin.ModelAdmin):
    list_display = ("rule_name", "parameter", "condition", "value", "impact_value", "status")
    list_filter = ("status", "parameter")
    search_fields = ("rule_name",)


@admin.register(FinancialEligibilityRule)
class FinancialEligibilityRuleAdmin(admin.ModelAdmin):
    list_display = ("income_type", "min_monthly_income", "min_business_income", "min_annual_turnover", "max_emi_ratio", "itr_required", "status")
    list_filter = ("status", "income_type", "itr_required", "cash_flow_check", "compliance_check")


@admin.register(CollateralQualityRule)
class CollateralQualityRuleAdmin(admin.ModelAdmin):
    list_display = ("collateral_type", "ownership", "allowed_ltv", "risk_level", "status")
    list_filter = ("status", "collateral_type", "risk_level")


@admin.register(CreditHistoryRule)
class CreditHistoryRuleAdmin(admin.ModelAdmin):
    list_display = ("credit_bureau", "min_credit_score", "max_dpd_days", "max_enquiries", "risk_level", "status")
    list_filter = ("status", "credit_bureau", "risk_level")


@admin.register(InternalScoreRule)
class InternalScoreRuleAdmin(admin.ModelAdmin):
    list_display = ("parameter", "min_value", "weight", "risk_level", "status")
    list_filter = ("status", "risk_level")


@admin.register(GeoLocationRule)
class GeoLocationRuleAdmin(admin.ModelAdmin):
    list_display = ("state", "city", "pincode", "risk_level", "weight", "status")
    list_filter = ("status", "risk_level", "state")
    search_fields = ("state", "city", "pincode")


@admin.register(RiskMitigationRule)
class RiskMitigationRuleAdmin(admin.ModelAdmin):
    list_display = ("risk_parameter", "severity", "status")
    list_filter = ("status", "severity")
    search_fields = ("risk_parameter",)


@admin.register(InternalVerificationRule)
class InternalVerificationRuleAdmin(admin.ModelAdmin):
    list_display = ("verification_type", "turnaround_days", "flag_mismatch", "flag_duplicate_pan", "status", "created_at")
    list_filter = ("status", "flag_mismatch", "flag_duplicate_pan")
    search_fields = ("verification_type",)


@admin.register(AgencyVerificationRule)
class AgencyVerificationRuleAdmin(admin.ModelAdmin):
    list_display = ("agency_type", "verification_stage", "report_type", "turnaround_time", "status")
    list_filter = ("status",)
    search_fields = ("agency_type",)


@admin.register(TenantRuleConfig)
class TenantRuleConfigAdmin(admin.ModelAdmin):
    list_display = ("id", "get_tenant_name", "created_at", "updated_at")
    search_fields = ("tenant__name",)

    def get_tenant_name(self, obj):
        return obj.tenant.name if obj.tenant else "Global Config"
    get_tenant_name.short_description = "Tenant"

print("TenantRuleConfig admin registered successfully!")
