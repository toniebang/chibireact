# veluxapp/forms.py
from django import forms
from .models import Productos # ¡CORREGIDO: Usar Productos!
import logging

logger = logging.getLogger(__name__)

class ProductoAdminForm(forms.ModelForm):
    class Meta:
        model = Productos # ¡CORREGIDO: Usar Productos!
        fields = '__all__' # O lista tus campos explícitamente

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)

        super().__init__(*args, **kwargs)
        logger.info("!!! FORM_DEBUG: ProductoAdminForm inicializado.")

        if self.request:
            logger.info(f"!!! FORM_DEBUG: Método de la petición (Request method): {self.request.method}")
            logger.info(f"!!! FORM_DEBUG: Request META Content-Type: {self.request.META.get('CONTENT_TYPE')}")
            logger.info(f"!!! FORM_DEBUG: Request META Content-Length: {self.request.META.get('CONTENT_LENGTH')}")
            logger.info(f"!!! FORM_DEBUG: Request FILES (raw): {self.request.FILES}")

        if self.is_bound:
            logger.info("!!! FORM_DEBUG: Formulario 'bound'.")
            logger.info(f"!!! FORM_DEBUG: Archivos del formulario (files): {self.files}")

            if 'imagen1' in self.files: # Usar nombres de campos reales: imagen1, imagen2, imagen3
                logger.info(f"!!! FORM_DEBUG: Archivo de imagen encontrado en los archivos del formulario (imagen1): {self.files['imagen1'].name}")
            elif 'imagen2' in self.files:
                logger.info(f"!!! FORM_DEBUG: Archivo de imagen encontrado en los archivos del formulario (imagen2): {self.files['imagen2'].name}")
            elif 'imagen3' in self.files:
                logger.info(f"!!! FORM_DEBUG: Archivo de imagen encontrado en los archivos del formulario (imagen3): {self.files['imagen3'].name}")
            else:
                logger.warning("!!! FORM_DEBUG: Archivo de imagen NO encontrado en los archivos del formulario. (self.files está vacío o las claves son diferentes)")
        else:
            logger.info("!!! FORM_DEBUG: Formulario 'unbound'. (Para peticiones GET)")


    def clean(self):
        cleaned_data = super().clean()
        logger.info("!!! FORM_DEBUG: Método clean() llamado.")
        for img_field in ['imagen1', 'imagen2', 'imagen3']:
            if img_field in cleaned_data and cleaned_data[img_field]:
                logger.info(f"!!! FORM_DEBUG: Datos limpios tienen imagen en '{img_field}': {cleaned_data[img_field].name}")
            else:
                logger.info(f"!!! FORM_DEBUG: No hay imagen en los datos limpios para '{img_field}'.")
        return cleaned_data

    def save(self, commit=True):
        logger.info("!!! FORM_DEBUG: Método save() llamado en el formulario.")
        instance = super().save(commit=False)
        logger.info(f"!!! FORM_DEBUG: Instancia creada/actualizada por el formulario: {instance}")
        for img_field in ['imagen1', 'imagen2', 'imagen3']:
            if hasattr(instance, img_field) and getattr(instance, img_field):
                logger.info(f"!!! FORM_DEBUG: Imagen adjunta a la instancia del modelo antes del commit final para '{img_field}': {getattr(instance, img_field).name}")
            else:
                logger.info(f"!!! FORM_DEBUG: Imagen NO adjunta a la instancia del modelo antes del commit final para '{img_field}'.")

        if commit:
            instance.save()
            logger.info("!!! FORM_DEBUG: Formulario ha confirmado la instancia en la base de datos.")
        return instance