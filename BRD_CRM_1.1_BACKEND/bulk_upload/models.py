from django.db import models
from django.contrib.auth.models import User


class FileUpload(models.Model):
    PRODUCT_SELECTION_CHOICES = [
        ("personal_loan", "Personal Loan"),
        ("home_loan", "Home Loan"),
        ("car_loan", "Car Loan"),
        ("business_loan", "Business Loan"),
        ("education_loan", "Education Loan"),
    ]

    ASSIGN_AGENT_CHOICES = [
        ("agent_a", "Agent A"),
        ("agent_b", "Agent B"),
        ("agent_c", "Agent C"),
        ("sales_team", "Sales Team"),
    ]

    select_file = models.FileField(upload_to="select_file/", blank=True, null=True)
    product_selection = models.CharField(max_length=50, choices=PRODUCT_SELECTION_CHOICES)
    assign_agent = models.CharField(max_length=50, choices=ASSIGN_AGENT_CHOICES)
    enable_duplicate_check = models.BooleanField(default=False)
    consent_obtained = models.BooleanField(default=False)
    overwrite_existing_data = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product_selection} - {self.assign_agent}"


class ManualEntry(models.Model):
    PRODUCT_SELECTION_CHOICES = [
        ("personal_loan", "Personal Loan"),
        ("home_loan", "Home Loan"),
        ("car_loan", "Car Loan"),
        ("business_loan", "Business Loan"),
        ("education_loan", "Education Loan"),
    ]

    name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    product_selection = models.CharField(max_length=50, choices=PRODUCT_SELECTION_CHOICES)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class FtpIntegration(models.Model):
    FREQUENCY_CHOICES = [
        ("once", "One-time"),
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("monthly", "Monthly"),
    ]

    configuration_name = models.CharField(max_length=255)
    ftp_host = models.URLField(max_length=500, blank=True, null=True)
    port = models.IntegerField()
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=128)
    remote_path = models.CharField(max_length=1000, blank=True, null=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    time = models.TimeField(blank=True, null=True)

    def masked_password(self, obj):
        return "********"
    masked_password.short_description = "Password"


    def __str__(self):
        return self.configuration_name


class ApiIntegration(models.Model):
    HTTP_METHOD_CHOICES = [
        ("GET", "GET"),
        ("POST", "POST"),
        ("PUT", "PUT"),
        ("PATCH", "PATCH"),
    ]

    AUTH_TYPE_CHOICES = [
        ("bearer_token", "Bearer Token"),
        ("api_key", "API Key"),
        ("basic_auth", "Basic Auth"),
        ("oauth_2_0", "OAuth 2.0"),
    ]

    SYNC_SCHEDULE_CHOICES = [
        ("real_time_webhook", "Real Time Webhook"),
        ("hourly", "Hourly"),
        ("daily", "Daily"),
        ("manual_only", "Manual Only"),
    ]

    configuration_name = models.CharField(max_length=255)
    api_endpoint_url = models.URLField(max_length=1000, blank=True, null=True)
    http_method = models.CharField(max_length=20, choices=HTTP_METHOD_CHOICES)
    auth_type = models.CharField(max_length=20, choices=AUTH_TYPE_CHOICES)
    api_key = models.CharField(max_length=128)
    header_key = models.CharField(max_length=255)
    header_value = models.CharField(max_length=255)
    sync_schedule = models.CharField(max_length=20, choices=SYNC_SCHEDULE_CHOICES)

    def __str__(self):
        return self.configuration_name
