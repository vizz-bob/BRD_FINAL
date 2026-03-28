from django.db import models
from .choices import QualificationStatus


class QualifiedLead(models.Model):

    pipeline_lead = models.OneToOneField(
        "pipeline.PipelineLead",
        on_delete=models.CASCADE,
        related_name="qualification",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(null=True, blank=True)
    # lead_id = models.CharField(max_length=50, unique=True)

    status = models.CharField(
        max_length=20,
        choices=QualificationStatus.choices,
        default=QualificationStatus.UNDER_REVIEW
    )

    INTEREST_CHOICES = [
        ("home_loan", "Home Loan"),
        ("personal_loan", "Personal Loan"),
        ("car_loan", "Car Loan"),
        ("credit_card", "Credit Card"),
        ("business_loan", "Business Loan"),
        ("education_loan", "Education Loan"),
        ("other", "Other Services"),
    ]

    interest = models.CharField(
        max_length=50,
        choices=INTEREST_CHOICES,
        default="home_loan"
    )

    score = models.IntegerField(default=0)
    next_follow_up = models.DateField(null=True, blank=True)

    PRIORITY_CHOICES = [
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    
    NEXT_ACTION_CHOICES = [
        ("call", "Schedule Call"),
        ("meeting", "Schedule Meeting"),
        ("follow_up", "Follow-up"),
        ("document_collection", "Collect Documents"),
        ("eligibility_check", "Run Eligibility Check"),
    ]
    
    # Missing fields from frontend integration
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    next_action = models.CharField(max_length=50, choices=NEXT_ACTION_CHOICES, null=True, blank=True)
    qualification_notes = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def lead_name(self):
        return getattr(self.pipeline_lead.lead, "name", "N/A") if self.pipeline_lead else "N/A"

    def lead_phone(self):
        return getattr(self.pipeline_lead.lead, "phone", "N/A") if self.pipeline_lead else "N/A"

    def __str__(self):
        return f"{self.lead_name()} → {self.status}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        
        # Sync name, phone, and email back to initial lead if they changed
        if self.pipeline_lead and self.pipeline_lead.lead:
            lead = self.pipeline_lead.lead
            
            # If new, pull values from lead
            if is_new:
                if not self.name: self.name = lead.name
                if not self.phone_number: self.phone_number = lead.phone
                if not self.email: self.email = lead.email
            else:
                # If update, sync back to lead
                changed = False
                if self.name and lead.name != self.name:
                    lead.name = self.name
                    changed = True
                if self.phone_number and lead.phone != self.phone_number:
                    lead.phone = self.phone_number
                    changed = True
                if self.email and lead.email != self.email:
                    lead.email = self.email
                    changed = True
                if changed:
                    lead.save()

        super().save(*args, **kwargs)

        # Log Contact History on update
        if not is_new:
            try:
                from .models import ContactLead
                ContactLead.objects.create(
                    qualified_lead=self,
                    lead_name=self.name,
                    phone_number=self.phone_number,
                    email=self.email or "",
                    city=self.city or "",
                    status=self.status,
                    interest_area=self.interest,
                    expected_loan_amount=self.loan_amount,
                    next_action=self.next_action,
                    qualification_notes=self.qualification_notes
                )
            except Exception as e:
                print(f"Error logging contact: {e}")

class ContactLead(models.Model):
    qualified_lead = models.ForeignKey(
        "QualifiedLead",
        on_delete=models.CASCADE,
        related_name="contacts",
        null=True,
        blank=True
    )

    lead_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    city = models.CharField(max_length=100)

    STATUS_CHOICES = [
        ("new", "New"),
        ("hot", "Hot Lead"),
        ("ineligible", "Ineligible"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")

    created_at = models.DateTimeField(auto_now_add=True)

    # ✅ Interest & Requirement Fields

    INTEREST_CHOICES = [
        ("select", "Select Interest Area / Product"),
        ("home_loan", "Home Loan"),
        ("personal_loan", "Personal Loan"),
        ("car_loan", "Car Loan"),
        ("credit_card", "Credit Card"),
        ("business_loan", "Business Loan"),
        ("education_loan", "Education Loan"),
        ("other_services", "Other Services"),
    ]

    interest_area = models.CharField(
        max_length=50,
        choices=INTEREST_CHOICES,
        null=True,
        blank=True
    )

    expected_loan_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    next_follow_up_date = models.DateField(
        null=True,
        blank=True
    )

    NEXT_ACTION_CHOICES = [
        ("select", "Select Next Action"),
        ("schedule_meeting", "Schedule Meeting"),
        ("schedule_call", "Schedule Call"),
        ("follow_up", "Follow Up"),
        ("documents", "Collect Documents"),
        ("run_eligibility_check", "Run Eligibility Check"),
    ]

    next_action = models.CharField(
        max_length=50,
        choices=NEXT_ACTION_CHOICES,
        null=True,
        blank=True
    )

    qualification_notes = models.TextField(
        null=True,
        blank=True
    )

    def __str__(self):
        return self.lead_name



class DocumentCollection(models.Model):

    lead = models.ForeignKey("qualified_leads.QualifiedLead", on_delete=models.CASCADE, related_name="documents")

    # Required Documents
    pan_card = models.FileField(upload_to="documents/", null=True, blank=True)
    aadhar_card = models.FileField(upload_to="documents/", null=True, blank=True)
    salary_slips = models.FileField(upload_to="documents/", null=True, blank=True)
    bank_statement = models.FileField(upload_to="documents/", null=True, blank=True)

    # Optional Documents
    employment_proof = models.FileField(upload_to="documents/", null=True, blank=True)
    address_proof = models.FileField(upload_to="documents/", null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def required_completed_count(self):
        required = [self.pan_card, self.aadhar_card, self.salary_slips, self.bank_statement]
        return sum(1 for doc in required if doc)

    def required_pending_count(self):
        return 4 - self.required_completed_count()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update eligibility document score
        try:
            eligibility = self.lead.eligibility
            count = self.required_completed_count()
            eligibility.document_score = int((count / 4) * 100)
            eligibility.save()
        except:
            pass

    def __str__(self):
        return f"{self.lead.name} Documents"


class Eligibility(models.Model):
    lead = models.OneToOneField("QualifiedLead", on_delete=models.CASCADE, related_name="eligibility")

    document_score = models.IntegerField(default=0)
    income_score = models.IntegerField(default=0)
    credit_score = models.IntegerField(default=0)
    property_score = models.IntegerField(default=0)

    overall_percentage = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default="Under Review")

    updated_at = models.DateTimeField(auto_now=True)

    def calculate_overall(self):
        total = (
            self.document_score +
            self.income_score +
            self.credit_score +
            self.property_score
        ) / 4
        self.overall_percentage = int(total)

        if self.overall_percentage >= 75:
            self.status = "Eligible"
        elif self.overall_percentage >= 50:
            self.status = "Under Review"
        else:
            self.status = "Ineligible"

    def save(self, *args, **kwargs):
        self.calculate_overall()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.lead.name} Eligibility"


