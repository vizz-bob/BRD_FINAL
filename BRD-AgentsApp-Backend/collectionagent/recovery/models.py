from django.db import models
from django.conf import settings
from django.utils.timezone import now
from collectionagent.accounts.models import CollectionAccount


def get_today():
    """Returns today's date for Payment collection_date default."""
    return now().date()


class Payment(models.Model):
    account = models.ForeignKey(CollectionAccount, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=10, choices=[('Cash','Cash'),('UPI','UPI'),('Cheque','Cheque'),('NEFT','NEFT'),('RTGS','RTGS')])
    collection_date = models.DateField(default=get_today)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class RecoveryFollowUp(models.Model):
    account = models.ForeignKey(CollectionAccount, on_delete=models.CASCADE)
    followup_type = models.CharField(max_length=10, choices=[('Call','Phone Call'),('Visit','Field Visit'),('PTP','Promise to Pay')])
    disposition = models.CharField(max_length=20, choices=[('Right','Right Party Contact'),('Wrong','Wrong Party Contact'),('No Contact','No Contact'),('Switched Off','Switched Off'),('Call Back','Call Back Later'),('PTP','Promise to Pay')])
    contact_person = models.CharField(max_length=20, choices=[('Self','Self'),('Spouse','Spouse'),('Family','Family Member')])
    ptp_date = models.DateField(null=True, blank=True)
    ptp_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    voice_recording = models.FileField(upload_to='recordings/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Vehicle(models.Model):
    account = models.ForeignKey(CollectionAccount, on_delete=models.CASCADE)
    vehicle_number = models.CharField(max_length=20, unique=True)
    model_name = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=[('Pending','Pending'),('Repossessed','Repossessed'),('In Yard','In Yard')], default='Pending')
    priority = models.CharField(max_length=10, choices=[('Low','Low'),('High','High'),('Urgent','Urgent')], default='Low')
    dpd = models.IntegerField()
    overdue_amount = models.FloatField()
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class RecoveryActivity(models.Model):
    ACTION_CHOICES = [
        ('Scan', 'Scan'),
        ('Repossessed', 'Repossessed'),
        ('Yard Entry', 'Yard Entry'),
    ]

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=[('Scan','Scan'),('Repossessed','Repossessed'),('Yard Entry','Yard Entry')])
    note = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


# =========================
# YARD ENTRY MODELS
# =========================
class YardEntry(models.Model):
    vehicle = models.OneToOneField(
        "Vehicle",
        on_delete=models.CASCADE,
        related_name="yard_entry"
    )

    odometer_reading = models.IntegerField(null=True, blank=True)
    FUEL_LEVEL = [
        ('Empty', 'Empty'),
        ('Quarter', 'Quarter'),
        ('Three Quarter', 'Three Quarter'),
        ('Full', 'Full')
    ]

    VEHICLE_CONDITION = [
        ('Excellent', 'Excellent'),
        ('Good', 'Good'),
        ('Fair', 'Fair'),
        ('Poor', 'Poor')
    ]

    TYRES_CONDITION = [
        ('Excellent', 'Excellent'),
        ('Good', 'Good'),
        ('Fair', 'Fair'),
        ('Poor', 'Poor')
    ]

    fuel_level = models.CharField(max_length=20, choices=FUEL_LEVEL, null=True, blank=True)
    vehicle_condition = models.CharField(max_length=20, choices=VEHICLE_CONDITION, null=True, blank=True)
    tyres_condition = models.CharField(max_length=20, choices=TYRES_CONDITION, null=True, blank=True)
    spare_tyre = models.BooleanField(default=False)
    jack = models.BooleanField(default=False)
    toolkit = models.BooleanField(default=False)
    floor_mats = models.BooleanField(default=False)
    music_system = models.BooleanField(default=False)

    rc_available = models.BooleanField(default=False)
    insurance_available = models.BooleanField(default=False)
    pollution_available = models.BooleanField(default=False)
    servicebook_available = models.BooleanField(default=False)

    damages = models.TextField(null=True, blank=True)
    AdditionalNotes= models.TextField(null=True, blank=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class YardPhoto(models.Model):
    yard_entry = models.ForeignKey(
        YardEntry,
        on_delete=models.CASCADE,
        related_name="photos"
    )
    image = models.ImageField(upload_to="yard_photos/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

class RecoveryRepossessionHistory(models.Model):

    STATUS_CHOICES = (
        ('in_yard', 'In Yard'),
        ('auctioned', 'Auctioned'),
        ('released', 'Released'),
    )

    account = models.ForeignKey(CollectionAccount, on_delete=models.CASCADE, related_name='repossessions')
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    vehicle_number = models.CharField(max_length=20)
    vehicle_name = models.CharField(max_length=100)

    customer_name = models.CharField(max_length=100)

    repossession_date = models.DateField()
    repossession_time = models.TimeField()

    location = models.CharField(max_length=255)

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    loan_account_number = models.CharField(max_length=50)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_yard')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle_number} - {self.status}"

class VehicleScan(models.Model):
    vehicle_number = models.CharField(max_length=20)
    file = models.FileField(upload_to='vehicle_scans/', null=True, blank=True)  # ✅ add this
    scanned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle_number} - {self.scanned_at}"


class Account(models.Model):
    account_name = models.CharField(max_length=255)
    vehicle_number = models.CharField(max_length=20, unique=True)
    loan_id = models.CharField(max_length=50)
    overdue_amount = models.DecimalField(max_digits=12, decimal_places=2)
    location = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.account_name} ({self.vehicle_number})"

class SimpleRepossessionHistory(models.Model):
    account = models.ForeignKey(CollectionAccount, on_delete=models.CASCADE)
    status = models.CharField(max_length=100)
    remarks = models.TextField(blank=True, null=True)
    repossessed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.account} - {self.status}"


 