
from django.db import models
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
# from .models import Account
# from accounts.models import Account


# -----------------------
# Account Model (MERGED ✅)
# -----------------------
class CollectionAccount(models.Model):

    BUCKET_CHOICES = [
        ('SMA-0', 'SMA-0'),
        ('SMA-1', 'SMA-1'),
        ('SMA-2', 'SMA-2'),
        ('NPA', 'NPA'),
    ]

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('closed', 'Closed'),
        ('pending', 'Pending'),
        ('overdue', 'Overdue'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    account_name = models.CharField(max_length=255)
    account_email = models.EmailField()

    # ✅ Agent mapping (FIXES YOUR ERROR)
    collection_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='collectionaccounts'
    )

    # ✅ Old fields
    account_id = models.CharField(max_length=50, unique=True)
    phone = models.CharField(max_length=15)
    emi_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_overdue = models.DecimalField(max_digits=10, decimal_places=2)
    dpd = models.IntegerField()
    bucket = models.CharField(max_length=10, choices=BUCKET_CHOICES)

    # ✅ New fields
    customer_name = models.CharField(max_length=100)
    loan_number = models.CharField(max_length=50)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2)

    account_name = models.CharField(max_length=255)  # check if this exists
    phone_number = models.CharField(max_length=20)
    location = models.CharField(max_length=255)


    # ✅ Common
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} ({self.account_id})"


# -----------------------
# Collection Profile
# -----------------------
class CollectionProfile(models.Model):
    agent = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='collection_profile'
    )
    full_name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50)
    branch = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - Collection"

class Recovery(models.Model):
    PAYMENT_MODE = (
        ('cash', 'Cash'),
        ('upi', 'UPI'),
        ('cheque', 'Cheque'),
        ('neft', 'NEFT'),
        ('rtgs', 'RTGS'),
    )

    account = models.ForeignKey('CollectionAccount', on_delete=models.CASCADE)
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recoveries')
    amount_collected = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE)

    transaction_reference = models.CharField(max_length=100, blank=True)
    cheque_number = models.CharField(max_length=50, blank=True)
    rtgs_reference_number = models.CharField(max_length=100, blank=True)
    neft_reference_number = models.CharField(max_length=100, blank=True)
    remarks = models.TextField(blank=True)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    receipt_photo = models.ImageField(upload_to='recovery_receipts/', null=True, blank=True)
    collected_at = models.DateTimeField(auto_now_add=True)

    # 🔥 Validation Logic
    def clean(self):

        if self.payment_mode == 'cash':
            self.transaction_reference = ''
            self.cheque_number = ''

        elif self.payment_mode == 'upi':
            if not self.transaction_reference:
                raise ValidationError({
                    'transaction_reference': "UPI reference number is required."
                })

        elif self.payment_mode == 'neft':
            if not self.transaction_reference:
                raise ValidationError({
                    'transaction_reference': "NEFT reference number is required."
                })

        elif self.payment_mode == 'rtgs':
            if not self.transaction_reference:
                raise ValidationError({
                    'transaction_reference': "RTGS reference number is required."
                })

        elif self.payment_mode == 'cheque':
            if not self.cheque_number:
                raise ValidationError({
                    'cheque_number': "Cheque number is required."
                })

    # 🔥 Ensure validation always runs
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.account.loan_number} - {self.amount_collected}"




# -----------------------
# FollowUp Model
# -----------------------
# 

