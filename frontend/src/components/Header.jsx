// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoMobile from '../assets/logochibi_negro.png';
import logoDesktop from '../assets/logochibi_blanco.png';

import { LuUserRoundPlus } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";

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

  // throttle con rAF
  const rAF = useRef(null);
  useEffect(() => {
    const evaluateHeaderSolid = () => {
      const isHome = location.pathname === '/';
      const isDesktop = window.innerWidth >= 768;
      const scrolled = window.scrollY > 60;
      // Forzamos sólido si NO es home, si hay scroll en home desktop, o si el sidebar está abierto
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

  // Bloquear scroll de body cuando el sidebar está abierto (mobile)
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
}
  const getProfileImageUrl = () => user?.profile_picture || DEFAULT_AVATAR_URL;

  const isActive = (path) =>
    location.pathname === path
      ? 'underline underline-offset-4'
      : 'hover:text-gray-400 hover:underline underline-offset-4';

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
              width={160}
              className="hidden md:block h-auto md:w-[160px]"
            />
          </Link>

          <nav
            className="hidden md:flex items-center text-sm font-medium space-x-4 lg:space-x-6"
            role="navigation"
            aria-label="Principal"
          >
            <Link to="/" className={`px-2 py-1 transition-colors duration-200 ${isActive('/')}`}>Inicio</Link>
            <Link to="/packs" className={`px-2 py-1 transition-colors duration-200 ${isActive('/packs')}`}>Packs</Link>
            <Link to="/tienda" className={`px-2 py-1 transition-colors duration-200 ${isActive('/tienda')}`}>Tienda</Link>
            <Link to="/sobre-chibi" className={`px-2 py-1 transition-colors duration-200 ${isActive('/sobre-chibi')}`}>Sobre Chibi</Link>

            {isAuthenticated && user?.is_superuser && (
              <Link to="/edit" className={`px-2 py-1 transition-colors duration-200 ${isActive('/edit')}`}>
                Subir Productos
              </Link>
            )}

            {/* Carrito (Desktop) */}
            <Link to="/carrito" className="relative p-2 text-2xl transition-colors duration-200 hover:text-gray-400" title="Ver Carrito" aria-label={`Carrito (${cartItemCount})`}>
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

            <Link to="/favoritos" className="relative p-2 text-2xl transition-colors duration-200 hover:text-gray-400" title="Ver Favoritos" aria-label={`Favoritos (${favoriteCount})`}>
              <IoMdHeartEmpty />
              {/* Muestra badge si quieres: descomentado en mobile abajo */}
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
              <Link to="/login" className="p-2 hover:text-gray-400 text-2xl transition-colors duration-200" title="Iniciar sesión o registrarse" aria-label="Iniciar sesión o registrarse">
                <LuUserRoundPlus />
              </Link>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 flex items-center text-white hover:text-gray-400 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <MdLogout className="text-xl" />
              </button>
            )}
          </nav>

          {/* Acciones / Mobile */}
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
              <IoMdHeartEmpty />
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

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-white/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          id="mobile-sidebar"
          className="absolute right-0 bg-white w-60 xs:w-64 sm:w-72 h-full shadow-lg p-3 z-50 overflow-y-auto text-black"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <button
            type="button"
            className="absolute top-3 right-3 text-xl hover:text-gray-700 bg-transparent rounded-full p-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/60"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <IoClose />
          </button>

          <nav className="mt-8 space-y-4 text-base font-bold" aria-label="Menú móvil">
            {isAuthenticated && (
              <Link
                to="/perfil"
                className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                <img
                  src={getProfileImageUrl()}
                  alt={user?.username ? `Foto de perfil de ${user.username}` : "Foto de perfil por defecto"}
                  className="rounded-full w-7 h-7 object-cover border border-gray-400"
                />
                {user && user.username ? `Mi Perfil (${user.username.charAt(0).toUpperCase() + user.username.slice(1)})` : "Mi Perfil"}
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                <LuUserRoundPlus className="text-lg" /> Iniciar Sesión / Registrarse
              </Link>
            )}

            <Link to="/" className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
            <Link to="/packs" className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Packs</Link>
            <Link to="/tienda" className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Tienda</Link>
            <Link to="/sobre-chibi" className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)}>Sobre Chibi</Link>

            {isAuthenticated && user?.is_superuser && (
              <Link
                to="/edit"
                className="block py-1 px-2 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                Subir Productos
              </Link>
            )}

            <Link
              to="/carrito"
              className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 text-base transition-colors duration-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiShoppingCart className="text-lg" /> Carrito
              {cartItemCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 leading-none">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              to="/favoritos"
              className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 text-base transition-colors duration-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <IoMdHeartEmpty className="text-lg" /> Favoritos
              {favoriteCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 leading-none">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 py-1 px-2 hover:text-gray-700 text-base font-bold bg-transparent border-none cursor-pointer transition-colors duration-200"
              >
                <MdLogout className="text-lg" /> Cerrar Sesión
              </button>
            )}
          </nav>

          <div className="mt-8 text-sm text-gray-700">
            <h2 className="font-bold text-black mb-1">Contacto</h2>
            <p className="mb-0.5">
              <span className="mr-1">📞</span> +240 555 3082 50
            </p>
            <p className="mb-0.5">
              <span className="mr-1">📍</span> Calle Kenya, detrás del antiguo Ayuntamiento. Al lado de Hotel Annobon
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
};

export default Header;
