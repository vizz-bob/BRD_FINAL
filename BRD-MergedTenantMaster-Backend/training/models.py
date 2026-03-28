from django.db import models
from tenants.models import Tenant

class TrainingModule(models.Model):
    TYPE_CHOICES = (
        ('VIDEO', 'Video'),
        ('PDF', 'PDF'),
    )

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="training_modules")
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='VIDEO')
    duration = models.CharField(max_length=50) # e.g. "15 mins"
    file = models.FileField(upload_to='training/', blank=True, null=True, help_text="Course material (PDF/Video)")
    file_url = models.URLField(blank=True, null=True, help_text="Link if not uploaded")
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "training_modules"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
