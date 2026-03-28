from django.db import models
from django.conf import settings
import uuid


class ApprovalMaster(models.Model):
    LEVEL_CHOICES = [
        ("L1", "Level 1"),
        ("L2", "Level 2"),
        ("L3", "Level 3"),
        ("L4", "Level 4"),
        ("FINAL", "Final"),
    ]

    TYPE_CHOICES = [
        ("INDIVIDUAL", "Individual"),
        ("TEAM", "Team"),
    ]

    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Approval hierarchy
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES)

    # Approver nature
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    # Product info
    product_type = models.CharField(max_length=100)
    product_name = models.CharField(max_length=150)

    # Approval details
    sanction_name = models.CharField(max_length=150)

    rate_inc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    rate_dec = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    fees_inc = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fees_dec = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    tenure_inc = models.PositiveIntegerField(null=True, blank=True)
    tenure_dec = models.PositiveIntegerField(null=True, blank=True)

    moratorium_interest = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    moratorium_period = models.PositiveIntegerField(null=True, blank=True)

    approval_range = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ACTIVE")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["level", "product_type"]

    def __str__(self):
        return f"{self.level} - {self.product_name}"




# ===============================
# 1. MANAGE APPROVAL
# ===============================
# class ApprovalAssignment(models.Model):
#     STATUS_CHOICES = (
#         ("ACTIVE", "Active"),
#         ("INACTIVE", "Inactive"),
#     )

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     tenant_id = models.CharField(max_length=100)
#     user_or_group = models.CharField(max_length=100)  # User / Group
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ACTIVE")
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.tenant_id} - {self.user_or_group}"

class ApprovalAssignment(models.Model):
    APPROVER_TYPE_CHOICES = (
        ("INDIVIDUAL", "Individual"),
        ("GROUP", "Group"),
    )

    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant_id = models.CharField(max_length=100)

    approver_type = models.CharField(
        max_length=20,
        choices=APPROVER_TYPE_CHOICES,
        null=True,
        blank=True,
    )

    # For Individual approver
    user_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    # For Group approver (store multiple users)
    group_users = models.JSONField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant_id} - {self.approver_type}"



# ===============================
# 2. ESCALATION MASTER
# ===============================
# class EscalationMaster(models.Model):
#     LEVEL_CHOICES = (
#         (1, "Level 1"),
#         (2, "Level 2"),
#         (3, "Level 3"),
#         (4, "Level 4"),
#     )

#     STATUS_CHOICES = (
#         ("ACTIVE", "Active"),
#         ("INACTIVE", "Inactive"),
#     )

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     escalation_level = models.PositiveSmallIntegerField(choices=LEVEL_CHOICES)
#     escalation_time = models.DateTimeField()
#     escalation_manager = models.CharField(max_length=100)
#     escalation_to = models.CharField(max_length=100)
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ACTIVE")
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Level {self.escalation_level} Escalation"

from django.conf import settings

class EscalationMaster(models.Model):
    LEVEL_CHOICES = (
        (1, "Level 1"),
        (2, "Level 2"),
        (3, "Level 3"),
        (4, "Level 4"),
    )

    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    escalation_level = models.PositiveSmallIntegerField(choices=LEVEL_CHOICES)
    escalation_time = models.DateTimeField()

    escalation_manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="escalations_managed"
    )
    escalation_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="escalations_to"
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ACTIVE")
    created_at = models.DateTimeField(auto_now_add=True)

