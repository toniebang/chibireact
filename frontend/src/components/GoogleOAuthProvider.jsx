// src/components/GoogleSignInButton.jsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleSignInButton = () => {
  // Manejador para el éxito del inicio de sesión con Google
  const onSuccess = async (credentialResponse) => {
    console.log('Inicio de sesión exitoso con Google:', credentialResponse);
    const idToken = credentialResponse.credential; // Este es el ID Token que envía Google

    // ¡USANDO VITE_API_BASE_URL como base para todas tus llamadas a la API!
    // Asegúrate de que esta URL esté definida correctamente en tus archivos .env
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const googleAuthEndpoint = `${apiBaseUrl}/auth/google/`;

    if (!apiBaseUrl) {
      console.error("VITE_API_BASE_URL no está definido en tus variables de entorno.");
      // alert("Error de configuración: La URL base de la API no está definida.");
      return;
    }

    try {
      // Envía el ID Token al backend de Django
      const response = await axios.post(googleAuthEndpoint, {
        id_token: idToken,
      });

      console.log('Respuesta del backend:', response.data);

      // Si el backend responde con éxito, contendrá tus tokens JWT y la información del usuario
      const { access, refresh, user } = response.data;

      // 1. Guardar los tokens JWT en el almacenamiento local
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // 2. Opcional: Guardar la información del usuario
      localStorage.setItem('user', JSON.stringify(user));

      // 3. Informar al usuario y/o redirigir
      // alert(`¡Bienvenido, ${user.first_name || user.username || user.email}! Has iniciado sesión.`);
      window.location.reload(); // Recargar la página para aplicar el estado de autenticación

    } catch (error) {
      console.error('Error al enviar el ID Token al backend:', error.response ? error.response.data : error.message);
      const errorMessage = error.response && error.response.data && error.response.data.detail
                           ? error.response.data.detail
                           : 'Error en la autenticación con el backend.';
      // alert(`Error: ${errorMessage}. Inténtalo de nuevo.`);
    }
  };

  // Manejador para el fallo del inicio de sesión
  const onError = () => {
    console.log('Fallo en el inicio de sesión con Google');
    // alert('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
  };

  // Asegúrate de que VITE_GOOGLE_CLIENT_ID esté definido en tu .env y accesible
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error("VITE_GOOGLE_CLIENT_ID no está definido. Revisa tu archivo .env");
    return <p className="text-red-500">Error: Configuración de Google OAuth no encontrada.</p>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="flex justify-center my-4">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignInButton;