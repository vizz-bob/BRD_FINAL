#-------------------------
# Dashboard
#-------------------------
from django.db import models
class Dashboard(models.Model):
    total_templates = models.IntegerField(default=0)
    active = models.IntegerField(default=0)
    draft = models.IntegerField(default=0)
    agents_covered = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return " Dashboard"
#---------------------
# New Template
#----------------------
from django.db import models


class NewTemplate(models.Model):

    AGENT_TYPE_CHOICES = [
        ('DSA', 'DSA'),
        ('BROKER', 'Broker'),
        ('LEAD_PARTNER', 'Lead Partner'),
    ]

    REVIEW_CYCLE_CHOICES = [
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('HALF_YEARLY', 'Half Yearly'),
        ('ANNUAL', 'Annual'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('DRAFT', 'Draft'),
    ]

    template_name = models.CharField(max_length=255)
    agent_type = models.CharField(max_length=20, choices=AGENT_TYPE_CHOICES)
    review_cycle = models.CharField(max_length=20, choices=REVIEW_CYCLE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DRAFT')

    # Tiers
    bronze_min = models.IntegerField(default=0)
    bronze_max = models.IntegerField(default=49)
    bronze_bonus = models.IntegerField(default=0)

    silver_min = models.IntegerField(default=50)
    silver_max = models.IntegerField(default=74)
    silver_bonus = models.IntegerField(default=2000)

    gold_min = models.IntegerField(default=75)
    gold_max = models.IntegerField(default=89)
    gold_bonus = models.IntegerField(default=5000)

    platinum_min = models.IntegerField(default=90)
    platinum_max = models.IntegerField(default=100)
    platinum_bonus = models.IntegerField(default=10000)

    # Checkboxes
    cancel = models.BooleanField(default=False)
    create_template = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.template_name


class PerformanceMetric(models.Model):
    template = models.ForeignKey(NewTemplate, on_delete=models.CASCADE, related_name="metrics")
    metric_name = models.CharField(max_length=100)
    weight = models.IntegerField()
    target = models.IntegerField()
    unit = models.CharField(
    max_length=50,
    default="",      # 👈 IMPORTANT (existing data ke liye)
    blank=True
    )

    def __str__(self):
        return self.metric_name