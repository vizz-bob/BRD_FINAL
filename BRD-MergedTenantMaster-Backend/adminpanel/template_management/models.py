from django.db import models
import uuid

# ==========================
# COMMON BASE MODEL
# ==========================
class BaseTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template_name = models.CharField(max_length=150)
    file = models.FileField(upload_to="templates/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


# ==========================
# 1. PREDEFINED TEMPLATE
# ==========================
class PredefinedTemplate(BaseTemplate):
    """
    Used for system-defined templates
    Example: sanction letter, loan agreement
    """
    pass


# ==========================
# FIELD MASTER
# ==========================
class FieldMaster(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field_name = models.CharField(max_length=100)
    field_key = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.field_name


# ==========================
# 2. CUSTOMISED TEMPLATE
# ==========================
class CustomisedTemplate(BaseTemplate):
    TEMPLATE_TYPE_CHOICES = (
        ("LEGAL", "Legal"),
        ("FINANCIAL", "Financial"),
        ("AGREEMENT", "Agreement"),
    )

    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPE_CHOICES)
    template_purpose = models.TextField()
    is_mandatory = models.BooleanField(default=False)
    requirement_notes = models.TextField(blank=True, null=True)
    field_masters = models.ManyToManyField(FieldMaster, blank=True)
