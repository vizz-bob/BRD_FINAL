#--------------------------
# Dashboard
#--------------------------
from django.db import models
from django.contrib.auth.models import User  
class Dashboard(models.Model):
    total_agents = models.IntegerField(default=0)
    Active_Agents = models.IntegerField(default=0)
    Total_payouts= models.IntegerField(default=0)
    lead_generated= models.IntegerField(default=0)
    payouts_this_month=models.IntegerField(default=0)
    pending_approvals= models.IntegerField(default=0)
    offers_active= models.IntegerField(default=0)
    Avg_Conversion_Rate = models.IntegerField(default=0)
    date = models.DateField()  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return " Dashboard"
#------------------------
# Recent agents
#------------------------
from django.db import models

class RecentAgent(models.Model):

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    agent_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    agent_type = models.CharField(max_length=100)
    payout = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.agent_id})"