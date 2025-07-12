// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartSection from '../components/CartSection'; // <--- Importa el nuevo componente
// Asegúrate de que la ruta a CartSection sea correcta

// URL del avatar por defecto
const DEFAULT_AVATAR_URL = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?b=1&s=170x170&k=20&c=etX0kpw1WQzw4bDY0xZ-rYg1PfzDaSJ3vrykAuh5tNs=";


const ProfilePage = () => {
    // Estado para gestionar la pestaña activa (por defecto: 'pedidos')
    const [activeTab, setActiveTab] = useState('pedidos');

    // Obtenemos la información de autenticación del contexto
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate(); // Hook para la navegación programática

    // Redirige si el usuario no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirige a la página de login si no está autenticado
        }
    }, [isAuthenticated, navigate]);

    // Función auxiliar para obtener la URL de la imagen de perfil
    const getProfileImageUrl = () => {
        return user?.profile_picture || DEFAULT_AVATAR_URL;
    };

    // Componentes placeholders para cada sección
    const PedidosSection = () => (
        <div className="p-4 bg-gray-700 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold mb-3 text-white">Mis Pedidos</h3>
            <p className="text-gray-300">Aquí se mostrará un listado de tus pedidos realizados.</p>
            {/* Aquí iría la lógica y el renderizado de los pedidos reales */}
        </div>
    );

    // Reemplazamos el placeholder de CarritoSection con el componente real
    // const CarritoSection = () => (
    //     <div className="p-4 bg-gray-700 rounded-lg shadow-inner">
    //         <h3 className="text-xl font-semibold mb-3 text-white">Mi Carrito</h3>
    //         <p className="text-gray-300">Aquí podrás ver los ítems que tienes actualmente en tu carrito de compras.</p>
    //     </div>
    // );

    const FavoritosSection = () => (
        <div className="p-4 bg-gray-700 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold mb-3 text-white">Mis Favoritos</h3>
            <p className="text-gray-300">Aquí encontrarás los productos que has marcado como favoritos para un acceso rápido.</p>
            {/* Aquí iría la lógica y el renderizado de los productos favoritos */}
        </div>
    );

    // Si el usuario no está autenticado, no renderizamos la página de perfil directamente,
    // sino que el useEffect ya se encargó de redirigir.
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Header></Header>
            <div className="min-h-screen bg-gray-900 text-white pt-20 pb-10 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-black p-6 rounded-lg shadow-xl">
                    {/* Sección de Información del Usuario */}
                    <div className="flex flex-col md:flex-row items-center md:items-start mb-8 pb-6 border-b border-gray-700">
                        <img
                            src={getProfileImageUrl()}
                            alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                            className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-chibi-green-light mb-4 md:mb-0 md:mr-6"
                        />
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-chibi-green-light mb-1">{user?.username || 'Usuario'}</h2>
                            <p className="text-lg text-gray-300">{user?.email || 'email@ejemplo.com'}</p>
                            <p className="text-gray-400 mt-2">Bienvenido a tu perfil de Chibi Market.</p>
                        </div>
                    </div>

                    {/* Navegación de Pestañas */}
                    <div className="flex border-b border-gray-700 mb-6">
                        <button
                            className={`py-3 px-6 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                                activeTab === 'pedidos' ? 'border-b-2 border-chibi-green text-chibi-green-light' : 'text-gray-400 hover:text-chibi-green'
                            }`}
                            onClick={() => setActiveTab('pedidos')}
                        >
                            Pedidos
                        </button>
                        <button
                            className={`py-3 px-6 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                                activeTab === 'carrito' ? 'border-b-2 border-chibi-green text-chibi-green-light' : 'text-gray-400 hover:text-chibi-green'
                            }`}
                            onClick={() => setActiveTab('carrito')}
                        >
                            Carrito
                        </button>
                        <button
                            className={`py-3 px-6 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                                activeTab === 'favoritos' ? 'border-b-2 border-chibi-green text-chibi-green-light' : 'text-gray-400 hover:text-chibi-green'
                            }`}
                            onClick={() => setActiveTab('favoritos')}
                        >
                            Favoritos
                        </button>
                    </div>

                    {/* Contenido de la Pestaña Activa */}
                    <div>
                        {activeTab === 'pedidos' && <PedidosSection />}
                        {activeTab === 'carrito' && <CartSection />} {/* <--- Usa el componente real aquí */}
                        {activeTab === 'favoritos' && <FavoritosSection />}
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default ProfilePage;