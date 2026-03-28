from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from adminpanel.access_control.models import RolePermission, UserRole
import uuid


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.model(
            email=self.normalize_email(email),
            is_staff=True,
            is_superuser=True,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []   # 🔥 IMPORTANT

    objects = UserManager()

    def has_permission(self, permission_code: str) -> bool:
        """
        Check if user has a specific RBAC permission
        """
        # Superuser bypass
        if self.is_superuser:
            return True

        return RolePermission.objects.filter(
            role__userrole__user=self,
            permission__code=permission_code,
            role__is_active=True
        ).exists()
    
    def get_roles(self):
        """
        Return list of role names assigned to user
        """
        return list(
            UserRole.objects.filter(user=self)
            .values_list("role__name", flat=True)
        )

    def get_permissions(self):
        """
        Return list of permission codes assigned to user
        """
        return list(
            RolePermission.objects.filter(
                role__userrole__user=self,
                role__is_active=True
            )
            .values_list("permission__code", flat=True)
            .distinct()
        )


    def __str__(self):
        return self.email
