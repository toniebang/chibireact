# veluxapp/views_cart.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import F

from .models import Cart, CartItem, Productos
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer

import uuid # Para generar UUIDs para session_key

class CartView(APIView):
    """
    Vista principal para gestionar el carrito de compras.
    Permite obtener, añadir, actualizar y eliminar ítems del carrito.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def get_cart(self, request):
        """
        Intenta obtener el carrito basado en el usuario autenticado o en la session_key.
        Maneja la fusión de carritos de invitado a carritos de usuario al autenticarse.
        Crea un nuevo carrito si no existe.
        """
        cart = None
        # Nueva variable para almacenar la session_key que debe ser devuelta en la cabecera
        self.current_session_key_to_send = None 

        session_key_from_header = request.headers.get('X-Session-Key')

        # --- Lógica para usuarios autenticados ---
        if request.user.is_authenticated:
            user_cart, user_cart_created = Cart.objects.get_or_create(user=request.user)
            cart = user_cart

            # Si el usuario estaba navegando como invitado y ahora se autenticó
            if session_key_from_header:
                try:
                    guest_cart = Cart.objects.get(session_key=session_key_from_header, user__isnull=True)
                    
                    # Si existe un carrito de invitado y no es el mismo que el de usuario (si ya existía)
                    if guest_cart != user_cart:
                        with transaction.atomic():
                            # Fusionar ítems del carrito de invitado al carrito del usuario
                            for guest_item in guest_cart.items.all():
                                existing_item = CartItem.objects.filter(
                                    cart=user_cart, product=guest_item.product
                                ).first()

                                if existing_item:
                                    # Si el producto ya está en el carrito del usuario, actualiza la cantidad
                                    existing_item.quantity = F('quantity') + guest_item.quantity
                                    existing_item.save()
                                else:
                                    # Si no está, mueve el ítem del carrito de invitado al del usuario
                                    guest_item.cart = user_cart
                                    guest_item.save()
                            
                            # Eliminar el carrito de invitado después de fusionar sus ítems
                            guest_cart.delete()
                            print(f"Carrito de invitado {session_key_from_header} fusionado y eliminado.")

                except Cart.DoesNotExist:
                    # No hay carrito de invitado con esa session_key, no hay nada que fusionar.
                    pass
            
            # Asegurarse de que el carrito del usuario autenticado no tenga una session_key.
            if cart and cart.session_key:
                cart.session_key = None
                cart.save()
            
            # Para usuarios autenticados, no enviamos X-Session-Key
            self.current_session_key_to_send = None 
            return cart

        # --- Lógica para usuarios NO autenticados (invitados) ---
        else:
            # 1. Intentar obtener el carrito por la session_key de la cabecera
            if session_key_from_header:
                try:
                    cart = Cart.objects.get(session_key=session_key_from_header, user__isnull=True)
                    # CORRECCIÓN: Si encontramos un carrito existente, su session_key es la que debemos devolver.
                    self.current_session_key_to_send = cart.session_key 
                    return cart
                except Cart.DoesNotExist:
                    # Si la session_key no existe o no corresponde a un carrito de invitado,
                    # `cart` permanece None y se creará uno nuevo.
                    pass
            
            # 2. Si no hay session_key válida o no se encontró un carrito existente, crear uno nuevo
            if not cart: # Solo si no se encontró un carrito hasta ahora
                new_session_key = str(uuid.uuid4())
                cart = Cart.objects.create(session_key=new_session_key, user=None)
                # CORRECCIÓN: Al crear un nuevo carrito, esta es la session_key a devolver.
                self.current_session_key_to_send = new_session_key 
                print(f"Nuevo carrito de invitado creado con session_key: {new_session_key}")
            
            return cart

    def get(self, request, *args, **kwargs):
        """
        Obtiene el carrito actual del usuario o crea uno nuevo si no existe.
        """
        cart = self.get_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        response_data = serializer.data
        
        response = Response(response_data, status=status.HTTP_200_OK)
        
        # CORRECCIÓN: Siempre devuelve la session_key si es un carrito de invitado
        # (current_session_key_to_send solo tiene valor si es invitado)
        if self.current_session_key_to_send:
            response['X-Session-Key'] = self.current_session_key_to_send
        print(f"DEBUG: Enviando X-Session-Key en la respuesta: {self.current_session_key_to_send}") # <-- Añade esta línea
        return response

    def post(self, request, *args, **kwargs):
        """
        Añade un producto al carrito o actualiza su cantidad si ya existe.
        """
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        try:
            product = get_object_or_404(Productos, id=product_id)
            if not product.disponible or not product.stock:
                return Response({"detail": "Este producto no está disponible o está fuera de stock."}, status=status.HTTP_400_BAD_REQUEST)
        except Productos.DoesNotExist:
            return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        cart = self.get_cart(request) # Obtiene el carrito (¡con la lógica de fusión!)

        with transaction.atomic():
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={
                    'quantity': quantity,
                    'price_at_addition': product.precio
                }
            )

            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            cart.refresh_from_db()
            response_serializer = CartSerializer(cart, context={'request': request})
            
            response = Response(response_serializer.data, status=status.HTTP_200_OK)
            # CORRECCIÓN: Siempre devuelve la session_key si es un carrito de invitado
            if self.current_session_key_to_send:
                response['X-Session-Key'] = self.current_session_key_to_send
            print(f"DEBUG: Enviando X-Session-Key en la respuesta: {self.current_session_key_to_send}") # <-- Añade esta línea
            return response


    def put(self, request, *args, **kwargs):
        """
        Actualiza la cantidad de un ítem específico en el carrito.
        Si la cantidad es 0, elimina el ítem.
        """
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        new_quantity = serializer.validated_data['quantity']

        cart = self.get_cart(request) # Obtiene el carrito

        with transaction.atomic():
            try:
                cart_item = CartItem.objects.get(cart=cart, product__id=product_id)
            except CartItem.DoesNotExist:
                return Response({"detail": "El producto no está en el carrito."}, status=status.HTTP_404_NOT_FOUND)

            if new_quantity <= 0:
                cart_item.delete()
            else:
                product = get_object_or_404(Productos, id=product_id)
                if not product.disponible or not product.stock:
                    return Response({"detail": "Este producto no está disponible o está fuera de stock."}, status=status.HTTP_400_BAD_REQUEST)
                
                cart_item.quantity = new_quantity
                cart_item.save()

            cart.refresh_from_db()
            response_serializer = CartSerializer(cart, context={'request': request})
            
            response = Response(response_serializer.data, status=status.HTTP_200_OK)
            # CORRECCIÓN: Siempre devuelve la session_key si es un carrito de invitado
            if self.current_session_key_to_send:
                response['X-Session-Key'] = self.current_session_key_to_send
            print(f"DEBUG: Enviando X-Session-Key en la respuesta: {self.current_session_key_to_send}") # <-- Añade esta línea
            return response


    def delete(self, request, *args, **kwargs):
        """
        Elimina un ítem específico del carrito.
        Esperamos 'product_id' en el cuerpo de la petición (request.data).
        """
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"detail": "Se requiere 'product_id' para eliminar un ítem del carrito."}, status=status.HTTP_400_BAD_REQUEST)
        
        cart = self.get_cart(request) # Obtiene el carrito

        with transaction.atomic():
            try:
                cart_item = CartItem.objects.get(cart=cart, product__id=product_id)
                cart_item.delete()
            except CartItem.DoesNotExist:
                return Response({"detail": "El producto no está en el carrito."}, status=status.HTTP_404_NOT_FOUND)

            cart.refresh_from_db()
            response_serializer = CartSerializer(cart, context={'request': request})
            
            response = Response(response_serializer.data, status=status.HTTP_200_OK)
            # CORRECCIÓN: Siempre devuelve la session_key si es un carrito de invitado
            if self.current_session_key_to_send:
                response['X-Session-Key'] = self.current_session_key_to_send
            print(f"DEBUG: Enviando X-Session-Key en la respuesta: {self.current_session_key_to_send}") # <-- Añade esta línea
            return response

# Si tienes una vista para limpiar todo el carrito, también necesita la cabecera
class ClearCartView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def delete(self, request, *args, **kwargs):
        session_key_from_header = request.headers.get('X-Session-Key')
        cart = None
        current_session_key_to_send = None

        if request.user.is_authenticated:
            try:
                cart = Cart.objects.get(user=request.user)
            except Cart.DoesNotExist:
                return Response({"detail": "No hay un carrito para el usuario autenticado."}, status=status.HTTP_404_NOT_FOUND)
        else:
            if session_key_from_header:
                try:
                    cart = Cart.objects.get(session_key=session_key_from_header, user__isnull=True)
                    current_session_key_to_send = cart.session_key # Obtener la clave del carrito existente
                except Cart.DoesNotExist:
                    return Response({"detail": "No se encontró un carrito de invitado con la clave proporcionada."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"detail": "No se proporcionó una clave de sesión para invitado."}, status=status.HTTP_400_BAD_REQUEST)

        if not cart:
            return Response({"detail": "No se encontró un carrito para limpiar."}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            cart.items.all().delete() # Elimina todos los ítems del carrito

            # Opcional: Si quieres generar una *nueva* session_key para el carrito invitado después de limpiar
            # (para que el carrito quede vacío y se use una nueva clave)
            if not request.user.is_authenticated:
                new_session_key = str(uuid.uuid4())
                cart.session_key = new_session_key
                cart.save()
                current_session_key_to_send = new_session_key # Actualiza la clave a enviar
                print(f"Carrito de invitado {session_key_from_header} limpiado y nueva session_key asignada: {new_session_key}")
            else:
                cart.save() # Asegurarse de guardar si hubo cambios (ej. si se eliminó la session_key en el carrito de usuario)

            cart.refresh_from_db()
            response_serializer = CartSerializer(cart, context={'request': request})
            response = Response(response_serializer.data, status=status.HTTP_200_OK)
            
            # Envía la session_key actual (o la nueva si se generó) para invitados
            if current_session_key_to_send:
                response['X-Session-Key'] = current_session_key_to_send
            print(f"DEBUG: Enviando X-Session-Key en la respuesta: {self.current_session_key_to_send}") # <-- Añade esta línea
            return response