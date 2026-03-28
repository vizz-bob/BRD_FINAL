from django.db import models
from tenants.models import Tenant
from crm.models import Customer


DOCUMENT_TYPE_CHOICES = [
    ('PAN', 'PAN'),
    ('AADHAAR', 'Aadhaar'),
    ('BANK_STATEMENT', 'Bank Statement'),
    ('SALARY_SLIP', 'Salary Slip'),
    ('GST_RETURN', 'GST Return'),
    ('OTHERS', 'Others'),
]


class Document(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)

    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES, default='OTHERS')
    uploaded_by = models.CharField(max_length=100, blank=True)
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    purpose = models.CharField(max_length=200, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'documents'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.document_type} - {self.file.name}"
