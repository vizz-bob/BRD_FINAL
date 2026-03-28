from django.db import models
from django.conf import settings
from collectionagent.accounts.models import CollectionAccount


# Today's collection summary
class DailyCollection(models.Model):
    date = models.DateField(auto_now_add=True)
    target_amount = models.FloatField()
    collected_amount = models.FloatField()

    def progress_percentage(self):
        if self.target_amount == 0:
            return 0
        return (self.collected_amount / self.target_amount) * 100

# Quick stats
class AgentStats(models.Model):
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    calls_made = models.IntegerField(default=0)
    field_visits = models.IntegerField(default=0)
    active_ptp = models.IntegerField(default=0)
    success_rate = models.FloatField(default=0)

class AgentDailyStats(models.Model):
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    calls_made = models.IntegerField(default=0)
    field_visits = models.IntegerField(default=0)
    active_ptps = models.IntegerField(default=0)
    success_rate = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.agent.username} - {self.date}"

# Bucket overview
class BucketSummary(models.Model):
    BUCKETS = [
        ('SMA-0', 'SMA-0'),
        ('SMA-1', 'SMA-1'),
        ('SMA-2', 'SMA-2'),
        ('NPA', 'NPA'),
    ]

    bucket = models.CharField(max_length=10, choices=BUCKETS)
    total_accounts = models.IntegerField()
    total_amount = models.FloatField()

# PTP Model
class PTP(models.Model):
    account = models.ForeignKey(CollectionAccount, on_delete=models.CASCADE)
    due_date = models.DateField()
    amount = models.FloatField()

    STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    status = models.CharField(max_length=10, choices=STATUS, default='pending')

# Activity logs
class Activity(models.Model):
    TYPE = [
        ('payment', 'Payment'),
        ('ptp', 'PTP'),
        ('call', 'Call'),
    ]

    type = models.CharField(max_length=10, choices=TYPE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# Notifications
class Notification(models.Model):
    TYPE_CHOICES = [
        ('case', 'Case'),
        ('system', 'System'),
        ('info', 'Info'),
        ('urgent', 'Urgent'),
        ('success', 'Success'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, null=True, blank=True)
    message = models.TextField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def time_ago(self):
        from django.utils.timezone import now
        diff = now() - self.created_at

        if diff.seconds < 60:
            return "Just now"
        elif diff.seconds < 3600:
            return f"{diff.seconds // 60} minutes ago"
        elif diff.seconds < 86400:
            return f"{diff.seconds // 3600} hours ago"
        else:
            return f"{diff.days} days ago"

class CallLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class FieldVisit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    visit_date = models.DateField()

class DashboardCollection(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.FloatField()
    is_success = models.BooleanField(default=False)
    date = models.DateField()

class RecoveryHistory(models.Model):
    name = models.CharField(max_length=100)
    amount_collected = models.IntegerField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class SomeModel(models.Model):
    # Use string reference to avoid circular import
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)