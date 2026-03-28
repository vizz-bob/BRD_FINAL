from django.db import models
from django.contrib.auth.models import Group
from auth_service.accounts.models import User
from adminpanel.access_control.models import Role
import uuid


class AdminUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="admin_profile"
    )

    phone_number = models.CharField(max_length=15, null=True, blank=True)

    # RBAC (Role = Django Group)
    # role = models.ForeignKey(
    #     Group,
    #     on_delete=models.PROTECT,
    #     related_name="admin_users",
    #     null=True,
    #     blank=True
    # )

    role = models.ForeignKey(
        Role,                     # ✅ YOUR Role model
        on_delete=models.PROTECT,
        related_name="admin_users",
        null=True,
        blank=True
    )


    employee_id = models.CharField(max_length=50, null=True, blank=True)
    approval_limit = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Admin User"
        verbose_name_plural = "Admin Users"

    def __str__(self):
        return self.user.email
