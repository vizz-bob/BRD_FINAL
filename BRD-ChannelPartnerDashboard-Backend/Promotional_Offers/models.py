#---------------------------
# New Offer Details
#---------------------------
from django.db import models


class New_Offer_Details(models.Model):

    OFFER_TYPE_CHOICES = [
        ('BONUS', 'Bonus'),
        ('FLAT_BONUS', 'Flat Bonus'),
        ('RATE_HIKE', 'Rate Hike'),
        ('CASHBACK', 'Cashback'),
        ('FREE_MONTH', 'Free Month'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('SCHEDULED', 'Scheduled'),
        ('PAUSED', 'Paused'),
    ]

    offer_title = models.CharField(max_length=200)

    offer_type = models.CharField(
        max_length=20,
        choices=OFFER_TYPE_CHOICES
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )

    max_usage_limit = models.PositiveIntegerField(null=True, blank=True)

    start_date = models.DateField()
    end_date = models.DateField()

    bonus_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    rate_discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    trigger_condition = models.CharField(max_length=255, null=True, blank=True)

    offer_tag = models.CharField(max_length=100, null=True, blank=True)

    description = models.TextField(null=True, blank=True)

    cancel = models.BooleanField(default=False)
    next_step = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.offer_title
#-----------------------
# New Target
#------------------------
from django.db import models


class New_Targetting(models.Model):

    AGENT_TYPE_CHOICES = [
        ('DSA', 'DSA'),
        ('BROKER', 'Broker'),
        ('LEAD_PARTNER', 'Lead Partner'),
    ]

    TENANT_CHOICES = [
        ('ALL', 'All'),
        ('MUMBAI', 'Mumbai'),
        ('DELHI', 'Delhi'),
        ('BANGALORE', 'Bangalore'),
        ('HYDERABAD', 'Hyderabad'),
        ('CHENNAI', 'Chennai'),
        ('PUNE', 'Pune'),
    ]

    COLOR_CHOICES = [
        ('YELLOW', 'Yellow'),
        ('GREEN', 'Green'),
        ('PINK', 'Pink'),
        ('BLUE', 'Blue'),
        ('PURPLE', 'Purple'),
        ('RED', 'Red'),
        ('NAVY_BLUE', 'Navy Blue'),
        ('AQUA', 'Aqua'),
    ]

    target_agent_type = models.CharField(
        max_length=20,
        choices=AGENT_TYPE_CHOICES
    )

    target_tenants = models.CharField(
        max_length=20,
        choices=TENANT_CHOICES,
        default='ALL'
    )

    accent_color = models.CharField(
        max_length=20,
        choices=COLOR_CHOICES
    )

    cancel = models.BooleanField(default=False)
    next_step = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.target_agent_type} - {self.target_tenants}"
#-----------------------
# dashboard
#-----------------------
from django.db import models
class Dashboard(models.Model):
    total_offers = models.IntegerField(default=0)
    scheduled = models.IntegerField(default=0)
    active_now= models.IntegerField(default=0)
    total_redemptions= models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return " Dashboard"
