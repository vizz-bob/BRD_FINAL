from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Tenant(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=[('Bank', 'Bank'), ('NBFC', 'NBFC')])
    email = models.EmailField(blank=True, null=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
class Loan(models.Model):
    loan_id = models.CharField(max_length=50, unique=True)
    borrower_name = models.CharField(max_length=255)
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.loan_id} - {self.borrower_name}"



class Setting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)

    def __str__(self):
        return f"Settings for {self.user.username}"

class Dashboard(models.Model):
    total_disbursed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pending_disbursement = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    collection_rate = models.FloatField(default=0)
    overdue_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dashboard - {self.created_at.strftime('%Y-%m-%d')}" 
       
# class Disbursement(models.Model):

#     PAYMENT_METHOD_CHOICES = [
#         ('BANK_TRANSFER', 'Bank Transfer'),
#         ('RTGS', 'RTGS'),
#         ('NEFT', 'NEFT'),
#     ]

#     STATUS_CHOICES = [
#         ('Pending', 'Pending'),
#         ('Paid', 'Paid'),
#         ('Failed', 'Failed'),
#     ]

#     disbursement_id = models.CharField(max_length=50, unique=True)
#     loan_id = models.CharField(max_length=50)
#     recipient_name = models.CharField(max_length=255)
#     amount = models.DecimalField(max_digits=12, decimal_places=2)
#     date = models.DateField()

#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES,
#         default='Pending'
#     )

#     payment_method = models.CharField(
#         max_length=20,
#         choices=PAYMENT_METHOD_CHOICES
#     )

#     def __str__(self):
#         return self.disbursement_id

class Disbursement(models.Model):

    PAYMENT_METHOD_CHOICES = [
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('RTGS', 'RTGS'),
        ('NEFT', 'NEFT'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
    ]

    disbursement_id = models.CharField(max_length=50, unique=True)
    # loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, null=True)
    recipient_name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)

    def __str__(self):
        return self.disbursement_id



    # def __str__(self):
    #     return self.disbursement_id

