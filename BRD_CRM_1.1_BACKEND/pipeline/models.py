from django.db import models
from django.conf import settings
from bulk_upload.models import ManualEntry
from data_lead.models import Lead

class PipelineLead(models.Model):
    PIPELINE_STATUS = (
        ("RAW", "Raw Pool"),
        ("VALIDATED", "Validated"),
        ("ASSIGNED", "Assigned"),
        ("SUPPRESSED", "Suppressed"),
    )

    lead = models.OneToOneField(
        "data_lead.Lead",  
        on_delete=models.CASCADE,
        related_name="pipeline"
    )

    is_valid = models.BooleanField(default=False)
    is_suppressed = models.BooleanField(default=False)
    

    status = models.CharField(
        max_length=20,
        choices=PIPELINE_STATUS,
        default="RAW"
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    validated_at = models.DateTimeField(null=True, blank=True)
    assigned_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pipeline → Lead #{self.lead.id}"


# leads/models.py

from django.db import models


class RawLead(models.Model):

    STATUS_CHOICES = [
        ('new', 'New'),
        ('attempted', 'Attempted'),
        ('verified', 'Verified'),
        ('converted', 'Converted'),
    ]
    contact_name = models.CharField(
        max_length=255
    )

    vendor_source = models.CharField(
        max_length=255
    )

    phone = models.CharField(
        max_length=20
    )
    lead = models.ForeignKey(
        "bulk_upload.ManualEntry",
        on_delete=models.CASCADE,
        related_name="raw_leads",
        blank=True,
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new'
    )

    last_activity = models.DateTimeField(
        null=True,
        blank=True
    )

    is_duplicate = models.BooleanField(
        default=False
    )

    is_stagnant = models.BooleanField(
        default=False
    )
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Keep admin/manual entry flow simple: auto-link or create ManualEntry when missing.
        if not self.lead_id:
            linked_lead = (
                ManualEntry.objects.filter(
                    mobile_number=self.phone,
                    name=self.contact_name,
                ).order_by("-id").first()
                or ManualEntry.objects.filter(mobile_number=self.phone).order_by("-id").first()
            )
            if not linked_lead:
                safe_name = (self.contact_name or "Raw Lead").strip()
                product = (self.vendor_source or "personal_loan").strip().lower().replace(" ", "_")
                if product not in {
                    "personal_loan",
                    "home_loan",
                    "car_loan",
                    "business_loan",
                    "education_loan",
                }:
                    product = "personal_loan"

                linked_lead = ManualEntry.objects.create(
                    name=safe_name,
                    mobile_number=self.phone,
                    email=None,
                    product_selection=product,
                    country="India",
                    state="Unknown",
                    city="Unknown",
                )
            self.lead = linked_lead

        super().save(*args, **kwargs)

class ValidationRule(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
class SuppressionEntry(models.Model):
    phone = models.CharField(max_length=15, unique=True)
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.phone


#--------------------------------
# Follow up
#---------------------------------
from django.db import models

class FollowUp(models.Model):

    DISPOSITION_CHOICES = [
        ('interested', 'Interested'),
        ('call_back_later', 'Call Back Later'),
        ('not_reachable', 'Not Reachable'),
        ('converted_to_meeting', 'Converted to Meeting'),
    ]

    TASK_TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    lead_name = models.CharField(max_length=255)

    type = models.CharField(
        max_length=20,
        choices=TASK_TYPE_CHOICES
    )

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium'
    )
    status = models.CharField(max_length=200, default="Pending")
    due = models.DateTimeField()

    call_summary = models.TextField(
        blank=True,
        null=True,
        help_text="Call Summary & Outcome"
    )

    disposition = models.CharField(
        max_length=30,
        choices=DISPOSITION_CHOICES
    )

    reschedule_date = models.DateField(
        blank=True,
        null=True
    )

    repeat_reminder = models.BooleanField(
        default=False
    )

    is_completed = models.BooleanField(
        default=False
    )

    is_archived = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"FollowUp - {self.disposition}"
#-------------------------
#Scheduel view
#-------------------------
class Activity(models.Model):
    ACTIVITY_TYPE_CHOICES = (
        ('TASK', 'Task'),
        ('MEETING', 'Meeting'),
    )

    TASK_TYPE_CHOICES = (
        ('CALL', 'Call'),
        ('EMAIL', 'Email'),
        ('WHATSAPP', 'WhatsApp'),
        ('REMINDER', 'Reminder'),
    )

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('DONE', 'Done'),
    )

    activity_type = models.CharField(
        max_length=10,
        choices=ACTIVITY_TYPE_CHOICES
    )

    task_type = models.CharField(
        max_length=20,
        choices=TASK_TYPE_CHOICES,
        blank=True,
        null=True
    )

    title = models.CharField(max_length=255)

    scheduled_date = models.DateField()
    scheduled_time = models.TimeField(null=True, blank=True)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Schedule View"
        verbose_name_plural = "Schedule View"

    def __str__(self):
        return self.title

