import React, { useState} from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logochibi_negro.png';
import TermsModal from './TermsModal';
import GoogleSignInButton from './GoogleOAuthProvider';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register, loading, error: authError } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formLocalError, setFormLocalError] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const formatErrorsForDisplay = (authErrorObj, localErrorObj) => {
    const messages = [];

    if (localErrorObj && localErrorObj.message) {
      messages.push(localErrorObj.message);
    } 
    
    if (authErrorObj && authErrorObj.message && messages.length === 0) {
      messages.push(authErrorObj.message);
    } else if (authErrorObj && !authErrorObj.message && messages.length === 0) {
      messages.push('Ha ocurrido un error inesperado del servidor. (AuthContext - formato desconocido)');
    }
    
    if (messages.length === 0 && authErrorObj === null && localErrorObj === null) {
      return [];
    }

    return messages;
  };

  const displayErrors = formatErrorsForDisplay(authError, formLocalError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setFormLocalError(null); 

    if (password !== confirmPassword) {
      setFormLocalError({ message: 'Las contraseñas no coinciden.' });
      return;
    }

    await register(username, email, password, confirmPassword);
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-md transform transition-transform duration-300 hover:scale-105 z-10">
      <div className="flex justify-center ">
          <img
              src={logo}
              alt="Chibi Logo"
              className="w-32 h-auto"
          />
      </div>

      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Registrarse</h2>

      {displayErrors.length > 0 && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">¡Error!</strong>
          <ul className="list-disc list-inside ml-2">
            {displayErrors.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            type="text"
            id="reg-username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm
                       placeholder-gray-400 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-chibi-green focus:border-transparent
                       sm:text-base transition-all duration-200"
            placeholder="Elige un nombre de usuario"
          />
        </div>

        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="reg-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm
                       placeholder-gray-400 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-chibi-green focus:border-transparent
                       sm:text-base transition-all duration-200"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="reg-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm
                         placeholder-gray-400 text-gray-900 pr-12
                         focus:outline-none focus:ring-2 focus:ring-chibi-green focus:border-transparent
                         sm:text-base transition-all duration-200"
              placeholder="Crea una contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              // Añadida clase cursor-pointer aquí
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            >
              {showPassword ? <FiEye className="h-5 w-5" /> : <FiEyeOff className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="reg-confirm-password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm
                         placeholder-gray-400 text-gray-900 pr-12
                         focus:outline-none focus:ring-2 focus:ring-chibi-green focus:border-transparent
                         sm:text-base transition-all duration-200"
              placeholder="Repite la contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              // Añadida clase cursor-pointer aquí
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <FiEye className="h-5 w-5" /> : <FiEyeOff className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          // Añadida clase cursor-pointer aquí
          className="w-full flex justify-center py-2.5 px-4 border border-transparent shadow-sm
                     text-lg font-semibold text-white bg-chibi-green
                     hover:bg-chibi-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chibi-green
                     transition-colors duration-300 transform hover:-translate-y-0.5
                     disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      
      {/* --- Separador o mensaje antes del botón de Google --- */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O inicia sesión con</span>
          </div>
        </div>

        {/* --- ¡INTEGRACIÓN DEL BOTÓN DE GOOGLE AQUÍ! --- */}
        <GoogleSignInButton />
        

      <p className="mt-8 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta en chibi?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          // Añadida clase cursor-pointer aquí
          className="font-medium text-chibi-green hover:text-chibi-dark-green underline-offset-2 hover:underline focus:outline-none cursor-pointer"
        >
          Inicia sesión
        </button>
      </p>

      <p className="mt-4 text-center text-sm text-gray-500">
        Al registrarte, aceptas nuestros{' '}
        <button
          type="button"
          onClick={() => setShowTermsModal(true)}
          // Añadida clase cursor-pointer aquí
          className="font-medium text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline focus:outline-none cursor-pointer"
        >
          Términos y Condiciones
        </button>
      </p>

      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
    </div>
  );
};

export default RegisterForm;