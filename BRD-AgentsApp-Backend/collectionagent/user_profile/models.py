from django.db import models
from django.conf import settings
class AgentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    agent_id = models.CharField(max_length=20)
    phone = models.CharField(max_length=15)
    branch = models.CharField(max_length=100)
    joined_date = models.DateField()
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return self.agent_id


class Performance(models.Model):
    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE)
    month = models.CharField(max_length=20)
    total_target = models.FloatField()
    total_achieved = models.FloatField()
    calls = models.IntegerField()
    field_visits = models.IntegerField()
    ptp = models.IntegerField()  # promise to pay

    def __str__(self):
        return f"{self.agent.agent_id} - {self.month}"


class Collection(models.Model):
    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()
    accounts_count = models.IntegerField()

    def __str__(self):
        return f"{self.agent.agent_id} - {self.amount}"


class AppSettings(models.Model):
    agent = models.OneToOneField(AgentProfile, on_delete=models.CASCADE)
    notifications = models.BooleanField(default=True)
    auto_sync = models.BooleanField(default=True)

    def __str__(self):
        return self.agent.agent_id

class PrivacyPolicy(models.Model):
    title = models.CharField(max_length=200, default="Your Privacy Matters")
    introduction = models.TextField()
    important_notice = models.TextField()
    last_updated = models.DateField()

    def __str__(self):
        return "Privacy Policy"
class PrivacyPolicySection(models.Model):
    policy = models.ForeignKey(
        PrivacyPolicy,
        on_delete=models.CASCADE,
        related_name='sections'
    )

    order = models.PositiveIntegerField()  # 1,2,3...
    title = models.CharField(max_length=255)
    information_we_collect = models.TextField(help_text="Section 1: Information we collect")
    how_we_use_information = models.TextField(help_text="Section 2: How we use your information")
    information_sharing = models.TextField(help_text="Section 3: Information sharing")
    data_security = models.TextField(help_text="Section 4: Data security")
    your_rights_and_choices = models.TextField(help_text="Section 5: Your rights and choices")
    data_retention = models.TextField(help_text="Section 6: Data retention")
    cookies_and_tracking = models.TextField(help_text="Section 7: Cookies and tracking")
    third_party_services = models.TextField(help_text="Section 8: Third party services")
    childrens_privacy = models.TextField(help_text="Section 9: Children's privacy")
    changes_to_policy = models.TextField(help_text="Section 10: Changes to privacy policy")
    contact_us = models.TextField(help_text="Contact information for privacy inquiries")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}. {self.title}"
class PrivacyQuickSummary(models.Model):
    policy = models.ForeignKey(
        PrivacyPolicy,
        on_delete=models.CASCADE,
        related_name='quick_summary'
    )

    point = models.CharField(max_length=255)

    def __str__(self):
        return self.point

class FAQ(models.Model):
    policy = models.ForeignKey(PrivacyPolicy, on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.question
class SupportContact(models.Model):
    policy = models.ForeignKey(PrivacyPolicy, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    whatsapp_number = models.CharField(max_length=15)
    support_email = models.EmailField()

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Support Contact"
class SupportTicket(models.Model):
    policy = models.ForeignKey(PrivacyPolicy, on_delete=models.CASCADE)
    ISSUE_CHOICES = (
        ('emi / payment issue', 'EMI / PAYMENT ISSUE'),
        ('mandate issue', 'Mandate Issue'),
        ('document issue', 'Document Issue'),
        ('kyc issue', 'KYC Issue'),
        ('app / technical issue','App/Technical Issue'),
        ('other', 'Other'),
    )

    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )

    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='CollectionAgent_support_tickets'
    )

    issue_category = models.CharField(max_length=50, choices=ISSUE_CHOICES)
    issue_description = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agent.email} - {self.issue_category}"


