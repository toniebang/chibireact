# veluxapp/views.py
import os
import boto3
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny # <-- Importa esto
from django.db import transaction
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsAdminUserOrReadOnly

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
)
from .serializers import (
    CategoriaProductosSerializer,
    ProductosSerializer,
    PackSerializer,
    FavoriteSerializer,
    ReviewsSerializer,
    ColaboradoresSerializer,
    InformacionSerializer,
    CorreosSerializer,
    EquipoSerializer,
    PedidoSerializer,
    ElementoPedidoSerializer,
)

# Asegúrate de que estas variables estén cargadas en el entorno
DO_SPACES_KEY = os.environ.get('DO_SPACES_KEY')
DO_SPACES_SECRET = os.environ.get('DO_SPACES_SECRET')
DO_SPACES_NAME = os.environ.get('DO_SPACES_NAME')
DO_SPACES_REGION = os.environ.get('DO_SPACES_REGION')
# Puedes definir permisos globales o por vista.
# is_authenticated_or_read_only permite GET a todos, y POST/PUT/DELETE solo a autenticados.
# IsAdminUser permite solo a administradores.
# IsAuthenticated solo a usuarios logueados.
@api_view(['POST'])
@permission_classes([AllowAny])
def get_presigned_url(request):
    """
    Endpoint para generar una URL pre-firmada para la subida directa a DigitalOcean Spaces.
    Recibe el nombre del archivo desde el frontend.
    """
    file_name = request.data.get('file_name')
    if not file_name:
        return Response({'error': 'No se proporcionó el nombre del archivo'}, status=400)

    # Configuración del cliente de S3
    session = boto3.session.Session()
    client = session.client(
        's3',
        region_name=DO_SPACES_REGION,
        endpoint_url=f'https://{DO_SPACES_REGION}.digitaloceanspaces.com',
        aws_access_key_id=DO_SPACES_KEY,
        aws_secret_access_key=DO_SPACES_SECRET
    )

    try:
        # Genera la URL pre-firmada para una operación PUT (subir)
        # La URL expirará en 3600 segundos (1 hora)
        presigned_url = client.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': DO_SPACES_NAME,
                'Key': f'media/{file_name}', # Define la ruta donde se guardará en tu Space
                'ACL': 'public-read' # Puedes cambiar esto si quieres que los archivos no sean públicos
            },
            ExpiresIn=3600
        )
        return Response({'presigned_url': presigned_url})
    except Exception as e:
        return Response({'error': str(e)}, status=500)



