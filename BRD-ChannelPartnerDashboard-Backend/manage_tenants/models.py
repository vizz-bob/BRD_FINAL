#------------------------
# Dashboard
#------------------------
from django.db import models
class Dashboard(models.Model):
    total_tenants = models.IntegerField(default=0)
    active = models.IntegerField(default=0)
    enterprises = models.IntegerField(default=0)
    total_agents = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return "Dashboard"
#------------------------
# Add Tenant
#-------------------------
from django.db import models


class NewTenant(models.Model):

    REGION_CHOICES = [
        ('WEST', 'West'),
        ('EAST', 'East'),
        ('SOUTH', 'South'),
        ('NORTH', 'North'),
        ('CENTRAL', 'Central'),
    ]

    PLAN_CHOICES = [
        ('STARTER', 'Starter'),
        ('PRO', 'Pro'),
        ('ENTERPRISE', 'Enterprise'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    ]

    # Organisation Details
    organisation_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=20, choices=REGION_CHOICES)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    monthly_volume = models.IntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')

    # Contact Person
    contact_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)

    # Enabled Modules (Checkboxes)
    agent_mgmt = models.BooleanField(default=False)
    payout = models.BooleanField(default=False)
    performance = models.BooleanField(default=False)
    offers = models.BooleanField(default=False)
    kyc = models.BooleanField(default=False)

    # Action Checkboxes
    cancel = models.BooleanField(default=False)
    add_tenant = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.organisation_name
#----------------------------
# Show Tenant
#----------------------------
from django.db import models


class ShowTenant(models.Model):

    PLAN_CHOICES = [
        ('STARTER', 'Starter'),
        ('PRO', 'Pro'),
        ('ENTERPRISE', 'Enterprise'),
        ('ALL', 'All Plans'),
    ]

    REGION_CHOICES = [
        ('EAST', 'East'),
        ('WEST', 'West'),
        ('NORTH', 'North'),
        ('SOUTH', 'South'),
        ('CENTRAL', 'Central'),
        ('ALL', 'All Regions'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    ]
    name = models.CharField(max_length=255)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    region = models.CharField(max_length=20, choices=REGION_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    location = models.CharField(max_length=255)
    agents = models.IntegerField(default=0)
    volume = models.IntegerField(default=0)

    contact_name = models.CharField(max_length=255)
    email = models.EmailField()
    number = models.CharField(max_length=15)

    # Calendar Field
    active_modules = models.TextField(blank=True, null=True)

    edit_tenant = models.BooleanField(default=False)
    delete = models.BooleanField(default=False)
    deactivate = models.BooleanField(default=False)

    joined = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name