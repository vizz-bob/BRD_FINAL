import uuid
from django.db import models
from django.contrib.auth.hashers import make_password
from role.models import Role


class TenantUser(models.Model):
    ROLE_TYPE_CHOICES = (
        ("SUPERVISOR", "Supervisor"),
        ("STAFF", "Staff Member"),
        ("ADMIN", "Tenant Admin"),
        ("LOAN", "Loan Officer"),
        ("COLLECTION", "Collection Agent"),
    )

    ACCOUNT_STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    )

    ACTION = (
        ("TAKEN", "Taken"),
        ("NOT", "Not taken"),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15, unique=True)

    role_type = models.CharField(
        max_length=20, choices=ROLE_TYPE_CHOICES
    )

    role_id = models.ForeignKey(Role,on_delete=models.CASCADE)  # permission group id

    password = models.CharField(max_length=255)

    account_status = models.CharField(
        max_length=20,
        choices=ACCOUNT_STATUS_CHOICES,
        default="ACTIVE"
    )
    action = models.CharField(
        max_length=20,
        choices=ACCOUNT_STATUS_CHOICES,
        default="TAKEN"
    )
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # ensure password is hashed
        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
