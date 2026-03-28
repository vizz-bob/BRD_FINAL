from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Lead

# PipelineLead removed from project.
# No automatic lead creation required anymore.
# Keeping file to avoid import errors from apps.py.
