from django.apps import AppConfig


class RecoveryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'collectionagent.recovery'

    def ready(self):
        import collectionagent.recovery.signals
