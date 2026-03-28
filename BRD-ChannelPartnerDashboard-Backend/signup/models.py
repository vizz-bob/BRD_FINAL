from django.db import models
from django.contrib.auth.models import User

# Create your models here.

#---------------------------
# create Account
#---------------------------
class Create_Account(models.Model):

    ROLE_CHOICES = [
        ('DSA_MANAGER', 'DSA Manager'),
        ('BROKER_ADMIN', 'Broker Admin'),
        ('LEAD_MANAGER', 'Lead Manager'),
        ('FINANCE_TEAM', 'Finance Team'),
        ('OTHER', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)

    email = models.EmailField(
        max_length=254,
        default="",          # 👈 important
        blank=True
    )

    phone = models.CharField(max_length=15, null=True, blank=True)

    password = models.CharField(
        max_length=128,
        default="",          # 👈 important
        blank=True
    )

    confirm_password = models.CharField(
        max_length=128,
        default="",          
        blank=True
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    agree_terms = models.BooleanField(default=False)
    create_account = models.BooleanField(default=False)
    sign_in = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
