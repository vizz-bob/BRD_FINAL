from django.db import models


class CreditScoreRule(models.Model):

    EMPLOYMENT_TYPE_CHOICES = (
        ('SALARIED', 'Salaried'),
        ('BUSINESS', 'BUSINESS'),
    )

    PARAMETER_CHOICES = (
        ('CIBIL', 'CIBIL Score'),
        ('SALARY', 'Salary'),
        ('AGE', 'Age'),
        ('FOIR', 'FOIR'),
    )

    CONDITION_CHOICES = (
        ('GT', 'Greater Than'),
        ('LT', 'Less Than'),
        ('BT', 'Between'),
    )

    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES
    )

    parameter = models.CharField(
        max_length=20,
        choices=PARAMETER_CHOICES
    )

    condition = models.CharField(
        max_length=10,
        choices=CONDITION_CHOICES
    )

    value = models.DecimalField(max_digits=12, decimal_places=2)
    impact_score = models.IntegerField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "risk_credit_score_rules"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.parameter} {self.condition} {self.value}"


class NegativeArea(models.Model):

    RISK_LEVEL_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High (Manual Review)'),
        ('BLOCKED', 'Blocked'),
    )

    pincode = models.CharField(max_length=10, unique=True)
    city = models.CharField(max_length=100)
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "risk_negative_areas"

    def __str__(self):
        return f"{self.city} - {self.pincode}"
