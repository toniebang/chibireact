// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import backgroundImage from '../assets/5-5-2.jpg';
import { IoHome } from 'react-icons/io5';

import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPanel = queryParams.get('panel') === 'register' ? 'register' : 'login';

  const [currentPanel, setCurrentPanel] = useState(initialPanel);

  // 👉 Lee el `next` (si viene de /auth?next=...) y redirige tras login
  useEffect(() => {
    if (isAuthenticated) {
      const nextParam = new URLSearchParams(location.search).get('next');
      const target = nextParam ? decodeURIComponent(nextParam) : '/';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, navigate, location.search]);

  // 👉 Helpers para mantener `next` cuando cambias de panel
  const goWithPanel = (panel) => {
    const qs = new URLSearchParams(location.search);
    if (panel === 'register') qs.set('panel', 'register');
    else qs.delete('panel');
    navigate(`/auth${qs.toString() ? `?${qs.toString()}` : ''}`, { replace: true });
  };

  const switchToRegister = () => {
    setCurrentPanel('register');
    goWithPanel('register'); // preserva ?next=...
  };
  const switchToLogin = () => {
    setCurrentPanel('login');
    goWithPanel('login'); // preserva ?next=...
  };

  if (isAuthenticated) {
    // Pantalla corta mientras hace el replace hacia `next` o '/'
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Redirigiendo…</p>
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
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <Link
        to="/"
        className="absolute top-4 left-4 z-20 flex items-center p-2 rounded-full
                   text-white text-lg font-semibold hover:backdrop-filter hover:backdrop-blur-sm transition-colors duration-200"
        aria-label="Volver a la página principal"
      >
        <IoHome className="mr-2 text-xl" />
        <span className="font-light ">Inicio</span>
      </Link>

      {currentPanel === 'login' ? (
        <LoginForm onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}

      <p className="absolute bottom-4 z-10 w-full text-center text-white text-sm font-light opacity-50 text-shadow-md">
        www.chibifeelgood.com
      </p>
    </div>
  );
};

export default AuthPage;
