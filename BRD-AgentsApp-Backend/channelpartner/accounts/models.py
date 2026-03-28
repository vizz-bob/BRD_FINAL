from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('PARTNER', 'Channel Partner'),
        ('CREDIT_OPS', 'Credit Ops'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='PARTNER')
    kyc_verified = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bank_account = models.CharField(max_length=20, null=True, blank=True)
    ifsc_code = models.CharField(max_length=11, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    partner_id = models.CharField(max_length=20, unique=True, null=True, blank=True, editable=False)

    # Override to avoid reverse accessor clash
    groups = models.ManyToManyField('auth.Group', related_name='channelpartner_users', blank=True, verbose_name='groups')
    user_permissions = models.ManyToManyField('auth.Permission', related_name='channelpartner_users', blank=True, verbose_name='user permissions')

    def save(self, *args, **kwargs):
        if self.role == 'PARTNER' and not self.partner_id:
            from django.utils import timezone
            year = timezone.now().year
            # Get the count of existing partners to generate a sequence
            # This is a simple approach; for production, use a more robust sequence
            last_partner = User.objects.filter(partner_id__startswith=f'CP-{year}').order_by('-partner_id').first()
            if last_partner:
                try:
                    last_num = int(last_partner.partner_id.split('-')[-1])
                    new_num = last_num + 1
                except:
                    new_num = 1
            else:
                new_num = 1
            self.partner_id = f'CP-{year}-{new_num:03d}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
