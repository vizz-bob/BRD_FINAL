#--------------------------
# New property check
#---------------------------
from django.db import models
class PropertyCheck(models.Model):
    ASSIGNED_TO_CHOICES = [
        ("Vikram Mehta", "Vikram Mehta"),
        ("Priya Sharma", "Priya Sharma"),
        ("Rajesh Kumar", "Rajesh Kumar"),
    ]
    
    property_name = models.CharField(max_length=255)
    property_type = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    assigned_to = models.CharField(max_length=100, choices=ASSIGNED_TO_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.property_name
#----------------------------------
# Property Check Dashbaord
#----------------------------------
from django.db import models


class PropertyDashboard(models.Model):

    total_properties = models.PositiveIntegerField(default=0)
    pending_checks = models.PositiveIntegerField(default=0)
    in_progress = models.PositiveIntegerField(default=0)
    completed = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dashboard ({self.updated_at.date()})"