@api_view(['POST'])
@permission_classes([AllowAny])
def create_product(request):
    """
    Endpoint para recibir los datos del producto, incluyendo las 3 URLs de las imágenes,
    y guardarlos en la base de datos.
    """
    name = request.data.get('nombre')
    descripcion = request.data.get('descripcion', '')
    precio = request.data.get('precio')
    stock = request.data.get('stock', True)
    disponible = request.data.get('disponible', True)
    
    # Recibe las 3 URLs de las imágenes
    imagen1_url = request.data.get('imagen1_url', '')
    imagen2_url = request.data.get('imagen2_url', '')
    imagen3_url = request.data.get('imagen3_url', '')

    if not all([name, precio]):
        return Response({'error': 'Faltan datos obligatorios (nombre, precio).'}, status=400)

    try:
        with transaction.atomic():
            # Crea el producto, asignando directamente las URLs a los campos ImageField
            product = Productos.objects.create(
                nombre=name,
                descripcion=descripcion,
                precio=precio,
                stock=stock,
                disponible=disponible,
                imagen1=imagen1_url,
                imagen2=imagen2_url,
                imagen3=imagen3_url
                # No olvides añadir cualquier otro campo que sea obligatorio
            )
        
        return Response({'message': 'Producto creado con éxito.', 'product_id': product.id}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    
class CategoriaProductosViewSet(viewsets.ModelViewSet):
    queryset = Categoria_Productos.objects.all()
    serializer_class = CategoriaProductosSerializer
    # Solo los superadministradores pueden crear, actualizar o borrar productos
    permission_classes = [IsAdminUserOrReadOnly]


class ProductosViewSet(viewsets.ModelViewSet):
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
        # Solo los superadministradores pueden crear, actualizar o borrar categorías
    permission_classes = [IsAdminUserOrReadOnly]

 # --- Configuraciones de Filtrado para Productos ---
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # Permite filtrar por id, nombre, precio, stock, oferta, disponible, y categorías
    filterset_fields = ['id', 'nombre', 'precio', 'stock', 'oferta', 'disponible', 'categoria']
    search_fields = ['^nombre', '^descripcion'] # Búsqueda por nombre y descripción. '^' para "starts-with"
    ordering_fields = ['nombre', 'precio', 'stock', 'fecha_creacion'] # Permite ordenar por estos campos
    
class PackViewSet(viewsets.ModelViewSet):
    queryset = Pack.objects.all()
    serializer_class = PackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ReviewsViewSet(viewsets.ModelViewSet):
    queryset = Reviews.objects.all()
    serializer_class = ReviewsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Permite GET a todos, POST/PUT/DELETE a autenticados

# --- Configuraciones de Filtrado para Reviews ---
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['usuario', 'puntaje', 'producto', 'disponible'] # Filtra por usuario, puntaje, producto, etc.
    ordering_fields = ['fecha_creacion', 'puntaje'] # Ordena por fecha de creación o puntaje


    def perform_create(self, serializer):
        # Asigna automáticamente el usuario logueado a la review
        serializer.save(usuario=self.request.user)

    def get_queryset(self):
        # Solo mostrar reviews disponibles a usuarios no autenticados
        if self.request.user.is_authenticated:
            return Reviews.objects.all()
        return Reviews.objects.filter(disponible=True)


class ColaboradoresViewSet(viewsets.ModelViewSet):
    queryset = Colaboradores.objects.all()
    serializer_class = ColaboradoresSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class InformacionViewSet(viewsets.ModelViewSet):
    queryset = Informacion.objects.all()
    serializer_class = InformacionSerializer
    # Usualmente, la información de contacto solo necesita ser leída o actualizada por admins
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 


class CorreosViewSet(viewsets.ModelViewSet):
    queryset = Correos.objects.all()
    serializer_class = CorreosSerializer
    # Generalmente, cualquiera puede suscribirse, pero solo admins pueden ver la lista
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        # Si 'nombre' no se proporciona, lo dejamos vacío (como el modelo lo permite)
        # o puedes definir una lógica para generarlo.
        # El campo 'editable=False' en el modelo significa que no se debe establecer en la API.
        # Aquí permitimos que 'correo' sea el único campo requerido para la suscripción
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated] # Solo usuarios autenticados pueden ver/crear pedidos

    def get_queryset(self):
        # Los usuarios solo pueden ver sus propios pedidos, a menos que sean administradores
        if self.request.user.is_staff:
            return Pedido.objects.all()
        return Pedido.objects.filter(comprador=self.request.user)

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario logueado como comprador
        serializer.save(comprador=self.request.user)

    @action(detail=False, methods=['post'], url_path='crear-pedido-con-productos')
    def create_order_with_items(self, request):
        """
        Endpoint para crear un pedido y sus elementos de pedido en una sola solicitud.
        Requiere un JSON como:
        {
            "productos": [
                {"producto_id": 1, "cantidad": 2},
                {"producto_id": 5, "cantidad": 1}
            ]
        }
        """
        productos_data = request.data.get('productos')
        if not productos_data:
            return Response({"error": "No se proporcionaron productos para el pedido."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # 1. Crear el pedido principal
            pedido = Pedido.objects.create(comprador=request.user)
            total_price = 0
            
            # 2. Iterar sobre los productos y crear ElementoPedido
            for item_data in productos_data:
                product_id = item_data.get('producto_id')
                quantity = item_data.get('cantidad')

                if not product_id or not quantity:
                    raise serializers.ValidationError("Cada producto debe tener 'producto_id' y 'cantidad'.")

                try:
                    producto = Productos.objects.get(id=product_id)
                except Productos.DoesNotExist:
                    raise serializers.ValidationError(f"Producto con ID {product_id} no encontrado.")

                # Determinar el precio unitario (precio normal o de oferta)
                precio_unitario = producto.precio_rebaja if producto.oferta else producto.precio
                
                ElementoPedido.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=quantity,
                    precio_unitario=precio_unitario
                )
                total_price += precio_unitario * quantity
            
            # 3. Actualizar el precio total del pedido
            pedido.precio_total = total_price
            pedido.save()
            
            serializer = self.get_serializer(pedido)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='elementos')
    def get_order_elements(self, request, pk=None):
        """
        Endpoint para obtener los elementos de un pedido específico.
        """
        try:
            pedido = self.get_queryset().get(pk=pk) # Usa get_queryset para aplicar permisos de usuario
        except Pedido.DoesNotExist:
            return Response({"detail": "Pedido no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        elements = pedido.elementos.all()
        serializer = ElementoPedidoSerializer(elements, many=True)
        return Response(serializer.data)


class ElementoPedidoViewSet(viewsets.ModelViewSet):
    queryset = ElementoPedido.objects.all()
    serializer_class = ElementoPedidoSerializer
    permission_classes = [permissions.IsAdminUser] # Solo administradores pueden gestionar elementos de pedido directamente
    
    
class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    # opcional: endpoint /favorites/toggle/
    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        fav, created = Favorite.objects.get_or_create(user=request.user, product_id=product_id)
        if not created:
            fav.delete()
            return Response({'detail': 'removed'}, status=status.HTTP_200_OK)
        return Response({'detail': 'added'}, status=status.HTTP_201_CREATED)