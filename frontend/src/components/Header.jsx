import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de tener ambos logos en tu carpeta assets
import logoMobile from '../assets/logochibi_negro.png';  // Para tema blanco (móvil)
import logoDesktop from '../assets/logochibi_blanco.png'; // Para tema negro (desktop/tablet)

import { LuUserRoundPlus } from "react-icons/lu";
import { GrCart } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoHeart } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

// URL del avatar por defecto
const DEFAULT_AVATAR_URL = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";


const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const [isHeaderSolid, setIsHeaderSolid] = useState(false); 

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

    useEffect(() => {
        const handleScroll = () => {
            // Un umbral de 60px es común, ajústalo si lo necesitas
            if (window.scrollY > 60) { 
                setIsHeaderSolid(true);
            } else {
                setIsHeaderSolid(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsSidebarOpen(false);
    };

    const getProfileImageUrl = () => {
        return user?.profile_picture || DEFAULT_AVATAR_URL;
    };

    return (
        // Ajuste en las clases: Usamos un ternario para aplicar el fondo condicionalmente
        <div 
            className={`
                fixed top-0 left-0 right-0 z-40 shadow-sm 
                bg-white 
                transition-all duration-300 ease-in-out 
                ${isHeaderSolid ? 'md:bg-black' : 'md:bg-transparent md:bg-opacity-0'}
            `}
        >
            <div className='max-w-7xl mx-auto'>
                <header className="flex justify-between items-center px-4 md:px-6 text-black md:text-white py-0.5 md:py-1">
                    <Link to="/" className="flex-shrink-0">
                        <img src={logoMobile} alt="Chibi Logo (Mobile)" width={70} className="md:hidden h-auto ml-2" />
                        <img src={logoDesktop} alt="Chibi Logo (Desktop)" width={140} className="hidden md:block h-auto md:w-[160px]" />
                    </Link>

                    <nav className="hidden md:flex items-center text-sm font-medium space-x-4 lg:space-x-6">
                        <Link to="/" className="px-2 py-1 hover:text-gray-400 hover:underline underline-offset-4 transition-colors duration-200">Inicio</Link>
                        <Link to="/packs" className="px-2 py-1 hover:text-gray-400 hover:underline underline-offset-4 transition-colors duration-200">Packs</Link>
                        <Link to="/tienda" className="px-2 py-1 hover:text-gray-400 hover:underline underline-offset-4 transition-colors duration-200">Tienda</Link>
                        <Link to="/sobre-chibi" className="px-2 py-1 hover:text-gray-400 hover:underline underline-offset-4 transition-colors duration-200">Sobre Chibi</Link>

                        <Link to="/carrito" className="relative p-2 hover:text-gray-400 text-xl transition-colors duration-200" title="Ver Carrito">
                            <GrCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" style={{fontSize: '0.65rem'}}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/favoritos" className="relative p-2 hover:text-gray-400 text-xl transition-colors duration-200" title="Ver Favoritos">
                            <IoHeart />
                            {favoriteCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" style={{fontSize: '0.65rem'}}>
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <Link to="/perfil" className="p-2 hover:text-gray-400 flex items-center transition-colors duration-200" title="Mi Perfil">
                                <img
                                    src={getProfileImageUrl()}
                                    alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                                    className="rounded-full w-7 h-7 object-cover border border-gray-400"
                                />
                                {user?.username && (
                                    <span className="text-sm ml-1.5">
                                        {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <Link to="/login" className="p-2 hover:text-gray-400 text-xl transition-colors duration-200" title="Iniciar sesión o registrarse">
                                <LuUserRoundPlus />
                            </Link>
                        )}

                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="p-2 flex items-center text-white hover:text-gray-400 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                                title="Cerrar sesión"
                            >
                                <MdLogout className="text-xl" />
                            </button>
                        )}
                    </nav>

                    <div className="flex items-center gap-3 md:hidden">
                        <Link to="/carrito" className="relative p-1.5 text-xl hover:text-gray-700 transition-colors duration-200" title="Ver Carrito">
                            <GrCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" style={{fontSize: '0.65rem'}}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/favoritos" className="relative p-1.5 text-xl hover:text-gray-700 transition-colors duration-200" title="Ver Favoritos">
                            <IoHeart />
                            {favoriteCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none" style={{fontSize: '0.65rem'}}>
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <Link to="/perfil" className="p-1.5 hover:text-gray-700 flex items-center transition-colors duration-200" title="Mi Perfil">
                                <img
                                    src={getProfileImageUrl()}
                                    alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                                    className="rounded-full w-6 h-6 object-cover border border-gray-400"
                                />
                            </Link>
                        ) : (
                            <Link to="/login" className="p-1.5 hover:text-gray-700 text-xl transition-colors duration-200" title="Iniciar sesión o registrarse">
                                <LuUserRoundPlus />
                            </Link>
                        )}

                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-black text-2xl cursor-pointer p-1.5"
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
                        className="absolute inset-0 bg-white/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                <div className="absolute right-0 bg-white w-60 xs:w-64 sm:w-72 h-full shadow-lg p-3 z-50 overflow-y-auto text-black">
                    <button
                        className="absolute top-3 right-3 text-xl hover:text-gray-700 bg-transparent rounded-full p-1 cursor-pointer"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Cerrar menú"
                    >
                        <IoClose />
                    </button>

                    <nav className="mt-8 space-y-4 text-base font-bold">
                        {isAuthenticated && (
                            <Link to="/perfil" className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>
                                <img
                                    src={getProfileImageUrl()}
                                    alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                                    className="rounded-full w-7 h-7 object-cover border border-gray-400"
                                />
                                {user && user.username ? `Mi Perfil (${user.username.charAt(0).toUpperCase() + user.username.slice(1)})` : "Mi Perfil"}
                            </Link>
                        )}
                        {!isAuthenticated && (
                            <Link to="/login" className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>
                                <LuUserRoundPlus className="text-lg" /> Iniciar Sesión / Registrarse
                            </Link>
                        )}

                        <Link to="/" className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
                        <Link to="/packs" className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Packs</Link>
                        <Link to="/tienda" className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Tienda</Link>
                        <Link to="/sobre-chibi" className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Sobre Chibi</Link>

                        <Link to="/carrito" className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 text-base transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>
                            <GrCart className="text-lg" /> Carrito
                            {cartCount > 0 && (
                                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 leading-none">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/favoritos" className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 text-base transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>
                            <IoHeart className="text-lg" /> Favoritos
                            {favoriteCount > 0 && (
                                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 leading-none">
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 text-base font-bold bg-transparent border-none cursor-pointer transition-colors duration-200"
                            >
                                <MdLogout className="text-lg" /> Cerrar Sesión
                            </button>
                        )}
                    </nav>

                    <div className="mt-8 text-xs text-gray-700 *:mb-3">
                        <h2 className="font-bold text-black mb-1">Contacto</h2>
                        <p className="mb-0.5">
                            <span className="mr-1">📞</span> +240 555 7667 14
                        </p>
                        <p className="mb-0.5">
                            <span className="mr-1">📍</span> Malabo, detrás del antiguo Ayuntamiento
                        </p>
                        <p>
                            <span className="mr-1">⏰</span> Lunes a Sábado - 8:00 - 17:00
                        </p>
                    </div>

                    <div className="mt-6">
                        <p className="font-bold mb-1 text-black">Síguenos</p>
                        <a
                            href="https://www.instagram.com/chibi_feelgood?igsh=MWVxdnBwb3lwYzA3Yg=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-600 flex items-center gap-2 py-1 px-2 transition-colors duration-200"
                        >
                            <FaInstagram className="text-lg" /> Instagram
                        </a>
                        <a
                            href="https://whatsapp.com/channel/0029VaDbgNUFXUujxd01Hk0a"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-500 flex items-center gap-2 py-1 px-2 transition-colors duration-200 mt-1"
                        >
                            <FaWhatsapp className="text-lg" /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;