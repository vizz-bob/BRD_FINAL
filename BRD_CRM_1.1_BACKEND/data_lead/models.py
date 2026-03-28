from django.db import models
import uuid

from django.contrib.auth.models import User

class Lead(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    product = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Product(models.Model):
    name = models.CharField(max_length=100)
    

class CampaignLead(models.Model):        
    LEAD_SOURCE_CHOICES = [
        ('EMAIL', 'Email'),
        ('SMS', 'SMS'),
        ('SOCIAL', 'Social'),
        ('CALL', 'Call'),
    ]

    LEAD_STATUS_CHOICES = [
        ('RAW', 'Raw'),
        ('QUALIFIED', 'Qualified'),
        ('HOT', 'Hot'),
    ]

    CONVERSION_STATUS_CHOICES = [
        ('NOT_CONVERTED', 'Not Converted'),
        ('CONVERTED', 'Converted'),
    ]
    PRIORITY_CHOICES = (
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    )
    def colored_status(self, obj):
        color_map = {
        'PENDING': 'orange',
        'PROCESSING': 'blue',
        'UPLOADED': 'green',
        'FAILED': 'red',
    }
        return format_html(
        '<b style="color:{};">{}</b>',
        color_map.get(obj.status, 'black'),
        obj.status
    )
    colored_status.short_description = "Status"
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    product = models.CharField(max_length=100)

    lead_source = models.CharField(max_length=20, choices=LEAD_SOURCE_CHOICES)
    lead_status = models.CharField(max_length=20, choices=LEAD_STATUS_CHOICES)

    contact_name = models.CharField(max_length=150)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()

    assigned_users = models.ManyToManyField(User)
    notes = models.TextField(null=True, blank=True)
    follow_up_date = models.DateTimeField(null=True, blank=True)

    conversion_status = models.CharField(
        max_length=20,
        choices=CONVERSION_STATUS_CHOICES,
        null=True,
        blank=True
    )

    consent_obtained = models.BooleanField(default=False)
    tags = models.CharField(max_length=255, null=True, blank=True)
 
    file = models.FileField(upload_to='campaign_lead_upload/',null=True, blank=True)
    assigned_to = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name="campaign_leads",)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    #status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
class ThirdPartyLead(models.Model):
    upload_methods = [
        ('file upload','File Upload'),
        ('manual entry','Manual Entry'),
        ('api integration','Api Integration')
    ]
    LEAD_STATUS_CHOICES = [
        ('RAW', 'Raw'),
        ('QUALIFIED', 'Qualified'),
        ('HOT', 'Hot'),
    ]

    LEAD_QUALITY_CHOICES = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]
     # ---------- API ----------
    api_endpoint = models.URLField(null=True, blank=True)
    api_key = models.CharField(max_length=255, null=True, blank=True)
    
    upload_method = models.CharField(max_length=20,choices=upload_methods,default='File Upload')
    third_party_source = models.CharField(max_length=150)
    third_party_lead_id = models.CharField(
        max_length=100, null=True, blank=True
    )

    product = models.CharField(max_length=100)
    campaign_name = models.CharField(max_length=200)

    lead_status = models.CharField(
        max_length=20, choices=LEAD_STATUS_CHOICES
    )

    contact_name = models.CharField(max_length=150)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()

    assigned_users = models.ManyToManyField(User)
    assigned_to = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name="third_party_leads",)
    notes = models.TextField(null=True, blank=True)
    follow_up_date = models.DateTimeField(null=True, blank=True)

    consent_obtained = models.BooleanField(default=False)
    lead_quality = models.CharField(
        max_length=10, choices=LEAD_QUALITY_CHOICES
    )

    tags = models.CharField(max_length=255, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.contact_name} ({self.third_party_source})"
   
    third_party_source = models.CharField(max_length=150)
    file = models.FileField(upload_to='third_party_leads/',default="third_party_leads/placehoder.csv/paceholder.xlsx")
    #status = models.CharField(
    #     max_length=15,
    #     choices=STATUS_CHOICES,
    #     default='PENDING'
    # )
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ThirdPartyUpload {self.id}"


class InternalLead(models.Model):
    Upload_Methods = [
        ('employee_refferal','Employee Refferal'),
        ('file', 'File'),
        ('manual','Manual Entry'),
        ('internal_api','Internal Database')

    ]
    LEAD_STATUS_CHOICES = [
        ('RAW', 'Raw'),
        ('QUALIFIED', 'Qualified'),
        ('HOT', 'Hot'),
    ]

    LEAD_QUALITY_CHOICES = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]

    internal_source = models.CharField(
        max_length=150,
        help_text="Employee referral, internal inquiry, etc."
    )

    internal_lead_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )
    Upload_method = models.CharField(max_length=20,choices=Upload_Methods,default="file")
    product = models.CharField(max_length=100)
    campaign_name = models.CharField(max_length=200)
    api_endpoint = models.URLField(null=True, blank=True)
    api_key = models.CharField(max_length=255, null=True, blank=True)
    
    lead_status = models.CharField(
        max_length=20,
        choices=LEAD_STATUS_CHOICES
    )
    file = models.FileField(upload_to='internal_lead_upload/',null=True, blank=True)
    contact_name = models.CharField(max_length=150)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()

    assigned_users = models.ManyToManyField(User)
    assigned_to = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name="internal_leads",)
    notes = models.TextField(null=True, blank=True)
    follow_up_date = models.DateTimeField(null=True, blank=True)

    consent_obtained = models.BooleanField(default=False)

    lead_quality = models.CharField(
        max_length=10,
        choices=LEAD_QUALITY_CHOICES
    )

    tags = models.CharField(max_length=255, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.contact_name} ({self.internal_source})"
