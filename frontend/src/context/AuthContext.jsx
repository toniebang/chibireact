// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios'; // ¡Importa Axios aquí!
import { useNotifications } from './NotificationContext';

// Obtén la URL base de la API aquí, solo una vez por este contexto
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Crea la instancia de Axios que será utilizada en todo el AuthContext
// y se compartirá con otros contextos que la necesiten (como CartContext)
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => false,
  register: async () => ({ success: false }),
  logout: async () => {},
  authAxios: authAxios, // <--- EXPORTA LA INSTANCIA CONFIGURADA AQUÍ
});

// Helper function para formatear errores del backend
const formatBackendErrorForDisplay = (backendError) => {
  if (!backendError) return 'Error desconocido del servidor.';
  if (typeof backendError === 'string') return backendError;
  if (backendError.detail) return backendError.detail;
  if (backendError.message) return backendError.message;

  if (typeof backendError === 'object') {
    return Object.entries(backendError)
      .map(([key, value]) => {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        return Array.isArray(value) ? `${fieldName}: ${value.join(', ')}` : `${fieldName}: ${value}`;
      })
      .flat()
      .join(' ');
  }
  return 'Error de formato inesperado del servidor.';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addNotification } = useNotifications();

  // Función de Logout
  const logout = useCallback(async (sendToServer = true, keepError = false) => {
    // --- DEBUG LOGS ---
    console.log("Logout iniciado. sendToServer:", sendToServer, "keepError:", keepError);
    // --- FIN DEBUG LOGS ---
    setLoading(true);
    if (!keepError) {
      setError(null);
    }
    try {
      if (sendToServer && refreshToken) {
        console.log('Intentando logout en el servidor. Refresh token:', refreshToken ? refreshToken.substring(0, 10) + '...' : 'N/A');
        await authAxios.post('/logout/', { refresh_token: refreshToken });
        addNotification('Has cerrado sesión correctamente.', 'info');
      }
    } catch (err) {
      // --- DEBUG LOGS ---
      console.error("Error al hacer logout en el servidor:", err.response?.data || err.message || err);
      // --- FIN DEBUG LOGS ---
      const displayMessage = 'Hubo un problema al cerrar sesión en el servidor, pero tu sesión local ha sido terminada.';
      addNotification(displayMessage, 'error');
      setError({ message: displayMessage });
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setLoading(false);
      // --- DEBUG LOGS ---
      console.log("Logout finalizado. Estado de usuario y tokens limpiados.");
      // --- FIN DEBUG LOGS ---
    }
  }, [refreshToken, addNotification]);

  const fetchUserProfile = useCallback(async (token) => {
    // --- DEBUG LOGS ---
    console.log("fetchUserProfile: Intentando obtener perfil con token:", token ? token.substring(0, 10) + '...' : 'No token');
    // --- FIN DEBUG LOGS ---
    try {
      const response = await authAxios.get('/me/', {
        headers: { Authorization: `Bearer ${token}` }, // Envía el token explícitamente para esta llamada inicial
      });
      // --- DEBUG LOGS ---
      console.log("fetchUserProfile: Perfil de usuario obtenido exitosamente:", response.data);
      // --- FIN DEBUG LOGS ---
      setUser(response.data);
      return response.data;
    } catch (err) {
      // --- DEBUG LOGS ---
      console.error("fetchUserProfile: Error al obtener perfil de usuario:", err.response?.data || err.message || err);
      // --- FIN DEBUG LOGS ---
      const displayMessage = 'Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.';
      // addNotification(displayMessage, 'error');
      setError({ message: displayMessage });
      logout(false, true); // Logout local si falla la validación del token
      return null;
    }
  }, [addNotification, logout]);

  const login = useCallback(async (identifier, password) => {
    // --- DEBUG LOGS ---
    console.log("Login: Iniciando intento de login para:", identifier);
    // --- FIN DEBUG LOGS ---
    setLoading(true);
    setError(null);
    try {
      // Usa authAxios para la llamada de login
      const response = await authAxios.post('/token/', { identifier, password });
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;

      // --- DEBUG LOGS ---
      // console.log("Login: Tokens obtenidos. Access:", newAccessToken ? newAccessToken.substring(0, 10) + '...' : 'null', "Refresh:", newRefreshToken ? newRefreshToken.substring(0, 10) + '...' : 'null');
      // --- FIN DEBUG LOGS ---

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      // --- DEBUG LOGS ---
      console.log("Login: Llamando a fetchUserProfile con el nuevo token.");
      // --- FIN DEBUG LOGS ---
      await fetchUserProfile(newAccessToken); // <--- Llama a fetchUserProfile aquí
      addNotification('¡Inicio de sesión exitoso! Bienvenido.', 'success');
      // --- DEBUG LOGS ---
      console.log("Login: Proceso de login completado exitosamente.");
      // --- FIN DEBUG LOGS ---
      return true;
    } catch (err) {
      // --- DEBUG LOGS ---
      console.error("Login: Error en el login:", err.response?.data || err.message || err);
      // --- FIN DEBUG LOGS ---
      let derivedToastAndFormMessage = 'Error de red o desconocido durante el login.';

      if (axios.isAxiosError(err) && err.response) {
        derivedToastAndFormMessage = formatBackendErrorForDisplay(err.response.data);
        if (
            derivedToastAndFormMessage.includes('No se encontraron credenciales válidas.') ||
            derivedToastAndFormMessage.includes('No active account found with the given credentials') ||
            derivedToastAndFormMessage.includes('no activa encontrada con las credenciales dadas') ||
            derivedToastAndFormMessage.includes('Credenciales inválidas.')
        ) {
            derivedToastAndFormMessage = 'Usuario o contraseña incorrectos. Por favor, verifica tus datos.';
        }
      }

      setError({ message: derivedToastAndFormMessage });
      addNotification(derivedToastAndFormMessage, 'error');
      logout(false, true); // Asegura el logout local si falla el login
      // --- DEBUG LOGS ---
      console.log("Login: Proceso de login fallido.");
      // --- FIN DEBUG LOGS ---
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile, addNotification, logout]);

  const register = useCallback(async (username, email, password, password_confirm) => {
    // --- DEBUG LOGS ---
    console.log("Register: Iniciando intento de registro para:", email);
    // --- FIN DEBUG LOGS ---
    setLoading(true);
    setError(null);
    try {
      // Usa authAxios para la llamada de registro
      const response = await authAxios.post('/register/', { username, email, password, password_confirm });
      // --- DEBUG LOGS ---
      console.log("Register: Registro exitoso. Data:", response.data);
      // --- FIN DEBUG LOGS ---
      addNotification('¡Registro exitoso! Iniciando sesión automáticamente...', 'success');
      await login(email, password);
      // --- DEBUG LOGS ---
      console.log("Register: Proceso de registro completado.");
      // --- FIN DEBUG LOGS ---
      return { success: true, message: response.data?.message || 'Registro exitoso.' };
    } catch (err) {
      // --- DEBUG LOGS ---
      console.error("Register: Error en el registro:", err.response?.data || err.message || err);
      // --- FIN DEBUG LOGS ---
      let derivedToastAndFormMessage = 'Error de red o desconocido durante el registro.';

      if (axios.isAxiosError(err) && err.response) {
        derivedToastAndFormMessage = formatBackendErrorForDisplay(err.response.data);
      }

      setError({ message: derivedToastAndFormMessage });
      addNotification(derivedToastAndFormMessage, 'error');
      // --- DEBUG LOGS ---
      console.log("Register: Proceso de registro fallido.");
      // --- FIN DEBUG LOGS ---
      return { success: false, error: derivedToastAndFormMessage };
    } finally {
      setLoading(false);
    }
  }, [login, addNotification]);

  // Interceptor de Axios para añadir el token de acceso y manejar el refresco
  // Este es el CORAZÓN de la lógica de autenticación y DEBE estar aquí.
  useEffect(() => {
  const requestInterceptor = authAxios.interceptors.request.use(
    (config) => {
      const isAuthEndpoint =
        config.url.includes('/token/') || config.url.includes('/register/');

      // Añadir Authorization si aplica
      if (accessToken && !config.headers.Authorization && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // ⬇️ AUMENTAR TIMEOUT para subidas multipart (evitar ECONNABORTED a los 10s)
      const contentType = String(
        config.headers?.['Content-Type'] || config.headers?.['content-type'] || ''
      ).toLowerCase();

      const isMultipart =
        (typeof FormData !== 'undefined' && config.data instanceof FormData) ||
        contentType.includes('multipart/form-data');

      if (isMultipart) {
        // Sube el timeout a 120s SOLO para uploads
        config.timeout = Math.max(config.timeout || 0, 120000);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // 👇 Mantén aquí tu responseInterceptor existente, tal cual lo tienes

  return () => {
    authAxios.interceptors.request.eject(requestInterceptor);
    // y también eject del responseInterceptor si lo defines aquí
  };
}, [accessToken, refreshToken, logout, addNotification]);

    const responseInterceptor = authAxios.interceptors.response.use(
      (response) => {
        // --- DEBUG LOGS ---
        console.log(`Interceptor Response: Éxito para ${response.config.url.substring(0, Math.min(response.config.url.length, 50))}... Status: ${response.status}`);
        // --- FIN DEBUG LOGS ---
        return response;
      },
      async (error) => {
        // --- DEBUG LOGS ---
        console.error(`Interceptor Response: Error para ${error.config.url.substring(0, Math.min(error.config.url.length, 50))}... Status: ${error.response?.status}. Error data:`, error.response?.data || error.message || error);
        // --- FIN DEBUG LOGS ---
        const originalRequest = error.config;
        // Solo intenta refrescar si el error es 401, no se ha reintentado, y tenemos un refresh token
        if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
          originalRequest._retry = true;
          // --- DEBUG LOGS ---
          console.log("Interceptor Response: 401 detectado, intentando refrescar token...");
          // --- FIN DEBUG LOGS ---
          try {
            // Importante: Usa axios.post directo o una instancia SIN interceptores de auth
            // para evitar un bucle infinito al refrescar el token.
            const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
            const newAccessToken = refreshResponse.data.access;
            // --- DEBUG LOGS ---
            console.log("Interceptor Response: Token refrescado exitosamente. Nuevo Access Token:", newAccessToken ? newAccessToken.substring(0, 10) + '...' : 'null');
            // --- FIN DEBUG LOGS ---
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            // Reintentar la solicitud original con el nuevo token
            return authAxios(originalRequest);
          } catch (refreshError) {
            // --- DEBUG LOGS ---
            console.error("Interceptor Response: No se pudo refrescar el token:", refreshError.response?.data || refreshError.message || refreshError);
            // --- FIN DEBUG LOGS ---
            const displayMessage = 'Tu sesión ha expirada o no es válida. Por favor, inicia sesión de nuevo.'; // Mensaje actualizado
            // addNotification(displayMessage, 'error');
            setError({ message: displayMessage });
            logout(false, true); // Forzar logout localmente
            return Promise.reject(refreshError);
          }
        }
        // Si el error no es 401 o ya se reintentó, o no hay refresh token, simplemente rechazar
        if (error.response?.status === 401 && !refreshToken) {
            // Si es 401 y no hay refresh token, es un logout definitivo
            // --- DEBUG LOGS ---
            console.warn("Interceptor Response: 401 recibido sin refresh token, forzando logout.");
            // --- FIN DEBUG LOGS ---
            const displayMessage = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
            // addNotification(displayMessage, 'error');
            setError({ message: displayMessage });
            logout(false, true); // Forzar logout localmente
        }
        return Promise.reject(error);
      }
    );

    return () => {
      authAxios.interceptors.request.eject(requestInterceptor);
      authAxios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, logout, addNotification]); // Dependencias para el useEffect de interceptores

  // Efecto para cargar el perfil del usuario al cargar la página si hay un token existente
  useEffect(() => {
    const checkAuthStatus = async () => {
      // --- DEBUG LOGS ---
      console.log("useEffect [accessToken, fetchUserProfile, user, loading]: Verificando estado de autenticación. Token existente:", !!accessToken, "Usuario cargado:", !!user, "Cargando:", loading);
      // --- FIN DEBUG LOGS ---
      if (accessToken) {
        // Solo si no tenemos un usuario ya establecido O estamos en un estado de "loading" inicial
        // y necesitamos confirmar la validez del token.
        if (!user && loading) { // Solo llama si no hay usuario Y estamos en estado de carga inicial.
            // Esto previene llamadas duplicadas si el perfil ya se cargó durante el login.
            console.log("useEffect: accessToken existe y no hay usuario, intentando cargar perfil.");
            await fetchUserProfile(accessToken);
        } else if (user) {
            console.log("useEffect: Usuario ya cargado por `login` o `checkAuthStatus` previo.");
        }
      }
      setLoading(false);
      // --- DEBUG LOGS ---
      console.log("useEffect: checkAuthStatus finalizado. Loading:", false);
      // --- FIN DEBUG LOGS ---
    };
    checkAuthStatus();
  }, [accessToken, fetchUserProfile, user, loading]); // Added user and loading to dependencies

  const contextValue = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
    isSuperuser: user?.is_superuser || false,
    loading,
    error,
    login,
    register,
    logout,
    authAxios, // <--- Asegúrate de exportar esta instancia configurada
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;