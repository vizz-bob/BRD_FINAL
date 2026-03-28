#--------------------------------
# Property status pending
#---------------------------------
from django.db import models
class PropertyPending(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Not Started', 'Not Started'),
    ]
    name = models.CharField(max_length=100, blank=True, null=True)
    property_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    assigned_to = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        default='Pending'
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='Medium'
    )
    last_check = models.DateField()
    structure_integrity = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    property_dimensions = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    legal_documentation = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    utilities_assessment = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    close = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.property_id
#-------------------------
# In progress
#-------------------------
from django.db import models
class PropertyInProgress(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Not Started', 'Not Started'),
    ]
    name = models.CharField(max_length=100, blank=True, null=True)
    property_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    assigned_to = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        default='In Progress'
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='Medium'
    )
    last_check = models.DateField()
    infrastructure_check = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='In progress'
    )
    safety_compliance= models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='In progress'
    )
    building_permits = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='In progress'
    )
    environmental_assessment= models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='In progress'
    )
    close = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.property_id
#---------------------------------
# Property status Completed
#---------------------------------
from django.db import models
class PropertyCompleted(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Not Started', 'Not Started'),
    ]
    name = models.CharField(max_length=100, blank=True, null=True)
    property_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    assigned_to = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        default='Completed'
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='Low'
    )
    last_check = models.DateField()
    machinery_inspection= models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Completed'
    )
    storage_facilities= models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Completed'
    )
    waste_management= models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Completed'
    )
    worker_safety_measures= models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Completed'
    )
    close = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.property_id
#-----------------------------
# status and search
#----------------------------
from django.db import models


class StatusSearch(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('All Properties', 'All Properties'),
    ]

    search = models.CharField(max_length=100, blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='All Properties'
    )

    def __str__(self):
        return self.search if self.search else "Search"