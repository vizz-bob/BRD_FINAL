from django.apps import AppConfig


class collectionagent(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'collectionagent'

    def ready(self):
        import collectionagent.recovery.signals