class ReconciliationTransaction(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    transaction_date = models.DateField()
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    STATUS_CHOICES = [
        ('Reconciled', 'Reconciled'),
        ('Unreconciled', 'Unreconciled'),
        ('Pending', 'Pending'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"Txn {self.transaction_id}: {self.description}"

# class Repayment(models.Model):
#     repayment_id = models.CharField(max_length=50, unique=True)
#     loan_id = models.CharField(max_length=50)
#     borrower_name = models.CharField(max_length=255)
#     amount_due = models.DecimalField(max_digits=12, decimal_places=2)
#     due_date = models.DateField()
#     STATUS_CHOICES = [
#         ('Pending', 'Pending'),
#         ('Overdue', 'Overdue'),
#         ('Paid', 'Paid'),
#     ]
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES)
#     repayment_type = models.CharField(max_length=50)
#     paid_date = models.DateField(blank=True, null=True)

#     def __str__(self):
#         return self.repayment_id


class Repayment(models.Model):
    repayment_id = models.CharField(max_length=50, unique=True)
    # loan = models.ForeignKey(Loan, on_delete=models.CASCADE)  # <-- CHANGE HERE
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, null=True, blank=True)
    borrower_name = models.CharField(max_length=255)
    amount_due = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateField()

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Overdue', 'Overdue'),
        ('Paid', 'Paid'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    repayment_type = models.CharField(max_length=50)
    paid_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.repayment_id
    
class PaymentRecord(models.Model):
    repayment = models.ForeignKey(Repayment, on_delete=models.CASCADE, related_name='payments')
    recorded_at = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

class Reminder(models.Model):
    repayment = models.ForeignKey(Repayment, on_delete=models.CASCADE, related_name='reminders')
    sent_at = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=20, default='email')




# class QuickAction(models.Model):
#     name = models.CharField(max_length=100)
#     url = models.CharField(max_length=200)
#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return self.name




# from django.db import models
# from django.contrib.auth import get_user_model

# User = get_user_model()


# class Tenant(models.Model):
#     name = models.CharField(max_length=255)
#     type = models.CharField(max_length=50, choices=[('Bank', 'Bank'), ('NBFC', 'NBFC')])
#     email = models.EmailField(blank=True, null=True)
#     active = models.BooleanField(default=True)

#     def __str__(self):
#         return self.name


# class Setting(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     email_notifications = models.BooleanField(default=True)
#     sms_notifications = models.BooleanField(default=False)

#     def __str__(self):
#         return f"Settings for {self.user.username}"


# # ✅ NEW Loan Model (For ForeignKey)
# class Loan(models.Model):
#     loan_id = models.CharField(max_length=50, unique=True)

#     def __str__(self):
#         return self.loan_id


# # ✅ UPDATED Disbursement Model
# class Disbursement(models.Model):

#     STATUS_CHOICES = [
#         ('Paid', 'Paid'),
#         ('Pending', 'Pending'),
#         ('Failed', 'Failed'),
#     ]

#     PAYMENT_METHOD_CHOICES = [
#         ('BANK_TRANSFER', 'Bank Transfer'),
#         ('RTGS', 'RTGS'),
#         ('NEFT', 'NEFT'),
#     ]

#     disbursement_id = models.CharField(max_length=50, unique=True)

#     # ✅ ForeignKey to Loan
#     loan = models.ForeignKey(
#         Loan,
#         on_delete=models.CASCADE,
#         related_name='disbursements'
#     )

#     recipient_name = models.CharField(max_length=255)
#     amount = models.DecimalField(max_digits=12, decimal_places=2)
#     date = models.DateField()

#     # ✅ Status Dropdown
#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES,
#         default='Pending'
#     )

#     # ✅ Payment Method Dropdown
#     payment_method = models.CharField(
#         max_length=20,
#         choices=PAYMENT_METHOD_CHOICES
#     )

#     def __str__(self):
#         return self.disbursement_id 


# class ReconciliationTransaction(models.Model):
#     transaction_id = models.AutoField(primary_key=True)
#     transaction_date = models.DateField()
#     description = models.CharField(max_length=255)
#     amount = models.DecimalField(max_digits=12, decimal_places=2)

#     STATUS_CHOICES = [
#         ('Reconciled', 'Reconciled'),
#         ('Unreconciled', 'Unreconciled'),
#         ('Pending', 'Pending'),
#     ]

#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

#     def __str__(self):
#         return f"Txn {self.transaction_id}: {self.description}"


# class Repayment(models.Model):
#     repayment_id = models.CharField(max_length=50, unique=True)
#     loan_id = models.CharField(max_length=50)
#     borrower_name = models.CharField(max_length=255)
#     amount_due = models.DecimalField(max_digits=12, decimal_places=2)
#     due_date = models.DateField()

#     STATUS_CHOICES = [
#         ('Pending', 'Pending'),
#         ('Overdue', 'Overdue'),
#         ('Paid', 'Paid'),
#     ]

#     status = models.CharField(max_length=20, choices=STATUS_CHOICES)
#     repayment_type = models.CharField(max_length=50)
#     paid_date = models.DateField(blank=True, null=True)

#     def __str__(self):
#         return self.repayment_id


# class PaymentRecord(models.Model):
#     repayment = models.ForeignKey(Repayment, on_delete=models.CASCADE, related_name='payments')
#     recorded_at = models.DateTimeField(auto_now_add=True)
#     amount = models.DecimalField(max_digits=12, decimal_places=2)


# class Reminder(models.Model):
#     repayment = models.ForeignKey(Repayment, on_delete=models.CASCADE, related_name='reminders')
#     sent_at = models.DateTimeField(auto_now_add=True)
#     method = models.CharField(max_length=20, default='email')