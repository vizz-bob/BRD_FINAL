# checked_lead/apps.py
from django.apps import AppConfig

class CheckedLeadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'checked_lead'

    def ready(self):
        import checked_lead.signals
