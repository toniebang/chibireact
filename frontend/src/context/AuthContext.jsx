// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotifications } from './NotificationContext'; // Importa el hook de notificaciones

// Define la URL base de la API usando la variable de entorno de Vite
// Asegúrate de que tienes VITE_API_BASE_URL definido en tu archivo .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Crear el Contexto
const AuthContext = createContext({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true, // true al inicio para verificar la sesión
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  authAxios: null, // Para exportar la instancia de Axios con interceptores
});

// 2. Crear una instancia de Axios para la API de autenticación
// NOTA: Esta instancia se usará para las llamadas relacionadas con auth (login, register, logout, /me)
// y se exportará para que otros componentes la usen para llamadas autenticadas.
const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

// 3. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [loading, setLoading] = useState(true); // Indica si se está cargando o verificando la sesión
  const [error, setError] = useState(null); // Almacena el último error para referencia interna
  const isAuthenticated = !!user && !!accessToken; // Deriva el estado de autenticación

  // Obtener la función para añadir notificaciones del NotificationContext
  const { addNotification } = useNotifications();

  // Función para obtener los datos del perfil del usuario
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const response = await authAxios.get('/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Guarda los datos del usuario en el estado
      return response.data;
    } catch (err) {
      console.error("Error al obtener perfil de usuario:", err);
      // Si el token es inválido/expirado para /me, limpia la sesión
      addNotification('Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.', 'error');
      // Llama a logout sin enviar petición al servidor, ya que el token ya es inválido
      logout(false);
      return null;
    }
  }, [addNotification]); // Dependencia: addNotification

  // Función de Login
  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError(null); // Limpiar cualquier error previo
    try {
      const response = await authAxios.post('/token/', { identifier, password });
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      // Una vez logueado, obtenemos los datos completos del usuario
      await fetchUserProfile(newAccessToken);
      addNotification('¡Inicio de sesión exitoso! Bienvenido.', 'success');
      return true; // Éxito
    } catch (err) {
      console.error("Error en el login:", err);
      let errorMessage = 'Error desconocido durante el login.';
      if (axios.isAxiosError(err) && err.response) {
        // Captura el mensaje 'detail' o 'message' del backend
        errorMessage = err.response.data?.detail || err.response.data?.message || 'Credenciales inválidas.';

        // Lógica para interpretar el mensaje genérico de Simple JWT
        if (
            errorMessage.includes('No active account found with the given credentials') ||
            errorMessage.includes('no activa encontrada con las credenciales dadas') ||
            errorMessage.includes('Credenciales inválidas') // Por si viene en español exacto
        ) {
            errorMessage = 'Usuario o contraseña incorrectos. Por favor, verifica tus datos.';
        }
        setError(err.response.data || { message: errorMessage }); // Guarda el objeto de error del backend si existe
      } else {
        setError({ message: 'Error de red o desconocido durante el login.' });
      }
      addNotification(errorMessage, 'error'); // Muestra la notificación de error
      // Si el login falla, limpia cualquier token que pudiera haber quedado inconsistente
      logout(false);
      return false; // Fallo
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile, addNotification]); // Dependencias: fetchUserProfile, addNotification

  // Función de Registro
  const register = useCallback(async (username, email, password, password_confirm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.post('/register/', { username, email, password, password_confirm });
      addNotification('¡Registro exitoso! Iniciando sesión automáticamente...', 'success');
      // Intentar login automático después del registro para una mejor UX
      await login(email, password);
      return { success: true, message: response.data?.message || 'Registro exitoso.' };
    } catch (err) {
      console.error("Error en el registro:", err);
      let errorMessage = 'Error de red o desconocido durante el registro.';
      if (axios.isAxiosError(err) && err.response) {
        // Los errores de registro suelen ser un objeto con errores por campo (ej. { email: ["ya existe"] })
        const errors = err.response.data;
        if (errors) {
            // Convierte el objeto de errores en un string legible para la notificación
            errorMessage = Object.values(errors).flat().join(' ');
        } else {
            errorMessage = err.response.data?.message || 'Error en el registro.';
        }
        setError(errors || { message: errorMessage }); // Guarda el objeto completo de errores
      }
      addNotification(errorMessage, 'error'); // Muestra la notificación de error
      return { success: false, error: errorMessage }; // Retorna el error para la página de registro
    } finally {
      setLoading(false);
    }
  }, [login, addNotification]); // Dependencias: login, addNotification

  // Función de Logout
  // sendToServer: booleano para indicar si se debe enviar la petición de logout al servidor
   const logout = useCallback(async (sendToServer = true) => {
    setLoading(true);
    setError(null);
    try {
      if (sendToServer && refreshToken) {
        console.log('Intentando logout en el servidor. Refresh token:', refreshToken); // <--- AÑADE ESTA LÍNEA
        await authAxios.post('/logout/', { refresh_token: refreshToken }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        addNotification('Has cerrado sesión correctamente.', 'info');
      } else if (!sendToServer) {
        addNotification('Tu sesión ha sido terminada localmente.', 'info');
      }
    } catch (err) {
      console.error("Error al hacer logout en el servidor:", err);
      addNotification('Hubo un problema al cerrar sesión en el servidor, pero tu sesión local ha sido terminada.', 'error');
    } finally {
      // ... (el resto del código de logout) ...
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setLoading(false);
    }
  }, [accessToken, refreshToken, addNotification]);
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
        // Si es un error 401 (Unauthorized) y no es la petición de refresh token
        // y tenemos un refresh token disponible, y la petición no ha sido reintentada
        if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
          originalRequest._retry = true; // Marcar la petición original como reintentada
          try {
            const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccessToken = refreshResponse.data.access;
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            // Reintentar la petición original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return authAxios(originalRequest); // Usar authAxios para reintentar (con el nuevo token en el header)
          } catch (refreshError) {
            console.error("No se pudo refrescar el token:", refreshError);
            addNotification('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'error');
            logout(); // Si el refresh token falla, cerrar sesión completamente
            return Promise.reject(refreshError);
          }
        }
        // Si el error no es 401, o si la petición ya fue reintentada, o no hay refresh token,
        // o es un error 401 en la propia petición de refresh, simplemente rechazar el error.
        // Aquí no llamamos a addNotification porque otros componentes pueden querer manejar el 401.
        // Solo llamamos a addNotification en los casos específicos de token expirado/sesión inválida.
        return Promise.reject(error);
      }
    );

    // Limpiar interceptores cuando el componente se desmonte o sus dependencias cambien
    return () => {
      authAxios.interceptors.request.eject(requestInterceptor);
      authAxios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, logout, addNotification]); // Dependencias: accessToken, refreshToken, logout, addNotification


  // Efecto para cargar el perfil del usuario al cargar la página si hay un token existente
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (accessToken) {
        // Intentar obtener el perfil para validar el token
        const profile = await fetchUserProfile(accessToken);
        if (!profile) {
          // Si el perfil no se pudo cargar (token inválido/expirado),
          // logout ya se habrá llamado dentro de fetchUserProfile, y la notificación también.
          console.log("Token existente inválido o expirado, sesión cerrada.");
        }
      }
      setLoading(false); // Ya se verificó la sesión inicial
    };

    checkAuthStatus();
  }, [accessToken, fetchUserProfile]); // Ejecutar cuando accessToken cambie o fetchUserProfile sea definida


  // Valor que será proporcionado por el contexto
  const contextValue = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    loading,
    error, // El error se sigue exportando por si algún componente quiere mostrarlo localmente
    login,
    register,
    logout,
    authAxios, // Exportar la instancia de axios con interceptores para otras peticiones autenticadas
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Crear un Custom Hook para un uso más fácil del Contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Exportar el contexto mismo por si se necesita en algún caso específico
export default AuthContext;