class LeadAssignmentHistory(models.Model):
    lead = models.ForeignKey(
        InternalLead,
        on_delete=models.CASCADE,
        related_name="assignment_history"
    )

    from_user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="lead_transfers_from"
    )

    to_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,null=True,
        related_name="lead_transfers_to"
    )

    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,null=True,
        related_name="lead_assignment_actions"
    )

    changed_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True)

class OnlineLead(models.Model):
    Upload_Data = [
        ('pending_webhooks','Pending Webhooks'),
        ('file upload','file Upload'),
        ('manual entry','Manual Entry'),
        ('api integration','Api Integration'),
    ]
    LEAD_STATUS_CHOICES = [
        ('RAW', 'Raw'),
        ('QUALIFIED', 'Qualified'),
        ('HOT', 'Hot'),
    ]

    LEAD_QUALITY_CHOICES = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]

    online_source = models.CharField(
        max_length=150,
        help_text="Website, Facebook, Google Ads, etc."
    )

    online_lead_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    quality_tag= models.CharField(max_length=20,choices=LEAD_QUALITY_CHOICES,null=True,blank=True)
    product = models.CharField(max_length=100)
    campaign_name = models.CharField(max_length=200)
    file = models.FileField(upload_to='online_lead_upload/',null=True, blank=True)
    lead_status = models.CharField(
        max_length=20,
        choices=LEAD_STATUS_CHOICES
    )
    api_endpoint = models.URLField(null=True, blank=True)
    api_key = models.CharField(max_length=255, null=True, blank=True)
    contact_name = models.CharField(max_length=150)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()

    assigned_users = models.ManyToManyField(User)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL,null=True,blank=True,related_name="online_leads")
    notes = models.TextField(null=True, blank=True)
    follow_up_date = models.DateTimeField(null=True, blank=True)
    
    consent_obtained = models.BooleanField(default=False)

    lead_quality = models.CharField(
        max_length=10,
        choices=LEAD_QUALITY_CHOICES
    )

    tags = models.CharField(max_length=255, null=True, blank=True)

    lead_form_url = models.URLField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.contact_name} ({self.online_source})"
# online_leads/models.py
class OnlineLeadAssignmentHistory(models.Model):
    lead = models.ForeignKey(
        OnlineLead,
        on_delete=models.CASCADE,
        related_name="assignment_history"
    )

    from_user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="online_lead_transfers_from"
    )

    to_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,null=True,
        related_name="online_lead_transfers_to"
    )

    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,null=True,
        related_name="online_lead_assignment_actions"
    )

    changed_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True)

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class UsedLead(models.Model):
    source_choices = [
        ('campaign','Campaign'),('referal','Referal'),('website','Website'),('social media','Social Media')

    ]
    STATUS_CHOICES = [
        ('coverted', 'Converted'),
        ('follow up', 'Follow Up'),
        ('LOST', 'Lost'),
        ('dead', 'Dead')  
    ]
    OUTCOME_CHOICES = (
        ("won", "Won"),
        ("lost", "Lost"),
        ("dead", "Dead"),
        ('in progress','In Progress')
    )
    product=models.ForeignKey(Product,on_delete=models.CASCADE,null=False,blank=False,default="product_id")
    Source = models.CharField(max_length=20, choices=source_choices,null=True,blank=True)
    agent = models.CharField(max_length=200,blank=True,null=True)
    # Generic relation to ANY lead type
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    lead_object = GenericForeignKey('content_type', 'object_id')
    outcome = models.CharField(
        max_length=20, choices=OUTCOME_CHOICES, null=True, blank=True
    )

    allocated_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='used_leads'
    )

    is_active = models.BooleanField(default=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Converted'
    )

    last_contacted_at = models.DateTimeField(null=True, blank=True)
    last_follow_up = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"UsedLead #{self.id} ({self.final_status})"
class UsedLeadAssignmentHistory(models.Model):
    lead = models.ForeignKey(
        UsedLead,
        on_delete=models.CASCADE,
        related_name="assignment_history"
    )

    from_agent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="used_lead_transfers_from"
    )

    to_agent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,null=True,
        related_name="used_lead_transfers_to"
    )

    reason = models.TextField()
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,null=True,
        related_name="used_lead_reallocation_actions"
    )

    changed_at = models.DateTimeField(auto_now_add=True)

