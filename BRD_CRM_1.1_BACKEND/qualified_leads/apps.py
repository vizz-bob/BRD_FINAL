from django.apps import AppConfig

class YourAppNameConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "qualified_leads"

    def ready(self):
        import qualified_leads.signals
