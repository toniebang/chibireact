from django.apps import AppConfig


class VeluxappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'veluxapp'
    
    def ready(self):
        import veluxapp.signals