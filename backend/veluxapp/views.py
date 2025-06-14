# veluxapp/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

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
from .serializers import (
    CategoriaProductosSerializer,
    ProductosSerializer,
    PackSerializer,
    ReviewsSerializer,
    ColaboradoresSerializer,
    InformacionSerializer,
    CorreosSerializer,
    EquipoSerializer,
    PedidoSerializer,
    ElementoPedidoSerializer,
)

# Puedes definir permisos globales o por vista.
# is_authenticated_or_read_only permite GET a todos, y POST/PUT/DELETE solo a autenticados.
# IsAdminUser permite solo a administradores.
# IsAuthenticated solo a usuarios logueados.

class CategoriaProductosViewSet(viewsets.ModelViewSet):
    queryset = Categoria_Productos.objects.all()
    serializer_class = CategoriaProductosSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductosViewSet(viewsets.ModelViewSet):
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
    filterset_fields = ['usuario', 'rating', 'producto', 'disponible'] # Filtra por usuario, rating, producto, etc.
    ordering_fields = ['fecha_creacion', 'rating'] # Ordena por fecha de creación o rating


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