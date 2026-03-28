from django.db import models
import uuid
from django.contrib.auth.models import User
from django.utils import timezone


class LoanAccount(models.Model):
    borrower_name = models.CharField(max_length=255)
    loan_number = models.CharField(max_length=50, unique=True)

    outstanding_balance = models.DecimalField(max_digits=12, decimal_places=2)
    emi_amount = models.DecimalField(max_digits=10, decimal_places=2)
    emi_count = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.borrower_name} ({self.loan_number})"

class Repayment(models.Model):
    STATUS_CHOICES = (
        ("PAID", "Paid"),
        ("PARTIAL", "Partially Paid"),
        ("UNPAID", "Unpaid"),
    )

    MODE_CHOICES = (
        ("UPI", "UPI"),
        ("BANK", "Bank Transfer"),
        ("CASH", "Cash"),
    )

    loan = models.ForeignKey(
        LoanAccount,
        on_delete=models.CASCADE,
        related_name="repayments"
    )

    emi_number = models.IntegerField()
    due_date = models.DateField()

    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    payment_mode = models.CharField(max_length=20, choices=MODE_CHOICES, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    transaction_id = models.CharField(max_length=100, blank=True)
    receipt = models.FileField(upload_to="repayment_receipts/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
class CollectionBucket(models.Model):
    loan = models.ForeignKey(
        LoanAccount,
        on_delete=models.CASCADE,
        related_name="collection_bucket"
    )
   
    Commit_Date = models.DateTimeField(auto_now_add=True)

    auto_late_fee = models.DecimalField(max_digits=10, decimal_places=2)
    total_overdue = models.DecimalField(max_digits=12, decimal_places=2)

    updated_at = models.DateTimeField(auto_now=True)
class PromiseToPay(models.Model):
    collection_bucket = models.ForeignKey(
        CollectionBucket,
        on_delete=models.CASCADE,
        related_name="ptps"
    )
    loan = models.ForeignKey(
        LoanAccount,
        on_delete=models.CASCADE,
        related_name="ptps"
    )

    commit_date = models.DateField()
    commit_amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
class InteractionLog(models.Model):
    outcome_choices = (
        ("select outcome","Select Outcome"),("switched off","Switched Off"),("not reachable","Not Reachable"),("ptp captured","Ptp Captured"),("wrong nummber","Wrong Number")
    )
    CHANNEL_CHOICES = (
        ("CALL", "Call"),
        ("SMS", "SMS"),
        ("WHATSAPP", "WhatsApp"),
    )

    loan = models.ForeignKey(
        LoanAccount,
        on_delete=models.CASCADE,
        related_name="interactions"
    )
    collection_bucket = models.ForeignKey(
        CollectionBucket,
        on_delete=models.CASCADE,
        related_name="interactions"
    )
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    outcome = models.CharField(max_length=255,choices=outcome_choices,default="select outcome")

    created_by = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
class RecoveryCase(models.Model):
    recovery_modes = (
        ("legal","Legal"),("field visit","Field Visit"),("telephonic","Telephonic")
    )
    STAGE_CHOICES = (
        ("SOFT", "Soft Notice"),
        ("FIELD", "Field Visit"),
        ("court","Court Case"),
        ("LEGAL", "Legal"),
        ("SETTLED", "Settled"),
    )

    loan = models.ForeignKey(
    LoanAccount,
    on_delete=models.CASCADE,
    
)

    stage = models.CharField(max_length=20, choices=STAGE_CHOICES)
    Recovery_mode = models.CharField(max_length=20,choices=recovery_modes)
    assigned_agent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    follow_up_date = models.DateField(null=True, blank=True)
    amount_collected = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    settlement_notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
class SettlementDocument(models.Model):
    recovery = models.ForeignKey(
        RecoveryCase,              
        on_delete=models.CASCADE,
        related_name="documents"      
    )

    file = models.FileField(upload_to="settlements/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document for Recovery #{self.recovery.id}"
class Forecast(models.Model):
    FORECAST_TYPE = (
        ("SALES", "Sales Forecast"),
        ("REVENUE", "Revenue Forecast"),
    )

    PERIOD = (
        ("WEEKLY", "Weekly"),
        ("MONTHLY", "Monthly"),
        ("quarterly","Quaterly")
    )

    name = models.CharField(max_length=255)
    forecast_type = models.CharField(max_length=20, choices=FORECAST_TYPE)
    period = models.CharField(max_length=20, choices=PERIOD)

    start_date = models.DateField()
    end_date = models.DateField()

    target_revenue = models.DecimalField(max_digits=14, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
class Campaign(models.Model):
    name = models.CharField(max_length=255)
    channel = models.CharField(max_length=50)  # Email, SMS, Dialer, Landing Page
    forecast = models.ForeignKey(
        Forecast,
        on_delete=models.CASCADE,
        related_name="campaigns"
    )
class Lead(models.Model):
    STAGE = (
        ("RAW", "Raw"),
        ("HOT", "Hot"),
        ("FOLLOW_UP", "Follow Up"),
        ("CONVERTED", "Converted"),
    )
    forecast = models.ForeignKey(
        Forecast,
        on_delete=models.CASCADE,
        related_name="leads"
    )
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True)
    assigned_agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    stage = models.CharField(max_length=20, choices=STAGE)
    expected_value = models.DecimalField(max_digits=12, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    
# class AgentTarget(models.Model):
#     agent = models.ForeignKey(User, on_delete=models.CASCADE)
#     forecast = models.ForeignKey(Forecast, on_delete=models.CASCADE)

#     target_value = models.DecimalField(max_digits=12, decimal_places=2)
#     achieved_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
class AgentTarget(models.Model):
    agent = models.ForeignKey(User, on_delete=models.CASCADE)
    forecast = models.ForeignKey(Forecast, on_delete=models.CASCADE)

    target_value = models.FloatField(default=0)
    achieved_value = models.FloatField(default=0)

    updated_at = models.DateTimeField(auto_now=True)   # ✅ Last Updated

    # ✅ Achievement %
    @property
    def achievement_percent(self):
        if self.target_value == 0:
            return 0
        return round((self.achieved_value / self.target_value) * 100, 2)

    # ✅ Variance
    @property
    def variance(self):
        return round(self.achieved_value - self.target_value, 2)

    # ✅ Expected Deals (Example logic from Leads)
    @property
    def expected_deals(self):
        return Lead.objects.filter(
            forecast=self.forecast,
            assigned_agent=self.agent,
            stage="HOT"
        ).count()

    # ✅ Status
    @property
    def status(self):
        if self.achievement_percent >= 100:
            return "On Track"
        elif self.achievement_percent >= 80:
            return "At Risk"
        return "Behind"


class Target(models.Model):
    TARGET_TYPE_CHOICES = [
        ("activity", "Activity"),
        ("conversion", "Conversion"),
        ("financial", "Financial"),
    ]

    PERIOD_CHOICES = [
        ("daily", "Daily"),
        ("monthly", "Monthly"),
        ("weekly", "Weekly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]

    ASSIGN_TO_CHOICES = [
        ("user", "User"),
        ("team", "Team"),
    ]

    name = models.CharField(max_length=100)
    target_type = models.CharField(max_length=20, choices=TARGET_TYPE_CHOICES)
    target_value = models.FloatField(default=0)
    achieved_value = models.FloatField(default=0)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    assign_to = models.CharField(max_length=20, choices=ASSIGN_TO_CHOICES)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    @property
    def achievement_percent(self):
        if not self.target_value:
            return 0
        if not self.achieved_value:
            return 0
        return round((self.achieved_value / self.target_value) * 100, 2)

    @property
    def variance(self):
        if not self.target_value:
            return 0
        achieved = self.achieved_value or 0
        return round(self.target_value - achieved, 2)

    @property
    def status(self):
        achievement = self.achievement_percent
        if achievement >= 100:
            return "On Track"
        elif achievement >= 80:
            return "At Risk"
        return "Behind Target"

class ActivityTarget(models.Model):
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50)  # Calls, Meetings
    target_count = models.IntegerField(default=0)
    achieved_count = models.IntegerField(default=0)

    @property
    def progress(self):
        if self.target_count == 0:
            return 0
        return round((self.achieved_count/self.target_count) * 100, 2)


class ConversionTarget(models.Model):
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    conversion_type = models.CharField(max_length=50)
    stage_from = models.CharField(max_length=50)
    stage_to = models.CharField(max_length=50)
    target_rate = models.FloatField(default=0)
    actual_rate = models.FloatField(default=0)

    @property
    def achievement(self):
        if self.target_rate == 0:
            return 0
        return round((self.actual_rate/self.target_rate) * 100, 2)


class CampaignROI(models.Model):
    target = models.ForeignKey(
        "Target",
        related_name="campaign_rois",
        on_delete=models.CASCADE
    )
    channel = models.CharField(max_length=100)
    spend = models.FloatField(default=0)
    leads = models.IntegerField()
    conversions = models.IntegerField()
    revenue = models.FloatField(default=0)

    @property
    def cpl(self):
        return round(self.spend/self.leads, 2) if self.leads else 0

    @property
    def conversion_rate(self):
        return round((self.conversions/self.leads) * 100, 2) if self.leads else 0

    @property
    def roi(self):
        if self.spend == 0:
            return 0
        return round(((self.revenue-self.spend)/self.spend) * 100, 2)

    @property
    def status(self):
        if self.roi >= 50:
            return "Profitable"
        elif self.roi >= 10:
            return "Needs Attention"
        return "Loss"


class TargetHistory(models.Model):
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    period_label = models.CharField(max_length=50)
    target_value = models.FloatField()
    achieved_value = models.FloatField()
    achievement = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def trend(self):
        previous = (
            TargetHistory.objects
            .filter(target=self.target, created_at__lt=self.created_at)
            .order_by("-created_at")
            .first()
        )

        if not previous:
            return "stable"

        if self.achievement > previous.achievement:
            return "up"
        elif self.achievement < previous.achievement:
            return "down"
        return "stable"

    def __str__(self):
        return f"{self.target.name} - {self.period_label}"

class Trend(models.Model):
    target = models.ForeignKey("Target", on_delete=models.CASCADE)
    period_label = models.CharField(max_length=50)
    trend_value = models.FloatField()
    trend_status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.target.name} - {self.trend_status}"

