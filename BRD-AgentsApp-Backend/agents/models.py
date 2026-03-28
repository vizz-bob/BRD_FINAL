import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class AgentManager(BaseUserManager):
    ROLE_ALIASES = {
        'field_agent': 'field_agent',
        'field agent': 'field_agent',
        'collection_agent': 'collection_agent',
        'collection agent': 'collection_agent',
        'channel_partner': 'channel_partner',
        'channel partner': 'channel_partner',
        'channel partener': 'channel_partner',
        'admin': 'admin',
    }

    def _normalize_role(self, role):
        if not role:
            return 'field_agent'
        normalized = str(role).strip().lower().replace('-', '_')
        return self.ROLE_ALIASES.get(normalized, normalized)

    def create_user(self, email, password=None, role='field_agent', mobile=None):
        if not email:
            raise ValueError("Email is required")

        user = self.model(
            email=self.normalize_email(email),
            role=self._normalize_role(role),
            mobile=mobile
        )
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password, role='admin')
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class Agent(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('field_agent', 'Field Verification Agent'),
        ('collection_agent', 'Collection Agent'),
        ('channel_partner', 'Channel Partner'),
        ('admin', 'Admin'),
        # Legacy values kept for backward compatibility with existing records.
        ('collection agent', 'Collection Agent (Legacy)'),
        ('channel partener', 'Channel Partner (Legacy)'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15, unique=True, null=True, blank=True)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='field_agent')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # Override to avoid reverse accessor clash
    groups = models.ManyToManyField('auth.Group', related_name='agent_users', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='agent_users', blank=True)

    objects = AgentManager()

    def __str__(self):
        return self.email

class Case(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )

    TYPE_CHOICES = (
        ('cpv', 'CPV'),
        ('business', 'Business'),
        ('document', 'Document'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='cases')
    customer_name = models.CharField(max_length=100)
    address = models.TextField()
    pincode = models.CharField(max_length=10)
    distance = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} - {self.customer_name}"


from django.conf import settings
from django.contrib.auth import get_user_model

Agent = get_user_model()
class AgentProfile(models.Model):
    SYNC_STATUS_CHOICES = (
        ('synced', 'Synced'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
    )

    agent = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    agent_code = models.CharField(max_length=30, unique=True, null=True, blank=True)
    name = models.CharField(max_length=100)
    branch = models.CharField(max_length=100, blank=True)
    device_id = models.CharField(max_length=100, blank=True)
    join_date = models.DateField(null=True, blank=True)
    profile_image = models.URLField(blank=True)

    last_synced = models.DateTimeField(null=True, blank=True)
    pending_items = models.PositiveIntegerField(default=0)
    sync_status = models.CharField(max_length=20, choices=SYNC_STATUS_CHOICES, default='synced')

    auto_sync = models.BooleanField(default=True)
    notifications_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class AgentEarnings(models.Model):
    agent = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='earnings'
    )
    this_month = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_month = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.agent.email} earnings"


class AgentAttendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
        ('half_day', 'Half Day'),
    )

    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendance_logs'
    )
    date = models.DateField()
    punch_in = models.TimeField(null=True, blank=True)
    punch_out = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
        unique_together = ('agent', 'date')

    def __str__(self):
        return f"{self.agent.email} - {self.date}"
class PrivacyPolicy(models.Model):
    title = models.CharField(max_length=200, default="Your Privacy Matters")
    introduction = models.TextField()
    important_notice = models.TextField()
    last_updated = models.DateField()

    def __str__(self):
        return "Privacy Policy"
