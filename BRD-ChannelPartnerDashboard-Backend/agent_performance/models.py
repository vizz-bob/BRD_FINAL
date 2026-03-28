#--------------------------
# New Agent 
#-------------------------
from django.db import models
class New_agent(models.Model):
    AGENT_TYPE_CHOICES = [
        ('DSA', 'DSA'),
        ('Broker', 'Broker'),
        ('Lead Partner', 'Lead Partner'),
    ]
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    full_name = models.CharField(max_length=150)
    agent_type = models.CharField(max_length=20, choices=AGENT_TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    total_leads = models.PositiveIntegerField(default=0)
    converted = models.PositiveIntegerField(default=0)
    payout = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    score = models.PositiveIntegerField(default=0)  # 0–100
    cancel = models.BooleanField(default=False)
    add_agent = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.full_name
#----------------------------
# Dashboard
#-----------------------------
from django.db import models
class Dashboard(models.Model):
    total_agents = models.IntegerField(default=0)
    active_agents = models.IntegerField(default=0)
    total_payouts = models.IntegerField(default=0)
    lead_generated = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return "Dashboard"
#---------------------------------
# all agent
#---------------------------------
from django.db import models


class All_Agent(models.Model):

    TYPE_CHOICES = [
        ('Lead Partner', 'Lead Partner'),
        ('Broker', 'Broker'),
        ('DSA', 'DSA'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    FILTER_STATUS_CHOICES = [
        ('All', 'All'),
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('DSA', 'DSA'),
        ('Broker', 'Broker'),
        ('Lead Partner', 'Lead Partner'),
    ]
    search = models.CharField(max_length=100, blank=True, null=True)
    all_agent_status = models.CharField(
        max_length=20,
        choices=FILTER_STATUS_CHOICES,
        default='All'
    )
    agent_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    leads = models.PositiveIntegerField(default=0)
    converted = models.PositiveIntegerField(default=0)
    payout = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    score = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    action_edit = models.BooleanField(default=False)
    action_view = models.BooleanField(default=False)
    action_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name} ({self.agent_id})"
#------------------------------
# Edit Agent
#------------------------------
from django.db import models
class Edit_Agent(models.Model):
    AGENT_TYPE_CHOICES = [
        ('DSA', 'DSA'),
        ('Broker', 'Broker'),
        ('Lead Partner', 'Lead Partner'),
    ]
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    full_name = models.CharField(max_length=150)
    agent_type = models.CharField(max_length=20, choices=AGENT_TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    total_leads = models.PositiveIntegerField(default=0)
    converted = models.PositiveIntegerField(default=0)
    payout = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    score = models.PositiveIntegerField(default=0)  # 0–100
    cancel = models.BooleanField(default=False)
    save_changes = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.full_name
#------------------------- 
# View agent
#-------------------------
from django.db import models
class View_Agent(models.Model):
    TYPE_CHOICES = [
        ('DSA', 'DSA'),
        ('Broker', 'Broker'),
        ('Lead Partner', 'Lead Partner'),
    ]
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    agent_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    total_leads = models.PositiveIntegerField(default=0)
    converted = models.PositiveIntegerField(default=0)
    payout = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    performance_score = models.PositiveIntegerField(default=0)  # 0–100
    created_at = models.DateTimeField(auto_now_add=True)
    edit_agent= models.BooleanField(default=False)
    close = models.BooleanField(default=False)
    def conversion_rate(self):
        if self.total_leads > 0:
            return round((self.converted / self.total_leads) * 100, 2)
        return 0
    def performance_remark(self):
        if self.performance_score >= 85:
            return "🟢 Excellent Performance"
        elif self.performance_score >= 60:
            return "🟡 Good Performance"
        else:
            return "🔴 Needs Improvement"

    def save(self, *args, **kwargs):
        if self.total_leads > 0:
            self.performance_score = int(
                (self.converted / self.total_leads) * 100
            )
        else:
            self.performance_score = 0
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.name} ({self.agent_id})"
#-----------------------
# Remove Agent
#------------------------
from django.db import models
class Remove_Agent(models.Model):
    agent_name = models.CharField(max_length=150)
    agent_id = models.CharField(max_length=50)
    reason = models.TextField(blank=True, null=True)
    removed_at = models.DateTimeField(auto_now_add=True)
    yes_remove_agent = models.BooleanField(default=False)
    cancel = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.agent_name} ({self.agent_id})"