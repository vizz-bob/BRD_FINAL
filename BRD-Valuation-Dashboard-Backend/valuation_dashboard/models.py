from django.db import models


# ---------------------------
# New Valuation Request
# ---------------------------
class NewValuationRequest(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    property_type = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    request_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.property_type} - {self.location} ({self.status})"


# ---------------------------
# Generate New Report
# ---------------------------
class GenerateNewReport(models.Model):

    REPORT_TYPE_CHOICES = [
        ('summary', 'Summary'),
        ('audit', 'Audit'),
        ('data_privacy', 'Data Privacy'),
    ]

    STATUS_CHOICES = [
        ('generated', 'Generated'),
        ('processing', 'Processing'),
    ]

    report_type = models.CharField(
        max_length=50,
        choices=REPORT_TYPE_CHOICES
    )
    from_date = models.DateField()
    to_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="processing"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report_type} ({self.status})"


# ---------------------------
# Valuation Dashboard
# ---------------------------
class ValuationDashboard(models.Model):

    pending_valuations = models.IntegerField(default=0)
    completed_today = models.IntegerField(default=0)
    average_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00
    )
    success_rate = models.FloatField(default=0.0)  # percentage

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Valuation Dashboard"


# ---------------------------------
# Location Distribution
# ---------------------------------
class LocationDistribution(models.Model):

    MONTH_CHOICES = [
        ('all', 'All'),
        ('january', 'January'),
        ('february', 'February'),
        ('march', 'March'),
        ('april', 'April'),
        ('may', 'May'),
        ('june', 'June'),
        ('july', 'July'),
        ('august', 'August'),
        ('september', 'September'),
        ('october', 'October'),
        ('november', 'November'),
        ('december', 'December'),
    ]

    TYPE_CHOICES = [
        ('all', 'All'),
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('industrial', 'Industrial'),
    ]

    STATE_CHOICES = [
        ('all', 'All'),
        ('mumbai', 'Mumbai'),
        ('hyderabad', 'Hyderabad'),
        ('chennai', 'Chennai'),
        ('bangalore', 'Bangalore'),
        ('delhi', 'Delhi'),
    ]

    month = models.CharField(max_length=20, choices=MONTH_CHOICES, default='all')
    property_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='all')
    state = models.CharField(max_length=50, choices=STATE_CHOICES, default='all')

    valuations_count = models.IntegerField(default=0)
    top_property_type = models.CharField(max_length=50, blank=True)
    avg_loan = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.state} - {self.valuations_count}"


# ---------------------------
# Valuation
# ---------------------------
class Valuation(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("verified", "Verified"),
    ]

    valuation_id = models.CharField(max_length=20, unique=True)
    property_name = models.CharField(max_length=200)
    location = models.CharField(max_length=255)
    valuation_date = models.DateField()
    estimated_value = models.DecimalField(
        max_digits=15,
        decimal_places=2
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
    action = models.CharField(max_length=200, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.valuation_id} - {self.property_name}"