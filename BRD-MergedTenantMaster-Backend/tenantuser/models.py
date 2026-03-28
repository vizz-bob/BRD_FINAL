import uuid
from django.db import models
from django.contrib.auth.hashers import make_password
from role.models import Role


class TenantUser(models.Model):
    ROLE_TYPE_CHOICES = (
        ("ADMIN", "Admin"),
        ("MANAGER", "Manager"),
        ("CUSTOM", "Custom Role"),
        ("SUPERVISOR", "Supervisor"),
        ("EXECUTIVE", "Executive"),
        ("STANDARD", "Standard User"),
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

    role_id = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, blank=True)  # permission group id

    password = models.CharField(max_length=255)

    account_status = models.CharField(
        max_length=20,
        choices=ACCOUNT_STATUS_CHOICES,
        default="ACTIVE"
    )
    action = models.CharField(
        max_length=20,
        choices=ACTION,
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


from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Q
from django.db import IntegrityError

@receiver(post_save, sender=TenantUser)
def sync_tenant_user_to_rbac(sender, instance, created, **kwargs):
    """
    Synchronizes TenantUser role changes to the main User model and UserRole bridge table.
    Handles foreign key constraints gracefully.
    """
    try:
        from users.models import User
        from adminpanel.access_control.models import UserRole
        
        # 1. Find the corresponding auth User by email
        user = User.objects.filter(email=instance.email).first()
        if not user:
            return
            
        # 2. Sync role_type (string) to User.role for legacy compatibility
        # Ensure role_type is aligned to choice list
        if instance.role_type and user.role != instance.role_type:
            user.role = instance.role_type
            user.save(update_fields=['role'])
            
        # 3. Sync role_id (ForeignKey) to UserRole bridge table for RBAC
        # Only sync if role_id is explicitly set (not null)
        if instance.role_id:
            try:
                UserRole.objects.update_or_create(
                    user=user,
                    defaults={"role": instance.role_id}
                )
            except IntegrityError as e:
                # Log the error but don't fail the TenantUser creation
                import logging
                logger = logging.getLogger(__name__)
                logger.warning(f"Failed to sync UserRole for {instance.email}: {str(e)}")
                
    except Exception as e:
        # Catch any other exceptions to prevent signal from breaking TenantUser save
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error in sync_tenant_user_to_rbac for {instance.email}: {str(e)}")
