// Ejemplo: src/components/LoginComponent.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importa el hook

const LoginComponent = () => {
  const { login, loading, error, isAuthenticated } = useAuth(); // Obtén el estado y la función login
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(identifier, password);
    if (success) {
      // Redirigir al usuario o mostrar un mensaje de éxito
      console.log('¡Login exitoso!');
      // Aquí podrías usar useNavigate de react-router-dom para redirigir
    } else {
      console.log('Fallo el login.');
      // El error ya estará en el estado 'error' del contexto, puedes mostrarlo
    }
  };

  if (isAuthenticated) {
    return <p>Ya estás logueado.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{typeof error === 'string' ? error : error.message || 'Error desconocido'}</p>}
      <div>
        <label htmlFor="identifier">Usuario o Email:</label>
        <input
          type="text"
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginComponent;