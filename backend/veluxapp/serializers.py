# veluxapp/serializers.py

from urllib import request
from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.utils.text import slugify

from .models import (
    Categoria_Productos,
    Productos,
    Pack,
    Reviews,
    Colaboradores,
    Informacion,
    Correos,
    Favorite,
    Equipo,
    Pedido,
    ElementoPedido,
    Cart,       # <--- Importa el modelo Cart
    CartItem,   # <--- Importa el modelo CartItem
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as JWTTokenObtainPairSerializer
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ('id', 'product')

# --- Serializadores Base (sin dependencias de otros serializadores personalizados) ---

class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile_picture', 'google_id', 'is_superuser')
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
    
    
    
class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        email = attrs["email"].lower().strip()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Este correo ya está registrado."})
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated):
        email = validated["email"].lower().strip()
        base_username = validated.get("username") or email.split("@")[0]
        username = base_username
        i = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{i}"
            i += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated["password"],
            first_name=validated.get("first_name", ""),
            last_name=validated.get("last_name", ""),
        )
        return user




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
    # Añadimos la imagen del producto para Pedido, similar a como la teníamos en CartItem
    producto_imagen1 = serializers.SerializerMethodField()
    
    class Meta:
        model = ElementoPedido
        fields = '__all__'
        read_only_fields = ('precio_unitario',)

    def get_producto_imagen1(self, obj):
        # Asegurarse de que el producto existe y tiene imagen1
        if obj.producto and obj.producto.imagen1:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.producto.imagen1.url) if request else obj.producto.imagen1.url
        return None

# --- Serializadores con dependencias (usan los serializadores base definidos arriba) ---

class ProductosSerializer(serializers.ModelSerializer):
    # ⬇️ AHORA escribible con IDs (lista de enteros)
    categoria = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Categoria_Productos.objects.all()
    )
    is_new = serializers.SerializerMethodField()

    class Meta:
        model = Productos
        fields = '__all__'

    def get_is_new(self, obj):
        new_threshold = timezone.now() - timedelta(days=30)
        return obj.fecha_subida >= new_threshold.date()

    def to_representation(self, instance):
        """
        Enviamos imágenes como URLs absolutas y categorías ANIDADAS (bonito para el front),
        aunque en escritura aceptamos IDs.
        """
        rep = super().to_representation(instance)
        request = self.context.get('request')

        def safe(img_field):
            if not img_field:
                return None
            try:
                url = img_field.url
            except Exception:
                name = getattr(img_field, 'name', None)
                if name and str(name).startswith(('http://', 'https://')):
                    url = name
                else:
                    return None
            if request and not str(url).startswith(('http://', 'https://')):
                return request.build_absolute_uri(url)
            return url

        rep['imagen1'] = safe(instance.imagen1)
        rep['imagen2'] = safe(instance.imagen2)
        rep['imagen3'] = safe(instance.imagen3)

        # ⬇️ Devolver la categoría anidada (no IDs) para no romper el front
        rep['categoria'] = CategoriaProductosSerializer(
            instance.categoria.all(),
            many=True,
            context=self.context
        ).data

        return rep

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

        if not identifier or not password:
            raise serializers.ValidationError("Debe proporcionar un identificador (username/email) y una contraseña.")

        # Intentar autenticar por username
        user = None # Inicializa user a None
        try:
            user = authenticate(request=self.context.get('request'), username=identifier, password=password)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Fallo en authenticate por username: {e}")

        if not user:
            # Si falla por username, intentar por email
            try:
                user_by_email = User.objects.get(email=identifier)
                user = authenticate(request=self.context.get('request'), username=user_by_email.username, password=password)
            except User.DoesNotExist:
                pass # El usuario no existe por email
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Fallo en authenticate por email: {e}")

        if not user or not user.is_active:
            raise serializers.ValidationError("No se encontraron credenciales válidas.")

        # Autenticación exitosa, genera los tokens
        refresh = self.get_token(user)
        data = {}
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        data['user'] = UserSerializer(user).data

        return data


# --- Nuevos Serializers para el Carrito ---

