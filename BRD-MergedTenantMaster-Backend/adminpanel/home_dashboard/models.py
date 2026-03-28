from django.db import models


class DashboardActivity(models.Model):
    """
    Stores recent activities for Home dashboard
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class DashboardAlert(models.Model):
    """
    Stores alert counts (Critical / Warning / Info)
    """
    ALERT_TYPE_CHOICES = (
        ("CRITICAL", "Critical"),
        ("WARNING", "Warning"),
        ("INFO", "Info"),
    )

    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    message = models.CharField(max_length=255)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.alert_type} - {self.message}"
