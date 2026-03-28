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


# -----------------------------
# OVERDUE LOANS
# -----------------------------
class OverdueLoan(models.Model):
    STATUS_CHOICES = (
        ("OVERDUE", "Overdue"),
        ("NPA", "NPA"),
        ("RECOVERED", "Recovered"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    borrower_name = models.CharField(max_length=200)
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2)
    overdue_amount = models.DecimalField(max_digits=12, decimal_places=2)
    days_overdue = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.borrower_name} - {self.overdue_amount}"


# -----------------------------
# COLLECTION STATISTICS
# -----------------------------
class CollectionStats(models.Model):
    total_overdue = models.DecimalField(max_digits=15, decimal_places=2)
    npa_cases = models.IntegerField()
    efficiency_rate = models.DecimalField(max_digits=5, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Collection Stats - {self.updated_at.date()}"


# -----------------------------
# COLLECTION ACTIONS
# -----------------------------
class CollectionAction(models.Model):
    ACTION_TYPE_CHOICES = (
        ("CALL", "Call"),
        ("EMAIL", "Email"),
        ("VISIT", "Visit"),
        ("LEGAL", "Legal Notice"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    overdue_loan = models.ForeignKey(OverdueLoan, on_delete=models.CASCADE, related_name='actions')
    action_type = models.CharField(max_length=20, choices=ACTION_TYPE_CHOICES)
    remarks = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.action_type} - {self.overdue_loan.borrower_name}"
