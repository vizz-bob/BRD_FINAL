import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.core.validators import FileExtensionValidator

# ============================================
# HELPER FUNCTION
# ============================================
def generate_application_number():
    return str(uuid.uuid4())


# ============================================
# LOAN APPLICATION
# ============================================
class LoanApplication(models.Model):

    # -------------------------
    # CHOICES
    # -------------------------
    INCOME_TYPE_CHOICES = (
        ("SALARIED", "Salaried"),
        ("SELF_EMPLOYED", "Self Employed"),
    )

    GENDER_CHOICES = (
        ("MALE", "Male"),
        ("FEMALE", "Female"),
    )

    EMPLOYMENT_TYPE_CHOICES = (
        ("PRIVATE", "Private"),
        ("GOVERNMENT", "Government"),
        ("BUSINESS", "Business"),
        ("OTHER", "Other"),
    )

    ACCOUNT_TYPE_CHOICES = (
        ("SAVINGS", "Savings"),
        ("CURRENT", "Current"),
    )

    # -------------------------
    # IDENTIFIERS
    # -------------------------
    application_id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    application_number = models.CharField(
        max_length=50,
        unique=True,
        default=generate_application_number,
        editable=False
    )

    # -------------------------
    # PERSONAL DETAILS
    # -------------------------
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    mobile_no = models.CharField(
        max_length=10,
        validators=[
            RegexValidator(
                regex=r'^[6-9]\d{9}$',
                message="Enter a valid Indian mobile number"
            )
        ]
    )

    email = models.EmailField()

    pan = models.CharField(
        max_length=10,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
                message="Enter valid PAN number"
            )
        ]
    )

    aadhaar_number = models.CharField(
        max_length=12,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\d{12}$',
                message="Enter valid 12 digit Aadhaar number"
            )
        ],
        null=True,
        blank=True
    )

    birth_date = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    # -------------------------
    # ADDRESS DETAILS
    # -------------------------
    res_address_line1 = models.CharField(max_length=255)
    res_address_line2 = models.CharField(max_length=255, blank=True)
    res_city = models.CharField(max_length=100)
    res_state = models.CharField(max_length=100)
    res_pincode = models.CharField(
        max_length=6,
        validators=[
            RegexValidator(
                regex=r'^\d{6}$',
                message="Enter valid 6 digit pincode"
            )
        ]
    )
    res_country = models.CharField(max_length=100, default="India")

    office_address_line1 = models.CharField(max_length=255, blank=True)
    office_city = models.CharField(max_length=100, blank=True)
    office_pincode = models.CharField(max_length=6, blank=True)

    # -------------------------
    # LOAN DETAILS
    # -------------------------
    requested_amount = models.DecimalField(max_digits=12, decimal_places=2)
    requested_tenure = models.PositiveIntegerField(help_text="Tenure in months")
    net_monthly_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    income_type = models.CharField(max_length=20, choices=INCOME_TYPE_CHOICES)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)

    employer_name = models.CharField(max_length=255, blank=True)
    business_name = models.CharField(max_length=255, blank=True)

    # -------------------------
    # BANK DETAILS
    # -------------------------
    account_number = models.CharField(max_length=20)

    ifsc_code = models.CharField(
        max_length=11,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{4}0[A-Z0-9]{6}$',
                message="Enter valid IFSC code"
            )
        ]
    )

    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES)

    # -------------------------
    # DOCUMENTS (KYC)
    # -------------------------
    pan_card = models.FileField(upload_to='kyc/')
    address_proof = models.FileField(upload_to='kyc/')
    bank_statement = models.FileField(upload_to='kyc/')
    salary_slip = models.FileField(upload_to='kyc/', blank=True, null=True)
    self_declaration_video = models.FileField(
            upload_to="kyc/",
            validators=[FileExtensionValidator(allowed_extensions=["mp4", "mov", "avi"])],
            null=True,
            blank=True
)


    # -------------------------
    # SYSTEM INFO
    # -------------------------
    remarks = models.TextField(null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "loan_applications"
        ordering = ['-created_at']

    # -------------------------
    # VALIDATION LOGIC
    # -------------------------
    def clean(self):
        if self.income_type == 'SALARIED' and not self.employer_name:
            raise ValidationError("Employer name is required for salaried applicants.")

        if self.income_type == 'SELF_EMPLOYED' and not self.business_name:
            raise ValidationError("Business name is required for self-employed applicants.")

    def __str__(self):
        return f"{self.application_number} - {self.first_name} {self.last_name}"


# ============================================
# PROPERTY DETAIL
# ============================================
class PropertyDetail(models.Model):

    PROPERTY_TYPE_CHOICES = [
        ('HOUSE', 'House'),
        ('FLAT', 'Flat / Apartment'),
        ('PLOT', 'Plot / Land'),
        ('VILLA', 'Villa'),
        ('COMMERCIAL', 'Commercial Property'),
    ]

    loan_application = models.OneToOneField(
        LoanApplication,
        on_delete=models.CASCADE,
        related_name='property_detail'
    )

    property_type = models.CharField(max_length=30, choices=PROPERTY_TYPE_CHOICES)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "property_details"

    def __str__(self):
        return f"{self.loan_application.application_number} - {self.property_type}"


# ============================================
# CREDIT ASSESSMENT
# ============================================
class CreditAssessment(models.Model):

    DECISION_CHOICES = (
        ("SYSTEM_APPROVED", "System Approved"),
        ("SYSTEM_REJECTED", "System Rejected"),
        ("MANUAL_APPROVED", "Manual Approved"),
        ("MANUAL_REJECTED", "Manual Rejected"),
    )

    application = models.OneToOneField(
        LoanApplication,
        on_delete=models.CASCADE,
        related_name="credit_assessment"
    )

    status = models.CharField(max_length=30, choices=DECISION_CHOICES)
    remarks = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "credit_assessments"

    def __str__(self):
        return f"{self.application.application_number} - {self.status}"


# ============================================
# MORTGAGE UNDERWRITING
# ============================================
class MortgageUnderwriting(models.Model):

    loan_application = models.OneToOneField(
        LoanApplication,
        on_delete=models.CASCADE,
        related_name='mortgage_underwriting'
    )

    property_market_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    ltv_on_property = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    final_eligible_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    approved_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "mortgage_underwriting"

    def __str__(self):
        return f"Mortgage UW - {self.loan_application.application_number}"
