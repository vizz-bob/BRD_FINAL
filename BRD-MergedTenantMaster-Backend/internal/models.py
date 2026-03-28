from django.db import models
from django.conf import settings


# ----------------------------
# Dashboard (Cards you see)
# ----------------------------
class InternalDashboard(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "internal_dashboard"

    def __str__(self):
        return self.name


# ----------------------------
# Permission (View, Edit etc.)
# ----------------------------
class InternalPermission(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    dashboard = models.ForeignKey(
        InternalDashboard,
        on_delete=models.CASCADE,
        related_name="permissions"
    )

    class Meta:
        db_table = "internal_permission"

    def __str__(self):
        return f"{self.dashboard.name} - {self.name}"


# ----------------------------
# Role
# ----------------------------
class InternalRole(models.Model):
    name = models.CharField(max_length=100)
    dashboards = models.ManyToManyField(
        InternalDashboard,
        blank=True
    )
    permissions = models.ManyToManyField(
        InternalPermission,
        blank=True
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "internal_role"

    def __str__(self):
        return self.name


# ----------------------------
# User Role Mapping
# ----------------------------
class InternalUserRole(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    role = models.ForeignKey(
        InternalRole,
        on_delete=models.CASCADE
    )

    class Meta:
        db_table = "internal_user_role"
        unique_together = ("user", "role")

    def __str__(self):
        return f"{self.user} → {self.role}"

