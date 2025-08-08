# veluxapp/signals.py

import logging
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Productos
from botocore.exceptions import BotoCoreError, ClientError

logger = logging.getLogger(__name__)


def borrar_imagen(imagen):
    """
    Elimina una imagen del almacenamiento si existe.
    Maneja errores para evitar que afecte al flujo principal.
    """
    if not imagen:
        return

    try:
        if hasattr(imagen, "name") and imagen.name:
            imagen.delete(save=False)
            logger.debug(f"Imagen eliminada: {imagen.name}")
    except (BotoCoreError, ClientError, OSError) as e:
        logger.warning(f"No se pudo eliminar la imagen {getattr(imagen, 'name', None)}: {e}")


@receiver(post_delete, sender=Productos)
def eliminar_imagenes_producto(sender, instance, **kwargs):
    """
    Elimina todas las imágenes de Spaces cuando se borra un producto.
    """
    for campo in ("imagen1", "imagen2", "imagen3"):
        borrar_imagen(getattr(instance, campo, None))


@receiver(pre_save, sender=Productos)
def reemplazar_imagenes_producto(sender, instance, **kwargs):
    """
    Borra las imágenes antiguas solo si fueron reemplazadas en una actualización.
    """
    if not instance.pk:
        return  # Producto nuevo

    try:
        old_instance = Productos.objects.only("imagen1", "imagen2", "imagen3").get(pk=instance.pk)
    except Productos.DoesNotExist:
        return

    for campo in ("imagen1", "imagen2", "imagen3"):
        imagen_antigua = getattr(old_instance, campo, None)
        imagen_nueva = getattr(instance, campo, None)

        if imagen_antigua and imagen_antigua != imagen_nueva:
            borrar_imagen(imagen_antigua)
