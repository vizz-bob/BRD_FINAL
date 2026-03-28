from django.db import models
class ScheduleVerification(models.Model):
        STATUS_CHOICES = [
    ("all_verification","All Verification"),
    ("In_Progress", "In Progress"),
    ("pending", "Pending"),
    ("completed", "Completed"),
    ("schedule", "Schedule"),
]
        AGENT_CHOICES = [
            ("priya_singh", "Priya Singh"),
            ("amit_kumar", "Amit Kumar"),
            ("rajesh_sharma", "Rajesh Sharma"),
        ]
        property_id = models.CharField(max_length=50)
        verification_date = models.DateField()
        assign_agent = models.CharField(max_length=50, choices=AGENT_CHOICES)
        status = models.CharField(max_length=50, choices=STATUS_CHOICES)

        created_at = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return self.property_id or "Field Verification"

class AssignAgent(models.Model):

        AGENT_CHOICES = [
            ("rajesh_sharma", "Rajesh Sharma"),
            ("amit_kumar", "Amit Kumar"),
            ("priya_singh", "Priya Singh"),
        ]
        verification_id = models.CharField(max_length=100)
        select_agent = models.CharField(max_length=50, choices=AGENT_CHOICES)
        created_at = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return f"{self.verification_id} - {self.select_agent}"
        
class FieldVerification(models.Model):
        STATUS_CHOICES = [
            ("all_verification","All Verification"),
            ("in_progress", "In Progress"),
            ("pending", "Pending"),
            ("completed", "Completed"),
            ("schedule", "Schedule"),
        ]
        AGENT_CHOICES = [
            ("rajesh_sharma", "Rajesh Sharma"),
            ("priya_singh", "Priya Singh"),
            ("amit_kumar", "Amit Kumar"),
        ]
        PRIORITY_CHOICES = [
            ("high", "High"),
            ("medium", "Medium"),
            ("low", "Low"),
        ]
        ACTION_CHOICES = [
            ("schedule", "Schedule"),
            ("reassign", "Reassign"),
            ("start_visit", "Start Visit"),
            ("view_report", "View Report"),
        ]
        field_id = models.CharField(max_length=100)
        property_name = models.CharField(max_length=200)
        address = models.TextField()
        owner = models.CharField(max_length=200)
        date = models.DateField()

        status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="all_verification")
        agent = models.CharField(max_length=50, choices=AGENT_CHOICES, null=True, blank=True)
        priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
        action = models.CharField(max_length=30, choices=ACTION_CHOICES, null=True, blank=True)

        created_at = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return f"{self.field_id} - {self.property_name}"
    #------------------------
    # Field Dashboard
    #------------------------
   
class FieldDashboard(models.Model):
        today_visit = models.IntegerField(default=0)
        pending_verification= models.IntegerField(default=0)
        active_agents= models.IntegerField(default=0)
        success_rate= models.IntegerField(default=0)
        created_at = models.DateTimeField(auto_now_add=True)
        def __str__(self):
            return "Field Dashboard"