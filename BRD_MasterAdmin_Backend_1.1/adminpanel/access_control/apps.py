from django.apps import AppConfig

class AccessControlConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "adminpanel.access_control"

    def ready(self):
        import adminpanel.access_control.signals