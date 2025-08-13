import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

const STORAGE_KEY = 'chibi_fav_ids';

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated, authAxios } = useAuth();
  const [favIds, setFavIds] = useState([]);

  // cargar
  useEffect(() => {
    const load = async () => {
      if (isAuthenticated) {
        try {
          const res = await authAxios.get('/favoritos/');
          // si la lista devuelve objetos {id, product:{id:..}} ajusta aquí:
          const ids = (res.data?.results || res.data || [])
            .map(f => f.product?.id ?? f.product); 
          setFavIds(ids);
        } catch {
          setFavIds([]);
        }
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          setFavIds(raw ? JSON.parse(raw) : []);
        } catch { setFavIds([]); }
      }
    };
    load();
  }, [isAuthenticated, authAxios]);

  // persistencia local para invitados
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favIds));
    }
  }, [favIds, isAuthenticated]);

  const isFavorite = useCallback((id) => favIds.includes(id), [favIds]);

  const toggleFavorite = useCallback(async (id) => {
    if (!isAuthenticated) {
      setFavIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
      return;
    }
    // autenticados: toggle en backend
    try {
      // si expusiste toggle como POST /favoritos/ con {product_id}
      await authAxios.post('/favoritos/', { product_id: id });
      setFavIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } catch (e) {
      // opcional: notificación de error
      console.error('toggleFavorite failed', e);
    }
  }, [isAuthenticated, authAxios]);

  const clearFavorites = useCallback(() => setFavIds([]), []);

  const value = useMemo(() => ({
    favIds,
    count: favIds.length,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  }), [favIds, isFavorite, toggleFavorite, clearFavorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
