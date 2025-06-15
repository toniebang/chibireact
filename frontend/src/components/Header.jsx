import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logochibi_blanco.png';
import { LuUserRoundPlus } from "react-icons/lu";
import { GrCart } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { ImUser } from "react-icons/im";

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isAuthenticated = true; 
    const user = { username: "chibiUser", profile_picture: "" };

    return (
        <div className='shadow-2xl-md bg-black fixed top-0 left-0 right-0 z-40'>
            <div className='max-w-7xl mx-auto'>
                {/* Reducido el padding vertical de 'p-3' a 'p-2' */}
                <header className="flex justify-between items-center px-4 md:px-10 text-white p-2"> 
                    <Link to="/">
                        {/* Reducido el 'width' del logo de '180' a '150' y 'md:w-[230px]' a 'md:w-[180px]' */}
                        <img src={logo} alt="logo" width={150} className="md:w-[180px]" /> 
                    </Link>

                    {/* Reducido 'text-sm' a 'text-xs' y 'space-x-6 lg:space-x-8' a 'space-x-4 lg:space-x-6' */}
                    <nav className="hidden md:flex items-center text-xs space-x-4 lg:space-x-6">
                        <Link to="/" className="hover:underline hover:text-chibi-green">Inicio</Link>
                        <Link to="/packs" className="hover:underline hover:text-chibi-green">Packs</Link>
                        <Link to="/tienda" className="hover:underline hover:text-chibi-green">Tienda</Link>
                        <Link to="/sobre-chibi" className="hover:underline hover:text-chibi-green">Sobre Chibi</Link>
                        
                        <Link to="/carrito" className="hover:text-chibi-green text-base"><GrCart /></Link> {/* Ajustado a 'text-base' */}
                        
                        {isAuthenticated ? (
                            user?.profile_picture ? (
                                <Link to="/perfil" className="hover:text-chibi-green">
                                    <img
                                        src={user.profile_picture}
                                        alt="Foto de perfil"
                                        className="rounded-full w-6 h-6 object-cover cursor-pointer" // Reducido a 'w-6 h-6'
                                    />
                                </Link>
                            ) : (
                                <Link to="/perfil" className="hover:text-chibi-green flex gap-1 items-center">
                                    <ImUser className="text-base font-extralight" /> {/* Ajustado a 'text-base' */}
                                    <p className="text-xs">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</p>
                                </Link>
                            )
                        ) : (
                            <Link to="/login" className="hover:text-chibi-green text-base"> {/* Ajustado a 'text-base' */}
                                <LuUserRoundPlus title="Iniciar sesión o registrarse" />
                            </Link>
                        )}
                    </nav>

                    {/* Reducido 'text-xl md:text-xl' a 'text-lg md:text-lg' */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white text-lg md:text-lg ml-4 md:ml-0 cursor-pointer"
                        aria-label="Abrir menú"
                    >
                        <GiHamburgerMenu />
                    </button>
                </header>
            </div>

            {/* Sidebar (mantendrá su tamaño) */}
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

                <div className="absolute right-0 bg-black w-64 xs:w-72 sm:w-80 h-full shadow-lg p-6 z-50 overflow-y-auto text-white">
                    <button
                        className="absolute cursor-pointer top-4 right-4 text-3xl hover:text-chibi-green bg-transparent rounded-full p-1"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Cerrar menú"
                    >
                        <IoClose />
                    </button>

                    <nav className="mt-12 space-y-6 text-l font-bold">
                        <Link to="/" className="block hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
                        <Link to="/packs" className="block hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>Packs</Link>
                        <Link to="/tienda" className="block hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>Tienda</Link>
                        <Link to="/sobre-chibi" className="block hover:text-chibi-green" onClick={() => setIsSidebarOpen(false)}>Sobre Chibi</Link>
                        
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

                    <div className="mt-16 text-sm text-gray-300">
                        <h2 className="font-bold text-white mb-2">Contacto</h2>
                        <p className="mb-1">
                            <span className="mr-2">📞</span> +240 555 7667 14
                        </p>
                        <p>
                            <span className="mr-2">⏰</span> Lunes a Sábado - 8:00 - 17:00
                        </p>
                    </div>

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