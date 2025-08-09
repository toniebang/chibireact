import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartSection from '../components/CartSection';

const DEFAULT_AVATAR_URL =
  'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?b=1&s=170x170&k=20&c=etX0kpw1WQzw4bDY0xZ-rYg1PfzDaSJ3vrykAuh5tNs=';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('pedidos');
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirección a auth si no logueado
  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/auth');
  }, [loading, isAuthenticated, navigate]);

  const getProfileImageUrl = useCallback(
    () => user?.profile_picture || DEFAULT_AVATAR_URL,
    [user]
  );

  const tabs = useMemo(
    () => [
      { key: 'pedidos', label: 'Pedidos' },
      { key: 'carrito', label: 'Carrito' },
      { key: 'favoritos', label: 'Favoritos' },
    ],
    []
  );

  const onKeyDownTab = (e) => {
    const idx = tabs.findIndex(t => t.key === activeTab);
    if (idx < 0) return;
    if (e.key === 'ArrowRight') setActiveTab(tabs[(idx + 1) % tabs.length].key);
    if (e.key === 'ArrowLeft') setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].key);
  };

  // Secciones placeholder
  const PedidosSection = () => (
    <div className="bg-white border border-gray-200 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Mis Pedidos</h3>
      <p className="text-gray-600">Aquí se mostrará tu historial de pedidos.</p>
    </div>
  );

  const FavoritosSection = () => (
    <div className="bg-white border border-gray-200 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Mis Favoritos</h3>
      <p className="text-gray-600">Próximamente: tu lista de productos guardados.</p>
    </div>
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] flex items-center justify-center text-gray-500 mt-24">
          Cargando…
        </div>
        <Footer />
      </>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-6 mt-24 mb-16">
        {/* Card principal */}
        <section className="bg-white border border-gray-200 shadow-sm">
          {/* Encabezado de perfil */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:gap-6">
              <img
                src={getProfileImageUrl()}
                alt={user?.username ? `Foto de ${user.username}` : 'Foto de perfil'}
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-full border-4 border-chibi-green"
              />
              <div className="mt-4 md:mt-0">
                <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
                  {user?.username || 'Usuario'}
                </h1>
                <p className="text-gray-600">{user?.email || 'email@ejemplo.com'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Bienvenido a tu espacio personal de Chibi Market.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs estilo tienda */}
          <nav
            className="px-6 md:px-8 border-b border-gray-200 flex gap-2"
            role="tablist"
            aria-label="Secciones del perfil"
            onKeyDown={onKeyDownTab}
          >
            {tabs.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${t.key}`}
                  id={`tab-${t.key}`}
                  onClick={() => setActiveTab(t.key)}
                  className={`-mb-px py-3 px-4 text-sm font-medium border-b-2 rounded-none transition-colors
                    ${active
                      ? 'border-chibi-green text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900'}
                  `}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>

          {/* Contenido tabs */}
          <div className="p-6 md:p-8" id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
            {activeTab === 'pedidos' && <PedidosSection />}
            {activeTab === 'carrito' && (
              <div className="bg-white">
                {/* CartSection ya trae su propio layout; lo envolvemos mínimo */}
                <CartSection />
              </div>
            )}
            {activeTab === 'favoritos' && <FavoritosSection />}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
