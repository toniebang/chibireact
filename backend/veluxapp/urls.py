# veluxapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_auth import GoogleAuthView
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
)
from .views_cart import CartView # <--- ¡IMPORTA LA NUEVA VISTA DEL CARRITO!

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

urlpatterns = [
    path('', include(router.urls)),
    path('auth/google/', GoogleAuthView.as_view(), name='google_auth'),
    # --- RUTAS DEL CARRITO ---
    path('cart/', CartView.as_view(), name='cart_detail'), # Esta única URL maneja GET, POST, PUT, DELETE
]