// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Añadido useLocation
import { useAuth } from '../context/AuthContext'; // Solo necesitamos isAuthenticated para redireccionar
import backgroundImage from '../assets/5-5-2.jpg';
import { IoHome } from 'react-icons/io5';

// Importa los nuevos componentes de formulario
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';


const AuthPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Para leer los parámetros de la URL

  // Determina el panel inicial basado en la URL (ej. /auth?panel=register)
  const queryParams = new URLSearchParams(location.search);
  const initialPanel = queryParams.get('panel') === 'register' ? 'register' : 'login';

  const [currentPanel, setCurrentPanel] = useState(initialPanel);

  // Redirección si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Funciones para cambiar de panel
  const switchToRegister = () => {
    setCurrentPanel('register');
    navigate('/auth?panel=register', { replace: true }); // Actualiza la URL
  };
  const switchToLogin = () => {
    setCurrentPanel('login');
    navigate('/auth', { replace: true }); // Actualiza la URL
  };


  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Ya estás logueado. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div
      className="relative font-monsterrat flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay semi-transparente sobre la imagen de fondo */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* LINK A HOMEPAGE CON ICONO */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 flex items-center p-2 rounded-full
                   text-white text-lg font-semibold
                   hover:backdrop-filter hover:backdrop-blur-sm
                   transition-colors duration-200"
        aria-label="Volver a la página principal"
      >
        <IoHome className="mr-2 text-xl" />
        <span className="font-light ">Inicio</span>
      </Link>

      {/* Renderizado condicional del formulario */}
      {currentPanel === 'login' ? (
        <LoginForm onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}

      {/* Párrafo "www.Chibifeelgood.com" */}
      <p className="absolute bottom-4 z-10 w-full text-center text-white text-sm font-light opacity-50 text-shadow-md">
        www.chibifeelgood.com
      </p>
    </div>
  );
};

export default AuthPage;