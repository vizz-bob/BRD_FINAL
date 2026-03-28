from django.db import models
#-----------------------
# Property Information
#------------------------
class PropertyInformation(models.Model):
    property_type = models.CharField(
        max_length=50
    )
    address = models.TextField()
    request_date = models.DateField()
    completion_date = models.DateField(
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.property_type} - {self.address}"
#-----------------------------
# Valuation Assessment
#-----------------------------
class ValuationAssessment(models.Model):
    ASSIGNED_TO_CHOICES = [
        ('ravi', 'Ravi Sharma'),
        ('priya', 'Priya Singh'),
        ('amit', 'Amit Patel'),
        ('sunita', 'Sunita Williams'),
    ]
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
    ]
    estimated_value = models.DecimalField(max_digits=15, decimal_places=2)
    assessed_value = models.DecimalField(max_digits=15, decimal_places=2)
    assigned_to = models.CharField(
        max_length=20,
        choices=ASSIGNED_TO_CHOICES
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.assigned_to} - {self.status}"
#--------------------------
#Client Information
#--------------------------
class ClientInformation(models.Model):
    name = models.CharField(max_length=150)
    contact = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
#----------------------
# Details
#-------------------------
class Details(models.Model):
    valuation_id = models.CharField(
    max_length=50,
    unique=True,
    null=True,
    blank=True
)
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    ASSIGNED_TO_CHOICES = [
        ('ravi', 'Ravi Sharma'),
        ('amit', 'Amit Patel'),
        ('sunita', 'Sunita Williams'),
        ('priya', 'Priya Singh'),
    ]   
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    assigned_to = models.CharField(
        max_length=20,
        choices=ASSIGNED_TO_CHOICES
    )
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.get_status_display()} - {self.get_assigned_to_display()}"
#----------------------------
# Documents
#--------------------------
class Documents(models.Model):
    property_deed = models.FileField(
        upload_to='documents/property_deeds/',
        null=True,
        blank=True
    )
    floor_plan = models.FileField(
        upload_to='documents/floor_plans/',
        null=True,
        blank=True
    )
    owner_id = models.FileField(
        upload_to='documents/owner_ids/',
        null=True,
        blank=True
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
#----------------------------
# Recent valuation
#----------------------------
class RecentValuation(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('pending', 'Pending'),
    ]
    ACTION_CHOICES = [
        ('view', 'View'),
        ('update', 'Update'),
    ]
    valuation_id = models.CharField(
        max_length=50,
        unique=True
    )
    property = models.CharField(max_length=200)
    location = models.CharField(max_length=255)
    date = models.DateField()
    estimated_value = models.DecimalField(
        max_digits=15,
        decimal_places=2
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        default='view'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.valuation_id