from django.db import models


class Product(models.Model):

    LOAN_TYPE_CHOICES = (
        ("PERSONAL",             "Personal Loan"),
        ("PAYDAY",               "Payday Loan"),           # ✅ Fixed: was "PAYDAY LOAN" (space breaks frontend value)
        ("BUSINESS",             "Business Loan"),
        ("GROUP_LOAN",           "Group Loan"),
        ("VEHICLE",              "Vehicle Loan"),
        ("UNSECURED_EDUCATION",  "Unsecured Education Loan"),
        ("SECURED_EDUCATION",    "Secured Education Loan"),
        ("LOAN_AGAINST_PROPERTY","Loan Against Property"),  # ✅ Fixed: was duplicate "LOAN_AGAINST" for both
        ("LOAN_AGAINST_SHARES",  "Loan Against Shares"),    # ✅ Fixed: was duplicate "LOAN_AGAINST"
        ("GOLD",                 "Gold Loan"),
        ("SUPPLY_CHAIN",         "Supply Chain Finance"),
        ("BILL_INVOICE",         "Bill/Invoice Discounting"),
        ("VIRTUAL_CARD",         "Virtual Card"),
        ("CREDIT_LINE",          "Credit Line"),
        ("AGRICULTURE",          "Agriculture Loan"),
        ("MICROFINANCE",         "Microfinance Loan"),
        ("EQUIPMENT",            "Equipment Financing"),    # ✅ Fixed: was typo "Equipement"
        ("MEDICAL_EMERGENCY",    "Medical Emergency Loan"),
    )

    # Core Details
    product_name = models.CharField(max_length=200)
    loan_type = models.CharField(
        max_length=50,
        choices=LOAN_TYPE_CHOICES
    )

    # Constraints
    min_amount = models.DecimalField(max_digits=12, decimal_places=2)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    min_tenure = models.PositiveIntegerField(help_text="Months")
    max_tenure = models.PositiveIntegerField(help_text="Months")

    # Status
    is_active = models.BooleanField(default=True)  # ✅ Added: frontend sends this field, model was missing it

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product_name