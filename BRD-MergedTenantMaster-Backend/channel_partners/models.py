import uuid
from django.db import models
from django.conf import settings


class ChannelPartner(models.Model):

    ROLE_TYPE_CHOICES = (
        ('INDIVIDUAL', 'Individual'),
        ('COMPANY', 'Company'),
    )

    PARTNER_TYPE_CHOICES = (
        ('DSA', 'DSA'),
        ('AGENT', 'Agent'),
        ('BROKER', 'Broker'),
    )

    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # --------------------
    # Partner Details
    # --------------------
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)

    # --------------------
    # Business Information
    # --------------------
    role_type = models.CharField(max_length=20, choices=ROLE_TYPE_CHOICES)
    partner_type = models.CharField(max_length=20, choices=PARTNER_TYPE_CHOICES)

    company_name = models.CharField(max_length=200, blank=True, null=True)
    gstin = models.CharField(max_length=20, blank=True, null=True)
    pan_number = models.CharField(max_length=20)

    # --------------------
    # Location
    # --------------------
    address_line_1 = models.TextField()
    address_line_2 = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    # --------------------
    # Status & Verification
    # --------------------
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )
    document_verification_completed = models.BooleanField(default=False)

    # --------------------
    # Audit
    # --------------------
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "channel_partners"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.partner_type})"