#------------------------
#Escalations & SLA
#------------------------
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Escalation(models.Model):

    ESCALATION_TYPE = (
        ("sla_breach", "SLA Breach"),
        ("missed_twice", "Missed Twice"),
        ("dormancy", "Dormancy Risk"),
    )

    lead_name = models.CharField(max_length=150)

    escalation_type = models.CharField(max_length=20, choices=ESCALATION_TYPE)

    assigned_agent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    last_followup = models.DateTimeField(null=True, blank=True)

    risk = models.CharField(max_length=50)

    followup_missed_count = models.IntegerField(default=0)

    is_closed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.lead_name} - {self.escalation_type}"

#---------------------------
# Meeting
#---------------------------
from django.db import models


class Meeting(models.Model):

    MEETING_TYPE_CHOICES = [
        ("Virtual", "Virtual"),
        ("In-person", "In-person"),
        ("Telephonic", "Telephonic"),
    ]

    MEETING_MODE_CHOICES = [
        ("Google Meet", "Google Meet"),
        ("Zoom", "Zoom"),
        ("Whatsapp", "Whatsapp"),
    ]

    DURATION_CHOICES = [
        ("15 minutes", "15 minutes"),
        ("30 minutes", "30 minutes"),
        ("45 minutes", "45 minutes"),
        ("1 hour", "1 hour"),
        ("1.5 hours", "1.5 hours"),
    ]

    # Lead Information
    lead_name = models.CharField(max_length=255)
    lead_id = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)

    # Meeting Details
    meeting_type = models.CharField(max_length=20, choices=MEETING_TYPE_CHOICES)
    meeting_mode = models.CharField(max_length=20, choices=MEETING_MODE_CHOICES)

    date = models.DateField()
    time = models.TimeField()

    duration = models.CharField(
        max_length=20,
        choices=DURATION_CHOICES,
        blank=True,
        null=True
    )

    location_or_link = models.TextField(blank=True, null=True)

    meeting_agenda = models.TextField()
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lead_name} - {self.date}"
    
#---------------------
# Reschedule
#----------------------
from django.db import models


class MeetingLog(models.Model):

    MEETING_STATUS_CHOICES = [
        ("Scheduled","Scheduled"),
        ("Completed", "Completed"),
        ("No-show", "No-show"),
        ("Cancelled", "Cancelled"),
    ]

    MEETING_OUTCOME_CHOICES = [
        ("Positive", "Positive - Lead Interested"),
        ("Neutral", "Neutral - Needs Follow-up"),
        ("Negative", "Negative - Not Interested"),
    ]

    NEXT_ACTION_CHOICES = [
        ("Schedule Follow-up", "Schedule Follow-up"),
        ("Move to Deals Stage", "Move to Deals Stage"),
        ("Collect Documentations", "Collect Documentations"),
        ("Reschedule Meeting", "Reschedule Meeting"),
        ("No action Required", "No action Required"),
    ]

    meeting = models.ForeignKey(Meeting,on_delete=models.CASCADE,related_name="logs")

    meeting_status = models.CharField(
        max_length=20,
        choices=MEETING_STATUS_CHOICES
    )

    meeting_outcome = models.CharField(
        max_length=20,
        choices=MEETING_OUTCOME_CHOICES,
        null=True,
        blank=True
    )

    meeting_summary_notes = models.TextField()

    next_action = models.CharField(
        max_length=50,
        choices=NEXT_ACTION_CHOICES,
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=MEETING_STATUS_CHOICES,
        default="Scheduled",
        null=True,
        blank=True
    )

    is_rescheduled_meeting = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Reschedule"
        verbose_name_plural = "Reschedule"

    def __str__(self):
        return self.meeting_id

