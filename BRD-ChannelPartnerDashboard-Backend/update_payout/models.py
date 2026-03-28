#--------------------------
# Dashboard
#--------------------------
from django.db import models
class Payout_Dashboard(models.Model):
    active_payouts= models.IntegerField(default=0)
    Avg_rate = models.IntegerField(default=0)
    max_pool= models.IntegerField(default=0)
    payout_modes= models.IntegerField(default=0)
    date = models.DateField()  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return " Payout_Dashboard"
#-----------------------
# Search
#-----------------------
from django.db import models

class Payout_Search(models.Model):

    TYPE_CHOICES = [
        ("dsa", "DSA"),
        ("broker", "Broker"),
        ("lead_partner", "Lead Partner"),
    ]

    search = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.search}"
#------------------------------
# payout updated
#-----------------------------
from django.db import models

class Payout_Agent(models.Model):

    TYPE_CHOICES = [
        ("dsa", "DSA"),
        ("broker", "Broker"),
        ("lead_partner", "Lead Partner"),
    ]
    MODE_CHOICES=[
        ("bank_transfer","Bank Transfer"),
        ("upi","UPI"),
        ("cheque","Cheque"),
        ("neft/rtgs","NEFT/RTGS"),
    ]
    STATUS_CHOICES = [
        ("active", "Active"),
        ("off", "Off"),
    ]

    agent = models.CharField(max_length=150)

    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES
    )

    flat_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    percentage_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Enter percentage value (Example: 2.5)"
    )

    min_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    max_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    cycle_day = models.IntegerField(help_text="Payout cycle day (Example: 5, 10, 15)")

    mode = models.CharField(
        max_length=20,
        choices=MODE_CHOICES,
        default="bank_transfer"
    )

    bonus = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="active"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    action_edit = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.agent} - {self.type}"