class PrivacyPolicySection(models.Model):
    policy = models.ForeignKey(
        PrivacyPolicy,
        on_delete=models.CASCADE,
        related_name='sections'
    )

    order = models.PositiveIntegerField()  # 1,2,3...
    title = models.CharField(max_length=255)
    information_we_collect = models.TextField(help_text="Section 1: Information we collect")
    how_we_use_information = models.TextField(help_text="Section 2: How we use your information")
    information_sharing = models.TextField(help_text="Section 3: Information sharing")
    data_security = models.TextField(help_text="Section 4: Data security")
    your_rights_and_choices = models.TextField(help_text="Section 5: Your rights and choices")
    data_retention = models.TextField(help_text="Section 6: Data retention")
    cookies_and_tracking = models.TextField(help_text="Section 7: Cookies and tracking")
    third_party_services = models.TextField(help_text="Section 8: Third party services")
    childrens_privacy = models.TextField(help_text="Section 9: Children's privacy")
    changes_to_policy = models.TextField(help_text="Section 10: Changes to privacy policy")
    contact_us = models.TextField(help_text="Contact information for privacy inquiries")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}. {self.title}"
class PrivacyQuickSummary(models.Model):
    policy = models.ForeignKey(
        PrivacyPolicy,
        on_delete=models.CASCADE,
        related_name='quick_summary'
    )

    point = models.CharField(max_length=255)

    def __str__(self):
        return self.point

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.question
class SupportContact(models.Model):
    phone_number = models.CharField(max_length=15)
    whatsapp_number = models.CharField(max_length=15)
    support_email = models.EmailField()

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Support Contact"
class SupportTicket(models.Model):

    ISSUE_CHOICES = (
        ('emi / payment issue', 'EMI / PAYMENT ISSUE'),
        ('mandate issue', 'Mandate Issue'),
        ('document issue', 'Document Issue'),
        ('kyc issue', 'KYC Issue'),
        ('app / technical issue','App/Technical Issue'),
        ('other', 'Other'),
    )

    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )

    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='Agents_support_tickets'
    )

    issue_category = models.CharField(max_length=50, choices=ISSUE_CHOICES)
    issue_description = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agent.email} - {self.issue_category}"


class FieldVerification(models.Model):

    OWNERSHIP_CHOICES = (
        ('owned', 'Owned'),
        ('rented', 'Rented'),
        ('leased', 'Leased'),
        ('family_owned', 'Family Owned'),
    )

    RESIDENCE_CHOICES = (
        ('independent_house', 'Independent House'),
        ('apartment', 'Apartment'),
        ('villa', 'Villa'),
        ('chawl', 'Chawl'),
    )

    case = models.OneToOneField(
        Case,
        on_delete=models.CASCADE,
        related_name='verification'
    )

    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='field_verifications'
    )

    # GPS
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    distance_from_location = models.FloatField(default=0)

   
    applicant_met = models.BooleanField(default=False)

    neighbor_name = models.CharField(max_length=100)
    neighbor_contact = models.CharField(max_length=15, blank=True, null=True)
    comments = models.TextField(blank=True, null=True)

    house_ownership = models.CharField(max_length=50)
    residence_type = models.CharField(max_length=50)

    television = models.BooleanField(default=False)
    refrigerator = models.BooleanField(default=False)
    washing_machine = models.BooleanField(default=False)
    air_conditioner = models.BooleanField(default=False)
    two_wheeler = models.BooleanField(default=False)
    four_wheeler = models.BooleanField(default=False)

    address_confirmed = models.BooleanField(default=False)
    negative_profile = models.BooleanField(default=False)