#--------------------------------
# Deals (Conversion/Disbursed)
# Loan Application
#----------------------------------
from django.db import models


class LoanApplication(models.Model):

    PRODUCT_TYPE_CHOICES = [
        ("Home Loan", "Home Loan"),
        ("Personal Loan", "Personal Loan"),
        ("Car Loan", "Car Loan"),
        ("Business Loan", "Business Loan"),
    ]

    INTEREST_TYPE_CHOICES = [
        ("Fixed", "Fixed"),
        ("Floating", "Floating"),
    ]

    APPLICATION_STATUS = [
        ("Draft", "Draft"),
        ("Submitted", "Submitted"),
    ]
    lead_name = models.CharField(max_length=255)
    product_type = models.CharField(
        max_length=50,
        choices=PRODUCT_TYPE_CHOICES
    )
    requested_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    tenure_months = models.IntegerField()

    interest_type = models.CharField(
        max_length=20,
        choices=INTEREST_TYPE_CHOICES
    )
    documents = models.FileField(
        upload_to="loan_documents/",
        null=True,
        blank=True
    )
    application_status = models.CharField(
        max_length=20,
        choices=APPLICATION_STATUS,
        default="Draft"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = "Loan Application"
        verbose_name_plural = "Loan Applications"

    def __str__(self):
        return self.lead_name

#--------------------------------
# Deals (Conversion/Disbursed)
# Application Status Tracking
#----------------------------------
from django.db import models
from django.contrib.auth.models import User
class ApplicationStatus(models.TextChoices):
    SUBMITTED = "Submitted", "Submitted"
    DOCUMENT_VERIFICATION = "Document Verification", "Document Verification"
    UNDER_REVIEW = "Under Review", "Under Review"
    APPROVED = "Approved", "Approved"
    REJECTED = "Rejected", "Rejected"
class RiskCategory(models.TextChoices):
    LOW = "Low", "Low"
    MEDIUM = "Medium", "Medium"
    HIGH = "High", "High"
class LoanTypeChoices(models.TextChoices):
    PERSONAL = "Personal Loan", "Personal Loan"
    HOME = "Home Loan", "Home Loan"
    CAR = "Car Loan", "Car Loan"
    BUSINESS = "Business Loan", "Business Loan"
class UnderwriterChoices(models.TextChoices):
    AGENT_A = "Agent A", "Agent A"
    AGENT_B = "Agent B", "Agent B"
    AGENT_C = "Agent C", "Agent C"
class ApplicationTracking(models.Model):
    application_id = models.CharField(max_length=50, unique=True)
    applicant_name = models.CharField(max_length=255)
    loan_type = models.CharField(
        max_length=100,
        choices=LoanTypeChoices.choices,
        default=LoanTypeChoices.PERSONAL
    )

    loan_amount = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(
        max_length=50,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.SUBMITTED
    )

    risk_category = models.CharField(
        max_length=20,
        choices=RiskCategory.choices,
        default=RiskCategory.LOW
    )

    assigned_underwriter = models.CharField(
        max_length=50,
        choices=UnderwriterChoices.choices,
        default=UnderwriterChoices.AGENT_A
    )

    submitted_date = models.DateField(null=True, blank=True)
    document_verification_date = models.DateField(null=True, blank=True)
    under_review_date = models.DateField(null=True, blank=True)
    decision_date = models.DateField(null=True, blank=True)

    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.application_id

#------------------------------
# Deals
#Loan Disbursed
#------------------------------
from django.db import models

class LoanStatus(models.TextChoices):
    ON_TRACK = "On-track", "On-track"
    DELAYED = "Delayed", "Delayed"
    COMPLETED = "Completed", "Completed"

class LoanProduct(models.TextChoices):
    HOME = "Home Loan", "Home Loan"
    CAR = "Car Loan", "Car Loan"
    PERSONAL = "Personal Loan", "Personal Loan"
    BUSINESS = "Business Loan", "Business Loan"

class LoanAction(models.TextChoices):
    VIEW_SCHEDULE = "View Schedule", "View Schedule"
    VIEW_DETAILS = "View Details", "View Details"
    DOWNLOAD_REPORT = "Download Report", "Download Report"

class DisbursedLoan(models.Model):

    loan_id = models.CharField(max_length=50, unique=True)

    customer_name = models.CharField(max_length=255)

    product = models.CharField(
        max_length=50,
        choices=LoanProduct.choices
    )

    disbursed_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    emi_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    next_emi_due = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=LoanStatus.choices,
        default=LoanStatus.ON_TRACK
    )

    action = models.CharField(
        max_length=50,
        choices=LoanAction.choices,
        default=LoanAction.VIEW_SCHEDULE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.loan_id


#-------------------------------
# Deal Status
# Lead Lost
#-------------------------------
from django.db import models


class LeadLost(models.Model):

    # ---------------- Product Choices ----------------
    PRODUCT_CHOICES = [
        ("HOME_LOAN", "Home Loan"),
        ("CAR_LOAN", "Car Loan"),
        ("PERSONAL_LOAN", "Personal Loan"),
        ("EDUCATION_LOAN", "Education Loan"),
        ("BUSINESS_LOAN", "Business Loan"),
    ]

    # ---------------- Loss Reason ----------------
    LOSS_REASON_CHOICES = [
        ("COMPETITOR", "Competitor"),
        ("NO_RESPONSE", "No Response"),
        ("HIGH_INTEREST", "High Interest Rate"),
        ("CHANGED_REQ", "Changed Requirements"),
        ("BUDGET", "Budget Constraint"),
    ]

    # ---------------- Agent Choices ----------------
    AGENT_CHOICES = [
        ("AGENT_A", "Agent A"),
        ("AGENT_B", "Agent B"),
        ("AGENT_C", "Agent C"),
        ("AGENT_D", "Agent D"),
    ]

    # ---------------- Basic Info ----------------
    lead_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=10)
    email = models.EmailField()

    # ---------------- Product ----------------
    product = models.CharField(
        max_length=30,
        choices=PRODUCT_CHOICES
    )

    # ---------------- Loss Info ----------------
    reason_for_loss = models.CharField(
        max_length=50,
        choices=LOSS_REASON_CHOICES
    )

    date_marked_lost = models.DateField()

    # ---------------- Agent ----------------
    agent_name = models.CharField(
        max_length=20,
        choices=AGENT_CHOICES
    )

    # ---------------- Activity ----------------
    days_inactive = models.PositiveIntegerField()
    last_activity = models.DateField()

    # ---------------- Financial ----------------
    lost_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    # ---------------- Notes ----------------
    remarks = models.TextField(blank=True)

    # ---------------- Auto Timestamp ----------------
    created_at = models.DateTimeField(auto_now_add=True)

    # ---------------- Lost Value Display ----------------
    def lost_value_display(self):
        if self.lost_value:
            return f"₹ {self.lost_value:,.2f}"
        return "N/A"

    lost_value_display.short_description = "Lost Value"

    def __str__(self):
        return f"{self.name} ({self.lead_id})"

