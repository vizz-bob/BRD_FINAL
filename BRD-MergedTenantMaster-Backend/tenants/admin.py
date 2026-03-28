from django.contrib import admin
from django import forms
import json

from .models import (
    Tenant,
    Branch,
    FinancialYear,
    ReportingPeriod,
    Holiday,
    TenantRuleConfig,
    Category
)



# Tenant
@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant_type', 'email', 'is_active', 'created_at')
    search_fields = ('name', 'email')
    readonly_fields = ('created_at', 'tenant_id', 'slug')

# Branch
@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'branch_code', 'tenant', 'phone', 'is_active', 'created_at')
    search_fields = ('name', 'branch_code', 'tenant__name')
    readonly_fields = ('created_at',)

# Calendar
@admin.register(FinancialYear)
class FinancialYearAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'start', 'end', 'is_active')
    list_filter = ('tenant', 'is_active')
    search_fields = ('name', 'tenant__name')

@admin.register(ReportingPeriod)
class ReportingPeriodAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'start', 'end')
    list_filter = ('tenant',)
    search_fields = ('name', 'tenant__name')

@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ('title', 'tenant', 'date')
    list_filter = ('tenant', 'date')
    search_fields = ('title', 'tenant__name')

# Category
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category_key', 'display_tenant', 'is_active', 'created_at', 'updated_at')
    list_filter = ('category_key', 'tenant', 'is_active')
    search_fields = ('title', 'tenant__name')
    readonly_fields = ('created_at', 'updated_at')

    def display_tenant(self, obj):
        return obj.tenant.name if obj.tenant else "Global"
    display_tenant.short_description = "Tenant"

# ============================================================
#   🔹 CUSTOM FORM FOR STRUCTURED RULE UI
# ============================================================

class TenantRuleConfigForm(forms.ModelForm):

    class Meta:
        model = TenantRuleConfig
        fields = "__all__"

    # --------------------------------------------------------
    #  Access → Permissions UI
    # --------------------------------------------------------
    leads_view = forms.BooleanField(required=False, label="Leads → View")
    leads_add = forms.BooleanField(required=False, label="Leads → Add")
    leads_edit = forms.BooleanField(required=False, label="Leads → Edit")
    leads_delete = forms.BooleanField(required=False, label="Leads → Delete")

    # --------------------------------------------------------
    #  Access → Module Access
    # --------------------------------------------------------
    module_crm = forms.BooleanField(required=False, label="Module → CRM")
    module_loan = forms.BooleanField(required=False, label="Module → Loan")
    module_collection = forms.BooleanField(required=False, label="Module → Collection")

    # --------------------------------------------------------
    # Workflow
    # --------------------------------------------------------
    workflow_approval_levels = forms.CharField(
        required=False,
        label="Approval Levels (comma separated)"
    )
    workflow_approver_roles = forms.CharField(
        required=False,
        label="Approver Roles (comma separated)"
    )
    workflow_rejector_roles = forms.CharField(
        required=False,
        label="Rejector Roles (comma separated)"
    )
    workflow_auto_validation = forms.BooleanField(
        required=False,
        label="Auto Document Validation"
    )
    workflow_upload_limit = forms.IntegerField(
        required=False,
        label="Document Upload Limit (MB)"
    )

    # --------------------------------------------------------
    # Validation
    # --------------------------------------------------------
    val_unique_email = forms.BooleanField(required=False, label="Unique Email")
    val_pan_format = forms.BooleanField(required=False, label="Validate PAN Format")
    val_aadhaar_format = forms.BooleanField(required=False, label="Validate Aadhaar Format")
    val_phone_10 = forms.BooleanField(required=False, label="Phone 10 Digits")

    # --------------------------------------------------------
    # Assignment
    # --------------------------------------------------------
    assign_lead_category = forms.BooleanField(required=False, label="Lead Assign by Category")
    assign_auto_sales = forms.BooleanField(required=False, label="Auto-Assign → Sales")
    assign_auto_verification = forms.BooleanField(required=False, label="Auto-Assign → Verification")
    assign_auto_credit = forms.BooleanField(required=False, label="Auto-Assign → Credit")

    # --------------------------------------------------------
    # Security
    # --------------------------------------------------------
    sec_password_min = forms.IntegerField(required=False, label="Password Min Length")
    sec_password_special = forms.BooleanField(required=False, label="Special Character Required")
    sec_timeout = forms.IntegerField(required=False, label="Session Timeout (minutes)")

    # Load initial values
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        cfg = self.instance.config or {}

        # Access → Leads
        leads = cfg.get("access", {}).get("permissions", {}).get("leads", {})
        self.fields["leads_view"].initial = leads.get("view", False)
        self.fields["leads_add"].initial = leads.get("add", False)
        self.fields["leads_edit"].initial = leads.get("edit", False)
        self.fields["leads_delete"].initial = leads.get("delete", False)

        # Modules
        mods = cfg.get("access", {}).get("module_access", {})
        self.fields["module_crm"].initial = mods.get("crm", False)
        self.fields["module_loan"].initial = mods.get("loan", False)
        self.fields["module_collection"].initial = mods.get("collection", False)

        # Workflow
        wf = cfg.get("workflow", {})
        self.fields["workflow_approval_levels"].initial = ", ".join(wf.get("approval_levels", []))
        self.fields["workflow_approver_roles"].initial = ", ".join(wf.get("approver_roles", []))
        self.fields["workflow_rejector_roles"].initial = ", ".join(wf.get("rejector_roles", []))
        self.fields["workflow_auto_validation"].initial = wf.get("document_verification", {}).get("auto_validation", False)
        self.fields["workflow_upload_limit"].initial = wf.get("document_verification", {}).get("upload_limit_mb", 10)

        # Validation
        val = cfg.get("validation", {})
        self.fields["val_unique_email"].initial = val.get("unique_email", True)
        self.fields["val_pan_format"].initial = val.get("pan_format", False)
        self.fields["val_aadhaar_format"].initial = val.get("aadhaar_format", False)
        self.fields["val_phone_10"].initial = val.get("phone_10_digits", False)

        # Assignment
        assign = cfg.get("assignment", {})
        self.fields["assign_lead_category"].initial = assign.get("lead_by_category", False)
        self.fields["assign_auto_sales"].initial = assign.get("auto_assign", {}).get("sales", True)
        self.fields["assign_auto_verification"].initial = assign.get("auto_assign", {}).get("verification", True)
        self.fields["assign_auto_credit"].initial = assign.get("auto_assign", {}).get("credit", True)

        # Security
        sec = cfg.get("security", {})
        self.fields["sec_password_min"].initial = sec.get("password_min_length", 8)
        self.fields["sec_password_special"].initial = sec.get("password_special_required", True)
        self.fields["sec_timeout"].initial = sec.get("session_timeout_minutes", 30)

    # Save JSON structure back
    def clean(self):
        cleaned = super().clean()

        config = {
            "access": {
                "permissions": {
                    "leads": {
                        "view": cleaned["leads_view"],
                        "add": cleaned["leads_add"],
                        "edit": cleaned["leads_edit"],
                        "delete": cleaned["leads_delete"],
                    }
                },
                "module_access": {
                    "crm": cleaned["module_crm"],
                    "loan": cleaned["module_loan"],
                    "collection": cleaned["module_collection"],
                }
            },

            "workflow": {
                "approval_levels": [x.strip() for x in cleaned["workflow_approval_levels"].split(",") if x.strip()],
                "approver_roles": [x.strip() for x in cleaned["workflow_approver_roles"].split(",") if x.strip()],
                "rejector_roles": [x.strip() for x in cleaned["workflow_rejector_roles"].split(",") if x.strip()],
                "document_verification": {
                    "auto_validation": cleaned["workflow_auto_validation"],
                    "upload_limit_mb": cleaned["workflow_upload_limit"] or 10
                }
            },

            "validation": {
                "unique_email": cleaned["val_unique_email"],
                "pan_format": cleaned["val_pan_format"],
                "aadhaar_format": cleaned["val_aadhaar_format"],
                "phone_10_digits": cleaned["val_phone_10"]
            },

            "assignment": {
                "lead_by_category": cleaned["assign_lead_category"],
                "auto_assign": {
                    "sales": cleaned["assign_auto_sales"],
                    "verification": cleaned["assign_auto_verification"],
                    "credit": cleaned["assign_auto_credit"]
                }
            },

            "security": {
                "password_min_length": cleaned["sec_password_min"] or 8,
                "password_special_required": cleaned["sec_password_special"],
                "session_timeout_minutes": cleaned["sec_timeout"] or 30,
            }
        }

        self.instance.config = config
        return cleaned


