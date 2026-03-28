from django.db import models


# ================= MIS & REPORTING =================
class MISReport(models.Model):
    REPORT_TYPE_CHOICES = (
        ("auto", "Auto Generated"),
        ("manual", "Normal"),
    )

    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    report_name = models.CharField(max_length=200)
    report_template = models.TextField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.report_name


# ================= SMS & NOTIFICATIONS =================
class NotificationMaster(models.Model):
    NOTIFICATION_TYPE_CHOICES = (
        ("sms", "SMS"),
        ("email", "Email"),
        ("push", "Push Notification"),
    )

    notification_action = models.CharField(max_length=200)
    notification_subject = models.CharField(max_length=200)
    notification_type = models.CharField(
        max_length=20, choices=NOTIFICATION_TYPE_CHOICES
    )
    notification_frequency = models.CharField(max_length=100)
    importance_level = models.CharField(max_length=50)
    notification_group = models.CharField(max_length=100)
    target_audience = models.CharField(max_length=200)
    notification_template = models.TextField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.notification_action
