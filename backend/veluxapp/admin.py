from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from veluxapp.models import Categoria_Productos, Reviews, Productos, Colaboradores, Informacion, Pack, Correos, Equipo, ElementoPedido, Pedido

# Register your models here.
class Categoria_ProductosAdmin(admin.ModelAdmin):
    
    list_display = ('id','nombre',)
 
class EquipoAdmin(admin.ModelAdmin):
    list_display = ('id','nombre','departamento')
    
class ReviewsAdmin(admin.ModelAdmin):
    list_display = ('comentario', 'usuario', 'puntaje','disponible', 'fecha', 'producto' )
    
    
class PackAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'pack', 'precio','en_oferta', 'precio_oferta', 'disponible' )
    
    
class CorreosAdmin(admin.ModelAdmin):
    list_display = ('correo',  'nombre', 'fecha')
    
class ProductosAdmin(admin.ModelAdmin):
    list_display=( 'nombre',  'precio', 'oferta', 'precio_rebaja','disponible', 'fecha_subida', 'stock')
    search_fields = ('nombre',)
    list_filter = ('fecha_subida',)
    list_per_page=12#record 10 per page
    
class ColaboradoresAdmin(admin.ModelAdmin):
    list_display=( 'nombre',)
    search_fields = ('nombre',)
    
    
class InformacionAdmin(admin.ModelAdmin):
    list_display=( 'correo', 'tlf', 'whatsapp', 'ubicacion', 'instagram', 'tiktok')
    
class ElementoPedidoInline(admin.TabularInline):
    model = ElementoPedido
    extra = 1
    fields = ('producto', 'cantidad')

class PedidoAdmin(admin.ModelAdmin):
    list_display = ('comprador', 'display_productos', 'fecha', 'vendido', 'precio_total_display', 'id')
    list_filter = ('vendido', 'fecha')
    inlines = [ElementoPedidoInline]
    
    def display_productos(self, obj):
        return ", ".join([producto.nombre for producto in obj.productos.all()])

    def precio_total_display(self, obj):
        return obj.precio_total
    precio_total_display.short_description = 'Precio Total'

class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio')
    search_fields = ('nombre',)





admin.site.register(Categoria_Productos, Categoria_ProductosAdmin)
admin.site.register(Reviews, ReviewsAdmin)
admin.site.register(Productos, ProductosAdmin)
admin.site.register(Colaboradores, ColaboradoresAdmin)
admin.site.register(Informacion, InformacionAdmin)
admin.site.register(Pack, PackAdmin)
admin.site.register(Correos, CorreosAdmin)
admin.site.register(Equipo, EquipoAdmin)

admin.site.register(Pedido, PedidoAdmin)
