#-----------------------------
# add record
#-----------------------------
from django.db import models
class RecoveryRecord(models.Model):
    AGENT_TYPE_CHOICES = [
        ("DSA", "DSA"),
        ("Broker", "Broker"),
        ("Lead Partner", "Lead Partner"),
    ]
    DEDUCTION_DAY_CHOICES = [
        ("1st", "1st of month"),
        ("5th", "5th of month"),
        ("10th", "10th of month"),
        ("15th", "15th of month"),
    ]
    REASON_CHOICES = [
        ("Advance Clawback", "Advance Clawback"),
        ("Overpayment", "Overpayment"),
        ("Policy Breach", "Policy Breach"),
        ("Dispute Recovery", "Dispute Recovery"),
        ("Other", "Other"),
    ]
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("On Hold", "On Hold"),
        ("Cleared", "Cleared"),
        ("Defaulted", "Defaulted"),
    ]
    agent_name = models.CharField(max_length=150)
    agent_id = models.CharField(max_length=50)
    agent_type = models.CharField(max_length=50, choices=AGENT_TYPE_CHOICES)
    total_amount_owed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    already_recovered = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deduction_day = models.CharField(max_length=20, choices=DEDUCTION_DAY_CHOICES)
    reason = models.CharField(max_length=100, choices=REASON_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    start_date = models.DateField()
    due_date = models.DateField()
    cancel = models.BooleanField(default=False)
    add_record = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.agent_name} - {self.agent_id}"
#--------------------------
# Dashboard
#--------------------------
from django.db import models
class Dashboard(models.Model):
    total_owed = models.IntegerField(default=0)
    recovered = models.IntegerField(default=0)
    pending= models.IntegerField(default=0)
    overall_recovery = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return " Dashboard"
#-------------------------------
# Search
#-------------------------------
from django.db import models
class Recovery_Search(models.Model):
    TYPE_CHOICES = [
        ("all", "All"),
        ("active", "Active"),
        ("on_hold", "On Hold"),
        ("cleared","Cleared"),
        ("defaulted","Defaulted"),
    ]
    search = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.type} - {self.search}"
#----------------------------------
# Recovery payment main edit
#-----------------------------------
from django.db import models


class EditRecovery(models.Model):

    DEDUCTION_DAY_CHOICES = [
        ("1st", "1st"),
        ("5th", "5th"),
        ("10th", "10th"),
        ("15th", "15th"),
    ]

    REASON_CHOICES = [
        ("Overpayment", "Overpayment"),
        ("Advance Clawback", "Advance Clawback"),
        ("Policy Breach Fire", "Policy Breach Fire"),
        ("Dispute Recovery", "Dispute Recovery"),
        ("Other", "Other"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Cleared", "Cleared"),
        ("Defaulted", "Defaulted"),
        ("On Hold", "On Hold"),
    ]

    name = models.CharField(max_length=150)
    agent_id = models.CharField(max_length=50)

    total_owed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    recovered = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    deduction_day = models.CharField(max_length=10, choices=DEDUCTION_DAY_CHOICES)
    reason = models.CharField(max_length=100, choices=REASON_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")

    start_date = models.DateField()
    due_date = models.DateField()
    cancel = models.BooleanField(default=False)
    save_changes = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.agent_id}"