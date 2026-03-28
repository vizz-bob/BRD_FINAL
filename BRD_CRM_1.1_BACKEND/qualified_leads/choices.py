# qualified_leads/choices.py
from django.db import models

# class QualificationStatus(models.TextChoices):
#     UNDER_REVIEW = "Under Review", "Under Review"
#     QUALIFIED = "Qualified", "Qualified"
#     NOT_QUALIFIED = "Not Qualified", "Not Qualified"

class QualificationStatus(models.TextChoices):
    All_Status="ALL", "All"
    ELIGIBLE = "ELIGIBLE", "Eligible"
    DOCUMENTS_PENDING = "DOCUMENTS_PENDING", "Documents Pending"
    UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
    INELIGIBLE = "INELIGIBLE", "Ineligible"