class FollowUp(models.Model):

    # ✅ Followup Type
    FOLLOWUP_TYPE = (
        ('field_visit', 'Field Visit'),
        ('phone_call', 'Phone Call'),
        ('promise_to_pay', 'Promise To Pay'),
    )

    # ✅ NEW: Disposition Choices
    DISPOSITION_CHOICES = (
        ('right_party', 'Right Party Contact'),
        ('wrong_party', 'Wrong Party Contact'),
        ('no_contact', 'No Contact'),
        ('switched_off', 'Switched Off'),
        ('call_back', 'Call Back Later'),
        ('promise_to_pay', 'Promise to Pay'),
    )

    # ✅ NEW: Contact Person Choices
    CONTACT_PERSON_CHOICES = (
        ('self', 'Self'),
        ('spouse', 'Spouse'),
        ('family', 'Family Member'),
        ('other', 'Other'),
    )

    account = models.ForeignKey(CollectionAccount, on_delete=models.CASCADE, related_name='followups')
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='followups')

    followup_type = models.CharField(max_length=30, choices=FOLLOWUP_TYPE)

    # ✅ NEW FIELDS
    disposition = models.CharField(max_length=30, choices=DISPOSITION_CHOICES)
    contact_person = models.CharField(max_length=20, choices=CONTACT_PERSON_CHOICES)

    notes = models.TextField()

    promise_date = models.DateField(null=True, blank=True)

     # ✅ PTP Fields
    ptp_date = models.DateField(null=True, blank=True)
    ptp_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # ✅ Voice Recording
    voice_recording = models.FileField(upload_to='voice_recordings/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.account.loan_number} - {self.followup_type}"


class RepossessionHistory(models.Model):
    account = models.ForeignKey('CollectionAccount', on_delete=models.CASCADE)
    status = models.CharField(max_length=100)
    remarks = models.TextField(blank=True, null=True)
    repossessed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.account} - {self.status}"


class VisitRecording(models.Model):
    VISIT_TYPE_CHOICES = (
        ('CUSTOMER_VISIT', 'Customer Visit'),
        ('RESIDENCE_VISIT', 'Residence Visit'),
        ('OFFICE_VISIT', 'Office Visit'),
    )

    VISIT_OUTCOME_CHOICES = (
        ('MET_DISCUSSED', 'Met & Discussed'),
        ('NOT_AVAILABLE', 'Not Available'),
        ('REFUSED_MEET', 'Refused to Meet'),
        ('ADDRESS_NOT_FOUND', 'Address Not Found'),
    )

    PERSON_MET_CHOICES = (
        ('SELF', 'Self (Customer)'),
        ('SPOUSE', 'Spouse'),
        ('FAMILY', 'Family Member'),
        ('NEIGHBOR', 'Neighbor'),
        ('SECURITY', 'Security/Watchman'),
        ('OTHER', 'Other'),
    )

    account = models.ForeignKey(
        CollectionAccount,
        on_delete=models.CASCADE,
        related_name='visit_recordings'
    )
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='visit_recordings'
    )
    visit_type = models.CharField(max_length=30, choices=VISIT_TYPE_CHOICES, default='CUSTOMER_VISIT')
    visit_outcome = models.CharField(max_length=30, choices=VISIT_OUTCOME_CHOICES)
    customer_met = models.BooleanField(default=True)
    person_met = models.CharField(max_length=20, choices=PERSON_MET_CHOICES, default='SELF')
    discussion_points = models.TextField()
    next_action = models.TextField(blank=True)
    follow_up_date = models.DateField(null=True, blank=True)
    consent_given = models.BooleanField(default=False)
    is_within_range = models.BooleanField(default=False)
    distance_meters = models.PositiveIntegerField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.account.account_id} - {self.visit_type} - {self.created_at.date()}"


class VisitPhoto(models.Model):
    PHOTO_TYPE_CHOICES = (
        ('house_exterior', 'House/Office Exterior'),
        ('customer_photo', 'Customer Photo'),
        ('address_proof', 'Address Proof'),
        ('meeting_proof', 'Meeting Proof'),
    )

    visit = models.ForeignKey(
        VisitRecording,
        on_delete=models.CASCADE,
        related_name='photos'
    )
    photo_type = models.CharField(max_length=30, choices=PHOTO_TYPE_CHOICES)
    image = models.ImageField(upload_to='visit_photos/')
    captured_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.visit.account.account_id} - {self.photo_type}"


class VisitAudioRecording(models.Model):
    visit = models.ForeignKey(
        VisitRecording,
        on_delete=models.CASCADE,
        related_name='audio_recordings'
    )
    audio_file = models.FileField(upload_to='visit_audio_recordings/')
    duration_seconds = models.PositiveIntegerField(default=0)
    is_uploaded = models.BooleanField(default=False)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.visit.account.account_id} - {self.duration_seconds}s"

