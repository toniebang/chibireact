# backend/storages_backends.py

from storages.backends.s3boto3 import S3Boto3Storage
from decouple import config
import logging # <--- Añade esto
import os # <--- Añade esto si no está ya

logger = logging.getLogger(__name__) # <--- Añade esto

class MediaStorage(S3Boto3Storage):
    """
    Almacenamiento personalizado para archivos media (imágenes subidas por usuarios).
    """
    location = config('AWS_LOCATION', default='media')
    default_acl = 'public-read'
    file_overwrite = False

    def __init__(self, *args, **kwargs): # <--- Añade este método
        super().__init__(*args, **kwargs)
        logger.info("MediaStorage: Inicializando MediaStorage personalizado.")
        logger.info(f"MediaStorage: Ubicación (location): {self.location}")
        logger.info(f"MediaStorage: ACL por defecto: {self.default_acl}")

        # Puedes añadir más logs aquí para depuración
        if not self.location:
            logger.error("MediaStorage: AWS_LOCATION no está configurado!")
        else:
            logger.info(f"MediaStorage: AWS_LOCATION cargado: {self.location}")

        # Log de variables de entorno de AWS, si es necesario, pero ¡CENSURA SECRETOS!
        # logger.info(f"MediaStorage: AWS_ACCESS_KEY_ID (primeros 4): {os.environ.get('DO_SPACES_KEY', '')[:4]}")
        # logger.info(f"MediaStorage: AWS_STORAGE_BUCKET_NAME: {os.environ.get('DO_SPACES_NAME', '')}")


    def _save(self, name, content): # <--- Añade logs a este método
        logger.info(f"MediaStorage: Intentando guardar archivo: {name}")
        logger.info(f"MediaStorage: Tipo de contenido: {content.file.content_type if hasattr(content, 'file') and hasattr(content.file, 'content_type') else 'Desconocido'}")
        try:
            result = super()._save(name, content)
            logger.info(f"MediaStorage: Método _save de S3Boto3Storage completado para: {name}")
            return result
        except Exception as e:
            logger.error(f"MediaStorage: Error al guardar archivo {name}: {e}", exc_info=True)
            raise # Re-lanza la excepción para que Django la maneje
        
class StaticStorage(S3Boto3Storage): # <-- ¡ASEGÚRATE DE TENER ESTA CLASE DEFINIDA!
    location = config('AWS_LOCATION_STATIC', default='static') # Puedes usar una ubicación diferente para estáticos
    default_acl = 'public-read'
    file_overwrite = True #