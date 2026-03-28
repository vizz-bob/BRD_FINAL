from django.db import models
from tenants.models import Tenant

class KnowledgeResource(models.Model):
    TYPE_CHOICES = (
        ('VIDEO', 'Video'),
        ('PDF', 'PDF'),
        ('LINK', 'Link'),
        ('OTHER', 'Other')
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="knowledge_resources")
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='PDF')
    file_url = models.URLField(blank=True, null=True, help_text="External link if not uploaded")
    file = models.FileField(upload_to='knowledge_base/', blank=True, null=True, help_text="Actual document/video file")
    size = models.CharField(max_length=50, blank=True, default="2 MB")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "knowledge_resources"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
