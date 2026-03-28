from django.db import models
from django.contrib.auth.models import User


# =========================
# DOCUMENT MODEL
# =========================
class Document(models.Model):
    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=100)
    uploaded_file = models.FileField(upload_to='documents/', null=True, blank=True) 
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# =========================
# REVIEW MODEL
# =========================
class Review(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    review_title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.review_title


# =========================
# REPORT MODEL
# =========================
class Report(models.Model):
    REPORT_TYPES = [
        ('Daily', 'Daily'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
    ]

    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    date_from = models.DateField()
    date_to = models.DateField()
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report_type} Report"
    from django.contrib.auth.models import User
from django.utils import timezone


class DocumentDetail(models.Model):

    STATUS_CHOICES = [
        ('Under Review', 'Under Review'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    document = models.OneToOneField(Document, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Under Review')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')

    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='submitted_docs')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_docs')

    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def average_tat(self):
        if self.reviewed_at:
            diff = self.reviewed_at - self.created_at
            return round(diff.total_seconds() / 86400, 2)
        return None

    def __str__(self):
        return str(self.document.id)