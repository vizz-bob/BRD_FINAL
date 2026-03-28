from django.db import models


class LeadStatus(models.TextChoices):
    NEW = "NEW", "New"
    ATTEMPTED = "ATTEMPTED", "Attempted"
    NOT_INTERESTED = "NOT_INTERESTED", "Not Interested"


class Lead(models.Model):

    status = models.CharField(
        max_length=20,
        choices=LeadStatus.choices,
        default=LeadStatus.NEW
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lead → {self.status}"
