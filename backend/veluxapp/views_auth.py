# veluxapp/views_auth.py

import os
# ¡IMPORTANTE CAMBIO AQUÍ! Importa config de 'decouple', NO de 'dj_database_url'
from decouple import config
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, GoogleAuthSerializer, RegisterSerializer

User = get_user_model()


# --- Vistas de Autenticación Existentes ---
class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    authentication_classes = []
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        s = self.get_serializer(data=request.data)
        s.is_valid(raise_exception=True)
        user = s.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
        
        
class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"detail": str(e)})


# --- ÚNICA Y CORRECTA DEFINICIÓN DE GoogleAuthView ---
class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id_token_from_frontend = serializer.validated_data.get('id_token')

        try:
            # Aquí se usa config() de decouple, que es el que lee de .env
            google_client_id = config('GOOGLE_CLIENT_ID')
            
            # Puedes quitar esta validación explícita si confías en decouple,
            # ya que config() lanza un error si la variable no existe y no tiene default.
            # Sin embargo, para más robustez en la vista, está bien mantenerla.
            if not google_client_id:
                raise ValueError("GOOGLE_CLIENT_ID no configurado en las variables de entorno.")

            id_info = id_token.verify_oauth2_token(
                id_token_from_frontend,
                google_requests.Request(),
                google_client_id
            )

            if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Token incorrecto (issuer).')
            if not id_info.get('email_verified'):
                raise ValueError('Email no verificado por Google.')

            email = id_info.get('email')
            google_user_id = id_info.get('sub')
            first_name = id_info.get('given_name', '')
            last_name = id_info.get('family_name', '')
            profile_picture = id_info.get('picture', '')
            
            user = None

            try:
                user = User.objects.get(email=email)

                if not user.first_name and first_name: user.first_name = first_name
                if not user.last_name and last_name: user.last_name = last_name
                if not user.profile_picture and profile_picture:
                    user.profile_picture = profile_picture
                if not user.google_id and google_user_id:
                    user.google_id = google_user_id

                user.save()

            except User.DoesNotExist:
                base_username = email.split('@')[0]
                username = base_username
                username_suffix = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}_{username_suffix}"
                    username_suffix += 1

                try:
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        google_id=google_user_id,
                        profile_picture=profile_picture,
                        password='!' # Contraseña dummy para usuarios de Google
                    )
                    user.is_active = True
                    user.save()

                except Exception as e:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Falló la creación del usuario: {e}")
                    raise

            if user is None:
                import logging
                logger = logging.getLogger(__name__)
                logger.critical("La variable 'user' es None. Revisar la lógica de creación/recuperación del usuario.")
                return Response(
                    {"error": "No se pudo recuperar o crear el usuario."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data

            return Response({
                "user": user_data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error de verificación de Google: {e}")
            return Response({"error": "Error de autenticación de Google. Por favor, intenta de nuevo."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error inesperado en GoogleAuthView: {e}")
            return Response({"error": "Error en el servidor. Por favor, intenta de nuevo más tarde."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)