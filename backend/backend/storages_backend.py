# backend/storages_backends.py

from storages.backends.s3boto3 import S3Boto3Storage
from decouple import config

class MediaStorage(S3Boto3Storage):
    """
    Almacenamiento personalizado para archivos media (imágenes subidas por usuarios).
    """
    location = config('AWS_LOCATION', default='media') # Usa la ubicación definida en settings
    default_acl = 'public-read' # Hace que los archivos sean públicamente legibles
    file_overwrite = False # No sobrescribir archivos con el mismo nombre

    # Opcional: Si quieres un dominio personalizado (CDN) para los archivos media
    # custom_domain = config('AWS_S3_CUSTOM_DOMAIN', default=None)
    # if custom_domain:
    #     url_protocol = 'https:' if config('DEBUG', default=False, cast=bool) else 'https:' # Asegúrate de HTTPS en prod
    #     self.url = f'{url_protocol}//{self.custom_domain}/{self.location}/'
