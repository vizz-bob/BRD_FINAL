from django.db import models
from adminpanel.product_revenue.product_management.models import Product
from disbursement.models import LoanAccount


class ActiveLoan(models.Model):

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    ACTION_CHOICES = (
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    LOAN_TYPE_CHOICES = (
        ("PERSONAL", "Personal Loan"),
        ("PAYDAY_LOAN", "Payday Loan"),
        ("BUSINESS", "Business Loan"),
        ("GROUP_LOAN", "Group Loan"),
        ("VEHICLE", "Vehicle Loan"),
        ("UNSECURED_EDUCATION", "Unsecured Education Loan"),
        ("LOAN_AGAINST_PROPERTY", "Loan Against Property"),
        ("LOAN_AGAINST_SHARES", "Loan Against Shares"),
        ("GOLD", "Gold Loan"),
        ("SECURED_EDUCATION", "Secured Education Loan"),
        ("SUPPLY_CHAIN", "Supply Chain Finance"),
        ("BILL_INVOICE", "Bill/Invoice Discounting"),
        ("VIRTUAL_CARD", "Virtual Card"),
        ("CREDIT_LINE", "Credit Line"),
        ("AGRICULTURE", "Agricultural Loan"),
        ("MICROFINANCE", "Microfinance Loan"),
        ("EQUIPMENT", "Equipment Financing"),
        ("MEDICAL_EMERGENCY", "Medical Emergency Loan"),
    )

    # Relationship with Loanaccount
    loan_account = models.OneToOneField(
        LoanAccount,
        on_delete=models.CASCADE,
        related_name="active_loan"
    )

    product_type = models.CharField(
        max_length=50,
        choices=LOAN_TYPE_CHOICES
    )

    disbursed_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    outstanding = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    next_emi = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES
    )

    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.loan_account} - {self.product_type}"