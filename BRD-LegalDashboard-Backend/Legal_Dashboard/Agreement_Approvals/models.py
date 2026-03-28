from django.db import models


class Agreement(models.Model):

    AGREEMENT_TYPES = [
        ('Loan Agreement', 'Loan Agreement'),
        ('Collateral Agreement', 'Collateral Agreement'),
        ('Guarantor Agreement', 'Guarantor Agreement')
    ]

    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low')
    ]

    ASSIGNEES = [
        ('Rahul', 'Rahul'),
        ('Amit', 'Amit'),
        ('Sneha', 'Sneha'),
        ('Priya', 'Priya')
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ]

    agreement_id = models.CharField(max_length=20)
    agreement_type = models.CharField(max_length=50, choices=AGREEMENT_TYPES)
    client_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    assigned_to = models.CharField(max_length=50, choices=ASSIGNEES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    submitted_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.agreement_id} - {self.agreement_type}"


# -----------------------------
# NEW AGREEMENT (Proxy Model)
# -----------------------------
class NewAgreement(Agreement):

    class Meta:
        proxy = True
        verbose_name = "New Agreement"
        verbose_name_plural = "New Agreements"


# -----------------------------
# BULK ASSIGN MODEL
# -----------------------------
class BulkAssign(models.Model):

    ASSIGNEES = [
        ('Rahul', 'Rahul'),
        ('Amit', 'Amit'),
        ('Sneha', 'Sneha'),
        ('Priya', 'Priya')
    ]

    assigned_to = models.CharField(max_length=50, choices=ASSIGNEES)

    agreements = models.ManyToManyField(Agreement)

    def __str__(self):
        return f"Assigned to {self.assigned_to}"


# -----------------------------
# DASHBOARD STATS (Proxy)
# -----------------------------
class DashboardStats(Agreement):

    class Meta:
        proxy = True
        verbose_name = "Dashboard Stat"
        verbose_name_plural = "Dashboard Stats"