#-------------------------------
# Deal Status
# Lead Dead
#-------------------------------
from django.db import models
class LeadDead(models.Model):
    PRODUCT_CHOICES = [
        ("HOME_LOAN", "Home Loan"),
        ("CAR_LOAN", "Car Loan"),
        ("PERSONAL_LOAN", "Personal Loan"),
        ("EDUCATION_LOAN", "Education Loan"),
        ("BUSINESS_LOAN", "Business Loan"),
    ]

    DEAD_REASON_CHOICES = [
        ("INVALID_DATA", "Invalid Data"),
        ("FRAUD_DETECTION", "Fraud Detection"),
        ("FRAUD", "Fraud"),
        ("MISSING_DATA", "Missing Critical Data"),
        ("NON_VERIFIABLE", "Non-Verifiable"),
    ]

    VERIFIED_BY_CHOICES = [
        ("SARAH", "QA Manager - Sarah"),
        ("PRIYA", "QA Manager - Priya"),
        ("SECURITY", "Security Team"),
        ("SYSTEM", "System Auto-Reject"),
    ]


    DATA_SOURCE_CHOICES = [
        ("PURCHASE_LIST", "Purchase List"),
        ("WEB_FORM", "Web Form"),
        ("LEGACY_IMPORT", "Legacy Import"),
        ("MANUAL_ENTRY", "Manual Entry"),
        ("API", "API Integrations"),
    ]

    lead_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)

    phone = models.CharField(max_length=15)
    email = models.EmailField()

    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_CHOICES
    )

    reason_for_dead = models.CharField(
        max_length=30,
        choices=DEAD_REASON_CHOICES
    )

    date_marked_dead = models.DateField()

    verified_by = models.CharField(
        max_length=30,
        choices=VERIFIED_BY_CHOICES
    )

    notes = models.TextField(blank=True)

    data_source = models.CharField(
        max_length=30,
        choices=DATA_SOURCE_CHOICES
    )

    mark_as_fraud = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def lead_id_display(self):
        return f"DD-{self.lead_id}"

    lead_id_display.short_description = "Dead Lead ID"

    def __str__(self):
        return f"{self.name} ({self.lead_id})"

