from django.db import models
from multiselectfield import MultiSelectField


class Role(models.Model):
    # ---------------------------
    # Role Type & Status
    # ---------------------------
    ROLE_STATUS = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    ROLE_TYPE = (
        ("ADMIN", "Admin"),
        ("MANAGER", "Manager"),
        ("CUSTOM", "Custom Role"),
        ("SUPERVISOR", "Supervisor"),
        ("EXECUTIVE", "Executive"),
        ("STANDARD", "Standard User"),
    )

    role_type = models.CharField(max_length=20, choices=ROLE_TYPE)
    role_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    role_status = models.CharField(max_length=10, choices=ROLE_STATUS)
    created_at = models.DateTimeField(auto_now_add=True)

    # ---------------------------
    # Permissions
    # ---------------------------
    LOAN_MANAGEMENT = (
        ("CREATE_LOANS", "Create Loans"),
        ("APPROVE_LOANS", "Approve Loans"),
        ("VIEW_LOANS", "View Loans"),
        ("EDIT_APPLICATIONS", "Edit Applications"),
        ("DELETE_LOANS", "Delete Loans"),
        ("LOAN_APPLICATION", "Loan Application Processing"),
        ("LOAN_LIFECYCLE", "Loan Lifecycle"),
        ("CREDIT_ASSESSMENT", "Credit Assessment"),
        ("LOAN_CLOSURE", "Loan Closure"),
        ("SANCTION_APPROVAL", "Sanction Approval"),
    )

    DOCUMENT_MANAGEMENT = (
        ("VIEW_DOCUMENTS", "View Documents"),
        ("DOWNLOAD_DOCUMENTS", "Download Documents"),
        ("UPLOAD_DOCUMENTS", "Upload Documents"),
        ("DELETE_DOCUMENTS", "Delete Documents"),
        ("DOCUMENT_COLLECTION", "Document Collection"),
        ("DOCUMENT_VERIFICATION", "Document Verification"),
        ("KYC_DOCUMENTS", "KYC Documents"),
        ("PROPERTY", "Property / Collateral Documents"),
        ("INCOME", "Income & Financial Documents"),
    )

    SYSTEM_ADMINISTRATION = (
        ("AUDIT_LOGS", "Audit Logs"),
        ("EDIT_POLICIES", "Edit Policies"),
        ("MANAGE_USERS", "Manage Users"),
        ("MANAGE_ROLES", "Manage Roles"),
        ("MANAGE_BRANCHES", "Manage Branches"),
        ("USER_MANAGEMENT", "User Management"),
        ("ROLE_PERMISSION", "Role & Permission Management"),
        ("TENANT", "Tenant & Organization Settings"),
        ("CONFIGURATION", "Configuration Masters"),
        ("WORKFLOW_SETUP", "Workflow Setup"),
    )

    ANALYTICS_REPORTS = (
        ("VIEW_REPORTS", "View Reports"),
        ("EXPORT_DATA", "Export Data"),
        ("DASHBOARD", "Dashboard Analytics"),
        ("PERFORMANCE", "Performance Reports"),
        ("CUSTOMER", "Customer Analytics"),
        ("FINANCIAL", "Financial Reports"),
        ("OPERATIONAL", "Operational Reports"),
    )

    BRANCH_CONTROL = (
        ("VIEW_ALL", "View All Branches"),
        ("EDIT_BRANCH", "Edit Branch"),
        ("ASSIGN_USERS", "Assign Users"),
        ("BRANCH_MANAGEMENT", "Branch Management"),
        ("BRANCH_USER_MAPPING", "Branch-wise User Mapping"),
        ("BRANCH_LOAN_ACCESS", "Branch-wise Loan Access"),
        ("BRANCH_PERFORMANCE", "Branch Performance Monitoring"),
        ("GEO", "Geo / Area Control"),
        ("BRANCH_CONFIGURATION", "Branch Configuration Settings"),
    )

    # MultiSelectFields for permissions
    loan_management = MultiSelectField(choices=LOAN_MANAGEMENT, blank=True)
    document_management = MultiSelectField(choices=DOCUMENT_MANAGEMENT, blank=True)
    system_administration = MultiSelectField(choices=SYSTEM_ADMINISTRATION, blank=True)
    analytics_reports = MultiSelectField(choices=ANALYTICS_REPORTS, blank=True)
    branch_control = MultiSelectField(choices=BRANCH_CONTROL, blank=True)

    # ---------------------------
    # String representation
    # ---------------------------
    def __str__(self):
        return self.role_name
