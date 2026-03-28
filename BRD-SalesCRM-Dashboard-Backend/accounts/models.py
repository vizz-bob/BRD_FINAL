from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended profile fields for each user (1-to-1 with User)."""
    ROLE_CHOICES = [
        ('sales_executive', 'Sales Executive'),
        ('relationship_manager', 'Relationship Manager'),
        ('team_lead', 'Team Lead'),
        ('regional_manager', 'Regional Manager'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='sales_executive')
    bio = models.TextField(blank=True)
    timezone = models.CharField(max_length=50, default='Asia/Kolkata')
    language = models.CharField(max_length=10, default='English')
    avatar_initials = models.CharField(max_length=5, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} – {self.role}"


class NotificationPreference(models.Model):
    """Notification settings per user."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_prefs')

    # Channels
    email = models.BooleanField(default=True)
    sms = models.BooleanField(default=True)
    push = models.BooleanField(default=True)
    whatsapp = models.BooleanField(default=True)
    desktop = models.BooleanField(default=True)

    # Events
    lead_assigned = models.BooleanField(default=True)
    lead_updated = models.BooleanField(default=True)
    application_submitted = models.BooleanField(default=True)
    payment_received = models.BooleanField(default=True)
    follow_up_reminder = models.BooleanField(default=True)
    weekly_report = models.BooleanField(default=True)
    monthly_incentive = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification prefs for {self.user.username}"


class Availability(models.Model):
    """Per-day working hours for a user."""
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='availability')
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    active = models.BooleanField(default=True)
    from_time = models.TimeField(null=True, blank=True)
    to_time = models.TimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'day')

    def __str__(self):
        return f"{self.user.username} – {self.day}"


class Territory(models.Model):
    """Geographic territory assigned to a team member."""
    name = models.CharField(max_length=100)
    pincode = models.CharField(max_length=50)
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='territories'
    )
    lead_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.pincode})"


class Integration(models.Model):
    """Third-party CRM / communication / storage integrations."""
    TYPE_CHOICES = [
        ('CRM', 'CRM'),
        ('Communication', 'Communication'),
        ('Storage', 'Storage'),
        ('Other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('connected', 'Connected'),
        ('disconnected', 'Disconnected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='integrations')
    name = models.CharField(max_length=100)
    integration_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Other')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='disconnected')
    last_sync = models.CharField(max_length=50, default='Never')
    features = models.JSONField(default=list)
    settings = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.user.username}) – {self.status}"


class GeneralSettings(models.Model):
    """App-wide display and behaviour preferences per user."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='general_settings')
    date_format = models.CharField(max_length=20, default='dd/mm/yyyy')
    currency = models.CharField(max_length=5, default='INR')
    auto_save = models.BooleanField(default=True)
    auto_save_interval = models.IntegerField(default=30)    # seconds
    default_view = models.CharField(max_length=30, default='dashboard')
    items_per_page = models.IntegerField(default=25)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"General settings for {self.user.username}"


class PrivacySettings(models.Model):
    """Privacy and data-sharing preferences per user."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='privacy_settings')
    share_analytics_data = models.BooleanField(default=True)
    marketing_communications = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Privacy settings for {self.user.username}"


class DataPrivacySettings(models.Model):
    """Data & Privacy export preferences per user."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='data_privacy_settings')

    # Export opt-in toggles
    export_leads = models.BooleanField(default=False, help_text="User has opted in to export their leads data.")
    export_reports = models.BooleanField(default=False, help_text="User has opted in to export their reports data.")

    # Timestamps of the last successful export (null if never exported)
    leads_last_exported_at = models.DateTimeField(null=True, blank=True)
    reports_last_exported_at = models.DateTimeField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Data & Privacy settings for {self.user.username}"
