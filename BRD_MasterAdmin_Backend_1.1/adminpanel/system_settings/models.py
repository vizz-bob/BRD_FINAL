from django.db import models
import uuid

STATUS_CHOICES = (
    ("ACTIVE", "Active"),
    ("INACTIVE", "Inactive"),
)

class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ACTIVE")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


# 1. Language Management
class Language(BaseModel):
    language_name = models.CharField(max_length=50)
    language_code = models.CharField(max_length=10, unique=True)
    is_default = models.BooleanField(default=False)


# 2. Geo Location
class GeoLocation(BaseModel):
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100, blank=True, null=True)


# 3. Login Authentication
class LoginAuthentication(BaseModel):
    authentication_type = models.CharField(max_length=50)  # OTP, Password, Biometric
    device_restriction = models.BooleanField(default=False)
    multi_factor_enabled = models.BooleanField(default=False)


# 4. Co-Applicant
class CoApplicant(BaseModel):
    co_applicant_type = models.CharField(max_length=50)
    relationship = models.CharField(max_length=50)


# 5. Login Fees
class LoginFee(BaseModel):
    fee_type = models.CharField(max_length=50)  # One-time / Recurring
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    linked_product = models.CharField(max_length=100, blank=True, null=True)


# 6. Joint Applicant
class JointApplicant(BaseModel):
    joint_applicant_type = models.CharField(max_length=50)
    approval_workflow = models.CharField(max_length=100)


# 7. References
class Reference(BaseModel):
    reference_type = models.CharField(max_length=50)
    reference_role = models.CharField(max_length=50)


# 8. Verification
class Verification(BaseModel):
    verification_type = models.CharField(max_length=50)  # Tele / CPM
    outcome = models.CharField(max_length=50)
    verified_by = models.CharField(max_length=100)


# 9. Application Process
class ApplicationProcess(BaseModel):
    action_type = models.CharField(max_length=50)  # Submit, Approve
    processing_mode = models.CharField(max_length=50)  # Manual, Auto
    application_mode = models.CharField(max_length=50)  # Online, Offline
    re_application_allowed = models.BooleanField(default=False)


# 10. Score Card Rating
class ScoreCardRating(BaseModel):
    rating_type = models.CharField(max_length=100)  # Reference, Credit History
    score_range = models.CharField(max_length=50)
