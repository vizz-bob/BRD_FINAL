from django.contrib import admin






import adminpanel.access_control.admin
 

# ================= APPROVAL MASTER =================
#from adminpanel.approval_master.models import ApprovalMaster, ApprovalAssignment, EscalationMaster



# ================= ELIGIBILITY & SCORE MANAGEMENT =================
from adminpanel.eligibility_score_management.models import (
    EligibilityManagement,
    BankingManagement,
    ExistingObligationManagement,
    ScoreCardManagement,
)


@admin.register(EligibilityManagement)
class EligibilityManagementAdmin(admin.ModelAdmin):
    list_display = (
        "applicant_type",
        "category",
        "income_type",
        "is_active",
        "created_at",
    )
    readonly_fields = ("created_at",)


@admin.register(BankingManagement)
class BankingManagementAdmin(admin.ModelAdmin):
    list_display = (
        "bank_account_type",
        "average_banking_criteria",
        "is_active",
        "created_at",
    )
    readonly_fields = ("created_at",)


@admin.register(ExistingObligationManagement)
class ExistingObligationManagementAdmin(admin.ModelAdmin):
    list_display = (
        "loan_status",
        "loan_performance",
        "total_loans",
        "is_active",
        "created_at",
    )
    readonly_fields = ("created_at",)


@admin.register(ScoreCardManagement)
class ScoreCardManagementAdmin(admin.ModelAdmin):
    list_display = (
        "impact_type",
        "risk_impact",
        "is_active",
        "created_at",
    )
    readonly_fields = ("created_at",)


# ================= RISK & MITIGATION MANAGEMENT =================
# IMPORTANT: importing admin auto-registers all 8 models
import adminpanel.risk_mitigation_management.admin

# ================= MIS & REPORTING =================
import adminpanel.mis_reporting_management.admin

# ================= system settings =================
import adminpanel.system_settings.admin 

# ================= subscription management =================
import adminpanel.subscription_management.admin

# ================= coupon management =================
import adminpanel.coupon_management.admin

# ================= bank funds management =================
import adminpanel.bank_funds_management.admin

# ================= profile management =================
import adminpanel.profile_management.admin

# ================= agent management =================
import adminpanel.agent_management.admin

# ================= rule management =================
import adminpanel.rule_management.admin

# ================= loan improvement =================
import adminpanel.loan_improvement.admin

# ================= concession management =================
import adminpanel.concession_management.admin

# ================= currency management =================
import adminpanel.currency_management.admin

# ================= provisioning classification =================
import adminpanel.provisioning_classification.admin

# ================= collection management =================
import adminpanel.collection_management.admin

# ================= disbursement management =================
import adminpanel.disbursement_management.admin

# ================= document management =================
import adminpanel.document_management.admin

# ================= organization management =================
import adminpanel.organization_management.admin

# ================= home dashboard =================
import adminpanel.home_dashboard.admin

# ================= occupation type management =================
import adminpanel.occupation_type_management.admin

# ================= employment type management =================
import adminpanel.employment_type_management.admin

# ================= users management =================
import adminpanel.users_management.admin

# ================= role management =================
import adminpanel.roles_management.admin

# ================= approval master =================
import adminpanel.approval_master.admin

# ================= fees management =================
import adminpanel.product_revenue.fees_management.admin

# ================= charges management =================
import adminpanel.product_revenue.charges_management.admin

# ================= interest management =================
import adminpanel.product_revenue.interest_management.admin

# ================= repayment management =================
import adminpanel.product_revenue.repayment_management.admin

# ================= penalty management =================
import adminpanel.product_revenue.penalties_management.admin

# ================= moratorium management =================
import adminpanel.product_revenue.moratorium_management.admin

# ================= product mix management =================
import adminpanel.product_revenue.product_mix_management.admin

# ================= product management =================
import adminpanel.product_revenue.product_management.admin

# ================= template management =================
import adminpanel.template_management.admin