# Django settings for backend project.

import os
from pathlib import Path
from decouple import config, Csv
from django.core.files.base import ContentFile  # En la sección de imports



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent



AUTH_USER_MODEL = 'veluxapp.CustomUser'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('DJANGO_SECRET_KEY', default='a-very-insecure-fallback-key-for-dev')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)
# AÑADE ESTA LÍNEA AQUÍ
print(f"!!! FINAL_DEBUG_CHECK: La variable DEBUG es: {DEBUG} y su tipo es: {type(DEBUG)}")

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='127.0.0.1', cast=Csv())

GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET')
if not GOOGLE_CLIENT_ID:
    raise Exception("GOOGLE_CLIENT_ID no está configurado en las variables de entorno.")

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles', # Siempre necesario

    'storages', # ESENCIAL para DigitalOcean Spaces

    'veluxapp.apps.VeluxappConfig', # Tu aplicación principal

    'corsheaders',
    'ckeditor',
    'rest_framework',
    'django_filters',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
]

# DigitalOcean Spaces Configuration (APUNTANDO A LAS VARIABLES DE ENTORNO)
DO_SPACES_KEY = config('DO_SPACES_KEY')
DO_SPACES_SECRET = config('DO_SPACES_SECRET')
DO_SPACES_NAME = config('DO_SPACES_NAME') # Usar config() para consistencia
DO_SPACES_REGION = config('DO_SPACES_REGION')

AWS_ACCESS_KEY_ID = DO_SPACES_KEY
AWS_SECRET_ACCESS_KEY = DO_SPACES_SECRET
AWS_STORAGE_BUCKET_NAME = DO_SPACES_NAME
AWS_S3_ENDPOINT_URL = f'https://{DO_SPACES_REGION}.digitaloceanspaces.com'
AWS_S3_REGION_NAME = DO_SPACES_REGION
AWS_LOCATION = 'static'
# Configuración del CDN (usando el nombre del bucket y región para construir el dominio)
# Esto DEBE coincidir con el "CDN Endpoint" que ves en tu panel de DO Spaces
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.{AWS_S3_REGION_NAME}.cdn.digitaloceanspaces.com'

# Parámetros por defecto para objetos subidos a S3/Spaces
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400', # 1 día de caché
}
AWS_S3_FILE_OVERWRITE = False # No sobrescribir archivos con el mismo nombre
AWS_QUERYSTRING_AUTH = False
# CRUCIAL: Asegura que los archivos subidos sean públicos por defecto
AWS_DEFAULT_ACL = 'public-read'

