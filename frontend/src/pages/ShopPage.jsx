// src/pages/ShopPage.jsx
import React, { useEffect, useMemo, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ProductList from '../components/ProductList';
import FilterBarModern from '../components/FilterBarModern';
import PaginationClassic from '../components/PaginationClassic';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 16;

// limpia params
const buildParams = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== '' && v !== false && v !== null)
  );

const ShopPage = () => {
  const { authAxios } = useAuth();

  // UI
  const [searchTerm, setSearchTerm] = useState('');
  const [committedSearch, setCommittedSearch] = useState('');
  const [onOffer, setOnOffer] = useState(false);
  const [category, setCategory] = useState('');
  const [sortKey, setSortKey] = useState('relevance');
  const [page, setPage] = useState(1);

  // Data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [pageSize] = useState(PAGE_SIZE);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sugerencias
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Para cancelar resultados viejos
  const lastReqId = useRef(0);

  // ordering param
  const ordering = useMemo(() => {
    switch (sortKey) {
      case 'price_asc':  return 'precio';
      case 'price_desc': return '-precio';
      case 'date_desc':  return '-fecha_subida';
      default:           return undefined;
    }
  }, [sortKey]);

  // Cargar categorías
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await authAxios.get('/categorias/');
        if (!alive) return;
        setCategories(res.data?.results || []);
      } catch { /* noop */ }
    })();
    return () => { alive = false; };
  }, [authAxios]);

  // Debounce de texto (para sugerencias)
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch sugerencias (no cambia la grilla)
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      if (debouncedSearch.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const params = buildParams({
          search: debouncedSearch,
          page: 1,
          page_size: 8,
        });
        const res = await authAxios.get('/productos/', { params, signal: controller.signal });
        const list = (res.data?.results || []).map(p => ({
          id: p.id,
          nombre: p.nombre,
          thumb: p.imagen1 || p.imagen2 || p.imagen3 || '',
        }));
        setSuggestions(list);
        setShowSuggestions(true);
      } catch (e) {
        if (e.name !== 'CanceledError') {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        setLoadingSuggestions(false);
      }
    };
    run();
    return () => controller.abort();
  }, [authAxios, debouncedSearch]);

  // Fetch productos (lista normal)
  const fetchProducts = async (targetPage = 1, overrideSearch) => {
    const reqId = ++lastReqId.current;
    setLoading(true);
    setError('');
    try {
      const params = buildParams({
        search: (overrideSearch ?? committedSearch) || undefined,
        categoria: category || undefined,
        oferta: onOffer || undefined,
        ordering,
        page: targetPage,
        page_size: pageSize || PAGE_SIZE,
      });

      const res = await authAxios.get('/productos/', { params });
      if (reqId !== lastReqId.current) return;

      const { results = [], count = 0, next = null, previous = null } = res.data || {};
      setProducts(results);
      setCount(count);
      setNextUrl(next);
      setPrevUrl(previous);
      setPage(targetPage);
      if (targetPage !== page) window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (reqId !== lastReqId.current) return;
      console.error(err);
      setError('No se pudieron cargar los productos.');
      setProducts([]);
      setCount(0);
      setNextUrl(null);
      setPrevUrl(null);
    } finally {
      if (reqId === lastReqId.current) setLoading(false);
    }
  };

  // 🚀 Fetch producto exacto por ID (cuando seleccionas de la lista)
  const fetchProductById = async (id) => {
    const reqId = ++lastReqId.current;
    setLoading(true);
    setError('');

    try {
      const res = await authAxios.get(`/productos/${id}/`);
      if (reqId !== lastReqId.current) return;

      const prod = res.data;
      setProducts(prod ? [prod] : []);
      setCount(prod ? 1 : 0);
      setNextUrl(null);
      setPrevUrl(null);
      setPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (reqId !== lastReqId.current) return;
      console.error(err);
      setError('No se pudo cargar el producto seleccionado.');
      setProducts([]);
      setCount(0);
      setNextUrl(null);
      setPrevUrl(null);
    } finally {
      if (reqId === lastReqId.current) setLoading(false);
    }
  };

  // Refetch al cambiar filtros/orden/búsqueda comprometida
  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committedSearch, onOffer, category, ordering]);

  const totalPages = Math.max(1, Math.ceil((count || 0) / (pageSize || PAGE_SIZE)));
  const goToPage = (p) => {
    if (p < 1 || p > totalPages || loading) return;
    fetchProducts(p);
  };

  // Handlers de búsqueda
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setShowSuggestions(true);
  };

  // 🔥 Selección desde autocompletado → cargar por ID (exacto)
  const handleSelectSuggestion = (item) => {
    setSearchTerm(item.nombre);
    setCommittedSearch(item.nombre); // solo para mostrar el término/contador
    setCategory('');
    setOnOffer(false);
    setSortKey('relevance');
    setShowSuggestions(false);

    fetchProductById(item.id);
  };

  // Enter → búsqueda por texto normal (pueden salir varios)
  const handleSearchSubmit = () => {
    const term = searchTerm.trim();
    setCommittedSearch(term);
    setCategory('');
    setOnOffer(false);
    setSortKey('relevance');
    setShowSuggestions(false);
    fetchProducts(1, term);
  };

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-24">
        <FilterBarModern
          categories={categories}
          // Search controlado
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          // Autocomplete
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          loadingSuggestions={loadingSuggestions}
          onSelectSuggestion={handleSelectSuggestion}
          hideSuggestions={() => setShowSuggestions(false)}
          // Filtros
          category={category}
          setCategory={(v) => { setCategory(v); setPage(1); }}
          onOffer={onOffer}
          setOnOffer={(v) => { setOnOffer(v); setPage(1); }}
          sortKey={sortKey}
          setSortKey={(v) => { setSortKey(v); setPage(1); }}
          loading={loading}
        />

        {committedSearch && (
          <div className="mt-4 text-sm text-gray-600">
            {loading ? 'Cargando…' : `${count} producto${count === 1 ? '' : 's'} encontrados`}
          </div>
        )}

        <div className="mt-3">
          <ProductList
            products={products}
            isHome={false}
            gridColumns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            loading={loading}
            error={error}
          />
        </div>

        <div className="mt-10 mb-6 px-6 flex items-center justify-between">
          <PaginationClassic
            page={page}
            totalPages={totalPages}
            hasPrev={Boolean(prevUrl)}
            hasNext={Boolean(nextUrl)}
            onPageChange={goToPage}
          />
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Página <span className="font-medium text-gray-800">{page}</span> de{' '}
            <span className="font-medium text-gray-800">{totalPages}</span>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
      <Footer />
    </>
  );
};

export default ShopPage;
