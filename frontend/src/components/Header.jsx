import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logochibi_blanco.png';
import { LuUserRoundPlus } from "react-icons/lu";
import { GrCart } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoHeart } from "react-icons/io5";
// Ya no necesitamos ImUser si siempre mostramos una <img>
// import { ImUser } from "react-icons/im";
import { MdLogout } from "react-icons/md";

import { useAuth } from '../context/AuthContext';

// URL del avatar por defecto
const DEFAULT_AVATAR_URL = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";


const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const [favoriteCount, setFavoriteCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            setFavoriteCount(5);
            setCartCount(3);
        } else {
            setFavoriteCount(0);
            setCartCount(0);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        setIsSidebarOpen(false);
    };

    // Función auxiliar para determinar la URL de la imagen de perfil
    const getProfileImageUrl = () => {
        // Asume que user.profile_picture será la URL de Google si se integra
        return user?.profile_picture || DEFAULT_AVATAR_URL;
    };

    return (
        <div className='bg-black fixed top-0 left-0 right-0 z-40 shadow-xl'>
            <div className='max-w-7xl mx-auto'>
                <header className="flex justify-between items-center px-4 md:px-6 text-white p-2">
                    <Link to="/" className="flex-shrink-0">
                        <img src={logo} alt="logo" width={120} className="md:w-[150px] h-auto" />
                    </Link>

                    {/* Navegación para desktop (oculta en móvil) */}
                    <nav className="hidden md:flex items-center text-xs font-medium space-x-4 lg:space-x-6">
                        <Link to="/" className="px-2 py-1 hover:text-chibi-green hover:underline underline-offset-4 transition-colors duration-200">Inicio</Link>
                        <Link to="/packs" className="px-2 py-1 hover:text-chibi-green hover:underline underline-offset-4 transition-colors duration-200">Packs</Link>
                        <Link to="/tienda" className="px-2 py-1 hover:text-chibi-green hover:underline underline-offset-4 transition-colors duration-200">Tienda</Link>
                        <Link to="/sobre-chibi" className="px-2 py-1 hover:text-chibi-green hover:underline underline-offset-4 transition-colors duration-200">Sobre Chibi</Link>

                        <Link to="/carrito" className="relative p-2 hover:text-chibi-green text-lg transition-colors duration-200" title="Ver Carrito">
                            <GrCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" style={{fontSize: '0.65rem'}}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/favoritos" className="relative p-2 hover:text-chibi-green text-lg transition-colors duration-200" title="Ver Favoritos">
                            <IoHeart />
                            {favoriteCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" style={{fontSize: '0.65rem'}}>
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>


                        {isAuthenticated ? (
                            // Si está autenticado, siempre muestra la imagen de perfil (real o por defecto)
                            <Link to="/perfil" className="p-1 hover:text-chibi-green flex items-center transition-colors duration-200" title="Mi Perfil">
                                <img
                                    src={getProfileImageUrl()} // Usa la función para la URL
                                    alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                                    className="rounded-full w-6 h-6 object-cover border border-chibi-green-light"
                                />
                                {user?.username && <span className="text-xs ml-2">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</span>}
                            </Link>
                        ) : (
                            // Si no está autenticado, muestra el enlace de login/registro
                            <Link to="/login" className="p-2 hover:text-chibi-green text-lg transition-colors duration-200" title="Iniciar sesión o registrarse">
                                <LuUserRoundPlus />
                            </Link>
                        )}

                        {/* Botón de Logout para desktop, solo si está autenticado */}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="p-2 flex items-center text-white hover:text-chibi-green transition-colors duration-200 bg-transparent border-none cursor-pointer"
                                title="Cerrar sesión"
                            >
                                <MdLogout className="text-lg" />
                            </button>
                        )}
                    </nav>

                    {/* Contenedor para iconos de móvil (visible solo en móvil) */}
                    <div className="flex items-center gap-4 md:hidden">
                        <Link to="/carrito" className="relative p-1 text-2xl hover:text-chibi-green transition-colors duration-200" title="Ver Carrito">
                            <GrCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" style={{fontSize: '0.65rem'}}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/favoritos" className="relative p-1 text-2xl hover:text-chibi-green transition-colors duration-200" title="Ver Favoritos">
                            <IoHeart />
                            {favoriteCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" style={{fontSize: '0.65rem'}}>
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            // En móvil, si está autenticado, también muestra la imagen de perfil (real o por defecto)
                            <Link to="/perfil" className="p-1 hover:text-chibi-green transition-colors duration-200" title="Mi Perfil">
                                <img
                                    src={getProfileImageUrl()}
                                    alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                                    className="rounded-full w-6 h-6 object-cover border border-chibi-green-light"
                                />
                            </Link>
                        ) : (
                             // En móvil, si no está autenticado, muestra el icono de login/registro
                            <Link to="/login" className="p-1 hover:text-chibi-green text-2xl transition-colors duration-200" title="Iniciar sesión o registrarse">
                                <LuUserRoundPlus />
                            </Link>
                        )}


                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-white text-2xl cursor-pointer p-2"
                            aria-label="Abrir menú"
                        >
                            <GiHamburgerMenu />
                        </button>
                    </div>
                </header>
            </div>

            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {isSidebarOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                <div className="absolute right-0 bg-black w-60 xs:w-64 sm:w-72 h-full shadow-lg p-5 z-50 overflow-y-auto text-white">
                    <button
                        className="absolute top-3 right-3 text-2xl hover:text-chibi-green bg-transparent rounded-full p-1 cursor-pointer"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Cerrar menú"
                    >
                        <IoClose />
                    </button>

                    <nav className="mt-10 space-y-5 text-base font-bold">
                        {isAuthenticated && ( // Muestra la imagen de perfil en el sidebar solo si está autenticado
                            <Link to="/perfil" className="flex items-center gap-2 p-2 hover:text-chibi-green transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>
                                <img
                                    src={getProfileImageUrl()}
                                    alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                                    className="rounded-full w-8 h-8 object-cover border border-chibi-green-light" // Un poco más grande en el sidebar
                                />
                                {user?.username ? `Mi Perfil (${user.username.charAt(0).toUpperCase() + user.username.slice(1)})` : "Mi Perfil"}
                            </Link>
                        )}
                        {/* El enlace de login/registro ahora solo aparece si NO está autenticado */}
                        {!isAuthenticated && (
                            <Link to="/login" className="flex items-center gap-2 p-2 hover:text-chibi-green transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>
                                <LuUserRoundPlus className="text-xl" /> Iniciar Sesión / Registrarse
                            </Link>
                        )}


                        <Link to="/" className="block p-2 hover:text-chibi-green transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
                        <Link to="/packs" className="block p-2 hover:text-chibi-green transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Packs</Link>
                        <Link to="/tienda" className="block p-2 hover:text-chibi-green transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Tienda</Link>
                        <Link to="/sobre-chibi" className="block p-2 hover:text-chibi-green transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Sobre Chibi</Link>

                        <Link to="/carrito" className="flex items-center gap-2 p-2 hover:text-chibi-green text-lg transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>
                            <GrCart className="text-xl" /> Carrito
                            {cartCount > 0 && (
                                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 leading-none">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/favoritos" className="flex items-center gap-2 p-2 hover:text-chibi-green text-lg transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>
                            <IoHeart className="text-xl" /> Favoritos
                            {favoriteCount > 0 && (
                                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 leading-none">
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>

                        {/* Botón de Logout para sidebar, solo si está autenticado */}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 p-2 hover:text-chibi-green text-base font-bold bg-transparent border-none cursor-pointer transition-colors duration-200"
                            >
                                <MdLogout className="text-xl" /> Cerrar Sesión
                            </button>
                        )}
                    </nav>

                    <div className="mt-12 text-xs text-gray-300">
                        <h2 className="font-bold text-white mb-1">Contacto</h2>
                        <p className="mb-0.5">
                            <span className="mr-1">📞</span> +240 555 7667 14
                        </p>
                        <p>
                            <span className="mr-1">⏰</span> Lunes a Sábado - 8:00 - 17:00
                        </p>
                    </div>

                    <div className="mt-8">
                        <p className="font-bold mb-1 text-white">Síguenos</p>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-400 flex items-center gap-2 p-2 transition-colors duration-200"
                        >
                            <span className="mr-1">📸</span> Instagram
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;