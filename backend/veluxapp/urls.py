# veluxapp/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
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
router.register(r'elementos-pedido', ElementoPedidoViewSet) # Puede que no necesites acceso directo a este si lo manejas vía Pedido

urlpatterns = [
    path('', include(router.urls)),
]