// src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export default function ProductProvider({ children }) {
  const { authAxios } = useAuth(); // usa la instancia común
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0); // por si lo necesitas luego
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Defaults para la home
  const DEFAULT_PAGE_SIZE = 16;
  const DEFAULT_ORDERING = '-fecha_subida';

  const fetchProducts = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const finalParams = {
          page: 1,
          page_size: DEFAULT_PAGE_SIZE,
          ordering: DEFAULT_ORDERING,
          ...params, // permite override (e.g. page_size: 4 para una sección puntual)
        };

        const res = await authAxios.get('/productos/', { params: finalParams });
        const data = res.data || {};
        const list = Array.isArray(data) ? data : data.results || [];

        setProducts(list);
        setCount(data.count ?? list.length);
        // console.log('[ProductContext] fetched:', { len: list.length, count: data.count, finalParams });
      } catch (err) {
        console.error('[ProductContext] error:', err);
        setError('No se pudieron cargar los productos.');
        setProducts([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    },
    [authAxios]
  );

  useEffect(() => {
    // carga inicial para la Home
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    count,
    loading,
    error,
    fetchProducts, // por si lo reutilizas en otra vista
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  return ctx;
};