class FieldVerificationPhoto(models.Model):
    verification = models.ForeignKey(
        FieldVerification,
        on_delete=models.CASCADE,
        related_name='photos'
    )

    image = models.ImageField(upload_to='field_verification_photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


# class CollectionProfile(models.Model):
#     agent = models.OneToOneField(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name='collection_profile'
#     )
#     full_name = models.CharField(max_length=100)
#     employee_id = models.CharField(max_length=50)
#     branch = models.CharField(max_length=100)
#     city = models.CharField(max_length=50)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.full_name} - Collection"
# class Account(models.Model):
#     STATUS_CHOICES = (
#         ('active', 'Active'),
#         ('overdue', 'Overdue'),
#         ('closed', 'Closed'),
#     )

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

#     collection_agent = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name='accounts'
#     )

#     customer_name = models.CharField(max_length=100)
#     loan_number = models.CharField(max_length=50)
#     total_amount = models.DecimalField(max_digits=10, decimal_places=2)
#     due_amount = models.DecimalField(max_digits=10, decimal_places=2)

#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES,
#         default='active'
#     )

#     due_date = models.DateField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.loan_number
# class Recovery(models.Model):
#     PAYMENT_MODE = (
#        ('cash', 'Cash'),
#         ('upi', 'UPI'),
#         ('cheque', 'Cheque'),
#         ('neft', 'NEFT'),
#         ('rtgs', 'RTGS'),
#     )

#     account = models.ForeignKey(
#         Account,
#         on_delete=models.CASCADE,
#         related_name='recoveries'
#     )

#     agent = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name='recoveries'
#     )

#     amount_collected = models.DecimalField(max_digits=10, decimal_places=2)
#     payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE)
#     transaction_reference = models.CharField(max_length=100, blank=True)
#     cheque_number = models.CharField(max_length=50, blank=True)
#     remarks = models.TextField(blank=True)

#     latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
#     longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
#     receipt_photo = models.ImageField(upload_to='recovery_receipts/', null=True, blank=True)
#     collected_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.account.loan_number} - {self.amount_collected}"
# class FollowUp(models.Model):

#     FOLLOWUP_TYPE = (
#         ('field_visit', 'Field Visit'),
#         ('phone_call', 'Phone Call'),
#         ('promise_to_pay', 'Promise To Pay'),
#     )

#     account = models.ForeignKey(
#         Account,
#         on_delete=models.CASCADE,
#         related_name='followups'
#     )

#     agent = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name='followups'
#     )

#     followup_type = models.CharField(max_length=30, choices=FOLLOWUP_TYPE)

#     notes = models.TextField()

#     promise_date = models.DateField(null=True, blank=True)

#     latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
#     longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.account.loan_number} - {self.followup_type}"
# class RecoveryHub(models.Model):

#     VEHICLE_CONDITION = (
#         ('excellent', 'Excellent'),
#         ('good', 'Good'),
#         ('fair', 'Fair'),
#         ('poor', 'Poor'),
#     )

#     FUEL_LEVEL = (
#         ('empty', 'Empty'),
#         ('quarter', 'Quarter'),
#         ('half', 'Half'),
#         ('three_quarter', 'Three Quarter'),
#         ('full', 'Full'),
#     )

#     account = models.OneToOneField(
#         Account,
#         on_delete=models.CASCADE,
#         related_name='recovery_hub'
#     )

#     agent = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE
#     )

#     vehicle_number = models.CharField(max_length=50)
#     vehicle_model = models.CharField(max_length=100)

#     odometer_reading = models.IntegerField()

#     fuel_level = models.CharField(max_length=20, choices=FUEL_LEVEL)

#     vehicle_condition = models.CharField(max_length=20, choices=VEHICLE_CONDITION)
#     tyre_condition = models.CharField(max_length=20, choices=VEHICLE_CONDITION)

#     spare_tyre = models.BooleanField(default=False)
#     jack = models.BooleanField(default=False)
#     toolkit = models.BooleanField(default=False)
#     floor_mats = models.BooleanField(default=False)
#     music_system = models.BooleanField(default=False)

#     rc_available = models.BooleanField(default=False)
#     insurance_available = models.BooleanField(default=False)
#     pollution_available = models.BooleanField(default=False)
#     servicebook_available = models.BooleanField(default=False)

#     damages = models.TextField(blank=True)
#     additional_notes = models.TextField(blank=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.vehicle_number
# class RecoveryHubPhoto(models.Model):
#     recovery_hub = models.ForeignKey(
#         RecoveryHub,
#         on_delete=models.CASCADE,
#         related_name='photos'
#     )

#     image = models.ImageField(upload_to='recovery_hub_photos/')
#     uploaded_at = models.DateTimeField(auto_now_add=True)
