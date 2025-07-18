// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
// ¡NO importes axios directamente aquí!
// import axios from 'axios';
import { useAuth } from './AuthContext'; // Asumo que usas AuthContext
import { useNotifications } from './NotificationContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// YA NO NECESITAS DEFINIR API_BASE_URL AQUÍ.
// El authAxios que obtienes de useAuth() ya tiene la baseURL configurada.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const CartProvider = ({ children }) => {
    // Obtén la instancia de Axios configurada del AuthContext
    const { user, authAxios } = useAuth(); // <--- ¡CLAVE! authAxios ya está pre-configurado
    const { addNotification } = useNotifications();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sessionKey, setSessionKey] = useState(() => {
        return localStorage.getItem('cartSessionKey') || null;
    });

    // Interceptor para añadir la X-Session-Key a las peticiones del carrito
    // Este interceptor es específico de CartContext y se mantiene aquí.
    useEffect(() => {
        // Este interceptor se añadirá a la instancia 'authAxios' obtenida de AuthContext
        const sessionKeyInterceptor = authAxios.interceptors.request.use(
            (config) => {
                // Solo añadir el header si es una petición al endpoint del carrito
                // Y si NO hay un usuario autenticado (el token JWT ya identifica al usuario)
                // Y si existe una sessionKey de invitado
                // Y si la URL de la petición es relativa a la baseURL de authAxios
                if (!user && sessionKey && config.url.includes('/cart')) {
                    config.headers['X-Session-Key'] = sessionKey;
                    console.log(`Interceptor Cart: Añadiendo X-Session-Key: ${sessionKey} a ${config.url}`);
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            // Asegúrate de remover el interceptor cuando el componente se desmonte
            authAxios.interceptors.request.eject(sessionKeyInterceptor);
            console.log("Interceptor de X-Session-Key eyectado.");
        };
    }, [authAxios, user, sessionKey]); // Dependencias: authAxios (estable), user (para saber si autenticado), sessionKey (si cambia)

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Usa authAxios (la instancia configurada con baseURL y tokens)
            // La URL es SOLO la ruta relativa a /api/ (ej. /cart/)
            const response = await authAxios.get(`/cart/`); 
            
            const newSessionKey = response.headers['x-session-key'] || response.headers['session-key'];
            
            if (newSessionKey && newSessionKey !== sessionKey) {
                setSessionKey(newSessionKey);
                localStorage.setItem('cartSessionKey', newSessionKey);
                console.log("Nueva session_key de carrito recibida (GET):", newSessionKey);
            }
            setCart(response.data);
            addNotification("Carrito cargado.", "success");
            return response.data;
        } catch (err) {
            console.error("Error al cargar el carrito:", err);
            setError(err);
            // Aquí, si usas `axios.isAxiosError(err)` necesitas importar `axios`
            // Podrías pasar la función `axios.isAxiosError` desde AuthContext si no quieres importarlo aquí.
            // O simplemente usar `err.response` directamente si sabes que siempre es un error de Axios.
            const errorMessage = err.response?.data?.detail
                                   ? err.response.data.detail
                                   : "No se pudo cargar el carrito.";
            addNotification(errorMessage, "error");
            
            if (err.response?.status === 404 && !user) { // No usar axios.isAxiosError si no se importa axios
                console.log("Carrito no encontrado para la session_key existente (invitado). Limpiando session_key local.");
                localStorage.removeItem('cartSessionKey');
                setSessionKey(null);
                addNotification("Se restableció la sesión del carrito (invitado).", "info");
            } else if (!user && sessionKey) {
                 console.log("Error al cargar carrito para invitado con session_key existente. Limpiando session_key local.");
                 localStorage.removeItem('cartSessionKey');
                 setSessionKey(null);
                 addNotification("Se restableció la sesión del carrito.", "info");
            }
            setCart(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [authAxios, sessionKey, addNotification, user]);

    // Las demás funciones (addToCart, updateCartItem, removeCartItem, clearCart)
    // seguirían el mismo patrón: usar `authAxios` y rutas relativas.

    const addToCart = useCallback(async (productId, quantity = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAxios.post(`/cart/`, { product_id: productId, quantity: quantity });
            // ... resto de tu lógica ...
            setCart(response.data);
            addNotification("Producto añadido al carrito.", "success");
            return true;
        } catch (err) {
            // ... manejo de errores, usa err.response directamente sin axios.isAxiosError si no importas axios ...
            const errorMessage = err.response?.data?.detail ? err.response.data.detail : "No se pudo añadir el producto al carrito.";
            addNotification(errorMessage, "error");
            return false;
        } finally { setLoading(false); }
    }, [authAxios, sessionKey, addNotification]); // Mantén todas las dependencias
    
    // Repite para updateCartItem, removeCartItem, clearCart usando authAxios y rutas relativas
    const updateCartItem = useCallback(async (productId, quantity) => {
        setLoading(true); setError(null);
        try {
            const response = await authAxios.put(`/cart/`, { product_id: productId, quantity });
            setCart(response.data);
            addNotification(quantity === 0 ? "Producto eliminado del carrito." : "Cantidad del producto actualizada.", "info");
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.detail ? err.response.data.detail : "Error al actualizar carrito.";
            addNotification(errorMessage, "error");
            return false;
        } finally { setLoading(false); }
    }, [authAxios, sessionKey, addNotification]);

    const removeCartItem = useCallback(async (productId) => {
        setLoading(true); setError(null);
        try {
            const response = await authAxios.delete(`/cart/`, { data: { product_id: productId } });
            setCart(response.data);
            addNotification("Producto eliminado del carrito.", "info");
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.detail ? err.response.data.detail : "Error al eliminar del carrito.";
            addNotification(errorMessage, "error");
            return false;
        } finally { setLoading(false); }
    }, [authAxios, sessionKey, addNotification]);

    const clearCart = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            if (cart && cart.items && cart.items.length > 0) {
                const response = await authAxios.delete(`/cart/clear/`);
                setCart(response.data || { items: [], total_items: 0, total_price: 0 });
                addNotification("Carrito vaciado.", "info");
                return true;
            }
            addNotification("El carrito ya está vacío.", "info");
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.detail ? err.response.data.detail : "Error al vaciar el carrito.";
            addNotification(errorMessage, "error");
            return false;
        } finally { setLoading(false); }
    }, [authAxios, addNotification, cart, sessionKey]);

    useEffect(() => {
        console.log("useEffect: Iniciando fetchCart. Usuario:", user ? user.username : "Invitado", "SessionKey:", sessionKey);
        fetchCart();
    }, [user, fetchCart]);

    useEffect(() => {
        if (user && sessionKey) { 
            console.log("Usuario autenticado. Limpiando session_key local del carrito después de posible fusión.");
            localStorage.removeItem('cartSessionKey');
            setSessionKey(null);
        }
    }, [user, sessionKey]);

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            error,
            addToCart,
            updateCartItem,
            removeCartItem,
            clearCart,
            sessionKey,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};