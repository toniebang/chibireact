# veluxapp/serializers.py

from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

from .models import (
    Categoria_Productos,
    Productos,
    Pack,
    Reviews,
    Colaboradores,
    Informacion,
    Correos,
    Equipo,
    Pedido,
    ElementoPedido,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as JWTTokenObtainPairSerializer
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


# --- Serializadores Base (sin dependencias de otros serializadores personalizados) ---

class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile_picture', 'google_id')
        extra_kwargs = {'password': {'write_only': True, 'required': False}}
        read_only_fields = ('id', 'username', 'email', 'google_id', 'profile_picture')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class CategoriaProductosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria_Productos
        fields = '__all__'

class PackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pack
        fields = '__all__'

class ColaboradoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaboradores
        fields = '__all__'

class InformacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Informacion
        fields = '__all__'

class CorreosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correos
        fields = '__all__'
        read_only_fields = ('nombre', 'fecha')

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'

class ElementoPedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    
    class Meta:
        model = ElementoPedido
        fields = '__all__'
        read_only_fields = ('precio_unitario',)


# --- Serializadores con dependencias (usan los serializadores base definidos arriba) ---

class ProductosSerializer(serializers.ModelSerializer):
    categoria = CategoriaProductosSerializer(many=True, read_only=True)
    is_new = serializers.SerializerMethodField()

    class Meta:
        model = Productos
        fields = '__all__'

    def get_is_new(self, obj):
        new_threshold = timezone.now() - timedelta(days=30)
        return obj.fecha_subida >= new_threshold.date()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        
        if request:
            if instance.imagen1:
                representation['imagen1'] = request.build_absolute_uri(instance.imagen1.url)
            else:
                representation['imagen1'] = None

            if instance.imagen2:
                representation['imagen2'] = request.build_absolute_uri(instance.imagen2.url)
            else:
                representation['imagen2'] = None
            
            if instance.imagen3:
                representation['imagen3'] = request.build_absolute_uri(instance.imagen3.url)
            else:
                representation['imagen3'] = None
        
        return representation
    
    
class ReviewsSerializer(serializers.ModelSerializer):
    # UserSerializer está definido antes
    usuario = UserSerializer(read_only=True)
    
    class Meta:
        model = Reviews
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    # UserSerializer y ElementoPedidoSerializer están definidos antes
    comprador = UserSerializer(read_only=True)
    elementos = ElementoPedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'
        read_only_fields = ('precio_total',)

class CustomTokenObtainPairSerializer(JWTTokenObtainPairSerializer):
    identifier = serializers.CharField()
    username_field = User.USERNAME_FIELD

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop('username', None)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['profile_picture'] = str(user.profile_picture) if user.profile_picture else None
        token['google_id'] = user.google_id
        return token

    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')

        print(f"DEBUG: Intentando autenticar con identificador: {identifier}") # Debug 1
        print(f"DEBUG: Contraseña (recortada): {password[:3]}...") # Debug 2

        if not identifier or not password:
            raise serializers.ValidationError("Debe proporcionar un identificador (username/email) y una contraseña.")

        # Intentar autenticar por username
        user = None # Inicializa user a None
        try:
            user = authenticate(request=self.context.get('request'), username=identifier, password=password)
            print(f"DEBUG: Resultado de autenticación por username: {user}") # Debug 3
        except Exception as e:
            print(f"ERROR: Fallo en authenticate por username: {e}") # Debug 4


        if not user:
            print(f"DEBUG: Autenticación por username fallida. Intentando por email para {identifier}") # Debug 5
            # Si falla por username, intentar por email
            try:
                user_by_email = User.objects.get(email=identifier)
                print(f"DEBUG: Usuario encontrado por email: {user_by_email.username}") # Debug 6
                user = authenticate(request=self.context.get('request'), username=user_by_email.username, password=password)
                print(f"DEBUG: Resultado de autenticación por email: {user}") # Debug 7
            except User.DoesNotExist:
                print(f"DEBUG: Usuario no encontrado por email: {identifier}") # Debug 8
                pass # El usuario no existe por email
            except Exception as e:
                print(f"ERROR: Fallo en authenticate por email: {e}") # Debug 9


        if not user or not user.is_active:
            print(f"DEBUG: Autenticación final fallida o usuario inactivo para {identifier}. user: {user}, is_active: {user.is_active if user else 'N/A'}") # Debug 10
            raise serializers.ValidationError("No se encontraron credenciales válidas.")

        print(f"DEBUG: Autenticación exitosa para el usuario: {user.username}") # Debug 11
        # Autenticación exitosa, genera los tokens
        refresh = self.get_token(user)
        data = {}
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        data['user'] = UserSerializer(user).data 

        return data