class ProductCartItemSerializer(serializers.ModelSerializer):
    """
    Serializador de producto simplificado para ser usado dentro de CartItemSerializer.
    Incluye solo los campos relevantes para mostrar en el carrito.
    """
    class Meta:
        model = Productos
        fields = ['id', 'nombre', 'imagen1', 'precio'] # Campos relevantes para mostrar en el carrito

    # Asegura que la URL de la imagen sea absoluta
    imagen1 = serializers.SerializerMethodField()

    def get_imagen1(self, obj):
        if obj.imagen1:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.imagen1.url) if request else obj.imagen1.url
        return None


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializador para los ítems individuales del carrito.
    """
    product = ProductCartItemSerializer(read_only=True) # Anida el serializador de producto
    # Campo para recibir el ID del producto al añadir/actualizar.
    # 'write_only=True' significa que solo se usa para la entrada de datos.
    # 'source='product'' mapea este campo a la relación 'product' del modelo.
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Productos.objects.all(), source='product', write_only=True
    )
    
    # Campo calculado para el subtotal de cada ítem
    subtotal = serializers.ReadOnlyField() 

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price_at_addition', 'subtotal']
        # 'product' es de solo lectura porque lo anidamos para la salida (representación).
        # 'price_at_addition' es de solo lectura porque se establece automáticamente en la vista.
        read_only_fields = ['id', 'product', 'price_at_addition'] 


class CartSerializer(serializers.ModelSerializer):
    """
    Serializador principal para el carrito, incluyendo sus ítems.
    """
    items = CartItemSerializer(many=True, read_only=True) # Lista de ítems del carrito
    total_items = serializers.ReadOnlyField() # Campo calculado desde el modelo Cart (@property)
    total_price = serializers.ReadOnlyField() # Campo calculado desde el modelo Cart (@property)
    
    # Usamos tu UserSerializer existente para mostrar la información del usuario si está asociado
    user = UserSerializer(read_only=True) 

    class Meta:
        model = Cart
        fields = ['id', 'user', 'session_key', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'session_key', 'created_at', 'updated_at']


# Serializadores de entrada para acciones específicas del carrito (no mapean directamente a un modelo)
class AddToCartSerializer(serializers.Serializer):
    """
    Serializador para validar los datos de entrada al añadir un producto al carrito.
    """
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)

    def validate_product_id(self, value):
        try:
            product = Productos.objects.get(id=value)
            # Usando tus campos 'disponible' y 'stock' como booleanos
            if not product.disponible:
                raise serializers.ValidationError("Este producto no está disponible para la venta.")
            if not product.stock: # Si 'stock' es True = en stock, False = fuera de stock
                raise serializers.ValidationError("Este producto está fuera de stock.")
            return value
        except Productos.DoesNotExist:
            raise serializers.ValidationError("Producto no encontrado.")


class UpdateCartItemSerializer(serializers.Serializer):
    """
    Serializador para validar los datos de entrada al actualizar la cantidad de un ítem.
    """
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=0) # Permite 0 para eliminar el ítem

    def validate_product_id(self, value):
        try:
            product = Productos.objects.get(id=value)
            if not product.disponible:
                raise serializers.ValidationError("Este producto no está disponible para la venta.")
            return value
        except Productos.DoesNotExist:
            raise serializers.ValidationError("Producto no encontrado.")

    def validate_quantity(self, value):
        # Si la cantidad es > 0, validamos que el producto esté en stock.
        # Si la cantidad es 0, asumimos que es una eliminación y la validación de stock no aplica.
        if value > 0:
            product_id = self.initial_data.get('product_id')
            if product_id: # Solo si product_id está presente en los datos iniciales
                try:
                    product = Productos.objects.get(id=product_id)
                    if not product.stock: # Si stock es booleano y es False
                        raise serializers.ValidationError("Este producto está fuera de stock.")
                except Productos.DoesNotExist:
                    # Esto se manejará en `validate_product_id` o en la vista,
                    # pero es bueno tener la excepción aquí también.
                    pass
        return value