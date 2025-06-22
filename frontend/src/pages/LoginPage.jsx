// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa el hook de autenticación


const LoginPage = () => {
  const { login, loading, error, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    await login(identifier, password);
    // Ya no necesitas 'if (success) { ... } else { ... }' aquí para mostrar el mensaje,
    // porque AuthContext ya llama a addNotification().
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Ya estás logueado. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Usuario o Email
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-chibi-green focus:border-chibi-green sm:text-sm"
              placeholder="tu_usuario o tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-chibi-green focus:border-chibi-green sm:text-sm"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-chibi-green hover:bg-chibi-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chibi-green transition-colors duration-200"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro/" className="font-medium text-chibi-green hover:text-chibi-dark-green">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;