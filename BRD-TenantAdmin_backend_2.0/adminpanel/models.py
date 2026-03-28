import uuid
from django.db import models
from django.conf import settings


# ---------------------------
# 1. Charge Master
# ---------------------------
class ChargeMaster(models.Model):
    CHARGE_TYPES = (
        ('processing', 'Processing Fee'),
        ('penalty', 'Penalty'),
        ('other', 'Other Charges'),
    )

    name = models.CharField(max_length=200)
    charge_type = models.CharField(max_length=20, choices=CHARGE_TYPES)
    is_percentage = models.BooleanField(default=False)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "admin_charge_master"

    def __str__(self):
        return f"{self.name} ({self.charge_type})"


# ---------------------------
# 2. Document Types
# ---------------------------
class DocumentType(models.Model):
    CATEGORY_TYPES = (
        ('kyc', 'KYC Document'),
        ('income', 'Income Document'),
        ('other', 'Other'),
    )

    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_TYPES, default='other')
    description = models.TextField(blank=True, null=True)
    is_required = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "admin_document_types"

    def __str__(self):
        return self.name


# ---------------------------
# 3. Loan Products
# ---------------------------
class LoanProduct(models.Model):

    name = models.CharField(max_length=200)

    # Free-text — master backend is source of truth for loan type names
    loan_type = models.CharField(max_length=200)

    description = models.TextField(blank=True, null=True)

    min_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Optional — interest managed separately via InterestConfigForm
    interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2,
        blank=True, null=True, default=0
    )

    processing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    min_tenure_months = models.IntegerField(default=1)
    max_tenure_months = models.IntegerField(default=60)

    # ✅ ADDED: required for the active/inactive toggle in Loans.jsx
    is_active = models.BooleanField(default=True)

    charges = models.ManyToManyField(ChargeMaster, blank=True)
    required_documents = models.ManyToManyField(DocumentType, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "admin_loan_products"

    def __str__(self):
        return self.name


# ---------------------------
# 4. Notification Templates
# ---------------------------
class NotificationTemplate(models.Model):
    TEMPLATE_TYPES = (
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('system', 'System Notification'),
    )

    name = models.CharField(max_length=200)
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPES)
    subject = models.CharField(max_length=300, blank=True, null=True)
    body = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "admin_notification_templates"

    def __str__(self):
        return f"{self.name} ({self.template_type})"


# ---------------------------
# 5. Role Master
# ---------------------------
class RoleMaster(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)
    permissions = models.JSONField(default=dict, blank=True)

    parent_role = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='sub_roles'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "admin_role_master"

    def __str__(self):
        return self.name


