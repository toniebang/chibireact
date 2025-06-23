import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotifications } from './NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  authAxios: axios.create({ baseURL: API_BASE_URL }),
});

const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

// Helper function para formatear errores del backend de manera consistente
// Esta función ahora se usa tanto para el toast como para el estado 'error'
const formatBackendErrorForDisplay = (backendError) => {
  if (!backendError) return 'Error desconocido del servidor.';
  if (typeof backendError === 'string') return backendError; // Si el error es un string directo
  if (backendError.detail) return backendError.detail; // Común para errores generales de DRF
  if (backendError.message) return backendError.message; // Si hay una propiedad 'message'

  // Si es un objeto con errores por campo (ej. { username: ["ya existe"], non_field_errors: ["credenciales inválidas"] })
  if (typeof backendError === 'object') {
    return Object.entries(backendError)
      .map(([key, value]) => {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        return Array.isArray(value) ? `${fieldName}: ${value.join(', ')}` : `${fieldName}: ${value}`;
      })
      .flat()
      .join(' '); // Une todos los mensajes de campo en una sola cadena
  }
  return 'Error de formato inesperado del servidor.'; // Último recurso
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addNotification } = useNotifications();

  // Función de Logout (ahora con un parámetro para mantener el error)
  const logout = useCallback(async (sendToServer = true, keepError = false) => {
    setLoading(true);
    if (!keepError) {
      setError(null);
    }
    try {
      if (sendToServer && refreshToken) {
        console.log('Intentando logout en el servidor. Refresh token:', refreshToken);
        await authAxios.post('/logout/', { refresh_token: refreshToken }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        addNotification('Has cerrado sesión correctamente.', 'info');
      }
    } catch (err) {
      console.error("Error al hacer logout en el servidor:", err);
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
    }
  }, [accessToken, refreshToken, addNotification]);

  const fetchUserProfile = useCallback(async (token) => {
    try {
      const response = await authAxios.get('/me/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error("Error al obtener perfil de usuario:", err);
      const displayMessage = 'Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.';
      addNotification(displayMessage, 'error');
      setError({ message: displayMessage });
      logout(false, true);
      return null;
    }
  }, [addNotification, logout]);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.post('/token/', { identifier, password });
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      await fetchUserProfile(newAccessToken);
      addNotification('¡Inicio de sesión exitoso! Bienvenido.', 'success');
      return true;
    } catch (err) {
      console.error("Error en el login:", err);
      let derivedToastAndFormMessage = 'Error de red o desconocido durante el login.';

      if (axios.isAxiosError(err) && err.response) {
        // Primero, formateamos el error del backend con la lógica unificada
        derivedToastAndFormMessage = formatBackendErrorForDisplay(err.response.data);

        // Luego, aplicamos la lógica de personalización/sobrescritura para mensajes específicos
        if (
            derivedToastAndFormMessage.includes('No se encontraron credenciales válidas.') ||
            derivedToastAndFormMessage.includes('No active account found with the given credentials') ||
            derivedToastAndFormMessage.includes('no activa encontrada con las credenciales dadas') ||
            derivedToastAndFormMessage.includes('Credenciales inválidas.')
        ) {
            derivedToastAndFormMessage = 'Usuario o contraseña incorrectos. Por favor, verifica tus datos.';
        }
      }

      // Almacena el MENSAJE FINAL en el estado 'error' y envíalo al toast
      setError({ message: derivedToastAndFormMessage });
      addNotification(derivedToastAndFormMessage, 'error');
      logout(false, true);
      return false;
    }
  }, [fetchUserProfile, addNotification, logout]);

  const register = useCallback(async (username, email, password, password_confirm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.post('/register/', { username, email, password, password_confirm });
      addNotification('¡Registro exitoso! Iniciando sesión automáticamente...', 'success');
      await login(email, password);
      return { success: true, message: response.data?.message || 'Registro exitoso.' };
    } catch (err) {
      console.error("Error en el registro:", err);
      let derivedToastAndFormMessage = 'Error de red o desconocido durante el registro.';

      if (axios.isAxiosError(err) && err.response) {
        // Usa la misma función de formateo para los errores de registro
        derivedToastAndFormMessage = formatBackendErrorForDisplay(err.response.data);
      }

      setError({ message: derivedToastAndFormMessage });
      addNotification(derivedToastAndFormMessage, 'error');
      return { success: false, error: derivedToastAndFormMessage };
    } finally {
      setLoading(false);
    }
  }, [login, addNotification]);

  // Interceptor de Axios para añadir el token de acceso y manejar el refresco
  useEffect(() => {
    const requestInterceptor = authAxios.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = authAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
            const newAccessToken = refreshResponse.data.access;
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return authAxios(originalRequest);
          } catch (refreshError) {
            console.error("No se pudo refrescar el token:", refreshError);
            const displayMessage = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
            addNotification(displayMessage, 'error');
            setError({ message: displayMessage });
            logout(false, true);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      authAxios.interceptors.request.eject(requestInterceptor);
      authAxios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, logout, addNotification]);

  // Efecto para cargar el perfil del usuario al cargar la página si hay un token existente
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (accessToken) {
        await fetchUserProfile(accessToken);
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, [accessToken, fetchUserProfile]);

  const contextValue = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
    loading,
    error,
    login,
    register,
    logout,
    authAxios,
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