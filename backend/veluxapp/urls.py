# veluxapp/urls.py
from venv import create
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views_auth import GoogleAuthView # <--- ¡ELIMINA ESTA IMPORTACIÓN!

from .views import ( # Asegúrate de que todas tus vistas actuales estén importadas aquí
    CategoriaProductosViewSet,
    ProductosViewSet,
    PackViewSet,
    ReviewsViewSet,
    ColaboradoresViewSet,
    InformacionViewSet,
    CorreosViewSet,
    EquipoViewSet,
    PedidoViewSet,
    ElementoPedidoViewSet,
    FavoriteViewSet,
    create_product, get_presigned_url
)
from .views_cart import CartView

router = DefaultRouter()
router.register(r'categorias', CategoriaProductosViewSet)
router.register(r'productos', ProductosViewSet)
router.register(r'packs', PackViewSet)
router.register(r'reviews', ReviewsViewSet)
router.register(r'colaboradores', ColaboradoresViewSet)
router.register(r'informacion', InformacionViewSet)
router.register(r'correos', CorreosViewSet)
router.register(r'equipo', EquipoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'elementos-pedido', ElementoPedidoViewSet)
router.register(r'favoritos', FavoriteViewSet, basename='favoritos')

urlpatterns = [
    path('', include(router.urls)), # Todas tus rutas de API RESTful (sin prefijo 'api/' aquí)
    # path('auth/google/', GoogleAuthView.as_view(), name='google_auth'), # <--- ¡ELIMINA ESTA LÍNEA!
    # --- RUTAS DEL CARRITO ---
    path('cart/', CartView.as_view(), name='cart_detail'), # Rutas de carrito (sin prefijo 'api/' aquí)
    # --- RUTAS DE ARCHIVOS ---
    path('create-product/', create_product, name='create_product'), # Ruta para crear un producto
    path('get-presigned-url/', get_presigned_url, name='get-presigned-url'),
    # Puedes agregar más rutas aquí según sea necesario
]