# --- Configuración Condicional de Almacenamiento (Producción vs Desarrollo) ---
if not DEBUG: # Si no estamos en modo DEBUG (es decir, en producción)
    # Almacenamiento para archivos de MEDIA (subidos por usuarios)
    # DEFAULT_FILE_STORAGE = 'backend.storages_backends.MediaStorage'
    # MEDIA_URL = f'https://{AWS_S3_REGION_NAME}.digitaloceanspaces.com/{config("AWS_LOCATION", default="media")}/'
    
    MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.{AWS_S3_REGION_NAME}.cdn.digitaloceanspaces.com/media/'
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    # MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
    # Almacenamiento para archivos ESTÁTICOS (CSS, JS, imágenes del admin)
    STATICFILES_STORAGE = 'backend.storages_backends.StaticStorage'
    # STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
    STATIC_URL = f'https://{AWS_S3_REGION_NAME}.digitaloceanspaces.com/{config("AWS_LOCATION_STATIC", default="static")}/'
    
    FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50 MB (50 * 1024 * 1024)
    DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50 MB

    # AÑADE ESTO: STATIC_ROOT DEBE ESTAR DEFINIDO EN PRODUCCIÓN TAMBIÉN
    # Es un directorio temporal donde collectstatic recolecta antes de subir a S3
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles_build') # Puedes usar 'staticfiles' o 'static_temp' etc.
    print("INFO: Usando DigitalOcean Spaces para archivos estáticos y media en producción.")
    print("INFO: DigitalOcean Spaces MEDIA/STATIC configured. Checking logging.") # <-- AÑADE ESTA LÍNEA TEMPORALMENTE
    print(f"DEFAULT_FILE_STORAGE set to: {DEFAULT_FILE_STORAGE}")
    
    
    
    print(f"DEBUG variable is: {DEBUG}")
    print(f"DEFAULT_FILE_STORAGE set to: {DEFAULT_FILE_STORAGE}")
    print(f"DO_SPACES_NAME: {AWS_STORAGE_BUCKET_NAME}") # <-- AÑADE ESTA
    print(f"DO_SPACES_REGION: {AWS_S3_REGION_NAME}") # <-- AÑADE ESTA
    print(f"AWS_ACCESS_KEY_ID (first 4 chars): {AWS_ACCESS_KEY_ID[:4]}") # <-- AÑADE ESTA
    # NO imprimas el secreto completo. Esto es solo para verificar que se carga algo.
    print(f"AWS_SECRET_ACCESS_KEY (first 4 chars): {AWS_SECRET_ACCESS_KEY[:4]}") # <-- AÑADE ESTA
    
    # --- CRITICAL NEW DEBUG PRINTS ---
    print(f"!!! SETTINGS_DEBUG (PROD): DEBUG is {DEBUG}")
    print(f"!!! SETTINGS_DEBUG (PROD): DEFAULT_FILE_STORAGE set to {DEFAULT_FILE_STORAGE}")
    print(f"!!! SETTINGS_DEBUG (PROD): MEDIA_URL set to {MEDIA_URL}")

    # Import config here to ensure it works in this context
    from decouple import config
    _test_do_key = config('DO_SPACES_KEY', default='NOT_SET')
    _test_bucket_name = config('DO_SPACES_NAME', default='NOT_SET')
    print(f"!!! SETTINGS_DEBUG (PROD): DO_SPACES_KEY starts with {_test_do_key[:4]}")
    print(f"!!! SETTINGS_DEBUG (PROD): DO_SPACES_NAME is {_test_bucket_name}")
    # --- END OF CRITICAL NEW DEBUG PRINTS ---
    
    
else: # En desarrollo (DEBUG=True)
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

    STATIC_URL = '/static/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'veluxapp/static'),
]
    print("INFO: Usando almacenamiento local para archivos estáticos y media en desarrollo.")


CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.0.110:5173",
    "https://chibi-app-l5q6z.ondigitalocean.app",
]
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = [
    'X-Session-Key',
]
CORS_ALLOW_HEADERS = [
    'x-session-key',
    'content-type',
    'authorization',
    'accept',
    'accept-encoding',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'POST',
    'PUT',
    'PATCH',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # 'whitenoise.middleware.WhiteNoiseMiddleware', # COMENTADO: Spaces sirve los estáticos
    'django.contrib.sessions.middleware.SessionMiddleware',
    
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'backend.urls'
APPEND_SLASH = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug', # Asegura que DEBUG y otras variables estén disponibles en las plantillas
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media', # ¡CRUCIAL PARA MEDIA!
                'django.template.context_processors.static', # ¡ESTO ES CRUCIAL PARA LOS ARCHIVOS ESTÁTICOS!
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database Configuration
if not DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST'),
            'PORT': config('DB_PORT', default=25060, cast=int),
            'OPTIONS': {
                'sslmode': 'require',
            },
        }
    }
    print("INFO: Usando base de datos de DigitalOcean para producción.")
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    print("INFO: Usando base de datos SQLite para desarrollo.")

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST FRAMEWORK (consolidado)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'veluxapp.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 16,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
         'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}

# Solo aplica FORCE_SCRIPT_NAME en producción
if os.environ.get('APP_ENV') == 'production':
    FORCE_SCRIPT_NAME = '/api/'
else:
    FORCE_SCRIPT_NAME = '/'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]


