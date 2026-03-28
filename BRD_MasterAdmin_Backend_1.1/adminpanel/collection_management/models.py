from django.db import models
import uuid

# -----------------------------
# PAYMENT GATEWAY MANAGEMENT
# -----------------------------
class PaymentGateway(models.Model):
    MODE_CHOICES = (
        ("TEST", "Test"),
        ("LIVE", "Live"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gateway_name = models.CharField(max_length=100)
    api_key = models.CharField(max_length=255)
    api_secret = models.CharField(max_length=255)
    transaction_fee = models.DecimalField(max_digits=5, decimal_places=2)
    mode = models.CharField(max_length=10, choices=MODE_CHOICES)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.gateway_name


# -----------------------------
# COLLECTION CONTROL MANAGEMENT
# -----------------------------
class CollectionControl(models.Model):
    COLLECTION_TYPE_CHOICES = (
        ("ONLINE", "Online"),
        ("OFFLINE", "Offline"),
        ("LEGAL", "Legal"),
    )

    allowed_collection_types = models.JSONField()
    security_deposit = models.DecimalField(max_digits=12, decimal_places=2)
    cash_collection_limit = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return "Collection Controls"


# -----------------------------
# CLIENT – TEAM MAPPING
# -----------------------------
class ClientTeamMapping(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client_name = models.CharField(max_length=150)
    team_name = models.CharField(max_length=150)
    mapping_start_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.client_name} → {self.team_name}"


# -----------------------------
# CLIENT – AGENT MAPPING
# -----------------------------
class ClientAgentMapping(models.Model):
    MAPPING_TYPE_CHOICES = (
        ("PRIMARY", "Primary"),
        ("SECONDARY", "Secondary"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client_name = models.CharField(max_length=150)
    agent_name = models.CharField(max_length=150)
    mapping_type = models.CharField(max_length=20, choices=MAPPING_TYPE_CHOICES)
    region = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.client_name} → {self.agent_name}"


# -----------------------------
# PAYOUT MANAGEMENT
# -----------------------------
class PayoutManagement(models.Model):
    PAYOUT_TYPE_CHOICES = (
        ("AGENT", "Agent"),
        ("PARTNER", "Partner"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payout_type = models.CharField(max_length=20, choices=PAYOUT_TYPE_CHOICES)
    agent_or_partner_name = models.CharField(max_length=150)
    payout_cycle = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.payout_type} - {self.agent_or_partner_name}"
