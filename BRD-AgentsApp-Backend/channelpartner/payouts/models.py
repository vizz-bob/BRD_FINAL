from django.db import models
from django.conf import settings
from channelpartner.leads.models import Lead
from django.utils import timezone

class Payout(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
    )
    
    payout_id = models.CharField(max_length=20, unique=True, editable=False)
    lead = models.OneToOneField(Lead, on_delete=models.CASCADE, related_name='payout')
    partner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='payouts', on_delete=models.CASCADE)
    
    # commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percentage e.g. 2.5")
    # disbursed_amount = models.DecimalField(max_digits=12, decimal_places=2)
    # commission_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    disbursed_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    commission_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, default=0)

    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    invoice = models.FileField(upload_to='payouts/invoices/', null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payout_id']),
            models.Index(fields=['status']),
            models.Index(fields=['partner']),
        ]
    
    def save(self, *args, **kwargs):
        # Auto-calculate commission
        if self.disbursed_amount and self.commission_percentage:
            self.commission_amount = (self.disbursed_amount * self.commission_percentage) / 100
        
        # Auto-generate payout_id
        if not self.payout_id:
            year = timezone.now().year
            last_payout = Payout.objects.filter(payout_id__startswith=f'PAY-{year}').order_by('-payout_id').first()
            if last_payout:
                last_num = int(last_payout.payout_id.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.payout_id = f'PAY-{year}-{new_num:03d}'
            
        # Track paid_at timestamp
        if self.status == 'PAID' and not self.paid_at:
            self.paid_at = timezone.now()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.payout_id} - {self.lead.lead_id}"
