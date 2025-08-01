# Generated by Django 5.2.1 on 2025-07-18 22:21

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('profile_picture', models.URLField(blank=True, max_length=500, null=True)),
                ('google_id', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Categoria_Productos',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=40, verbose_name='Nombre')),
            ],
            options={
                'verbose_name': 'Categoria de Productos',
                'verbose_name_plural': 'Categorias de Productos',
            },
        ),
        migrations.CreateModel(
            name='Colaboradores',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100, verbose_name='Nombre de empresa')),
                ('logo', models.ImageField(upload_to='partners', verbose_name='Logotipo')),
                ('descripcion', models.TextField(verbose_name='Breve descripcion')),
            ],
            options={
                'verbose_name': 'Colaborador',
                'verbose_name_plural': 'Colaboradores',
            },
        ),
        migrations.CreateModel(
            name='Correos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(editable=False, max_length=100, verbose_name='Nombre')),
                ('correo', models.EmailField(max_length=254, null=True, verbose_name='Correo')),
                ('fecha', models.DateField(auto_now_add=True, verbose_name='Fecha de sucripción')),
            ],
            options={
                'verbose_name': 'Correo',
                'verbose_name_plural': 'Correos Suscritos',
            },
        ),
        migrations.CreateModel(
            name='Equipo',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=200, verbose_name='Nombre')),
                ('departamento', models.CharField(max_length=200, verbose_name='Departamento')),
                ('email', models.EmailField(max_length=254, verbose_name='Correo Electrónico')),
                ('telefono', models.CharField(max_length=40, verbose_name='Telefono')),
                ('foto', models.ImageField(blank=True, upload_to='equipo/', verbose_name='Foto')),
                ('descripcion', models.TextField(verbose_name='Descripción breve')),
                ('linkedin', models.CharField(max_length=300, null=True, verbose_name='Dirección de linkedin')),
            ],
            options={
                'verbose_name': 'Miembro de Equipo',
                'verbose_name_plural': 'Equipo',
            },
        ),
        migrations.CreateModel(
            name='Informacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('correo', models.EmailField(max_length=254, verbose_name='Correo de Chibi')),
                ('tlf', models.CharField(max_length=20, verbose_name='Numero de telefono')),
                ('whatsapp', models.CharField(max_length=20, verbose_name='Número de Whatsapp')),
                ('ubicacion', models.CharField(max_length=100, verbose_name='Ubicación')),
                ('instagram', models.CharField(max_length=30, null=True, verbose_name='Cuenta de instagram')),
                ('tiktok', models.CharField(max_length=25, null=True, verbose_name='Cuenta de Tiktok')),
            ],
            options={
                'verbose_name': 'Información',
                'verbose_name_plural': 'Información',
            },
        ),
        migrations.CreateModel(
            name='Pack',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='Id')),
                ('pack', models.CharField(blank=True, choices=[('M', 'Meal Plan'), ('S', 'Chibi Sport'), ('B', 'Chibi Batidos'), ('A', 'Alimentos')], max_length=2, verbose_name='Tipo')),
                ('disponible', models.BooleanField(default=True, help_text='Marca si el paquete esta disponible', verbose_name='Disponible')),
                ('nombre', models.CharField(max_length=100, verbose_name='Nombre')),
                ('para', models.CharField(blank=True, default='Para todos', max_length=300, verbose_name='Para Quienes')),
                ('precio', models.IntegerField(default=0, verbose_name='Precio')),
                ('imagen', models.ImageField(upload_to='packs', verbose_name='Portada')),
                ('en_oferta', models.BooleanField(default=False, verbose_name='En oferta')),
                ('precio_oferta', models.IntegerField(default=0, verbose_name='Precio tras oferta')),
                ('duracion', models.CharField(max_length=30, verbose_name='Periodo')),
                ('sesion', models.CharField(max_length=30, verbose_name='Duracion de la sesión')),
                ('detalles', models.TextField(help_text='Separar por comas', verbose_name='Detalles')),
            ],
            options={
                'verbose_name': 'Pack',
                'verbose_name_plural': 'Packs',
            },
        ),
        
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('session_key', models.CharField(blank=True, help_text='Clave de sesión para usuarios no autenticados (ej. UUID).', max_length=40, null=True, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cart', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Carrito',
                'verbose_name_plural': 'Carritos',
            },
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('vendido', models.BooleanField(default=False)),
                ('precio_total', models.IntegerField(default=0)),
                ('comprador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Pedido',
                'verbose_name_plural': 'Pedidos',
            },
        ),
        migrations.CreateModel(
            name='ElementoPedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.PositiveIntegerField(default=1)),
                ('precio_unitario', models.IntegerField(default=0)),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elementos', to='veluxapp.pedido')),
            ],
            options={
                'verbose_name': 'Elemento de Pedido',
                'verbose_name_plural': 'Elementos de Pedido',
            },
        ),
        migrations.CreateModel(
            name='Productos',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID')),
                ('disponible', models.BooleanField(default=True, help_text='Marca esta casilla si deseas que este producto aparezca en la tienda.', verbose_name='Publicar')),
                ('stock', models.BooleanField(default=True, help_text='El producto está en stock actualmente?', verbose_name='En stock')),
                ('prioridad', models.IntegerField(default=1, null=True, verbose_name='Prioridad')),
                ('nombre', models.CharField(max_length=100, verbose_name='Nombre')),
                ('descripcion', models.TextField(blank=True, verbose_name='Descripción del producto(Opcional)')),
                ('lista_caracteristicas', models.CharField(help_text='Deben ir separados por comas. ej: tamaño: 23x21, marca: Nike, fecha de caducidad, tipo, etc...', max_length=200, verbose_name='Lista de detalles')),
                ('imagen1', models.ImageField(help_text='Esta es la imagen que aparecerá como vista previa en la tienda, debe ser la mejor.', upload_to='productos/', verbose_name='Foto o imagen')),
                ('imagen2', models.ImageField(upload_to='productos/', verbose_name='Foto o imagen 3')),
                ('imagen3', models.ImageField(upload_to='productos/', verbose_name='Foto o imagen 3')),
                ('precio', models.IntegerField(verbose_name='Precio (XAF)')),
                ('oferta', models.BooleanField(default=False, verbose_name='En oferta')),
                ('precio_rebaja', models.IntegerField(default=0, verbose_name='Precio de oferta (XAF)')),
                ('fecha_subida', models.DateField(auto_now_add=True, verbose_name='Fecha publicacion')),
                ('categoria', models.ManyToManyField(to='veluxapp.categoria_productos')),
            ],
            options={
                'verbose_name': 'Producto',
                'verbose_name_plural': 'Productos',
            },
        ),
        migrations.AddField(
            model_name='pedido',
            name='productos',
            field=models.ManyToManyField(through='veluxapp.ElementoPedido', to='veluxapp.productos'),
        ),
        migrations.AddField(
            model_name='elementopedido',
            name='producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='veluxapp.productos'),
        ),
        migrations.CreateModel(
            name='Reviews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comentario', models.TextField(null=True, unique=True, verbose_name='Comentario')),
                ('fecha', models.DateField(auto_now_add=True, verbose_name='Fecha')),
                ('puntaje', models.IntegerField(default=5, verbose_name='Rating')),
                ('disponible', models.BooleanField(default=True, help_text='Opción para ocultar un comentario. Visible por defecto', verbose_name='Mostrar/Ocultar')),
                ('producto', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='veluxapp.productos')),
                ('usuario', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Reviews',
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('price_at_addition', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='veluxapp.cart')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='veluxapp.productos')),
            ],
            options={
                'verbose_name': 'Ítem de Carrito',
                'verbose_name_plural': 'Ítems de Carrito',
                'unique_together': {('cart', 'product')},
            },
        ),
    ]
