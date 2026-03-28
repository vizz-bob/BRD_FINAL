# from django.db import models


# class Ticket(models.Model):

#     CATEGORY_CHOICES = (
#         ('TECHNICAL', 'Technical Issue'),
#         ('PAYMENT', 'Payment Issue'),
#         ('ACCOUNT', 'Account Issue'),
#         ('OTHER', 'Other'),
#     )

#     PRIORITY_CHOICES = (
#         ('LOW', 'Low'),
#         ('MEDIUM', 'Medium'),
#         ('HIGH', 'High'),
#     )

#     subject = models.CharField(max_length=255)
#     category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
#     priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
#     description = models.TextField()

#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         db_table = "support_tickets"
#         ordering = ['-created_at']

#     def __str__(self):
#         return self.subject



from django.db import models


class Ticket(models.Model):

    CATEGORY_CHOICES = (
        ('TECHNICAL', 'Technical Issue'),
        ('PAYMENT', 'Payment Issue'),
         ('REPAYMENT', 'Repayment Issue'), 
        ('ACCOUNT', 'Account Issue'),
        ('DISPUTE', 'Dispute'),           
        ('OTHER', 'Other'),
    )

    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL','Critical')
    )

    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
    )

    subject = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    description = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='OPEN'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "support_tickets"
        ordering = ['-created_at']

    def __str__(self):
        return f"#{self.id} - {self.subject}"
