# veluxapp/views_auth.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer # Importa tu serializador de usuario
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import requests # Necesario para verificar el ID Token de Google
from django.conf import settings # Necesario para acceder a GOOGLE_CLIENT_ID desde settings


# --- Vistas de Autenticación ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Permitir que cualquiera se registre
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generar tokens JWT inmediatamente después del registro
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,) # Solo usuarios autenticados pueden ver/actualizar su perfil

    def get_object(self):
        # Retorna el usuario autenticado para que pueda ver/actualizar su propio perfil
        return self.request.user

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # Permitir actualizaciones parciales
        return super().update(request, *args, **kwargs)

# --- Vista para el logout (opcional, pero buena práctica para invalidar refresh tokens) ---
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist() # Añade el refresh token a la lista negra
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"detail": str(e)})


# --- Vista para Autenticación con Google ---
class GoogleAuthView(APIView):
    permission_classes = (AllowAny,) # Permitir acceso sin autenticación inicial

    def post(self, request):
        id_token = request.data.get('id_token')

        if not id_token:
            return Response({'detail': 'ID Token de Google no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Verificar el ID Token con Google
            google_verify_url = 'https://oauth2.googleapis.com/tokeninfo'
            response = requests.get(google_verify_url, params={'id_token': id_token})
            response.raise_for_status() # Lanza una excepción para errores HTTP (4xx o 5xx)
            
            google_user_data = response.json()

            # Verificar si el token es para tu aplicación (tu GOOGLE_CLIENT_ID)
            if google_user_data['aud'] != settings.GOOGLE_CLIENT_ID:
                return Response({'detail': 'ID Token no válido para esta aplicación.'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Asegurarse de que el email de Google haya sido verificado
            if not google_user_data.get('email_verified'):
                return Response({'detail': 'El email de Google no está verificado.'}, status=status.HTTP_401_UNAUTHORIZED)
            
            email = google_user_data['email']
            google_id = google_user_data['sub'] # ID único de Google para el usuario
            
            # 2. Buscar/Crear Usuario Localmente
            try:
                user = User.objects.get(email=email)
                # Si el usuario ya existe con ese email, lo autenticamos.
                # Puedes añadir lógica para vincular cuentas si usas un sistema como social-auth-app-django.
                # Por ahora, simplemente confiamos en el email como identificador principal.
            except User.DoesNotExist:
                # Crear un nuevo usuario si no existe
                username = email.split('@')[0] # Usa la parte del email como username inicial
                # Asegúrate de que el username sea único
                if User.objects.filter(username=username).exists():
                    # Si el username ya existe, hazlo único añadiendo una parte del google_id
                    username = f"{username}_{google_id[:5]}"
                
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=google_user_data.get('given_name', ''),
                    last_name=google_user_data.get('family_name', ''),
                    # No se necesita contraseña si siempre se autentica via Google
                )
                user.is_active = True # Activar el usuario
                user.save()

            # 3. Generar Tokens JWT para el usuario local
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            # Errores de red o HTTP al verificar el token de Google (ej. Google no responde)
            return Response({'detail': f'Error al verificar token de Google: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            # Otros errores inesperados durante el proceso de autenticación
            return Response({'detail': f'Error de autenticación: {e}'}, status=status.HTTP_400_BAD_REQUEST)