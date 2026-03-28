import uuid
from django.db import models

STATUS_CHOICES = (
    ("ACTIVE", "Active"),
    ("INACTIVE", "Inactive"),
)

# -------------------------
# STAGE MASTER
# -------------------------
class DisbursementStage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stage_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return self.stage_name


# -------------------------
# AGENCY MASTER
# -------------------------
class DisbursementAgency(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agency_name = models.CharField(max_length=150)
    agency_type = models.CharField(max_length=100)
    contact_details = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return self.agency_name


# -------------------------
# FREQUENCY MASTER
# -------------------------
class DisbursementFrequency(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    frequency_label = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return self.frequency_label


# -------------------------
# DOCUMENT MASTER
# -------------------------
class DisbursementDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document_name = models.CharField(max_length=150)
    document_type = models.CharField(max_length=100)
    is_mandatory = models.BooleanField(default=False)

    applicable_stage = models.ForeignKey(
        DisbursementStage,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return self.document_name


# -------------------------
# DOWN PAYMENT MASTER
# -------------------------
class DownPayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    refundable = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.percentage}%"


# -------------------------
# THIRD PARTY MASTER
# -------------------------
class DisbursementThirdParty(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    third_party_name = models.CharField(max_length=150)
    role = models.CharField(max_length=100)
    contact_information = models.TextField(blank=True, null=True)

    associated_stages = models.ManyToManyField(
        DisbursementStage,
        blank=True
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return self.third_party_name


# -------------------------
# DISBURSEMENT MASTER
# -------------------------
class Disbursement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    disbursement_name = models.CharField(max_length=150)

    agency = models.ForeignKey(DisbursementAgency, on_delete=models.PROTECT)
    frequency = models.ForeignKey(DisbursementFrequency, on_delete=models.PROTECT)

    required_documents = models.ManyToManyField(
        DisbursementDocument,
        blank=True
    )

    third_party = models.ForeignKey(
        DisbursementThirdParty,
        on_delete=models.PROTECT
    )

    down_payment = models.ForeignKey(
        DownPayment,
        on_delete=models.PROTECT
    )

    down_payment_stage = models.ForeignKey(
        DisbursementStage,
        on_delete=models.PROTECT
    )

    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)  # <-- add this

    def __str__(self):
        return self.disbursement_name
