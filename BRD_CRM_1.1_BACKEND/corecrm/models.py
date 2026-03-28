from django.db import models
from data_lead.models import Lead

class Contact(models.Model):

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    SOURCE_CHOICES = [
        ('campaign', 'Campaign'),
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('walkin', 'Walk-in'),
    ]

    AGENT_CHOICES = [
        ('agent_a', 'Agent A'),
        ('agent_b', 'Agent B'),
        ('agent_c', 'Agent C'),
    ]

    full_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=20)
    email = models.EmailField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    date_of_birth = models.DateField(null=True, blank=True)

    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)

    address = models.TextField(blank=True, null=True)

    assigned_to = models.CharField(max_length=20, choices=AGENT_CHOICES)

    notes = models.TextField(blank=True, null=True)

    tags = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

#-----------------------------------
#Account New
#----------------------------------
from django.db import models

class Account(models.Model):

    ACCOUNT_TYPE_CHOICES = [
        ('client', 'Client'),
        ('employer', 'Employer'),
        ('partner', 'Partner'),
        ('vendor', 'Vendor'),
    ]

    INDUSTRY_CHOICES = [
        ('banking', 'Banking'),
        ('retail', 'Retail'),
        ('services', 'Services'),
        ('manufacturing', 'Manufacturing'),
        ('technology', 'Technology'),
        ('healthcare', 'Healthcare'),
        ('education', 'Education'),
        ('real_estate', 'Real Estate'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('archived', 'Archived'),
    ]

    # Basic Information
    company_name = models.CharField(max_length=255)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES)
    industry = models.CharField(max_length=30, choices=INDUSTRY_CHOICES)

    # Tax Information
    gst_number = models.CharField(max_length=20)
    pan_number = models.CharField(max_length=20)

    # Additional Information
    address = models.TextField(blank=True, null=True)
    assigned_to = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    # Parent Account (Self Relation)
    parent_account = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='child_accounts'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name
#------------------------------
# Task New
#------------------------------

class Activity(models.Model):


    ACTIVITY_TYPE_CHOICES = [
        ('TASK', 'Task'),
        ('MEETING', 'Meeting'),
    ]

    TASK_TYPE_CHOICES = [
        ('CALL', 'Call'),
        ('EMAIL', 'Email'),
        ('WHATSAPP', 'WhatsApp'),
        ('REMINDER', 'Reminder'),
    ]

    PRIORITY_CHOICES = [
        ('HIGH', 'High Priority'),
        ('MEDIUM', 'Medium Priority'),
        ('LOW', 'Low Priority'),
    ]

    REMIND_BEFORE_CHOICES = [
        ('15_MIN', '15 minutes before'),
        ('30_MIN', '30 minutes before'),
        ('1_HOUR', '1 hour before'),
        ('1_DAY', '1 day before'),
        ('2_DAY', '2 days before'),
    ]

    ASSIGNED_TO_CHOICES = [
        ('AGENT_A', 'Agent A'),
        ('AGENT_B', 'Agent B'),
        ('AGENT_C', 'Agent C'),
    ]

    activity_type = models.CharField(
        max_length=10,
        choices=ACTIVITY_TYPE_CHOICES
    )

    task_type = models.CharField(
        max_length=20,
        choices=TASK_TYPE_CHOICES,
        blank=True,
        null=True
    )

    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name='activities'
    )

    task_title= models.CharField(max_length=255)

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES
    )

    due_datetime = models.DateTimeField()

    remind_before = models.CharField(
        max_length=20,
        choices=REMIND_BEFORE_CHOICES,
        blank=True,
        null=True
    )

    assigned_to = models.CharField(
        max_length=20,
        choices=ASSIGNED_TO_CHOICES
    )

    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
 
 #-----------------------
 # Meeting 
 #-------------------------
from django.db import models
from django.contrib.auth.models import User  # assuming agents are Users
from corecrm.models import Lead  # your existing Lead model

class Meeting(models.Model):
    MEETING_TYPE_CHOICES = [
        ('IN_PERSON', 'In-Person'),
        ('VIDEO_CALL', 'Video Call'),
        ('PHONE_CALL', 'Phone Call'),
    ]

    MEETING_MODE_CHOICES = [
        ('ZOOM', 'Zoom'),
        ('GOOGLE_MEET', 'Google Meet'),
        ('WHATSAPP', 'Whatsapp'),
        ('PHYSICAL', 'Physical'),
    ]

    DURATION_CHOICES = [
        (15, '15 minutes'),
        (30, '30 minutes'),
        (45, '45 minutes'),
        (60, '1 hour'),
        (90, '1.5 hours'),
        (120, '2 hours'),
    ]

    PRIORITY_CHOICES = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]

    meeting_type = models.CharField(max_length=20, choices=MEETING_TYPE_CHOICES)
    meeting_mode = models.CharField(max_length=20, choices=MEETING_MODE_CHOICES)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    datetime = models.DateTimeField()
    duration = models.PositiveIntegerField(choices=DURATION_CHOICES)
    link = models.URLField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    agenda = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.lead}"
