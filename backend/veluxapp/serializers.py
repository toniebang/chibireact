# veluxapp/serializers.py

from rest_framework import serializers
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
from django.contrib.auth.models import User # Necesario para serializar el usuario si lo incluyes
from django.contrib.auth import authenticate # Importa authenticate de Django
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as JWTTokenObtainPairSerializer



# Serializador para el modelo User (solo si necesitas exponer detalles del usuario)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        read_only_fields = ('id',)

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class CustomTokenObtainPairSerializer(JWTTokenObtainPairSerializer):
    # Campo para el identificador (puede ser username o email)
    identifier = serializers.CharField()
    username_field = User.USERNAME_FIELD # Campo por defecto, lo dejamos para el super

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Elimina el campo 'username' del serializador base
        self.fields.pop('username', None)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Puedes añadir datos extra al token aquí si quieres
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token

    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')

        if not identifier or not password:
            raise serializers.ValidationError("Debe proporcionar un identificador (username/email) y una contraseña.")

        # Intentar autenticar por username
        user = authenticate(request=self.context.get('request'), username=identifier, password=password)

        if not user:
            # Si falla por username, intentar por email
            try:
                user_by_email = User.objects.get(email=identifier)
                user = authenticate(request=self.context.get('request'), username=user_by_email.username, password=password)
            except User.DoesNotExist:
                pass # El usuario no existe por email

        if not user or not user.is_active:
            raise serializers.ValidationError("No se encontraron credenciales válidas.")

        # Autenticación exitosa, genera los tokens
        refresh = self.get_token(user)
        data = {}
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        # Opcional: Puedes añadir datos del usuario en la respuesta de login si quieres
        data['user'] = UserSerializer(user).data 

        return data






# Serializador para Categoria_Productos
class CategoriaProductosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria_Productos
        fields = '__all__' # Incluye todos los campos del modelo


# Serializador para Productos
class ProductosSerializer(serializers.ModelSerializer):
    # Serializador anidado para mostrar la categoría si necesitas ver detalles de Categoría
    # Opcional: Si solo quieres el ID, no uses esto y el campo categoria será solo el ID
    categoria = CategoriaProductosSerializer(many=True, read_only=True) # many=True para ManyToManyField
    
    class Meta:
        model = Productos
        fields = '__all__'


# Serializador para Pack
class PackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pack
        fields = '__all__'


# Serializador para Reviews
class ReviewsSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True) # Muestra el usuario asociado a la review
    
    class Meta:
        model = Reviews
        fields = '__all__'


# Serializador para Colaboradores
class ColaboradoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaboradores
        fields = '__all__'


# Serializador para Informacion
class InformacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Informacion
        fields = '__all__'


# Serializador para Correos (Suscripciones)
class CorreosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correos
        fields = '__all__'
        read_only_fields = ('nombre', 'fecha') # 'nombre' es editable=False en el modelo, 'fecha' es auto_now_add


# Serializador para Equipo
class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'


# Serializador para ElementoPedido (para anidar en Pedido)
class ElementoPedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    
    class Meta:
        model = ElementoPedido
        fields = '__all__'
        read_only_fields = ('precio_unitario',) # El precio unitario podría ser establecido por el backend


# Serializador para Pedido
class PedidoSerializer(serializers.ModelSerializer):
    comprador = UserSerializer(read_only=True) # Muestra el comprador asociado al pedido
    elementos = ElementoPedidoSerializer(many=True, read_only=True) # Anida los elementos del pedido

    class Meta:
        model = Pedido
        fields = '__all__'
        read_only_fields = ('precio_total',) # El precio total debería calcularse en el backend