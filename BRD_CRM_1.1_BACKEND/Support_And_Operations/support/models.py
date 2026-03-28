from django.db import models

PRIORITY_CHOICES = [
    ('Low', 'Low'),
    ('Medium', 'Medium'),
    ('High', 'High'),
    ('Critical', 'Critical'),
]

CATEGORY_CHOICES = [
    ('Technical', 'Technical'),
    ('Document', 'Document'),
    ('KYC', 'KYC'),
    ('Disbursement', 'Disbursement'),
    ('Portal Access', 'Portal Access'),
    ('Others', 'Others'),
]

SUB_CATEGORY_CHOICES = [
    # Technical
    ("Login Issue", "Login Issue"),
    ("Bug", "Bug"),
    ("Performance", "Performance"),

    # Document
    ("Upload Failed", "Upload Failed"),
    ("Incorrect Document", "Incorrect Document"),

    # KYC
    ("Rejected", "Rejected"),
    ("Pending", "Pending"),
    ("Mismatch", "Mismatch"),

    # Disbursement
    ("Delay", "Delay"),
    ("Amount Mismatch", "Amount Mismatch"),

    # Portal Access
    ("Access Denied", "Access Denied"),
    ("Role Issue", "Role Issue"),

    # Others
    ("General", "General"),
]


ASSIGNED_TO_CHOICES = [
    ('Support Team', 'Support Team'),
    ('IT Support', 'IT Support'),
    ('Ops Team', 'Ops Team'),
]

TICKET_TYPE_CHOICES = [
    ('Complaint', 'Complaint'),
    ('Request', 'Request'),
    ('Query', 'Query'),
]
STATUS_CHOICES = [
    ('IN_progress', 'in_progress'),
    ('open', 'open'),
    ('escalated', 'escalated'),
]

class Ticket(models.Model):
    ticket_id = models.CharField(max_length=20, unique=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    sub_category = models.CharField(
        max_length=50,
        choices=SUB_CATEGORY_CHOICES
    )

    ticket_type = models.CharField(
        max_length=20,
        choices=TICKET_TYPE_CHOICES
    )

    assigned_to = models.CharField(
        max_length=50,
        choices=ASSIGNED_TO_CHOICES
    )
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES
    )

    customer_id = models.CharField(max_length=255)

    attachment = models.FileField(
        upload_to="attachments/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
    def save(self, *args, **kwargs):
        if not self.ticket_id:
            last_ticket = Ticket.objects.order_by('-id').first()

            if last_ticket and last_ticket.ticket_id:
                last_number = int(last_ticket.ticket_id.split('-')[1])
                new_number = last_number + 1
            else:
                new_number = 1

            self.ticket_id = f"SUP-{new_number:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.ticket_id
