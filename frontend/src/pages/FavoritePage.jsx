// src/pages/FavoritesPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const FavoritesPage = () => {
  const { favIds, count } = useFavorites();
  const { isAuthenticated, authAxios } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const fetchFavProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    setProducts([]);

    try {
      // Si no hay favoritos:
      if (!favIds || favIds.length === 0) {
        setProducts([]);
        return;
      }

      // Intento 1 (autenticado): pedir a /favoritos/ y extraer productos
      if (isAuthenticated) {
        try {
          const res = await authAxios.get('/favoritos/');
          // backend puede devolver: { results: [{product: {...}}] } o [{product: {...}}]
          const list = (res.data?.results ?? res.data ?? [])
            .map(item => item.product || item) // si ya viene el producto directo
            .filter(p => p && p.id);           // limpia nulos
          if (list.length > 0) {
            setProducts(list);
            return;
          }
          // Si no trajo objetos producto, caemos al Intento 2
        } catch (_) {
          // cae al intento 2
        }
      }

      // Intento 2 (fallback): pedir cada producto por id
      const requests = favIds.map(id => authAxios.get(`/productos/${id}/`).then(r => r.data).catch(() => null));
      const fetched = await Promise.all(requests);
      setProducts(fetched.filter(Boolean));
    } catch (e) {
      console.error('Error cargando favoritos:', e);
      setError('No se pudieron cargar tus productos favoritos.');
    } finally {
      setLoading(false);
    }
  }, [favIds, isAuthenticated, authAxios]);

  useEffect(() => {
    fetchFavProducts();
  }, [fetchFavProducts]);

  return (
    <>
      <Header />

      <main className="max-w-7xl font-montserrat mx-auto px-4 md:px-6 mt-24">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
            Mis favoritos
          </h1>
          {count > 0 && (
            <span className="text-sm text-gray-600">
              {count} producto{count === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {/* Estados */}
        {loading && (
          <div className="py-16 text-center text-gray-500">Cargando favoritos…</div>
        )}
        {error && !loading && (
          <div className="py-6 text-center text-red-600">{error}</div>
        )}

        {/* Contenido */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-700 mb-4">
                  Aún no tienes productos en favoritos.
                </p>
                <Link
                  to="/tienda"
                  className="inline-block bg-chibi-green text-white px-5 py-3 hover:bg-chibi-green-dark rounded-none"
                >
                  Ir a la tienda
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <ProductList
                  products={products}
                  isHome={false}
                  gridColumns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  loading={false}
                  error={null}
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default FavoritesPage;