# ---------------------------
# 6. Subscription
# ---------------------------
class Subscription(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    subscription_name = models.CharField(max_length=255)
    subscription_amount = models.DecimalField(max_digits=10, decimal_places=2)
    no_of_borrowers = models.IntegerField()

    TYPE_CHOICES = (
        ('Monthly', 'Monthly'),
        ('Quarterly', 'Quarterly'),
        ('Yearly', 'Yearly'),
    )
    type_of = models.CharField(max_length=20, choices=TYPE_CHOICES)

    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Pause', 'Pause'),
        ('Cancel', 'Cancel'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    created_user = models.CharField(max_length=255, blank=True, null=True)
    modified_user = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "admin_subscriptions"

    def __str__(self):
        return self.subscription_name


# ---------------------------
# 7. Coupon
# ---------------------------
class Coupon(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    coupon_code = models.CharField(max_length=100, unique=True)
    coupon_value = models.DecimalField(max_digits=10, decimal_places=2)
    date_from = models.DateField()
    date_to = models.DateField()

    subscriptions = models.ManyToManyField(Subscription, blank=True)

    created_user = models.CharField(max_length=255, blank=True, null=True)
    modified_user = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "admin_coupons"

    def __str__(self):
        return self.coupon_code


# ---------------------------
# 8. Dashboard
# ---------------------------
class Dashboard(models.Model):
    total_tenants = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    total_loans = models.IntegerField(default=0)

    monthly_disbursement = models.JSONField(default=list, blank=True)
    loan_status_distribution = models.JSONField(default=list, blank=True)
    recent_activity = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dashboard {self.created_at}"




# import uuid
# from django.db import models
# from django.conf import settings


# # ---------------------------
# # 1. Charge Master
# # ---------------------------
# class ChargeMaster(models.Model):
#     CHARGE_TYPES = (
#         ('processing', 'Processing Fee'),
#         ('penalty', 'Penalty'),
#         ('other', 'Other Charges'),
#     )

#     name = models.CharField(max_length=200)
#     charge_type = models.CharField(max_length=20, choices=CHARGE_TYPES)
#     is_percentage = models.BooleanField(default=False)
#     value = models.DecimalField(max_digits=10, decimal_places=2)
#     description = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = "admin_charge_master"

#     def __str__(self):
#         return f"{self.name} ({self.charge_type})"


# # ---------------------------
# # 2. Document Types
# # ---------------------------
# class DocumentType(models.Model):
#     CATEGORY_TYPES = (
#         ('kyc', 'KYC Document'),
#         ('income', 'Income Document'),
#         ('other', 'Other'),
#     )

#     name = models.CharField(max_length=150)
#     code = models.CharField(max_length=50, unique=True)
#     category = models.CharField(max_length=20, choices=CATEGORY_TYPES, default='other')
#     description = models.TextField(blank=True, null=True)
#     is_required = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = "admin_document_types"

#     def __str__(self):
#         return self.name


# # ---------------------------
# # 3. Loan Products
# # ---------------------------
# class LoanProduct(models.Model):

#     name = models.CharField(max_length=200)

#     # FIX 1: Removed choices constraint so any loan_type string from the
#     # master backend (e.g. "Home loan", "Gold Loan") is accepted freely.
#     # The master project is the single source of truth for loan type names.
#     loan_type = models.CharField(max_length=200)

#     description = models.TextField(blank=True, null=True)

#     min_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
#     max_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

#     # FIX 2: Made interest_rate optional (blank=True, null=True, default=0)
#     # because Loans.jsx manages interest config separately via InterestConfigForm.
#     # The field is kept so existing data is not lost.
#     interest_rate = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         blank=True,
#         null=True,
#         default=0
#     )

#     processing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

#     min_tenure_months = models.IntegerField(default=1)
#     max_tenure_months = models.IntegerField(default=60)

#     charges = models.ManyToManyField(ChargeMaster, blank=True)
#     required_documents = models.ManyToManyField(DocumentType, blank=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = "admin_loan_products"

#     def __str__(self):
#         return self.name


# # ---------------------------
# # 4. Notification Templates
# # ---------------------------
# class NotificationTemplate(models.Model):
#     TEMPLATE_TYPES = (
#         ('email', 'Email'),
#         ('sms', 'SMS'),
#         ('system', 'System Notification'),
#     )

#     name = models.CharField(max_length=200)
#     template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPES)
#     subject = models.CharField(max_length=300, blank=True, null=True)
#     body = models.TextField()
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = "admin_notification_templates"

#     def __str__(self):
#         return f"{self.name} ({self.template_type})"


# # ---------------------------
# # 5. Role Master
# # ---------------------------
# class RoleMaster(models.Model):
#     name = models.CharField(max_length=150, unique=True)
#     description = models.TextField(blank=True, null=True)
#     permissions = models.JSONField(default=dict, blank=True)

#     parent_role = models.ForeignKey(
#         'self',
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL,
#         related_name='sub_roles'
#     )

#     created_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True
#     )
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = "admin_role_master"

#     def __str__(self):
#         return self.name


# # ---------------------------
# # 6. Subscription
# # ---------------------------
# class Subscription(models.Model):
#     uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

#     subscription_name = models.CharField(max_length=255)
#     subscription_amount = models.DecimalField(max_digits=10, decimal_places=2)
#     no_of_borrowers = models.IntegerField()

#     TYPE_CHOICES = (
#         ('Monthly', 'Monthly'),
#         ('Quarterly', 'Quarterly'),
#         ('Yearly', 'Yearly'),
#     )
#     type_of = models.CharField(max_length=20, choices=TYPE_CHOICES)

#     STATUS_CHOICES = (
#         ('Active', 'Active'),
#         ('Pause', 'Pause'),
#         ('Cancel', 'Cancel'),
#     )
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

#     created_user = models.CharField(max_length=255, blank=True, null=True)
#     modified_user = models.CharField(max_length=255, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     modified_at = models.DateTimeField(auto_now=True)
#     is_deleted = models.BooleanField(default=False)

#     class Meta:
#         db_table = "admin_subscriptions"

#     def __str__(self):
#         return self.subscription_name


# # ---------------------------
# # 7. Coupon
# # ---------------------------
# class Coupon(models.Model):
#     uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

#     coupon_code = models.CharField(max_length=100, unique=True)
#     coupon_value = models.DecimalField(max_digits=10, decimal_places=2)
#     date_from = models.DateField()
#     date_to = models.DateField()

#     subscriptions = models.ManyToManyField(Subscription, blank=True)

#     created_user = models.CharField(max_length=255, blank=True, null=True)
#     modified_user = models.CharField(max_length=255, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     modified_at = models.DateTimeField(auto_now=True)
#     is_deleted = models.BooleanField(default=False)

#     class Meta:
#         db_table = "admin_coupons"

#     def __str__(self):
#         return self.coupon_code


# # ---------------------------
# # 8. Dashboard
# # ---------------------------
# class Dashboard(models.Model):
#     total_tenants = models.IntegerField(default=0)
#     active_users = models.IntegerField(default=0)
#     total_loans = models.IntegerField(default=0)

#     monthly_disbursement = models.JSONField(default=list, blank=True)
#     loan_status_distribution = models.JSONField(default=list, blank=True)
#     recent_activity = models.JSONField(default=list, blank=True)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"Dashboard {self.created_at}"

