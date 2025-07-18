# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Importamos las vistas estándar de simplejwt para refrescar tokens
from rest_framework_simplejwt.views import TokenRefreshView
# Importamos la vista original para poder heredar de ella
from rest_framework_simplejwt.views import TokenObtainPairView as OriginalTokenObtainPairView

# Importamos nuestro serializador personalizado para el login
from veluxapp.serializers import CustomTokenObtainPairSerializer

# Importamos nuestras vistas de autenticación personalizadas
from veluxapp.views_auth import RegisterView, UserProfileView, LogoutView, GoogleAuthView


# --- Vista personalizada para el login que usa nuestro serializador de email/username ---
class CustomTokenObtainPairView(OriginalTokenObtainPairView):
    """
    Vista personalizada para obtener tokens JWT.
    Permite autenticar con 'username' o 'email' usando el campo 'identifier'.
    """
    serializer_class = CustomTokenObtainPairSerializer


urlpatterns = [
    path('admin/', admin.site.urls),
    # --- ¡CAMBIO CRUCIAL AQUÍ! ---
    # Eliminamos 'api/' porque App Platform ya lo manejará
    path('api/', include('veluxapp.urls')), # Incluye las URLs de tu veluxapp
    # -----------------------------

    # --- URLs de Autenticación JWT ---
    # ¡TAMBIÉN CAMBIO AQUÍ! Eliminamos 'api/' de cada ruta de autenticación
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),

    # --- Nueva URL para Autenticación con Google ---
    path('auth/google/', GoogleAuthView.as_view(), name='google_auth'),
]

# Solo para servir archivos media en modo DEBUG (desarrollo)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)