# ============================================================
#   🔹 ADMIN UI
# ============================================================

@admin.register(TenantRuleConfig)
class TenantRuleConfigAdmin(admin.ModelAdmin):
    form = TenantRuleConfigForm
    list_display = ("tenant", "id")
    search_fields = ("tenant__name",)
    list_filter = ("tenant",)

    readonly_fields = ("generated_json",)

    fieldsets = (
        ("Tenant", {"fields": ("tenant",)}),

        ("Access → Leads Permissions", {
            "classes": ("collapse",),
            "fields": ("leads_view", "leads_add", "leads_edit", "leads_delete"),
        }),

        ("Access → Module Access", {
            "classes": ("collapse",),
            "fields": ("module_crm", "module_loan", "module_collection"),
        }),

        ("Workflow Configuration", {
            "classes": ("collapse",),
            "fields": (
                "workflow_approval_levels",
                "workflow_approver_roles",
                "workflow_rejector_roles",
                "workflow_auto_validation",
                "workflow_upload_limit",
            ),
        }),

        ("Validation Rules", {
            "classes": ("collapse",),
            "fields": ("val_unique_email", "val_pan_format", "val_aadhaar_format", "val_phone_10"),
        }),

        ("Assignment Rules", {
            "classes": ("collapse",),
            "fields": ("assign_lead_category", "assign_auto_sales", "assign_auto_verification", "assign_auto_credit"),
        }),

        ("Security Rules", {
            "classes": ("collapse",),
            "fields": ("sec_password_min", "sec_password_special", "sec_timeout"),
        }),

        ("Generated JSON (Readonly)", {
            "classes": ("collapse",),
            "fields": ("generated_json",),
        }),
    )

    def generated_json(self, obj):
        return json.dumps(obj.config, indent=2)

    generated_json.short_description = "Generated JSON"
