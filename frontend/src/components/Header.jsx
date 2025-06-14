import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logochibi_blanco.png'; // Asegúrate de que esta ruta a tu logo sea correcta
import { LuUserRoundPlus } from "react-icons/lu";
import { GrCart } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { ImUser } from "react-icons/im";

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Esto simula la autenticación. En un proyecto real, usarías un Contexto de Autenticación.
    const isAuthenticated = true; // Cámbialo a 'true' para probar el estado de usuario logeado
    const user = { username: "chibiUser", profile_picture: "" }; // Simula datos de usuario

    return (
        <div className='shadow-2xl-md font-poppins bg-black relative z-40'>
            <div className='max-w-7xl mx-auto'>
                <header className="flex justify-between items-center px-4 md:px-10 text-white p-3">
                    {/* Logo - Link a la página de inicio */}
                    <Link to="/">
                        <img src={logo} alt="logo" width={180} className="md:w-[230px]" />
                    </Link>

                    {/* Menú de navegación tradicional para pantallas grandes (desktop) */}
                    {/* Será ocultado en móviles y visible en 'md' y más grandes */}
                    <nav className="hidden md:flex items-center text-sm space-x-6 lg:space-x-8">
                        <Link to="/" className="hover:underline hover:text-chibi-green">Inicio</Link>
                        <Link to="/packs" className="hover:underline hover:text-chibi-green">Packs</Link>
                        <Link to="/tienda" className="hover:underline hover:text-chibi-green">Tienda</Link>
                        <Link to="/sobre-chibi" className="hover:underline hover:text-chibi-green">Sobre Chibi</Link>
                        
                        {/* Iconos de carrito y usuario */}
                        <Link to="/carrito" className="hover:text-chibi-green text-lg"><GrCart /></Link>
                        
                        {isAuthenticated ? (
                            user?.profile_picture ? (
                                <Link to="/perfil" className="hover:text-chibi-green">
                                    <img
                                        src={user.profile_picture}
                                        alt="Foto de perfil"
                                        className="rounded-full w-7 h-7 object-cover cursor-pointer"
                                    />
                                </Link>
                            ) : (
                                <Link to="/perfil" className="hover:text-chibi-green flex gap-1 items-center">
                                    <ImUser className="text-xl font-extralight" />
                                    <p className="text-xs">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</p>
                                </Link>
                            )
                        ) : (
                            <Link to="/login" className="hover:text-chibi-green text-lg">
                                <LuUserRoundPlus title="Iniciar sesión o registrarse" />
                            </Link>
                        )}
                    </nav>

                    {/* Icono de hamburguesa - SIEMPRE VISIBLE */}
                    {/* Ahora está en la parte derecha de la cabecera, junto con el navbar tradicional en desktop */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white text-xl md:text-xl ml-4 md:ml-0 cursor-pointer" // Añadimos un margen en móviles para separarlo, y lo quitamos en md (desktop)
                        aria-label="Abrir menú"
                    >
                        <GiHamburgerMenu />
                    </button>
                </header>
            </div>

            {/* Sidebar deslizable (funcional en todas las resoluciones) */}
            <div
                className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Overlay oscuro que cubre el resto de la pantalla al abrir el sidebar */}
                {isSidebarOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Contenido del sidebar */}
                <div className="absolute right-0 bg-gray-900 w-64 xs:w-72 sm:w-80 h-full shadow-lg p-6 z-50 overflow-y-auto text-white">
                    {/* Botón para cerrar el sidebar */}
                    <button
                        className="absolute top-4 right-4 text-3xl hover:text-chibi-green bg-transparent rounded-full p-1"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Cerrar menú"
                    >
                        <IoClose />
                    </button>

                    <nav className="mt-12 space-y-6 text-l font-bold">
                        {/* Elementos de navegación del sidebar */}
                        <Link to="/" className="block hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
                        <Link to="/packs" className="block hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>Packs</Link>
                        <Link to="/tienda" className="block hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>Tienda</Link>
                        <Link to="/sobre-chibi" className="block hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>Sobre Chibi</Link>
                        
                        {/* Iconos de carrito y usuario en el sidebar */}
                        <Link to="/carrito" className="flex items-center gap-2 hover:text-chibi-green text-lg" onClick={() => setIsSidebarOpen(false)}>
                            <GrCart /> Carrito
                        </Link>

                        {isAuthenticated ? (
                            user?.profile_picture ? (
                                <Link to="/perfil" className="flex items-center gap-2 hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>
                                    <img
                                        src={user.profile_picture}
                                        alt="Foto de perfil"
                                        className="rounded-full w-7 h-7 object-cover"
                                    /> Mi Perfil
                                </Link>
                            ) : (
                                <Link to="/perfil" className="flex items-center gap-2 hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>
                                    <ImUser className="text-xl" /> Mi Perfil
                                </Link>
                            )
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>
                                <LuUserRoundPlus className="text-xl" /> Iniciar Sesión / Registrarse
                            </Link>
                        )}
                    </nav>

                    {/* Información de Contacto (usando emojis como placeholders) */}
                    <div className="mt-16 text-sm text-gray-300">
                        <h2 className="font-bold text-white mb-2">Contacto</h2>
                        <p className="mb-1">
                            <span className="mr-2">📞</span> +240 555 7667 14
                        </p>
                        <p>
                            <span className="mr-2">⏰</span> Lunes a Sábado - 8:00 - 17:00
                        </p>
                    </div>

                    {/* Redes Sociales (usando emoji como placeholder) */}
                    <div className="mt-10">
                        <p className="font-bold mb-2 text-white">Síguenos</p>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-400 flex items-center gap-2"
                        >
                            <span className="mr-2">📸</span> Instagram
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;