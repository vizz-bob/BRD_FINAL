from django.db import models
import uuid
from adminpanel.profile_management.models import (
    AgentType,
    AgentCategory,
    AgentLevel,
    AgentLocation,
    AgentServiceType,
    AgentResponsibility,
)

STATUS_CHOICES = (
    ("ACTIVE", "Active"),
    ("INACTIVE", "Inactive"),
)

# =====================================================
# BASE AGENT (Common fields)
# =====================================================
class BaseAgent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agent_name = models.CharField(max_length=150)
    contact_no = models.CharField(max_length=15)
    email = models.EmailField()
    # location = models.ForeignKey(AgentLocation, on_delete=models.PROTECT)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ACTIVE")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True


# =====================================================
# 1. Channel Partner / Referral Agent
# =====================================================
class ChannelPartner(BaseAgent):
    agent_type = models.ForeignKey(AgentType, on_delete=models.PROTECT)
    # agent_category = models.ForeignKey(AgentCategory, on_delete=models.PROTECT)
    # agent_level = models.ForeignKey(AgentLevel, on_delete=models.PROTECT)
    # agent_service_type = models.ForeignKey(AgentServiceType, on_delete=models.PROTECT)


# =====================================================
# 2. Verification Agency
# =====================================================
class VerificationAgency(BaseAgent):
    verification_agent_type = models.CharField(
        max_length=50
    )  # Verification / Valuation / Technical / Legal / Fraud


# =====================================================
# 3. Collection Agent
# =====================================================
class CollectionAgent(BaseAgent):
    recovery_type = models.CharField(
        max_length=50
    )  # Soft / Hard / Legal
