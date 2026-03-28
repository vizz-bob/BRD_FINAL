from django.db import models
from tenants.models import Tenant


REPORT_TYPE_CHOICES = [
    ('RISK', 'Risk Report'),
    ('PORTFOLIO', 'Portfolio Report'),
    ('COLLECTION', 'Collection Report'),
    ('BORROWER', 'Borrower Summary'),
]


class Report(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    report_type = models.CharField(max_length=30, choices=REPORT_TYPE_CHOICES)
    filters_json = models.JSONField(default=dict, blank=True)  # to store dynamic filters
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reports'
        ordering = ['-generated_at']

    def __str__(self):
        return self.name


class Analytics(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)
    metric = models.CharField(max_length=200)
    value = models.DecimalField(max_digits=18, decimal_places=2)
    as_of_date = models.DateField()

    class Meta:
        db_table = 'analytics'
        ordering = ['-as_of_date']

    def __str__(self):
        return f"{self.metric} - {self.as_of_date}"
