from django.db import models

class WeeklySnapshot(models.Model):
    week_number = models.IntegerField()
    year = models.IntegerField()
    total_leads = models.IntegerField(default=0)
    applications = models.IntegerField(default=0)
    disbursed_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "-week_number"]

    def __str__(self):
        return f"Week {self.week_number}, {self.year} Snapshot"

class Report(models.Model):
    title = models.CharField(max_length=255)
    metric_name = models.CharField(max_length=100) # conversion_rate, avg_time, etc.
    value = models.CharField(max_length=100)
    target = models.CharField(max_length=100, blank=True)
    trend = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=50, default='overview') # overview, team, conversion
    chart_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.metric_name})"