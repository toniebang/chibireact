// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotifications } from './NotificationContext';

// URL base de la API (asegúrate de tener VITE_API_BASE_URL en tu entorno)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Instancia compartida de Axios
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // timeout base (no-multipart)
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
  authAxios,
});

// Helper: formatear errores del backend para mostrarlos
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

  // Logout
  const logout = useCallback(
    async (sendToServer = true, keepError = false) => {
      setLoading(true);
      if (!keepError) setError(null);
      try {
        if (sendToServer && refreshToken) {
          await authAxios.post('/logout/', { refresh_token: refreshToken });
          addNotification('Has cerrado sesión correctamente.', 'info');
        }
      } catch (err) {
        const displayMessage =
          'Hubo un problema al cerrar sesión en el servidor, pero tu sesión local ha sido terminada.';
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
    },
    [refreshToken, addNotification]
  );

  // Perfil del usuario
  const fetchUserProfile = useCallback(
    async (token) => {
      try {
        const response = await authAxios.get('/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        return response.data;
      } catch (err) {
        const displayMessage = 'Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.';
        // addNotification(displayMessage, 'error'); // opcional
        setError({ message: displayMessage });
        logout(false, true); // logout local
        return null;
      }
    },
    [logout]
  );

  // Login
  const login = useCallback(
    async (identifier, password) => {
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
        let derivedMessage = 'Error de red o desconocido durante el login.';
        if (axios.isAxiosError(err) && err.response) {
          derivedMessage = formatBackendErrorForDisplay(err.response.data);
          if (
            derivedMessage.includes('No se encontraron credenciales válidas.') ||
            derivedMessage.includes('No active account found with the given credentials') ||
            derivedMessage.includes('no activa encontrada con las credenciales dadas') ||
            derivedMessage.includes('Credenciales inválidas.')
          ) {
            derivedMessage = 'Usuario o contraseña incorrectos. Por favor, verifica tus datos.';
          }
        }
        setError({ message: derivedMessage });
        addNotification(derivedMessage, 'error');
        logout(false, true); // asegurar logout local si falla
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUserProfile, addNotification, logout]
  );

  // Registro
  const register = useCallback(
    async (username, email, password, password_confirm) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authAxios.post('/register/', {
          username,
          email,
          password,
          password_confirm,
        });
        addNotification('¡Registro exitoso! Iniciando sesión automáticamente...', 'success');
        await login(email, password);
        return { success: true, message: response.data?.message || 'Registro exitoso.' };
      } catch (err) {
        let derivedMessage = 'Error de red o desconocido durante el registro.';
        if (axios.isAxiosError(err) && err.response) {
          derivedMessage = formatBackendErrorForDisplay(err.response.data);
        }
        setError({ message: derivedMessage });
        addNotification(derivedMessage, 'error');
        return { success: false, error: derivedMessage };
      } finally {
        setLoading(false);
      }
    },
    [login, addNotification]
  );

  // Interceptores de Axios (Authorization + refresh + timeout para multipart)
  useEffect(() => {
    // REQUEST
    const requestInterceptor = authAxios.interceptors.request.use(
      (config) => {
        const urlStr = String(config?.url || '');
        const isAuthEndpoint = urlStr.includes('/token/') || urlStr.includes('/register/');
        config.headers = config.headers || {};

        // Añadir token si corresponde
        if (accessToken && !config.headers.Authorization && !isAuthEndpoint) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Timeout alto solo para multipart (uploads)
        const headerCT = String(
          config.headers['Content-Type'] || config.headers['content-type'] || ''
        ).toLowerCase();
        const isMultipart =
          (typeof FormData !== 'undefined' && config.data instanceof FormData) ||
          headerCT.includes('multipart/form-data');

        if (isMultipart) {
          config.timeout = Math.max(config.timeout || 0, 120000); // 120s
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE
    const responseInterceptor = authAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config || {};

        // 401 + refresh disponible -> refrescar una vez
        if (error?.response?.status === 401 && !originalRequest._retry && refreshToken) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccessToken = refreshResponse.data.access;

            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return authAxios(originalRequest); // reintento
          } catch (refreshError) {
            const displayMessage =
              'Tu sesión ha expirada o no es válida. Por favor, inicia sesión de nuevo.';
            // addNotification(displayMessage, 'error'); // opcional
            setError({ message: displayMessage });
            logout(false, true);
            return Promise.reject(refreshError);
          }
        }

        // 401 sin refresh -> logout local
        if (error?.response?.status === 401 && !refreshToken) {
          const displayMessage = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
          // addNotification(displayMessage, 'error'); // opcional
          setError({ message: displayMessage });
          logout(false, true);
        }

        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      authAxios.interceptors.request.eject(requestInterceptor);
      authAxios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, logout]);

  // Cargar perfil si ya hay token guardado
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (accessToken) {
        if (!user && loading) {
          await fetchUserProfile(accessToken);
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, [accessToken, fetchUserProfile, user, loading]);

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
    authAxios,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