class ArchivedLead(models.Model):
    ARCHIVE_REASON_CHOICES = [ ("no_response", "No Response"),
        ("invalid", "Invalid Lead"),
        ("duplicate", "Duplicate"),
        ("not_interested", "Not Interested"),
    ]
    time_choices = [
        ('all time','All Time'),
        ('last 30 days','Last 30 Days'),('last 90 days','Last 90 Days'),('last 6 months', 'Last 6 months')
    ]
    time = models.CharField(max_length=20,choices=time_choices,default="Last 30 Days")
    product = models.ForeignKey(Product,on_delete=models.PROTECT,blank=True,null=True)
    # Generic relation to ANY lead model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    lead_object = GenericForeignKey('content_type', 'object_id')

    archived_reason = models.CharField(
        max_length=30,
        choices=ARCHIVE_REASON_CHOICES
    )

    archived_notes = models.TextField(null=True, blank=True)

    archived_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='archived_leads'
    )

    archived_at = models.DateTimeField(auto_now_add=True)

    allocated_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='archived_allocations'
    )

    is_reactivated = models.BooleanField(default=False)

    reactivated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reactivated_leads'
    )

    reactivated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"ArchivedLead #{self.id} - {self.archived_reason}"
class ArchivedLeadAssignmentHistory(models.Model):
    lead = models.ForeignKey(
        ArchivedLead,
        on_delete=models.CASCADE,
        related_name="assignment_history"
    )

    from_user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="archived_transfers_from"
    )

    to_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,null=True,
        related_name="archived_transfers_to"
    )

    reason = models.TextField()

    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,null=True,
        related_name="archived_reallocation_actions"
    )

    changed_at = models.DateTimeField(auto_now_add=True)


from django.db import models


class UploadData(models.Model):

    PRODUCT_CHOICES = [
        ("product_a", "Product A"),
        ("product_b", "Product B"),
    ]

    LEAD_SOURCE_CHOICES = [
        ("email", "Email"),
        ("sms", "SMS"),
        ("social", "Social"),
    ]

    LEAD_STATUS_CHOICES = [
        ("raw", "Raw"),
        ("qualified", "Qualified"),
        ("hot", "Hot"),
    ]

    ASSIGNED_USER_CHOICES = [
        ("agent_a", "Agent A"),
        ("agent_b", "Agent B"),
    ]

    CONVERSION_STATUS_CHOICES = [
        ("not_converted", "Not Converted"),
        ("converted", "Converted"),
    ]

    configuration_name = models.CharField(max_length=255)

    file_upload = models.FileField(
        upload_to="file_uploads/",
        blank=True,
        null=True
    )

    product = models.CharField(
        max_length=50,
        choices=PRODUCT_CHOICES
    )

    lead_status = models.CharField(
        max_length=50,
        choices=LEAD_STATUS_CHOICES
    )

    lead_source = models.CharField(
        max_length=50,
        choices=LEAD_SOURCE_CHOICES
    )

    contact_name = models.CharField(max_length=255)

    mobile_number = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    email = models.EmailField(
        max_length=255,
        blank=True,
        null=True
    )

    assigned_user = models.CharField(
        max_length=50,
        choices=ASSIGNED_USER_CHOICES
    )

    conversion_status = models.CharField(
        max_length=50,
        choices=CONVERSION_STATUS_CHOICES
    )

    campaign_start_date = models.DateField(
        blank=True,
        null=True
    )

    campaign_end_date = models.DateField(
        blank=True,
        null=True
    )

    follow_up_date = models.DateTimeField(
        blank=True,
        null=True
    )

    notes = models.TextField(blank=True)
    tags = models.CharField(max_length=300, blank=True)

    consent_obtained = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.contact_name} - {self.product}"


class AllocateData(models.Model):

    AGENT_TO_CHOICES = [
        ("agent_a", "Agent A"),
        ("agent_b", "Agent B"),
    ]

    PRODUCT_CHOICES = [
        ("personal_loan", "Personal Loan"),
        ("home_loan", "Home Loan"),
        ("car_loan", "Car Loan"),
    ]

    agent_to = models.CharField(
        max_length=50,
        choices=AGENT_TO_CHOICES
    )

    product = models.CharField(
        max_length=50,
        choices=PRODUCT_CHOICES
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agent_to} - {self.product}"
from django.db import models


class ReallocateAssignedLead(models.Model):

    CURRENT_USER_CHOICES = [
        ("all_users", "All Users"),
        ("agent_a", "Agent A"),
        ("agent_b", "Agent B"),
    ]

    REASSIGN_TO_CHOICES = [
        ("agent_a", "Agent A"),
        ("agent_b", "Agent B"),
        ("agent_c", "Agent C"),
        ("new_user", "Select New User"),
    ]

    current_assigned_user = models.CharField(
        max_length=50,
        choices=CURRENT_USER_CHOICES
    )

    reassign_to = models.CharField(
        max_length=50,
        choices=REASSIGN_TO_CHOICES
    )
#-------------------------
# data lead dashboard
#-------------------------
class DataLeadDashboard(models.Model):

    Total_Campaign_Leads = models.IntegerField(default=0)
    High_Quality_Leads = models.IntegerField(default=0)
    Conversion_Rate = models.IntegerField(default=0)
    Qualified_Leads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dashboard - {self.id}"


    