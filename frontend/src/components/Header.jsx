import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoMobile from '../assets/logochibi_negro.png';
import logoDesktop from '../assets/logochibi_blanco.png';

import { LuUserRoundPlus } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { useFavorites } from '../context/FavoritesContext';
import { MdLogout } from "react-icons/md";
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const DEFAULT_AVATAR_URL = "https://thumb.ac-illust.com/51/51e1c1fc6f50743937e62fca9b942694_t.jpeg";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const [isHeaderSolid, setIsHeaderSolid] = useState(false);
  const location = useLocation();

  const cartItemCount = cart?.total_items || 0;
  const { count: favoriteCount } = useFavorites();

  const rAF = useRef(null);
  useEffect(() => {
    const evaluateHeaderSolid = () => {
      const isHome = location.pathname === '/';
      const isDesktop = window.innerWidth >= 768;
      const scrolled = window.scrollY > 60;
      const solid =
        (!isHome) || (isHome && isDesktop && scrolled) || isSidebarOpen;
      setIsHeaderSolid(solid);
    };

    const onScrollResize = () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
      rAF.current = requestAnimationFrame(evaluateHeaderSolid);
    };

    window.addEventListener('scroll', onScrollResize, { passive: true });
    window.addEventListener('resize', onScrollResize);
    evaluateHeaderSolid();

    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
      window.removeEventListener('scroll', onScrollResize);
      window.removeEventListener('resize', onScrollResize);
    };
  }, [location.pathname, isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen]);

  const handleLogout = () => {
    const ok = window.confirm('¿Seguro que quieres cerrar sesión?');
    if (!ok) return;
    logout();
    setIsSidebarOpen(false);
  };

  const getProfileImageUrl = () => user?.profile_picture || DEFAULT_AVATAR_URL;

  const isActive = (path) =>
    location.pathname === path
      ? ' text-chibi-green font-medium'
      : 'hover:text-gray-400 hover:underline underline-offset-4 ';

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-40 shadow-sm transition-all duration-300 ease-in-out
        bg-white ${isHeaderSolid ? 'md:bg-black' : 'md:bg-transparent'}
      `}
      role="banner"
    >
      <div className="max-w-7xl mx-auto font-montserrat">
        <header className="flex justify-between items-center px-4 md:px-6 text-black md:text-white py-0.5 md:py-1">
          <Link to="/" className="flex-shrink-0" aria-label="Ir a inicio">
            <img
              src={logoMobile}
              alt="Chibi Logo (Mobile)"
              width={70}
              className="md:hidden h-auto ml-2"
            />
            <img
              src={logoDesktop}
              alt="Chibi Logo (Desktop)"
              width={140}
              className="hidden md:block h-auto md:w-[140px]"
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center text-[13px] font-normal space-x-3 lg:space-x-5"
            role="navigation"
            aria-label="Principal"
          >
            <Link to="/" className={`px-1.5 py-0.5 transition-colors duration-200 ${isActive('/')}`}>Inicio</Link>
            <Link to="/packs" className={`px-1.5 py-0.5 transition-colors duration-200 ${isActive('/packs')}`}>Packs</Link>
            <Link to="/tienda" className={`px-1.5 py-0.5 transition-colors duration-200 ${isActive('/tienda')}`}>Tienda</Link>
            <Link to="/sobre-chibi" className={`px-1.5 py-0.5 transition-colors duration-200 ${isActive('/sobre-chibi')}`}>Sobre Chibi</Link>

            {isAuthenticated && user?.is_superuser && (
              <Link to="/edit" className={`px-1.5 py-0.5 transition-colors duration-200 ${isActive('/edit')}`}>
                Subir Productos
              </Link>
            )}

            {/* Carrito */}
            <Link to="/carrito" className="relative p-1.5 text-lg transition-colors duration-200 hover:text-gray-400" title="Ver Carrito" aria-label={`Carrito (${cartItemCount})`}>
              <FiShoppingCart />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[1rem] px-1 flex items-center justify-center leading-none"
                  aria-live="polite"
                >
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Favoritos */}
            <Link to="/favoritos" className="relative p-1.5 text-lg transition-colors duration-200 hover:text-gray-400" title="Ver Favoritos" aria-label={`Favoritos (${favoriteCount})`}>
                <FaRegHeart />
            </Link>

            {isAuthenticated ? (
              <Link to="/perfil" className="p-1.5 hover:text-gray-400 flex items-center transition-colors duration-200" title="Mi Perfil">
                <img
                  src={getProfileImageUrl()}
                  alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                  className="rounded-full w-6 h-6 object-cover border border-gray-400"
                />
                {user?.username && (
                  <span className="text-[13px] ml-1.5 font-normal">
                    {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                  </span>
                )}
              </Link>
            ) : (
              <Link to="/login" className="p-1.5 hover:text-gray-400 text-lg transition-colors duration-200" title="Iniciar sesión o registrarse" aria-label="Iniciar sesión o registrarse">
                <LuUserRoundPlus />
              </Link>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 flex items-center text-white hover:text-gray-400 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <MdLogout className="text-base" />
              </button>
            )}
          </nav>

          {/* Mobile actions (sin cambios) */}
          <div className="flex items-center gap-3 md:hidden">
            <Link to="/carrito" className="relative p-1.5 text-xl hover:text-gray-700 transition-colors duration-200" title="Ver Carrito" aria-label={`Carrito (${cartItemCount})`}>
              <FiShoppingCart />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 min-w-[1rem] px-1 flex items-center justify-center leading-none"
                  aria-live="polite"
                >
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link to="/favoritos" className="relative p-1.5 text-xl hover:text-gray-700 transition-colors duration-200" title="Ver Favoritos" aria-label={`Favoritos (${favoriteCount})`}>
                <FaRegHeart />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 min-w-[1rem] px-1 flex items-center justify-center leading-none">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link to="/perfil" className="p-1.5 hover:text-gray-700 flex items-center transition-colors duration-200" title="Mi Perfil" aria-label="Mi Perfil">
                <img
                  src={getProfileImageUrl()}
                  alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                  className="rounded-full w-6 h-6 object-cover border border-gray-400"
                />
              </Link>
            ) : (
              <Link to="/login" className="p-1.5 hover:text-gray-700 text-xl transition-colors duration-200" title="Iniciar sesión o registrarse" aria-label="Iniciar sesión o registrarse">
                <LuUserRoundPlus />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="text-black text-2xl cursor-pointer p-1.5 focus:outline-none focus:ring-2 focus:ring-black/60 rounded-md"
              aria-label="Abrir menú"
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-sidebar"
            >
              <GiHamburgerMenu />
            </button>
          </div>
        </header>
      </div>

      {/* Sidebar Overlay (sin cambios) */}
      {/* ... resto del sidebar ... */}
    </div>
  );
};

export default Header;
