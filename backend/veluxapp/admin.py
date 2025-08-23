# veluxapp/admin.py

from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from veluxapp.models import (
    Categoria_Productos,
    Reviews,
    Productos,
    Colaboradores,
    Informacion,
    Pack,
    Correos,
    Equipo,
    ElementoPedido,
    Pedido,
    Cart,
    CartItem
)

# Obtener el modelo de usuario activo, que es tu CustomUser
User = get_user_model()


# --- Admin para CustomUser ---
class CustomUserAdmin(BaseUserAdmin):
    # Asegúrate de que los fieldsets tengan el formato correcto: (nombre_seccion, {'fields': ('campo1', 'campo2')})
    # Aquí lo corregimos si no lo estaba ya:
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('profile_picture', 'google_id')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Información Adicional', {'fields': ('profile_picture', 'google_id')}),
    )

    # Añadir los campos personalizados a la lista de visualización
    list_display = BaseUserAdmin.list_display + ('profile_picture', 'google_id',)


# Registra tu CustomUser con tu CustomUserAdmin
admin.site.register(User, CustomUserAdmin)


# --- Tus otros modelos registrados (corregidos según tu models.py exacto) ---

class Categoria_ProductosAdmin(admin.ModelAdmin):
    list_display = ('id','nombre',) # Estos campos existen en Categoria_Productos

class EquipoAdmin(admin.ModelAdmin):
    # En models.py: Equipo tiene 'id', 'nombre', 'departamento', 'email', 'telefono', 'foto', 'descripcion', 'linkedin'
    list_display = ('id','nombre','departamento',) # Corregido: usa 'departamento'

class ReviewsAdmin(admin.ModelAdmin):
    # En models.py: Reviews tiene 'producto', 'usuario', 'comentario', 'fecha', 'puntaje', 'disponible'
    list_display = ('comentario', 'usuario', 'puntaje','disponible', 'fecha', 'producto' ) # Corregido: usa 'puntaje' y 'fecha'

class PackAdmin(admin.ModelAdmin):
    # En models.py: Pack tiene 'id', 'pack', 'disponible', 'nombre', 'para', 'precio', 'imagen', 'en_oferta', 'precio_oferta', 'duracion', 'sesion', 'detalles'
    list_display = ('nombre', 'pack', 'precio','en_oferta', 'precio_oferta', 'disponible' ) # Estos campos existen en Pack

class CorreosAdmin(admin.ModelAdmin):
    # En models.py: Correos tiene 'nombre', 'correo', 'fecha'
    list_display = ('correo', 'nombre', 'fecha',) # Corregido: usa 'correo'

class ProductosAdmin(admin.ModelAdmin):
    # En models.py: Productos tiene 'id', 'disponible', 'stock', 'prioridad', 'nombre', 'categoria', 'descripcion', 'lista_caracteristicas', 'imagen1', 'imagen2', 'imagen3', 'precio', 'oferta', 'precio_rebaja', 'fecha_subida'
    list_display=( 'nombre', 'linea', 'precio', 'oferta', 'disponible', 'stock', 'fecha_subida', 'id') # Corregido: usa 'fecha_subida'
    search_fields = ('nombre', 'descripcion', 'lista_caracteristicas')
    list_filter = ('linea', 'oferta', 'disponible', 'stock', 'fecha_subida', 'categoria') # Corregido: usa 'fecha_subida'
    list_per_page=12
    ordering = ('-fecha_subida',)

class ColaboradoresAdmin(admin.ModelAdmin):
    list_display=( 'nombre',)
    search_fields = ('nombre',)


class InformacionAdmin(admin.ModelAdmin):
    # En models.py: Informacion tiene 'correo', 'tlf', 'whatsapp', 'ubicacion', 'instagram', 'tiktok'
    # Por lo tanto, tu list_display original era correcto, no 'titulo' o 'contenido'.
    list_display=( 'correo', 'tlf', 'whatsapp', 'ubicacion', 'instagram', 'tiktok') # Corregido: usa campos de tu modelo Informacion


class ElementoPedidoInline(admin.TabularInline):
    model = ElementoPedido
    extra = 1
    fields = ('producto', 'cantidad', 'precio_unitario',) # Estos campos existen en ElementoPedido

class PedidoAdmin(admin.ModelAdmin):
    # En models.py: Pedido tiene 'comprador', 'productos', 'fecha', 'vendido', 'precio_total'
    # No tiene 'fecha_pedido' o 'estado'. Usa 'fecha' y 'vendido'.
    list_display = ('id', 'comprador', 'fecha', 'vendido', 'precio_total',) # Corregido: usa 'fecha' y 'vendido'
    list_filter = ('vendido', 'fecha',) # Corregido: usa 'vendido' y 'fecha'
    inlines = [ElementoPedidoInline]
    search_fields = ('comprador__username', 'comprador__email',)

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1
    fields = ('producto', 'cantidad', 'precio_unitario',) # Estos campos existen en CartItem
    
class CartAdmin(admin.ModelAdmin):
    # En models.py: Cart tiene 'usuario', 'fecha_creacion', 'fecha_actualizacion'
    list_display = ('usuario', 'fecha_creacion', 'fecha_actualizacion',) # Estos campos existen en Cart
    inlines = [CartItemInline]
    search_fields = ('usuario__username', 'usuario__email',)

# No necesitas ProductoAdmin si ya tienes ProductosAdmin
# class ProductoAdmin(admin.ModelAdmin):
#     list_display = ('nombre', 'precio')
#     search_fields = ('nombre',)


# --- Registros finales de modelos ---
admin.site.register(Categoria_Productos, Categoria_ProductosAdmin)
admin.site.register(Reviews, ReviewsAdmin)
admin.site.register(Productos, ProductosAdmin)
admin.site.register(Colaboradores, ColaboradoresAdmin)
admin.site.register(Informacion, InformacionAdmin)
admin.site.register(Pack, PackAdmin)
admin.site.register(Correos, CorreosAdmin)
admin.site.register(Equipo, EquipoAdmin)
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(Cart)
admin.site.register(CartItem)