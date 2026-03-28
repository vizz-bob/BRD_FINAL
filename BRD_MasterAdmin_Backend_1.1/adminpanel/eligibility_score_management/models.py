from django.db import models
import uuid


# ---------------- Eligibility Management ----------------
class EligibilityManagement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    applicant_type = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    income_type = models.CharField(max_length=50)

    other_income = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    margin = models.DecimalField(max_digits=5, decimal_places=2)
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    salary_receipt_mode = models.CharField(max_length=50)
    update_turnover = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_type} - {self.category}"


# ---------------- Banking Management ----------------
class BankingManagement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    bank_account_type = models.CharField(max_length=50)
    average_banking_from = models.DateField()
    average_banking_to = models.DateField()
    average_banking_criteria = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- Existing Obligation Management ----------------
class ExistingObligationManagement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    loan_status = models.CharField(max_length=50)
    loan_performance = models.CharField(max_length=50)

    card_type = models.CharField(max_length=50)
    credit_card_status = models.CharField(max_length=50)
    credit_card_performance = models.CharField(max_length=50)

    total_loans = models.PositiveIntegerField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- Score Card Management ----------------
class ScoreCardManagement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    impact_type = models.CharField(max_length=50)
    risk_impact = models.CharField(max_length=50)

    professionals_config = models.JSONField(null=True, blank=True)
    employees_config = models.JSONField(null=True, blank=True)
    groups_config = models.JSONField(null=True, blank=True)
    corporates_config = models.JSONField(null=True, blank=True)
    others_config = models.JSONField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
