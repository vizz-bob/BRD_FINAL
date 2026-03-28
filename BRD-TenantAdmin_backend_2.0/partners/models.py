import uuid
from django.db import models
from django.conf import settings

class ThirdPartyUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="partner_profile"
    )

    THIRD_PARTY_TYPE = (
        ('VALUER', 'Valuer'),
        ('ADVISOR', 'Advisor'),
        ('CONSULTANT', 'Consultant'),
    )

    third_party_type = models.CharField(
        max_length=20,
        choices=THIRD_PARTY_TYPE
    )

    # Identity & Role
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    organization_name = models.CharField(max_length=255)

    # Documents
    pan_number = models.CharField(max_length=10, blank=True, null=True)

    # Contact
    mobile_no = models.CharField(max_length=15)

    # Location
    address_line1 = models.TextField(blank=True)
    address_line2 = models.TextField(blank=True)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    # Status
    is_active = models.BooleanField(default=True)
    verification_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.organization_name} ({self.get_third_party_type_display()})"
