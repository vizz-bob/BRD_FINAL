from django.db import models
from django.contrib.auth.models import User


TRAINING_FORMAT_CHOICES = [
    ('Video', 'Video'),
    ('Document', 'Document'),
    ('Live Session', 'Live Session'),
    ('Quiz', 'Quiz'),
]

COMPLETION_STATUS_CHOICES = [
    ('Not Started', 'Not Started'),
    ('In Progress', 'In Progress'),
    ('Completed', 'Completed'),
]

CATEGORY_CHOICES = [
    ('Onboarding', 'Onboarding'),
    ('Product Knowledge', 'Product Knowledge'),
    ('Soft Skills', 'Soft Skills'),
    ('Process', 'Process'),
]


class Training(models.Model):

    training_id = models.AutoField(primary_key=True)

    # TRN-001 style code
    training_code = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    training_title = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True
    )

    assigned_to = models.ManyToManyField(
        User,
        related_name='assigned_trainings',
        blank=True
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        blank=True,
        null=True
    )

    training_format = models.CharField(
        max_length=20,
        choices=TRAINING_FORMAT_CHOICES
    )

    trainer_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    training_material = models.FileField(
        upload_to='training_materials/',
        blank=True,
        null=True
    )

    quiz_file = models.FileField(
        upload_to='quiz_files/',
        blank=True,
        null=True
    )

    thumbnail = models.CharField(
        max_length=10,
        blank=True,
        null=True
    )

    duration = models.DurationField(
        blank=True,
        null=True
    )

    start_date = models.DateField()
    end_date = models.DateField()

    due_date = models.DateField(
        blank=True,
        null=True
    )

    progress = models.IntegerField(
        default=0,
        help_text="Completion percentage"
    )

    completion_status = models.CharField(
        max_length=20,
        choices=COMPLETION_STATUS_CHOICES,
        default='Not Started'
    )

    score = models.IntegerField(
        blank=True,
        null=True
    )

    feedback = models.TextField(
        blank=True,
        null=True
    )

    feedback_rating = models.IntegerField(
        blank=True,
        null=True
    )

    assessment_required = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.training_code} - {self.training_title}"