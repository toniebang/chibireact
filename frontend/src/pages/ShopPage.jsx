// src/pages/ShopPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ProductList from '../components/ProductList';
import FilterBarModern from '../components/FilterBarModern';
import PaginationClassic from '../components/PaginationClassic';
import { useAuth } from '../context/AuthContext';

import ShopHero from '../components/ShopHero';
import CategoryIcons from '../components/CategoryIcons';

import heroImg2 from '../assets/shopherobg5.jpg';

const PAGE_SIZE = 16;

// limpia params
const buildParams = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== '' && v !== false && v !== null)
  );

const ShopPage = () => {
  const { authAxios } = useAuth();

  // UI / filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [committedSearch, setCommittedSearch] = useState('');
  const [onOffer, setOnOffer] = useState(false);
  const [category, setCategory] = useState('');
  const [sortKey, setSortKey] = useState('relevance');
  const [page, setPage] = useState(1);

  // 🔹 NUEVO: línea
  const [line, setLine] = useState('');

  // Data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [pageSize] = useState(PAGE_SIZE);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ordering param
  const ordering = useMemo(() => {
    switch (sortKey) {
      case 'price_asc': return 'precio';
      case 'price_desc': return '-precio';
      case 'date_desc': return '-fecha_subida';
      default: return undefined;
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
      } catch {}
    })();
    return () => { alive = false; };
  }, [authAxios]);

  // Debounce de texto
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch sugerencias
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

  // Fetch productos
  const fetchProducts = async (targetPage = 1, opts = {}) => {
    const forceId = opts.forceId ?? selectedId ?? null;
    setLoading(true);
    setError('');
    try {
      if (forceId) {
        const res = await authAxios.get(`/productos/${forceId}/`);
        const item = res.data ? [res.data] : [];
        setProducts(item);
        setCount(item.length);
        setNextUrl(null);
        setPrevUrl(null);
        setPage(1);
        return;
      }

      const safeOrdering = ['precio', '-precio', '-fecha_subida', 'nombre', '-nombre'];
      const orderingParam = safeOrdering.includes(ordering) ? ordering : undefined;

      const effectiveLine = line === 'todo' ? '' : line;
      const params = buildParams({
        search: committedSearch || undefined,
        categoria: category || undefined,
        oferta: onOffer || undefined,
        page: targetPage,
        ordering: orderingParam,
        page_size: pageSize || PAGE_SIZE,
        linea: effectiveLine || undefined,
      });

      const res = await authAxios.get('/productos/', { params });
      const { results = [], count = 0, next = null, previous = null } = res.data || {};
      setProducts(results);
      setCount(count);
      setNextUrl(next);
      setPrevUrl(previous);
      setPage(targetPage);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los productos.');
      setProducts([]);
      setCount(0);
      setNextUrl(null);
      setPrevUrl(null);
    } finally {
      setLoading(false);
    }
  };

  // Refetch al cambiar filtros/orden/búsqueda/line
  useEffect(() => {
    if (selectedId) return;
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committedSearch, onOffer, category, ordering, line]);

  // 🔹 Scroll al top siempre que cambie page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil((count || 0) / (pageSize || PAGE_SIZE)));
  const goToPage = (p) => {
    if (p < 1 || p > totalPages || loading) return;
    fetchProducts(p);
  };

  // Autocomplete handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setShowSuggestions(true);
    setSelectedId(null);
  };

  const handleSelectSuggestion = (item) => {
    setSearchTerm(item.nombre);
    setCommittedSearch(item.nombre);
    setSelectedId(item.id);
    setShowSuggestions(false);
    fetchProducts(1, { forceId: item.id });
  };

  const handleSearchSubmit = () => {
    const term = searchTerm.trim();
    setCommittedSearch(term);
    setSelectedId(null);
    setShowSuggestions(false);
    fetchProducts(1, { forceId: null });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCommittedSearch('');
    setOnOffer(false);
    setCategory('');
    setSortKey('relevance');
    setSelectedId(null);
    setPage(1);
    setSuggestions([]);
    setShowSuggestions(false);
    setLine('');
    fetchProducts(1, { forceId: null });
  };

  const selectLine = (lineId) => {
    const normalized = lineId === 'todo' ? '' : lineId;
    setLine(normalized);
    setSelectedId(null);
    setPage(1);
    setProducts([]);
    setCount(0);
  };

  return (
    <>
      <Header />

      <ShopHero
        backgroundImage={heroImg2}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        loadingSuggestions={loadingSuggestions}
        onSelectSuggestion={handleSelectSuggestion}
        hideSuggestions={() => setShowSuggestions(false)}
      />

      <CategoryIcons selected={line} onSelect={selectLine} />

      <div className="max-w-7xl mx-auto font-montserrat px-4 md:px-6">
        <FilterBarModern
          categories={categories}
          hasActiveSearch={Boolean(searchTerm.trim())}
          category={category}
          setCategory={(v) => {
            setCategory(v);
            setPage(1);
            setSelectedId(null);
          }}
          onOffer={onOffer}
          setOnOffer={(v) => {
            setOnOffer(v);
            setPage(1);
            setSelectedId(null);
          }}
          sortKey={sortKey}
          setSortKey={(v) => {
            setSortKey(v);
            setPage(1);
            setSelectedId(null);
          }}
          loading={loading}
          onClearFilters={handleClearFilters}
        />

        {(committedSearch || line) && !selectedId && (
          <div className="mt-4 text-sm text-gray-600">
            {loading
              ? "Cargando…"
              : `${count} producto${count === 1 ? "" : "s"} encontrados`}
          </div>
        )}

        <div className="mt-3">
          <ProductList
            products={products}
            isHome={false}
            gridColumns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            loading={loading}
            error={error}
            activeLine={line}
            onClearFilter={() => selectLine("todo")}
          />
        </div>

        {!selectedId && (
          <div className="mt-10 px-8 mb-6 flex items-center justify-between">
            <PaginationClassic
              page={page}
              totalPages={totalPages}
              hasPrev={Boolean(prevUrl)}
              hasNext={Boolean(nextUrl)}
              onPageChange={goToPage}
            />
            <div className="text-sm text-gray-600 whitespace-nowrap flex-shrink-0">
              Página <span className="font-medium text-gray-800">{page}</span>{" "}
              de <span className="font-medium text-gray-800">{totalPages}</span>
            </div>
          </div>
        )}
      </div>

      <ScrollToTopButton />
      <Footer />
    </>
  );
};

export default ShopPage;
