// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Asumo que usas AuthContext
import { useNotifications } from './NotificationContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// CORRECCIÓN: Usa VITE_API_BASE_URL de tu .env
// Asegúrate de que tu archivo .env tenga: VITE_API_BASE_URL=http://localhost:8000/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const CartProvider = ({ children }) => {
    const { user, authAxios } = useAuth(); // Obtén user y authAxios del AuthContext
    const { addNotification } = useNotifications();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Inicializa sessionKey leyendo de localStorage o null
    const [sessionKey, setSessionKey] = useState(() => {
        return localStorage.getItem('cartSessionKey') || null;
    });

    // Interceptor para añadir la X-Session-Key a las peticiones del carrito
    // Esto centraliza la lógica de los headers y evita repetirla en cada método.
    useEffect(() => {
        const sessionKeyInterceptor = authAxios.interceptors.request.use(
            (config) => {
                // Solo añadir el header si es una petición al endpoint del carrito
                // Y si NO hay un usuario autenticado (el token JWT ya identifica al usuario)
                // Y si existe una sessionKey de invitado
                if (!user && sessionKey && config.url.includes('/cart')) {
                    config.headers['X-Session-Key'] = sessionKey;
                    console.log(`Interceptor: Añadiendo X-Session-Key: ${sessionKey} a ${config.url}`);
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            // Limpia el interceptor cuando el componente se desmonte
            authAxios.interceptors.request.eject(sessionKeyInterceptor);
            console.log("Interceptor de X-Session-Key eyectado.");
        };
    }, [authAxios, user, sessionKey]); // Dependencias: authAxios (estable), user (para saber si autenticado), sessionKey (si cambia)

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // NO ES NECESARIO AÑADIR HEADERS AQUÍ, EL INTERCEPTOR LO HARÁ AUTOMÁTICAMENTE
            const response = await authAxios.get(`${API_BASE_URL}/cart/`); 
            
            // Intenta leer 'x-session-key' (nombre común) o 'session-key' (lo que tu backend envía)
            const newSessionKey = response.headers['x-session-key'] || response.headers['session-key'];
            
            if (newSessionKey && newSessionKey !== sessionKey) {
                setSessionKey(newSessionKey);
                localStorage.setItem('cartSessionKey', newSessionKey);
                console.log("Nueva session_key de carrito recibida (GET):", newSessionKey);
            }
            setCart(response.data);
            addNotification("Carrito cargado.", "success");
            return response.data; // Devuelve los datos del carrito
        } catch (err) {
            console.error("Error al cargar el carrito:", err);
            setError(err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.detail
                                   ? err.response.data.detail
                                   : "No se pudo cargar el carrito.";
            addNotification(errorMessage, "error");
            
            // Si el carrito no se encontró o hubo un error para un invitado, limpia la sessionKey local
            if (axios.isAxiosError(err) && err.response?.status === 404 && !user) {
                console.log("Carrito no encontrado para la session_key existente (invitado). Limpiando session_key local.");
                localStorage.removeItem('cartSessionKey');
                setSessionKey(null);
                addNotification("Se restableció la sesión del carrito (invitado).", "info");
            } else if (!user && sessionKey) { // También limpiar si hay otro error para invitado con sessionKey
                 console.log("Error al cargar carrito para invitado con session_key existente. Limpiando session_key local.");
                 localStorage.removeItem('cartSessionKey');
                 setSessionKey(null);
                 addNotification("Se restableció la sesión del carrito.", "info");
            }
            setCart(null); // Asegurar que el carrito esté null si falla la carga
            return null;
        } finally {
            setLoading(false);
        }
    }, [authAxios, sessionKey, addNotification, user]); // Añadido 'user' a dependencias

    const addToCart = useCallback(async (productId, quantity = 1) => {
        setLoading(true);
        setError(null);
        try {
            // NO ES NECESARIO AÑADIR HEADERS AQUÍ, EL INTERCEPTOR LO HARÁ AUTOMÁTICAMENTE
            const response = await authAxios.post(`${API_BASE_URL}/cart/`, {
                product_id: productId,
                quantity: quantity,
            });
            
            const newSessionKey = response.headers['x-session-key'] || response.headers['session-key'];
            if (newSessionKey && newSessionKey !== sessionKey) {
                setSessionKey(newSessionKey);
                localStorage.setItem('cartSessionKey', newSessionKey);
                console.log("Nueva session_key de carrito recibida (POST):", newSessionKey);
            }
            setCart(response.data); // Actualiza el estado del carrito con los datos de la respuesta
            addNotification("Producto añadido al carrito.", "success");
            return true;
        } catch (err) {
            console.error("Error al añadir al carrito:", err);
            setError(err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.detail
                                   ? err.response.data.detail
                                   : "No se pudo añadir el producto al carrito.";
            addNotification(errorMessage, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [authAxios, sessionKey, addNotification]);

    const updateCartItem = useCallback(async (productId, quantity) => {
        setLoading(true);
        setError(null);
        try {
            // NO ES NECESARIO AÑADIR HEADERS AQUÍ, EL INTERCEPTOR LO HARÁ AUTOMÁTICAMENTE
            const response = await authAxios.put(`${API_BASE_URL}/cart/`, { product_id: productId, quantity });
            
            const newSessionKey = response.headers['x-session-key'] || response.headers['session-key'];
            if (newSessionKey && newSessionKey !== sessionKey) {
                setSessionKey(newSessionKey);
                localStorage.setItem('cartSessionKey', newSessionKey);
            }
            setCart(response.data);
            addNotification(quantity === 0 ? "Producto eliminado del carrito." : "Cantidad del producto actualizada.", "info");
            return true;
        } catch (err) { 
            console.error("Error al actualizar el carrito:", err);
            setError(err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.detail
                                   ? err.response.data.detail
                                   : "Error al actualizar carrito.";
            addNotification(errorMessage, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [authAxios, sessionKey, addNotification]);

    const removeCartItem = useCallback(async (productId) => {
        setLoading(true);
        setError(null);
        try {
            // NO ES NECESARIO AÑADIR HEADERS AQUÍ, EL INTERCEPTOR LO HARÁ AUTOMÁTICAMENTE
            const response = await authAxios.delete(`${API_BASE_URL}/cart/`, { data: { product_id: productId } });
            
            const newSessionKey = response.headers['x-session-key'] || response.headers['session-key'];
            if (newSessionKey && newSessionKey !== sessionKey) {
                setSessionKey(newSessionKey);
                localStorage.setItem('cartSessionKey', newSessionKey);
            }
            setCart(response.data);
            addNotification("Producto eliminado del carrito.", "info");
            return true;
        } catch (err) { 
            console.error("Error al eliminar del carrito:", err);
            setError(err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.detail
                                   ? err.response.data.detail
                                   : "Error al eliminar del carrito.";
            addNotification(errorMessage, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [authAxios, sessionKey, addNotification]);

    const clearCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Solo intentar vaciar si el carrito tiene ítems para evitar petición innecesaria
            if (cart && cart.items && cart.items.length > 0) {
                // NO ES NECESARIO AÑADIR HEADERS AQUÍ, EL INTERCEPTOR LO HARÁ AUTOMÁTICAMENTE
                // Usamos /cart/clear/ como endpoint para vaciar todo el carrito
                const response = await authAxios.delete(`${API_BASE_URL}/cart/clear/`); 
                
                const newSessionKey = response.headers['x-session-key'] || response.headers['session-key'];
                if (newSessionKey && newSessionKey !== sessionKey) {
                    setSessionKey(newSessionKey);
                    localStorage.setItem('cartSessionKey', newSessionKey);
                } else if (!newSessionKey) { // Si el backend no devuelve una nueva clave, asume que la vieja se invalida
                    localStorage.removeItem('cartSessionKey');
                    setSessionKey(null);
                }
                setCart(response.data || { items: [], total_items: 0, total_price: 0 }); // Asegura un objeto de carrito vacío si la respuesta es null/undefined
                addNotification("Carrito vaciado.", "info");
                return true;
            }
            addNotification("El carrito ya está vacío.", "info");
            return true;
        } catch (err) { 
            console.error("Error al vaciar el carrito:", err);
            setError(err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.detail
                                   ? err.response.data.detail
                                   : "Error al vaciar el carrito.";
            addNotification(errorMessage, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }, [authAxios, addNotification, cart, sessionKey]); // Añadido 'cart' a dependencias para la comprobación de items

    // CONSOLIDACIÓN DE USEEFFECTS:
    // Este `useEffect` centraliza la lógica de carga del carrito.
    // Se ejecuta al montar el componente, cuando el usuario cambia (login/logout),
    // o cuando la sessionKey cambia (nueva sesión de invitado, fusión, etc.).
    useEffect(() => {
        console.log("useEffect: Iniciando fetchCart. Usuario:", user ? user.username : "Invitado", "SessionKey:", sessionKey);
        // fetchCart ya tiene 'sessionKey' y 'user' en sus dependencias y maneja la lógica de invitacion/autenticación.
        // Llamarla aquí garantiza que se intente cargar el carrito al montar el componente o al cambiar el usuario/sesión.
        fetchCart();
    }, [user, fetchCart]); // `fetchCart` es estable por `useCallback` y tiene sus propias dependencias.

    // Este `useEffect` específico maneja la limpieza de la sessionKey del localStorage
    // cuando un usuario se autentica (se loguea).
    useEffect(() => {
        // Si el usuario se autentica (existe 'user') y todavía hay una 'sessionKey' de invitado,
        // la limpiamos de localStorage. El backend ya debería haber manejado la fusión del carrito.
        if (user && sessionKey) { 
            console.log("Usuario autenticado. Limpiando session_key local del carrito después de posible fusión.");
            localStorage.removeItem('cartSessionKey');
            setSessionKey(null);
        }
    }, [user, sessionKey]); // Depende de `user` y `sessionKey` para reaccionar al login


    return (
        <CartContext.Provider value={{
            cart,
            loading,
            error,
            addToCart,
            updateCartItem,
            removeCartItem,
            clearCart,
            sessionKey, // Expón sessionKey si es útil para otros componentes
            fetchCart // Expón fetchCart si es necesario recargar el carrito manualmente
        }}>
            {children}
        </CartContext.Provider>
    );
};