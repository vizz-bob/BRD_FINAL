#---------------------------------
# update agent
#--------------------------------
from django.db import models

class UpdateAgent(models.Model):

    AGENT_TYPE_CHOICES = [
        ('dsa', 'DSA'),
        ('broker', 'Broker'),
        ('lead_partner', 'Lead Partner'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    full_name = models.CharField(max_length=150)
    date_of_birth = models.DateField()
    phone_number = models.CharField(max_length=15)
    email_address = models.EmailField(unique=True)
    agent_type = models.CharField(max_length=20, choices=AGENT_TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
#------------------------------
# Identity Documents
#-------------------------------
from django.db import models

class AgentKYC(models.Model):

    agent = models.OneToOneField(
        "UpdateAgent",
        on_delete=models.CASCADE,
        related_name="kyc_details"
    )

    # 🔹 Identity
    pan_number = models.CharField(max_length=20)
    aadhaar_number = models.CharField(max_length=20)

    # 🔹 Bank Details
    bank_name = models.CharField(max_length=100)
    ifsc_code = models.CharField(max_length=20)
    account_number = models.CharField(max_length=30)

    # 🔹 KYC Documents Upload
    document = models.FileField(upload_to='kyc_documents/')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"KYC - {self.agent.full_name}"
#---------------------------
# Address
#----------------------------
from django.db import models

class Address(models.Model):

    agent = models.OneToOneField(
        "UpdateAgent",
        on_delete=models.CASCADE,
        related_name="address"
    )

    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agent.full_name} - {self.city}"
#--------------------------
# Setting
#---------------------------
from django.db import models


class Setting(models.Model):

    TENANT_CHOICES = [
        ('mumbai', 'Tenant — Mumbai'),
        ('delhi', 'Tenant — Delhi'),
        ('bangalore', 'Tenant — Bangalore'),
        ('hyderabad', 'Tenant — Hyderabad'),
    ]
    ACTION_CHOICES = [
        ('previous','Previous'),
        ('save','save'),
    ]

    # 🔹 Tenant Selection
    tenant = models.CharField(max_length=20, choices=TENANT_CHOICES, default='mumbai')

    # 🔹 Account Settings (Checkbox Fields)
    email_notifications = models.BooleanField(
        default=False,
        help_text="Receive payout & performance alerts via email"
    )

    sms_notifications = models.BooleanField(
        default=False,
        help_text="Receive SMS for lead updates"
    )

    auto_payout = models.BooleanField(
        default=False,
        help_text="Automatically process payouts on milestone completion"
    )

    performance_report_access = models.BooleanField(
        default=False,
        help_text="Allow agent to view their own performance reports"
    )
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        default="save"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Setting - {self.get_tenant_display()}"