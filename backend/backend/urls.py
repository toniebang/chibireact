# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Importamos las vistas estándar de simplejwt para refrescar tokens
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView as OriginalTokenObtainPairView

# Importamos nuestro serializador personalizado para el login
from veluxapp.serializers import CustomTokenObtainPairSerializer

# Importamos nuestras vistas de autenticación personalizadas
from veluxapp.views_auth import RegisterView, UserProfileView, LogoutView, GoogleAuthView


class CustomTokenObtainPairView(OriginalTokenObtainPairView):
    """Vista personalizada para obtener tokens JWT."""
    serializer_class = CustomTokenObtainPairSerializer


urlpatterns = [
    # Admin directamente en la raíz de lo que recibe Django
    path('admin/', admin.site.urls), # DigitalOcean envía '/admin/'

    # Las URLs de veluxapp (productos, carrito) directamente en la raíz de lo que recibe Django
    # DigitalOcean envía '/productos/', '/cart/', etc.

    # URLs de Autenticación JWT, directamente en la raíz de lo que recibe Django
    # DigitalOcean envía '/token/', '/register/', etc.
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/google/', GoogleAuthView.as_view(), name='google_auth'),

    path('', include('veluxapp.urls')),

]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)