#-------------------------------
# Lead Status
# Lead Expired 
#--------------------------------
from django.db import models
class LeadExpired(models.Model):

    PRODUCT_CHOICES = [
        ("HOME_LOAN", "Home Loan"),
        ("CAR_LOAN", "Car Loan"),
        ("PERSONAL_LOAN", "Personal Loan"),
        ("EDUCATION_LOAN", "Education Loan"),
        ("BUSINESS_LOAN", "Business Loan"),
    ]

    EXPIRY_REASON_CHOICES = [
        ("TIME_BOUND", "Time-bound Offer"),
        ("VALIDITY_EXPIRED", "Offer Validity Expired"),
        ("BUDGET_LAPSE", "Budget Lapse"),
        ("SEASONAL_END", "Seasonal Campaign Ended"),
        ("ACADEMIC_DEADLINE", "Academic Year Deadline"),
    ]

    AGENT_CHOICES = [
        ("AGENT_A", "Agent A"),
        ("AGENT_B", "Agent B"),
        ("AGENT_C", "Agent C"),
        ("AGENT_D", "Agent D"),
    ]

 
    lead_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)

    phone = models.CharField(max_length=15)
    email = models.EmailField()

    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_CHOICES
    )

    validity_expiry_date = models.DateField()

    expiry_reason = models.CharField(
        max_length=40,
        choices=EXPIRY_REASON_CHOICES
    )

    assigned_agent = models.CharField(
        max_length=20,
        choices=AGENT_CHOICES
    )

    system_auto_expired = models.BooleanField(default=False)

    days_expired = models.PositiveIntegerField()

    offer_details = models.TextField(blank=True)

    last_contact_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def lead_id_display(self):
        return f"EX-{self.lead_id}"

    lead_id_display.short_description = "Expired Lead ID"

    def __str__(self):
        return f"{self.name} ({self.lead_id})"

#-------------------------------
#Lead Status
# Lead Rejected
#-----------------------------------
from django.db import models
class LeadRejected(models.Model):
    PRODUCT_CHOICES = [
        ("HOME_LOAN", "Home Loan"),
        ("CAR_LOAN", "Car Loan"),
        ("PERSONAL_LOAN", "Personal Loan"),
        ("EDUCATION_LOAN", "Education Loan"),
        ("BUSINESS_LOAN", "Business Loan"),
    ]

    REJECTION_REASON_CHOICES = [
        ("ELIGIBILITY", "Eligibility Criteria"),
        ("DOCUMENT_MISSING", "Documents Missing"),
        ("POLICY_CONFLICT", "Policy Conflict"),
        ("DTI_HIGH", "Debt-to-Income Ratio High"),
        ("AGE_ISSUE", "Age Eligibility"),
    ]

    REJECTION_STAGE_CHOICES = [
        ("PRE_SCREENING", "Pre-Screening"),
        ("AFTER_APPLICATION", "After Application"),
        ("UNDERWRITING", "Underwriting"),
    ]

    REJECTED_BY_CHOICES = [
        ("PRIYA", "Underwriter - Priya"),
        ("SARAH", "Underwriter - Sarah"),
        ("VIKRAM", "Underwriter - Vikram"),
        ("RAHUL", "QA Team - Rahul"),
        ("SYSTEM", "System Auto-Reject"),
    ]

    lead_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)

    phone = models.CharField(max_length=15)
    email = models.EmailField()

    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_CHOICES
    )

    reason_for_rejection = models.CharField(
        max_length=40,
        choices=REJECTION_REASON_CHOICES
    )

    rejection_stage = models.CharField(
        max_length=30,
        choices=REJECTION_STAGE_CHOICES
    )

    rejected_by = models.CharField(
        max_length=30,
        choices=REJECTED_BY_CHOICES
    )

    rejection_date = models.DateField()

    credit_score = models.PositiveIntegerField()
    required_score = models.PositiveIntegerField()

    notes = models.TextField(blank=True)
    application_id = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def lead_id_display(self):
        return f"RJ-{self.lead_id}"

    lead_id_display.short_description = "Rejected Lead ID"

    def __str__(self):
        return f"{self.name} ({self.lead_id})"
