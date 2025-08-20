import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout(true); // true para cerrar sesión en el backend
  };

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 md:px-6 mt-24 mb-16">
        <div className="bg-white p-8 shadow-xl w-full transform transition-transform duration-300 hover:scale-[1.01]">
          {/* Título */}
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Mi perfil
          </h2>

          {/* Info usuario */}
          <div className="mb-8 text-center">
           <div className="relative w-28 h-28 mx-auto rounded-full border-4 border-chibi-green overflow-hidden mb-4 shadow-md transition-transform duration-300 hover:scale-105">
  <img
    src={user?.profile_picture || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"}
    alt={user?.username || "Usuario"}
    className="w-full h-full object-cover"
  />
</div>

            <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          {/* Botones */}
          <div className="space-y-4">
            {/* Botón activo: Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent shadow-sm
                         text-lg font-semibold text-white bg-chibi-green
                         hover:bg-chibi-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chibi-green
                         transition-colors duration-300 transform hover:-translate-y-0.5
                         cursor-pointer rounded"
            >
              Cerrar sesión
            </button>

            {/* Botones deshabilitados */}
            <button
              disabled
              className="w-full flex justify-center py-2.5 px-4 border border-gray-300 shadow-sm
                         text-lg font-semibold text-gray-500 bg-gray-100 rounded
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cambiar contraseña
            </button>

            <button
              disabled
              className="w-full flex justify-center py-2.5 px-4 border border-gray-300 shadow-sm
                         text-lg font-semibold text-gray-500 bg-gray-100 rounded
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Preferencias
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
