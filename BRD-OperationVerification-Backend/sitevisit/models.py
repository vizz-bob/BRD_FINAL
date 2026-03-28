from django.db import models


class SiteVisitReport(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("COMPLETED", "Completed"),
    ]

    title = models.CharField(max_length=200)
    location = models.CharField(max_length=255)
    visit_date = models.DateField()
    action = models.OneToOneField(
        'dashboard.PendingTask',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        limit_choices_to={'action': 'COMPLETE'}
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    observations = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def photos_count(self):
        return self.photos.count()

    def __str__(self):
        return self.title


class SiteVisitPhoto(models.Model):

    report = models.ForeignKey(
        SiteVisitReport,
        related_name="photos",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="site_visits/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.report.title}"


class Recommendation(models.Model):

    report = models.ForeignKey(
        SiteVisitReport,
        related_name="recommendations",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class Rejected(models.Model):

    DOC_TYPE_CHOICES = [
        ("ITR", "ITR Form 16"),
        ("PAN", "PAN Card"),
        ("AADHAAR", "Aadhaar Card"),
        ("OTHER", "Other"),
    ]

    action = models.OneToOneField(
        'dashboard.PendingTask',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        limit_choices_to={'action': 'REJECTED'}
    )

    # ── Core fields expected by DocumentRejections.jsx ──────────────────────
    title = models.CharField(max_length=200)
    reason = models.CharField(max_length=255)
    description = models.TextField()
    doc_type = models.CharField(
        max_length=50,
        choices=DOC_TYPE_CHOICES,
        default="OTHER"
    )
    frequency = models.PositiveIntegerField(default=1)
    pattern = models.TextField(null=True, blank=True)  # null = no pattern detected

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reason} — {self.doc_type}"