# leedstatus management 
from django.db import models

class LeadStatusDashboard(models.Model):
    lead_lost = models.IntegerField(default=0)
    lead_dead = models.IntegerField(default=0)
    lead_expired = models.IntegerField(default=0)
    lead_rejected = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # optional, keeps track of changes

    def __str__(self):
        return f"Lead Status Dashboard - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
        
# deals dashboard

class DealsDashboard(models.Model):

    total_applications = models.IntegerField(
        default=0,
        help_text="+ This Week"
    )

    under_review = models.IntegerField(
        default=0,
        help_text="Processing"
    )

    approved = models.FloatField(
        default=0.0,
        help_text="% Approval Rate"
    )

    total_disbursed = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="This Month (Amount in ₹)"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Deals Dashboard - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"


#lead list view
class LeadListViews(models.Model):

    TIMELINE_CHOICES = [
        ('raw', 'Entered Raw Stage'),
        ('qualified', 'Qualified'),
        
    ]

    mobile_number = models.CharField(max_length=15)
    lead_source = models.CharField(max_length=100)
    agent_remarks = models.TextField(blank=True, null=True)

    lifecycle_timeline = models.CharField(
        max_length=30,
        choices=TIMELINE_CHOICES,
        default='raw'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.mobile_number
# raw leads dashboard


class RawLeadsDashboard(models.Model):

    total_raw_leads = models.IntegerField(default=0)
    new_today = models.IntegerField(default=0)
    stagnant = models.IntegerField(
        default=0,
        help_text="Leads older than 7 days"
    )
    duplicate_flags = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Stage 1: Validation & Processing"
        verbose_name_plural = "Stage 1: Validation & Processing"

    def __str__(self):
        return f"Raw Leads Dashboard - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"

# follow up dashboard
from django.db import models

class FollowUpDashboard(models.Model):
    active_tasks = models.IntegerField(
        default=0,
        help_text="Calls Today"
    )
    sla_breaches = models.IntegerField(
        default=0,
        help_text="Overdue > 48h"
    )
    whatsapp_leads = models.IntegerField(
        default=0,
        help_text="Real-time Replies"
    )
    
    # Combined meeting conversion field
    meeting_conversion = models.FloatField(
        default=0.0,
        help_text="Meeting Conversion vs Last Week (%)"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Follow-Up Dashboard"
        verbose_name_plural = "Follow-Up Dashboard"
        ordering = ['-created_at']

    def __str__(self):
        return f"Follow-Up Dashboard - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"

# Escalation data
class EscalationData(models.Model):
    critical_sla_breaches = models.IntegerField(default=0)
    double_missed_leads = models.IntegerField(default=0)
    dormancy_risk = models.IntegerField(default=0)

    def __str__(self):
        return f"SLA Breaches: {self.critical_sla_breaches}, Double Missed: {self.double_missed_leads}"


#meeting dashboard
class MeetingsDashboard(models.Model):
    total_meetings = models.IntegerField(default=0)
    scheduled = models.IntegerField(default=0)
    completed = models.IntegerField(default=0)
    rescheduled = models.IntegerField(default=0)

    def __str__(self):
        return f"Meetings Dashboard"
    
# rescheduled meeting dashboard 
class RescheduledDashboard(models.Model):
    total_rescheduled = models.IntegerField(default=0)
    multiple_reschedules = models.IntegerField(default=0)
    avg_reschedules = models.FloatField(default=0.0)

    def __str__(self):
        return "Rescheduled Dashboard Metrics"

