from django.db import models
from tenants.models import Tenant

class Client(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=20)
    kyc_status = models.CharField(max_length=50, default="Pending")  # Pending, Verified, Rejected
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "clients"

    def __str__(self):
        return self.full_name
