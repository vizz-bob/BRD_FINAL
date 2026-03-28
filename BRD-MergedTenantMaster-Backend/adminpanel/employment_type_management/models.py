from django.db import models
import uuid

class EmploymentTypeMaster(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    emp_name = models.CharField(max_length=100, unique=True)

    created_user = models.CharField(max_length=100)
    modified_user = models.CharField(max_length=100, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    isDeleted = models.BooleanField(default=False)

    class Meta:
        db_table = "employment_type_master"
        ordering = ["emp_name"]

    def __str__(self):
        return self.emp_name
