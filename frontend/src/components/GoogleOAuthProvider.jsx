// src/components/GoogleSignInButton.jsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleSignInButton = () => {
  // Manejador para el éxito del inicio de sesión
  const onSuccess = (credentialResponse) => {
    console.log('Inicio de sesión exitoso:', credentialResponse);
    // credentialResponse.credential contiene el ID Token (JWT)
    // Aquí es donde normalmente enviarías este ID Token a tu backend para verificación
    // y para crear/iniciar sesión del usuario en tu propio sistema.

    // Ejemplo: Decodificar el token (Solo para desarrollo, NO en producción en el frontend)
    // En producción, el ID Token debe ser VERIFICADO en tu BACKEND
    try {
      const decodedToken = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      console.log('Datos del usuario decodificados (solo para depuración en frontend):', decodedToken);
      alert(`¡Bienvenido, ${decodedToken.name || decodedToken.email}!`);
      // Aquí puedes guardar el estado del usuario, redirigir, etc.
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  };

  // Manejador para el fallo del inicio de sesión
  const onError = () => {
    console.log('Fallo en el inicio de sesión');
    alert('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
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
          useOneTap // Opcional: para el inicio de sesión con un toque si el usuario ya está logueado en Google
          // Puedes personalizar el botón con clases de Tailwind si lo necesitas,
          // aunque el componente de Google ya tiene un estilo predefinido.
          // Ej: theme="filled_blue" size="large" text="signin_with"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignInButton;