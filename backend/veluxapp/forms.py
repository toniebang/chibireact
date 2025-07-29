# veluxapp/forms.py
from django import forms
from .models import Producto # Reemplaza Producto con el nombre real de tu modelo
import logging

logger = logging.getLogger(__name__)

class ProductoAdminForm(forms.ModelForm):
    class Meta:
        model = Producto # Reemplaza Producto con el nombre real de tu modelo
        fields = '__all__' # O lista tus campos explícitamente

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Solo si tienes acceso al request en el form, lo cual no es lo estándar en ModelForms por defecto en el admin
        # self.request = kwargs.pop('request', None) # Esto requeriría pasar 'request' desde admin.py
        logger.info("!!! FORM_DEBUG: ProductoAdminForm inicializado.")
        # logger.info(f"!!! FORM_DEBUG: Método de petición: {self.request.method if hasattr(self, 'request') else 'N/A'}") # Requiere self.request
        if self.is_bound:
            logger.info("!!! FORM_DEBUG: Formulario 'bound'.")
            logger.info(f"!!! FORM_DEBUG: Datos del formulario (data): {self.data}")
            logger.info(f"!!! FORM_DEBUG: Archivos del formulario (files): {self.files}")
            if 'imagen' in self.files: # Reemplaza 'imagen' con el nombre real de tu campo de imagen
                logger.info(f"!!! FORM_DEBUG: Archivo de imagen encontrado en los archivos del formulario: {self.files['imagen'].name}")
            else:
                logger.warning("!!! FORM_DEBUG: Archivo de imagen NO encontrado en los archivos del formulario.")

    def clean(self):
        cleaned_data = super().clean()
        logger.info("!!! FORM_DEBUG: Método clean() llamado.")
        logger.info(f"!!! FORM_DEBUG: Datos limpios (incluyendo archivo si está presente): {cleaned_data.get('imagen', 'No hay imagen en cleaned_data')}") # Reemplaza 'imagen'
        return cleaned_data

    def save(self, commit=True):
        logger.info("!!! FORM_DEBUG: Método save() llamado en el formulario.")
        if 'imagen' in self.cleaned_data: # Reemplaza 'imagen'
            logger.info(f"!!! FORM_DEBUG: Imagen presente en los datos limpios antes de guardar el modelo.")
        else:
            logger.warning("!!! FORM_DEBUG: Imagen NO presente en los datos limpios antes de guardar el modelo.")

        instance = super().save(commit=False) # Obtiene la instancia sin guardarla aún en la DB
        logger.info(f"!!! FORM_DEBUG: Instancia creada/actualizada por el formulario: {instance}")
        if instance.imagen:
            logger.info(f"!!! FORM_DEBUG: Imagen adjunta a la instancia del modelo antes del commit final: {instance.imagen.name}")
        else:
            logger.warning("!!! FORM_DEBUG: Imagen NO adjunta a la instancia del modelo antes del commit final.")

        if commit:
            instance.save() # Esto llama al método save() de tu modelo
            logger.info("!!! FORM_DEBUG: Formulario ha confirmado la instancia en la base de datos.")
        return instance