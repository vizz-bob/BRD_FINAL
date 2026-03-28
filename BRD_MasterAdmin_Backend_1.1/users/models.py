from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "MASTER_ADMIN")
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("MASTER_ADMIN", "Master Admin"),
        ("SUPER_ADMIN", "Super Admin"),
        ("ADMIN", "Admin"),
        ("LOAN_OFFICER", "Loan Officer"),
        ("UNDERWRITER", "Underwriter"),
        ("FINANCE_STAFF", "Finance Staff"),
        ("SALES_EXECUTIVE", "Sales Executive"),
        ("BORROWER", "Borrower"),
    ]

    is_2fa_enabled = models.BooleanField(default=False)
    two_fa_secret = models.CharField(max_length=16, blank=True, null=True)

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    
    # ✅ New Fields Added for Signup
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)

    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default="BORROWER")
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, null=True, blank=True)
    branch = models.ForeignKey('tenants.Branch', on_delete=models.SET_NULL, null=True, blank=True)

    employee_id = models.CharField(max_length=50, blank=True)
    approval_limit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.email

class AuditLog(models.Model):
    ACTION_TYPES = [
        ("LOGIN", "Login"),
        ("CREATE", "Create"),
        ("UPDATE", "Update"),
        ("DELETE", "Delete"),
        ("APPROVE", "Approve"),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.SET_NULL, null=True, blank=True)

    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    module = models.CharField(max_length=50)
    description = models.TextField()
    ip_address = models.GenericIPAddressField()

    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "audit_logs"

    def __str__(self):
        return f"{self.user} - {self.action_type}"

class UserProfile(models.Model):
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name="profile")
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.SET_NULL, null=True, blank=True)

    role = models.CharField(
        max_length=50,
        choices=[
            ("ADMIN", "Admin"),
            ("UNDERWRITER", "Underwriter"),
            ("COLLECTION", "Collection Officer"),
            ("LENDER", "Lender Agent"),
            ("CUSTOMER", "Customer"),
        ],
        default="CUSTOMER",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.role}"
    
class LoginActivity(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    successful = models.BooleanField(default=True)  # track failed logins too

    class Meta:
        db_table = "login_activity"
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.user.email} - {self.timestamp} - {'Success' if self.successful else 'Failed'}"