from django.db import models
from django.core.exceptions import ValidationError
from datetime import date, time


# =====================================================
# 1. Financial Year
# =====================================================
class ManageFinancialYear(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    name = models.CharField(max_length=20, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="inactive")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_date"]

    def clean(self):
        if self.start_date.month != 4 or self.start_date.day != 1:
            raise ValidationError({"start_date": "Financial year must start on April 1"})
        if self.end_date.month != 3 or self.end_date.day != 31:
            raise ValidationError({"end_date": "Financial year must end on March 31"})
        if self.start_date.year + 1 != self.end_date.year:
            raise ValidationError("Financial year must span exactly one year")

    def save(self, *args, **kwargs):
        # Set name before validation
        self.name = f"FY {self.start_date.year}-{str(self.end_date.year)[-2:]}"
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# =====================================================
# 2. Assessment Year
# =====================================================
class ManageAssessmentYear(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    financial_year = models.OneToOneField(
        ManageFinancialYear,
        on_delete=models.CASCADE,
        related_name="assessment_year"
    )

    name = models.CharField(max_length=20, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="inactive")

    # Configuration
    financial_eligibility_years = models.PositiveIntegerField(default=3)
    document_compliance_required = models.BooleanField(default=True)
    credit_assessment_enabled = models.BooleanField(default=True)
    itr_years_required = models.PositiveIntegerField(default=3)
    loan_type_specific = models.BooleanField(default=False)
    borrower_type_specific = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.financial_year:
            raise ValidationError({"financial_year": "Financial Year is required"})

        fy = self.financial_year

        # Ensure FY is active
        if fy.status != "active":
            raise ValidationError({"financial_year": "Assessment Year must be linked to an active Financial Year"})

        expected_start = date(fy.start_date.year + 1, 4, 1)
        expected_end = date(fy.start_date.year + 2, 3, 31)

        if self.start_date != expected_start:
            raise ValidationError({"start_date": "Assessment Year must start on April 1 following the Financial Year"})
        if self.end_date != expected_end:
            raise ValidationError({"end_date": "Assessment Year must end on March 31"})

    def save(self, *args, **kwargs):
        fy = self.financial_year

        # Derive dates automatically
        self.start_date = date(fy.start_date.year + 1, 4, 1)
        self.end_date = date(fy.start_date.year + 2, 3, 31)

        # Set name
        self.name = f"AY {self.start_date.year}-{str(self.end_date.year)[-2:]}"

        # Validate and save
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# =====================================================
# 3. Reporting Period
# =====================================================
class ManageReportingPeriod(models.Model):
    name = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()

    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError("End date must be after start date")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# =====================================================
# 4. Holidays
# =====================================================
class ManageHoliday(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField(unique=True)

    def __str__(self):
        return f"{self.title} ({self.date})"


# =====================================================
# 5. Working Days
# =====================================================
class ManageWorkingDay(models.Model):
    DAY_CHOICES = (
        ("mon", "Monday"),
        ("tue", "Tuesday"),
        ("wed", "Wednesday"),
        ("thu", "Thursday"),
        ("fri", "Friday"),
        ("sat", "Saturday"),
        ("sun", "Sunday"),
    )

    day = models.CharField(max_length=3, choices=DAY_CHOICES, unique=True)
    is_working = models.BooleanField(default=True)

    def __str__(self):
        return dict(self.DAY_CHOICES)[self.day]


# =====================================================
# 6. Working Hours
# =====================================================
class ManageWorkingHour(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"


# =====================================================
# 7. Overtime
# =====================================================
class ManageOvertime(models.Model):
    enabled = models.BooleanField(default=False)
    rate_multiplier = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Example: 1.5 = 150%"
    )

    def __str__(self):
        return f"Enabled: {self.enabled}, Rate: {self.rate_multiplier}x"
