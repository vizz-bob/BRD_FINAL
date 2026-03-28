from django.db import models
from django.contrib.auth.models import User


class Channel(models.Model):

    CHANNEL_TYPES = [
        ('social', 'Social'),
        ('aggregator', 'Aggregator'),
        ('offline', 'Offline'),
        ('referral', 'Referral'),
        ('internal', 'Internal'),
        ('messaging', 'Messaging'),
        ('email', 'Email Campaign'),
        ('telecalling', 'Telecalling'),
    ]
    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Critical", "Critical"),
    ]

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="Medium"
    )
    origin_types = [("aggregator","Aggregator"),("social media","Social Media"),("offline/referal","Offline/Referal")]
    operational_valve = [("telecaller","Telecaller"),("field agent","Field Agent")]
    channel_name = models.CharField(max_length=100, unique=True)
    channel_type = models.CharField(max_length=20, choices=CHANNEL_TYPES)

    source_code = models.CharField(max_length=255, unique=True,null=True, blank=True)

    is_active = models.BooleanField(default=True)
    integration_required = models.BooleanField(default=False)

    api_url = models.URLField(blank=True, null=True)
    api_key = models.CharField(max_length=255, blank=True, null=True)
    Origin_type = models.CharField(max_length=20,choices=origin_types)
    Operational_valve = models.CharField(max_length=20, choices=operational_valve)
    cost_per_lead = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    default_team = models.CharField(max_length=100, blank=True, null=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.channel_name


class ChannelAPILog(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)  # success / failed
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class ChannelAnalytics(models.Model):
    channel = models.OneToOneField(Channel, on_delete=models.CASCADE)
    total_leads = models.IntegerField(default=0)
    total_conversions = models.IntegerField(default=0)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    revenue_generated = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    avg_response_time = models.FloatField(default=0)  # minutes

    @property
    def cpl(self):
        if self.total_leads == 0:
            return 0
        return self.total_cost / self.total_leads

    @property
    def conversion_rate(self):
        if self.total_leads == 0:
            return 0
        return (self.total_conversions / self.total_leads) * 100

    @property
    def roi(self):
        if self.total_cost == 0:
            return 0
        return ((self.revenue_generated - self.total_cost) / self.total_cost) * 100
