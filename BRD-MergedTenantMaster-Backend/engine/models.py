# from django.db import models


# # rules/models.py
# from django.db import models

# class TenantRuleConfig(models.Model):
#     tenant = models.OneToOneField(
#         "tenants.Tenant",
#         on_delete=models.CASCADE,
#         related_name="rules_config"
#     )

#     config = models.JSONField(default=dict)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"RulesConfig Tenant={self.tenant_id}"


# # 🔹 Base permission model (REUSABLE)
# class BaseRule(models.Model):
#     can_view = models.BooleanField(default=False)
#     can_add = models.BooleanField(default=False)
#     can_edit = models.BooleanField(default=False)
#     can_delete = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         abstract = True  # ❗ no table created for this


# # 🔹 Access Rules
# class AccessRule(BaseRule):
#     def __str__(self):
#         return f"AccessRule {self.id}"


# # 🔹 Workflow Rules
# class WorkflowRule(BaseRule):
#     def __str__(self):
#         return f"WorkflowRule {self.id}"


# # 🔹 Validation Rules
# class ValidationRule(BaseRule):
#     def __str__(self):
#         return f"ValidationRule {self.id}"


# # 🔹 Assignment Rules
# class AssignmentRule(BaseRule):
#     def __str__(self):
#         return f"AssignmentRule {self.id}"


# # 🔹 Security Rules
# class SecurityRule(BaseRule):
#     def __str__(self):
#         return f"SecurityRule {self.id}"



from django.db import models
from django.conf import settings
import uuid
from tenants.models import Tenant

class TenantRule(models.Model):
    """
    Stores full rules engine config per tenant
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.OneToOneField(
        Tenant,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="rules"
    )
    config = models.JSONField()  # <-- entire config from frontend
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenant_rules"

    def __str__(self):
        return f"Rules for {self.tenant_id}"
