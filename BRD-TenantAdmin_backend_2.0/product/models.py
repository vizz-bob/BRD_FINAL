from django.db import models

class Product(models.Model):

    LOAN_TYPE_CHOICES = (
        ("PERSONAL", "Personal Loan"),
        ("PAYDAY LOAN", "payday loan"),
        ("BUSINESS", "Business Loan"),
        ("GROUP_LOAN", "Group loan"),
        ("VEHICLE", "Vehicle Loan"),
        ("UNSECURED_EDUCATION", "Unsecured education loan"),
        ("LOAN_AGAINST", "Loan against property"),
        ("LOAN_AGAINST","Loan against shares"),
        ("GOLD", "Gold loan"),
        ("SECURED_EDUCATION", "Secured education loan"),
        ("SUPPLY_CHAIN", "Supply chain finance"),
        ("BILL_INVOICE", "Bill/Invoice Discounting"),
        ("VIRTUAL_CARD", "Virtual card"),
        ("CREDIT_LINE", "Credit line"),
        ("AGRICULTURE", "Agricultureal Loan"),
        ("MICROFINANCE", "Microfinance loan"),
        ("EQUIPMENT", "Equipement financing"),
        ("MEDICAL_EMERGENCY", "Medical emergency loan"),
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

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product_name
