from django.db import models
from ckeditor.fields import RichTextField
from django.urls import reverse
from django.db.models.signals import pre_save
from django.utils.text import slugify
from django.contrib.auth.models import User
# from .utils import resize_and_crop
# Create your models here.

#    ------------------- Categoria -------------------------- 

class Categoria_Productos(models.Model):
    id = models.AutoField('ID', primary_key=True)
    nombre = models.CharField('Nombre', max_length=40)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = 'Categorias de Productos'    
        verbose_name = 'Categoria de Productos'    
            

#    ------------------- Productos -------------------------- 
    
class Productos(models.Model):
    id = models.AutoField('ID',primary_key=True)
    disponible = models.BooleanField('Publicar', default=True, help_text='Marca esta casilla si deseas que este producto aparezca en la tienda.')
    stock = models.BooleanField('En stock', default=True, help_text='El producto está en stock actualmente?')
    prioridad = models.IntegerField('Prioridad', default=1, null=True)
    nombre = models.CharField('Nombre', max_length=100)
    categoria = models.ManyToManyField(Categoria_Productos)
    descripcion = models.TextField('Descripción del producto(Opcional)', blank=True)
    lista_caracteristicas = models.CharField('Lista de detalles', max_length=200, help_text='Deben ir separados por comas. ej: tamaño: 23x21, marca: Nike, fecha de caducidad, tipo, etc...')
    imagen1 = models.ImageField('Foto o imagen', upload_to='productos/', help_text='Esta es la imagen que aparecerá como vista previa en la tienda, debe ser la mejor.')
    imagen2 = models.ImageField('Foto o imagen 3', upload_to='productos/')
    imagen3 = models.ImageField('Foto o imagen 3', upload_to='productos/')
    precio = models.IntegerField('Precio (XAF)')
    oferta = models.BooleanField('En oferta', default=False)
    precio_rebaja = models.IntegerField('Precio de oferta (XAF)', default=0)
    fecha_subida = models.DateField('Fecha publicacion',  auto_now_add=True)


    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = 'Productos'
        verbose_name = 'Producto'


    
    

    
class Pack(models.Model):
    OPCIONES_PACK = [
        ('M', 'Meal Plan'),
        ('S', 'Chibi Sport'),
        ('B', 'Chibi Batidos'),
        ('A', 'Alimentos')
      
    ]
    
    id = models.AutoField('Id', primary_key=True)
    pack = models.CharField('Tipo',max_length=2, choices=OPCIONES_PACK, blank=True)
    disponible = models.BooleanField('Disponible', default=True, help_text='Marca si el paquete esta disponible')
    nombre = models.CharField('Nombre', max_length=100)
    para = models.CharField('Para Quienes', max_length=300, default='Para todos', blank=True)
    precio = models.IntegerField('Precio', default=0)
    imagen = models.ImageField('Portada', upload_to='packs')
    en_oferta = models.BooleanField('En oferta', default=False)
    precio_oferta = models.IntegerField('Precio tras roferta', default=0)
    duracion = models.CharField('Periodo', max_length=30)
    sesion = models.CharField('Duracion de la sesión', max_length=30)
    detalles = models.TextField('Detalles', help_text='Separar por comas')
    
    def __str__(self):
        return f'Pack de {self.nombre}'
    
    class Meta:
        verbose_name_plural = 'Packs'
        verbose_name = 'Pack'    
    
    
#    ------------------- Reviews -------------------------- 


class Reviews(models.Model):
    producto = models.ForeignKey(Productos, on_delete=models.CASCADE, related_name='reviews', null=True)
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews', default=1)
    comentario = models.TextField('Comentario', unique=True, null=True)
    fecha = models.DateField('Fecha', auto_now_add=True)
    puntaje = models.IntegerField('Rating', default=5)
    disponible = models.BooleanField('Mostrar/Ocultar', default=True, help_text='Opción para ocultar un comentario. Visible por defecto')
    
    def __str__(self) :
        return self.comentario
    
    class Meta:
        verbose_name_plural = 'Reviews'
        
#    ------------------- Colaboradores -------------------------- 
        
class Colaboradores(models.Model):
    nombre = models.CharField('Nombre de empresa', max_length=100)
    logo = models.ImageField('Logotipo', upload_to='partners')
    descripcion = models.TextField('Breve descripcion')
    
    def __str__(self) :
        return self.nombre
    
    class Meta:
        verbose_name_plural = 'Colaboradores'
        verbose_name = 'Colaborador'
    
    
#    ------------------- Informacion-------------------------- 

class Informacion(models.Model):
    correo = models.EmailField('Correo de Chibi')
    tlf = models.CharField('Numero de telefono', max_length=20)
    whatsapp = models.CharField('Número de Whatsapp', max_length=20)
    ubicacion = models.CharField('Ubicación', max_length=100)
    instagram = models.CharField('Cuenta de instagram', max_length=30, null=True)
    tiktok = models.CharField('Cuenta de Tiktok', max_length=25, null=True)
    
    def __str__(self):
        return f'Correo:{self.correo}, Tlf: {self.tlf}, Whatsapp: {self.whatsapp}'
    
    class Meta:
        verbose_name_plural = 'Información'
        verbose_name = 'Información'
    
    
    
class Correos(models.Model):
    nombre = models.CharField('Nombre', max_length=100, editable=False)
    correo = models.EmailField('Correo', null=True )
    fecha = models.DateField('Fecha de sucripción', auto_now_add=True)
    
    def __str__(self):
        return f'Correo:{self.correo},    Nombre: {self.nombre}'
    
    class Meta:
        verbose_name_plural = 'Correos Suscritos'
        verbose_name = 'Correo'
    
    
    
    
class Equipo(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField('Nombre', max_length=200)
    departamento = models.CharField('Departamento', max_length=200)
    email = models.EmailField('Correo Electrónico')
    telefono = models.CharField('Telefono', max_length=40)
    foto = models.ImageField('Foto', upload_to='equipo/', blank=True)
    descripcion = models.TextField('Descripción breve')
    linkedin = models.CharField('Dirección de linkedin', max_length=300, null=True)
    
    def __str__(self) -> str:
        return f'Nombre:{self.nombre},    departemento: {self.departamento}'
    
    class Meta:
        verbose_name_plural = 'Equipo'
        verbose_name = 'Miembro de Equipo'
        
        
        
        
    
class Pedido(models.Model):
    comprador = models.ForeignKey(User, on_delete=models.CASCADE)
    productos =  models.ManyToManyField(Productos, through='ElementoPedido')
    fecha = models.DateTimeField(auto_now_add=True)
    vendido = models.BooleanField(default=False)
    precio_total = models.IntegerField(default=0) 

    def __str__(self):
        return f"Pedido {self.id} por {self.comprador.username}"




class ElementoPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='elementos', on_delete=models.CASCADE)
    producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.IntegerField(default=0)


    def subtotal(self):
        return self.precio_unitario * self.cantidad
    
    def __str__(self) -> str:
        return f'pedido numero {self.id}'